import express from 'express';
import { db } from '../../db.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();

// ES module path helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// UPLOAD PATH - store ranking PDFs in the frontend uploads folder
// (project root)/uploads/ranking-data
const uploadFolder = path.join(__dirname, "../../../uploads/ranking-data");
fs.mkdirSync(uploadFolder, { recursive: true });

console.log('📁 Upload folder path:', uploadFolder);
console.log('📁 Upload folder exists:', fs.existsSync(uploadFolder));

// Multer storage for ranking PDFs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = `${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    console.log('📄 Saving file as:', safeName);
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 400 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});



// REMOVE the static file serving from here since it's already in your main server
// Your main server already has: app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// GET /api/ranking-data - List all endpoints
router.get("/", (req, res) => {
  res.json({
    message: "Ranking Data API is working",
    baseUrl: `${req.protocol}://${req.get('host')}${req.baseUrl}`,
    staticFilesBase: `${req.protocol}://${req.get('host')}/uploads`,
    endpoints: {
      "POST /add-ranking-data": "Upload ranking data with PDF file",
      "GET /rankingssite": "Get all ranking data",
      "PUT /update-ranking-site/:id": "Update ranking data",
      "DELETE /delete-ranking-site/:id": "Delete ranking data",
      "GET /download/:filename": "Download PDF file",
      "GET /view/:filename": "View PDF file in browser",
      "GET /test-upload-dir": "Test upload directory"
    }
  });
});

// POST /add-ranking-data
router.post('/add-ranking-data', upload.single('file'), (req, res) => {
  try {
    const { rankingName, sdgNumber, criteriaName, question, year } = req.body;

    console.log('📥 Received data:', { rankingName, sdgNumber, criteriaName, question, year });
    
    // Validation
    if (!rankingName || !sdgNumber || !criteriaName || !question || !year) {
      return res.status(400).json({ 
        message: 'All fields are required: rankingName, sdgNumber, criteriaName, question, year' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'PDF file is required' });
    }

    console.log('📄 File uploaded:', {
      originalname: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      path: req.file.path
    });

    // Validate file was actually saved
    if (!fs.existsSync(req.file.path)) {
      console.error('❌ File was not saved to disk:', req.file.path);
      return res.status(500).json({ message: 'File storage failed' });
    }

    // CRITICAL: Use the correct file URL that matches your static file serving
    const fileInfo = {
      fileName: req.file.filename,
      fileUrl: `/uploads/ranking-data/${req.file.filename}`, // This matches your static config
      fileSize: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
      originalName: req.file.originalname
    };

    console.log('💾 File info for database:', fileInfo);

    // Note: some installations may not have an `original_file_name` column
    // in the `ranking_data` table. To remain compatible, we do NOT insert
    // that column here. If you want to preserve the original filename in
    // the database, add the column with:
    // ALTER TABLE ranking_data ADD COLUMN original_file_name VARCHAR(255) NULL;

    const sql = `
      INSERT INTO ranking_data 
      (ranking_name, sdg_number, criteria_name, question, file_name, file_url, file_size, upload_date, year, is_visible)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, 1)
    `;

    const params = [
      rankingName,
      parseInt(sdgNumber),
      criteriaName,
      question,
      fileInfo.fileName,
      fileInfo.fileUrl,
      fileInfo.fileSize,
      year
    ];

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('❌ Database insertion error:', err);
        
        // Delete the uploaded file if DB insertion failed
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        
        return res.status(500).json({ message: 'Database error: ' + err.message });
      }

      res.status(201).json({ 
        success: true,
        message: '✅ Ranking data added successfully',
        id: result.insertId,
        fileUrl: fileInfo.fileUrl
      });
    });

  } catch (error) {
    console.error('❌ Add ranking error:', error);
    
    // Clean up file if error occurred
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// GET /rankingssite
router.get('/rankingssite', (req, res) => {
  // Support optional visibility filter for public site consumption
  const onlyVisible = req.query.visible === '1' || String(req.query.visible).toLowerCase() === 'true';
  const sql = `SELECT * FROM ranking_data ${onlyVisible ? 'WHERE is_visible = 1' : ''} ORDER BY id DESC`;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error fetching rankings:', err);
      return res.status(500).json({ message: 'Error fetching rankings' });
    }

    const normalizedData = results.map((row) => {
      // Ensure file URLs are correct
      let fileUrl = row.file_url;
      if (!fileUrl || fileUrl.includes('...')) {
        fileUrl = `/uploads/ranking-data/${row.file_name}`;
      }

      return {
        id: String(row.id),
        rankingName: row.ranking_name || '',
        sdgNumber: Number(row.sdg_number) || 0,
        criteriaName: row.criteria_name || '',
        question: row.question || '',
        fileName: row.file_name || '',
        fileUrl: fileUrl,
        fileSize: row.file_size || '0 MB',
        uploadDate: row.upload_date ? new Date(row.upload_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        year: row.year || '2025',
        isVisible: Boolean(row.is_visible),
        originalFileName: row.original_file_name || row.file_name || ''
      };
    });

    res.status(200).json(normalizedData);
  });
});

