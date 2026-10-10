import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload folder
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

// Helpers
const safeParse = (v) => {
  try {
    return JSON.parse(v || "[]");
  } catch {
    return [];
  }
};

const unique = (arr) => [...new Set(arr)];

// ==============================
// ✅ GET publications by type
// ==============================
router.get("/:type", async (req, res) => {
  try {
    const { type } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM research_publications WHERE type = ? ORDER BY id DESC",
      [type]
    );

    const cleaned = rows.map((item) => ({
      ...item,
      images: unique(safeParse(item.images)),
      files: safeParse(item.files),
      sdgGoals: safeParse(item.sdgGoals),
      link: item.link || null,
    }));

    res.json(cleaned);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// ✅ POST publication
// ==============================
router.post(
  "/:type",
  upload.fields([{ name: "images" }, { name: "files" }]),
  async (req, res) => {
    try {
      const { type } = req.params;
      const { title, description, year, sdgGoals, link } = req.body;

      // Uploaded files
      const imageFiles = req.files?.images || [];
      const docFiles = req.files?.files || [];

      const imageArray = unique(
        imageFiles.map((f) => `/uploads/${f.filename}`)
      );

      const fileArray = docFiles.map((f) => ({
        name: f.originalname,
        url: `/uploads/${f.filename}`,
        size: (f.size / 1024 / 1024).toFixed(2) + " MB",
      }));

      const sdgArray = safeParse(sdgGoals);

      const [result] = await db.query(
        `INSERT INTO research_publications 
          (type, title, description, year, images, files, sdgGoals, link)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          type,
          title,
          description,
          year,
          JSON.stringify(imageArray),
          JSON.stringify(fileArray),
          JSON.stringify(sdgArray),
          link || null,
        ]
      );

      res.json({
        id: result.insertId,
        type,
        title,
        description,
        year,
        images: imageArray,
        files: fileArray,
        sdgGoals: sdgArray,
        link: link || null,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ==============================
// ✅ PUT update publication
// ==============================
router.put(
  "/:id",
  upload.fields([{ name: "images" }, { name: "files" }]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, year, oldImages, oldFiles, sdgGoals, link } =
        req.body;

      const prevImages = unique(safeParse(oldImages));
      const prevFiles = safeParse(oldFiles);

      const newImages = (req.files?.images || []).map(
        (f) => `/uploads/${f.filename}`
      );

      const newFiles = (req.files?.files || []).map((f) => ({
        name: f.originalname,
        url: `/uploads/${f.filename}`,
        size: (f.size / 1024 / 1024).toFixed(2) + " MB",
      }));

      const finalImages = unique([...prevImages, ...newImages]);
      const finalFiles = [...prevFiles, ...newFiles];
      const sdgArray = safeParse(sdgGoals);

      await db.query(
        `UPDATE research_publications SET
          title=?, description=?, year=?, images=?, files=?, sdgGoals=?, link=?
         WHERE id=?`,
        [
          title,
          description,
          year,
          JSON.stringify(finalImages),
          JSON.stringify(finalFiles),
          JSON.stringify(sdgArray),
          link || null,
          id,
        ]
      );

      res.json({
        id,
        title,
        description,
        year,
        images: finalImages,
        files: finalFiles,
        sdgGoals: sdgArray,
        link: link || null,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ==============================
// ✅ DELETE publication + files
// ==============================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT images, files FROM research_publications WHERE id=?",
      [id]
    );

    if (rows.length) {
      const imgs = safeParse(rows[0].images);
      const files = safeParse(rows[0].files);

      const filePaths = [...imgs, ...files.map((f) => f.url)].filter(Boolean);

      filePaths.forEach((file) => {
        const clean = file.replace("/uploads/", "");
        const abs = path.join(uploadDir, clean);
        if (fs.existsSync(abs)) fs.unlinkSync(abs);
      });
    }

    await db.query("DELETE FROM research_publications WHERE id=?", [id]);

    res.json({ message: "Publication deleted", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
