import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Add detailed request logging
router.use((req, res, next) => {
  console.log(`📨 [${new Date().toISOString()}] ${req.method} ${req.path}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Helper function to convert IDs to strings
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
const createItem = async (tableName, req, res) => {
  try {
    console.log(`🔄 CREATE operation for table: ${tableName}`);
    const { title, description, value, unit, year, status, images, files } = req.body;
    
    console.log('📝 Received data:', { title, description, value, unit, year, status });

    if (!title || !description) {
      console.log('❌ Validation failed: Title or description missing');
      return res.status(400).json({
        success: false,
        error: 'Title and description are required'
      });
    }

    console.log('💾 Attempting database insert...');
    const [result] = await pool.execute(
      `INSERT INTO ${tableName} (title, description, value, unit, year, status, images, files) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, value, unit, year, status, JSON.stringify(images || []), JSON.stringify(files || [])]
    );

    console.log('✅ Database insert successful, ID:', result.insertId);

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

    console.log('📦 Sending response with new item');
    res.status(201).json({
      success: true,
      message: `${tableName.split('_').pop().replace(/-/g, ' ')} item created successfully`,
      data: newItem
    });
  } catch (error) {
    console.error(`❌ Error creating ${tableName} item:`, error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false,
      error: `Failed to create ${tableName.split('_').pop().replace(/-/g, ' ')} item`,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function for DELETE operations
const deleteItem = async (tableName, req, res) => {
  try {
    const itemId = req.params.id;
    console.log(`🔄 DELETE operation for table: ${tableName}, ID: ${itemId}`);

    console.log('🗑️ Attempting database delete...');
    const [result] = await pool.execute(`DELETE FROM ${tableName} WHERE id = ?`, [itemId]);
    
    if (result.affectedRows === 0) {
      console.log('❌ Item not found for deletion');
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    console.log('✅ Database delete successful, affected rows:', result.affectedRows);
    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error(`❌ Error deleting ${tableName} item:`, error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete item',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Climate Change endpoints
router.get('/climate-change', async (req, res) => {
  try {
    console.log('📋 Fetching climate change items...');
    const [rows] = await pool.execute('SELECT * FROM energy_climate_climate_change ORDER BY id DESC');
    const items = convertIdsToString(rows);
    
    console.log(`✅ Successfully fetched ${items.length} items`);
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error('❌ Error fetching climate change items:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch climate change items'
    });
  }
});

router.post('/climate-change', async (req, res) => {
  await createItem('energy_climate_climate_change', req, res);
});

router.delete('/climate-change/:id', async (req, res) => {
  await deleteItem('energy_climate_climate_change', req, res);
});

// Renewable Energy endpoints
router.get('/renewable-energy', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM energy_climate_renewable_energy ORDER BY id DESC');
    const items = convertIdsToString(rows);
    
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error('Error fetching renewable energy items:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch renewable energy items'
    });
  }
});

router.post('/renewable-energy', async (req, res) => {
  await createItem('energy_climate_renewable_energy', req, res);
});

router.delete('/renewable-energy/:id', async (req, res) => {
  await deleteItem('energy_climate_renewable_energy', req, res);
});

// Energy Programs endpoints
router.get('/energy-programs', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM energy_climate_energy_programs ORDER BY id DESC');
    const items = convertIdsToString(rows);
    
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error('Error fetching energy programs items:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch energy programs items'
    });
  }
});

router.post('/energy-programs', async (req, res) => {
  await createItem('energy_climate_energy_programs', req, res);
});

router.delete('/energy-programs/:id', async (req, res) => {
  await deleteItem('energy_climate_energy_programs', req, res);
});

// Green Building endpoints
router.get('/green-building', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM energy_climate_green_building ORDER BY id DESC');
    const items = convertIdsToString(rows);
    
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error('Error fetching green building items:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch green building items'
    });
  }
});

router.post('/green-building', async (req, res) => {
  await createItem('energy_climate_green_building', req, res);
});

router.delete('/green-building/:id', async (req, res) => {
  await deleteItem('energy_climate_green_building', req, res);
});

// Carbon Footprint endpoints
router.get('/carbon-footprint', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM energy_climate_carbon_footprint ORDER BY id DESC');
    const items = convertIdsToString(rows);
    
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error('Error fetching carbon footprint items:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch carbon footprint items'
    });
  }
});

router.post('/carbon-footprint', async (req, res) => {
  await createItem('energy_climate_carbon_footprint', req, res);
});

router.delete('/carbon-footprint/:id', async (req, res) => {
  await deleteItem('energy_climate_carbon_footprint', req, res);
});

// GHG Reduction endpoints
router.get('/ghg-reduction', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM energy_climate_ghg_reduction ORDER BY id DESC');
    const items = convertIdsToString(rows);
    
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error('Error fetching GHG reduction items:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch GHG reduction items'
    });
  }
});

router.post('/ghg-reduction', async (req, res) => {
  await createItem('energy_climate_ghg_reduction', req, res);
});

router.delete('/ghg-reduction/:id', async (req, res) => {
  await deleteItem('energy_climate_ghg_reduction', req, res);
});

export default router;