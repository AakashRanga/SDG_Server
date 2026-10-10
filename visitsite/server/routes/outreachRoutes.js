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
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

const safeParse = (v) => {
  try {
    return JSON.parse(v || "[]");
  } catch {
    return [];
  }
};
const unique = (arr) => [...new Set(arr)];

/* ✅ GET outreach items */
router.get("/:type", async (req, res) => {
  const { type } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM outreach WHERE type=? ORDER BY id DESC",
      [type]
    );

    res.json(
      rows.map((item) => ({
        ...item,
        images: unique(safeParse(item.images)),
        files: safeParse(item.files),
        sdgGoals: safeParse(item.sdgGoals),
        link: item.link || null,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ✅ ADD outreach item */
router.post(
  "/:type",
  upload.fields([{ name: "images" }, { name: "files" }]),
  async (req, res) => {
    const { type } = req.params;
    const { title, description, year, link, sdgGoals } = req.body;

    const imgFiles = req.files?.images || [];
    const fileUploads = req.files?.files || [];

    const images = imgFiles.map((f) => `/uploads/${f.filename}`);
    const files = fileUploads.map((f) => ({
      name: f.originalname,
      url: `/uploads/${f.filename}`,
      size: (f.size / 1024 / 1024).toFixed(2) + " MB",
    }));

    const sdgs = safeParse(sdgGoals);

    try {
      const [result] = await db.query(
        `INSERT INTO outreach (type, title, description, year, images, files, sdgGoals, link)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          type,
          title,
          description,
          year,
          JSON.stringify(images),
          JSON.stringify(files),
          JSON.stringify(sdgs),
          link || null,
        ]
      );

      res.json({
        id: result.insertId,
        type,
        title,
        description,
        year,
        images,
        files,
        sdgGoals: sdgs,
        link: link || null,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ✅ UPDATE outreach item */
router.put(
  "/:id",
  upload.fields([{ name: "images" }, { name: "files" }]),
  async (req, res) => {
    const { id } = req.params;
    const { title, description, year, oldImages, oldFiles, link, sdgGoals } =
      req.body;

    const prevImgs = unique(safeParse(oldImages));
    const prevFiles = safeParse(oldFiles);

    const newImgs = (req.files?.images || []).map(
      (f) => `/uploads/${f.filename}`
    );
    const newDocs = (req.files?.files || []).map((f) => ({
      name: f.originalname,
      url: `/uploads/${f.filename}`,
      size: (f.size / 1024 / 1024).toFixed(2) + " MB",
    }));

    const finalImgs = unique([...prevImgs, ...newImgs]);
    const finalFiles = [...prevFiles, ...newDocs];
    const sdgs = safeParse(sdgGoals);

    try {
      await db.query(
        `UPDATE outreach SET
          title=?, description=?, year=?, images=?, files=?, sdgGoals=?, link=?
        WHERE id=?`,
        [
          title,
          description,
          year,
          JSON.stringify(finalImgs),
          JSON.stringify(finalFiles),
          JSON.stringify(sdgs),
          link || null,
          id,
        ]
      );

      res.json({
        id,
        title,
        description,
        year,
        images: finalImgs,
        files: finalFiles,
        sdgGoals: sdgs,
        link: link || null,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ✅ DELETE outreach item + files */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT images, files FROM outreach WHERE id=?",
      [id]
    );
    if (rows.length) {
      const imgs = safeParse(rows[0].images);
      const files = safeParse(rows[0].files);
      const paths = [...imgs, ...files.map((f) => f.url)];

      paths.forEach((p) => {
        const file = p.replace("/uploads/", "");
        const abs = path.join(uploadDir, file);
        if (fs.existsSync(abs)) fs.unlinkSync(abs);
      });
    }

    await db.query("DELETE FROM outreach WHERE id=?", [id]);
    res.json({ message: "Deleted", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
