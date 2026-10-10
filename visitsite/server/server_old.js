// server/server.js
import express from 'express';   // Use import instead of require
import mysql from 'mysql2';      // Use import instead of require
import cors from 'cors';         // Use import instead of require
import path from 'path';
import { fileURLToPath } from 'url';
import greenOfficeMembersRoutes from './api/green-office/greenOfficeMembersRoutes.js';  // Use import instead of require
import greenOfficeMissionsRoutes from './api/green-office/greenOfficeMissionsRoutes.js';  // Use import instead of require
import greenOfficeAddMembersRoutes from './api/green-office/greenOfficeAddMembersRoutes.js';  // Use import instead of require
import greenOfficeAddMissionsRoutes from './api/green-office/greenOfficeAddMissionsRoutes.js';  // Use import instead of require

import greenOfficeCommitmentsRoutes from './api/green-office/greenOfficeCommitmentsRoutes.js';  // Use import instead of require
import greenOfficeMilestonesRoutes from './api/green-office/greenOfficeMilestonesRoutes.js';  // Use import instead of require
import greenOfficeAddCommitmentsRoutes from "./api/green-office/greenOfficeAddCommitmentsRoutes.js";
import greenOfficeAddMilestonesRoutes from "./api/green-office/greenOfficeAddMilestonesRoutes.js";

import greenOfficeCommitteeRoutes from './api/student-council/greenOfficeCommitteeRoutes.js';  // Use import instead of require
//import greenOfficeCommitteesRoutes from './api/greenOfficeCommitteesRoutes.js';  // Use import instead of require 
//import greenOfficeAddCommitteeRoutes from "./api/green-office/greenOfficeAddCommitteeRoutes.js";

const app = express();
const port = 8005;

// Fix for ES modules path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());  // Enable CORS for cross-origin requests greenOfficeAddCommitteeRoutes.js
app.use(express.json());  // Parse incoming JSON requests
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded images 

// Use the green office API routes
app.use('/api/green-office', greenOfficeMembersRoutes);
app.use('/api/green-office', greenOfficeMissionsRoutes);
app.use('/api/green-office', greenOfficeAddMembersRoutes);
app.use('/api/green-office', greenOfficeAddMissionsRoutes);
app.use('/api/green-office', greenOfficeCommitmentsRoutes);
app.use('/api/green-office', greenOfficeMilestonesRoutes);
app.use('/api/green-office', greenOfficeAddCommitmentsRoutes);
app.use('/api/green-office', greenOfficeAddMilestonesRoutes);

app.use('/api/student-council/', greenOfficeCommitteeRoutes);
//app.use('/api/', greenOfficeCommitteesRoutes);
//app.use("/api/green-office", greenOfficeAddCommitteeRoutes);


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
