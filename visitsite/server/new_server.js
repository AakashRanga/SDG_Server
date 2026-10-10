import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import pool from "./db.js";

// Import route files
import energyClimateRoutes from "./routes/energyClimate.js";
import waterConservationRoutes from "./routes/waterConservation.js";
import transportationRoutes from "./routes/transportation.js";
import biodiversityRoutes from "./routes/biodiversity.js";
import wasteManagementRoutes from "./routes/wasteManagement.js";

import achievementsAwardsRoutes from "./api/achievements/achievementsAwards.js";
import achievementsCertificationRoutes from "./api/achievements/achievementsCertification.js";
import achievementsRankingsRoutes from "./api/achievements/achievementsRanking.js";
import achievementsRecognitionRoutes from "./api/achievements/achievementsRecognition.js";

// 🌍 Sustainability Reports Routes
import sustainabilityAnnualReportsRoutes from "./api/sustainability-reports/annualReports.js";
import sustainabilityImpactReportsRoutes from "./api/sustainability-reports/impactReports.js";
import sustainabilityMetricsRoutes from "./api/sustainability-reports/sustainabilityMetrics.js";


// research routes
import fundingRoutes from "./routes/fundingRoutes.js";
import publicationRoutes from "./routes/publicationRoutes.js";
import patentRoutes from "./routes/patentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import studentResearchRoutes from "./routes/studentResearchRoutes.js";
import collaborationsRoutes from "./routes/collaborationsRoutes.js";
import outreachRoutes from "./routes/outreachRoutes.js";
import startupRoutes from "./routes/startupRoutes.js";
import graduatesRoutes from "./routes/graduatesRoutes.js";
import innovationRoutes from "./routes/innovationRoutes.js";
import researchsiteRoutes from "./routes/researchsiteRoutes.js";

// infrastruture routes
import infrastructuresiteRoutes from "./routes/infrastructuresiteRoutes.js";
import infrastructureRoutes from "./routes/infrastructureRoutes.js";
import accessibilityRoutes from "./routes/accessibilityRoutes.js";
import wellnessRoutes from "./routes/wellnessRoutes.js";
import smartBuildingsRoutes from "./routes/smartBuildingsRoutes.js";
import infrastructurePlanningRoutes from "./routes/infrastructurePlanningRoutes.js";
import infrastructureBudgetRoutes from "./routes/infrastructureBudgetRoutes.js";

const app = express();
const PORT = process.env.PORT || 8006;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================
// MIDDLEWARE CONFIGURATION
// ======================

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

// Body parser with increased limits
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

// Static file serving
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======================
// FILE UPLOAD CONFIGURATION
// ======================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, "_");
    cb(null, uniqueSuffix + "-" + safeName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 40 * 1024 * 1024, // 10MB limit
  },
});

// ======================
// ROUTES
// ======================

// Mount environment routes
app.use("/api/environment/energy-climate", energyClimateRoutes);
app.use("/api/environment/water-conservation", waterConservationRoutes);
app.use("/api/environment/transportation", transportationRoutes);
app.use("/api/environment/biodiversity", biodiversityRoutes);
app.use("/api/environment/waste-management", wasteManagementRoutes);


//use the research site
app.use("/api/research", fundingRoutes);
app.use("/api/publications", publicationRoutes);
app.use("/api/research_patents", patentRoutes);
app.use("/api/research_courses", courseRoutes);
app.use("/api/research_student", studentResearchRoutes);
app.use("/api/research_collaborations", collaborationsRoutes);
app.use("/api/research_outreach", outreachRoutes);
app.use("/api/research_startup", startupRoutes);
app.use("/api/research_graduates", graduatesRoutes);
app.use("/api/research_innovations", innovationRoutes);
app.use("/api/research_site", researchsiteRoutes);

