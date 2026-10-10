import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../../uploads/");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

// Safe JSON parse
const safeParse = (v) => {
  try {
    return v ? JSON.parse(v) : [];
  } catch {
    return [];
  }
};

/* ✅ GET ALL ITEMS */
router.get("/:type", async (req, res) => {
  const { type } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM student_research WHERE type = ? ORDER BY id DESC",
      [type]
    );

    const data = rows.map((r) => ({
      id: r.id,
      type: r.type,
      title: r.title,
      description: r.description,
      year: r.year,
      link: r.link || "",
      images: safeParse(r.images),
      files: safeParse(r.files),
      sdgGoals: safeParse(r.sdgGoals),
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ✅ CREATE NEW ITEM */
router.post(
  "/:type",
  upload.fields([{ name: "images" }, { name: "files" }]),
  async (req, res) => {
    const { type } = req.params;
    const { title, description, year, link, sdgGoals } = req.body;

    const imageFiles = req.files?.images || [];
    const fileUploads = req.files?.files || [];

    const images = imageFiles.map((f) => `/uploads/${f.filename}`);
    const files = fileUploads.map((f) => ({
      name: f.originalname,
      url: `/uploads/${f.filename}`,
    }));

    try {
      const [result] = await db.query(
        `INSERT INTO student_research 
         (type, title, description, year, link, images, files, sdgGoals)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          type,
          title,
          description,
          year || "",
          link || "",
          JSON.stringify(images),
          JSON.stringify(files),
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
        images,
        files,
        sdgGoals: safeParse(sdgGoals),
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ✅ UPDATE ITEM */
router.put(
  "/:id",
  upload.fields([{ name: "images" }, { name: "files" }]),
  async (req, res) => {
    const { id } = req.params;
    const { title, description, year, link, oldImages, oldFiles, sdgGoals } =
      req.body;

    const prevImages = safeParse(oldImages);
    const prevFiles = safeParse(oldFiles);

    const newImages = (req.files?.images || []).map(
      (f) => `/uploads/${f.filename}`
    );
    const newFiles = (req.files?.files || []).map((f) => ({
      name: f.originalname,
      url: `/uploads/${f.filename}`,
    }));

    const finalImages = [...prevImages, ...newImages];
    const finalFiles = [...prevFiles, ...newFiles];

    try {
      await db.query(
        `UPDATE student_research 
         SET title=?, description=?, year=?, link=?, images=?, files=?, sdgGoals=? 
         WHERE id=?`,
        [
          title,
          description,
          year || "",
          link || "",
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

/* ✅ DELETE ITEM + FILES */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT images, files FROM student_research WHERE id = ?",
      [id]
    );

    if (rows.length > 0) {
      const imgs = safeParse(rows[0].images);
      const files = safeParse(rows[0].files);
      const all = [...imgs, ...files.map((f) => f.url)];

      all.forEach((file) => {
        const filePath = path.join(uploadDir, path.basename(file));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    await db.query("DELETE FROM student_research WHERE id = ?", [id]);
    res.json({ message: "Student research deleted", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
