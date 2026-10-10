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
    let uploadFolder = "../../../uploads/awards";

    // You can further organize by file type if you want
    cb(null, path.join(__dirname, uploadFolder));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    // allow up to 10 MB per text field (only for development/debugging)
    fieldSize: 10 * 1024 * 1024,
    // allow up to 50 MB per file
    fileSize: 50 * 1024 * 1024,
    // and optionally limit number of files
    files: 10
  }
});



// ✅ ADD Award API
router.post(
  "/add-award",
  (req, res) => {
    const { title, description, category, year, organization, score } = req.body;

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
      INSERT INTO achievements_awards 
      (title, description, category, year, organization, score, images, videos, documents)
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
        score || null,
        JSON.stringify(images),
        JSON.stringify(videos),
        JSON.stringify(documents),
      ],
      (err, result) => {
        if (err) {
          console.error("❌ Error inserting award:", err);
          return res.status(500).json({ message: "Error inserting award" });
        }

        res.status(201).json({
          message: "✅ Award added successfully",
          award: {
            id: result.insertId,
            title,
            description,
            category,
            year,
            organization,
            score,
            images,
            videos,
            documents,
          },
        });
      }
    );
  }
);

// ✅ FETCH Awards API
router.get("/awards", (req, res) => {
  const sql = "SELECT * FROM achievements_awards ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching awards:", err);
      return res.status(500).json({ message: "Error fetching awards" });
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
router.delete("/delete-award/:id", (req, res) => {
  const awardId = req.params.id;

  const selectSql = "SELECT images, videos, documents FROM achievements_awards WHERE id = ?";
  const deleteSql = "DELETE FROM achievements_awards WHERE id = ?";

  db.query(selectSql, [awardId], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching award" });
    if (results.length === 0) return res.status(404).json({ message: "Award not found" });

    const award = results[0];
    const allFiles = [
      ...(JSON.parse(award.images || "[]")),
      ...(JSON.parse(award.videos || "[]")),
      ...(JSON.parse(award.documents || "[]")),
    ];

    allFiles.forEach((filePath) => {
      const fullPath = path.join(__dirname, "../../../", filePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    });

    db.query(deleteSql, [awardId], (err2) => {
      if (err2) return res.status(500).json({ message: "Error deleting award" });
      res.status(200).json({ message: "✅ Award deleted successfully" });
    });
  });
});

// ✅ UPDATE Award API
router.put('/update-award/:id', upload.none(), (req, res) => {
  const awardId = req.params.id;
  const { title, description, category, year, organization, score } = req.body;

  const parseArrayField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field.map(normalize);
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        if (Array.isArray(parsed)) return parsed.map(normalize);
      } catch (e) {
        // not JSON, fall through
      }
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
  const documents = parseArrayField(req.body.documents || req.body.documents);

  const sql = `
    UPDATE achievements_awards
    SET title = ?, description = ?, category = ?, year = ?, organization = ?, score = ?, images = ?, videos = ?, documents = ?
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
      score || null,
      JSON.stringify(images),
      JSON.stringify(videos),
      JSON.stringify(documents),
      awardId,
    ],
    (err) => {
      if (err) {
        console.error('❌ Error updating award:', err);
        return res.status(500).json({ message: 'Error updating award' });
      }

      // return the updated row
      const selectSql = 'SELECT * FROM achievements_awards WHERE id = ?';
      db.query(selectSql, [awardId], (err2, results) => {
        if (err2) return res.status(500).json({ message: 'Error fetching updated award' });
        if (results.length === 0) return res.status(404).json({ message: 'Award not found' });

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
