import express from "express";
import pool from "../../db.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const router = express.Router();

// ES module path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Upload directory setup
const uploadDir = path.join(process.cwd(), "uploads", "awards");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Created upload directory:", uploadDir);
}

// ✅ Multer storage setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueName = Date.now() + "-" + cleanName;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm', 'video/ogg',
    'application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fieldSize: 10 * 1024 * 1024,
    fileSize: 50 * 1024 * 1024,
    files: 10
  },
  fileFilter: fileFilter
});

// ✅ Helper function to save base64 files
async function saveBase64File(base64String, fieldName) {
  try {
    // Check if it's already a URL/path
    if (!base64String || typeof base64String !== 'string') {
      return base64String;
    }

    // If it's already a URL or path, return as is
    if (base64String.startsWith('/uploads/') || base64String.startsWith('http')) {
      return base64String;
    }

    // Check if it's a base64 string
    if (!base64String.startsWith('data:')) {
      return base64String;
    }

    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string');
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Determine file extension
    const ext = mimeType.split('/')[1] || 'bin';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const filePath = path.join(uploadDir, filename);

    // Save file
    fs.writeFileSync(filePath, buffer);
    console.log(`✅ Saved ${fieldName} file: ${filename}`);

    return `/uploads/awards/${filename}`;
  } catch (error) {
    console.error(`❌ Error saving ${fieldName}:`, error);
    return null;
  }
}

// ✅ Process files from both FormData and JSON
async function processFiles(files, body, fieldName) {
  let processedFiles = [];

  // 1. Check for uploaded files (FormData)
  if (files && files[fieldName] && Array.isArray(files[fieldName])) {
    const filePaths = files[fieldName].map((f) => `/uploads/awards/${f.filename}`);
    processedFiles = [...processedFiles, ...filePaths];
    console.log(`📁 Found ${filePaths.length} uploaded ${fieldName}`);
  }

  // 2. Check for base64 strings in body (JSON)
  if (body[fieldName]) {
    let items = [];
    
    // Parse if it's a JSON string
    if (typeof body[fieldName] === 'string') {
      try {
        items = JSON.parse(body[fieldName]);
        if (!Array.isArray(items)) {
          items = [items];
        }
      } catch (e) {
        // Not JSON, treat as single item
        items = [body[fieldName]];
      }
    } else if (Array.isArray(body[fieldName])) {
      items = body[fieldName];
    } else {
      items = [body[fieldName]];
    }

    console.log(`📦 Processing ${items.length} ${fieldName} from JSON`);

    // Process each item
    for (const item of items) {
      if (typeof item === 'string' && item.startsWith('data:')) {
        // It's a base64 string, save it
        const savedPath = await saveBase64File(item, fieldName);
        if (savedPath) {
          processedFiles.push(savedPath);
        }
      } else if (typeof item === 'string' && item.startsWith('/uploads/')) {
        // It's already a URL
        processedFiles.push(item);
      } else if (typeof item === 'string') {
        // Could be a URL or path
        processedFiles.push(item);
      }
    }
  }

  // Remove duplicates and filter out null/undefined
  const uniqueFiles = [...new Set(processedFiles.filter(f => f))];
  console.log(`📊 Final ${fieldName}:`, uniqueFiles);
  return uniqueFiles;
}