// use the infrastruture api
app.use("/api/infrastructuresite", infrastructuresiteRoutes);
app.use("/api/infrastructure", infrastructureRoutes);
app.use("/api/accessibility", accessibilityRoutes);
app.use("/api/wellness", wellnessRoutes);
app.use("/api/smartBuildings", smartBuildingsRoutes);
app.use("/api/planning", infrastructurePlanningRoutes);
app.use("/api/budget", infrastructureBudgetRoutes);

app.use("/api/achievements", achievementsAwardsRoutes);
app.use("/api/achievements", achievementsCertificationRoutes);
app.use("/api/achievements", achievementsRankingsRoutes);
app.use("/api/achievements", achievementsRecognitionRoutes);

// ✅ Sustainability Reports APIs — unified base
app.use("/api/sustainability-reports", sustainabilityAnnualReportsRoutes);
app.use("/api/sustainability-reports", sustainabilityImpactReportsRoutes);
app.use("/api/sustainability-reports", sustainabilityMetricsRoutes);

// ======================
// CORE API ENDPOINTS
// ======================

// Health check
app.get("/api/health", async (req, res) => {
  try {
    const healthCheck = {
      status: "OK",
      message: "Environment Sustainability & Green Office API is running",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
    };

    // Test database connection
    try {
      await pool.execute("SELECT 1");
      healthCheck.database = "connected";
    } catch (dbError) {
      healthCheck.database = "disconnected";
      healthCheck.status = "degraded";
      healthCheck.message = "API is running but database is disconnected";
    }

    res.json(healthCheck);
  } catch (error) {
    res.status(503).json({
      status: "ERROR",
      message: "Health check failed",
      error: error.message,
    });
  }
});

// Environment Dashboard
app.get("/api/environment/dashboard", async (req, res) => {
  try {
    // Get counts from all environment tables
    const [climateCount] = await pool.execute(
      "SELECT COUNT(*) as count FROM energy_climate_climate_change"
    );
    const [energyCount] = await pool.execute(
      "SELECT COUNT(*) as count FROM energy_climate_renewable_energy"
    );
    const [waterCount] = await pool.execute(
      "SELECT COUNT(*) as count FROM water_conservation_conservation"
    );
    const [transportCount] = await pool.execute(
      "SELECT COUNT(*) as count FROM transportation_shuttle_services"
    );
    const [bioCount] = await pool.execute(
      "SELECT COUNT(*) as count FROM biodiversity_flora_fauna"
    );
    const [wasteCount] = await pool.execute(
      "SELECT COUNT(*) as count FROM waste_management_e_waste"
    );

    const dashboardData = {
      totalInitiatives:
        climateCount[0].count +
        energyCount[0].count +
        waterCount[0].count +
        transportCount[0].count +
        bioCount[0].count +
        wasteCount[0].count,
      categories: {
        energyClimate: climateCount[0].count + energyCount[0].count,
        waterConservation: waterCount[0].count,
        transportation: transportCount[0].count,
        biodiversity: bioCount[0].count,
        wasteManagement: wasteCount[0].count,
      },
      lastUpdated: new Date().toISOString(),
    };

    res.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// File upload endpoint
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: `/uploads/${req.file.filename}`,
      uploadedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      message: "File uploaded successfully",
      file: fileInfo,
    });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ error: "File upload failed" });
  }
});

// ==================== GREEN OFFICE ROUTES ====================

// Helper function to ensure proper image URL
const ensureImageUrl = (imagePath) => {
  if (!imagePath) return null;
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath;
  // If it starts with /uploads, ensure it's served correctly
  if (imagePath.startsWith('/uploads')) return imagePath;
  // Otherwise, prepend /uploads
  return `/uploads/${imagePath}`;
};

// GET /api/green-office/members
app.get("/api/green-office/members", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM green_office_members ORDER BY id DESC"
    );
    const members = rows.map((member) => ({
      ...member,
      id: member.id.toString(),
      image: ensureImageUrl(member.image),
    }));
    res.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/green-office/members
