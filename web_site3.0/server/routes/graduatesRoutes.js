import express from "express";
import db from "../db.js";import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload directory
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024, fieldSize: 20 * 1024 * 1024 },
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

/* =======================================
   GET Graduate list by type 
   (placed / higher-studies / entrepreneurs etc)
======================================= */
router.get("/:type", async (req, res) => {
  try {
    const { type } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM graduates WHERE type = ? ORDER BY id DESC",
      [type]
    );

    const data = rows.map((item) => ({
      ...item,
      images: unique(safeParse(item.images)),
      files: safeParse(item.files),
      sdgGoals: safeParse(item.sdgGoals),
      link: item.link || null,
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =======================================
   CREATE Graduate record
======================================= */
router.post(
  "/:type",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "files", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const { type } = req.params;
      const { title, description, year, sdgGoals, link } = req.body;

      const imgFiles = req.files?.images || [];
      const docFiles = req.files?.files || [];

      const imageArray = imgFiles.map((f) => `/uploads/${f.filename}`);

      const fileArray = docFiles.map((f) => ({
        name: f.originalname,
        url: `/uploads/${f.filename}`,
        size: (f.size / 1024 / 1024).toFixed(2) + " MB",
      }));

      const sdgArray = safeParse(sdgGoals);

      const [result] = await db.query(
        `INSERT INTO graduates 
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
      console.error("GRAD POST ERROR", err);
      res.status(500).json({ error: err.message });
    }
  }
);

/* =======================================
   UPDATE Graduate record
======================================= */
router.put(
  "/:id",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "files", maxCount: 10 },
  ]),
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

      const images = unique([...prevImages, ...newImages]);
      const files = [...prevFiles, ...newFiles];

      const sdgArray = safeParse(sdgGoals);

      await db.query(
        `UPDATE graduates SET 
          title=?, description=?, year=?, images=?, files=?, sdgGoals=?, link=?
         WHERE id=?`,
        [
          title,
          description,
          year,
          JSON.stringify(images),
          JSON.stringify(files),
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
        images,
        files,
        sdgGoals: sdgArray,
        link: link || null,
      });
    } catch (err) {
      console.error("GRAD UPDATE ERROR", err);
      res.status(500).json({ error: err.message });
    }
  }
);

/* =======================================
   DELETE Graduate + Files
======================================= */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT images, files FROM graduates WHERE id = ?",
      [id]
    );

    if (rows.length) {
      const imgs = safeParse(rows[0].images);
      const docs = safeParse(rows[0].files);

      const filePaths = [...imgs, ...docs.map((f) => f.url)].filter(Boolean);

      filePaths.forEach((file) => {
        const clean = file.replace("/uploads/", "");
        const abs = path.join(uploadDir, clean);
        if (fs.existsSync(abs)) fs.unlinkSync(abs);
      });
    }

    await db.query("DELETE FROM graduates WHERE id = ?", [id]);
    res.json({ message: "Graduate record deleted", id });
  } catch (err) {
    console.error("GRAD DELETE ERROR", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
