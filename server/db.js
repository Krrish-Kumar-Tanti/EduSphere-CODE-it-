import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'edusphere.db');
const db = new Database(dbPath);

// Enable WAL mode & foreign keys
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize Database Tables
export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      role TEXT NOT NULL,
      enrollment TEXT,
      college TEXT DEFAULT 'Apex Institute of Technology & Management',
      department TEXT DEFAULT 'Computer Science & Engineering (CSE)',
      semester TEXT DEFAULT '6th Semester (Year 3)',
      section TEXT DEFAULT 'CSE-A',
      bloodGroup TEXT DEFAULT 'O+ positive',
      validUpto TEXT DEFAULT 'June 2026',
      avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      password TEXT NOT NULL,
      cgpa TEXT DEFAULT '8.92',
      attendanceOverall REAL DEFAULT 88.4,
      designation TEXT,
      subjects TEXT,
      cabin TEXT,
      assignedUnit TEXT,
      supervisorLevel TEXT,
      adminCode TEXT,
      badgeId TEXT,
      digitalSignature TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS attendance_sessions (
      id TEXT PRIMARY KEY,
      subject TEXT NOT NULL,
      code TEXT NOT NULL,
      room TEXT NOT NULL,
      beaconId TEXT NOT NULL,
      faculty TEXT NOT NULL,
      startTime DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'active'
    );

    CREATE TABLE IF NOT EXISTS attendance_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      studentEnrollment TEXT NOT NULL,
      studentName TEXT NOT NULL,
      sessionId TEXT NOT NULL,
      subject TEXT NOT NULL,
      verifiedVia TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'Present'
    );

    CREATE TABLE IF NOT EXISTS attendance_records (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      subject TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      verifiedVia TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS grievances (
      id TEXT PRIMARY KEY,
      userId TEXT,
      studentName TEXT NOT NULL,
      studentEnrollment TEXT NOT NULL,
      isAnonymous INTEGER DEFAULT 0,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      destination TEXT NOT NULL,
      priority TEXT NOT NULL,
      description TEXT NOT NULL,
      imageUrl TEXT,
      status TEXT DEFAULT 'In-Progress',
      assignedTo TEXT NOT NULL,
      timestamp TEXT DEFAULT 'Today',
      resolutionNotes TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      subject TEXT NOT NULL,
      title TEXT NOT NULL,
      faculty TEXT NOT NULL,
      fileSize TEXT NOT NULL,
      semester TEXT NOT NULL,
      fileUrl TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS broadcasts (
      id TEXT PRIMARY KEY,
      sender TEXT NOT NULL,
      role TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      time TEXT NOT NULL,
      isUrgent INTEGER DEFAULT 0,
      targetAudience TEXT DEFAULT 'All Campus',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS colleges (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      affiliation TEXT DEFAULT 'Affiliated Higher Education Institute Network',
      programs TEXT NOT NULL,
      grade TEXT
    );
  `);

  // Migration column additions in case table already exists
  const userTableInfo = db.prepare("PRAGMA table_info(users)").all();
  const userCols = userTableInfo.map(c => c.name);

  const newCols = [
    { name: 'designation', type: 'TEXT' },
    { name: 'subjects', type: 'TEXT' },
    { name: 'cabin', type: 'TEXT' },
    { name: 'assignedUnit', type: 'TEXT' },
    { name: 'supervisorLevel', type: 'TEXT' },
    { name: 'adminCode', type: 'TEXT' },
    { name: 'badgeId', type: 'TEXT' },
    { name: 'digitalSignature', type: 'TEXT' },
  ];

  for (const col of newCols) {
    if (!userCols.includes(col.name)) {
      try {
        db.prepare(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`).run();
      } catch (e) {
        // column may exist
      }
    }
  }

  const grvTableInfo = db.prepare("PRAGMA table_info(grievances)").all();
  const grvCols = grvTableInfo.map(c => c.name);
  if (!grvCols.includes('resolutionNotes')) {
    try {
      db.prepare(`ALTER TABLE grievances ADD COLUMN resolutionNotes TEXT`).run();
    } catch (e) {}
  }

  const bcTableInfo = db.prepare("PRAGMA table_info(broadcasts)").all();
  const bcCols = bcTableInfo.map(c => c.name);
  if (!bcCols.includes('targetAudience')) {
    try {
      db.prepare(`ALTER TABLE broadcasts ADD COLUMN targetAudience TEXT DEFAULT 'All Campus'`).run();
    } catch (e) {}
  }

  // Seed default users if empty
  const userCount = db.prepare('SELECT count(*) as count FROM users').get().count;
  if (userCount === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (
        id, name, email, role, enrollment, college, department, semester, section, 
        bloodGroup, validUpto, avatar, password, cgpa, attendanceOverall,
        designation, subjects, cabin, assignedUnit, supervisorLevel, adminCode, badgeId, digitalSignature
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Student
    insertUser.run(
      'STU-2026-8842',
      'Krrish Kumar Tanti',
      'krrish.tanti@campus.edu',
      'student',
      '04214802722',
      'Apex Institute of Technology & Management',
      'Computer Science & Engineering (CSE)',
      '6th Semester (Year 3)',
      'CSE-A',
      'O+ positive',
      'June 2026',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      'krrish@2026',
      '8.92',
      88.4,
      'Student Scholar',
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );

    // Faculty
    insertUser.run(
      'FAC-1092',
      'Dr. Manish Verma',
      'manish.verma@campus.edu',
      'teacher',
      'FAC-1092',
      'Apex Institute of Technology & Management',
      'Computer Science & Engineering (CSE)',
      'Faculty',
      'CSE-A',
      'B+ positive',
      'Permanent',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      'faculty@2026',
      'N/A',
      100,
      'Associate Professor',
      'Operating Systems, Cloud Computing, Computer Networks',
      'Room 304, Academic Block A',
      null,
      null,
      null,
      'FAC-1092',
      null
    );

    // HOD
    insertUser.run(
      'HOD-001',
      'Prof. S. K. Naitik',
      'hod.cse@campus.edu',
      'hod',
      'HOD-001',
      'Apex Institute of Technology & Management',
      'Department of Computer Science & Engineering',
      'HOD Office',
      'All Sections',
      'A+ positive',
      'Permanent',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      'hod@admin2026',
      'N/A',
      100,
      'Head of Department & Professor',
      'Cloud Architecture, Advanced AI',
      'Room 101, Executive Wing',
      null,
      null,
      'HOD-001',
      'HOD-CSE-CHAIR',
      'RSA-SEAL-HOD-CSE-VALID'
    );

    // Ground Staff
    insertUser.run(
      'STF-504',
      'Rajesh Sharma',
      'rajesh.facilities@campus.edu',
      'staff',
      'STF-504',
      'Apex Institute of Technology & Management',
      'Ground Operations & Maintenance',
      'Staff',
      'Campus Wide',
      'AB+ positive',
      'Permanent',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
      'staff@ops2026',
      'N/A',
      100,
      'Facilities Lead Supervisor',
      null,
      'Operations Control Room 04',
      'Maintenance, Electrical & Sanitation',
      'Lead Operations Supervisor',
      null,
      'STF-504',
      null
    );

    // Initial Active Attendance Session
    const insertSession = db.prepare(`
      INSERT INTO attendance_sessions (id, subject, code, room, beaconId, faculty, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    insertSession.run(
      'SESS-LIVE-01',
      'Operating Systems Lab (CSE-301)',
      'OS42',
      'Lab 204, Block A',
      'BLE_BEACON_CSE_LAB_204',
      'Dr. Manish Verma',
      'active'
    );

    // Initial attendance logs
    const insertAtt = db.prepare(`
      INSERT INTO attendance_records (id, userId, subject, date, status, verifiedVia)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertAtt.run('ATT-01', 'STU-2026-8842', 'Operating Systems Lab', 'Today, 02:15 PM', 'Present', 'BLE Beacon + Passcode');
    insertAtt.run('ATT-02', 'STU-2026-8842', 'Computer Networks', 'Yesterday, 11:30 AM', 'Present', 'BLE Proximity');
    insertAtt.run('ATT-03', 'STU-2026-8842', 'Cloud Computing Architecture', '20 Aug 2026', 'Present', 'Dynamic PIN');
    insertAtt.run('ATT-04', 'STU-2026-8842', 'Software Engineering Seminar', '19 Aug 2026', 'Present', 'BLE Beacon');

    // Initial Grievances
    const insertGrv = db.prepare(`
      INSERT INTO grievances (id, userId, studentName, studentEnrollment, isAnonymous, title, category, destination, priority, description, imageUrl, status, assignedTo, timestamp, resolutionNotes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertGrv.run(
      'GRV-8491',
      'STU-2026-8842',
      'Krrish Kumar Tanti',
      '04214802722',
      0,
      'Lab 204 Air Conditioner Not Functioning',
      'Maintenance & Infrastructure',
      'staff',
      'High',
      'The central AC unit in CSE Lab 204 has been tripping the circuit breaker during heavy GPU workloads.',
      null,
      'In-Progress',
      'Facilities Team (Rajesh Sharma)',
      'Today, 10:30 AM',
      null
    );

    insertGrv.run(
      'GRV-9204',
      'STU-2026-8842',
      'Anonymous Scholar',
      'REDACTED-PRIVACY-SHIELD',
      1,
      'Mid-Term Exam Evaluation Transparency',
      'Academic Concern & Syllabus Pace',
      'hod',
      'Urgent',
      'Requesting re-moderation of question 4 in Cloud Computing unit test for section CSE-A.',
      null,
      'Under Review',
      'HOD Academic Office (Prof. S. K. Naitik)',
      'Yesterday, 04:12 PM',
      null
    );

    // Initial Notes
    const insertNote = db.prepare(`
      INSERT INTO notes (id, subject, title, faculty, fileSize, semester, fileUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertNote.run('NOTE-01', 'Operating Systems', 'Unit 3: Virtual Memory & Page Replacement Algorithms.pdf', 'Dr. Manish Verma', '4.2 MB', '6th Semester', '#');
    insertNote.run('NOTE-02', 'Computer Networks', 'Module 4: TCP Congestion Control & Sliding Window Protocol.pdf', 'Prof. Priya Nair', '3.1 MB', '6th Semester', '#');
    insertNote.run('NOTE-03', 'Cloud Computing', 'Lab Manual: AWS Lambda & Docker Containerization Walkthrough.pdf', 'Dr. Manish Verma', '8.5 MB', '6th Semester', '#');
    insertNote.run('NOTE-04', 'Software Engineering', 'Agile Scrum Sprint Planning & Design Patterns Reference.pdf', 'Prof. Arun Kumar', '2.8 MB', '6th Semester', '#');

    // Initial Broadcasts
    const insertBc = db.prepare(`
      INSERT INTO broadcasts (id, sender, role, title, message, time, isUrgent, targetAudience)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertBc.run('BC-01', 'Prof. S. K. Naitik (HOD CSE)', 'HOD', '🚨 Mid-Term Practical Exam Schedule Released', 'All 6th-semester students must carry their digital Virtual ID cards for entry starting Monday. Zero physical paperwork required.', '25 mins ago', 1, 'CSE Department (All Semesters)');
    insertBc.run('BC-02', 'Ground Security & Operations', 'Staff', '📡 BLE Beacon Calibration at Block 3', 'Proximity beacons in Labs 301-305 upgraded to smart ultra-low latency mesh.', '2 hours ago', 0, 'All Campus Students');
  }

  // Seed Colleges if empty
  const collegeCount = db.prepare('SELECT count(*) as count FROM colleges').get().count;
  if (collegeCount === 0) {
    const insertCollege = db.prepare(`
      INSERT INTO colleges (id, code, name, location, programs, grade)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const standardColleges = [
      ['1', '101', 'Apex Institute of Technology & Management (AITM)', 'Academic City, Main Campus', 'B.Tech, M.Tech, MBA, MCA', 'NAAC A++'],
      ['2', '102', 'Metro College of Engineering & Research', 'Sector 18, Innovation Hub', 'B.Tech, MBA, BCA', 'NAAC A+'],
      ['3', '103', 'National Institute of Technical Sciences (NITS)', 'Knowledge Boulevard, Block 4', 'B.Tech, M.Tech, PhD', 'NAAC A++'],
      ['4', '104', 'City University School of Computing & Robotics', 'Campus Central Avenue', 'B.Tech/M.Tech Integrated, MCA', 'NAAC A+'],
      ['5', '105', 'Royal Academy of Engineering & Technology', 'Hill View Campus', 'B.Tech, BBA, BCA', 'NAAC A'],
      ['6', '106', 'Premier Institute of Professional Studies', 'University Enclave', 'BCA, MCA, BBA, MBA', 'NAAC A+'],
      ['7', '107', 'Federal Engineering & Technological Campus', 'Tech City Phase 2', 'B.Tech, Artificial Intelligence', 'NAAC A++']
    ];

    for (const col of standardColleges) {
      insertCollege.run(...col);
    }
  }
}

export default db;
