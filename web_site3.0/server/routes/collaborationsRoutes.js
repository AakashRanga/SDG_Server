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
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

const safeParse = (v) => {
  try {
    return v ? JSON.parse(v) : [];
  } catch {
    return [];
  }
};

/* ✅ GET BY TYPE */
router.get("/:type", async (req, res) => {
  const { type } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM collaborations WHERE type=? ORDER BY id DESC",
      [type]
    );

    res.json(
      rows.map((r) => ({
        id: r.id,
        type: r.type,
        title: r.title,
        description: r.description,
        year: r.year,
        link: r.link || "",
        sdgGoals: safeParse(r.sdgGoals),
        images: safeParse(r.images),
        files: safeParse(r.files),
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ✅ ADD COLLABORATION */
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
        `INSERT INTO collaborations (type, title, description, year, link, images, files, sdgGoals)
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

/* ✅ UPDATE COLLABORATION */
router.put(
  "/:id",
  upload.fields([{ name: "images" }, { name: "files" }]),
  async (req, res) => {
    const { id } = req.params;
    const { title, description, year, link, oldImages, oldFiles, sdgGoals } =
      req.body;

    const existingImages = safeParse(oldImages);
    const existingFiles = safeParse(oldFiles);

    const newImages = (req.files?.images || []).map(
      (f) => `/uploads/${f.filename}`
    );
    const newFiles = (req.files?.files || []).map((f) => ({
      name: f.originalname,
      url: `/uploads/${f.filename}`,
    }));

    const finalImages = [...existingImages, ...newImages];
    const finalFiles = [...existingFiles, ...newFiles];

    try {
      await db.query(
        `UPDATE collaborations
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

/* ✅ DELETE + FILES */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT images, files FROM collaborations WHERE id=?",
      [id]
    );

    if (rows.length > 0) {
      const imgs = safeParse(rows[0].images);
      const files = safeParse(rows[0].files);
      [...imgs, ...files.map((f) => f.url)].forEach((file) => {
        const filepath = path.join(uploadDir, path.basename(file));
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      });
    }

    await db.query("DELETE FROM collaborations WHERE id=?", [id]);
    res.json({ message: "Collaboration deleted", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
