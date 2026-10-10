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

//////////////////////////////////////////////////////////
// ✅ ENSURE UPLOAD FOLDER EXISTS
//////////////////////////////////////////////////////////
const uploadDir = path.join(__dirname, "../../../uploads/certificates");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

//////////////////////////////////////////////////////////
// ✅ MULTER CONFIG (WITH VALIDATION)
//////////////////////////////////////////////////////////
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// ✅ File filter (IMPORTANT)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "video/mp4",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images, videos, and PDFs allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB per file
  },
});

//////////////////////////////////////////////////////////
// ✅ HELPER FUNCTION
//////////////////////////////////////////////////////////
const parseJSON = (data) => {
  try {
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};


// ✅ ADD Award API
router.post(
  "/add-award",
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 5 },
    { name: "documents", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      console.log("📥 Received request to /add-award");
      console.log("📋 Content-Type:", req.headers['content-type']);
      console.log("📦 Body:", req.body);
      console.log("📁 Files:", req.files);

      const { title, description, category, year, organization, score } = req.body;

      // ✅ Validate required fields
      if (!title || !description || !category || !year) {
        console.log("❌ Missing required fields:", { title, description, category, year });
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

      // ✅ Handle files safely
      let images = [];
      let videos = [];
      let documents = [];

      if (req.files && typeof req.files === 'object') {
        if (req.files.images && Array.isArray(req.files.images)) {
          images = req.files.images.map((f) => `/uploads/awards/${f.filename}`);
        }
        if (req.files.videos && Array.isArray(req.files.videos)) {
          videos = req.files.videos.map((f) => `/uploads/awards/${f.filename}`);
        }
        if (req.files.documents && Array.isArray(req.files.documents)) {
          documents = req.files.documents.map((f) => `/uploads/awards/${f.filename}`);
        }
      }

      console.log("🖼️ Processed images:", images);
      console.log("🎬 Processed videos:", videos);
      console.log("📄 Processed documents:", documents);

      // ✅ Prepare data with proper types
      // Year should be a 4-digit number for YEAR column
      const yearValue = parseInt(year);
      if (isNaN(yearValue) || yearValue < 1900 || yearValue > 2155) {
        return res.status(400).json({ 
          message: "Invalid year format. Please provide a valid 4-digit year." 
        });
      }

      // Score should be a number or null
      let scoreValue = null;
      if (score && score !== '') {
        scoreValue = parseFloat(score);
        if (isNaN(scoreValue)) {
          return res.status(400).json({ 
            message: "Invalid score format. Please provide a valid number." 
          });
        }
      }

      const sql = `
        INSERT INTO achievements_awards 
        (title, description, category, year, organization, score, images, videos, documents)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        title.trim(),
        description.trim(),
        category.trim(),
        yearValue, // Already parsed as integer
        organization ? organization.trim() : null,
        scoreValue, // Already parsed as float or null
        JSON.stringify(images),
        JSON.stringify(videos),
        JSON.stringify(documents),
      ];

      console.log("📝 SQL Query:", sql);
      console.log("📊 Values:", values);

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
      
      // Check for specific MySQL errors
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
          message: "Invalid data format. Please check your input (e.g., year should be a 4-digit number, score should be a number)." 
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

// ✅ FETCH Awards API
router.get("/awards", async (req, res) => {
  const sql = "SELECT * FROM achievements_awards ORDER BY id DESC";
  try {
    const [results] = await pool.query(sql);
    const parsedResults = results.map((row) => ({
      ...row,
      images: row.images ? JSON.parse(row.images) : [],
      videos: row.videos ? JSON.parse(row.videos) : [],
      documents: row.documents ? JSON.parse(row.documents) : [],
      // Ensure year is returned as number/string
      year: row.year ? row.year.toString() : null,
      // Ensure score is returned as number or null
      score: row.score !== null && row.score !== undefined ? parseFloat(row.score) : null,
    }));
    res.status(200).json(parsedResults);
  } catch (err) {
    console.error("❌ Error fetching awards:", err);
    return res.status(500).json({ message: "Error fetching awards" });
  }
});

// ✅ DELETE Award API
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
    const allFiles = [
      ...(JSON.parse(award.images || "[]")),
      ...(JSON.parse(award.videos || "[]")),
      ...(JSON.parse(award.documents || "[]")),
    ];

    allFiles.forEach((filePath) => {
      const fullPath = path.join(__dirname, "../../../", filePath);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
          console.log(`🗑️ Deleted file: ${fullPath}`);
        } catch (err) {
          console.error(`❌ Error deleting file ${fullPath}:`, err);
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

// ✅ UPDATE Award API
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
      scoreValue = parseFloat(score);
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
    res.status(200).json({ 
      success: true, 
      data: {
        ...row,
        year: row.year ? row.year.toString() : null,
        score: row.score !== null && row.score !== undefined ? parseFloat(row.score) : null,
        images: row.images ? JSON.parse(row.images) : [],
        videos: row.videos ? JSON.parse(row.videos) : [],
        documents: row.documents ? JSON.parse(row.documents) : [],
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
  `score` DECIMAL(5,2) DEFAULT NULL,
  `images` JSON DEFAULT NULL,
  `videos` JSON DEFAULT NULL,
  `documents` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;*/
