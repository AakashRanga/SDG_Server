import express from "express";
import pool from "../../db.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const router = express.Router();

// ES module path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//////////////////////////////////////////////////////////
// ✅ ENSURE UPLOAD FOLDER EXISTS
//////////////////////////////////////////////////////////
const uploadDir = path.join(__dirname, "../../../uploads/certificates");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

//////////////////////////////////////////////////////////
// ✅ MULTER CONFIG (WITH VALIDATION)
//////////////////////////////////////////////////////////
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// ✅ File filter (IMPORTANT)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "video/mp4",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images, videos, and PDFs allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB per file
  },
});

//////////////////////////////////////////////////////////
// ✅ HELPER FUNCTION
//////////////////////////////////////////////////////////
const parseJSON = (data) => {
  try {
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

//////////////////////////////////////////////////////////
// ✅ ADD CERTIFICATE
//////////////////////////////////////////////////////////
router.post(
  "/add-certificate",
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 5 },
    { name: "documents", maxCount: 5 },
  ]),
  async (req, res) => {
    const { title, description, category, year, organization, score } = req.body;

    if (!title || !description || !category || !year) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    try {
      const files = req.files || {};

      const images = (files.images || []).map(
        (f) => `/uploads/certificates/${f.filename}`
      );
      const videos = (files.videos || []).map(
        (f) => `/uploads/certificates/${f.filename}`
      );
      const documents = (files.documents || []).map(
        (f) => `/uploads/certificates/${f.filename}`
      );

      const sql = `
        INSERT INTO achievements_certificates 
        (title, description, category, year, organization, score, images, videos, documents)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await pool.query(sql, [
        title,
        description,
        category,
        year,
        organization || null,
        score || null,
        JSON.stringify(images),
        JSON.stringify(videos),
        JSON.stringify(documents),
      ]);

      res.status(201).json({
        message: "✅ Certificate added",
        id: result.insertId,
      });

    } catch (err) {
      console.error("❌ Insert error:", err);

      // 🔥 cleanup uploaded files if DB fails
      if (req.files) {
        Object.values(req.files).flat().forEach((file) => {
          const filePath = path.join(uploadDir, file.filename);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });
      }

      res.status(500).json({ message: "Insert failed" });
    }
  }
);

//////////////////////////////////////////////////////////
// ✅ GET CERTIFICATES
//////////////////////////////////////////////////////////
router.get("/certificates", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM achievements_certificates ORDER BY id DESC"
    );

    const data = rows.map((row) => ({
      ...row,
      images: parseJSON(row.images),
      videos: parseJSON(row.videos),
      documents: parseJSON(row.documents),
    }));

    res.json(data);

  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ message: "Fetch failed" });
  }
});

//////////////////////////////////////////////////////////
// ✅ DELETE CERTIFICATE
//////////////////////////////////////////////////////////
router.delete("/delete-certificate/:id", async (req, res) => {
  try {
    const certId = req.params.id;

    const [rows] = await pool.query(
      "SELECT images, videos, documents FROM achievements_certificates WHERE id=?",
      [certId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    const files = [
      ...parseJSON(rows[0].images),
      ...parseJSON(rows[0].videos),
      ...parseJSON(rows[0].documents),
    ];

    files.forEach((file) => {
      const fullPath = path.join(__dirname, "../../../", file);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    });

    await pool.query("DELETE FROM achievements_certificates WHERE id=?", [certId]);

    res.json({ message: "✅ Deleted successfully" });

  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

//////////////////////////////////////////////////////////
// ✅ UPDATE CERTIFICATE
//////////////////////////////////////////////////////////
router.put("/update-certificate/:id", upload.none(), async (req, res) => {
  try {
    const certId = req.params.id;
    const { title, description, category, year, organization, score } = req.body;

    const images = parseJSON(req.body.images);
    const videos = parseJSON(req.body.videos);
    const documents = parseJSON(req.body.documents);

    const sql = `
      UPDATE achievements_certificates
      SET title=?, description=?, category=?, year=?, organization=?, score=?, images=?, videos=?, documents=?
      WHERE id=?
    `;

    await pool.query(sql, [
      title,
      description,
      category,
      year,
      organization || null,
      score || null,
      JSON.stringify(images),
      JSON.stringify(videos),
      JSON.stringify(documents),
      certId,
    ]);

    const [rows] = await pool.query(
      "SELECT * FROM achievements_certificates WHERE id=?",
      [certId]
    );

    res.json({
      success: true,
      data: {
        ...rows[0],
        images: parseJSON(rows[0].images),
        videos: parseJSON(rows[0].videos),
        documents: parseJSON(rows[0].documents),
      },
    });

  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

export default router;