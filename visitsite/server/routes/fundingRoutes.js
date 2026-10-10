import express from "express";
import db from "../db.js";
const router = express.Router();

// ✅ Map funding type → table name
const getTableName = (type) => {
  switch (type) {
    case "grants":
      return "research_grants";
    case "corporateSponsorship":
      return "corporate_sponsorships";
    case "governmentFunding":
      return "government_funding";
    default:
      return null;
  }
};

// ✅ GET all funding items
router.get("/:type", async (req, res) => {
  try {
    const table = getTableName(req.params.type);
    if (!table) return res.status(400).json({ error: "Invalid funding type" });

    const [rows] = await db.query(`SELECT * FROM ${table} ORDER BY id DESC`);
    res.json(rows);
  } catch (err) {
    console.error("GET /funding/:type error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ POST new funding item
router.post("/:type", async (req, res) => {
  try {
    const type = req.params.type;
    const table = getTableName(type);
    if (!table) return res.status(400).json({ error: "Invalid funding type" });

    const { title, description, value, year, status } = req.body;

    if (!title || !year) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Insert record (and save the type)
    const [result] = await db.query(
      `INSERT INTO ${table} (title, description, value, year, status, type)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, value || null, year, status || "active", type]
    );

    res.status(201).json({
      id: result.insertId,
      message: "Funding item added successfully",
    });
  } catch (err) {
    console.error("POST /funding/:type error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ UPDATE funding item
router.put("/:type/:id", async (req, res) => {
  try {
    const table = getTableName(req.params.type);
    const { id } = req.params;

    const { title, description, value, year, status } = req.body;

    const [result] = await db.query(
      `UPDATE ${table} SET title=?, description=?, value=?, year=?, status=? WHERE id=?`,
      [title, description, value, year, status, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Item updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ DELETE funding item
router.delete("/:type/:id", async (req, res) => {
  try {
    const table = getTableName(req.params.type);
    const { id } = req.params;

    if (!table) return res.status(400).json({ error: "Invalid funding type" });

    const [result] = await db.query(`DELETE FROM ${table} WHERE id = ?`, [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("DELETE /funding/:type/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
