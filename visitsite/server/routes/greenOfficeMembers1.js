import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from '../db.js';

const router = express.Router();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    const fileExtension = path.extname(file.originalname);
    cb(null, `member_${uniqueSuffix}${fileExtension}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Error: Only image files are allowed (JPEG, JPG, PNG, GIF, WEBP)'));
    }
  }
});

// ==================== GET ALL MEMBERS ====================
router.get('/', async (req, res) => {
  try {
    console.log('🟢 GET /api/green-office/members - Fetching all members');
    
    const [rows] = await pool.execute(`
      SELECT * FROM green_office_members 
      ORDER BY id DESC
    `);
    
    // Convert numeric IDs to strings for React consistency
    const members = rows.map(member => ({
      id: member.id.toString(),
      name: member.name,
      position: member.position,
      email: member.email,
      phone: member.phone || '',
      image: member.image || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
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

// ==================== GET SINGLE MEMBER BY ID ====================
router.get('/:id', async (req, res) => {
  try {
    const memberId = req.params.id;
    console.log(`🟢 GET /api/green-office/members/${memberId} - Fetching member`);
    
    if (!memberId) {
      return res.status(400).json({
        success: false,
        error: 'Member ID is required'
      });
    }

    const [rows] = await pool.execute(
      'SELECT * FROM green_office_members WHERE id = ?',
      [memberId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }
    
    const member = {
      id: rows[0].id.toString(),
      name: rows[0].name,
      position: rows[0].position,
      email: rows[0].email,
      phone: rows[0].phone || '',
      image: rows[0].image || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
    };
    
    console.log(`✅ Found member: ${member.name}`);
    
    res.json({
      success: true,
      data: member
    });
    
  } catch (error) {
    console.error('❌ Error fetching member:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch member',
      message: error.message
    });
  }
});

// ==================== CREATE NEW MEMBER ====================
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, position, email, phone } = req.body;
    
    console.log('🟢 POST /api/green-office/members - Creating new member:', { 
      name, 
      position, 
      email, 
      phone: phone || 'Not provided' 
    });
    
    // Validation
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
    if (!email || !email.trim()) {
      return res.status(400).json({ 
        success: false,
        error: 'Email is required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email format' 
      });
    }

    // Handle image upload
    let imagePath = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'; // Default image
    if (req.file) {
      imagePath = '/uploads/' + req.file.filename;
      console.log('📸 Image uploaded:', imagePath);
    }

    // Insert into MySQL
    const [result] = await pool.execute(
      'INSERT INTO green_office_members (name, position, email, phone, image) VALUES (?, ?, ?, ?, ?)',
      [
        name.trim(), 
        position.trim(), 
        email.trim(), 
        phone?.trim() || '', 
        imagePath
      ]
    );

    const newMember = {
      id: result.insertId.toString(),
      name: name.trim(),
      position: position.trim(),
      email: email.trim(),
      phone: phone?.trim() || '',
      image: imagePath
    };

    console.log('✅ Member created successfully:', newMember.name);
    
    res.status(201).json({
      success: true,
      message: 'Member created successfully',
      data: newMember
    });
    
  } catch (error) {
    console.error('❌ Error creating member:', error);
    
    // Handle duplicate email error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false,
        error: 'Email already exists' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to create member',
      message: error.message
    });
  }
});

// ==================== UPDATE MEMBER ====================
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const memberId = req.params.id;
    const { name, position, email, phone } = req.body;
    
    console.log(`🟢 PUT /api/green-office/members/${memberId} - Updating member`);
    
    if (!memberId) {
      return res.status(400).json({
        success: false,
        error: 'Member ID is required'
      });
    }

    // Check if member exists
    const [existingRows] = await pool.execute(
      'SELECT * FROM green_office_members WHERE id = ?',
      [memberId]
    );
    
    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }

    // Validation
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
    if (!email || !email.trim()) {
      return res.status(400).json({ 
        success: false,
        error: 'Email is required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email format' 
      });
    }

    // Handle image upload - keep existing image if no new image uploaded
    let imagePath = existingRows[0].image;
    if (req.file) {
      imagePath = '/uploads/' + req.file.filename;
      console.log('📸 New image uploaded:', imagePath);
    }

    // Update in MySQL
    const [result] = await pool.execute(
      'UPDATE green_office_members SET name = ?, position = ?, email = ?, phone = ?, image = ? WHERE id = ?',
      [
        name.trim(), 
        position.trim(), 
        email.trim(), 
        phone?.trim() || '', 
        imagePath, 
        memberId
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }

    const updatedMember = {
      id: memberId,
      name: name.trim(),
      position: position.trim(),
      email: email.trim(),
      phone: phone?.trim() || '',
      image: imagePath
    };

    console.log('✅ Member updated successfully:', updatedMember.name);
    
    res.json({
      success: true,
      message: 'Member updated successfully',
      data: updatedMember
    });
    
  } catch (error) {
    console.error('❌ Error updating member:', error);
    
    // Handle duplicate email error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false,
        error: 'Email already exists' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to update member',
      message: error.message
    });
  }
});

// ==================== DELETE MEMBER ====================
router.delete('/:id', async (req, res) => {
  try {
    const memberId = req.params.id;
    console.log(`🟢 DELETE /api/green-office/members/${memberId} - Deleting member`);
    
    if (!memberId) {
      return res.status(400).json({
        success: false,
        error: 'Member ID is required'
      });
    }

    const [result] = await pool.execute(
      'DELETE FROM green_office_members WHERE id = ?',
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

// ==================== SEARCH MEMBERS ====================
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = `%${req.params.query}%`;
    console.log(`🟢 GET /api/green-office/members/search/${req.params.query} - Searching members`);
    
    const [rows] = await pool.execute(
      `SELECT * FROM green_office_members 
       WHERE name LIKE ? OR position LIKE ? OR email LIKE ?
       ORDER BY name ASC`,
      [searchQuery, searchQuery, searchQuery]
    );
    
    const members = rows.map(member => ({
      id: member.id.toString(),
      name: member.name,
      position: member.position,
      email: member.email,
      phone: member.phone || '',
      image: member.image || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
    }));
    
    console.log(`✅ Found ${members.length} members matching search`);
    
    res.json({
      success: true,
      data: members,
      count: members.length,
      searchQuery: req.params.query
    });
    
  } catch (error) {
    console.error('❌ Error searching members:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to search members',
      message: error.message
    });
  }
});

// ==================== BULK OPERATIONS ====================

// Get members count
router.get('/stats/count', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT COUNT(*) as total FROM green_office_members');
    const total = rows[0].total;
    
    res.json({
      success: true,
      data: { total }
    });
  } catch (error) {
    console.error('❌ Error getting members count:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get members count'
    });
  }
});

// Export the router
export default router;