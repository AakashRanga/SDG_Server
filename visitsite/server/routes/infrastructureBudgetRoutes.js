import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload directory
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({ storage });

// Helper
const safeParse = (value) => {
  try {
    return JSON.parse(value || "[]");
  } catch {
    return [];
  }
};

// Convert DB → frontend
const mapItem = (row) => ({
  ...row,
  images: safeParse(row.images),
  videos: safeParse(row.videos),
});

// ---------------------- GET items by type ----------------------
router.get("/:type", async (req, res) => {
  try {
    const { type } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM infrastructure_budget WHERE type=? ORDER BY id ASC",
      [type]
    );

    res.json(rows.map(mapItem));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- POST new item (with file upload) ----------------------
router.post("/:type", upload.array("images", 10), async (req, res) => {
  try {
    const { type } = req.params;

    const {
      title,
      description,
      value,
      unit,
      year,
      status,
      videos = "[]",
    } = req.body;

    const videoArr = safeParse(videos);

    const imagePaths = (req.files || []).map((f) => `/uploads/${f.filename}`);

    const [result] = await db.query(
      `INSERT INTO infrastructure_budget
      (type, title, description, value, unit, year, status, images, videos)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        type,
        title,
        description,
        value || null,
        unit || null,
        year || null,
        status || null,
        JSON.stringify(imagePaths),
        JSON.stringify(videoArr),
      ]
    );

    const [rows] = await db.query(
      "SELECT * FROM infrastructure_budget WHERE id=?",
      [result.insertId]
    );

    res.json(mapItem(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- UPDATE item (with file upload) ----------------------
router.put("/:id", upload.array("images", 10), async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      value,
      unit,
      year,
      status,
      oldImages = "[]",
      videos = "[]",
    } = req.body;

    const oldImgs = safeParse(oldImages);
    const videosArr = safeParse(videos);

    const newImgs = (req.files || []).map((f) => `/uploads/${f.filename}`);

    const finalImgs = [...oldImgs, ...newImgs];

    await db.query(
      `UPDATE infrastructure_budget SET
        title=?, description=?, value=?, unit=?, year=?, status=?, images=?, videos=?
       WHERE id=?`,
      [
        title,
        description,
        value || null,
        unit || null,
        year || null,
        status || null,
        JSON.stringify(finalImgs),
        JSON.stringify(videosArr),
        id,
      ]
    );

    const [rows] = await db.query(
      "SELECT * FROM infrastructure_budget WHERE id=?",
      [id]
    );

    res.json(mapItem(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- DELETE item ----------------------
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT images FROM infrastructure_budget WHERE id=?",
      [id]
    );

    if (rows.length) {
      const images = safeParse(rows[0].images);
      images.forEach((img) => {
        const file = img.replace("/uploads/", "");
        const filePath = path.join(uploadDir, file);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    await db.query("DELETE FROM infrastructure_budget WHERE id=?", [id]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
