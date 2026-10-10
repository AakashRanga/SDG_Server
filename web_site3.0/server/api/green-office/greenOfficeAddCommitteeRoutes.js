// server/api/green-office/greenOfficeAddCommitteeRoutes.js
import express from "express";
import { db } from "../../db.js";

const router = express.Router();

// ✅ Insert new committee
router.post("/add_committees", (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: "Name and description are required" });
  }

  const sql = "INSERT INTO committees (name, description) VALUES (?, ?)";
  db.query(sql, [name, description], (err, result) => {
    if (err) {
      console.error("❌ Error inserting committee:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    const newCommittee = { id: result.insertId, name, description };
    res.status(201).json(newCommittee);
  });
});

// ✅ Get all committees
router.get("/committees", (req, res) => {
  const sql = "SELECT * FROM committees ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching committees:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

export default router;