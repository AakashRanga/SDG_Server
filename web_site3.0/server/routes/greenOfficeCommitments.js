// routes/greenOfficeCommitments.js
import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all commitments
router.get('/', async (req, res) => {
  try {
    console.log('🟢 GET /api/green-office/commitments - Fetching all commitments');
    
    const [rows] = await pool.execute('SELECT * FROM commitments ORDER BY id DESC');
    
    const commitments = rows.map(commitment => ({
      id: commitment.id.toString(),
      title: commitment.title,
      description: commitment.description,
      targetDate: commitment.target_date,
      status: commitment.status,
      createdAt: commitment.created_at
    }));
    
    console.log(`✅ Found ${commitments.length} commitments`);
    
    res.json({
      success: true,
      data: commitments,
      count: commitments.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching commitments:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch commitments',
      message: error.message
    });
  }
});

// GET single commitment by ID
router.get('/:id', async (req, res) => {
  try {
    const commitmentId = req.params.id;
    console.log(`🟢 GET /api/green-office/commitments/${commitmentId}`);
    
    const [rows] = await pool.execute(
      'SELECT * FROM commitments WHERE id = ?',
      [commitmentId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Commitment not found'
      });
    }
    
    const commitment = {
      id: rows[0].id.toString(),
      title: rows[0].title,
      description: rows[0].description,
      targetDate: rows[0].target_date,
      status: rows[0].status,
      createdAt: rows[0].created_at
    };
    
    res.json({
      success: true,
      data: commitment
    });
    
  } catch (error) {
    console.error('❌ Error fetching commitment:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch commitment'
    });
  }
});

// POST create new commitment
router.post('/', async (req, res) => {
  try {
    const { title, description, targetDate, status = 'pending' } = req.body;
    
    console.log('🟢 POST /api/green-office/commitments - Creating commitment:', { title });
    
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

    if (!targetDate) {
      return res.status(400).json({
        success: false,
        error: 'Target date is required'
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO commitments (title, description, target_date, status) VALUES (?, ?, ?, ?)',
      [title.trim(), description.trim(), targetDate, status]
    );

    const newCommitment = {
      id: result.insertId.toString(),
      title: title.trim(),
      description: description.trim(),
      targetDate: targetDate,
      status: status
    };

    console.log('✅ Commitment created successfully');
    
    res.status(201).json({
      success: true,
      message: 'Commitment created successfully',
      data: newCommitment
    });
    
  } catch (error) {
    console.error('❌ Error creating commitment:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create commitment',
      message: error.message
    });
  }
});

// PUT update commitment
router.put('/:id', async (req, res) => {
  try {
    const commitmentId = req.params.id;
    const { title, description, targetDate, status } = req.body;
    
    console.log(`🟢 PUT /api/green-office/commitments/${commitmentId}`);
    
    // Check if commitment exists
    const [existingRows] = await pool.execute(
      'SELECT * FROM commitments WHERE id = ?',
      [commitmentId]
    );
    
    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Commitment not found'
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

    if (!targetDate) {
      return res.status(400).json({
        success: false,
        error: 'Target date is required'
      });
    }

    const [result] = await pool.execute(
      'UPDATE commitments SET title = ?, description = ?, target_date = ?, status = ? WHERE id = ?',
      [title.trim(), description.trim(), targetDate, status, commitmentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Commitment not found'
      });
    }

    const updatedCommitment = {
      id: commitmentId,
      title: title.trim(),
      description: description.trim(),
      targetDate: targetDate,
      status: status
    };

    console.log('✅ Commitment updated successfully');
    
    res.json({
      success: true,
      message: 'Commitment updated successfully',
      data: updatedCommitment
    });
    
  } catch (error) {
    console.error('❌ Error updating commitment:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update commitment'
    });
  }
});

// DELETE commitment
router.delete('/:id', async (req, res) => {
  try {
    const commitmentId = req.params.id;
    console.log(`🟢 DELETE /api/green-office/commitments/${commitmentId}`);
    
    const [result] = await pool.execute(
      'DELETE FROM commitments WHERE id = ?',
      [commitmentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Commitment not found'
      });
    }

    console.log('✅ Commitment deleted successfully');
    
    res.json({
      success: true,
      message: 'Commitment deleted successfully',
      deletedId: commitmentId
    });
    
  } catch (error) {
    console.error('❌ Error deleting commitment:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete commitment'
    });
  }
});

export default router;