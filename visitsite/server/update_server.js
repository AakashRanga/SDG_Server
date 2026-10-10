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

import rankingDataRoutes from "./api/ranking-data/rankingData.js";

const app = express();
const PORT = process.env.SERVER_PORT || (process.env.PORT && process.env.PORT !== '8080' && process.env.PORT !== '8081' ? process.env.PORT : 8006);

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

// ======================
// STATIC FILE SERVING - FIXED
// ======================

// Get the root directory (where the uploads folder actually is)
const rootDir = path.join(__dirname, '..');
const rootUploadsDir = path.join(rootDir, 'uploads');
const serverUploadsDir = path.join(__dirname, 'uploads');

console.log('=================================');
console.log('📁 Static File Serving Configuration:');
console.log(`   Server directory: ${__dirname}`);
console.log(`   Root directory: ${rootDir}`);
console.log(`   Root uploads directory: ${rootUploadsDir}`);
console.log(`   Server uploads directory: ${serverUploadsDir}`);
console.log('=================================');

// ✅ Primary: Serve from root uploads directory (where files are actually saved)
if (fs.existsSync(rootUploadsDir)) {
  app.use('/uploads', express.static(rootUploadsDir));
  console.log(`✅ Serving static files from: ${rootUploadsDir}`);
  
  // Check if awards subdirectory exists
  const awardsDir = path.join(rootUploadsDir, 'awards');
  if (fs.existsSync(awardsDir)) {
    console.log(`✅ Awards directory found: ${awardsDir}`);
    const files = fs.readdirSync(awardsDir);
    console.log(`   Files in awards: ${files.length}`);
    if (files.length > 0) {
      console.log(`   Sample file: ${files[0]}`);
    }
  } else {
    console.log(`⚠️ Awards directory not found: ${awardsDir}`);
    fs.mkdirSync(awardsDir, { recursive: true });
    console.log(`✅ Created awards directory: ${awardsDir}`);
  }
} else {
  console.log(`⚠️ Root uploads directory not found: ${rootUploadsDir}`);
  // Create it if it doesn't exist
  fs.mkdirSync(rootUploadsDir, { recursive: true });
  app.use('/uploads', express.static(rootUploadsDir));
  console.log(`✅ Created and serving static files from: ${rootUploadsDir}`);
}

// ✅ Secondary: Serve from server/uploads as fallback
if (fs.existsSync(serverUploadsDir)) {
  app.use('/uploads', express.static(serverUploadsDir));
  console.log(`✅ Serving static files from: ${serverUploadsDir}`);
}

// ✅ Serve public directory
app.use(express.static("public"));

// ✅ Serve ranking-data specifically
const rankingDataDir = path.join(rootDir, 'uploads', 'ranking-data');
if (fs.existsSync(rankingDataDir)) {
  app.use('/uploads/ranking-data', express.static(rankingDataDir));
  console.log(`✅ Serving ranking-data from: ${rankingDataDir}`);
}

// ✅ Debug endpoint to check file system
app.get('/debug/uploads', (req, res) => {
  const rootAwards = path.join(rootDir, 'uploads', 'awards');
  const serverAwards = path.join(__dirname, 'uploads', 'awards');
  
  const result = {
    rootDirectory: rootDir,
    uploads: {
      rootUploads: {
        path: rootUploadsDir,
        exists: fs.existsSync(rootUploadsDir),
        subdirectories: fs.existsSync(rootUploadsDir) ? fs.readdirSync(rootUploadsDir) : []
      },
      rootAwards: {
        path: rootAwards,
        exists: fs.existsSync(rootAwards),
        files: fs.existsSync(rootAwards) ? fs.readdirSync(rootAwards) : []
      },
      serverAwards: {
        path: serverAwards,
        exists: fs.existsSync(serverAwards),
        files: fs.existsSync(serverAwards) ? fs.readdirSync(serverAwards) : []
      }
    },
    sampleUrls: {
      firstRootAward: fs.existsSync(rootAwards) && fs.readdirSync(rootAwards).length > 0 
        ? `/uploads/awards/${fs.readdirSync(rootAwards)[0]}` 
        : null
    }
  };
  
  res.json(result);
});

