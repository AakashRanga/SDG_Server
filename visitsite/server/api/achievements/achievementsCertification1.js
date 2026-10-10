import express from "express";
import { db } from "../../db.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const router = express.Router();

// ES module path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Multer storage setup for multiple file types
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadFolder = "../../../uploads/certificates";

    // You can further organize by file type if you want
    cb(null, path.join(__dirname, uploadFolder));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });



// ✅ ADD certificate API
router.post(
  "/add-certificate",
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 5 },
    { name: "documents", maxCount: 5 },
  ]),
  (req, res) => {
    const { title, description, category, year, organization, score } = req.body;

    // File handling
    const images = req.files["images"]
      ? req.files["images"].map((f) => `/uploads/certificates/${f.filename}`)
      : [];
    const videos = req.files["videos"]
      ? req.files["videos"].map((f) => `/uploads/certificates/${f.filename}`)
      : [];
    const documents = req.files["documents"]
      ? req.files["documents"].map((f) => `/uploads/certificates/${f.filename}`)
      : [];

    if (!title || !description || !category || !year) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const sql = `
      INSERT INTO achievements_certificates 
      (title, description, category, year, organization, score, images, videos, documents)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        title,
        description,
        category,
        year,
        organization || null,
        score || null,
        JSON.stringify(images),
        JSON.stringify(videos),
        JSON.stringify(documents),
      ],
      (err, result) => {
        if (err) {
          console.error("❌ Error inserting certificate:", err);
          return res.status(500).json({ message: "Error inserting award" });
        }

        res.status(201).json({
          message: "✅ certificate added successfully",
          certificate: {
            id: result.insertId,
            title,
            description,
            category,
            year,
            organization,
            score,
            images,
            videos,
            documents,
          },
        });
      }
    );
  }
);

// ✅ FETCH Certificates API
router.get("/certificates", (req, res) => {
  const sql = "SELECT * FROM achievements_certificates ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching certificates:", err);
      return res.status(500).json({ message: "Error fetching certificates" });
    }

    // ✅ Parse JSON fields safely
    const parsedResults = results.map((row) => ({
      ...row,
      images: row.images ? JSON.parse(row.images) : [],
      videos: row.videos ? JSON.parse(row.videos) : [],
      documents: row.documents ? JSON.parse(row.documents) : [],
    }));

    res.status(200).json(parsedResults);
  });
});

router.delete("/delete-certificate/:id", (req, res) => {
  const certificateId = req.params.id;

  // 1️⃣ Select the certificate entry first (to know which files to delete)
  const selectSql = "SELECT images, videos, documents FROM achievements_certificates WHERE id = ?";
  const deleteSql = "DELETE FROM achievements_certificates WHERE id = ?";

  db.query(selectSql, [certificateId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching certificate:", err);
      return res.status(500).json({ message: "Error fetching certificate" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    const certificate = results[0];

    // 2️⃣ Collect all files (images, videos, documents)
    const allFiles = [
      ...(JSON.parse(certificate.images || "[]")),
      ...(JSON.parse(certificate.videos || "[]")),
      ...(JSON.parse(certificate.documents || "[]")),
    ];

    // 3️⃣ Delete each file if it exists
    allFiles.forEach((filePath) => {
      const fullPath = path.join(__dirname, "../../../", filePath);
      try {
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log(`🗑️ Deleted file: ${fullPath}`);
        }
      } catch (err) {
        console.warn(`⚠️ Could not delete file: ${filePath}`, err);
      }
    });

    db.query(deleteSql, [certificateId], (err2) => {
      if (err2) {
        console.error("❌ Error deleting certificate:", err2);
        return res.status(500).json({ message: "Error deleting certificate" });
      }

      res.status(200).json({ message: "✅ Certificate deleted successfully" });
    });
  });
});

// ✅ UPDATE Certificate API
router.put('/update-certificate/:id', upload.none(), (req, res) => {
  const certId = req.params.id;
  const { title, description, category, year, organization, score } = req.body;

  const parseArrayField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field.map(normalize);
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        if (Array.isArray(parsed)) return parsed.map(normalize);
      } catch (e) {}
      return [field];
    }
    return [];
  };

  const normalize = (entry) => {
    if (!entry) return entry;
    if (typeof entry === 'string') return entry;
    if (entry.url && typeof entry.url === 'string') return entry.url;
    return entry;
  };

  const images = parseArrayField(req.body.images);
  const videos = parseArrayField(req.body.videos);
  const documents = parseArrayField(req.body.documents);

  const sql = `
    UPDATE achievements_certificates
    SET title = ?, description = ?, category = ?, year = ?, organization = ?, score = ?, images = ?, videos = ?, documents = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
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
    ],
    (err) => {
      if (err) {
        console.error('❌ Error updating certificate:', err);
        return res.status(500).json({ message: 'Error updating certificate' });
      }

      const selectSql = 'SELECT * FROM achievements_certificates WHERE id = ?';
      db.query(selectSql, [certId], (err2, results) => {
        if (err2) return res.status(500).json({ message: 'Error fetching updated certificate' });
        if (results.length === 0) return res.status(404).json({ message: 'Certificate not found' });

        const row = results[0];
        res.status(200).json({ success: true, data: {
          ...row,
          images: row.images ? JSON.parse(row.images) : [],
          videos: row.videos ? JSON.parse(row.videos) : [],
          documents: row.documents ? JSON.parse(row.documents) : [],
        }});
      });
    }
  );
});

export default router;

/*CREATE TABLE `achievements_certificates` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `year` YEAR NOT NULL,
  `organization` VARCHAR(255) DEFAULT NULL,
  `score` DECIMAL(5,2) DEFAULT NULL,
  `images` JSON DEFAULT NULL,
  `videos` JSON DEFAULT NULL,
  `documents` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;*/