// ✅ ADD AWARD - Handles both FormData and JSON
router.post(
  "/add-award",
  (req, res, next) => {
    console.log("📥 POST /add-award request received");
    console.log("📋 Content-Type:", req.headers['content-type']);
    console.log("📦 Body keys:", Object.keys(req.body));
    next();
  },
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 5 },
    { name: "documents", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      console.log("📦 Body:", req.body);
      console.log("📁 Files:", req.files);

      const { title, description, category, year, organization, score } = req.body;

      // ✅ Validate required fields
      if (!title || !description || !category || !year) {
        return res.status(400).json({ 
          message: "Required fields are missing",
          missing: { 
            title: !title, 
            description: !description, 
            category: !category, 
            year: !year 
          }
        });
      }

      // ✅ Process all files (handles both FormData and base64)
      const images = await processFiles(req.files, req.body, 'images');
      const videos = await processFiles(req.files, req.body, 'videos');
      const documents = await processFiles(req.files, req.body, 'documents');

      console.log("🖼️ Processed images:", images);
      console.log("🎬 Processed videos:", videos);
      console.log("📄 Processed documents:", documents);

      // ✅ Parse year
      const yearValue = parseInt(year);
      if (isNaN(yearValue) || yearValue < 1900 || yearValue > 2155) {
        return res.status(400).json({ 
          message: "Invalid year format. Please provide a valid 4-digit year." 
        });
      }

      // ✅ Parse score (INT column)
      let scoreValue = null;
      if (score && score !== '') {
        scoreValue = parseInt(score);
        if (isNaN(scoreValue)) {
          return res.status(400).json({ 
            message: "Invalid score format. Please provide a valid number." 
          });
        }
      }

      // ✅ Insert into database
      const sql = `
        INSERT INTO achievements_awards 
        (title, description, category, year, organization, score, images, videos, documents)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        title.trim(),
        description.trim(),
        category.trim(),
        yearValue,
        organization ? organization.trim() : null,
        scoreValue,
        JSON.stringify(images),
        JSON.stringify(videos),
        JSON.stringify(documents),
      ];

      console.log("📊 Final values:", values);

      const [result] = await pool.query(sql, values);

      console.log("✅ Award inserted with ID:", result.insertId);

      res.status(201).json({
        message: "✅ Award added successfully",
        award: {
          id: result.insertId,
          title: title.trim(),
          description: description.trim(),
          category: category.trim(),
          year: yearValue,
          organization: organization ? organization.trim() : null,
          score: scoreValue,
          images,
          videos,
          documents,
        },
      });
    } catch (err) {
      console.error("❌ Error inserting award:", err);
      console.error("❌ Stack trace:", err.stack);
      
      if (err.code === 'ER_DATA_TOO_LONG') {
        return res.status(400).json({ 
          message: "Data too long for one of the fields. Please check your input." 
        });
      }
      if (err.code === 'ER_BAD_NULL_ERROR') {
        return res.status(400).json({ 
          message: "Required field cannot be null. Please check your input." 
        });
      }
      if (err.code === 'ER_TRUNCATED_WRONG_VALUE') {
        return res.status(400).json({ 
          message: "Invalid data format. Please check your input." 
        });
      }
      
      return res.status(500).json({ 
        message: "Error inserting award", 
        error: err.message,
        code: err.code
      });
    }
  }
);

// ✅ Helper function to process and convert base64 to files on fetch
async function processAndConvertFiles(fileArray, fieldName) {
  if (!fileArray || !Array.isArray(fileArray) || fileArray.length === 0) {
    return [];
  }

  const processedFiles = [];
  
  for (const item of fileArray) {
    if (typeof item === 'string' && item.startsWith('data:')) {
      // It's a base64 string - convert to file
      console.log(`🔄 Converting ${fieldName} from base64 to file...`);
      const savedPath = await saveBase64File(item, fieldName);
      if (savedPath) {
        processedFiles.push(savedPath);
      }
    } else if (typeof item === 'string') {
      // It's already a path or URL
      processedFiles.push(item);
    } else {
      processedFiles.push(item);
    }
  }

  return processedFiles;
}

// ✅ GET ALL AWARDS - Converts base64 to files on the fly
router.get("/awards", async (req, res) => {
  const sql = "SELECT * FROM achievements_awards ORDER BY id DESC";
  try {
    const [results] = await pool.query(sql);
    
    const parsedResults = await Promise.all(results.map(async (row) => {
      let images = [], videos = [], documents = [];
      
      try { images = JSON.parse(row.images || "[]"); } catch (e) { images = []; }
      try { videos = JSON.parse(row.videos || "[]"); } catch (e) { videos = []; }
      try { documents = JSON.parse(row.documents || "[]"); } catch (e) { documents = []; }
      
      // ✅ Convert base64 to files and update database
      const processedImages = await processAndConvertFiles(images, 'images');
      const processedVideos = await processAndConvertFiles(videos, 'videos');
      const processedDocuments = await processAndConvertFiles(documents, 'documents');
      
      // ✅ If any files were converted, update the database
      if (JSON.stringify(images) !== JSON.stringify(processedImages) ||
          JSON.stringify(videos) !== JSON.stringify(processedVideos) ||
          JSON.stringify(documents) !== JSON.stringify(processedDocuments)) {
        
        console.log(`🔄 Updating database with new file paths for award ${row.id}`);
        const updateSql = `
          UPDATE achievements_awards 
          SET images = ?, videos = ?, documents = ?
          WHERE id = ?
        `;
        
        await pool.query(updateSql, [
          JSON.stringify(processedImages),
          JSON.stringify(processedVideos),
          JSON.stringify(processedDocuments),
          row.id
        ]);
      }
      
      return {
        ...row,
        images: processedImages,
        videos: processedVideos,
        documents: processedDocuments,
        year: row.year ? row.year.toString() : null,
        score: row.score !== null && row.score !== undefined ? parseInt(row.score) : null,
      };
    }));
    
    res.status(200).json(parsedResults);
  } catch (err) {
    console.error("❌ Error fetching awards:", err);
    return res.status(500).json({ message: "Error fetching awards" });
  }
});

// ✅ GET SINGLE AWARD - Converts base64 to files on the fly
router.get("/award/:id", async (req, res) => {
  const awardId = req.params.id;
  const sql = "SELECT * FROM achievements_awards WHERE id = ?";
  try {
    const [results] = await pool.query(sql, [awardId]);
    if (results.length === 0) {
      return res.status(404).json({ message: "Award not found" });
    }
    
    const row = results[0];
    let images = [], videos = [], documents = [];
    
    try { images = JSON.parse(row.images || "[]"); } catch (e) { images = []; }
    try { videos = JSON.parse(row.videos || "[]"); } catch (e) { videos = []; }
    try { documents = JSON.parse(row.documents || "[]"); } catch (e) { documents = []; }
    
    // ✅ Convert base64 to files and update database
    const processedImages = await processAndConvertFiles(images, 'images');
    const processedVideos = await processAndConvertFiles(videos, 'videos');
    const processedDocuments = await processAndConvertFiles(documents, 'documents');
    
    // ✅ If any files were converted, update the database
    if (JSON.stringify(images) !== JSON.stringify(processedImages) ||
        JSON.stringify(videos) !== JSON.stringify(processedVideos) ||
        JSON.stringify(documents) !== JSON.stringify(processedDocuments)) {
      
      console.log(`🔄 Updating database with new file paths for award ${row.id}`);
      const updateSql = `
        UPDATE achievements_awards 
        SET images = ?, videos = ?, documents = ?
        WHERE id = ?
      `;
      
      await pool.query(updateSql, [
        JSON.stringify(processedImages),
        JSON.stringify(processedVideos),
        JSON.stringify(processedDocuments),
        row.id
      ]);
    }
    
    res.status(200).json({
      ...row,
      images: processedImages,
      videos: processedVideos,
      documents: processedDocuments,
      year: row.year ? row.year.toString() : null,
      score: row.score !== null && row.score !== undefined ? parseInt(row.score) : null,
    });
  } catch (err) {
    console.error("❌ Error fetching award:", err);
    return res.status(500).json({ message: "Error fetching award" });
  }
});

// ✅ DELETE AWARD
router.delete("/delete-award/:id", async (req, res) => {
  const awardId = req.params.id;

  const selectSql = "SELECT images, videos, documents FROM achievements_awards WHERE id = ?";
  const deleteSql = "DELETE FROM achievements_awards WHERE id = ?";

  try {
    const [results] = await pool.query(selectSql, [awardId]);
    if (results.length === 0) {
      return res.status(404).json({ message: "Award not found" });
    }

    const award = results[0];
    let images = [], videos = [], documents = [];
    
    try { images = JSON.parse(award.images || "[]"); } catch (e) { images = []; }
    try { videos = JSON.parse(award.videos || "[]"); } catch (e) { videos = []; }
    try { documents = JSON.parse(award.documents || "[]"); } catch (e) { documents = []; }
    
    const allFiles = [...images, ...videos, ...documents];

    console.log(`🗑️ Deleting ${allFiles.length} files for award ${awardId}`);

    // Delete files from filesystem
    allFiles.forEach((filePath) => {
      if (filePath && typeof filePath === 'string' && filePath.startsWith('/uploads/')) {
        const fullPath = path.join(process.cwd(), filePath);
        if (fs.existsSync(fullPath)) {
          try {
            fs.unlinkSync(fullPath);
            console.log(`🗑️ Deleted file: ${fullPath}`);
          } catch (err) {
            console.error(`❌ Error deleting file ${fullPath}:`, err);
          }
        } else {
          console.log(`⚠️ File not found: ${fullPath}`);
        }
      }
    });

    await pool.query(deleteSql, [awardId]);
    res.status(200).json({ message: "✅ Award deleted successfully" });
  } catch (err) {
    console.error('❌ Error deleting award:', err);
    return res.status(500).json({ message: 'Error deleting award' });
  }
});

// ✅ UPDATE AWARD
router.put('/update-award/:id', upload.none(), async (req, res) => {
  try {
    const awardId = req.params.id;
    const { title, description, category, year, organization, score } = req.body;

    console.log("📝 Updating award:", { awardId, title, description, category, year, organization, score });

    // ✅ Parse array fields
    const parseArrayField = (field) => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') {
        try {
          const parsed = JSON.parse(field);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          // Not JSON, treat as single item
        }
        return [field];
      }
      return [];
    };

    // ✅ Parse and validate year
    const yearValue = parseInt(year);
    if (isNaN(yearValue) || yearValue < 1900 || yearValue > 2155) {
      return res.status(400).json({ 
        message: "Invalid year format. Please provide a valid 4-digit year." 
      });
    }

    // ✅ Parse and validate score
    let scoreValue = null;
    if (score && score !== '') {
      scoreValue = parseInt(score);
      if (isNaN(scoreValue)) {
        return res.status(400).json({ 
          message: "Invalid score format. Please provide a valid number." 
        });
      }
    }

    const images = parseArrayField(req.body.images);
    const videos = parseArrayField(req.body.videos);
    const documents = parseArrayField(req.body.documents);

    const sql = `
      UPDATE achievements_awards
      SET title = ?, description = ?, category = ?, year = ?, organization = ?, score = ?, images = ?, videos = ?, documents = ?
      WHERE id = ?
    `;

    const values = [
      title.trim(),
      description.trim(),
      category.trim(),
      yearValue,
      organization ? organization.trim() : null,
      scoreValue,
      JSON.stringify(images),
      JSON.stringify(videos),
      JSON.stringify(documents),
      awardId,
    ];

    console.log("📝 Update values:", values);

    const [updateResult] = await pool.query(sql, values);
    
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Award not found or no changes made' });
    }

    // Get updated record
    const selectSql = 'SELECT * FROM achievements_awards WHERE id = ?';
    const [results] = await pool.query(selectSql, [awardId]);
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Award not found after update' });
    }

    const row = results[0];
    let imagesParsed = [], videosParsed = [], documentsParsed = [];
    
    try { imagesParsed = JSON.parse(row.images || "[]"); } catch (e) { imagesParsed = []; }
    try { videosParsed = JSON.parse(row.videos || "[]"); } catch (e) { videosParsed = []; }
    try { documentsParsed = JSON.parse(row.documents || "[]"); } catch (e) { documentsParsed = []; }
    
    res.status(200).json({ 
      success: true, 
      data: {
        ...row,
        year: row.year ? row.year.toString() : null,
        score: row.score !== null && row.score !== undefined ? parseInt(row.score) : null,
        images: imagesParsed,
        videos: videosParsed,
        documents: documentsParsed,
      }
    });
  } catch (err) {
    console.error('❌ Error updating award:', err);
    return res.status(500).json({ 
      message: 'Error updating award',
      error: err.message,
      code: err.code
    });
  }
});

export default router;

/*CREATE TABLE `achievements_awards` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `year` YEAR NOT NULL,
  `organization` VARCHAR(255) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `images` longtext DEFAULT NULL,
  `videos` longtext DEFAULT NULL,
  `documents` longtext DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;*/
