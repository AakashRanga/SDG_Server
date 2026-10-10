import express from "express";
import { db } from "../../db.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const router = express.Router();

// ES module path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Multer storage setup for multiple file types
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadFolder = "../../../uploads/rankings";
    cb(null, path.join(__dirname, uploadFolder));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });



// ✅ ADD Ranking API
router.post(
  "/add-ranking",
  (req, res) => {
    const { title, description, category, year, organization, rank } = req.body;

    // Parse images, videos, documents from request body (they come as JSON strings)
    const parseArrayField = (field) => {
      if (!field) return [];
      if (typeof field === 'string') {
        try {
          const parsed = JSON.parse(field);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          return [];
        }
      }
      return Array.isArray(field) ? field : [];
    };

    const images = parseArrayField(req.body.images);
    const videos = parseArrayField(req.body.videos);
    const documents = parseArrayField(req.body.documents);

    if (!title || !description || !category || !year) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const sql = `
      INSERT INTO achievements_rankings 
      (title, description, category, year, organization, rank, images, videos, documents)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        title,
        description,
        category,
        year,
        organization || null,
        rank || null,
        JSON.stringify(images),
        JSON.stringify(videos),
        JSON.stringify(documents),
      ],
      (err, result) => {
        if (err) {
          console.error("❌ Error inserting ranking:", err);
          return res.status(500).json({ message: "Error inserting ranking" });
        }

        res.status(201).json({
          message: "✅ Ranking added successfully",
          ranking: {
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
      }
    );
  }
);

// ✅ FETCH Rankings API
router.get("/rankings", (req, res) => {
  const sql = "SELECT * FROM achievements_rankings ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching rankings:", err);
      return res.status(500).json({ message: "Error fetching rankings" });
    }

    const parsedResults = results.map((row) => ({
      ...row,
      images: row.images ? JSON.parse(row.images) : [],
      videos: row.videos ? JSON.parse(row.videos) : [],
      documents: row.documents ? JSON.parse(row.documents) : [],
    }));

    res.status(200).json(parsedResults);
  });
});
router.delete("/delete-ranking/:id", (req, res) => {
  const rankingId = req.params.id;

  const selectSql = "SELECT images, videos, documents FROM achievements_rankings WHERE id = ?";
  const deleteSql = "DELETE FROM achievements_rankings WHERE id = ?";

  db.query(selectSql, [rankingId], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching ranking" });
    if (results.length === 0) return res.status(404).json({ message: "Ranking not found" });

    const ranking = results[0];
    const allFiles = [
      ...(JSON.parse(ranking.images || "[]")),
      ...(JSON.parse(ranking.videos || "[]")),
      ...(JSON.parse(ranking.documents || "[]")),
    ];

    allFiles.forEach((filePath) => {
      const fullPath = path.join(__dirname, "../../../", filePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    });

    db.query(deleteSql, [rankingId], (err2) => {
      if (err2) return res.status(500).json({ message: "Error deleting ranking" });
      res.status(200).json({ message: "✅ Ranking deleted successfully" });
    });
  });
});

// ✅ UPDATE Ranking API
router.put('/update-ranking/:id', upload.none(), (req, res) => {
  const rankId = req.params.id;
  const { title, description, category, year, organization, rank } = req.body;

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
    UPDATE achievements_rankings
    SET title = ?, description = ?, category = ?, year = ?, organization = ?, rank = ?, images = ?, videos = ?, documents = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      title,
      description,
      category,
      year,
      organization || null,
      rank || null,
      JSON.stringify(images),
      JSON.stringify(videos),
      JSON.stringify(documents),
      rankId,
    ],
    (err) => {
      if (err) {
        console.error('❌ Error updating ranking:', err);
        return res.status(500).json({ message: 'Error updating ranking' });
      }

      const selectSql = 'SELECT * FROM achievements_rankings WHERE id = ?';
      db.query(selectSql, [rankId], (err2, results) => {
        if (err2) return res.status(500).json({ message: 'Error fetching updated ranking' });
        if (results.length === 0) return res.status(404).json({ message: 'Ranking not found' });

        const row = results[0];
        res.status(200).json({ success: true, data: {
          ...row,
          images: row.images ? JSON.parse(row.images) : [],
          videos: row.videos ? JSON.parse(row.videos) : [],
          documents: row.documents ? JSON.parse(row.documents) : [],
        }});
      });
    }
  );
});


export default router;

/*CREATE TABLE `achievements_rankings` (
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
