//greenOfficeAddMilestonesRoutes
import express from "express";
import { db } from "../../db.js";

const router = express.Router();

// ✅ POST — Add Milestone
router.post("/milestones", (req, res) => {
  const { title, description, date, status } = req.body;

  if (!title || !description || !date || !status) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const sql = `
    INSERT INTO green_office_milestones (title, description, date, status)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [title, description, date, status], (err, result) => {
    if (err) {
      console.error("❌ Database error:", err.sqlMessage);
      return res.status(500).json({ message: "Database error.", error: err.sqlMessage });
    }

    res.status(200).json({
      message: "✅ Milestone added successfully!",
      id: result.insertId,
    });
  });
});

/* ✅ GET — Fetch All Milestones
router.get("/milestones", (req, res) => {
  const sql = "SELECT * FROM green_office_milestones ORDER BY date DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Database fetch error:", err);
      return res.status(500).json({ message: "Database fetch error." });
    }

    res.status(200).json(results);
  });
});*/

export default router;
