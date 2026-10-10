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

// Upload directory (root /uploads)
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

// GET items
router.get("/:type", async (req, res) => {
  const { type } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM wellness WHERE type=? ORDER BY id DESC",
      [type]
    );
    res.json(rows.map(mapItem));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE (POST) with FILE UPLOAD
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

    const parsedVideos = safeParse(videos);

    // Save uploaded images
    const imagePaths = (req.files || []).map((f) => `/uploads/${f.filename}`);

    const [result] = await db.query(
      `INSERT INTO wellness 
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
        JSON.stringify(parsedVideos),
      ]
    );

    const [rows] = await db.query("SELECT * FROM wellness WHERE id=?", [
      result.insertId,
    ]);

    res.json(mapItem(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE (PUT) with FILE UPLOAD
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

    const newImages = (req.files || []).map((f) => `/uploads/${f.filename}`);

    const finalImages = [...keptImages, ...newImages];

    await db.query(
      `UPDATE wellness SET
        title=?, description=?, value=?, unit=?, year=?, status=?, 
        images=?, videos=?
       WHERE id=?`,
      [
        title,
        description,
        value || null,
        unit || null,
        year || null,
        status || null,
        JSON.stringify(finalImages),
        JSON.stringify(videoArray),
        id,
      ]
    );

    const [rows] = await db.query("SELECT * FROM wellness WHERE id=?", [id]);

    res.json(mapItem(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query("SELECT images FROM wellness WHERE id=?", [
      id,
    ]);

    if (rows.length) {
      const imgs = safeParse(rows[0].images);
      imgs.forEach((img) => {
        const filename = img.replace("/uploads/", "");
        const filepath = path.join(uploadDir, filename);
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      });
    }

    await db.query("DELETE FROM wellness WHERE id=?", [id]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
