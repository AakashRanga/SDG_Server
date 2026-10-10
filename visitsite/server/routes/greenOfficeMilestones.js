// routes/greenOfficeMilestones.js
import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all milestones
router.get('/', async (req, res) => {
  try {
    console.log('🟢 GET /api/green-office/milestones - Fetching all milestones');
    
    const [rows] = await pool.execute('SELECT * FROM milestones ORDER BY date DESC');
    
    const milestones = rows.map(milestone => ({
      id: milestone.id.toString(),
      title: milestone.title,
      description: milestone.description,
      date: milestone.date,
      status: milestone.status,
      createdAt: milestone.created_at
    }));
    
    console.log(`✅ Found ${milestones.length} milestones`);
    
    res.json({
      success: true,
      data: milestones,
      count: milestones.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching milestones:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch milestones',
      message: error.message
    });
  }
});

// GET single milestone by ID
router.get('/:id', async (req, res) => {
  try {
    const milestoneId = req.params.id;
    console.log(`🟢 GET /api/green-office/milestones/${milestoneId}`);
    
    const [rows] = await pool.execute(
      'SELECT * FROM milestones WHERE id = ?',
      [milestoneId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found'
      });
    }
    
    const milestone = {
      id: rows[0].id.toString(),
      title: rows[0].title,
      description: rows[0].description,
      date: rows[0].date,
      status: rows[0].status,
      createdAt: rows[0].created_at
    };
    
    res.json({
      success: true,
      data: milestone
    });
    
  } catch (error) {
    console.error('❌ Error fetching milestone:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch milestone'
    });
  }
});

// POST create new milestone
router.post('/', async (req, res) => {
  try {
    const { title, description, date, status = 'upcoming' } = req.body;
    
    console.log('🟢 POST /api/green-office/milestones - Creating milestone:', { title });
    
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }
    
    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Description is required'
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Date is required'
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO milestones (title, description, date, status) VALUES (?, ?, ?, ?)',
      [title.trim(), description.trim(), date, status]
    );

    const newMilestone = {
      id: result.insertId.toString(),
      title: title.trim(),
      description: description.trim(),
      date: date,
      status: status
    };

    console.log('✅ Milestone created successfully');
    
    res.status(201).json({
      success: true,
      message: 'Milestone created successfully',
      data: newMilestone
    });
    
  } catch (error) {
    console.error('❌ Error creating milestone:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create milestone',
      message: error.message
    });
  }
});

// PUT update milestone
router.put('/:id', async (req, res) => {
  try {
    const milestoneId = req.params.id;
    const { title, description, date, status } = req.body;
    
    console.log(`🟢 PUT /api/green-office/milestones/${milestoneId}`);
    
    // Check if milestone exists
    const [existingRows] = await pool.execute(
      'SELECT * FROM milestones WHERE id = ?',
      [milestoneId]
    );
    
    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found'
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }
    
    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Description is required'
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Date is required'
      });
    }

    const [result] = await pool.execute(
      'UPDATE milestones SET title = ?, description = ?, date = ?, status = ? WHERE id = ?',
      [title.trim(), description.trim(), date, status, milestoneId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found'
      });
    }

    const updatedMilestone = {
      id: milestoneId,
      title: title.trim(),
      description: description.trim(),
      date: date,
      status: status
    };

    console.log('✅ Milestone updated successfully');
    
    res.json({
      success: true,
      message: 'Milestone updated successfully',
      data: updatedMilestone
    });
    
  } catch (error) {
    console.error('❌ Error updating milestone:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update milestone'
    });
  }
});

// DELETE milestone
router.delete('/:id', async (req, res) => {
  try {
    const milestoneId = req.params.id;
    console.log(`🟢 DELETE /api/green-office/milestones/${milestoneId}`);
    
    const [result] = await pool.execute(
      'DELETE FROM milestones WHERE id = ?',
      [milestoneId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found'
      });
    }

    console.log('✅ Milestone deleted successfully');
    
    res.json({
      success: true,
      message: 'Milestone deleted successfully',
      deletedId: milestoneId
    });
    
  } catch (error) {
    console.error('❌ Error deleting milestone:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete milestone'
    });
  }
});

export default router;