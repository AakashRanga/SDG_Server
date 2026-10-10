import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

// -----------------------------
// FIX __dirname
// -----------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------
// UPLOAD DIRECTORY (ROOT /uploads)
// -----------------------------
const uploadDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// -----------------------------
// MULTER STORAGE
// -----------------------------
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({ storage });

// -----------------------------
// SAFE PARSE JSON
// -----------------------------
const safeJSON = (v) => {
  try {
    return JSON.parse(v || "[]");
  } catch {
    return [];
  }
};

// -----------------------------
// GET ITEMS
// -----------------------------
router.get("/:type", async (req, res) => {
  const { type } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM smart_buildings WHERE type=? ORDER BY id ASC",
      [type]
    );

    const cleaned = rows.map((row) => ({
      ...row,
      images: safeJSON(row.images),
      videos: safeJSON(row.videos),
    }));

    res.json(cleaned);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// CREATE ITEM
// -----------------------------
router.post("/:type", upload.array("images", 10), async (req, res) => {
  try {
    const { type } = req.params;
    const { title, description, value, unit, year, status, videos } = req.body;

    const imagePaths = (req.files || []).map(
      (f) => `/uploads/${f.filename}`
    );

    const videosArray = safeJSON(videos);

    const [result] = await db.query(
      `INSERT INTO smart_buildings 
        (type, title, description, value, unit, year, status, images, videos)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        type,
        title,
        description,
        value,
        unit,
        year,
        status,
        JSON.stringify(imagePaths),
        JSON.stringify(videosArray),
      ]
    );

    res.json({
      id: result.insertId,
      type,
      title,
      description,
      value,
      unit,
      year,
      status,
      images: imagePaths,
      videos: videosArray,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// UPDATE ITEM
// -----------------------------
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

    const keptImages = safeJSON(oldImages);
    const newImages = (req.files || []).map(
      (f) => `/uploads/${f.filename}`
    );

    const finalImages = [...keptImages, ...newImages];
    const videoArray = safeJSON(videos);

    await db.query(
      `UPDATE smart_buildings SET
         title=?, description=?, value=?, unit=?, year=?, status=?, 
         images=?, videos=?
       WHERE id=?`,
      [
        title,
        description,
        value,
        unit,
        year,
        status,
        JSON.stringify(finalImages),
        JSON.stringify(videoArray),
        id,
      ]
    );

    res.json({
      id,
      title,
      description,
      value,
      unit,
      year,
      status,
      images: finalImages,
      videos: videoArray,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// DELETE ITEM
// -----------------------------
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM smart_buildings WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