// File download endpoint - FIXED to work with your static file setup
router.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadFolder, filename);
  
  console.log('📥 Download request for:', filename);
  console.log('📁 File path:', filePath);
  
  if (!fs.existsSync(filePath)) {
    console.error('❌ File not found for download:', filePath);
    console.log('📂 Available files:', fs.readdirSync(uploadFolder));
    
    return res.status(404).json({ 
      error: 'File not found',
      message: `File '${filename}' does not exist in upload directory`,
      filename: filename,
      requestedPath: filePath,
      availableFiles: fs.readdirSync(uploadFolder),
      staticUrl: `${req.protocol}://${req.get('host')}/uploads/ranking-data/${filename}`
    });
  }

  // Get original filename from database
  db.query('SELECT original_file_name FROM ranking_data WHERE file_name = ?', [filename], (err, results) => {
    let downloadName = filename;
    
    if (!err && results && results.length > 0 && results[0].original_file_name) {
      downloadName = results[0].original_file_name;
    } else {
      // Remove timestamp from filename
      if (filename.includes('-')) {
        downloadName = filename.split('-').slice(1).join('-');
      }
    }

    console.log('📤 Serving file download:', downloadName);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.on('error', (err) => {
      console.error('❌ File stream error:', err);
      res.status(500).json({ message: 'Error reading file' });
    });
    
    fileStream.pipe(res);
  });
});

// File view endpoint - FIXED to work with your static file setup
router.get('/view/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadFolder, filename);
  
  console.log('👀 View request for:', filename);
  console.log('📁 File path:', filePath);
  
  if (!fs.existsSync(filePath)) {
    console.error('❌ File not found for viewing:', filePath);
    console.log('📂 Available files:', fs.readdirSync(uploadFolder));
    
    return res.status(404).json({ 
      error: 'File not found',
      message: `File '${filename}' does not exist in upload directory`,
      filename: filename,
      requestedPath: filePath,
      availableFiles: fs.readdirSync(uploadFolder),
      staticUrl: `${req.protocol}://${req.get('host')}/uploads/ranking-data/${filename}`
    });
  }

  console.log('✅ File found, serving for viewing...');

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="document.pdf"');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const fileStream = fs.createReadStream(filePath);
  fileStream.on('error', (err) => {
    console.error('❌ File stream error:', err);
    res.status(500).json({ message: 'Error reading file' });
  });
  
  fileStream.pipe(res);
});

