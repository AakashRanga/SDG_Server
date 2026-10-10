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

// Shuttle Services endpoints
router.get('/shuttle-services', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM transportation_shuttle_services ORDER BY id DESC');
    const items = convertIdsToString(rows);
    
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error('Error fetching shuttle services items:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch shuttle services items'
    });
  }
});

router.post('/shuttle-services', async (req, res) => {
  await createItem('transportation_shuttle_services', req, res, 'Shuttle Services');
});

router.delete('/shuttle-services/:id', async (req, res) => {
  await deleteItem('transportation_shuttle_services', req, res, 'Shuttle Services');
});

// Pedestrian Paths endpoints
router.get('/pedestrian-paths', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM transportation_pedestrian_paths ORDER BY id DESC');
    const items = convertIdsToString(rows);
    
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error('Error fetching pedestrian paths items:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch pedestrian paths items'
    });
  }
});

router.post('/pedestrian-paths', async (req, res) => {
  await createItem('transportation_pedestrian_paths', req, res, 'Pedestrian Paths');
});

router.delete('/pedestrian-paths/:id', async (req, res) => {
  await deleteItem('transportation_pedestrian_paths', req, res, 'Pedestrian Paths');
});

// Zero Emission endpoints
router.get('/zero-emission', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM transportation_zero_emission ORDER BY id DESC');
    const items = convertIdsToString(rows);
    
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error('Error fetching zero emission items:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch zero emission items'
    });
  }
});

router.post('/zero-emission', async (req, res) => {
  await createItem('transportation_zero_emission', req, res, 'Zero Emission');
});

router.delete('/zero-emission/:id', async (req, res) => {
  await deleteItem('transportation_zero_emission', req, res, 'Zero Emission');
});

// Parking Reduction endpoints
router.get('/parking-reduction', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM transportation_parking_reduction ORDER BY id DESC');
    const items = convertIdsToString(rows);
    
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error('Error fetching parking reduction items:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch parking reduction items'
    });
  }
});

router.post('/parking-reduction', async (req, res) => {
  await createItem('transportation_parking_reduction', req, res, 'Parking Reduction');
});

router.delete('/parking-reduction/:id', async (req, res) => {
  await deleteItem('transportation_parking_reduction', req, res, 'Parking Reduction');
});

export default router;