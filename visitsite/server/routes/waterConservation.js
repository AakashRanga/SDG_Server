import express from 'express';
import pool from '../db.js';

const router = express.Router();

const convertIdsToString = (data) => {
  if (!data) return [];
  return data.map(item => ({
    ...item,
    id: item.id.toString(),
    images: item.images ? JSON.parse(item.images) : [],
    files: item.files ? JSON.parse(item.files) : []
  }));
};

// Helper function for POST operations
const createItem = async (tableName, req, res, itemName) => {
  try {
    const { title, description, value, unit, year, status, images, files } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: 'Title and description are required'
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO ${tableName} (title, description, value, unit, year, status, images, files) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, value, unit, year, status, JSON.stringify(images || []), JSON.stringify(files || [])]
    );

    const newItem = {
      id: result.insertId.toString(),
      title,
      description,
      value,
      unit,
      year,
      status,
      images: images || [],
      files: files || []
    };

    res.status(201).json({
      success: true,
      message: `${itemName} item created successfully`,
      data: newItem
    });
  } catch (error) {
    console.error(`Error creating ${itemName} item:`, error);
    res.status(500).json({ 
      success: false,
      error: `Failed to create ${itemName} item`
    });
  }
};

// Helper function for DELETE operations
const deleteItem = async (tableName, req, res, itemName) => {
  try {
    const itemId = req.params.id;
    const [result] = await pool.execute(`DELETE FROM ${tableName} WHERE id = ?`, [itemId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    res.json({
      success: true,
      message: `${itemName} item deleted successfully`
    });
  } catch (error) {
    console.error(`Error deleting ${itemName} item:`, error);
    res.status(500).json({ 
      success: false,
      error: `Failed to delete ${itemName} item`
    });
  }
};

// GET all conservation items
router.get('/conservation', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM water_conservation_conservation ORDER BY id DESC');
    const items = convertIdsToString(rows);
    
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error('Error fetching conservation items:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch conservation items'
    });
  }
});

// POST new conservation item
router.post('/conservation', async (req, res) => {
  await createItem('water_conservation_conservation', req, res, 'Conservation');
});

// DELETE conservation item
router.delete('/conservation/:id', async (req, res) => {
  await deleteItem('water_conservation_conservation', req, res, 'Conservation');
});

// Recycling endpoints
router.get('/recycling', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM water_conservation_recycling ORDER BY id DESC');
    const items = convertIdsToString(rows);
    
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error('Error fetching recycling items:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch recycling items'
    });
  }
});

router.post('/recycling', async (req, res) => {
  await createItem('water_conservation_recycling', req, res, 'Recycling');
});

router.delete('/recycling/:id', async (req, res) => {
  await deleteItem('water_conservation_recycling', req, res, 'Recycling');
});

// Efficient Appliances endpoints - FIXED: Changed to kebab-case
router.get('/efficient-appliances', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM water_conservation_efficient_appliances ORDER BY id DESC');
    const items = convertIdsToString(rows);
    
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error('Error fetching efficient appliances items:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch efficient appliances items'
    });
  }
});

router.post('/efficient-appliances', async (req, res) => {
  await createItem('water_conservation_efficient_appliances', req, res, 'Efficient Appliances');
});

router.delete('/efficient-appliances/:id', async (req, res) => {
  await deleteItem('water_conservation_efficient_appliances', req, res, 'Efficient Appliances');
});

// Wastewater Treatment endpoints - FIXED: Changed to kebab-case
router.get('/wastewater-treatment', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM water_conservation_wastewater_treatment ORDER BY id DESC');
    const items = convertIdsToString(rows);
    
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error('Error fetching wastewater treatment items:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch wastewater treatment items'
    });
  }
});

router.post('/wastewater-treatment', async (req, res) => {
  await createItem('water_conservation_wastewater_treatment', req, res, 'Wastewater Treatment');
});

router.delete('/wastewater-treatment/:id', async (req, res) => {
  await deleteItem('water_conservation_wastewater_treatment', req, res, 'Wastewater Treatment');
});

export default router;