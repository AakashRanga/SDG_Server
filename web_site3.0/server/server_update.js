import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import pool from './db.js'; // Import MySQL connection

const app = express();
const PORT = 8005;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// ==================== GREEN OFFICE ROUTES ====================

// GET /api/green-office/members - Get all members
app.get('/api/green-office/members', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM green_office_members');
    
    // Convert numeric IDs to strings for React consistency
    const members = rows.map(member => ({
      ...member,
      id: member.id.toString()
    }));
    
    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/green-office/members - Create new member
app.post('/api/green-office/members', upload.single('image'), async (req, res) => {
  try {
    const { name, position, email, phone } = req.body;
    
    // Validation
    if (!name || !position || !email) {
      return res.status(400).json({ error: 'Name, position, and email are required' });
    }

    // Handle image upload
    let imagePath = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
    if (req.file) {
      imagePath = '/uploads/' + req.file.filename;
    }

    // Insert into MySQL
    const [result] = await pool.execute(
      'INSERT INTO green_office_members (name, position, email, phone, image) VALUES (?, ?, ?, ?, ?)',
      [name, position, email, phone || '', imagePath]
    );

    const newMember = {
      id: result.insertId.toString(),
      name,
      position,
      email,
      phone: phone || '',
      image: imagePath
    };

    res.status(201).json(newMember);
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/green-office/members/:id - Delete member
app.delete('/api/green-office/members/:id', async (req, res) => {
  try {
    const memberId = req.params.id;
    
    const [result] = await pool.execute(
      'DELETE FROM green_office_members WHERE id = ?',
      [memberId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/green-office/missions
app.get('/api/green-office/missions', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM missions');
    
    const missions = rows.map(mission => ({
      ...mission,
      id: mission.id.toString()
    }));
    
    res.json(missions);
  } catch (error) {
    console.error('Error fetching missions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/green-office/missions
app.post('/api/green-office/missions', async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO missions (title, description) VALUES (?, ?)',
      [title, description]
    );

    const newMission = {
      id: result.insertId.toString(),
      title,
      description
    };

    res.status(201).json(newMission);
  } catch (error) {
    console.error('Error creating mission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/green-office/missions/:id
app.delete('/api/green-office/missions/:id', async (req, res) => {
  try {
    const missionId = req.params.id;
    
    const [result] = await pool.execute(
      'DELETE FROM missions WHERE id = ?',
      [missionId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    res.json({ message: 'Mission deleted successfully' });
  } catch (error) {
    console.error('Error deleting mission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/green-office/commitments
app.get('/api/green-office/commitments', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM commitments');
    
    const commitments = rows.map(commitment => ({
      ...commitment,
      id: commitment.id.toString(),
      targetDate: commitment.target_date // Map target_date to targetDate
    }));
    
    res.json(commitments);
  } catch (error) {
    console.error('Error fetching commitments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/green-office/commitments
app.post('/api/green-office/commitments', async (req, res) => {
  try {
    const { title, description, targetDate } = req.body;
    
    if (!title || !description || !targetDate) {
      return res.status(400).json({ error: 'Title, description, and targetDate are required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO commitments (title, description, target_date) VALUES (?, ?, ?)',
      [title, description, targetDate]
    );

    const newCommitment = {
      id: result.insertId.toString(),
      title,
      description,
      targetDate
    };

    res.status(201).json(newCommitment);
  } catch (error) {
    console.error('Error creating commitment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/green-office/commitments/:id
app.delete('/api/green-office/commitments/:id', async (req, res) => {
  try {
    const commitmentId = req.params.id;
    
    const [result] = await pool.execute(
      'DELETE FROM commitments WHERE id = ?',
      [commitmentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Commitment not found' });
    }

    res.json({ message: 'Commitment deleted successfully' });
  } catch (error) {
    console.error('Error deleting commitment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/green-office/milestones
app.get('/api/green-office/milestones', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM milestones');
    
    const milestones = rows.map(milestone => ({
      ...milestone,
      id: milestone.id.toString()
    }));
    
    res.json(milestones);
  } catch (error) {
    console.error('Error fetching milestones:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/green-office/milestones
app.post('/api/green-office/milestones', async (req, res) => {
  try {
    const { title, description, date, status } = req.body;
    
    if (!title || !description || !date || !status) {
      return res.status(400).json({ error: 'Title, description, date, and status are required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO milestones (title, description, date, status) VALUES (?, ?, ?, ?)',
      [title, description, date, status]
    );

    const newMilestone = {
      id: result.insertId.toString(),
      title,
      description,
      date,
      status
    };

    res.status(201).json(newMilestone);
  } catch (error) {
    console.error('Error creating milestone:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/green-office/milestones/:id
app.delete('/api/green-office/milestones/:id', async (req, res) => {
  try {
    const milestoneId = req.params.id;
    
    const [result] = await pool.execute(
      'DELETE FROM milestones WHERE id = ?',
      [milestoneId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Milestone not found' });
    }

    res.json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    console.error('Error deleting milestone:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== COMMITTEES ROUTES ====================

app.get('/api/committees', async (req, res) => {
  try {
    const [committees] = await pool.execute('SELECT * FROM committees');
    
    // For each committee, get its members and meeting minutes
    const committeesWithData = await Promise.all(
      committees.map(async (committee) => {
        const [members] = await pool.execute(
          'SELECT * FROM committee_members WHERE committee_id = ?',
          [committee.id]
        );
        
        const [meetingMinutes] = await pool.execute(
          'SELECT * FROM committee_meeting_minutes WHERE committee_id = ?',
          [committee.id]
        );

        return {
          ...committee,
          id: committee.id.toString(),
          members: members.map(member => ({
            ...member,
            id: member.id.toString()
          })),
          meetingMinutes: meetingMinutes.map(minutes => ({
            ...minutes,
            id: minutes.id.toString()
          }))
        };
      })
    );
    
    res.json(committeesWithData);
  } catch (error) {
    console.error('Error fetching committees:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/committees
app.post('/api/committees', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO committees (name, description) VALUES (?, ?)',
      [name, description]
    );

    const newCommittee = {
      id: result.insertId.toString(),
      name,
      description,
      members: [],
      meetingMinutes: []
    };

    res.status(201).json(newCommittee);
  } catch (error) {
    console.error('Error creating committee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/committees/:id
app.delete('/api/committees/:id', async (req, res) => {
  try {
    const committeeId = req.params.id;
    
    const [result] = await pool.execute(
      'DELETE FROM committees WHERE id = ?',
      [committeeId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Committee not found' });
    }

    res.json({ message: 'Committee deleted successfully' });
  } catch (error) {
    console.error('Error deleting committee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Committee Members
app.post('/api/committees/:id/members', upload.single('image'), async (req, res) => {
  try {
    const committeeId = req.params.id;
    const { name, position, email, phone } = req.body;
    
    if (!name || !position || !email) {
      return res.status(400).json({ error: 'Name, position, and email are required' });
    }

    // Handle image upload
    let imagePath = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
    if (req.file) {
      imagePath = '/uploads/' + req.file.filename;
    }

    const [result] = await pool.execute(
      'INSERT INTO committee_members (committee_id, name, position, email, phone, image) VALUES (?, ?, ?, ?, ?, ?)',
      [committeeId, name, position, email, phone || '', imagePath]
    );

    const newMember = {
      id: result.insertId.toString(),
      name,
      position,
      email,
      phone: phone || '',
      image: imagePath
    };

    res.status(201).json(newMember);
  } catch (error) {
    console.error('Error creating committee member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/committees/:committeeId/members/:memberId', async (req, res) => {
  try {
    const { committeeId, memberId } = req.params;
    
    const [result] = await pool.execute(
      'DELETE FROM committee_members WHERE id = ? AND committee_id = ?',
      [memberId, committeeId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Committee member not found' });
    }

    res.json({ message: 'Committee member deleted successfully' });
  } catch (error) {
    console.error('Error deleting committee member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Committee Meeting Minutes
app.post('/api/committees/:id/meeting-minutes', async (req, res) => {
  try {
    const committeeId = req.params.id;
    const { title, date, content } = req.body;
    
    if (!title || !date || !content) {
      return res.status(400).json({ error: 'Title, date, and content are required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO committee_meeting_minutes (committee_id, title, date, content) VALUES (?, ?, ?, ?)',
      [committeeId, title, date, content]
    );

    const newMinutes = {
      id: result.insertId.toString(),
      title,
      date,
      content
    };

    res.status(201).json(newMinutes);
  } catch (error) {
    console.error('Error creating meeting minutes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/committees/:committeeId/meeting-minutes/:minutesId', async (req, res) => {
  try {
    const { committeeId, minutesId } = req.params;
    
    const [result] = await pool.execute(
      'DELETE FROM committee_meeting_minutes WHERE id = ? AND committee_id = ?',
      [minutesId, committeeId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Meeting minutes not found' });
    }

    res.json({ message: 'Meeting minutes deleted successfully' });
  } catch (error) {
    console.error('Error deleting meeting minutes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== STUDENT COUNCIL ROUTES ====================

app.get('/api/student-council/members', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM student_council_members');
    
    const members = rows.map(member => ({
      ...member,
      id: member.id.toString()
    }));
    
    res.json(members);
  } catch (error) {
    console.error('Error fetching student council members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/student-council/members', upload.single('image'), async (req, res) => {
  try {
    const { name, position, email, phone } = req.body;
    
    if (!name || !position || !email) {
      return res.status(400).json({ error: 'Name, position, and email are required' });
    }

    let imagePath = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
    if (req.file) {
      imagePath = '/uploads/' + req.file.filename;
    }

    const [result] = await pool.execute(
      'INSERT INTO student_council_members (name, position, email, phone, image) VALUES (?, ?, ?, ?, ?)',
      [name, position, email, phone || '', imagePath]
    );

    const newMember = {
      id: result.insertId.toString(),
      name,
      position,
      email,
      phone: phone || '',
      image: imagePath
    };

    res.status(201).json(newMember);
  } catch (error) {
    console.error('Error creating student council member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/student-council/members/:id', async (req, res) => {
  try {
    const memberId = req.params.id;
    
    const [result] = await pool.execute(
      'DELETE FROM student_council_members WHERE id = ?',
      [memberId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student council member not found' });
    }

    res.json({ message: 'Student council member deleted successfully' });
  } catch (error) {
    console.error('Error deleting student council member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Student Council Meeting Minutes
app.get('/api/student-council/meeting-minutes', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM student_council_meeting_minutes');
    
    const minutes = rows.map(minute => ({
      ...minute,
      id: minute.id.toString()
    }));
    
    res.json(minutes);
  } catch (error) {
    console.error('Error fetching student council meeting minutes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/student-council/meeting-minutes', async (req, res) => {
  try {
    const { title, date, content } = req.body;
    
    if (!title || !date || !content) {
      return res.status(400).json({ error: 'Title, date, and content are required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO student_council_meeting_minutes (title, date, content) VALUES (?, ?, ?)',
      [title, date, content]
    );

    const newMinutes = {
      id: result.insertId.toString(),
      title,
      date,
      content
    };

    res.status(201).json(newMinutes);
  } catch (error) {
    console.error('Error creating meeting minutes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/student-council/meeting-minutes/:id', async (req, res) => {
  try {
    const minutesId = req.params.id;
    
    const [result] = await pool.execute(
      'DELETE FROM student_council_meeting_minutes WHERE id = ?',
      [minutesId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Meeting minutes not found' });
    }

    res.json({ message: 'Meeting minutes deleted successfully' });
  } catch (error) {
    console.error('Error deleting meeting minutes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await pool.execute('SELECT 1');
    res.json({ status: 'OK', message: 'API and database are running' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: 'Database connection failed' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`Green Office API server running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/`);
  console.log(`Connected to MySQL database: sustain_db`);
});