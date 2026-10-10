import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const [
      [infrastructureRows],
      [budgetRows],
      [planningRows],
      [accessibilityRows],
      [wellnessRows],
      [smartRows],
    ] = await Promise.all([
      db.query("SELECT * FROM infrastructure ORDER BY id DESC"),
      db.query("SELECT * FROM infrastructure_budget ORDER BY id DESC"),
      db.query("SELECT * FROM infrastructure_planning ORDER BY id DESC"),
      db.query("SELECT * FROM accessibility ORDER BY id DESC"),
      db.query("SELECT * FROM wellness ORDER BY id DESC"),
      db.query("SELECT * FROM smart_buildings ORDER BY id DESC"),
    ]);

    res.json({
      greenSpaces: {
        openAreas: infrastructureRows.filter((r) => r.type === "openAreas"),
        forestedZones: infrastructureRows.filter(
          (r) => r.type === "forestedZones"
        ),
      },

      accessibility: {
        buildings: accessibilityRows.filter((r) => r.type === "buildings"),
        facilities: accessibilityRows.filter((r) => r.type === "facilities"),
      },

      wellness: {
        facilities: wellnessRows.filter((r) => r.type === "facilities"),
        programs: wellnessRows.filter((r) => r.type === "programs"),
      },

      smartBuildings: {
        initiatives: smartRows.filter((r) => r.type === "initiatives"),
        technologies: smartRows.filter((r) => r.type === "technologies"),
      },

      budget: {
        allocations: budgetRows.filter((r) => r.type === "allocations"),
        investments: budgetRows.filter((r) => r.type === "investments"),
      },

      planning: {
        strategies: planningRows.filter((r) => r.type === "strategies"),
        expansions: planningRows.filter((r) => r.type === "expansions"),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
