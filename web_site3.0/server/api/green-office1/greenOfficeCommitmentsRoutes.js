// server/api/green-office/greenOfficeCommitmentsRoutes.js
import express from 'express';
import { db } from '../../db.js';

const router = express.Router();

// Define the route for fetching all green office commitments
router.get('/commitments', (req, res) => {
  db.query('SELECT * FROM green_office_commitments', (err, results) => {
    if (err) {
      console.error('Error fetching green office commitments:', err);
      return res.status(500).send('Error fetching green office commitments');
    }
    res.json(results);  // Send the commitments data as JSON
  });
});

export default router;