// ✅ Test endpoint to check if specific images are accessible
app.get('/test-image/:filename', (req, res) => {
  const filename = req.params.filename;
  
  // Check in root uploads/awards
  const rootPath = path.join(rootDir, 'uploads', 'awards', filename);
  const serverPath = path.join(__dirname, 'uploads', 'awards', filename);
  const rootDirectPath = path.join(rootUploadsDir, 'awards', filename);
  
  console.log(`🔍 Looking for image: ${filename}`);
  console.log(`   Root path: ${rootPath}`);
  console.log(`   Server path: ${serverPath}`);
  console.log(`   Root direct path: ${rootDirectPath}`);
  
  let filePath = null;
  
  if (fs.existsSync(rootPath)) {
    filePath = rootPath;
    console.log(`✅ Found at root path: ${filePath}`);
  } else if (fs.existsSync(serverPath)) {
    filePath = serverPath;
    console.log(`✅ Found at server path: ${filePath}`);
  } else if (fs.existsSync(rootDirectPath)) {
    filePath = rootDirectPath;
    console.log(`✅ Found at root direct path: ${filePath}`);
  }
  
  if (filePath) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ 
      error: 'File not found', 
      filename,
      searchedPaths: [rootPath, serverPath, rootDirectPath]
    });
  }
});

// ======================
// FILE UPLOAD CONFIGURATION
// ======================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(rootDir, 'uploads');
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
    fileSize: 40 * 1024 * 1024, // 40MB limit
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

// Research routes
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

// Infrastructure routes
app.use("/api/infrastructuresite", infrastructuresiteRoutes);
app.use("/api/infrastructure", infrastructureRoutes);
app.use("/api/accessibility", accessibilityRoutes);
app.use("/api/wellness", wellnessRoutes);
app.use("/api/smartBuildings", smartBuildingsRoutes);
app.use("/api/planning", infrastructurePlanningRoutes);
app.use("/api/budget", infrastructureBudgetRoutes);

// Achievements routes
app.use("/api/achievements", achievementsAwardsRoutes);
app.use("/api/achievements", achievementsCertificationRoutes);
app.use("/api/achievements", achievementsRankingsRoutes);
app.use("/api/achievements", achievementsRecognitionRoutes);

// Sustainability Reports APIs
app.use("/api/sustainability-reports", sustainabilityAnnualReportsRoutes);
app.use("/api/sustainability-reports", sustainabilityImpactReportsRoutes);
app.use("/api/sustainability-reports", sustainabilityMetricsRoutes);

// Ranking data
app.use("/api/ranking-data", rankingDataRoutes);

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
  if (imagePath.startsWith('https')) return imagePath;
  if (imagePath.startsWith('/uploads')) return imagePath;
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
        imagePath = req.file.filename;
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

