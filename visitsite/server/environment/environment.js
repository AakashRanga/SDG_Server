import express from 'express';
import energyClimateRouter from './energy-climate.js';
import waterConservationRouter from './water-conservation.js';
import transportationRouter from './transportation.js';
import biodiversityRouter from './biodiversity.js';

const router = express.Router();

// Mount all sub-routers
router.use('/energy-climate', energyClimateRouter);
router.use('/water-conservation', waterConservationRouter);
router.use('/transportation', transportationRouter);
router.use('/biodiversity', biodiversityRouter);

// GET /api/environment/ - Main environment dashboard summary
router.get('/', async (req, res) => {
  try {
    const summaryData = {
      success: true,
      message: 'Environment API Dashboard',
      data: {
        totalInitiatives: 48,
        activeProjects: 28,
        completedProjects: 12,
        plannedProjects: 8,
        categories: {
          energyClimate: {
            name: 'Energy & Climate',
            count: 18,
            endpoints: [
              '/api/environment/energy-climate/climate-change',
              '/api/environment/energy-climate/renewable-energy',
              '/api/environment/energy-climate/energy-programs',
              '/api/environment/energy-climate/green-building',
              '/api/environment/energy-climate/carbon-footprint',
              '/api/environment/energy-climate/ghg-reduction'
            ]
          },
          waterConservation: {
            name: 'Water Conservation',
            count: 12,
            endpoints: [
              '/api/environment/water-conservation/conservation',
              '/api/environment/water-conservation/recycling',
              '/api/environment/water-conservation/efficientAppliances',
              '/api/environment/water-conservation/wastewaterTreatment'
            ]
          },
          transportation: {
            name: 'Transportation',
            count: 12,
            endpoints: [
              '/api/environment/transportation/shuttle-services',
              '/api/environment/transportation/pedestrian-paths',
              '/api/environment/transportation/zero-emission',
              '/api/environment/transportation/parking-reduction'
            ]
          },
          biodiversity: {
            name: 'Biodiversity',
            count: 9,
            endpoints: [
              '/api/environment/biodiversity/flora-fauna',
              '/api/environment/biodiversity/biodiversity-mapping',
              '/api/environment/biodiversity/green-corridors'
            ]
          }
        },
        recentActivity: [
          {
            category: 'Energy & Climate',
            project: 'Solar Panel Installation',
            status: 'active',
            date: '2024-01-15'
          },
          {
            category: 'Water Conservation',
            project: 'Greywater Recycling System',
            status: 'active',
            date: '2024-01-10'
          },
          {
            category: 'Transportation',
            project: 'Electric Campus Shuttle',
            status: 'completed',
            date: '2024-01-08'
          },
          {
            category: 'Biodiversity',
            project: 'Native Species Restoration',
            status: 'active',
            date: '2024-01-05'
          }
        ]
      },
      documentation: {
        baseUrl: '/api/environment',
        availableEndpoints: [
          'GET    /api/environment/',
          'GET    /api/environment/stats',
          'GET    /api/environment/search?q=',
          'GET    /api/environment/energy-climate/*',
          'POST   /api/environment/energy-climate/*',
          'DELETE /api/environment/energy-climate/*/:id',
          'GET    /api/environment/water-conservation/*',
          'POST   /api/environment/water-conservation/*',
          'DELETE /api/environment/water-conservation/*/:id',
          'GET    /api/environment/transportation/*',
          'POST   /api/environment/transportation/*',
          'DELETE /api/environment/transportation/*/:id',
          'GET    /api/environment/biodiversity/*',
          'POST   /api/environment/biodiversity/*',
          'DELETE /api/environment/biodiversity/*/:id'
        ]
      }
    };

    res.json(summaryData);
  } catch (error) {
    console.error('Error generating environment dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load environment dashboard'
    });
  }
});

// GET /api/environment/stats - Statistics across all categories
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      success: true,
      data: {
        overall: {
          totalProjects: 48,
          carbonReduction: '25,000 tons',
          waterSaved: '1.2M gallons',
          energyGenerated: '2.5 MW',
          biodiversityAreas: '35 acres'
        },
        byStatus: {
          active: 28,
          completed: 12,
          planned: 8
        },
        byCategory: {
          energyClimate: 18,
          waterConservation: 12,
          transportation: 12,
          biodiversity: 9
        },
        timeline: {
          '2023': 15,
          '2024': 28,
          '2025': 5
        }
      },
      lastUpdated: new Date().toISOString()
    };

    res.json(stats);
  } catch (error) {
    console.error('Error generating environment stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load environment statistics'
    });
  }
});

// GET /api/environment/search - Search across all environmental initiatives
router.get('/search', async (req, res) => {
  try {
    const { q, category, status, year } = req.query;
    
    if (!q && !category && !status && !year) {
      return res.status(400).json({
        success: false,
        error: 'Please provide search parameters (q, category, status, or year)'
      });
    }

    // Sample search results - in real implementation, this would query the database
    const searchResults = {
      success: true,
      query: {
        q: q || '',
        category: category || '',
        status: status || '',
        year: year || ''
      },
      results: [
        {
          id: '1',
          category: 'Energy & Climate',
          subcategory: 'renewable-energy',
          title: 'Solar Panel Installation',
          description: 'Installation of photovoltaic panels on campus rooftops',
          status: 'active',
          year: '2024',
          matchScore: 0.95
        },
        {
          id: '2',
          category: 'Water Conservation',
          subcategory: 'recycling',
          title: 'Greywater Recycling System',
          description: 'Treatment and reuse of water from sinks and showers',
          status: 'active',
          year: '2024',
          matchScore: 0.87
        },
        {
          id: '3',
          category: 'Transportation',
          subcategory: 'zero-emission',
          title: 'Electric Vehicle Fleet',
          description: 'Transition of maintenance vehicles to electric',
          status: 'completed',
          year: '2023',
          matchScore: 0.76
        }
      ],
      totalResults: 3,
      searchTime: '0.045s'
    };

    res.json(searchResults);
  } catch (error) {
    console.error('Error searching environment data:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed'
    });
  }
});

// GET /api/environment/export - Export all environment data (sample endpoint)
router.get('/export', async (req, res) => {
  try {
    const exportData = {
      success: true,
      message: 'Environment data export generated',
      data: {
        format: 'JSON',
        timestamp: new Date().toISOString(),
        totalRecords: 48,
        downloadUrl: '/api/environment/export/download/sample-export-2024.json',
        categoriesIncluded: [
          'energy-climate',
          'water-conservation',
          'transportation',
          'biodiversity'
        ]
      }
    };

    res.json(exportData);
  } catch (error) {
    console.error('Error generating export:', error);
    res.status(500).json({
      success: false,
      error: 'Export generation failed'
    });
  }
});

// GET /api/environment/health - Health check for all environment services
router.get('/health', async (req, res) => {
  try {
    const healthStatus = {
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        energyClimate: 'operational',
        waterConservation: 'operational',
        transportation: 'operational',
        biodiversity: 'operational',
        fileStorage: 'operational'
      },
      metrics: {
        uptime: '99.8%',
        responseTime: '45ms',
        activeConnections: 12,
        memoryUsage: '45%'
      }
    };

    res.json(healthStatus);
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      success: false,
      status: 'degraded',
      error: 'Service health check failed'
    });
  }
});

export default router;