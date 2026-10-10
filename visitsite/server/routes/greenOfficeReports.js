// routes/greenOfficeReports.js
import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET summary report
router.get('/summary', async (req, res) => {
  try {
    console.log('🟢 GET /api/green-office/reports/summary');
    
    // Get counts from all tables
    const [[membersCount]] = await pool.execute('SELECT COUNT(*) as count FROM green_office_members');
    const [[missionsCount]] = await pool.execute('SELECT COUNT(*) as count FROM missions');
    const [[commitmentsCount]] = await pool.execute('SELECT COUNT(*) as count FROM commitments');
    const [[milestonesCount]] = await pool.execute('SELECT COUNT(*) as count FROM milestones');
    
    // Get commitments by status
    const [commitmentsByStatus] = await pool.execute(`
      SELECT status, COUNT(*) as count 
      FROM commitments 
      GROUP BY status
    `);
    
    // Get milestones by status
    const [milestonesByStatus] = await pool.execute(`
      SELECT status, COUNT(*) as count 
      FROM milestones 
      GROUP BY status
    `);

    const summary = {
      members: membersCount.count,
      missions: missionsCount.count,
      commitments: commitmentsCount.count,
      milestones: milestonesCount.count,
      commitmentsByStatus: commitmentsByStatus.reduce((acc, item) => {
        acc[item.status] = item.count;
        return acc;
      }, {}),
      milestonesByStatus: milestonesByStatus.reduce((acc, item) => {
        acc[item.status] = item.count;
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: summary,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error generating summary:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate summary report'
    });
  }
});

// GET statistics
router.get('/stats', async (req, res) => {
  try {
    console.log('🟢 GET /api/green-office/reports/stats');
    
    // Add more statistical data as needed
    const stats = {
      totalTeamMembers: 0,
      activeProjects: 0,
      completedMilestones: 0,
      upcomingEvents: 0
    };

    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('❌ Error generating stats:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate statistics'
    });
  }
});

// GET progress report
router.get('/progress', async (req, res) => {
  try {
    console.log('🟢 GET /api/green-office/reports/progress');
    
    const progress = {
      overallProgress: 65,
      completedItems: 23,
      pendingItems: 12,
      inProgressItems: 8
    };

    res.json({
      success: true,
      data: progress
    });
    
  } catch (error) {
    console.error('❌ Error generating progress report:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate progress report'
    });
  }
});

export default router;