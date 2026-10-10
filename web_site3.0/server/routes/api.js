// routes/api.js
import express from 'express';
import greenOfficeMembersRoutes from './greenOfficeMembers.js';

const router = express.Router();

// Mount routes
router.use('/green-office/members', greenOfficeMembersRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Green Office API is running',
    timestamp: new Date().toISOString()
  });
});

// API root
router.get('/', (req, res) => {
  res.json({
    message: 'Green Office Management System API',
    version: '1.0.0',
    endpoints: {
      greenOffice: {
        members: {
          getAll: 'GET /api/green-office/members',
          getOne: 'GET /api/green-office/members/:id',
          create: 'POST /api/green-office/members',
          update: 'PUT /api/green-office/members/:id',
          delete: 'DELETE /api/green-office/members/:id',
          search: 'GET /api/green-office/members/search/:query'
        }
      },
      health: 'GET /api/health'
    }
  });
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'API test endpoint is working!' });
});

// 404 handler for API routes
router.use((req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

export default router;