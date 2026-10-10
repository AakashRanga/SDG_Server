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

// ✅ Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadFolder = "../../../uploads/recognitions";
    cb(null, path.join(__dirname, uploadFolder));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Using shared promise-based pool from server/db.js

// ✅ ADD Recognition API
router.post(
  "/add-recognition",
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 5 },
    { name: "documents", maxCount: 5 },
  ]),
  async (req, res) => {
    const { title, description, category, year, organization, rank } = req.body;

    const images = req.files["images"]
      ? req.files["images"].map((f) => `/uploads/recognitions/${f.filename}`)
      : [];
    const videos = req.files["videos"]
      ? req.files["videos"].map((f) => `/uploads/recognitions/${f.filename}`)
      : [];
    const documents = req.files["documents"]
      ? req.files["documents"].map((f) => `/uploads/recognitions/${f.filename}`)
      : [];

    if (!title || !description || !category || !year) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const sql = `
      INSERT INTO achievements_recognitions 
      (title, description, category, year, organization, rank, images, videos, documents)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await pool.query(sql, [
        title,
        description,
        category,
        year,
        organization || null,
        rank || null,
        JSON.stringify(images),
        JSON.stringify(videos),
        JSON.stringify(documents),
      ]);

      res.status(201).json({
        message: "✅ Recognition added successfully",
        recognition: {
          id: result.insertId,
          title,
          description,
          category,
          year,
          organization,
          rank,
          images,
          videos,
          documents,
        },
      });
    } catch (err) {
      console.error("❌ Error inserting recognition:", err);
      return res.status(500).json({ message: "Error inserting recognition" });
    }
  }
);

// ✅ FETCH Recognitions API
router.get("/recognition", async (req, res) => {
  const sql = "SELECT * FROM achievements_recognitions ORDER BY id DESC";
  try {
    const [results] = await pool.query(sql);
    const parsedResults = results.map((row) => ({
      ...row,
      images: row.images ? JSON.parse(row.images) : [],
      videos: row.videos ? JSON.parse(row.videos) : [],
      documents: row.documents ? JSON.parse(row.documents) : [],
    }));
    res.status(200).json(parsedResults);
  } catch (err) {
    console.error("❌ Error fetching recognition:", err);
    return res.status(500).json({ message: "Error fetching recognition" });
  }
});
router.delete("/delete-recognition/:id", async (req, res) => {
  const recognitionId = req.params.id;

  const selectSql = "SELECT images, videos, documents FROM achievements_recognitions WHERE id = ?";
  const deleteSql = "DELETE FROM achievements_recognitions WHERE id = ?";

  try {
    const [results] = await pool.query(selectSql, [recognitionId]);
    if (results.length === 0) return res.status(404).json({ message: "Recognition not found" });

    const recognition = results[0];
    const allFiles = [
      ...(JSON.parse(recognition.images || "[]")),
      ...(JSON.parse(recognition.videos || "[]")),
      ...(JSON.parse(recognition.documents || "[]")),
    ];

    allFiles.forEach((filePath) => {
      const fullPath = path.join(__dirname, "../../../", filePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    });

    await pool.query(deleteSql, [recognitionId]);
    res.status(200).json({ message: "✅ Recognition deleted successfully" });
  } catch (err) {
    console.error('❌ Error deleting recognition:', err);
    return res.status(500).json({ message: 'Error deleting recognition' });
  }
});

// ✅ UPDATE Recognition API
router.put('/update-recognition/:id', upload.none(), async (req, res) => {
  const recogId = req.params.id;
  const { title, description, category, year, organization, score } = req.body;

  const parseArrayField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field.map(normalize);
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        if (Array.isArray(parsed)) return parsed.map(normalize);
      } catch (e) {}
      return [field];
    }
    return [];
  };

  const normalize = (entry) => {
    if (!entry) return entry;
    if (typeof entry === 'string') return entry;
    if (entry.url && typeof entry.url === 'string') return entry.url;
    return entry;
  };

  const images = parseArrayField(req.body.images);
  const videos = parseArrayField(req.body.videos);
  const documents = parseArrayField(req.body.documents);

  const sql = `
    UPDATE achievements_recognitions
    SET title = ?, description = ?, category = ?, year = ?, organization = ?, score = ?, images = ?, videos = ?, documents = ?
    WHERE id = ?
  `;

  try {
    await pool.query(
      sql,
      [
        title,
        description,
        category,
        year,
        organization || null,
        score || null,
        JSON.stringify(images),
        JSON.stringify(videos),
        JSON.stringify(documents),
        recogId,
      ]
    );

    const selectSql = 'SELECT * FROM achievements_recognitions WHERE id = ?';
    const [results] = await pool.query(selectSql, [recogId]);
    if (results.length === 0) return res.status(404).json({ message: 'Recognition not found' });

    const row = results[0];
    res.status(200).json({ success: true, data: {
      ...row,
      images: row.images ? JSON.parse(row.images) : [],
      videos: row.videos ? JSON.parse(row.videos) : [],
      documents: row.documents ? JSON.parse(row.documents) : [],
    }});
  } catch (err) {
    console.error('❌ Error updating recognition:', err);
    return res.status(500).json({ message: 'Error updating recognition' });
  }
});


export default router;
/*CREATE TABLE `achievements_recognitions` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `year` YEAR NOT NULL,
  `organization` VARCHAR(255) DEFAULT NULL,
  `rank` VARCHAR(50) DEFAULT NULL,
  `images` JSON DEFAULT NULL,
  `videos` JSON DEFAULT NULL,
  `documents` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;*/
