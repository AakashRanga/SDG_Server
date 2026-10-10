// server/api/green-office/greenOfficeCommitteeRoutes.js
import express from 'express';
import { db } from '../../db.js';

const router = express.Router();

// Define the route for fetching all green office committee members
router.get('/members', (req, res) => {
  db.query('SELECT * FROM committee_members', (err, results) => {
    if (err) {
      console.error('Error fetching green office committee:', err);
      return res.status(500).send('Error fetching green office committee members');
    }
    res.json(results);  // Send the committee members data as JSON
  });
});

export default router;
