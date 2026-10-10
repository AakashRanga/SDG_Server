import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

// --------------------------------
// FIX __dirname FOR ES MODULES
// --------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------------------
// UPLOAD DIRECTORY
// --------------------------------
const uploadDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Uploads folder created:", uploadDir);
}

// --------------------------------
// MULTER STORAGE
// --------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // 🔥 upload always here
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "_" + file.originalname.replace(/\s+/g, "_")
    );
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// --------------------------------
// HELPERS
// --------------------------------
const safeParse = (v) => {
  try {
    return JSON.parse(v || "[]");
  } catch {
    return [];
  }
};

// --------------------------------
// GET ITEMS
// --------------------------------
router.get("/:type", async (req, res) => {
  try {
    const { type } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM infrastructure WHERE type=? ORDER BY id DESC",
      [type]
    );

    const cleaned = rows.map((row) => ({
      ...row,
      imageLink: safeParse(row.imageLink),
      videoLink: safeParse(row.videoLink),
    }));

    res.json(cleaned);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------
// CREATE ITEM
// --------------------------------
router.post("/:type", upload.array("images", 10), async (req, res) => {
  try {
    const { type } = req.params;
    const { title, description, value, unit, year, status } = req.body;

    const videos = safeParse(req.body.videoLink);

    // Uploaded image paths
    const images = (req.files || []).map(
      (f) => `/uploads/${f.filename}`
    );

    const [result] = await db.query(
      `INSERT INTO infrastructure 
        (type, title, description, value, unit, year, status, imageLink, videoLink)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        type,
        title,
        description,
        value,
        unit,
        year,
        status,
        JSON.stringify(images),
        JSON.stringify(videos),
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
      imageLink: images,
      videoLink: videos
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------
// UPDATE ITEM (Improved)
// --------------------------------
router.put("/:id", upload.array("images", 10), async (req, res) => {
  try {
    const { id } = req.params;

    // Destructure form fields
    const {
      title = "",
      description = "",
      value = "",
      unit = "",
      year = "",
      status = "",
      oldImages = "[]",
      videos = "[]",
      videoLink, // fallback if videos not sent
    } = req.body;

    // Parse old images sent from frontend
    const oldImagesArray = safeParse(oldImages);

    // Parse videos (either from `videos` or `videoLink`)
    const videoArray = safeParse(videos || videoLink);

    // Handle newly uploaded images
    const newImages = (req.files || []).map(
      (f) => `/uploads/${f.filename}`
    );

    // Final images array = old kept + newly uploaded
    const finalImages = [...oldImagesArray, ...newImages];

    // Update DB
    await db.query(
      `UPDATE infrastructure SET
        title = ?, 
        description = ?, 
        value = ?, 
        unit = ?, 
        year = ?, 
        status = ?, 
        imageLink = ?, 
        videoLink = ?
      WHERE id = ?`,
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

    // Return updated item
    res.json({
      id,
      title,
      description,
      value,
      unit,
      year,
      status,
      imageLink: finalImages,
      videoLink: videoArray,
    });

  } catch (err) {
    console.error("Error updating infrastructure item:", err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------
// DELETE ITEM + IMAGES
// --------------------------------
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT imageLink FROM infrastructure WHERE id=?",
      [id]
    );

    if (rows.length) {
      const images = safeParse(rows[0].imageLink);

      images.forEach((img) => {
        const filename = img.replace("/uploads/", "");
        const absPath = path.join(uploadDir, filename);

        if (fs.existsSync(absPath)) {
          fs.unlinkSync(absPath);
        }
      });
    }

    await db.query("DELETE FROM infrastructure WHERE id=?", [id]);

    res.json({ message: "Deleted successfully", id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
