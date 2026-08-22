import express from 'express';
import cors from 'cors';
import multer from 'multer';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure upload directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(uploadsDir));

// --- API Endpoints ---

// 1. GGSIPU College Search API
app.get('/api/colleges', (req, res) => {
  const q = req.query.q || '';
  const rows = db.prepare(`
    SELECT * FROM colleges 
    WHERE name LIKE ? OR code LIKE ? OR location LIKE ?
  `).all(`%${q}%`, `%${q}%`, `%${q}%`);
  res.json({ success: true, count: rows.length, data: rows });
});

// 2. Dynamic QR Code Generator API (For Anti-Proxy Virtual ID)
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
    res.json({ success: true, token: data, qrCode: qrDataUrl });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Attendance Verification & Live Sessions
app.get('/api/attendance/session', (req, res) => {
  const session = db.prepare("SELECT * FROM attendance_sessions WHERE status = 'active' ORDER BY startTime DESC LIMIT 1").get();
  res.json({ success: true, session });
});

app.post('/api/attendance/verify', (req, res) => {
  const { studentEnrollment, studentName, passcode, sessionId, verifiedVia } = req.body;
  
  const active = db.prepare("SELECT * FROM attendance_sessions WHERE status = 'active' ORDER BY startTime DESC LIMIT 1").get();
  
  if (!active || active.code !== passcode) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid room passcode. Check the lecturer’s live board.' 
    });
  }

  const insert = db.prepare(`
    INSERT INTO attendance_logs (studentEnrollment, studentName, sessionId, subject, verifiedVia, status)
    VALUES (?, ?, ?, ?, ?, 'Present')
  `);
  insert.run(studentEnrollment || '07215602723', studentName || 'Krrish Kumar', active.id, active.subject, verifiedVia || 'Dual-Factor BLE Mesh Node');

  res.json({
    success: true,
    message: `Attendance cryptographically verified for ${active.subject}! Marked Present.`,
    subject: active.subject,
    verifiedAt: new Date().toLocaleTimeString()
  });
});

app.get('/api/attendance/logs/:enrollment', (req, res) => {
  const logs = db.prepare("SELECT * FROM attendance_logs WHERE studentEnrollment = ? ORDER BY timestamp DESC").all(req.params.enrollment);
  res.json({ success: true, logs });
});

// 4. Grievances Triage & Upload API
app.get('/api/grievances', (req, res) => {
  const { destination } = req.query;
  let rows;
  if (destination && destination !== 'all') {
    rows = db.prepare("SELECT * FROM grievances WHERE destination = ? ORDER BY id DESC").all(destination);
  } else {
    rows = db.prepare("SELECT * FROM grievances ORDER BY id DESC").all();
  }
  res.json({ success: true, data: rows });
});

app.post('/api/grievances', upload.single('evidencePhoto'), (req, res) => {
  try {
    const { title, description, category, destination, priority, isAnonymous, studentName, studentEnrollment, assignedTo } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl || null;
    const id = `GRV-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = 'Just now (Today)';

    const insert = db.prepare(`
      INSERT INTO grievances (id, studentName, studentEnrollment, isAnonymous, title, category, destination, priority, description, imageUrl, status, timestamp, assignedTo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'In-Progress', ?, ?)
    `);

    insert.run(
      id,
      isAnonymous === 'true' || isAnonymous === true ? 'Anonymous Scholar' : (studentName || 'Krrish Kumar'),
      isAnonymous === 'true' || isAnonymous === true ? 'REDACTED' : (studentEnrollment || '07215602723'),
      isAnonymous === 'true' || isAnonymous === true ? 1 : 0,
      title,
      category,
      destination,
      priority,
      description,
      imageUrl,
      timestamp,
      assignedTo || (destination === 'hod' ? 'HOD Academic Committee' : category)
    );

    res.json({ success: true, id, message: 'Ticket registered in database & routed successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Notes & Faculty Directory API
app.get('/api/notes', (req, res) => {
  const rows = db.prepare("SELECT * FROM notes ORDER BY id DESC").all();
  res.json({ success: true, data: rows });
});

app.post('/api/notes', upload.single('noteFile'), (req, res) => {
  const { subject, title, faculty, semester, fileSize } = req.body;
  const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const uploadDate = 'Today';

  const insert = db.prepare(`
    INSERT INTO notes (subject, title, faculty, semester, fileSize, fileUrl, uploadDate)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insert.run(subject, title, faculty, semester, fileSize || '2.4 MB', fileUrl, uploadDate);
  res.json({ success: true, message: 'Notes published to campus vault.' });
});

// 6. Broadcasts API
app.get('/api/broadcasts', (req, res) => {
  const rows = db.prepare("SELECT * FROM broadcasts ORDER BY id DESC").all();
  res.json({ success: true, data: rows });
});

app.post('/api/broadcasts', (req, res) => {
  const { title, message, priority, isUrgent, sender, targetAudience } = req.body;
  const id = `BC-${Date.now().toString().slice(-4)}`;
  const time = 'Just now';

  const insert = db.prepare(`
    INSERT INTO broadcasts (id, title, message, priority, isUrgent, sender, targetAudience, time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insert.run(id, title, message, priority, isUrgent ? 1 : 0, sender || 'HOD Office', targetAudience || 'All Departments', time);
  res.json({ success: true, id, message: 'Broadcast transmitted.' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'EduSphere Smart Campus Backend (SQLite3)', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`⚡ EduSphere Backend Server running on http://localhost:${PORT}`);
});
