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
      enrollment TEXT UNIQUE,
      college TEXT DEFAULT 'ADGITM (Dr. Akhilesh Das Gupta Institute of Technology & Management)',
      department TEXT DEFAULT 'Computer Science & Engineering (CSE)',
      semester TEXT DEFAULT '6th Semester (Year 3)',
      section TEXT DEFAULT 'CSE-A',
      bloodGroup TEXT DEFAULT 'O+ positive',
      validUpto TEXT DEFAULT 'June 2026',
      avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      password TEXT NOT NULL,
      cgpa TEXT DEFAULT '8.92',
      attendanceOverall REAL DEFAULT 88.4,
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
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS colleges (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      affiliation TEXT DEFAULT 'Guru Gobind Singh Indraprastha University (GGSIPU)',
      programs TEXT NOT NULL,
      grade TEXT
    );
  `);

  // Seed default users if empty
  const userCount = db.prepare('SELECT count(*) as count FROM users').get().count;
  if (userCount === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, role, enrollment, college, department, semester, section, bloodGroup, validUpto, avatar, password, cgpa, attendanceOverall)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertUser.run(
      'STU-2026-8842',
      'Krrish Kumar Tanti',
      'krrish.tanti@adgitm.ac.in',
      'student',
      '04214802722',
      'ADGITM (Dr. Akhilesh Das Gupta Institute of Technology & Management)',
      'Computer Science & Engineering (CSE)',
      '6th Semester (Year 3)',
      'CSE-A',
      'O+ positive',
      'June 2026',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      'krrish@2026',
      '8.92',
      88.4
    );

    insertUser.run(
      'FAC-1092',
      'Dr. Manish Verma',
      'manish.verma@adgitm.ac.in',
      'teacher',
      'FAC-1092',
      'ADGITM (Dr. Akhilesh Das Gupta Institute of Technology & Management)',
      'Computer Science & Engineering (CSE)',
      'Faculty',
      'CSE-A',
      'B+ positive',
      'Permanent',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      'faculty@2026',
      'N/A',
      100
    );

    insertUser.run(
      'HOD-001',
      'Prof. S. K. Naitik',
      'hod.cse@adgitm.ac.in',
      'hod',
      'HOD-001',
      'ADGITM (Dr. Akhilesh Das Gupta Institute of Technology & Management)',
      'Department of Computer Science',
      'HOD Office',
      'All',
      'A+ positive',
      'Permanent',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      'hod@admin2026',
      'N/A',
      100
    );

    insertUser.run(
      'STF-504',
      'Rajesh Sharma',
      'rajesh.facilities@adgitm.ac.in',
      'staff',
      'STF-504',
      'ADGITM (Dr. Akhilesh Das Gupta Institute of Technology & Management)',
      'Ground Operations & Maintenance',
      'Staff',
      'Campus',
      'AB+ positive',
      'Permanent',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
      'staff@ops2026',
      'N/A',
      100
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
      INSERT INTO grievances (id, userId, studentName, studentEnrollment, isAnonymous, title, category, destination, priority, description, imageUrl, status, assignedTo, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      'Today, 10:30 AM'
    );

    insertGrv.run(
      'GRV-9204',
      'STU-2026-8842',
      'Anonymous Scholar',
      'REDACTED-PRIVACY-SHIELD',
      1,
      'Mid-Term Exam Evaluation Transparency',
      'Faculty Grading Retaliation / Discrepancy',
      'hod',
      'Urgent',
      'Requesting re-moderation of question 4 in Cloud Computing unit test for section CSE-A.',
      null,
      'Under Review',
      'HOD Academic Office (Prof. S. K. Naitik)',
      'Yesterday, 04:12 PM'
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
      INSERT INTO broadcasts (id, sender, role, title, message, time, isUrgent)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertBc.run('BC-01', 'HOD Office (CSE)', 'HOD', '🚨 Mid-Term Practical Exam Schedule Released', 'All 6th-semester students must carry their digital Virtual ID cards for entry starting Monday. Zero physical paperwork required.', '25 mins ago', 1);
    insertBc.run('BC-02', 'Ground Security & Operations', 'Staff', '📡 BLE Beacon Calibration at Block 3', 'Proximity beacons in Labs 301-305 upgraded to smart ultra-low latency mesh.', '2 hours ago', 0);
  }

  // Seed Colleges
  const collegeCount = db.prepare('SELECT count(*) as count FROM colleges').get().count;
  if (collegeCount === 0) {
    const insertCollege = db.prepare(`
      INSERT INTO colleges (id, code, name, location, programs, grade)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const ggsipuColleges = [
      ['1', '156', 'Dr. Akhilesh Das Gupta Institute of Technology & Management (ADGITM)', 'FC-26, Shastri Park, New Delhi', 'B.Tech, MBA, BBA, BCA, LLB', 'NAAC A+'],
      ['2', '148', 'Maharaja Agrasen Institute of Technology (MAIT)', 'PSP Area, Rohini Sector 22, New Delhi', 'B.Tech, MBA', 'NAAC A'],
      ['3', '149', 'Maharaja Surajmal Institute of Technology (MSIT)', 'C-4, Janakpuri, New Delhi', 'B.Tech, BCA, BBA', 'NAAC A+'],
      ['4', '115', 'Bharati Vidyapeeth\'s College of Engineering (BVCOE)', 'A-4, Paschim Vihar, New Delhi', 'B.Tech, M.Tech', 'NAAC A'],
      ['5', '164', 'University School of Information, Communication and Technology (USICT)', 'Sector 16C, Dwarka, New Delhi', 'B.Tech/M.Tech Integrated, MCA', 'NAAC A++'],
      ['6', '208', 'Bhagwan Parshuram Institute of Technology (BPIT)', 'PSP-4, Rohini Sector 17, New Delhi', 'B.Tech, MBA, BBA', 'NAAC A'],
      ['7', '132', 'Guru Tegh Bahadur Institute of Technology (GTBIT)', 'G-8 Area, Rajouri Garden, New Delhi', 'B.Tech', 'NAAC A'],
      ['8', '177', 'Vivekananda Institute of Professional Studies (VIPS)', 'AU Block, Pitampura, New Delhi', 'BCA, MCA, BBA, BALLB, BJMC', 'NAAC A++'],
      ['9', '140', 'Jagan Institute of Management Studies (JIMS)', 'Sector 5, Rohini, New Delhi', 'BBA, BCA, MCA', 'NAAC A']
    ];

    for (const col of ggsipuColleges) {
      insertCollege.run(...col);
    }
  }
}

export default db;
