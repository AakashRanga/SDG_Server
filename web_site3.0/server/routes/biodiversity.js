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

// Flora Fauna endpoints
router.get('/flora-fauna', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM biodiversity_flora_fauna ORDER BY id DESC');
    const items = convertIdsToString(rows);
    
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error('Error fetching flora fauna items:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch flora fauna items'
    });
  }
});

router.post('/flora-fauna', async (req, res) => {
  await createItem('biodiversity_flora_fauna', req, res, 'Flora Fauna');
});

router.delete('/flora-fauna/:id', async (req, res) => {
  await deleteItem('biodiversity_flora_fauna', req, res, 'Flora Fauna');
});

// Biodiversity Mapping endpoints
router.get('/biodiversity-mapping', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM biodiversity_biodiversity_mapping ORDER BY id DESC');
    const items = convertIdsToString(rows);
    
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error('Error fetching biodiversity mapping items:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch biodiversity mapping items'
    });
  }
});

router.post('/biodiversity-mapping', async (req, res) => {
  await createItem('biodiversity_biodiversity_mapping', req, res, 'Biodiversity Mapping');
});

router.delete('/biodiversity-mapping/:id', async (req, res) => {
  await deleteItem('biodiversity_biodiversity_mapping', req, res, 'Biodiversity Mapping');
});

// Green Corridors endpoints
router.get('/green-corridors', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM biodiversity_green_corridors ORDER BY id DESC');
    const items = convertIdsToString(rows);
    
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error('Error fetching green corridors items:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch green corridors items'
    });
  }
});

router.post('/green-corridors', async (req, res) => {
  await createItem('biodiversity_green_corridors', req, res, 'Green Corridors');
});

router.delete('/green-corridors/:id', async (req, res) => {
  await deleteItem('biodiversity_green_corridors', req, res, 'Green Corridors');
});

export default router;