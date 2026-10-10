import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';

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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
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

// Database file path
const dbFile = 'database.json';

// Initialize database if it doesn't exist
const initializeDatabase = () => {
  if (!fs.existsSync(dbFile)) {
    const initialData = {
      greenOffice: {
        members: [
          {
            id: 1,
            name: "Dr. Rama",
            position: "Dean of Research",
            email: "rama@gmail.com",
            phone: "1234567890",
            image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          },
          {
            id: 2,
            name: "Dr. V. Deepak",
            position: "Director",
            email: "deepak@gmail.com",
            phone: "1234567899",
            image: "/uploads/1762248333948.JPG"
          }
        ],
        missions: [
          {
            id: 1,
            title: "Carbon Neutrality by 2030",
            description: "Achieve carbon neutrality across all campus operations by 2030 through renewable energy and sustainable practices."
          }
        ],
        commitments: [
          {
            id: 1,
            title: "100% Renewable Energy",
            description: "Transition all campus buildings to 100% renewable energy sources",
            targetDate: "2028-12-31"
          }
        ],
        milestones: [
          {
            id: 1,
            title: "Solar Panel Installation",
            description: "Install solar panels on campus buildings",
            date: "2023-09-15",
            status: "completed"
          }
        ]
      },
      committees: [
        {
          id: 1,
          name: "Energy & Climate Committee",
          description: "Focuses on reducing campus energy consumption and climate change initiatives",
          members: [
            {
              id: 1,
              name: "Prof. David Martinez",
              position: "Committee Chair",
              email: "david.martinez@university.edu",
              phone: "+1 (555) 456-7890",
              image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
            }
          ],
          meetingMinutes: []
        }
      ],
      studentCouncil: {
        members: [
          {
            id: 1,
            name: "Alex Kumar",
            position: "Student Council President",
            email: "alex.kumar@student.edu",
            phone: "+1 (555) 789-0123",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
          }
        ],
        meetingMinutes: []
      }
    };
    
    fs.writeFileSync(dbFile, JSON.stringify(initialData, null, 2));
    console.log('Database initialized with sample data');
  }
};

// Read database
const readDatabase = () => {
  try {
    const data = fs.readFileSync(dbFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return null;
  }
};

// Write to database
const writeDatabase = (data) => {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing to database:', error);
    return false;
  }
};

// Get next ID for a collection
const getNextId = (collection) => {
  const db = readDatabase();
  if (!db) return 1;
  
  // Handle nested collections like greenOffice.members
  if (collection.includes('.')) {
    const [parent, child] = collection.split('.');
    const items = db[parent]?.[child] || [];
    if (items.length === 0) return 1;
    const maxId = Math.max(...items.map(item => item.id || 0));
    return maxId + 1;
  }
  
  const items = Array.isArray(db[collection]) ? db[collection] : Object.values(db[collection]);
  if (items.length === 0) return 1;
  
  const maxId = Math.max(...items.map(item => item.id || 0));
  return maxId + 1;
};

// ==================== GREEN OFFICE ROUTES ====================

// GET /api/green-office/members - Get all members
app.get('/api/green-office/members', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }
    
    const members = db.greenOffice?.members || [];
    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/green-office/members - Create new member
