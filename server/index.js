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
  limits: { fileSize: 25 * 1024 * 1024 }
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(uploadsDir));

// --- 1. AUTH & USER PROFILE ROUTES (4-ROLE ENGINE) ---

// Role-specific Registration
app.post('/api/register', (req, res) => {
  try {
    const { 
      name, 
      email, 
      role = 'student', 
      enrollment, 
      college = 'Apex Institute of Technology & Management', 
      department = 'Computer Science & Engineering (CSE)', 
      semester = '6th Semester (Year 3)', 
      section = 'CSE-A', 
      bloodGroup = 'O+ positive', 
      validUpto = 'June 2026', 
      avatar, 
      password,
      designation,
      subjects,
      cabin,
      assignedUnit,
      supervisorLevel,
      adminCode,
      badgeId,
      digitalSignature
    } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: 'Full name and password are required.' });
    }

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    let userId = '';
    let effectiveEnrollment = enrollment;

    if (role === 'student') {
      userId = `STU-${Date.now().toString().slice(-4)}`;
      effectiveEnrollment = enrollment || `0421480${randomDigits}`;
    } else if (role === 'teacher') {
      userId = badgeId || `FAC-${randomDigits}`;
      effectiveEnrollment = userId;
    } else if (role === 'hod') {
      userId = adminCode || `HOD-${randomDigits}`;
      effectiveEnrollment = userId;
    } else if (role === 'staff') {
      userId = badgeId || `STF-${randomDigits}`;
      effectiveEnrollment = userId;
    } else {
      userId = `USR-${Date.now().toString().slice(-4)}`;
    }

    const effectiveEmail = email || `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@campus.edu`;
    const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250';

    const insertStmt = db.prepare(`
      INSERT INTO users (
        id, name, email, role, enrollment, college, department, semester, section, 
        bloodGroup, validUpto, avatar, password, cgpa, attendanceOverall,
        designation, subjects, cabin, assignedUnit, supervisorLevel, adminCode, badgeId, digitalSignature
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(
      userId,
      name,
      effectiveEmail,
      role,
      effectiveEnrollment,
      college,
      department,
      semester || (role === 'student' ? '6th Semester (Year 3)' : 'Permanent'),
      section || (role === 'student' ? 'CSE-A' : 'Campus'),
      bloodGroup || 'O+ positive',
      validUpto || (role === 'student' ? 'June 2026' : 'Permanent'),
      avatar || defaultAvatar,
      password,
      role === 'student' ? '8.50' : 'N/A',
      role === 'student' ? 88.4 : 100,
      designation || (role === 'teacher' ? 'Associate Professor' : role === 'hod' ? 'Head of Department' : role === 'staff' ? 'Lead Supervisor' : 'Student Scholar'),
      subjects || null,
      cabin || null,
      assignedUnit || null,
      supervisorLevel || null,
      adminCode || null,
      badgeId || null,
      digitalSignature || null
    );

    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    delete newUser.password;

    return res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Role-verified Login
app.post('/api/login', (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    if (!identifier) {
      return res.status(400).json({ error: 'Enrollment, Employee ID, or Email is required.' });
    }

    const user = db.prepare(`
      SELECT * FROM users 
      WHERE (enrollment = ? OR email = ? OR id = ? OR adminCode = ? OR badgeId = ?)
      ${role ? 'AND role = ?' : ''}
    `).get(
      role 
        ? [identifier, identifier, identifier, identifier, identifier, role] 
        : [identifier, identifier, identifier, identifier, identifier]
    );

    if (!user) {
      return res.status(404).json({ error: 'Account not found with provided credentials.' });
    }

    if (password && user.password && user.password !== password) {
      return res.status(401).json({ error: 'Invalid password. Please check your credentials.' });
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
      cgpa,
      designation,
      subjects,
      cabin,
      assignedUnit,
      supervisorLevel,
      adminCode,
      badgeId,
      digitalSignature
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
        cgpa = COALESCE(?, cgpa),
        designation = COALESCE(?, designation),
        subjects = COALESCE(?, subjects),
        cabin = COALESCE(?, cabin),
        assignedUnit = COALESCE(?, assignedUnit),
        supervisorLevel = COALESCE(?, supervisorLevel),
        adminCode = COALESCE(?, adminCode),
        badgeId = COALESCE(?, badgeId),
        digitalSignature = COALESCE(?, digitalSignature)
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
      designation || null,
      subjects || null,
      cabin || null,
      assignedUnit || null,
      supervisorLevel || null,
      adminCode || null,
      badgeId || null,
      digitalSignature || null,
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

// Get User by ID
app.get('/api/user/:id', (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    delete user.password;
    return res.json({ success: true, user });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Get All Users (optionally by role)
app.get('/api/users', (req, res) => {
  try {
    const { role } = req.query;
    let users = [];
    if (role) {
      users = db.prepare('SELECT id, name, email, role, enrollment, college, department, designation, avatar, cabin FROM users WHERE role = ?').all(role);
    } else {
      users = db.prepare('SELECT id, name, email, role, enrollment, college, department, designation, avatar, cabin FROM users').all();
    }
    return res.json({ success: true, users });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// --- 2. UNIVERSAL COLLEGE SEARCH ---
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

// Get active session
app.get('/api/attendance/session', (req, res) => {
  try {
    let session = db.prepare("SELECT * FROM attendance_sessions WHERE status = 'active' ORDER BY startTime DESC LIMIT 1").get();
    if (!session) {
      session = {
        id: 'SESS-LIVE-01',
        subject: 'Operating Systems Lab (CSE-301)',
        code: 'OS42',
        room: 'Lab 204, Block A',
        beaconId: 'BLE_BEACON_CSE_LAB_204',
        faculty: 'Dr. Manish Verma',
        status: 'active'
      };
    }
    return res.json({ success: true, session });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Set / Start active session (Teacher creates/updates)
app.post('/api/attendance/session', (req, res) => {
  try {
    const { subject, code, room, beaconId, faculty } = req.body;
    const sessionId = `SESS-${Date.now().toString().slice(-4)}`;

    // Deactivate previous active sessions
    db.prepare("UPDATE attendance_sessions SET status = 'completed' WHERE status = 'active'").run();

    db.prepare(`
      INSERT INTO attendance_sessions (id, subject, code, room, beaconId, faculty, status)
      VALUES (?, ?, ?, ?, ?, ?, 'active')
    `).run(
      sessionId,
      subject || 'Operating Systems Lab (CSE-301)',
      code || `EDUS-${Math.floor(1000 + Math.random() * 9000)}`,
      room || 'Lab 204, Block A',
      beaconId || 'BLE_BEACON_CSE_LAB_204',
      faculty || 'Dr. Manish Verma'
    );

    const session = db.prepare("SELECT * FROM attendance_sessions WHERE id = ?").get(sessionId);
    return res.json({ success: true, session });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Student attendance verification
app.post('/api/attendance/verify', (req, res) => {
  try {
    const { studentEnrollment, studentName, passcode, verifiedVia } = req.body;
    const active = db.prepare("SELECT * FROM attendance_sessions WHERE status = 'active' ORDER BY startTime DESC LIMIT 1").get();
    
    if (active && active.code.trim().toUpperCase() !== passcode?.trim().toUpperCase()) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid room passcode "${passcode}". Please check teacher display board.` 
      });
    }

    const enr = studentEnrollment || '04214802722';
    const name = studentName || 'Krrish Kumar Tanti';
    const sessId = active?.id || 'SESS-LIVE-01';
    const sub = active?.subject || 'Operating Systems Lab (CSE-301)';
    const via = verifiedVia || 'Dual-Factor BLE Proximity (0.8m) + PIN';

    // Insert into logs
    db.prepare(`
      INSERT INTO attendance_logs (studentEnrollment, studentName, sessionId, subject, verifiedVia, status)
      VALUES (?, ?, ?, ?, ?, 'Present')
    `).run(enr, name, sessId, sub, via);

    return res.json({
      success: true,
      message: `Attendance verified! Marked Present in ${sub}.`,
      subject: sub,
      studentName: name,
      studentEnrollment: enr,
      verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get session logs / live verified roster
app.get('/api/attendance/logs', (req, res) => {
  try {
    const logs = db.prepare("SELECT * FROM attendance_logs ORDER BY timestamp DESC LIMIT 50").all();
    return res.json({ success: true, logs });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Get user attendance history
app.get('/api/attendance/:userId', (req, res) => {
  try {
    const records = db.prepare('SELECT * FROM attendance_records WHERE userId = ? ORDER BY createdAt DESC').all(req.params.userId);
    return res.json({ success: true, records });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// --- 5. GRIEVANCES (DOUBLE-TRIAGE) ---
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
    const isAnon = (isAnonymous === 'true' || isAnonymous === true || isAnonymous === 1);
    
    db.prepare(`
      INSERT INTO grievances (id, userId, studentName, studentEnrollment, isAnonymous, title, category, destination, priority, description, imageUrl, status, assignedTo, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      grvId, 
      userId || null, 
      isAnon ? 'Anonymous Scholar' : (studentName || 'Krrish Kumar Tanti'), 
      isAnon ? 'REDACTED-PRIVACY-SHIELD' : (studentEnrollment || '04214802722'), 
      isAnon ? 1 : 0, 
      title, 
      category || 'General', 
      destination || 'staff', 
      priority || 'Medium', 
      description, 
      imageUrl, 
      'In-Progress', 
      assignedTo || (destination === 'hod' ? 'HOD Academic Office' : category), 
      'Today, Just now'
    );

    const createdTicket = db.prepare('SELECT * FROM grievances WHERE id = ?').get(grvId);
    const allGrievances = db.prepare('SELECT * FROM grievances ORDER BY createdAt DESC').all();
    return res.status(201).json({ success: true, ticket: createdTicket, grievances: allGrievances, id: grvId });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update grievance status & remarks
app.patch('/api/grievances/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes } = req.body;

    db.prepare(`
      UPDATE grievances 
      SET status = COALESCE(?, status), 
          resolutionNotes = COALESCE(?, resolutionNotes)
      WHERE id = ?
    `).run(status || null, resolutionNotes || null, id);

    const updated = db.prepare('SELECT * FROM grievances WHERE id = ?').get(id);
    return res.json({ success: true, ticket: updated });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.delete('/api/grievances/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM grievances WHERE id = ?').run(req.params.id);
    return res.json({ success: true, message: 'Grievance ticket permanently removed.' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Delete Attendance Logs (Single or Purge All)
app.delete('/api/attendance/logs/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM attendance_logs WHERE id = ?').run(req.params.id);
    return res.json({ success: true, message: 'Attendance log entry deleted.' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.delete('/api/attendance/logs', (req, res) => {
  try {
    db.prepare('DELETE FROM attendance_logs').run();
    return res.json({ success: true, message: 'All attendance logs purged.' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// --- 6. NOTES VAULT ---
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

    const newNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(noteId);
    return res.json({ success: true, note: newNote, message: 'Notes published to vault.' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.delete('/api/notes/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM notes WHERE id = ?').run(req.params.id);
    return res.json({ success: true, message: 'Note deleted from vault.' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// --- 7. CAMPUS BROADCASTS ---
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
    const time = 'Just now (Today)';

    db.prepare(`
      INSERT INTO broadcasts (id, sender, role, title, message, time, isUrgent, targetAudience)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, 
      sender || 'HOD Office', 
      'HOD', 
      title, 
      message, 
      time, 
      (isUrgent === true || isUrgent === 'true' || isUrgent === 1 || priority === 'Urgent') ? 1 : 0,
      targetAudience || 'All Campus'
    );

    const newBroadcast = db.prepare('SELECT * FROM broadcasts WHERE id = ?').get(id);
    return res.json({ success: true, id, broadcast: newBroadcast, message: 'Broadcast transmitted.' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.delete('/api/broadcasts/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM broadcasts WHERE id = ?').run(req.params.id);
    return res.json({ success: true, message: 'Broadcast recalled.' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// --- 8. DIRECT WHATSAPP-STYLE 1-ON-1 MESSAGING ---
app.get('/api/messages', (req, res) => {
  try {
    const { user1, user2, userId } = req.query;
    let messages = [];

    if (user1 && user2) {
      messages = db.prepare(`
        SELECT * FROM direct_messages 
        WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?)
        ORDER BY timestamp ASC
      `).all(user1, user2, user2, user1);
    } else if (userId) {
      messages = db.prepare(`
        SELECT * FROM direct_messages 
        WHERE senderId = ? OR receiverId = ?
        ORDER BY timestamp ASC
      `).all(userId, userId);
    } else {
      messages = db.prepare('SELECT * FROM direct_messages ORDER BY timestamp ASC LIMIT 100').all();
    }

    return res.json({ success: true, messages });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.post('/api/messages', (req, res) => {
  try {
    const { 
      senderId, 
      senderName, 
      senderRole, 
      senderAvatar, 
      receiverId, 
      receiverName, 
      receiverRole, 
      message 
    } = req.body;

    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ error: 'Sender, receiver, and message content required.' });
    }

    const msgId = `MSG-${Date.now().toString().slice(-6)}`;
    db.prepare(`
      INSERT INTO direct_messages (id, senderId, senderName, senderRole, senderAvatar, receiverId, receiverName, receiverRole, message, readReceipt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `).run(
      msgId,
      senderId,
      senderName || 'Anonymous Scholar',
      senderRole || 'student',
      senderAvatar || null,
      receiverId,
      receiverName || 'Faculty Member',
      receiverRole || 'teacher',
      message
    );

    const created = db.prepare('SELECT * FROM direct_messages WHERE id = ?').get(msgId);
    return res.status(201).json({ success: true, message: created });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.patch('/api/messages/read', (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    if (senderId && receiverId) {
      db.prepare(`
        UPDATE direct_messages 
        SET readReceipt = 1 
        WHERE senderId = ? AND receiverId = ?
      `).run(senderId, receiverId);
    }
    return res.json({ success: true, message: 'Messages marked as read.' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.delete('/api/messages/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM direct_messages WHERE id = ?').run(req.params.id);
    return res.json({ success: true, message: 'Message deleted.' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`⚡ EduSphere SQLite Backend API running on http://localhost:${PORT}`);
});


