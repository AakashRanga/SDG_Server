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

import infrastructuresiteRoutes from "./routes/infrastructuresiteRoutes.js";
import infrastructureRoutes from "./routes/infrastructureRoutes.js";
import accessibilityRoutes from "./routes/accessibilityRoutes.js";
import wellnessRoutes from "./routes/wellnessRoutes.js";
import smartBuildingsRoutes from "./routes/smartBuildingsRoutes.js";
import infrastructurePlanningRoutes from "./routes/infrastructurePlanningRoutes.js";
import infrastructureBudgetRoutes from "./routes//infrastructureBudgetRoutes.js";

const app = express();
const PORT = process.env.PORT || 8005;

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
app.use("/uploads", express.static("uploads"));

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
    fileSize: 10 * 1024 * 1024, // 10MB limit
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

// use the infrastruture api
app.use("/api/infrastructuresite", infrastructuresiteRoutes);
app.use("/api/infrastructure", infrastructureRoutes);
app.use("/api/accessibility", accessibilityRoutes);
app.use("/api/wellness", wellnessRoutes);
app.use("/api/smartBuildings", smartBuildingsRoutes);
app.use("/api/planning", infrastructurePlanningRoutes);
app.use("/api/budget", infrastructureBudgetRoutes);

// ======================
// CORE API ENDPOINTS
// ======================

// Health check
app.get("/api/health", async (req, res) => {
  try {
    const healthCheck = {
      status: "OK",
      message: "Environment Sustainability API is running",
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

    const dashboardData = {
      totalInitiatives:
        climateCount[0].count +
        energyCount[0].count +
        waterCount[0].count +
        transportCount[0].count +
        bioCount[0].count,
      categories: {
        energyClimate: climateCount[0].count + energyCount[0].count,
        waterConservation: waterCount[0].count,
        transportation: transportCount[0].count,
        biodiversity: bioCount[0].count,
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

// API Documentation
app.get("/api", (req, res) => {
  res.json({
    api: "Environment Sustainability API",
    version: "1.0.0",
    description:
      "Comprehensive API for managing environmental sustainability initiatives",
    documentation: "Visit /api/environment for detailed endpoint documentation",
    health: "GET /api/health",
    dashboard: "GET /api/environment/dashboard",
    upload: "POST /api/upload",
  });
});

app.get("/api/environment", (req, res) => {
  res.json({
    message: "Environment Sustainability API",
    version: "1.0.0",
    baseUrl: "/api/environment",
    endpoints: {
      energyClimate: {
        base: "/api/environment/energy-climate",
        endpoints: {
          climateChange: "GET/POST/DELETE /climate-change",
          renewableEnergy: "GET/POST/DELETE /renewable-energy",
          energyPrograms: "GET/POST/DELETE /energy-programs",
          greenBuilding: "GET/POST/DELETE /green-building",
          carbonFootprint: "GET/POST/DELETE /carbon-footprint",
          ghgReduction: "GET/POST/DELETE /ghg-reduction",
        },
      },
      waterConservation: {
        base: "/api/environment/water-conservation",
        endpoints: {
          conservation: "GET/POST/DELETE /conservation",
          recycling: "GET/POST/DELETE /recycling",
          efficientAppliances: "GET/POST/DELETE /efficient-appliances",
          wastewaterTreatment: "GET/POST/DELETE /wastewater-treatment",
        },
      },
      transportation: {
        base: "/api/environment/transportation",
        endpoints: {
          shuttleServices: "GET/POST/DELETE /shuttle-services",
          pedestrianPaths: "GET/POST/DELETE /pedestrian-paths",
          zeroEmission: "GET/POST/DELETE /zero-emission",
          parkingReduction: "GET/POST/DELETE /parking-reduction",
        },
      },
      biodiversity: {
        base: "/api/environment/biodiversity",
        endpoints: {
          floraFauna: "GET/POST/DELETE /flora-fauna",
          biodiversityMapping: "GET/POST/DELETE /biodiversity-mapping",
          greenCorridors: "GET/POST/DELETE /green-corridors",
        },
      },
      system: {
        health: "GET /api/health",
        dashboard: "GET /api/environment/dashboard",
        upload: "POST /api/upload",
      },
    },
  });
});

// ======================
// ERROR HANDLING
// ======================

// 404 handler - SIMPLIFIED VERSION
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    path: req.originalUrl,
    method: req.method,
    documentation: "GET /api/environment for available endpoints",
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
  console.log("🚀 Environment Sustainability API");
  console.log("=================================");
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}/api`);
  console.log(`🏷️  Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("=================================");
  console.log("Available Endpoints:");
  console.log("  GET  /api/health          - Health check");
  console.log("  GET  /api/environment     - API documentation");
  console.log("  GET  /api/environment/dashboard - Statistics dashboard");
  console.log("  POST /api/upload          - File upload");
  console.log("=================================");
});

export default app;