app.post('/api/green-office/members', upload.single('image'), (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const { name, position, email, phone } = req.body;
    
    // Validation
    if (!name || !position || !email) {
      return res.status(400).json({ error: 'Name, position, and email are required' });
    }

    // Handle image upload
    let imagePath = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'; // Default image
    if (req.file) {
      imagePath = '/uploads/' + req.file.filename;
    }

    const newMember = {
      id: getNextId('greenOffice.members'),
      name,
      position,
      email,
      phone: phone || '',
      image: imagePath
    };

    // Initialize greenOffice if it doesn't exist
    if (!db.greenOffice) db.greenOffice = {};
    if (!db.greenOffice.members) db.greenOffice.members = [];

    db.greenOffice.members.push(newMember);

    if (writeDatabase(db)) {
      res.status(201).json(newMember);
    } else {
      res.status(500).json({ error: 'Failed to save member' });
    }
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/green-office/members/:id - Delete member
app.delete('/api/green-office/members/:id', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const memberId = parseInt(req.params.id);
    
    if (!db.greenOffice?.members) {
      return res.status(404).json({ error: 'No members found' });
    }

    const memberIndex = db.greenOffice.members.findIndex(m => m.id === memberId);
    
    if (memberIndex === -1) {
      return res.status(404).json({ error: 'Member not found' });
    }

    db.greenOffice.members.splice(memberIndex, 1);

    if (writeDatabase(db)) {
      res.json({ message: 'Member deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete member' });
    }
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Missions endpoints
app.get('/api/green-office/missions', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }
    
    const missions = db.greenOffice?.missions || [];
    res.json(missions);
  } catch (error) {
    console.error('Error fetching missions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/green-office/missions', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const { title, description } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const newMission = {
      id: getNextId('greenOffice.missions'),
      title,
      description
    };

    if (!db.greenOffice) db.greenOffice = {};
    if (!db.greenOffice.missions) db.greenOffice.missions = [];

    db.greenOffice.missions.push(newMission);

    if (writeDatabase(db)) {
      res.status(201).json(newMission);
    } else {
      res.status(500).json({ error: 'Failed to save mission' });
    }
  } catch (error) {
    console.error('Error creating mission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/green-office/missions/:id', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const missionId = parseInt(req.params.id);
    
    if (!db.greenOffice?.missions) {
      return res.status(404).json({ error: 'No missions found' });
    }

    const missionIndex = db.greenOffice.missions.findIndex(m => m.id === missionId);
    
    if (missionIndex === -1) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    db.greenOffice.missions.splice(missionIndex, 1);

    if (writeDatabase(db)) {
      res.json({ message: 'Mission deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete mission' });
    }
  } catch (error) {
    console.error('Error deleting mission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Commitments endpoints
app.get('/api/green-office/commitments', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }
    
    const commitments = db.greenOffice?.commitments || [];
    res.json(commitments);
  } catch (error) {
    console.error('Error fetching commitments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/green-office/commitments', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const { title, description, targetDate } = req.body;
    
    if (!title || !description || !targetDate) {
      return res.status(400).json({ error: 'Title, description, and targetDate are required' });
    }

    const newCommitment = {
      id: getNextId('greenOffice.commitments'),
      title,
      description,
      targetDate
    };

    if (!db.greenOffice) db.greenOffice = {};
    if (!db.greenOffice.commitments) db.greenOffice.commitments = [];

    db.greenOffice.commitments.push(newCommitment);

    if (writeDatabase(db)) {
      res.status(201).json(newCommitment);
    } else {
      res.status(500).json({ error: 'Failed to save commitment' });
    }
  } catch (error) {
    console.error('Error creating commitment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/green-office/commitments/:id', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const commitmentId = parseInt(req.params.id);
    
    if (!db.greenOffice?.commitments) {
      return res.status(404).json({ error: 'No commitments found' });
    }

    const commitmentIndex = db.greenOffice.commitments.findIndex(c => c.id === commitmentId);
    
    if (commitmentIndex === -1) {
      return res.status(404).json({ error: 'Commitment not found' });
    }

    db.greenOffice.commitments.splice(commitmentIndex, 1);

    if (writeDatabase(db)) {
      res.json({ message: 'Commitment deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete commitment' });
    }
  } catch (error) {
    console.error('Error deleting commitment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Milestones endpoints
app.get('/api/green-office/milestones', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }
    
    const milestones = db.greenOffice?.milestones || [];
    res.json(milestones);
  } catch (error) {
    console.error('Error fetching milestones:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/green-office/milestones', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const { title, description, date, status } = req.body;
    
    if (!title || !description || !date || !status) {
      return res.status(400).json({ error: 'Title, description, date, and status are required' });
    }

    const newMilestone = {
      id: getNextId('greenOffice.milestones'),
      title,
      description,
      date,
      status
    };

    if (!db.greenOffice) db.greenOffice = {};
    if (!db.greenOffice.milestones) db.greenOffice.milestones = [];

    db.greenOffice.milestones.push(newMilestone);

    if (writeDatabase(db)) {
      res.status(201).json(newMilestone);
    } else {
      res.status(500).json({ error: 'Failed to save milestone' });
    }
  } catch (error) {
    console.error('Error creating milestone:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/green-office/milestones/:id', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const milestoneId = parseInt(req.params.id);
    
    if (!db.greenOffice?.milestones) {
      return res.status(404).json({ error: 'No milestones found' });
    }

    const milestoneIndex = db.greenOffice.milestones.findIndex(m => m.id === milestoneId);
    
    if (milestoneIndex === -1) {
      return res.status(404).json({ error: 'Milestone not found' });
    }

    db.greenOffice.milestones.splice(milestoneIndex, 1);

    if (writeDatabase(db)) {
      res.json({ message: 'Milestone deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete milestone' });
    }
  } catch (error) {
    console.error('Error deleting milestone:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== COMMITTEES ROUTES ====================

app.get('/api/committees', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }
    
    const committees = db.committees || [];
    res.json(committees);
  } catch (error) {
    console.error('Error fetching committees:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/committees', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const { name, description } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const newCommittee = {
      id: getNextId('committees'),
      name,
      description,
      members: [],
      meetingMinutes: []
    };

    if (!db.committees) db.committees = [];

    db.committees.push(newCommittee);

    if (writeDatabase(db)) {
      res.status(201).json(newCommittee);
    } else {
      res.status(500).json({ error: 'Failed to save committee' });
    }
  } catch (error) {
    console.error('Error creating committee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/committees/:id', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const committeeId = parseInt(req.params.id);
    
    if (!db.committees) {
      return res.status(404).json({ error: 'No committees found' });
    }

    const committeeIndex = db.committees.findIndex(c => c.id === committeeId);
    
    if (committeeIndex === -1) {
      return res.status(404).json({ error: 'Committee not found' });
    }

    db.committees.splice(committeeIndex, 1);

    if (writeDatabase(db)) {
      res.json({ message: 'Committee deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete committee' });
    }
  } catch (error) {
    console.error('Error deleting committee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Committee Members
app.post('/api/committees/:id/members', upload.single('image'), (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const committeeId = parseInt(req.params.id);
    const { name, position, email, phone } = req.body;
    
    if (!name || !position || !email) {
      return res.status(400).json({ error: 'Name, position, and email are required' });
    }

    const committee = db.committees?.find(c => c.id === committeeId);
    if (!committee) {
      return res.status(404).json({ error: 'Committee not found' });
    }

    // Handle image upload
    let imagePath = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
    if (req.file) {
      imagePath = '/uploads/' + req.file.filename;
    }

    const newMember = {
      id: getNextId(`committees.${committeeId}.members`),
      name,
      position,
      email,
      phone: phone || '',
      image: imagePath
    };

    if (!committee.members) committee.members = [];
    committee.members.push(newMember);

    if (writeDatabase(db)) {
      res.status(201).json(newMember);
    } else {
      res.status(500).json({ error: 'Failed to save committee member' });
    }
  } catch (error) {
    console.error('Error creating committee member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/committees/:committeeId/members/:memberId', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const committeeId = parseInt(req.params.committeeId);
    const memberId = parseInt(req.params.memberId);
    
    const committee = db.committees?.find(c => c.id === committeeId);
    if (!committee) {
      return res.status(404).json({ error: 'Committee not found' });
    }

    if (!committee.members) {
      return res.status(404).json({ error: 'No members found in committee' });
    }

    const memberIndex = committee.members.findIndex(m => m.id === memberId);
    if (memberIndex === -1) {
      return res.status(404).json({ error: 'Member not found in committee' });
    }

    committee.members.splice(memberIndex, 1);

    if (writeDatabase(db)) {
      res.json({ message: 'Committee member deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete committee member' });
    }
  } catch (error) {
    console.error('Error deleting committee member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Committee Meeting Minutes
app.post('/api/committees/:id/meeting-minutes', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const committeeId = parseInt(req.params.id);
    const { title, date, content } = req.body;
    
    if (!title || !date || !content) {
      return res.status(400).json({ error: 'Title, date, and content are required' });
    }

    const committee = db.committees?.find(c => c.id === committeeId);
    if (!committee) {
      return res.status(404).json({ error: 'Committee not found' });
    }

    const newMinutes = {
      id: getNextId(`committees.${committeeId}.meetingMinutes`),
      title,
      date,
      content
    };

    if (!committee.meetingMinutes) committee.meetingMinutes = [];
    committee.meetingMinutes.push(newMinutes);

    if (writeDatabase(db)) {
      res.status(201).json(newMinutes);
    } else {
      res.status(500).json({ error: 'Failed to save meeting minutes' });
    }
  } catch (error) {
    console.error('Error creating meeting minutes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/committees/:committeeId/meeting-minutes/:minutesId', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const committeeId = parseInt(req.params.committeeId);
    const minutesId = parseInt(req.params.minutesId);
    
    const committee = db.committees?.find(c => c.id === committeeId);
    if (!committee) {
      return res.status(404).json({ error: 'Committee not found' });
    }

    if (!committee.meetingMinutes) {
      return res.status(404).json({ error: 'No meeting minutes found' });
    }

    const minutesIndex = committee.meetingMinutes.findIndex(m => m.id === minutesId);
    if (minutesIndex === -1) {
      return res.status(404).json({ error: 'Meeting minutes not found' });
    }

    committee.meetingMinutes.splice(minutesIndex, 1);

    if (writeDatabase(db)) {
      res.json({ message: 'Meeting minutes deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete meeting minutes' });
    }
  } catch (error) {
    console.error('Error deleting meeting minutes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== STUDENT COUNCIL ROUTES ====================

app.get('/api/student-council/members', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }
    
    const members = db.studentCouncil?.members || [];
    res.json(members);
  } catch (error) {
    console.error('Error fetching student council members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/student-council/members', upload.single('image'), (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const { name, position, email, phone } = req.body;
    
    if (!name || !position || !email) {
      return res.status(400).json({ error: 'Name, position, and email are required' });
    }

    // Handle image upload
    let imagePath = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
    if (req.file) {
      imagePath = '/uploads/' + req.file.filename;
    }

    const newMember = {
      id: getNextId('studentCouncil.members'),
      name,
      position,
      email,
      phone: phone || '',
      image: imagePath
    };

    if (!db.studentCouncil) db.studentCouncil = {};
    if (!db.studentCouncil.members) db.studentCouncil.members = [];

    db.studentCouncil.members.push(newMember);

    if (writeDatabase(db)) {
      res.status(201).json(newMember);
    } else {
      res.status(500).json({ error: 'Failed to save student council member' });
    }
  } catch (error) {
    console.error('Error creating student council member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/student-council/members/:id', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const memberId = parseInt(req.params.id);
    
    if (!db.studentCouncil?.members) {
      return res.status(404).json({ error: 'No student council members found' });
    }

    const memberIndex = db.studentCouncil.members.findIndex(m => m.id === memberId);
    
    if (memberIndex === -1) {
      return res.status(404).json({ error: 'Student council member not found' });
    }

    db.studentCouncil.members.splice(memberIndex, 1);

    if (writeDatabase(db)) {
      res.json({ message: 'Student council member deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete student council member' });
    }
  } catch (error) {
    console.error('Error deleting student council member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Student Council Meeting Minutes
app.get('/api/student-council/meeting-minutes', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }
    
    const minutes = db.studentCouncil?.meetingMinutes || [];
    res.json(minutes);
  } catch (error) {
    console.error('Error fetching student council meeting minutes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/student-council/meeting-minutes', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const { title, date, content } = req.body;
    
    if (!title || !date || !content) {
      return res.status(400).json({ error: 'Title, date, and content are required' });
    }

    const newMinutes = {
      id: getNextId('studentCouncil.meetingMinutes'),
      title,
      date,
      content
    };

    if (!db.studentCouncil) db.studentCouncil = {};
    if (!db.studentCouncil.meetingMinutes) db.studentCouncil.meetingMinutes = [];

    db.studentCouncil.meetingMinutes.push(newMinutes);

    if (writeDatabase(db)) {
      res.status(201).json(newMinutes);
    } else {
      res.status(500).json({ error: 'Failed to save meeting minutes' });
    }
  } catch (error) {
    console.error('Error creating meeting minutes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/student-council/meeting-minutes/:id', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const minutesId = parseInt(req.params.id);
    
    if (!db.studentCouncil?.meetingMinutes) {
      return res.status(404).json({ error: 'No meeting minutes found' });
    }

    const minutesIndex = db.studentCouncil.meetingMinutes.findIndex(m => m.id === minutesId);
    
    if (minutesIndex === -1) {
      return res.status(404).json({ error: 'Meeting minutes not found' });
    }

    db.studentCouncil.meetingMinutes.splice(minutesIndex, 1);

    if (writeDatabase(db)) {
      res.json({ message: 'Meeting minutes deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete meeting minutes' });
    }
  } catch (error) {
    console.error('Error deleting meeting minutes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Green Office API is running' });
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

// Initialize database and start server
initializeDatabase();

app.listen(PORT, () => {
  console.log(`Green Office API server running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/`);
});