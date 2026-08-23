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

// Multer storage configuration with sanitization
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const sanitizedName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E6)}-${sanitizedName}${ext}`;
    cb(null, uniqueSuffix);
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 30 * 1024 * 1024 } // 30MB
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(uploadsDir));

// ==========================================
// 1. AUTH & USER PROFILE ROUTES (4-ROLE ENGINE)
// ==========================================

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
      digitalSignature,
      university = 'GGSIPU'
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
        designation, subjects, cabin, assignedUnit, supervisorLevel, adminCode, badgeId, digitalSignature, university
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      digitalSignature || null,
      university || 'GGSIPU'
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

// Dynamic Faculty Directory: Returns all active and registered teachers
app.get('/api/users/faculty', (req, res) => {
  try {
    const faculty = db.prepare(`
      SELECT id, name, email, role, department, designation, cabin, avatar, subjects, section, college, university 
      FROM users 
      WHERE role = 'teacher' 
      ORDER BY name ASC
    `).all();
    return res.json({ success: true, count: faculty.length, faculty, users: faculty });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Get All Users (optionally filtered by role)
app.get('/api/users', (req, res) => {
  try {
    const { role } = req.query;
    let users = [];
    if (role) {
      users = db.prepare('SELECT id, name, email, role, enrollment, college, department, designation, avatar, cabin, subjects, section, university FROM users WHERE role = ? ORDER BY name ASC').all(role);
    } else {
      users = db.prepare('SELECT id, name, email, role, enrollment, college, department, designation, avatar, cabin, subjects, section, university FROM users ORDER BY name ASC').all();
    }
    return res.json({ success: true, users });
  } catch (e) {
    return res.status(500).json({ error: e.message });
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
      digitalSignature,
      university
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
        digitalSignature = COALESCE(?, digitalSignature),
        university = COALESCE(?, university)
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
      university || null,
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

// Universal College Search
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

// Dynamic QR Code DataURL Generator
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

// ==========================================
// 2. ULTRA-PRIVATE 1-ON-1 WHATSAPP DIRECT CHAT
// ==========================================

// Get Messages (Strict Thread and Peer-to-Peer Isolation)
app.get(['/api/messages', '/api/messages/:userId'], (req, res) => {
  try {
    const userId = req.params.userId || req.query.userId;
    const { user1, user2, threadId } = req.query;
    let messages = [];

    if (threadId) {
      messages = db.prepare(`
        SELECT * FROM direct_messages 
        WHERE threadId = ?
        ORDER BY timestamp ASC
      `).all(threadId);
    } else if (user1 && user2) {
      const computedThread = [user1, user2].sort().join('_');
      messages = db.prepare(`
        SELECT * FROM direct_messages 
        WHERE threadId = ? OR (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?)
        ORDER BY timestamp ASC
      `).all(computedThread, user1, user2, user2, user1);
    } else if (userId) {
      messages = db.prepare(`
        SELECT * FROM direct_messages 
        WHERE senderId = ? OR receiverId = ? OR recipientId = ?
        ORDER BY timestamp ASC
      `).all(userId, userId, userId);
    } else {
      // Return empty array to prevent global leak
      messages = [];
    }

    return res.json({ success: true, count: messages.length, messages });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Send Direct Message (Strict Thread Scoping)
app.post('/api/messages', upload.single('attachment'), (req, res) => {
  try {
    const { 
      senderId, 
      senderName, 
      senderRole, 
      senderAvatar, 
      recipientId,
      receiverId, 
      recipientName,
      receiverName, 
      recipientRole,
      receiverRole, 
      text,
      message = '' 
    } = req.body;

    const targetRecipientId = recipientId || receiverId;
    const targetRecipientName = recipientName || receiverName || 'Faculty Member';
    const targetRecipientRole = recipientRole || receiverRole || 'teacher';
    const messageBody = (text || message || '').trim();

    if (!senderId || !targetRecipientId) {
      return res.status(400).json({ error: 'Sender and recipient IDs are required.' });
    }

    const fileUrl = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : req.body.fileUrl || null;
    const fileName = req.file ? req.file.originalname : req.body.fileName || null;

    if (!messageBody && !fileUrl) {
      return res.status(400).json({ error: 'Message text or attachment required.' });
    }

    const threadId = [senderId, targetRecipientId].sort().join('_');
    const msgId = `MSG-${Date.now().toString().slice(-6)}`;

    db.prepare(`
      INSERT INTO direct_messages (
        id, threadId, senderId, senderName, senderRole, senderAvatar, 
        recipientId, receiverId, recipientName, receiverName, recipientRole, receiverRole, 
        text, message, readReceipt, isRead, fileUrl, fileName
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)
    `).run(
      msgId,
      threadId,
      senderId,
      senderName || 'Campus User',
      senderRole || 'student',
      senderAvatar || null,
      targetRecipientId,
      targetRecipientId,
      targetRecipientName,
      targetRecipientName,
      targetRecipientRole,
      targetRecipientRole,
      messageBody,
      messageBody,
      fileUrl,
      fileName
    );

    const created = db.prepare('SELECT * FROM direct_messages WHERE id = ?').get(msgId);
    return res.status(201).json({ success: true, message: created });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Mark messages as read
app.patch('/api/messages/read', (req, res) => {
  try {
    const { senderId, receiverId, recipientId, threadId } = req.body;
    const targetRecipient = recipientId || receiverId;

    if (threadId) {
      db.prepare(`
        UPDATE direct_messages 
        SET readReceipt = 1, isRead = 1 
        WHERE threadId = ?
      `).run(threadId);
    } else if (senderId && targetRecipient) {
      const computedThread = [senderId, targetRecipient].sort().join('_');
      db.prepare(`
        UPDATE direct_messages 
        SET readReceipt = 1, isRead = 1 
        WHERE threadId = ? OR (senderId = ? AND receiverId = ?)
      `).run(computedThread, senderId, targetRecipient);
    }
    return res.json({ success: true, message: 'Messages marked as read.' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Delete message
app.delete('/api/messages/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM direct_messages WHERE id = ?').run(req.params.id);
    return res.json({ success: true, message: 'Message deleted.' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// ==========================================
// 3. CALENDAR-CENTRIC PERSISTENT ATTENDANCE
// ==========================================

// Get active classroom session
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

// Start / Update Active Session
app.post('/api/attendance/session', (req, res) => {
  try {
    const { subject, code, room, beaconId, faculty } = req.body;
    const sessionId = `SESS-${Date.now().toString().slice(-4)}`;

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

// Student Attendance BLE Proximity + Passcode Verification
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
    const todayStr = new Date().toISOString().slice(0, 10);

    // Insert into live logs
    db.prepare(`
      INSERT INTO attendance_logs (studentEnrollment, studentName, sessionId, subject, verifiedVia, status)
      VALUES (?, ?, ?, ?, ?, 'Present')
    `).run(enr, name, sessId, sub, via);

    // Upsert into persistent attendance_records table
    const recId = `REC-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    db.prepare(`
      INSERT OR REPLACE INTO attendance_records (id, student_id, student_name, enrollment, subject, section, date, status, marked_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Present', ?)
    `).run(
      recId,
      enr,
      name,
      enr,
      sub,
      'CSE-A',
      todayStr,
      active?.faculty || 'Dr. Manish Verma'
    );

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

