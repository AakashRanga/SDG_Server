import express from 'express';
import { db } from '../../db.js';

const router = express.Router();

// POST route to insert new mission
router.post('/add-mission', (req, res) => {
  const { title, description } = req.body;

  console.log('Request Body:', req.body);  // Check request body

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const sql = 'INSERT INTO green_office_missions (title, description) VALUES (?, ?)';
  db.query(sql, [title, description], (err, result) => {
    if (err) {
      console.error('Error inserting mission:', err);
      return res.status(500).json({ message: 'Error inserting mission' });
    }

    res.status(201).json({
      message: 'Mission inserted successfully',
      mission: { id: result.insertId, title, description }
    });
  });
});

export default router;
