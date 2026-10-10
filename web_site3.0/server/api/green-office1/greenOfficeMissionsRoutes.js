// server/api/green-office/greenOfficeMissionsRoutes.js
import express from 'express';
import { db } from '../../db.js';

const router = express.Router();

// Define the route for fetching all green office missions
router.get('/missions', (req, res) => {
  db.query('SELECT * FROM green_office_missions', (err, results) => {
    if (err) {
      console.error('Error fetching green office missions:', err);
      return res.status(500).send('Error fetching green office missions');
    }
    res.json(results);  // Send the missions data as JSON
  });
});

export default router;
