import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

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

const safeParse = (v) => {
  try {
    return JSON.parse(v || "[]");
  } catch {
    return [];
  }
};

const unique = (arr) => [...new Set(arr)];

// ==========================================
// ✅ GET Courses by type
// ==========================================
router.get("/:type", async (req, res) => {
  try {
    const { type } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM research_courses WHERE type = ? ORDER BY id DESC",
      [type]
    );

    const cleaned = rows.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      year: item.year,
      link: item.link || "", // ✅ return link
      images: unique(safeParse(item.images)),
      files: safeParse(item.files),
      sdgGoals: safeParse(item.sdgGoals),
    }));

    res.json(cleaned);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// ✅ POST Course
// ==========================================
router.post(
  "/:type",
  upload.fields([{ name: "images" }, { name: "files" }]),
  async (req, res) => {
    try {
      const { type } = req.params;
      const { title, description, year, link, sdgGoals } = req.body;

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

      const [result] = await db.query(
        `INSERT INTO research_courses 
          (type, title, description, year, link, images, files, sdgGoals)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          type,
          title,
          description,
          year,
          link || "", // ✅ include link
          JSON.stringify(imageArray),
          JSON.stringify(fileArray),
          sdgGoals || "[]",
        ]
      );

      res.json({
        id: result.insertId,
        type,
        title,
        description,
        year,
        link,
        images: imageArray,
        files: fileArray,
        sdgGoals: safeParse(sdgGoals),
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ==========================================
// ✅ UPDATE Course
// ==========================================
router.put(
  "/:id",
  upload.fields([{ name: "images" }, { name: "files" }]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, year, link, oldImages, oldFiles, sdgGoals } =
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

      await db.query(
        `UPDATE research_courses SET 
          title=?, description=?, year=?, link=?, images=?, files=?, sdgGoals=? 
         WHERE id=?`,
        [
          title,
          description,
          year,
          link || "", // ✅ update link
          JSON.stringify(finalImages),
          JSON.stringify(finalFiles),
          sdgGoals || "[]",
          id,
        ]
      );

      res.json({
        id,
        title,
        description,
        year,
        link,
        images: finalImages,
        files: finalFiles,
        sdgGoals: safeParse(sdgGoals),
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ==========================================
// ✅ DELETE Course + Files
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT images, files FROM research_courses WHERE id=?",
      [id]
    );

    if (rows.length) {
      const imgs = safeParse(rows[0].images);
      const files = safeParse(rows[0].files);

      const filePaths = [...imgs, ...files.map((f) => f.url)];

      filePaths.forEach((file) => {
        const clean = file.replace("/uploads/", "");
        const abs = path.join(uploadDir, clean);
        if (fs.existsSync(abs)) fs.unlinkSync(abs);
      });
    }

    await db.query("DELETE FROM research_courses WHERE id=?", [id]);

    res.json({ message: "Course deleted", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
