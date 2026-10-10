// server/api/green-office/greenOfficeMilestonesRoutes.js
import express from 'express';
import { db } from '../../db.js';

const router = express.Router();

// Define the route for fetching all green office milestones
router.get('/milestones', (req, res) => {
  db.query('SELECT * FROM green_office_milestones', (err, results) => {
    if (err) {
      console.error('Error fetching green office milestones:', err);
      return res.status(500).send('Error fetching green office milestones');
    }
    res.json(results);  // Send the milestones data as JSON
  });
});

export default router;
