import express from 'express';
import cors from 'cors';
import multer from 'multer';
import QRCode from 'qrcode';
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

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, uniqueSuffix);
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }
});

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use('/uploads', express.static(uploadsDir));

// --- 1. AUTH & USER PROFILE ROUTES ---

// Registration
app.post('/api/register', (req, res) => {
  try {
    const { 
      name, 
      email, 
      role = 'student', 
      enrollment, 
      college = 'ADGITM (Dr. Akhilesh Das Gupta Institute of Technology & Management)', 
      department = 'Computer Science & Engineering (CSE)', 
      semester = '6th Semester (Year 3)', 
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
    const effectiveEnrollment = enrollment || `0421480${Math.floor(1000 + Math.random() * 9000)}`;
    const effectiveEmail = email || `${name.toLowerCase().replace(/\s+/g, '.')}@adgitm.ac.in`;
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
      88.4
    );

    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    delete newUser.password;

    return res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/login', (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    if (!identifier) {
      return res.status(400).json({ error: 'Enrollment or Email is required.' });
    }

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

// Update Profile & Photo
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
    return res.status(500).json({ error: error.message });
  }
});

// Photo Upload
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

// --- 2. GGSIPU COLLEGE SEARCH ---
app.get('/api/colleges', (req, res) => {
  try {
    const q = req.query.q || '';
    const rows = db.prepare(`
      SELECT * FROM colleges 
      WHERE name LIKE ? OR code LIKE ? OR location LIKE ?
    `).all(`%${q}%`, `%${q}%`, `%${q}%`);
    return res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// --- 3. DYNAMIC QR CODE DATAURL GENERATOR ---
app.get('/api/qrcode', async (req, res) => {
  try {
    const data = req.query.data || `EDUS-ROTATING-${Date.now()}`;
    const qrDataUrl = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 2,
      color: {
        dark: '#1e1b4b',
        light: '#ffffff'
      }
    });
    return res.json({ success: true, token: data, qrCode: qrDataUrl });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// --- 4. ATTENDANCE & LIVE CLASS SESSIONS ---
app.get('/api/attendance/session', (req, res) => {
  try {
    const session = db.prepare("SELECT * FROM attendance_sessions WHERE status = 'active' ORDER BY startTime DESC LIMIT 1").get();
    return res.json({ success: true, session });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.post('/api/attendance/verify', (req, res) => {
  try {
    const { studentEnrollment, studentName, passcode, sessionId, verifiedVia } = req.body;
    const active = db.prepare("SELECT * FROM attendance_sessions WHERE status = 'active' ORDER BY startTime DESC LIMIT 1").get();
    
    if (active && active.code !== passcode) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid room passcode. Please check teacher board code.' 
      });
    }

    db.prepare(`
      INSERT INTO attendance_logs (studentEnrollment, studentName, sessionId, subject, verifiedVia, status)
      VALUES (?, ?, ?, ?, ?, 'Present')
    `).run(studentEnrollment || '04214802722', studentName || 'Krrish Kumar Tanti', active?.id || 'SESS-01', active?.subject || 'Operating Systems Lab', verifiedVia || 'Dual-Factor BLE Proximity');

    return res.json({
      success: true,
      message: `Attendance verified! Marked Present.`,
      subject: active?.subject || 'Operating Systems Lab',
      verifiedAt: new Date().toLocaleTimeString()
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

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

// --- 5. GRIEVANCES ---
app.get('/api/grievances', (req, res) => {
  try {
    const { destination } = req.query;
    let list;
    if (destination && destination !== 'all') {
      list = db.prepare("SELECT * FROM grievances WHERE destination = ? ORDER BY createdAt DESC").all(destination);
    } else {
      list = db.prepare("SELECT * FROM grievances ORDER BY createdAt DESC").all();
    }
    return res.json({ success: true, grievances: list, data: list });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/grievances', upload.single('evidencePhoto'), (req, res) => {
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
      assignedTo 
    } = req.body;

    const imageUrl = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : req.body.imageUrl || null;
    const grvId = `GRV-${Math.floor(1000 + Math.random() * 9000)}`;
    
    db.prepare(`
      INSERT INTO grievances (id, userId, studentName, studentEnrollment, isAnonymous, title, category, destination, priority, description, imageUrl, status, assignedTo, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      grvId, 
      userId || null, 
      (isAnonymous === 'true' || isAnonymous === true) ? 'Anonymous Scholar' : (studentName || 'Krrish Kumar Tanti'), 
      (isAnonymous === 'true' || isAnonymous === true) ? 'REDACTED' : (studentEnrollment || '04214802722'), 
      (isAnonymous === 'true' || isAnonymous === true) ? 1 : 0, 
      title, 
      category, 
      destination, 
      priority, 
      description, 
      imageUrl, 
      'In-Progress', 
      assignedTo || (destination === 'hod' ? 'HOD Academic Office' : category), 
      'Just now'
    );

    const allGrievances = db.prepare('SELECT * FROM grievances ORDER BY createdAt DESC').all();
    return res.status(201).json({ success: true, grievances: allGrievances, id: grvId });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// --- 6. NOTES & BROADCASTS ---
app.get('/api/notes', (req, res) => {
  try {
    const notes = db.prepare('SELECT * FROM notes ORDER BY createdAt DESC').all();
    return res.json({ success: true, notes, data: notes });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/notes', upload.single('noteFile'), (req, res) => {
  try {
    const { subject, title, faculty, semester, fileSize } = req.body;
    const fileUrl = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : null;
    const noteId = `NOTE-${Date.now().toString().slice(-4)}`;

    db.prepare(`
      INSERT INTO notes (id, subject, title, faculty, fileSize, semester, fileUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(noteId, subject, title, faculty, fileSize || '2.5 MB', semester, fileUrl);

    return res.json({ success: true, message: 'Notes published to vault.' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.get('/api/broadcasts', (req, res) => {
  try {
    const broadcasts = db.prepare('SELECT * FROM broadcasts ORDER BY isUrgent DESC, createdAt DESC').all();
    return res.json({ success: true, broadcasts, data: broadcasts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/broadcasts', (req, res) => {
  try {
    const { title, message, priority, isUrgent, sender, targetAudience } = req.body;
    const id = `BC-${Date.now().toString().slice(-4)}`;
    const time = 'Just now';

    db.prepare(`
      INSERT INTO broadcasts (id, sender, role, title, message, time, isUrgent)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, sender || 'HOD Office', 'HOD', title, message, time, isUrgent ? 1 : 0);

    return res.json({ success: true, id, message: 'Broadcast transmitted.' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`⚡ EduSphere SQLite Backend API running on http://localhost:${PORT}`);
});
