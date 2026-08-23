import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'edusphere.db');
const db = new Database(dbPath);

// Enable WAL mode & foreign keys for high performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize Database Tables & Migrations
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
      university TEXT DEFAULT 'GGSIPU',
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
      student_id TEXT NOT NULL,
      student_name TEXT NOT NULL,
      enrollment TEXT NOT NULL,
      subject TEXT NOT NULL,
      section TEXT DEFAULT 'CSE-A',
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      marked_by TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
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
      title TEXT NOT NULL,
      subject TEXT NOT NULL,
      semester TEXT NOT NULL,
      faculty_name TEXT NOT NULL,
      faculty_id TEXT,
      file_url TEXT,
      file_size TEXT NOT NULL,
      file_type TEXT DEFAULT 'PDF',
      upload_date TEXT DEFAULT 'Today',
      downloads_count INTEGER DEFAULT 0,
      unit TEXT DEFAULT 'Unit 1',
      university TEXT DEFAULT 'GGSIPU',
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

    CREATE TABLE IF NOT EXISTS direct_messages (
      id TEXT PRIMARY KEY,
      senderId TEXT NOT NULL,
      senderName TEXT NOT NULL,
      senderRole TEXT NOT NULL,
      senderAvatar TEXT,
      receiverId TEXT NOT NULL,
      receiverName TEXT NOT NULL,
      receiverRole TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      readReceipt INTEGER DEFAULT 0,
      fileUrl TEXT,
      fileName TEXT
    );

    CREATE TABLE IF NOT EXISTS timetables (
      id TEXT PRIMARY KEY,
      university TEXT NOT NULL,
      department TEXT NOT NULL,
      semester TEXT NOT NULL,
      section TEXT NOT NULL,
      schedule_json TEXT NOT NULL,
      published_by TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS syllabus_progress (
      id TEXT PRIMARY KEY,
      faculty_id TEXT NOT NULL,
      university TEXT NOT NULL,
      department TEXT NOT NULL,
      subject_code TEXT NOT NULL,
      subject_name TEXT NOT NULL,
      progress_json TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Safe migrations for table columns
  const migrateTable = (table, cols) => {
    try {
      const existing = db.prepare(`PRAGMA table_info(${table})`).all().map(c => c.name);
      for (const col of cols) {
        if (!existing.includes(col.name)) {
          try {
            db.prepare(`ALTER TABLE ${table} ADD COLUMN ${col.name} ${col.type}`).run();
          } catch (e) {}
        }
      }
    } catch (e) {}
  };

  migrateTable('users', [
    { name: 'designation', type: 'TEXT' },
    { name: 'subjects', type: 'TEXT' },
    { name: 'cabin', type: 'TEXT' },
    { name: 'assignedUnit', type: 'TEXT' },
    { name: 'supervisorLevel', type: 'TEXT' },
    { name: 'adminCode', type: 'TEXT' },
    { name: 'badgeId', type: 'TEXT' },
    { name: 'digitalSignature', type: 'TEXT' },
    { name: 'university', type: 'TEXT DEFAULT "GGSIPU"' }
  ]);

  migrateTable('attendance_records', [
    { name: 'section', type: 'TEXT DEFAULT "CSE-A"' },
    { name: 'student_id', type: 'TEXT' },
    { name: 'student_name', type: 'TEXT' },
    { name: 'marked_by', type: 'TEXT' }
  ]);

  migrateTable('notes', [
    { name: 'faculty', type: 'TEXT DEFAULT "Dr. Manish Verma"' },
    { name: 'faculty_name', type: 'TEXT DEFAULT "Dr. Manish Verma"' },
    { name: 'faculty_id', type: 'TEXT' },
    { name: 'file_url', type: 'TEXT' },
    { name: 'file_size', type: 'TEXT DEFAULT "4.2 MB"' },
    { name: 'file_type', type: 'TEXT DEFAULT "PDF"' },
    { name: 'upload_date', type: 'TEXT DEFAULT "Today"' },
    { name: 'downloads_count', type: 'INTEGER DEFAULT 0' },
    { name: 'unit', type: 'TEXT DEFAULT "Unit 1"' },
    { name: 'university', type: 'TEXT DEFAULT "GGSIPU"' }
  ]);

  migrateTable('direct_messages', [
    { name: 'fileUrl', type: 'TEXT' },
    { name: 'fileName', type: 'TEXT' }
  ]);

  // Safe index creation
  try {
    db.prepare('CREATE INDEX IF NOT EXISTS idx_att_date_sub_sec ON attendance_records(date, subject, section)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_att_enrollment_date ON attendance_records(enrollment, date)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_msg_pair ON direct_messages(senderId, receiverId)').run();
  } catch (e) {}

  // Seed default users if missing
  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (
      id, name, email, role, enrollment, college, department, semester, section, 
      bloodGroup, validUpto, avatar, password, cgpa, attendanceOverall,
      designation, subjects, cabin, assignedUnit, supervisorLevel, adminCode, badgeId, digitalSignature, university
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

    // Student 1 (Default Student)
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
      null,
      'GGSIPU'
    );

    // Faculty 1: Dr. Manish Verma (CSE Associate Prof)
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
      'Operating Systems Lab, Cloud Computing Architecture, Computer Networks',
      'Room 304, Academic Block A',
      null,
      null,
      null,
      'FAC-1092',
      null,
      'GGSIPU'
    );

    // Faculty 2: Dr. Aditi Zear (DTU/GGSIPU OOPS)
    insertUser.run(
      'FAC-2031',
      'Dr. Aditi Zear',
      'aditi.zear@campus.edu',
      'teacher',
      'FAC-2031',
      'Delhi Technological University (DTU)',
      'Computer Science & Engineering (CSE)',
      'Faculty',
      'Section-A4',
      'A+ positive',
      'Permanent',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      'aditi@2026',
      'N/A',
      100,
      'Assistant Professor',
      'TH-CS203 Object Oriented Design, Lab CS203 OOD',
      'Room AB4-305, Academic Block 4',
      null,
      null,
      null,
      'FAC-2031',
      null,
      'DTU'
    );

    // Faculty 3: Dr. Nipun Bansal (DTU OS)
    insertUser.run(
      'FAC-2072',
      'Dr. Nipun Bansal',
      'nipun.bansal@campus.edu',
      'teacher',
      'FAC-2072',
      'Delhi Technological University (DTU)',
      'Computer Science & Engineering (CSE)',
      'Faculty',
      'Section-A4',
      'O+ positive',
      'Permanent',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      'nipun@2026',
      'N/A',
      100,
      'Associate Professor',
      'TH-CS207 OS Design, Lab CS207 Operating System',
      'Room AB4-208, Academic Block 4',
      null,
      null,
      null,
      'FAC-2072',
      null,
      'DTU'
    );

    // Faculty 4: Dr. Ravin Ahuja (DTU Software Engineering)
    insertUser.run(
      'FAC-2073',
      'Dr. Ravin Ahuja',
      'ravin.ahuja@campus.edu',
      'teacher',
      'FAC-2073',
      'Delhi Technological University (DTU)',
      'Computer Science & Engineering (CSE)',
      'Faculty',
      'Section-A4',
      'B+ positive',
      'Permanent',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
      'ravin@2026',
      'N/A',
      100,
      'Professor',
      'TH-CS207 Software Engineering',
      'Room AB4-303, Academic Block 4',
      null,
      null,
      null,
      'FAC-2073',
      null,
      'DTU'
    );

    // Faculty 5: Dr. N Anand (DTU DAA)
    insertUser.run(
      'FAC-2051',
      'Dr. N Anand',
      'n.anand@campus.edu',
      'teacher',
      'FAC-2051',
      'Delhi Technological University (DTU)',
      'Computer Science & Engineering (CSE)',
      'Faculty',
      'Section-A4',
      'AB+ positive',
      'Permanent',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
      'anand@2026',
      'N/A',
      100,
      'Associate Professor',
      'TH-CS205 Design & Analysis of Algorithm, Lab CS205 DAA',
      'Room AB4-203, Academic Block 4',
      null,
      null,
      null,
      'FAC-2051',
      null,
      'DTU'
    );

    // Faculty 6: Ms. Poonam (GGSIPU Data Structure)
    insertUser.run(
      'FAC-3011',
      'Ms. Poonam',
      'poonam.cse@campus.edu',
      'teacher',
      'FAC-3011',
      'Apex Institute of Technology & Management',
      'Computer Science & Engineering (CSE)',
      'Faculty',
      'Section-S2',
      'A+ positive',
      'Permanent',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
      'poonam@2026',
      'N/A',
      100,
      'Assistant Professor',
      'Data Structure (DS), DS Lab (Lab 5/6)',
      'Room 4202, Shastri Park Block',
      null,
      null,
      null,
      'FAC-3011',
      null,
      'GGSIPU'
    );

    // Faculty 7: Mr. Yogesh (GGSIPU Computational Methods)
    insertUser.run(
      'FAC-3091',
      'Mr. Yogesh',
      'yogesh.math@campus.edu',
      'teacher',
      'FAC-3091',
      'Apex Institute of Technology & Management',
      'Computer Science & Engineering (CSE)',
      'Faculty',
      'Section-S2',
      'O+ positive',
      'Permanent',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
      'yogesh@2026',
      'N/A',
      100,
      'Assistant Professor',
      'Computational Methods (CM), CM Lab (Lab 3/4)',
      'Room 4202, Shastri Park Block',
      null,
      null,
      null,
      'FAC-3091',
      null,
      'GGSIPU'
    );

    // Faculty 8: Dr. Swati Juneja (GGSIPU DLCD Lab)
    insertUser.run(
      'FAC-3052',
      'Dr. Swati Juneja',
      'swati.juneja@campus.edu',
      'teacher',
      'FAC-3052',
      'Apex Institute of Technology & Management',
      'Computer Science & Engineering (CSE)',
      'Faculty',
      'Section-S2',
      'B+ positive',
      'Permanent',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
      'swati@2026',
      'N/A',
      100,
      'Associate Professor',
      'DLCD Lab (Room No 5202), Digital Logic Circuits',
      'Room 5202, Shastri Park Block',
      null,
      null,
      null,
      'FAC-3052',
      null,
      'GGSIPU'
    );

    // Faculty 9: Ms. Ruchita Sareen (GGSIPU Discrete Mathematics)
    insertUser.run(
      'FAC-3071',
      'Ms. Ruchita Sareen',
      'ruchita.sareen@campus.edu',
      'teacher',
      'FAC-3071',
      'Apex Institute of Technology & Management',
      'Computer Science & Engineering (CSE)',
      'Faculty',
      'Section-S2',
      'O+ positive',
      'Permanent',
      'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=250',
      'ruchita@2026',
      'N/A',
      100,
      'Assistant Professor',
      'Discrete Mathematics (DM)',
      'Room 4202, Shastri Park Block',
      null,
      null,
      null,
      'FAC-3071',
      null,
      'GGSIPU'
    );

    // Faculty 10: Ms. Shipra (GGSIPU DLCD Theory)
    insertUser.run(
      'FAC-3051',
      'Ms. Shipra',
      'shipra.ece@campus.edu',
      'teacher',
      'FAC-3051',
      'Apex Institute of Technology & Management',
      'Computer Science & Engineering (CSE)',
      'Faculty',
      'Section-S2',
      'A+ positive',
      'Permanent',
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=250',
      'shipra@2026',
      'N/A',
      100,
      'Assistant Professor',
      'Digital Logic & Circuit Design (DLCD)',
      'Room 4202, Shastri Park Block',
      null,
      null,
      null,
      'FAC-3051',
      null,
      'GGSIPU'
    );

    // HOD 1: Prof. S. K. Naitik (Executive Console)
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
      'Cloud Architecture, Advanced AI Systems',
      'Room 101, Executive Wing',
      null,
      null,
      'HOD-001',
      'HOD-CSE-CHAIR',
      'RSA-SEAL-HOD-CSE-VALID',
      'GGSIPU'
    );

    // Staff: Rajesh Sharma
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
      'Campus Infrastructure & Maintenance',
      'Lead Operations Supervisor',
      null,
      'STF-504',
      null,
      'GGSIPU'
    );

    // Initial Active Attendance Session
    const insertSession = db.prepare(`
      INSERT OR REPLACE INTO attendance_sessions (id, subject, code, room, beaconId, faculty, status)
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

    // Initial Notes
    const insertNote = db.prepare(`
      INSERT OR REPLACE INTO notes (id, title, subject, semester, faculty, faculty_name, faculty_id, file_url, file_size, file_type, upload_date, downloads_count, unit, university)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertNote.run('NOTE-01', 'Unit 3: Virtual Memory & Page Replacement Algorithms.pdf', 'Operating Systems (CSE-301)', '6th Semester', 'Dr. Manish Verma', 'Dr. Manish Verma', 'FAC-1092', null, '4.2 MB', 'PDF', '21 Aug 2026', 142, 'Unit 3', 'GGSIPU');
    insertNote.run('NOTE-02', 'Module 4: TCP Congestion Control & Sliding Window Protocol.pdf', 'Computer Networks (CSE-303)', '6th Semester', 'Prof. Priya Nair', 'Prof. Priya Nair', 'FAC-1092', null, '3.1 MB', 'PDF', '20 Aug 2026', 98, 'Unit 4', 'GGSIPU');
    insertNote.run('NOTE-03', 'Lab Manual: AWS Lambda & Docker Containerization Walkthrough.pdf', 'Cloud Computing (CSE-305)', '6th Semester', 'Dr. Manish Verma', 'Dr. Manish Verma', 'FAC-1092', null, '8.5 MB', 'PDF', '19 Aug 2026', 215, 'Unit 2', 'GGSIPU');
    insertNote.run('NOTE-04', 'TH-CS207 OS: Process Scheduling & Deadlock Prevention.pdf', 'Operating System Design (TH-CS207)', '3rd Semester', 'Dr. Nipun Bansal', 'Dr. Nipun Bansal', 'FAC-2072', null, '5.1 MB', 'PDF', '18 Aug 2026', 188, 'Unit 2', 'DTU');
    insertNote.run('NOTE-05', 'TH-CS203 OOD: GoF Design Patterns & UML Class Diagrams.pdf', 'Object Oriented Design (TH-CS203)', '3rd Semester', 'Dr. Aditi Zear', 'Dr. Aditi Zear', 'FAC-2031', null, '6.4 MB', 'PDF', '17 Aug 2026', 204, 'Unit 3', 'DTU');

    // Initial Broadcasts
    const insertBc = db.prepare(`
      INSERT OR REPLACE INTO broadcasts (id, sender, role, title, message, time, isUrgent, targetAudience)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertBc.run('BC-01', 'Prof. S. K. Naitik (HOD CSE)', 'HOD', '🚨 Mid-Term Practical Exam Schedule Released', 'All 6th-semester and 3rd-semester students must carry their digital Virtual ID cards for entry starting Monday. Zero physical paperwork required.', '25 mins ago', 1, 'CSE Department (All Semesters)');
    insertBc.run('BC-02', 'Ground Security & Operations', 'Staff', '📡 BLE Beacon Mesh Network Active', 'Proximity beacons in Labs 201-205 calibrated to smart ultra-low latency mesh.', '2 hours ago', 0, 'All Campus Students');

    // Seed August 2026 Calendar Attendance Ledger for Student
    const insertAttRecord = db.prepare(`
      INSERT OR REPLACE INTO attendance_records (id, student_id, student_name, enrollment, subject, section, date, status, marked_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const pastDates = [
      { date: '2026-08-03', subject: 'Operating Systems Lab', status: 'Present' },
      { date: '2026-08-03', subject: 'Computer Networks', status: 'Present' },
      { date: '2026-08-04', subject: 'Cloud Computing Architecture', status: 'Present' },
      { date: '2026-08-04', subject: 'Software Engineering', status: 'Present' },
      { date: '2026-08-05', subject: 'Operating Systems Lab', status: 'Present' },
      { date: '2026-08-06', subject: 'Design & Analysis of Algorithms', status: 'Present' },
      { date: '2026-08-07', subject: 'Computer Networks', status: 'Present' },
      { date: '2026-08-10', subject: 'Operating Systems Lab', status: 'Present' },
      { date: '2026-08-11', subject: 'Cloud Computing Architecture', status: 'Absent' },
      { date: '2026-08-12', subject: 'Software Engineering', status: 'Present' },
      { date: '2026-08-13', subject: 'Design & Analysis of Algorithms', status: 'Present' },
      { date: '2026-08-14', subject: 'Computer Networks', status: 'Present' },
      { date: '2026-08-17', subject: 'Operating Systems Lab', status: 'Present' },
      { date: '2026-08-18', subject: 'Cloud Computing Architecture', status: 'Late / Exempt' },
      { date: '2026-08-19', subject: 'Software Engineering', status: 'Present' },
      { date: '2026-08-20', subject: 'Operating Systems Lab', status: 'Present' },
      { date: '2026-08-21', subject: 'Computer Networks', status: 'Present' },
      { date: '2026-08-22', subject: 'Cloud Computing Architecture', status: 'Present' },
      { date: '2026-08-23', subject: 'Operating Systems Lab', status: 'Present' }
    ];

    pastDates.forEach((rec, idx) => {
      insertAttRecord.run(
        `ATT-REC-${idx + 1}`,
        'STU-2026-8842',
        'Krrish Kumar Tanti',
        '04214802722',
        rec.subject,
        'CSE-A',
        rec.date,
        rec.status,
        'Dr. Manish Verma'
      );
    });

    // Seed Direct Messages
    const insertMsg = db.prepare(`
      INSERT OR REPLACE INTO direct_messages (id, senderId, senderName, senderRole, senderAvatar, receiverId, receiverName, receiverRole, message, readReceipt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);

    insertMsg.run(
      'MSG-001',
      'STU-2026-8842',
      'Krrish Kumar Tanti',
      'student',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      'FAC-1092',
      'Dr. Manish Verma',
      'teacher',
      'Good afternoon Dr. Verma! Regarding tomorrow’s OS Lab practical, should we bring our Docker compose memory benchmarks pre-configured?'
    );

    insertMsg.run(
      'MSG-002',
      'FAC-1092',
      'Dr. Manish Verma',
      'teacher',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      'STU-2026-8842',
      'Krrish Kumar Tanti',
      'student',
      'Hello Krrish! Yes, please have the memory management container ready. We will benchmark Banker’s algorithm live in Lab 204.'
    );

  // Seed standard colleges
  const insertCollege = db.prepare(`
    INSERT OR REPLACE INTO colleges (id, code, name, location, affiliation, programs, grade)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

    const standardColleges = [
      ['1', 'IITD', 'Indian Institute of Technology Delhi (IIT Delhi)', 'Hauz Khas, New Delhi', 'Institute of National Importance', 'B.Tech, M.Tech, PhD', 'NIRF Top 2'],
      ['2', 'DTU', 'Delhi Technological University (DTU Main Campus)', 'Bawana Road, Shahbad Daulatpur', 'State Technical University', 'B.Tech, M.Tech, PhD', 'NAAC A++'],
      ['3', 'NSUT-MAIN', 'Netaji Subhas University of Technology (NSUT Main)', 'Sector 3, Dwarka, New Delhi', 'State Technical University', 'B.Tech, M.Tech, PhD', 'NAAC A+'],
      ['4', 'IIITD', 'Indraprastha Institute of Information Technology (IIIT-Delhi)', 'Okhla Phase III, New Delhi', 'State Autonomous Institute', 'B.Tech, M.Tech, PhD', 'NAAC A'],
      ['5', 'IGDTUW', 'Indira Gandhi Delhi Technical University for Women', 'Kashmere Gate, Old Delhi', 'State Technical University', 'B.Tech, M.Tech, MCA', 'NAAC A+'],
      ['6', 'JMI-FET', 'Jamia Millia Islamia (Faculty of Engg & Tech)', 'Jamia Nagar, Okhla, New Delhi', 'Central University', 'B.Tech, M.Tech, PhD', 'NAAC A++'],
      ['7', 'DU-CIC', 'Cluster Innovation Centre, DU (CIC)', 'University Enclave, North Campus', 'Central University Centre', 'B.Tech IT & Mathematical Innovation', 'NAAC A++'],
      ['8', 'USICT', 'University School of Information & Comm Tech (USICT)', 'Sector 16C, Dwarka, New Delhi', 'University Teaching Department', 'B.Tech, M.Tech, MCA', 'NAAC A++'],
      ['9', 'MAIT', 'Maharaja Agrasen Institute of Technology (MAIT)', 'PSP Area, Sector 22, Rohini', 'Affiliated Technical Institution', 'B.Tech, MBA', 'NAAC A++'],
      ['10', 'MSIT', 'Maharaja Surajmal Institute of Technology (MSIT)', 'C-4, Janakpuri Campus', 'Affiliated Technical Institution', 'B.Tech, BCA', 'NAAC A+'],
      ['11', 'BVCOE', "Bharati Vidyapeeth's College of Engineering (BVCOE)", 'A-4, Paschim Vihar', 'Affiliated Technical Institution', 'B.Tech', 'NAAC A'],
      ['12', 'BPIT', 'Bhagwan Parshuram Institute of Technology (BPIT)', 'PSP-4, Sector 17, Rohini', 'Affiliated Technical Institution', 'B.Tech, MBA', 'NAAC A+'],
      ['13', 'ADGITM', 'Dr. Akhilesh Das Gupta Institute of Tech & Mgmt', 'FC-26, Shastri Park, New Delhi', 'Affiliated Technical Institution', 'B.Tech, MBA, MCA', 'NAAC A+'],
      ['14', 'VIPS-TC', 'Vivekananda Institute of Professional Studies (VIPS)', 'AU Block, Pitampura, New Delhi', 'Affiliated Technical Institution', 'B.Tech, BCA, MCA', 'NAAC A++'],
      ['15', 'GTBIT', 'Guru Tegh Bahadur Institute of Technology (GTBIT)', 'Rajouri Garden, New Delhi', 'Affiliated Technical Institution', 'B.Tech', 'NAAC A'],
      ['16', 'AITM', 'Apex Institute of Technology & Management (AITM)', 'Academic City, Main Campus', 'Premier Technical Campus', 'B.Tech, M.Tech, MCA', 'NAAC A++'],
      ['17', 'JEMTEC', 'JIMS Engineering Management Technical Campus', 'Knowledge Park III, Greater Noida', 'Affiliated Technical Institution', 'B.Tech, BBA, BCA', 'NAAC A']
    ];

    for (const col of standardColleges) {
      insertCollege.run(...col);
    }
}

export default db;
