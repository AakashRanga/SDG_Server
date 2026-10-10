import express from 'express';
import pool from '../db.js';

const router = express.Router();

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

// Helper function for GET operations
const getItems = async (tableName, res) => {
  try {
    const [rows] = await pool.execute(`SELECT * FROM ${tableName} ORDER BY id DESC`);
    const items = convertIdsToString(rows);
    
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error(`Error fetching ${tableName} items:`, error);
    res.status(500).json({ 
      success: false,
      error: `Failed to fetch ${tableName.split('_').pop().replace(/-/g, ' ')} items`
    });
  }
};

// Helper function for POST operations
const createItem = async (tableName, req, res) => {
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
      message: `${tableName.split('_').pop().replace(/-/g, ' ')} item created successfully`,
      data: newItem
    });
  } catch (error) {
    console.error(`Error creating ${tableName} item:`, error);
    res.status(500).json({ 
      success: false,
      error: `Failed to create ${tableName.split('_').pop().replace(/-/g, ' ')} item`
    });
  }
};

// Helper function for PUT operations
const updateItem = async (tableName, req, res) => {
  try {
    const itemId = req.params.id;
    const { title, description, value, unit, year, status, images, files } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: 'Title and description are required'
      });
    }

    // First check if item exists
    const [existingRows] = await pool.execute(`SELECT * FROM ${tableName} WHERE id = ?`, [itemId]);
    
    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    // Update the item
    const [result] = await pool.execute(
      `UPDATE ${tableName} SET title = ?, description = ?, value = ?, unit = ?, year = ?, status = ?, images = ?, files = ? WHERE id = ?`,
      [title, description, value, unit, year, status, JSON.stringify(images || []), JSON.stringify(files || []), itemId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Item not found or no changes made'
      });
    }

    // Fetch the updated item
    const [updatedRows] = await pool.execute(`SELECT * FROM ${tableName} WHERE id = ?`, [itemId]);
    const updatedItem = convertIdsToString(updatedRows)[0];

    res.json({
      success: true,
      message: `${tableName.split('_').pop().replace(/-/g, ' ')} item updated successfully`,
      data: updatedItem
    });
  } catch (error) {
    console.error(`Error updating ${tableName} item:`, error);
    res.status(500).json({ 
      success: false,
      error: `Failed to update ${tableName.split('_').pop().replace(/-/g, ' ')} item`
    });
  }
};

// Helper function for DELETE operations
const deleteItem = async (tableName, req, res) => {
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
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting ${tableName} item:`, error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete item'
    });
  }
};

// Climate Change endpoints
router.get('/climate-change', async (req, res) => {
  await getItems('energy_climate_climate_change', res);
});

router.post('/climate-change', async (req, res) => {
  await createItem('energy_climate_climate_change', req, res);
});

router.put('/climate-change/:id', async (req, res) => {
  await updateItem('energy_climate_climate_change', req, res);
});

router.delete('/climate-change/:id', async (req, res) => {
  await deleteItem('energy_climate_climate_change', req, res);
});

// Renewable Energy endpoints
router.get('/renewable-energy', async (req, res) => {
  await getItems('energy_climate_renewable_energy', res);
});

router.post('/renewable-energy', async (req, res) => {
  await createItem('energy_climate_renewable_energy', req, res);
});

router.put('/renewable-energy/:id', async (req, res) => {
  await updateItem('energy_climate_renewable_energy', req, res);
});

router.delete('/renewable-energy/:id', async (req, res) => {
  await deleteItem('energy_climate_renewable_energy', req, res);
});

// Energy Programs endpoints
router.get('/energy-programs', async (req, res) => {
  await getItems('energy_climate_energy_programs', res);
});

router.post('/energy-programs', async (req, res) => {
  await createItem('energy_climate_energy_programs', req, res);
});

router.put('/energy-programs/:id', async (req, res) => {
  await updateItem('energy_climate_energy_programs', req, res);
});

router.delete('/energy-programs/:id', async (req, res) => {
  await deleteItem('energy_climate_energy_programs', req, res);
});

// Green Building endpoints
router.get('/green-building', async (req, res) => {
  await getItems('energy_climate_green_building', res);
});

router.post('/green-building', async (req, res) => {
  await createItem('energy_climate_green_building', req, res);
});

router.put('/green-building/:id', async (req, res) => {
  await updateItem('energy_climate_green_building', req, res);
});

router.delete('/green-building/:id', async (req, res) => {
  await deleteItem('energy_climate_green_building', req, res);
});

// Carbon Footprint endpoints
router.get('/carbon-footprint', async (req, res) => {
  await getItems('energy_climate_carbon_footprint', res);
});

router.post('/carbon-footprint', async (req, res) => {
  await createItem('energy_climate_carbon_footprint', req, res);
});

router.put('/carbon-footprint/:id', async (req, res) => {
  await updateItem('energy_climate_carbon_footprint', req, res);
});

router.delete('/carbon-footprint/:id', async (req, res) => {
  await deleteItem('energy_climate_carbon_footprint', req, res);
});

// GHG Reduction endpoints
router.get('/ghg-reduction', async (req, res) => {
  await getItems('energy_climate_ghg_reduction', res);
});

router.post('/ghg-reduction', async (req, res) => {
  await createItem('energy_climate_ghg_reduction', req, res);
});

router.put('/ghg-reduction/:id', async (req, res) => {
  await updateItem('energy_climate_ghg_reduction', req, res);
});

router.delete('/ghg-reduction/:id', async (req, res) => {
  await deleteItem('energy_climate_ghg_reduction', req, res);
});

export default router;