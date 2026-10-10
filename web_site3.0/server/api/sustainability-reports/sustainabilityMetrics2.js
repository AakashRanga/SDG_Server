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
const uploadDir = path.join(__dirname, "../../../uploads/sustainability_metrics");
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

// Using promise-based pool from ../../db.js

// ✅ ADD Sustainability Metric API
router.post(
  "/add-sustainability-metric",
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
      ? `/uploads/sustainability_metrics/${req.files["cover_image"][0].filename}`
      : null;

    const additionalImages = req.files["additional_images"]
      ? req.files["additional_images"].map(
          (f) => `/uploads/sustainability_metrics/${f.filename}`
        )
      : [];

    const videos = req.files["videos"]
      ? req.files["videos"].map((f) => `/uploads/sustainability_metrics/${f.filename}`)
      : [];

    const metricsData = req.files["metrics_data"]
      ? `/uploads/sustainability_metrics/${req.files["metrics_data"][0].filename}`
      : null;

    const sql = `
      INSERT INTO sustainability_metrics 
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
          message: "✅ Sustainability metric added successfully",
          metric: {
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
        console.error("❌ Error inserting sustainability metric:", err);
        return res.status(500).json({ message: "Error inserting sustainability metric" });
      }
  }
);

// ✅ FETCH Sustainability Metrics API
router.get("/sustainability-metrics", async (req, res) => {
  const sql = "SELECT * FROM sustainability_metrics ORDER BY id DESC";
    try {
      const [results] = await pool.query(sql);
      res.status(200).json(results);
    } catch (err) {
      console.error("❌ Error fetching sustainability metrics:", err);
      return res.status(500).json({ message: "Error fetching sustainability metrics" });
    }
});

router.delete("/delete-sustainability-metric/:id", async (req, res) => {
  const metricId = req.params.id;

  const selectSql = "SELECT cover_image, additional_images, videos, metrics_data FROM sustainability_metrics WHERE id = ?";
  const deleteSql = "DELETE FROM sustainability_metrics WHERE id = ?";

    try {
      const [rows] = await pool.query(selectSql, [metricId]);
      if (rows.length === 0) return res.status(404).json({ message: "Metric not found" });

      const metric = rows[0];
      const allFiles = [
        metric.cover_image,
        ...(JSON.parse(metric.additional_images || "[]")),
        ...(JSON.parse(metric.videos || "[]")),
        metric.metrics_data,
      ].filter(Boolean);

      allFiles.forEach((filePath) => {
        const fullPath = path.join(__dirname, "../../../", filePath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });

      await pool.query(deleteSql, [metricId]);
      res.status(200).json({ message: "✅ Sustainability metric deleted successfully" });
    } catch (err) {
      console.error("❌ Error deleting sustainability metric:", err);
      return res.status(500).json({ message: "Error deleting metric" });
    }
});

// ✅ UPDATE Sustainability Metric API (accept optional cover_image, additional_images and metrics_data files)
router.put('/update-sustainability-metric/:id', upload.fields([
  { name: 'cover_image', maxCount: 1 },
  { name: 'additional_images', maxCount: 10 },
  { name: 'metrics_data', maxCount: 1 }
]), async (req, res) => {
  const metricId = req.params.id;
  const { title, description, category, year, metrics } = req.body;

  const parseArray = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try { return JSON.parse(field); } catch (e) { return [field]; }
    }
    return [];
  };

  // Handle cover image: either provided as string path or uploaded file
  let cover_image = req.body.cover_image || null;
  if (req.files && req.files.cover_image && req.files.cover_image[0]) {
    cover_image = `/uploads/sustainability_metrics/${req.files.cover_image[0].filename}`;
  }

  // additional_images: merge existing paths from body with newly uploaded files
  const additional_images = parseArray(req.body.additional_images);
  if (req.files && req.files.additional_images) {
    const uploaded = req.files.additional_images.map(f => `/uploads/sustainability_metrics/${f.filename}`);
    uploaded.forEach(u => additional_images.push(u));
  }

  const videos = parseArray(req.body.videos);

  // support file upload for metrics_data via multer on update
  let metrics_data = req.body.metrics_data || null;
  if (req.files && req.files.metrics_data && req.files.metrics_data[0]) {
    metrics_data = `/uploads/sustainability_metrics/${req.files.metrics_data[0].filename}`;
  }

  const sql = `
    UPDATE sustainability_metrics
    SET title = ?, description = ?, category = ?, year = ?, cover_image = ?, additional_images = ?, videos = ?, metrics_data = ?, metrics = ?
    WHERE id = ?
  `;

  const metricsJson = metrics ? (typeof metrics === 'string' ? metrics : JSON.stringify(metrics)) : null;

  try {
    await pool.query(sql, [title, description, category, year, cover_image, JSON.stringify(additional_images), JSON.stringify(videos), metrics_data, metricsJson, metricId]);
    const [rows] = await pool.query('SELECT * FROM sustainability_metrics WHERE id = ?', [metricId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Metric not found' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('❌ Error updating sustainability metric:', err);
    return res.status(500).json({ message: 'Error updating sustainability metric' });
  }
});


export default router;
/*CREATE TABLE `sustainability_metrics` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
*/