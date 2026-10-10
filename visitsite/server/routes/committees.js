// routes/committees.js
import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all committees
router.get('/', async (req, res) => {
  try {
    console.log('🟢 GET /api/committees - Fetching all committees');
    
    const [rows] = await pool.execute('SELECT * FROM committees ORDER BY id DESC');
    
    const committees = rows.map(committee => ({
      id: committee.id.toString(),
      name: committee.name,
      description: committee.description,
      createdAt: committee.created_at
    }));
    
    console.log(`✅ Found ${committees.length} committees`);
    
    res.json({
      success: true,
      data: committees,
      count: committees.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching committees:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch committees'
    });
  }
});

// Add other committee endpoints as needed...

export default router;