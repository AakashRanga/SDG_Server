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
    cb(
      null,
      Date.now() + "_" + file.originalname.replace(/\s+/g, "_")
    );
  },
});

const upload = multer({ storage });

// -----------------------------
// HELPERS
// -----------------------------
const safeParse = (v) => {
  try {
    return JSON.parse(v || "[]");
  } catch {
    return [];
  }
};

const mapItem = (row) => ({
  ...row,
  images: safeParse(row.images),
  videos: safeParse(row.videos),
});

// -----------------------------
// GET ITEMS
// -----------------------------
router.get("/:type", async (req, res) => {
  try {
    const { type } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM accessibility WHERE type=? ORDER BY id DESC",
      [type]
    );

    res.json(rows.map(mapItem));
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
    const { title, description, value, unit, year, status } = req.body;

    const videos = safeParse(req.body.videos);

    // Save images into root /uploads
    const imagePaths = (req.files || []).map(
      (f) => `/uploads/${f.filename}`
    );

    const [result] = await db.query(
      `INSERT INTO accessibility 
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
        JSON.stringify(videos),
      ]
    );

    const [rows] = await db.query(
      "SELECT * FROM accessibility WHERE id=?",
      [result.insertId]
    );

    res.json(mapItem(rows[0]));
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

    const keptImages = safeParse(oldImages);
    const videoArray = safeParse(videos);

    const newImages = (req.files || []).map(
      (f) => `/uploads/${f.filename}`
    );

    const finalImages = [...keptImages, ...newImages];

    await db.query(
      `UPDATE accessibility SET
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

    const [rows] = await db.query(
      "SELECT * FROM accessibility WHERE id=?",
      [id]
    );

    res.json(mapItem(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// DELETE ITEM + DELETE IMAGES
// -----------------------------
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT images FROM accessibility WHERE id=?",
      [id]
    );

    if (rows.length) {
      const imgs = safeParse(rows[0].images);

      imgs.forEach((img) => {
        const filename = img.replace("/uploads/", "");
        const filepath = path.join(uploadDir, filename);
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      });
    }

    await db.query("DELETE FROM accessibility WHERE id=?", [id]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