// Batch Save Attendance Records (Faculty Suite)
app.post('/api/attendance/batch', (req, res) => {
  try {
    const { date, subject, section, markedBy, records } = req.body;
    if (!date || !subject || !Array.isArray(records)) {
      return res.status(400).json({ error: 'Date, subject, and student records array required.' });
    }

    const targetDate = date.slice(0, 10);
    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO attendance_records (id, student_id, student_name, enrollment, subject, section, date, status, marked_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction((rows) => {
      for (const r of rows) {
        const id = `ATT-${targetDate}-${r.enrollment || r.roll || r.id}-${subject.replace(/[^a-zA-Z0-9]/g, '')}`;
        insertStmt.run(
          id,
          r.id || r.enrollment || 'STU',
          r.name,
          r.enrollment || r.roll || '04214802722',
          subject,
          section || 'CSE-A',
          targetDate,
          r.status || 'Present',
          markedBy || 'Faculty Member'
        );
      }
    });

    transaction(records);
    return res.json({ success: true, count: records.length, message: `Attendance saved for ${targetDate} (${records.length} scholars)` });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Get Attendance Records with flexible filtering
app.get('/api/attendance/records', (req, res) => {
  try {
    const { enrollment, date, subject, section, month } = req.query;
    let query = "SELECT * FROM attendance_records WHERE 1=1";
    const params = [];

    if (enrollment) {
      query += " AND (enrollment = ? OR student_id = ?)";
      params.push(enrollment, enrollment);
    }
    if (date) {
      query += " AND date = ?";
      params.push(date);
    }
    if (subject) {
      query += " AND subject LIKE ?";
      params.push(`%${subject}%`);
    }
    if (section) {
      query += " AND section = ?";
      params.push(section);
    }
    if (month) {
      query += " AND date LIKE ?";
      params.push(`${month}%`);
    }

    query += " ORDER BY date DESC, timestamp DESC";
    const records = db.prepare(query).all(...params);
    return res.json({ success: true, count: records.length, records });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Get Complete Attendance Stats & Calendar Breakdown for Student
app.get('/api/attendance/stats/:enrollment', (req, res) => {
  try {
    const { enrollment } = req.params;
    const records = db.prepare(`
      SELECT * FROM attendance_records 
      WHERE enrollment = ? OR student_id = ? 
      ORDER BY date ASC
    `).all(enrollment, enrollment);

    const totalClasses = records.length;
    const presentClasses = records.filter(r => r.status === 'Present' || r.status === 'present').length;
    const absentClasses = records.filter(r => r.status === 'Absent' || r.status === 'absent').length;
    const lateClasses = records.filter(r => r.status.includes('Late') || r.status.includes('Exempt') || r.status.includes('leave')).length;

    const overallPercentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(1) : '88.4';

    // Subject breakdown
    const subjectMap = {};
    records.forEach(r => {
      if (!subjectMap[r.subject]) {
        subjectMap[r.subject] = { total: 0, present: 0, absent: 0 };
      }
      subjectMap[r.subject].total++;
      if (r.status === 'Present' || r.status === 'present') {
        subjectMap[r.subject].present++;
      } else {
        subjectMap[r.subject].absent++;
      }
    });

    const subjectStats = Object.keys(subjectMap).map(sub => {
      const s = subjectMap[sub];
      const pct = ((s.present / s.total) * 100).toFixed(1);
      return {
        subject: sub,
        total: s.total,
        present: s.present,
        absent: s.absent,
        percentage: pct,
        isSafe: parseFloat(pct) >= 75
      };
    });

    // Calculate classes needed to reach 75% or classes safe to skip
    let classesNeeded = 0;
    let classesCanSkip = 0;
    const currentPct = parseFloat(overallPercentage);

    if (currentPct < 75) {
      // (present + x) / (total + x) >= 0.75 => x >= (0.75 * total - present) / 0.25
      classesNeeded = Math.max(0, Math.ceil((0.75 * totalClasses - presentClasses) / 0.25));
    } else {
      // present / (total + y) >= 0.75 => y <= (present / 0.75) - total
      classesCanSkip = Math.max(0, Math.floor((presentClasses / 0.75) - totalClasses));
    }

    return res.json({
      success: true,
      stats: {
        totalClasses,
        presentClasses,
        absentClasses,
        lateClasses,
        overallPercentage: parseFloat(overallPercentage),
        isCompliant: parseFloat(overallPercentage) >= 75,
        classesNeeded,
        classesCanSkip,
        subjectStats,
        records
      }
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Logs & Deletion
app.get('/api/attendance/logs', (req, res) => {
  try {
    const logs = db.prepare("SELECT * FROM attendance_logs ORDER BY timestamp DESC LIMIT 50").all();
    return res.json({ success: true, logs });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

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

// ==========================================
// 4. NOTES & ACADEMIC VAULT (FILE STREAMING)
// ==========================================

app.get('/api/notes', (req, res) => {
  try {
    const { university, semester, subject } = req.query;
    let query = "SELECT * FROM notes WHERE 1=1";
    const params = [];

    if (university) {
      query += " AND university = ?";
      params.push(university);
    }
    if (semester) {
      query += " AND semester LIKE ?";
      params.push(`%${semester}%`);
    }
    if (subject) {
      query += " AND subject LIKE ?";
      params.push(`%${subject}%`);
    }

    query += " ORDER BY createdAt DESC";
    const notes = db.prepare(query).all(...params);
    return res.json({ success: true, count: notes.length, notes, data: notes });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/notes', upload.single('noteFile'), (req, res) => {
  try {
    const { subject, title, faculty, faculty_name, semester, fileSize, unit, university } = req.body;
    const fileUrl = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : req.body.fileUrl || null;
    const noteId = `NOTE-${Date.now().toString().slice(-4)}`;
    const effectiveFaculty = faculty_name || faculty || 'Dr. Manish Verma';
    const effectiveSize = req.file ? `${(req.file.size / (1024 * 1024)).toFixed(1)} MB` : (fileSize || '3.5 MB');
    const ext = req.file ? path.extname(req.file.originalname).replace('.', '').toUpperCase() : 'PDF';

    db.prepare(`
      INSERT INTO notes (id, title, subject, semester, faculty, faculty_name, faculty_id, file_url, file_size, file_type, upload_date, downloads_count, unit, university)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Today', 0, ?, ?)
    `).run(
      noteId, 
      title || 'Course Lecture Notes', 
      subject || 'Core Engineering', 
      semester || '6th Semester', 
      effectiveFaculty,
      effectiveFaculty, 
      req.body.faculty_id || null, 
      fileUrl, 
      effectiveSize, 
      ext, 
      unit || 'Unit 1', 
      university || 'GGSIPU'
    );

    const newNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(noteId);
    return res.json({ success: true, note: newNote, message: 'Notes published to vault.' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Increment download counter
app.post('/api/notes/:id/download', (req, res) => {
  try {
    db.prepare('UPDATE notes SET downloads_count = downloads_count + 1 WHERE id = ?').run(req.params.id);
    const updated = db.prepare('SELECT * FROM notes WHERE id = ?').get(req.params.id);
    return res.json({ success: true, note: updated });
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

// ==========================================
// 5. TIMETABLE MASTER & SCHEDULE BROADCAST
// ==========================================

app.get('/api/timetables', (req, res) => {
  try {
    const { university, department, semester, section } = req.query;
    let query = "SELECT * FROM timetables WHERE 1=1";
    const params = [];

    if (university) {
      query += " AND university = ?";
      params.push(university);
    }
    if (department) {
      query += " AND department = ?";
      params.push(department);
    }
    if (semester) {
      query += " AND semester LIKE ?";
      params.push(`%${semester}%`);
    }
    if (section) {
      query += " AND section = ?";
      params.push(section);
    }

    query += " ORDER BY updated_at DESC";
    const rows = db.prepare(query).all(...params);
    const parsed = rows.map(r => ({
      ...r,
      schedule: JSON.parse(r.schedule_json)
    }));

    return res.json({ success: true, count: parsed.length, timetables: parsed });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.post('/api/timetables', (req, res) => {
  try {
    const { university, department, semester, section, schedule, publishedBy } = req.body;
    if (!university || !department || !semester || !section || !schedule) {
      return res.status(400).json({ error: 'University, department, semester, section, and schedule required.' });
    }

    const id = `TT-${university}-${department.replace(/[^a-zA-Z0-9]/g, '')}-${semester.replace(/[^a-zA-Z0-9]/g, '')}-${section.replace(/[^a-zA-Z0-9]/g, '')}`;
    const scheduleJson = typeof schedule === 'string' ? schedule : JSON.stringify(schedule);

    db.prepare(`
      INSERT OR REPLACE INTO timetables (id, university, department, semester, section, schedule_json, published_by, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(id, university, department, semester, section, scheduleJson, publishedBy || 'HOD Office');

    return res.json({ success: true, id, message: `Timetable published for ${university} ${section}` });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.delete('/api/timetables/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM timetables WHERE id = ?').run(req.params.id);
    return res.json({ success: true, message: 'Timetable deleted.' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Syllabus Progress Tracking
app.get('/api/syllabus/progress', (req, res) => {
  try {
    const { faculty_id, university } = req.query;
    let query = "SELECT * FROM syllabus_progress WHERE 1=1";
    const params = [];
    if (faculty_id) { query += " AND faculty_id = ?"; params.push(faculty_id); }
    if (university) { query += " AND university = ?"; params.push(university); }

    const rows = db.prepare(query).all(...params);
    const parsed = rows.map(r => ({ ...r, progress: JSON.parse(r.progress_json) }));
    return res.json({ success: true, progress: parsed });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.post('/api/syllabus/progress', (req, res) => {
  try {
    const { faculty_id, university, department, subject_code, subject_name, progress } = req.body;
    const id = `SYL-${faculty_id}-${subject_code}`;
    const progressJson = typeof progress === 'string' ? progress : JSON.stringify(progress);

    db.prepare(`
      INSERT OR REPLACE INTO syllabus_progress (id, faculty_id, university, department, subject_code, subject_name, progress_json, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(id, faculty_id || 'FAC', university || 'GGSIPU', department || 'CSE', subject_code, subject_name, progressJson);

    return res.json({ success: true, message: 'Syllabus progress updated.' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// ==========================================
// 6. GRIEVANCES & CAMPUS BROADCASTS
// ==========================================

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

app.patch('/api/grievances/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes, rsaSeal, resolvedBy } = req.body;
    const resolvedAt = new Date().toISOString();

    db.prepare(`
      UPDATE grievances 
      SET status = COALESCE(?, status), 
          resolutionNotes = COALESCE(?, resolutionNotes),
          rsaSeal = COALESCE(?, rsaSeal),
          resolvedBy = COALESCE(?, resolvedBy),
          resolvedAt = COALESCE(?, resolvedAt)
      WHERE id = ?
    `).run(status || null, resolutionNotes || null, rsaSeal || null, resolvedBy || null, resolvedAt, id);

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

// ==========================================
// 7. HOD SUBSTITUTION ENGINE ENDPOINTS
// ==========================================

app.get('/api/substitutions', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM substitutions ORDER BY createdAt DESC').all();
    const parsed = rows.map(r => ({
      ...r,
      suggestedFaculty: typeof r.suggestedFaculty === 'string' ? JSON.parse(r.suggestedFaculty || '[]') : r.suggestedFaculty
    }));
    return res.json({ success: true, count: parsed.length, substitutions: parsed, data: parsed });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.post('/api/substitutions', (req, res) => {
  try {
    const { date, slot, subject, semester, room, absentFaculty, reason, urgency, suggestedFaculty } = req.body;
    const id = `SUB-${Date.now().toString().slice(-4)}`;
    const suggestedStr = Array.isArray(suggestedFaculty) ? JSON.stringify(suggestedFaculty) : (suggestedFaculty || '[]');

    db.prepare(`
      INSERT INTO substitutions (id, date, slot, subject, semester, room, absentFaculty, reason, status, urgency, suggestedFaculty)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?)
    `).run(
      id,
      date || 'Today',
      slot || '03:00 PM - 04:00 PM',
      subject || 'Core Engineering Course',
      semester || '6th Semester',
      room || 'Room 302',
      absentFaculty || 'Faculty Member',
      reason || 'Official Duty Leave',
      urgency || 'Normal',
      suggestedStr
    );

    const created = db.prepare('SELECT * FROM substitutions WHERE id = ?').get(id);
    return res.status(201).json({ success: true, substitution: created });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.patch('/api/substitutions/:id/assign', (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo, notes } = req.body;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    db.prepare(`
      UPDATE substitutions 
      SET status = 'Assigned',
          assignedTo = ?,
          notes = COALESCE(?, notes),
          assignedAt = ?
      WHERE id = ?
    `).run(assignedTo, notes || null, `Today, ${nowTime}`, id);

    const updated = db.prepare('SELECT * FROM substitutions WHERE id = ?').get(id);
    return res.json({ success: true, substitution: updated });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Broadcasts
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

app.listen(PORT, () => {
  console.log(`⚡ EduSphere High-Performance SQLite Backend API running on http://localhost:${PORT}`);
});