app.post(
  "/api/green-office/members",
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, position, email, phone } = req.body;

      if (!name || !position || !email) {
        return res
          .status(400)
          .json({ error: "Name, position, and email are required" });
      }

      let imagePath = null;
      if (req.file) {
        imagePath = req.file.filename; // Store only filename, not full path
      }

      const [result] = await pool.execute(
        "INSERT INTO green_office_members (name, position, email, phone, image) VALUES (?, ?, ?, ?, ?)",
        [name, position, email, phone || "", imagePath]
      );

      const newMember = {
        id: result.insertId.toString(),
        name,
        position,
        email,
        phone: phone || "",
        image: ensureImageUrl(imagePath),
      };

      res.status(201).json(newMember);
    } catch (error) {
      console.error("Error creating member:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// DELETE /api/green-office/members/:id
app.delete("/api/green-office/members/:id", async (req, res) => {
  try {
    const memberId = req.params.id;
    const [result] = await pool.execute(
      "DELETE FROM green_office_members WHERE id = ?",
      [memberId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/green-office/missions
app.get("/api/green-office/missions", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM missions ORDER BY id DESC"
    );
    const missions = rows.map((mission) => ({
      ...mission,
      id: mission.id.toString(),
    }));
    res.json(missions);
  } catch (error) {
    console.error("Error fetching missions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/green-office/missions
app.post("/api/green-office/missions", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    const [result] = await pool.execute(
      "INSERT INTO missions (title, description) VALUES (?, ?)",
      [title, description]
    );

    const newMission = {
      id: result.insertId.toString(),
      title,
      description,
    };

    res.status(201).json(newMission);
  } catch (error) {
    console.error("Error creating mission:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/green-office/missions/:id
app.delete("/api/green-office/missions/:id", async (req, res) => {
  try {
    const missionId = req.params.id;
    const [result] = await pool.execute("DELETE FROM missions WHERE id = ?", [
      missionId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Mission not found" });
    }

    res.json({ message: "Mission deleted successfully" });
  } catch (error) {
    console.error("Error deleting mission:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/green-office/commitments
app.get("/api/green-office/commitments", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM commitments ORDER BY id DESC"
    );
    const commitments = rows.map((commitment) => ({
      ...commitment,
      id: commitment.id.toString(),
      targetDate: commitment.target_date,
    }));
    res.json(commitments);
  } catch (error) {
    console.error("Error fetching commitments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/green-office/commitments
app.post("/api/green-office/commitments", async (req, res) => {
  try {
    const { title, description, targetDate, status = "pending" } = req.body;

    if (!title || !description || !targetDate) {
      return res
        .status(400)
        .json({ error: "Title, description, and targetDate are required" });
    }

    const [result] = await pool.execute(
      "INSERT INTO commitments (title, description, target_date, status) VALUES (?, ?, ?, ?)",
      [title, description, targetDate, status]
    );

    const newCommitment = {
      id: result.insertId.toString(),
      title,
      description,
      targetDate,
      status,
    };

    res.status(201).json(newCommitment);
  } catch (error) {
    console.error("Error creating commitment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/green-office/commitments/:id
app.delete("/api/green-office/commitments/:id", async (req, res) => {
  try {
    const commitmentId = req.params.id;
    const [result] = await pool.execute(
      "DELETE FROM commitments WHERE id = ?",
      [commitmentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Commitment not found" });
    }

    res.json({ message: "Commitment deleted successfully" });
  } catch (error) {
    console.error("Error deleting commitment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/green-office/milestones
app.get("/api/green-office/milestones", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM milestones ORDER BY id DESC"
    );
    const milestones = rows.map((milestone) => ({
      ...milestone,
      id: milestone.id.toString(),
    }));
    res.json(milestones);
  } catch (error) {
    console.error("Error fetching milestones:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/green-office/milestones
app.post("/api/green-office/milestones", async (req, res) => {
  try {
    const { title, description, date, status = "upcoming" } = req.body;

    if (!title || !description || !date || !status) {
      return res
        .status(400)
        .json({ error: "Title, description, date, and status are required" });
    }

    const [result] = await pool.execute(
      "INSERT INTO milestones (title, description, date, status) VALUES (?, ?, ?, ?)",
      [title, description, date, status]
    );

    const newMilestone = {
      id: result.insertId.toString(),
      title,
      description,
      date,
      status,
    };

    res.status(201).json(newMilestone);
  } catch (error) {
    console.error("Error creating milestone:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/green-office/milestones/:id
app.delete("/api/green-office/milestones/:id", async (req, res) => {
  try {
    const milestoneId = req.params.id;
    const [result] = await pool.execute("DELETE FROM milestones WHERE id = ?", [
      milestoneId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    res.json({ message: "Milestone deleted successfully" });
  } catch (error) {
    console.error("Error deleting milestone:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== COMMITTEES ROUTES ====================

// GET /api/committees
app.get("/api/committees", async (req, res) => {
  try {
    const [committees] = await pool.execute(
      "SELECT * FROM committees ORDER BY id DESC"
    );

    const committeesWithData = await Promise.all(
      committees.map(async (committee) => {
        const [members] = await pool.execute(
          "SELECT * FROM committee_members WHERE committee_id = ?",
          [committee.id]
        );

        const [meetingMinutes] = await pool.execute(
          "SELECT * FROM committee_meeting_minutes WHERE committee_id = ?",
          [committee.id]
        );

        return {
          ...committee,
          id: committee.id.toString(),
          members: members.map((member) => ({
            ...member,
            id: member.id.toString(),
            image: ensureImageUrl(member.image),
          })),
          meetingMinutes: meetingMinutes.map((minutes) => ({
            ...minutes,
            id: minutes.id.toString(),
          })),
        };
      })
    );

    res.json(committeesWithData);
  } catch (error) {
    console.error("Error fetching committees:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/committees
app.post("/api/committees", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ error: "Name and description are required" });
    }

    const [result] = await pool.execute(
      "INSERT INTO committees (name, description) VALUES (?, ?)",
      [name, description]
    );

    const newCommittee = {
      id: result.insertId.toString(),
      name,
      description,
      members: [],
      meetingMinutes: [],
    };

    res.status(201).json(newCommittee);
  } catch (error) {
    console.error("Error creating committee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/committees/:id
app.delete("/api/committees/:id", async (req, res) => {
  try {
    const committeeId = req.params.id;
    const [result] = await pool.execute("DELETE FROM committees WHERE id = ?", [
      committeeId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Committee not found" });
    }

    res.json({ message: "Committee deleted successfully" });
  } catch (error) {
    console.error("Error deleting committee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/committees/:id/members
app.post(
  "/api/committees/:id/members",
  upload.single("image"),
  async (req, res) => {
    try {
      const committeeId = req.params.id;
      const { name, position, email, phone } = req.body;

      if (!name || !position || !email) {
        return res
          .status(400)
          .json({ error: "Name, position, and email are required" });
      }

      let imagePath = null;
      if (req.file) {
        imagePath = req.file.filename; // Store only filename
      }

      const [result] = await pool.execute(
        "INSERT INTO committee_members (committee_id, name, position, email, phone, image) VALUES (?, ?, ?, ?, ?, ?)",
        [committeeId, name, position, email, phone || "", imagePath]
      );

      const newMember = {
        id: result.insertId.toString(),
        name,
        position,
        email,
        phone: phone || "",
        image: ensureImageUrl(imagePath),
      };

      res.status(201).json(newMember);
    } catch (error) {
      console.error("Error creating committee member:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// DELETE /api/committees/:committeeId/members/:memberId
app.delete(
  "/api/committees/:committeeId/members/:memberId",
  async (req, res) => {
    try {
      const { committeeId, memberId } = req.params;
      const [result] = await pool.execute(
        "DELETE FROM committee_members WHERE id = ? AND committee_id = ?",
        [memberId, committeeId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Committee member not found" });
      }

      res.json({ message: "Committee member deleted successfully" });
    } catch (error) {
      console.error("Error deleting committee member:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// POST /api/committees/:id/meeting-minutes
app.post("/api/committees/:id/meeting-minutes", async (req, res) => {
  try {
    const committeeId = req.params.id;
    const { title, date, content } = req.body;

    if (!title || !date || !content) {
      return res
        .status(400)
        .json({ error: "Title, date, and content are required" });
    }

    const [result] = await pool.execute(
      "INSERT INTO committee_meeting_minutes (committee_id, title, date, content) VALUES (?, ?, ?, ?)",
      [committeeId, title, date, content]
    );

    const newMinutes = {
      id: result.insertId.toString(),
      title,
      date,
      content,
    };

    res.status(201).json(newMinutes);
  } catch (error) {
    console.error("Error creating meeting minutes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/committees/:committeeId/meeting-minutes/:minutesId
app.delete(
  "/api/committees/:committeeId/meeting-minutes/:minutesId",
  async (req, res) => {
    try {
      const { committeeId, minutesId } = req.params;
      const [result] = await pool.execute(
        "DELETE FROM committee_meeting_minutes WHERE id = ? AND committee_id = ?",
        [minutesId, committeeId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Meeting minutes not found" });
      }

      res.json({ message: "Meeting minutes deleted successfully" });
    } catch (error) {
      console.error("Error deleting meeting minutes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ==================== STUDENT COUNCIL ROUTES ====================

// GET /api/student-council/members
app.get("/api/student-council/members", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM student_council_members ORDER BY id DESC"
    );
    const members = rows.map((member) => ({
      ...member,
      id: member.id.toString(),
      image: ensureImageUrl(member.image),
    }));
    res.json(members);
  } catch (error) {
    console.error("Error fetching student council members:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/student-council/members
app.post(
  "/api/student-council/members",
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, position, email, phone } = req.body;

      if (!name || !position || !email) {
        return res
          .status(400)
          .json({ error: "Name, position, and email are required" });
      }

      let imagePath = null;
      if (req.file) {
        imagePath = req.file.filename; // Store only filename
      }

      const [result] = await pool.execute(
        "INSERT INTO student_council_members (name, position, email, phone, image) VALUES (?, ?, ?, ?, ?)",
        [name, position, email, phone || "", imagePath]
      );

      const newMember = {
        id: result.insertId.toString(),
        name,
        position,
        email,
        phone: phone || "",
        image: ensureImageUrl(imagePath),
      };

      res.status(201).json(newMember);
    } catch (error) {
      console.error("Error creating student council member:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// DELETE /api/student-council/members/:id
app.delete("/api/student-council/members/:id", async (req, res) => {
  try {
    const memberId = req.params.id;
    const [result] = await pool.execute(
      "DELETE FROM student_council_members WHERE id = ?",
      [memberId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Student council member not found" });
    }

    res.json({ message: "Student council member deleted successfully" });
  } catch (error) {
    console.error("Error deleting student council member:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/student-council/meeting-minutes
app.get("/api/student-council/meeting-minutes", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM student_council_meeting_minutes ORDER BY date DESC"
    );
    const minutes = rows.map((minute) => ({
      ...minute,
      id: minute.id.toString(),
    }));
    res.json(minutes);
  } catch (error) {
    console.error("Error fetching student council meeting minutes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/student-council/meeting-minutes
app.post("/api/student-council/meeting-minutes", async (req, res) => {
  try {
    const { title, date, content } = req.body;

    if (!title || !date || !content) {
      return res
        .status(400)
        .json({ error: "Title, date, and content are required" });
    }

    const [result] = await pool.execute(
      "INSERT INTO student_council_meeting_minutes (title, date, content) VALUES (?, ?, ?)",
      [title, date, content]
    );

    const newMinutes = {
      id: result.insertId.toString(),
      title,
      date,
      content,
    };

    res.status(201).json(newMinutes);
  } catch (error) {
    console.error("Error creating student council meeting minutes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/student-council/meeting-minutes/:id
app.delete("/api/student-council/meeting-minutes/:id", async (req, res) => {
  try {
    const minutesId = req.params.id;
    const [result] = await pool.execute(
      "DELETE FROM student_council_meeting_minutes WHERE id = ?",
      [minutesId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Meeting minutes not found" });
    }

    res.json({ message: "Meeting minutes deleted successfully" });
  } catch (error) {
    console.error("Error deleting meeting minutes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ======================
// API DOCUMENTATION
// ======================

app.get("/api", (req, res) => {
  res.json({
    api: "Environment Sustainability & Green Office Management API",
    version: "1.0.0",
    description:
      "Comprehensive API for managing environmental sustainability initiatives and green office operations",
    health: "GET /api/health",
    dashboard: "GET /api/environment/dashboard",
    upload: "POST /api/upload",
    endpoints: {
      environment: {
        base: "/api/environment",
        endpoints: {
          energyClimate: "GET/POST/DELETE /api/environment/energy-climate/*",
          waterConservation:
            "GET/POST/DELETE /api/environment/water-conservation/*",
          transportation: "GET/POST/DELETE /api/environment/transportation/*",
          biodiversity: "GET/POST/DELETE /api/environment/biodiversity/*",
          wasteManagement: "GET/POST/DELETE /api/environment/waste-management/*",
        },
      },
      greenOffice: {
        base: "/api/green-office",
        endpoints: {
          members: "GET/POST/DELETE /api/green-office/members",
          missions: "GET/POST/DELETE /api/green-office/missions",
          commitments: "GET/POST/DELETE /api/green-office/commitments",
          milestones: "GET/POST/DELETE /api/green-office/milestones",
        },
      },
      committees: {
        base: "/api/committees",
        endpoints: {
          main: "GET/POST/DELETE /api/committees",
          members: "POST/DELETE /api/committees/:id/members",
          meetingMinutes: "POST/DELETE /api/committees/:id/meeting-minutes",
        },
      },
      studentCouncil: {
        base: "/api/student-council",
        endpoints: {
          members: "GET/POST/DELETE /api/student-council/members",
          meetingMinutes:
            "GET/POST/DELETE /api/student-council/meeting-minutes",
        },
      },
    },
  });
});

// ======================
// ERROR HANDLING
// ======================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    path: req.originalUrl,
    method: req.method,
    documentation: "GET /api for available endpoints",
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Server Error:", error);

  // Multer errors
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      error: "File too large",
      message: "Maximum file size is 10MB",
    });
  }

  // Body parser errors
  if (error.type === "entity.too.large") {
    return res.status(413).json({
      error: "Payload too large",
      message: "Maximum payload size is 50MB",
    });
  }

  // Default error
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

// ======================
// SERVER STARTUP
// ======================

app.listen(PORT, () => {
  console.log("=================================");
  console.log("🚀 Environment Sustainability & Green Office API");
  console.log("=================================");
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 URL: http://180.235.121.250:${PORT}/api`);
  console.log(`🏷️  Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("=================================");
  console.log("Available Endpoints:");
  console.log("  GET  /api/health          - Health check");
  console.log("  GET  /api                 - API documentation");
  console.log("  GET  /api/environment/dashboard - Statistics dashboard");
  console.log("  POST /api/upload          - File upload");
  console.log("  Green Office: /api/green-office/*");
  console.log("  Committees: /api/committees/*");
  console.log("  Student Council: /api/student-council/*");
  console.log("  Environment: /api/environment/*");
  console.log("=================================");
});

export default app;