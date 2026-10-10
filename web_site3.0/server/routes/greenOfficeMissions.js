import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/green-office/missions - Get all missions (CORRECT ENDPOINT)
router.get('/', async (req, res) => {
  try {
    console.log('🟢 GET /api/green-office/missions - Fetching all missions');
    
    const [rows] = await pool.execute(`
      SELECT * FROM missions 
      ORDER BY id DESC
    `);
    
    const missions = rows.map(mission => ({
      ...mission,
      id: mission.id.toString()
    }));
    
    console.log(`✅ Found ${missions.length} missions`);
    
    res.json({
      success: true,
      data: missions,
      count: missions.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching missions:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch missions',
      message: error.message
    });
  }
});

// TEMPORARY: Add the wrong endpoint that your React app is calling
// GET /api/green-office/get-missions - Temporary fix for wrong endpoint
router.get('/get-missions', async (req, res) => {
  try {
    console.log('🟡 TEMPORARY: GET /api/green-office/get-missions called');
    console.log('💡 Please update your React app to use /missions instead of /get-missions');
    
    const [rows] = await pool.execute(`
      SELECT * FROM missions 
      ORDER BY id DESC
    `);
    
    const missions = rows.map(mission => ({
      ...mission,
      id: mission.id.toString()
    }));
    
    res.json({
      success: true,
      data: missions,
      count: missions.length,
      note: 'Please update your React app to use /api/green-office/missions instead of /api/green-office/get-missions'
    });
    
  } catch (error) {
    console.error('❌ Error in temporary get-missions endpoint:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch missions',
      message: error.message
    });
  }
});

export default router;