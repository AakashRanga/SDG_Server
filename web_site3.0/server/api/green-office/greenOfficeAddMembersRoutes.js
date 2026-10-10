// server/api/green-office/greenOfficeRoutes.js
import express from 'express';
import { db } from '../../db.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// For ES modules path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../uploads')); // upload directory
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ✅ INSERT Member API
router.post('/add-member', upload.single('image'), (req, res) => {
  const { name, position, email, phone } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !position) {
    return res.status(400).json({ message: 'Name and position are required' });
  }

  const sql = `INSERT INTO green_office_members (name, position, email, phone, image)
               VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [name, position, email, phone, image], (err, result) => {
    if (err) {
      console.error('❌ Error inserting member:', err);
      return res.status(500).json({ message: 'Error inserting member' });
    }

    res.status(201).json({
      message: '✅ Member added successfully',
      member: {
        id: result.insertId,
        name,
        position,
        email,
        phone,
        image,
      },
    });
  });
});

// ✅ FETCH Members API
router.get('/members', (req, res) => {
  const sql = 'SELECT * FROM green_office_members ORDER BY id DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error fetching members:', err);
      return res.status(500).json({ message: 'Error fetching members' });
    }
    res.status(200).json(results);
  });
});

export default router;
