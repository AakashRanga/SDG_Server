import express from "express";
import db from "../db.js";
const router = express.Router();

// Get all funding at once
router.get("/funding/all", async (req, res) => {
  try {
    const [research_grants] = await db.query("SELECT * FROM research_grants");
    const [corporate_sponsorship] = await db.query(
      "SELECT * FROM corporate_sponsorships"
    );
    const [government_funding] = await db.query(
      "SELECT * FROM government_funding"
    );

    // Calculate total values
    const totalResearchGrants = research_grants.reduce(
      (sum, item) => sum + (parseFloat(item.value) || 0),
      0
    );

    const totalCorporateSponsorship = corporate_sponsorship.reduce(
      (sum, item) => sum + (parseFloat(item.value) || 0),
      0
    );

    const totalGovernmentFunding = government_funding.reduce(
      (sum, item) => sum + (parseFloat(item.value) || 0),
      0
    );

    // Calculate counts
    const countResearchGrants = research_grants.length;
    const countCorporateSponsorship = corporate_sponsorship.length;
    const countGovernmentFunding = government_funding.length;

    res.json({
      research_grants,
      corporate_sponsorship,
      government_funding,
      totals: {
        research_grants: totalResearchGrants,
        corporate_sponsorship: totalCorporateSponsorship,
        government_funding: totalGovernmentFunding,
      },
      counts: {
        funding:
          countResearchGrants +
          countCorporateSponsorship +
          countGovernmentFunding,
        research_grants: countResearchGrants,
        corporate_sponsorship: countCorporateSponsorship,
        government_funding: countGovernmentFunding,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching funding data" });
  }
});

// ---------- PUBLICATIONS ----------
router.get("/publications/all", async (req, res) => {
  try {
    // Fetch all publications at once
    const [allPublications] = await db.query(
      "SELECT * FROM research_publications"
    );

    // Group by type
    const grouped = allPublications.reduce((acc, pub) => {
      const type = pub.type || "others"; // fallback type
      if (!acc[type]) acc[type] = [];
      acc[type].push(pub);
      return acc;
    }, {});

    res.json(grouped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching publications" });
  }
});
// ---------- PATENTS ----------
router.get("/patents/all", async (req, res) => {
  try {
    const [allPatents] = await db.query("SELECT * FROM research_patents");

    // Group by category
    const grouped = allPatents.reduce((acc, p) => {
      const cat = p.category || "others";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(p);
      return acc;
    }, {});

    // Add counts
    const counts = Object.fromEntries(
      Object.entries(grouped).map(([key, arr]) => [key, arr.length])
    );

    res.json({ data: grouped, counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching patents" });
  }
});

// ---------- COURSES ----------
// ---------- COURSES ----------
router.get("/courses/all", async (req, res) => {
  try {
    const [allCourses] = await db.query("SELECT * FROM research_courses");

    // Group by 'type' column
    const grouped = allCourses.reduce((acc, c) => {
      const type = c.type || "others"; // fallback if type is missing
      if (!acc[type]) acc[type] = [];
      acc[type].push(c);
      return acc;
    }, {}); // plain JS object

    // Counts for each type
    const counts = Object.fromEntries(
      Object.entries(grouped).map(([key, arr]) => [key, arr.length])
    );

    res.json({ data: grouped, counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching courses" });
  }
});

// ---------- STUDENT RESEARCH ----------
router.get("/studentResearch/all", async (req, res) => {
  try {
    const [allStudentResearch] = await db.query(
      "SELECT * FROM student_research"
    );

    const grouped = allStudentResearch.reduce((acc, r) => {
      const type = r.type || "others";
      if (!acc[type]) acc[type] = [];
      acc[type].push(r);
      return acc;
    }, {});

    const counts = Object.fromEntries(
      Object.entries(grouped).map(([key, arr]) => [key, arr.length])
    );

    res.json({ data: grouped, counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching student research" });
  }
});

// ---------- COLLABORATIONS ----------
router.get("/collaborations/all", async (req, res) => {
  try {
    const [allCollabs] = await db.query("SELECT * FROM collaborations");

    const grouped = allCollabs.reduce((acc, c) => {
      const type = c.type || "others";
      if (!acc[type]) acc[type] = [];
      acc[type].push(c);
      return acc;
    }, {});

    const counts = Object.fromEntries(
      Object.entries(grouped).map(([key, arr]) => [key, arr.length])
    );

    res.json({ data: grouped, counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching collaborations" });
  }
});

// ---------- OUTREACH ----------
router.get("/outreach/all", async (req, res) => {
  try {
    const [allOutreach] = await db.query("SELECT * FROM outreach");

    const grouped = allOutreach.reduce((acc, o) => {
      const type = o.type || "others";
      if (!acc[type]) acc[type] = [];
      acc[type].push(o);
      return acc;
    }, {});

    const counts = Object.fromEntries(
      Object.entries(grouped).map(([key, arr]) => [key, arr.length])
    );

    res.json({ data: grouped, counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching outreach" });
  }
});

// ---------- STARTUPS ----------
router.get("/startups/all", async (req, res) => {
  try {
    const [allStartups] = await db.query("SELECT * FROM startups");

    const grouped = allStartups.reduce((acc, s) => {
      const stage = s.stage || "others";
      if (!acc[stage]) acc[stage] = [];
      acc[stage].push(s);
      return acc;
    }, {});

    const counts = Object.fromEntries(
      Object.entries(grouped).map(([key, arr]) => [key, arr.length])
    );

    res.json({ data: grouped, counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching startups" });
  }
});

// ---------- GRADUATES ----------
router.get("/graduates/all", async (req, res) => {
  try {
    const [allGrads] = await db.query("SELECT * FROM graduates");

    const grouped = allGrads.reduce((acc, g) => {
      const type = g.type || "others";
      if (!acc[type]) acc[type] = [];
      acc[type].push(g);
      return acc;
    }, {});

    const counts = Object.fromEntries(
      Object.entries(grouped).map(([key, arr]) => [key, arr.length])
    );

    res.json({ data: grouped, counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching graduates" });
  }
});

// ---------- INNOVATIONS ----------
router.get("/innovations/all", async (req, res) => {
  try {
    const [allInnovations] = await db.query("SELECT * FROM innovations");

    const grouped = allInnovations.reduce((acc, i) => {
      const type = i.type || "others";
      if (!acc[type]) acc[type] = [];
      acc[type].push(i);
      return acc;
    }, {});

    const counts = Object.fromEntries(
      Object.entries(grouped).map(([key, arr]) => [key, arr.length])
    );

    res.json({ data: grouped, counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching innovations" });
  }
});

// ---------- INITIATIVES (Collaboration + Outreach) ----------
router.get("/initiatives/all", async (req, res) => {
  try {
    // Fetch both tables
    const [allCollabs] = await db.query("SELECT * FROM collaborations");
    const [allOutreach] = await db.query("SELECT * FROM outreach");

    // Merge all items
    const allInitiatives = [...allCollabs, ...allOutreach];

    // Group by type
    const grouped = allInitiatives.reduce((acc, item) => {
      const type = item.type || "others";
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {});

    // Generate counts per type
    const counts = Object.fromEntries(
      Object.entries(grouped).map(([key, arr]) => [key, arr.length])
    );

    res.json({
      data: grouped,
      counts,
      total: allInitiatives.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching initiatives" });
  }
});

export default router;
