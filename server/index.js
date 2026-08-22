import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db, { initDB } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB schema & seeds
initDB();

const app = express();
const PORT = process.env.PORT || 5001;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Serve static uploaded files
app.use('/uploads', express.static(uploadsDir));

// --- AUTH & USER ROUTES ---

// 1. User Registration (Student / Faculty / Staff)
app.post('/api/register', (req, res) => {
  try {
    const { 
      name, 
      email, 
      role = 'student', 
      enrollment, 
      college = 'ADGITM Smart Campus', 
      department = 'Computer Science & Engineering', 
      semester = '6th Semester', 
      section = 'CSE-A', 
      bloodGroup = 'O+ positive', 
      validUpto = 'June 2026', 
      avatar, 
      password 
    } = req.body;

    if (!name || !password || (!email && !enrollment)) {
      return res.status(400).json({ error: 'Name, password, and Email or Enrollment number are required.' });
    }

    const userId = `STU-${Date.now().toString().slice(-4)}`;
    const effectiveEnrollment = enrollment || `ENR-${Math.floor(10000000000 + Math.random() * 90000000000)}`;
    const effectiveEmail = email || `${name.toLowerCase().replace(/\s+/g, '.')}@campus.ac.in`;
    const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250';

    const insertStmt = db.prepare(`
      INSERT INTO users (id, name, email, role, enrollment, college, department, semester, section, bloodGroup, validUpto, avatar, password, cgpa, attendanceOverall)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(
      userId,
      name,
      effectiveEmail,
      role,
      effectiveEnrollment,
      college,
      department,
      semester,
      section,
      bloodGroup,
      validUpto,
      avatar || defaultAvatar,
      password,
      '8.50',
      85.0
    );

    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    delete newUser.password;

    return res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// 2. User Login
app.post('/api/login', (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    if (!identifier) {
      return res.status(400).json({ error: 'Enrollment or Email is required.' });
    }

    // Lookup by enrollment or email
    const user = db.prepare(`
      SELECT * FROM users 
      WHERE (enrollment = ? OR email = ? OR id = ?)
      ${role ? 'AND role = ?' : ''}
    `).get(role ? [identifier, identifier, identifier, role] : [identifier, identifier, identifier]);

    if (!user) {
      return res.status(404).json({ error: 'User not found with provided credentials.' });
    }

    delete user.password;
    return res.json({ success: true, user });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// 3. Update User Profile & ID Card Information
app.put('/api/user/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      enrollment, 
      college, 
      department, 
      semester, 
      section, 
      bloodGroup, 
      validUpto, 
      avatar, 
      cgpa 
    } = req.body;

    const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const updateStmt = db.prepare(`
      UPDATE users SET 
        name = COALESCE(?, name),
        enrollment = COALESCE(?, enrollment),
        college = COALESCE(?, college),
        department = COALESCE(?, department),
        semester = COALESCE(?, semester),
        section = COALESCE(?, section),
        bloodGroup = COALESCE(?, bloodGroup),
        validUpto = COALESCE(?, validUpto),
        avatar = COALESCE(?, avatar),
        cgpa = COALESCE(?, cgpa)
      WHERE id = ?
    `);

    updateStmt.run(
      name || null,
      enrollment || null,
      college || null,
      department || null,
      semester || null,
      section || null,
      bloodGroup || null,
      validUpto || null,
      avatar || null,
      cgpa || null,
      id
    );

    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    delete updatedUser.password;

    return res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// 4. File / Photo Upload endpoint
app.post('/api/upload-avatar', upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }
    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    return res.json({ success: true, url: fileUrl, filename: req.file.filename });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// --- ATTENDANCE ROUTES ---
app.get('/api/attendance/:userId', (req, res) => {
  try {
    const records = db.prepare('SELECT * FROM attendance_records WHERE userId = ? ORDER BY createdAt DESC').all(req.params.userId);
    return res.json({ success: true, records });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/attendance', (req, res) => {
  try {
    const { userId, subject, date, status = 'Present', verifiedVia = 'BLE Proximity' } = req.body;
    const attId = `ATT-${Date.now().toString().slice(-4)}`;
    
    db.prepare(`
      INSERT INTO attendance_records (id, userId, subject, date, status, verifiedVia)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(attId, userId, subject, date, status, verifiedVia);

    const records = db.prepare('SELECT * FROM attendance_records WHERE userId = ? ORDER BY createdAt DESC').all(userId);
    return res.json({ success: true, records });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// --- GRIEVANCE ROUTES ---
app.get('/api/grievances', (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM grievances ORDER BY createdAt DESC').all();
    return res.json({ success: true, grievances: list });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/grievances', (req, res) => {
  try {
    const { 
      userId, 
      studentName, 
      studentEnrollment, 
      isAnonymous = 0, 
      title, 
      category, 
      destination, 
      priority, 
      description, 
      imageUrl, 
      assignedTo 
    } = req.body;

    const grvId = `GRV-${Math.floor(1000 + Math.random() * 9000)}`;
    
    db.prepare(`
      INSERT INTO grievances (id, userId, studentName, studentEnrollment, isAnonymous, title, category, destination, priority, description, imageUrl, status, assignedTo, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      grvId, 
      userId || null, 
      studentName, 
      studentEnrollment, 
      isAnonymous ? 1 : 0, 
      title, 
      category, 
      destination, 
      priority, 
      description, 
      imageUrl || null, 
      'In-Progress', 
      assignedTo || (destination === 'hod' ? 'HOD Academic Office' : category), 
      'Just now'
    );

    const allGrievances = db.prepare('SELECT * FROM grievances ORDER BY createdAt DESC').all();
    return res.status(201).json({ success: true, grievances: allGrievances });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// --- NOTES & BROADCASTS ---
app.get('/api/notes', (req, res) => {
  try {
    const notes = db.prepare('SELECT * FROM notes ORDER BY createdAt DESC').all();
    return res.json({ success: true, notes });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/broadcasts', (req, res) => {
  try {
    const broadcasts = db.prepare('SELECT * FROM broadcasts ORDER BY isUrgent DESC, createdAt DESC').all();
    return res.json({ success: true, broadcasts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 EduSphere SQLite Backend API running on http://localhost:${PORT}`);
});
