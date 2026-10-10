import express from "express";
import { db } from "../../db.js";

const router = express.Router();

// ✅ POST route — insert new commitment
// ✅ POST API — Insert commitment
router.post('/commitments', (req, res) => {
  const { title, description, targetDate } = req.body;

  if (!title || !description || !targetDate) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const sql = `
    INSERT INTO green_office_commitments (title, description, targetDate)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [title, description, targetDate], (err, result) => {
    if (err) {
      console.error("❌ Database error:", err.sqlMessage);
      return res.status(500).json({ message: "Database error. Check console for details." });
    }

    console.log("✅ New commitment inserted, ID:", result.insertId);
    res.status(200).json({ message: "✅ Commitment added successfully!", id: result.insertId });
  });
});

export default router;
