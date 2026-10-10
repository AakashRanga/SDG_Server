// server/server.js
import express from 'express';   // Use import instead of require
import mysql from 'mysql2';      // Use import instead of require
import cors from 'cors';         // Use import instead of require
import greenOfficeRoutes from './api/green-office/greenOfficeRoutes.js';  // Use import instead of require

const app = express();
const port = 8005;

// Middleware
app.use(cors());  // Enable CORS for cross-origin requests
app.use(express.json());  // Parse incoming JSON requests

// Use the green office API routes
app.use('/api/green-office', greenOfficeRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
