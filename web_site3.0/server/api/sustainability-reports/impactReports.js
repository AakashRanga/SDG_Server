import express from "express";
import pool from "../../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

// ES module path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Ensure upload folder exists
const uploadDir = path.join(__dirname, "../../../uploads/impact_reports");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Using shared promise-based pool from server/db.js

// ✅ ADD Impact Report API
router.post(
  "/add-impact-report",
  upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "additional_images", maxCount: 10 },
    { name: "videos", maxCount: 5 },
    { name: "metrics_data", maxCount: 1 },
  ]),
  async (req, res) => {
    const { title, description, category, year, metrics } = req.body;

    if (!title || !description || !category || !year) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const coverImage = req.files["cover_image"]
      ? `/uploads/impact_reports/${req.files["cover_image"][0].filename}`
      : null;

    const additionalImages = req.files["additional_images"]
      ? req.files["additional_images"].map(
          (f) => `/uploads/impact_reports/${f.filename}`
        )
      : [];

    const videos = req.files["videos"]
      ? req.files["videos"].map((f) => `/uploads/impact_reports/${f.filename}`)
      : [];

    const metricsData = req.files["metrics_data"]
      ? `/uploads/impact_reports/${req.files["metrics_data"][0].filename}`
      : null;

    const sql = `
      INSERT INTO impact_reports 
      (title, description, category, year, cover_image, additional_images, videos, metrics_data, metrics)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const metricsJson = metrics ? (typeof metrics === 'string' ? metrics : JSON.stringify(metrics)) : null;

    try {
      const [result] = await pool.query(sql, [
        title,
        description,
        category,
        year,
        coverImage,
        JSON.stringify(additionalImages),
        JSON.stringify(videos),
        metricsData,
        metricsJson,
      ]);

      res.status(201).json({
        message: "✅ Impact report added successfully",
        report: {
          id: result.insertId,
          title,
          description,
          category,
          year,
          cover_image: coverImage,
          additional_images: additionalImages,
          videos,
          metrics_data: metricsData,
          metrics: metricsJson ? JSON.parse(metricsJson) : [],
        },
      });
    } catch (err) {
      console.error("❌ Error inserting impact report:", err);
      return res.status(500).json({ message: "Error inserting impact report" });
    }
  }
);

// ✅ FETCH Impact Reports API
router.get("/impact-reports", async (req, res) => {
  const sql = "SELECT * FROM impact_reports ORDER BY id DESC";
  try {
    const [results] = await pool.query(sql);
    res.status(200).json(results);
  } catch (err) {
    console.error("❌ Error fetching impact reports:", err);
    return res.status(500).json({ message: "Error fetching impact reports" });
  }
});


router.delete("/delete-impact-report/:id", async (req, res) => {
  const reportId = req.params.id;

  const selectSql = "SELECT cover_image, additional_images, videos, metrics_data FROM impact_reports WHERE id = ?";
  const deleteSql = "DELETE FROM impact_reports WHERE id = ?";

  try {
    const [results] = await pool.query(selectSql, [reportId]);
    if (results.length === 0) return res.status(404).json({ message: "Impact report not found" });

    const report = results[0];
    const allFiles = [
      report.cover_image,
      ...(JSON.parse(report.additional_images || "[]")),
      ...(JSON.parse(report.videos || "[]")),
      report.metrics_data,
    ].filter(Boolean);

    allFiles.forEach((filePath) => {
      const fullPath = path.join(__dirname, "../../../", filePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    });

    await pool.query(deleteSql, [reportId]);
    res.status(200).json({ message: "✅ Impact report deleted successfully" });
  } catch (err) {
    console.error('❌ Error deleting impact report:', err);
    return res.status(500).json({ message: 'Error deleting impact report' });
  }
});

// ✅ UPDATE Impact Report API
router.put('/update-impact-report/:id', upload.none(), async (req, res) => {
  const reportId = req.params.id;
  const { title, description, category, year, metrics } = req.body;

  const parseArray = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try { return JSON.parse(field); } catch (e) { return [field]; }
    }
    return [];
  };

  const cover_image = req.body.cover_image || null;
  const additional_images = parseArray(req.body.additional_images);
  const videos = parseArray(req.body.videos);
  const metrics_data = req.body.metrics_data || null;

  const sql = `
    UPDATE impact_reports
    SET title = ?, description = ?, category = ?, year = ?, cover_image = ?, additional_images = ?, videos = ?, metrics_data = ?, metrics = ?
    WHERE id = ?
  `;

  const metricsJson = metrics ? (typeof metrics === 'string' ? metrics : JSON.stringify(metrics)) : null;

  try {
    await pool.query(sql, [title, description, category, year, cover_image, JSON.stringify(additional_images), JSON.stringify(videos), metrics_data, metricsJson, reportId]);
    const selectSql = 'SELECT * FROM impact_reports WHERE id = ?';
    const [results] = await pool.query(selectSql, [reportId]);
    if (results.length === 0) return res.status(404).json({ message: 'Report not found' });
    res.status(200).json({ success: true, data: results[0] });
  } catch (err) {
    console.error('❌ Error updating impact report:', err);
    return res.status(500).json({ message: 'Error updating impact report' });
  }
});

export default router;
/*CREATE TABLE `impact_reports` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `year` YEAR NOT NULL,
  `cover_image` VARCHAR(255) DEFAULT NULL,
  `additional_images` JSON DEFAULT NULL,
  `videos` JSON DEFAULT NULL,
  `metrics_data` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;*/