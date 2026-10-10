// server/api/green-office/greenOfficeCommitteeRoutes.js
import express from 'express';
import { db } from '../../db.js';

const router = express.Router();

// Define the route for fetching all green office committees
router.get('/committees', (req, res) => {
  db.query('SELECT * FROM committees', (err, results) => {
    if (err) {
      console.error('Error fetching green office committees:', err);
      return res.status(500).send('Error fetching green office committees');
    }
    res.json(results);  // Send the committees data as JSON
  });
});

export default router;
