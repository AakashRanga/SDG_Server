import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/green-office/members - Get all members
router.get('/', async (req, res) => {
  try {
    console.log('🟢 GET /api/green-office/members - Fetching all members');
    
    const [rows] = await pool.execute(`
      SELECT * FROM members 
      ORDER BY created_at DESC
    `);
    
    // Convert numeric IDs to strings for React consistency
    const members = rows.map(member => ({
      ...member,
      id: member.id.toString()
    }));
    
    console.log(`✅ Found ${members.length} members`);
    
    res.json({
      success: true,
      data: members,
      count: members.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching members:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch members',
      message: error.message
    });
  }
});

// POST /api/green-office/members - Create new member
router.post('/', async (req, res) => {
  try {
    const { name, position, email, phone, image } = req.body;
    
    console.log('🟢 POST /api/green-office/members - Creating member:', { name });
    
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Name is required'
      });
    }
    
    if (!position || !position.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Position is required'
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO members (name, position, email, phone, image) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), position.trim(), email?.trim() || null, phone?.trim() || null, image || null]
    );

    const newMember = {
      id: result.insertId.toString(),
      name: name.trim(),
      position: position.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      image: image || null
    };

    console.log('✅ Member created successfully');
    
    res.status(201).json({
      success: true,
      message: 'Member created successfully',
      data: newMember
    });
    
  } catch (error) {
    console.error('❌ Error creating member:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create member',
      message: error.message
    });
  }
});

// PUT /api/green-office/members/:id - Update member
router.put('/:id', async (req, res) => {
  try {
    const memberId = req.params.id;
    const { name, position, email, phone, image } = req.body;
    
    console.log(`🟢 PUT /api/green-office/members/${memberId} - Updating member`);
    
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Name is required'
      });
    }
    
    if (!position || !position.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Position is required'
      });
    }

    // First check if member exists
    const [existingMember] = await pool.execute(
      'SELECT * FROM members WHERE id = ?',
      [memberId]
    );

    if (existingMember.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }

    // Update member
    const [result] = await pool.execute(
      'UPDATE members SET name = ?, position = ?, email = ?, phone = ?, image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name.trim(), position.trim(), email?.trim() || null, phone?.trim() || null, image || null, memberId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }

    // Fetch updated member
    const [updatedRows] = await pool.execute(
      'SELECT * FROM members WHERE id = ?',
      [memberId]
    );

    const updatedMember = {
      ...updatedRows[0],
      id: updatedRows[0].id.toString()
    };

    console.log('✅ Member updated successfully');
    
    res.json({
      success: true,
      message: 'Member updated successfully',
      data: updatedMember
    });
    
  } catch (error) {
    console.error('❌ Error updating member:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update member',
      message: error.message
    });
  }
});

// DELETE /api/green-office/members/:id
router.delete('/:id', async (req, res) => {
  try {
    const memberId = req.params.id;
    console.log(`🟢 DELETE /api/green-office/members/${memberId}`);
    
    const [result] = await pool.execute(
      'DELETE FROM members WHERE id = ?',
      [memberId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }

    console.log('✅ Member deleted successfully');
    
    res.json({
      success: true,
      message: 'Member deleted successfully',
      deletedId: memberId
    });
    
  } catch (error) {
    console.error('❌ Error deleting member:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete member',
      message: error.message
    });
  }
});

export default router;