import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Helper function to handle database queries with JSON parsing
const handleQuery = async (res, query, params = []) => {
  try {
    const [results] = await pool.execute(query, params);
    
    // Parse JSON fields back to arrays
    const parsedResults = results.map(item => ({
      ...item,
      images: item.images ? JSON.parse(item.images) : [],
      files: item.files ? JSON.parse(item.files) : []
    }));
    
    res.json({
      success: true,
      data: parsedResults,
      message: 'Data fetched successfully'
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Helper function for POST operations
const handleInsert = async (res, query, params) => {
  try {
    const [result] = await pool.execute(query, params);
    res.json({
      success: true,
      data: {
        id: params[0], // The first param is usually the ID
        ...params.reduce((acc, param, index) => {
          const keys = ['id', 'title', 'description', 'value', 'unit', 'year', 'status', 'images', 'files'];
          if (keys[index]) {
            acc[keys[index]] = param;
          }
          return acc;
        }, {})
      },
      message: 'Data created successfully'
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// E-Waste routes
router.get('/e-waste', async (req, res) => {
  await handleQuery(res, 'SELECT * FROM waste_management_e_waste ORDER BY created_at DESC');
});

router.post('/e-waste', async (req, res) => {
  const { title, description, value, unit, year, status, images, files } = req.body;
  const id = Date.now().toString();
  const imagesJson = images ? JSON.stringify(images) : '[]';
  const filesJson = files ? JSON.stringify(files) : '[]';
  
  await handleInsert(res, 
    'INSERT INTO waste_management_e_waste (id, title, description, value, unit, year, status, images, files) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, title, description, value, unit, year, status, imagesJson, filesJson]
  );
});

router.delete('/e-waste/:id', async (req, res) => {
  await handleQuery(res, 'DELETE FROM waste_management_e_waste WHERE id = ?', [req.params.id]);
});

// Biomedical Waste routes
router.get('/biomedical-waste', async (req, res) => {
  await handleQuery(res, 'SELECT * FROM waste_management_biomedical_waste ORDER BY created_at DESC');
});

router.post('/biomedical-waste', async (req, res) => {
  const { title, description, value, unit, year, status, images, files } = req.body;
  const id = Date.now().toString();
  const imagesJson = images ? JSON.stringify(images) : '[]';
  const filesJson = files ? JSON.stringify(files) : '[]';
  
  await handleInsert(res, 
    'INSERT INTO waste_management_biomedical_waste (id, title, description, value, unit, year, status, images, files) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, title, description, value, unit, year, status, imagesJson, filesJson]
  );
});

router.delete('/biomedical-waste/:id', async (req, res) => {
  await handleQuery(res, 'DELETE FROM waste_management_biomedical_waste WHERE id = ?', [req.params.id]);
});

// Medical Waste routes
router.get('/medical-waste', async (req, res) => {
  await handleQuery(res, 'SELECT * FROM waste_management_medical_waste ORDER BY created_at DESC');
});

router.post('/medical-waste', async (req, res) => {
  const { title, description, value, unit, year, status, images, files } = req.body;
  const id = Date.now().toString();
  const imagesJson = images ? JSON.stringify(images) : '[]';
  const filesJson = files ? JSON.stringify(files) : '[]';
  
  await handleInsert(res, 
    'INSERT INTO waste_management_medical_waste (id, title, description, value, unit, year, status, images, files) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, title, description, value, unit, year, status, imagesJson, filesJson]
  );
});

router.delete('/medical-waste/:id', async (req, res) => {
  await handleQuery(res, 'DELETE FROM waste_management_medical_waste WHERE id = ?', [req.params.id]);
});

// Dental Waste routes
router.get('/dental-waste', async (req, res) => {
  await handleQuery(res, 'SELECT * FROM waste_management_dental_waste ORDER BY created_at DESC');
});

router.post('/dental-waste', async (req, res) => {
  const { title, description, value, unit, year, status, images, files } = req.body;
  const id = Date.now().toString();
  const imagesJson = images ? JSON.stringify(images) : '[]';
  const filesJson = files ? JSON.stringify(files) : '[]';
  
  await handleInsert(res, 
    'INSERT INTO waste_management_dental_waste (id, title, description, value, unit, year, status, images, files) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, title, description, value, unit, year, status, imagesJson, filesJson]
  );
});

router.delete('/dental-waste/:id', async (req, res) => {
  await handleQuery(res, 'DELETE FROM waste_management_dental_waste WHERE id = ?', [req.params.id]);
});

// General Waste routes
router.get('/general-waste', async (req, res) => {
  await handleQuery(res, 'SELECT * FROM waste_management_general_waste ORDER BY created_at DESC');
});

router.post('/general-waste', async (req, res) => {
  const { title, description, value, unit, year, status, images, files } = req.body;
  const id = Date.now().toString();
  const imagesJson = images ? JSON.stringify(images) : '[]';
  const filesJson = files ? JSON.stringify(files) : '[]';
  
  await handleInsert(res, 
    'INSERT INTO waste_management_general_waste (id, title, description, value, unit, year, status, images, files) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, title, description, value, unit, year, status, imagesJson, filesJson]
  );
});

router.delete('/general-waste/:id', async (req, res) => {
  await handleQuery(res, 'DELETE FROM waste_management_general_waste WHERE id = ?', [req.params.id]);
});

// Food Waste routes
router.get('/food-waste', async (req, res) => {
  await handleQuery(res, 'SELECT * FROM waste_management_food_waste ORDER BY created_at DESC');
});

router.post('/food-waste', async (req, res) => {
  const { title, description, value, unit, year, status, images, files } = req.body;
  const id = Date.now().toString();
  const imagesJson = images ? JSON.stringify(images) : '[]';
  const filesJson = files ? JSON.stringify(files) : '[]';
  
  await handleInsert(res, 
    'INSERT INTO waste_management_food_waste (id, title, description, value, unit, year, status, images, files) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, title, description, value, unit, year, status, imagesJson, filesJson]
  );
});

router.delete('/food-waste/:id', async (req, res) => {
  await handleQuery(res, 'DELETE FROM waste_management_food_waste WHERE id = ?', [req.params.id]);
});

// Renewal Projects routes - FIXED
router.get('/renewal-projects', async (req, res) => {
  await handleQuery(res, 'SELECT * FROM waste_management_renewal_projects ORDER BY created_at DESC');
});

router.post('/renewal-projects', async (req, res) => {
  const { title, description, value, unit, year, status, images, files } = req.body;
  const id = Date.now().toString();
  const imagesJson = images ? JSON.stringify(images) : '[]';
  const filesJson = files ? JSON.stringify(files) : '[]';
  
  await handleInsert(res, 
    'INSERT INTO waste_management_renewal_projects (id, title, description, value, unit, year, status, images, files) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, title, description, value, unit, year, status, imagesJson, filesJson]
  );
});

router.delete('/renewal-projects/:id', async (req, res) => {
  await handleQuery(res, 'DELETE FROM waste_management_renewal_projects WHERE id = ?', [req.params.id]);
});

// Art from Waste routes - FIXED
router.get('/art-from-waste', async (req, res) => {
  await handleQuery(res, 'SELECT * FROM waste_management_art_from_waste ORDER BY created_at DESC');
});

router.post('/art-from-waste', async (req, res) => {
  const { title, description, value, unit, year, status, images, files } = req.body;
  const id = Date.now().toString();
  const imagesJson = images ? JSON.stringify(images) : '[]';
  const filesJson = files ? JSON.stringify(files) : '[]';
  
  await handleInsert(res, 
    'INSERT INTO waste_management_art_from_waste (id, title, description, value, unit, year, status, images, files) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, title, description, value, unit, year, status, imagesJson, filesJson]
  );
});

router.delete('/art-from-waste/:id', async (req, res) => {
  await handleQuery(res, 'DELETE FROM waste_management_art_from_waste WHERE id = ?', [req.params.id]);
});

export default router;