// PUT /update-ranking-site/:id
router.put('/update-ranking-site/:id', upload.single('file'), (req, res) => {
  const id = req.params.id;
  const { rankingName, sdgNumber, criteriaName, question, year, isVisible } = req.body;
  const uploaded = req.file;


  let newFileInfo = null;
  if (uploaded) {
    newFileInfo = {
      fileName: uploaded.filename,
      fileUrl: `/uploads/ranking-data/${uploaded.filename}`, // Match your static config
      fileSize: `${(uploaded.size / (1024 * 1024)).toFixed(2)} MB`,
      originalName: uploaded.originalname
    };
    console.log('📄 New file uploaded:', newFileInfo);
  }

  // Normalize isVisible which may arrive as string ('true'/'false' or '1'/'0') or boolean
  let visibilityVal = null;
  if (typeof isVisible !== 'undefined' && isVisible !== null) {
    const v = String(isVisible).toLowerCase();
    if (v === 'true' || v === '1' || v === 'yes' || v === 'on') visibilityVal = 1;
    else if (v === 'false' || v === '0' || v === 'no' || v === 'off') visibilityVal = 0;
    else visibilityVal = null;
  }

  const sql = `
    UPDATE ranking_data SET
      ranking_name = COALESCE(?, ranking_name),
      sdg_number = COALESCE(?, sdg_number),
      criteria_name = COALESCE(?, criteria_name),
      question = COALESCE(?, question),
      file_name = COALESCE(?, file_name),
      file_url = COALESCE(?, file_url),
      file_size = COALESCE(?, file_size),
      year = COALESCE(?, year),
      is_visible = COALESCE(?, is_visible)
    WHERE id = ?
  `;

  const performUpdate = (fileNameVal, fileUrlVal, fileSizeVal/*, originalNameVal */) => {
    const params = [
      rankingName,
      sdgNumber ? parseInt(sdgNumber) : null,
      criteriaName,
      question,
      fileNameVal,
      fileUrlVal,
      fileSizeVal,
      year,
      visibilityVal,
      id
    ].map(param => param === undefined ? null : param);

    db.query(sql, params, (err) => {
      if (err) {
        console.error('❌ Error updating ranking:', err);
        return res.status(500).json({ message: 'Error updating ranking: ' + err.message });
      }

      res.status(200).json({ 
        success: true, 
        message: '✅ Ranking updated successfully' 
      });
    });
  };

  if (newFileInfo) {
    // Delete old file
    db.query('SELECT file_name FROM ranking_data WHERE id = ?', [id], (err, results) => {
      if (!err && results && results.length > 0) {
        const oldFileName = results[0].file_name;
        if (oldFileName) {
          const oldFilePath = path.join(uploadFolder, oldFileName);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
            console.log('🗑️ Deleted old file:', oldFileName);
          }
        }
      }
      performUpdate(newFileInfo.fileName, newFileInfo.fileUrl, newFileInfo.fileSize);
    });
  } else {
    performUpdate(null, null, null);
  }
});

// DELETE /delete-ranking-site/:id
router.delete('/delete-ranking-site/:id', (req, res) => {
  const id = req.params.id;

  console.log('🗑️ Delete request for ID:', id);

  db.query('SELECT file_name FROM ranking_data WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching ranking' });
    if (results.length === 0) return res.status(404).json({ message: 'Not found' });

    const fileName = results[0].file_name;
    if (fileName) {
      const fullPath = path.join(uploadFolder, fileName);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
          console.log('🗑️ Deleted file:', fileName);
        } catch (e) {
          console.warn('⚠️ Failed to unlink file:', fullPath, e.message);
        }
      }
    }

    db.query('DELETE FROM ranking_data WHERE id = ?', [id], (err2) => {
      if (err2) return res.status(500).json({ message: 'Error deleting ranking' });
      res.status(200).json({ message: '✅ Ranking deleted successfully' });
    });
  });
});

// Test endpoints
router.get('/test-upload-dir', (req, res) => {
  try {
    const files = fs.readdirSync(uploadFolder);
    const fileDetails = files.map(file => {
      const filePath = path.join(uploadFolder, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        created: stats.birthtime,
        staticUrl: `${req.protocol}://${req.get('host')}/uploads/ranking-data/${file}`,
        viewUrl: `${req.protocol}://${req.get('host')}${req.baseUrl}/view/${file}`,
        downloadUrl: `${req.protocol}://${req.get('host')}${req.baseUrl}/download/${file}`
      };
    });
    
    res.json({
      success: true,
      uploadFolder,
      exists: fs.existsSync(uploadFolder),
      fileCount: files.length,
      files: fileDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Fix existing data endpoint
router.post('/fix-existing-data', (req, res) => {
  const sql = `
    UPDATE ranking_data 
    SET 
      file_url = CONCAT('/uploads/ranking-data/', file_name),
      year = COALESCE(NULLIF(year, ''), '2025'),
      year = CASE WHEN year = 'NULL' THEN '2025' ELSE year END
    WHERE file_url LIKE '%...%' OR year IS NULL OR year = 'NULL' OR year = ''
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error fixing data: ' + err.message });
    }
    
    res.json({
      success: true,
      message: `Fixed ${result.affectedRows} records`,
      affectedRows: result.affectedRows
    });
  });
});

export default router;