// PUT /api/green-office/members/:id
app.put(
  "/api/green-office/members/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      const memberId = req.params.id;
      const { name, position, email, phone } = req.body;

      if (!name || !position || !email) {
        return res
          .status(400)
          .json({ error: "Name, position, and email are required" });
      }

      const [existingMember] = await pool.execute(
        "SELECT * FROM green_office_members WHERE id = ?",
        [memberId]
      );

      if (existingMember.length === 0) {
        return res.status(404).json({ error: "Member not found" });
      }

      let imagePath = existingMember[0].image;
      if (req.file) {
        imagePath = req.file.filename;
      }

      const [result] = await pool.execute(
        "UPDATE green_office_members SET name = ?, position = ?, email = ?, phone = ?, image = ? WHERE id = ?",
        [name, position, email, phone || "", imagePath, memberId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Member not found" });
      }

      const [updatedRows] = await pool.execute(
        "SELECT * FROM green_office_members WHERE id = ?",
        [memberId]
      );

      const updatedMember = {
        ...updatedRows[0],
        id: updatedRows[0].id.toString(),
        image: ensureImageUrl(updatedRows[0].image),
      };

      console.log('✅ Member updated successfully');
      
      res.json({
        success: true,
        message: "Member updated successfully",
        data: updatedMember
      });
      
    } catch (error) {
      console.error("❌ Error updating member:", error);
      res.status(500).json({ 
        error: "Internal server error",
        message: error.message 
      });
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

// PUT /api/green-office/missions/:id
app.put("/api/green-office/missions/:id", async (req, res) => {
  try {
    const missionId = req.params.id;
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    const [existingMission] = await pool.execute(
      "SELECT * FROM missions WHERE id = ?",
      [missionId]
    );

    if (existingMission.length === 0) {
      return res.status(404).json({ error: "Mission not found" });
    }

    const [result] = await pool.execute(
      "UPDATE missions SET title = ?, description = ? WHERE id = ?",
      [title, description, missionId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Mission not found" });
    }

    const updatedMission = {
      id: missionId,
      title,
      description,
    };

    res.json(updatedMission);
  } catch (error) {
    console.error("Error updating mission:", error);
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

// PUT /api/green-office/commitments/:id
app.put("/api/green-office/commitments/:id", async (req, res) => {
  try {
    const commitmentId = req.params.id;
    const { title, description, targetDate, status } = req.body;

    if (!title || !description || !targetDate || !status) {
      return res
        .status(400)
        .json({ error: "Title, description, targetDate, and status are required" });
    }

    const [existingCommitment] = await pool.execute(
      "SELECT * FROM commitments WHERE id = ?",
      [commitmentId]
    );

    if (existingCommitment.length === 0) {
      return res.status(404).json({ error: "Commitment not found" });
    }

    const [result] = await pool.execute(
      "UPDATE commitments SET title = ?, description = ?, target_date = ?, status = ? WHERE id = ?",
      [title, description, targetDate, status, commitmentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Commitment not found" });
    }

    const updatedCommitment = {
      id: commitmentId,
      title,
      description,
      targetDate,
      status,
    };

    res.json(updatedCommitment);
  } catch (error) {
    console.error("Error updating commitment:", error);
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

// PUT /api/green-office/milestones/:id
app.put("/api/green-office/milestones/:id", async (req, res) => {
  try {
    const milestoneId = req.params.id;
    const { title, description, date, status } = req.body;

    if (!title || !description || !date || !status) {
      return res
        .status(400)
        .json({ error: "Title, description, date, and status are required" });
    }

    const [existingMilestone] = await pool.execute(
      "SELECT * FROM milestones WHERE id = ?",
      [milestoneId]
    );

    if (existingMilestone.length === 0) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    const [result] = await pool.execute(
      "UPDATE milestones SET title = ?, description = ?, date = ?, status = ? WHERE id = ?",
      [title, description, date, status, milestoneId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    const updatedMilestone = {
      id: milestoneId,
      title,
      description,
      date,
      status,
    };

    res.json(updatedMilestone);
  } catch (error) {
    console.error("Error updating milestone:", error);
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

// PUT /api/committees/:id
app.put("/api/committees/:id", async (req, res) => {
  try {
    const committeeId = req.params.id;
    const { name, description } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ error: "Name and description are required" });
    }

    const [existingCommittee] = await pool.execute(
      "SELECT * FROM committees WHERE id = ?",
      [committeeId]
    );

    if (existingCommittee.length === 0) {
      return res.status(404).json({ error: "Committee not found" });
    }

    const [result] = await pool.execute(
      "UPDATE committees SET name = ?, description = ? WHERE id = ?",
      [name, description, committeeId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Committee not found" });
    }

    const updatedCommittee = {
      id: committeeId,
      name,
      description,
    };

    res.json(updatedCommittee);
  } catch (error) {
    console.error("Error updating committee:", error);
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
        imagePath = req.file.filename;
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

// PUT /api/committees/:committeeId/members/:memberId
app.put(
  "/api/committees/:committeeId/members/:memberId",
  upload.single("image"),
  async (req, res) => {
    try {
      const { committeeId, memberId } = req.params;
      const { name, position, email, phone } = req.body;

      if (!name || !position || !email) {
        return res
          .status(400)
          .json({ error: "Name, position, and email are required" });
      }

      const [existingMember] = await pool.execute(
        "SELECT * FROM committee_members WHERE id = ? AND committee_id = ?",
        [memberId, committeeId]
      );

      if (existingMember.length === 0) {
        return res.status(404).json({ error: "Committee member not found" });
      }

      let imagePath = existingMember[0].image;
      if (req.file) {
        imagePath = req.file.filename;
      }

      const [result] = await pool.execute(
        "UPDATE committee_members SET name = ?, position = ?, email = ?, phone = ?, image = ? WHERE id = ? AND committee_id = ?",
        [name, position, email, phone || "", imagePath, memberId, committeeId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Committee member not found" });
      }

      const updatedMember = {
        id: memberId,
        name,
        position,
        email,
        phone: phone || "",
        image: ensureImageUrl(imagePath),
      };

      res.json(updatedMember);
    } catch (error) {
      console.error("Error updating committee member:", error);
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

// PUT /api/committees/:committeeId/meeting-minutes/:minutesId
app.put(
  "/api/committees/:committeeId/meeting-minutes/:minutesId",
  async (req, res) => {
    try {
      const { committeeId, minutesId } = req.params;
      const { title, date, content } = req.body;

      if (!title || !date || !content) {
        return res
          .status(400)
          .json({ error: "Title, date, and content are required" });
      }

      const [existingMinutes] = await pool.execute(
        "SELECT * FROM committee_meeting_minutes WHERE id = ? AND committee_id = ?",
        [minutesId, committeeId]
      );

      if (existingMinutes.length === 0) {
        return res.status(404).json({ error: "Meeting minutes not found" });
      }

      const [result] = await pool.execute(
        "UPDATE committee_meeting_minutes SET title = ?, date = ?, content = ? WHERE id = ? AND committee_id = ?",
        [title, date, content, minutesId, committeeId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Meeting minutes not found" });
      }

      const updatedMinutes = {
        id: minutesId,
        title,
        date,
        content,
      };

      res.json(updatedMinutes);
    } catch (error) {
      console.error("Error updating meeting minutes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

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
        imagePath = req.file.filename;
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

// PUT /api/student-council/members/:id
app.put(
  "/api/student-council/members/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      const memberId = req.params.id;
      const { name, position, email, phone } = req.body;

      if (!name || !position || !email) {
        return res
          .status(400)
          .json({ error: "Name, position, and email are required" });
      }

      const [existingMember] = await pool.execute(
        "SELECT * FROM student_council_members WHERE id = ?",
        [memberId]
      );

      if (existingMember.length === 0) {
        return res.status(404).json({ error: "Student council member not found" });
      }

      let imagePath = existingMember[0].image;
      if (req.file) {
        imagePath = req.file.filename;
      }

      const [result] = await pool.execute(
        "UPDATE student_council_members SET name = ?, position = ?, email = ?, phone = ?, image = ? WHERE id = ?",
        [name, position, email, phone || "", imagePath, memberId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Student council member not found" });
      }

      const updatedMember = {
        id: memberId,
        name,
        position,
        email,
        phone: phone || "",
        image: ensureImageUrl(imagePath),
      };

      res.json(updatedMember);
    } catch (error) {
      console.error("Error updating student council member:", error);
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

// PUT /api/student-council/meeting-minutes/:id
app.put("/api/student-council/meeting-minutes/:id", async (req, res) => {
  try {
    const minutesId = req.params.id;
    const { title, date, content } = req.body;

    if (!title || !date || !content) {
      return res
        .status(400)
        .json({ error: "Title, date, and content are required" });
    }

    const [existingMinutes] = await pool.execute(
      "SELECT * FROM student_council_meeting_minutes WHERE id = ?",
      [minutesId]
    );

    if (existingMinutes.length === 0) {
      return res.status(404).json({ error: "Meeting minutes not found" });
    }

    const [result] = await pool.execute(
      "UPDATE student_council_meeting_minutes SET title = ?, date = ?, content = ? WHERE id = ?",
      [title, date, content, minutesId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Meeting minutes not found" });
    }

    const updatedMinutes = {
      id: minutesId,
      title,
      date,
      content,
    };

    res.json(updatedMinutes);
  } catch (error) {
    console.error("Error updating student council meeting minutes:", error);
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
    debug: {
      uploads: "GET /debug/uploads",
      testImage: "GET /test-image/:filename",
    },
    endpoints: {
      environment: {
        base: "/api/environment",
        endpoints: {
          energyClimate: "GET/POST/DELETE /api/environment/energy-climate/*",
          waterConservation:
            "GET/POST/DELETE /api/environment/water-conservation/*",
          transportation: "GET/POST/DELETE /api/environment/transportation/*",
          biodiversity: "GET/POST/DELETE /api/environment/biodiversity/*",
          wasteManagement:
            "GET/POST/DELETE /api/environment/waste-management/*",
        },
      },
      greenOffice: {
        base: "/api/green-office",
        endpoints: {
          members: "GET/POST/PUT/DELETE /api/green-office/members",
          missions: "GET/POST/PUT/DELETE /api/green-office/missions",
          commitments: "GET/POST/PUT/DELETE /api/green-office/commitments",
          milestones: "GET/POST/PUT/DELETE /api/green-office/milestones",
        },
      },
      committees: {
        base: "/api/committees",
        endpoints: {
          main: "GET/POST/PUT/DELETE /api/committees",
          members: "POST/PUT/DELETE /api/committees/:id/members",
          meetingMinutes: "POST/PUT/DELETE /api/committees/:id/meeting-minutes",
        },
      },
      studentCouncil: {
        base: "/api/student-council",
        endpoints: {
          members: "GET/POST/PUT/DELETE /api/student-council/members",
          meetingMinutes:
            "GET/POST/PUT/DELETE /api/student-council/meeting-minutes",
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
      message: "Maximum file size is 40MB",
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
  console.log("📁 Static File Serving:");
  console.log(`   Root uploads: ${rootUploadsDir}`);
  console.log(`   Server uploads: ${serverUploadsDir}`);
  console.log("=================================");
  console.log("🔍 Debug Endpoints:");
  console.log(`   GET /debug/uploads - Check file system`);
  console.log(`   GET /test-image/:filename - Test image access`);
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
  console.log("  Achievements: /api/achievements/*");
  console.log("=================================");
});

export default app;