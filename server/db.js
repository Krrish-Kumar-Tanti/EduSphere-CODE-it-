import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'edusphere.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar TEXT,
    enrollment TEXT,
    department TEXT,
    semester TEXT,
    section TEXT,
    cgpa TEXT,
    bloodGroup TEXT,
    validUpto TEXT
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

  CREATE TABLE IF NOT EXISTS grievances (
    id TEXT PRIMARY KEY,
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
    timestamp TEXT,
    assignedTo TEXT
  );

  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    title TEXT NOT NULL,
    faculty TEXT NOT NULL,
    semester TEXT NOT NULL,
    fileSize TEXT NOT NULL,
    fileUrl TEXT,
    uploadDate TEXT
  );

  CREATE TABLE IF NOT EXISTS broadcasts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT NOT NULL,
    isUrgent INTEGER DEFAULT 0,
    sender TEXT NOT NULL,
    targetAudience TEXT NOT NULL,
    time TEXT
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

// Seed GGSIPU College search dataset if empty
const collegeCount = db.prepare('SELECT count(*) as count FROM colleges').get();
if (collegeCount.count === 0) {
  const insertCollege = db.prepare(`
    INSERT INTO colleges (id, code, name, location, programs, grade)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const ggsipuColleges = [
    ['1', 'ADGITM', 'Dr. Akhilesh Das Gupta Institute of Technology & Management (ADGITM)', 'FC-26, Shastri Park, New Delhi', 'B.Tech, MBA, BBA, BCA, LLB', 'NAAC A+'],
    ['2', 'MAIT', 'Maharaja Agrasen Institute of Technology (MAIT)', 'PSP Area, Rohini Sector 22, New Delhi', 'B.Tech, MBA', 'NAAC A'],
    ['3', 'MSIT', 'Maharaja Surajmal Institute of Technology (MSIT)', 'C-4, Janakpuri, New Delhi', 'B.Tech, BCA, BBA', 'NAAC A+'],
    ['4', 'BVCOE', 'Bharati Vidyapeeth\'s College of Engineering (BVCOE)', 'A-4, Paschim Vihar, New Delhi', 'B.Tech, M.Tech', 'NAAC A'],
    ['5', 'USICT', 'University School of Information, Communication and Technology (USICT)', 'Sector 16C, Dwarka, New Delhi', 'B.Tech/M.Tech Integrated, MCA', 'NAAC A++'],
    ['6', 'BPIT', 'Bhagwan Parshuram Institute of Technology (BPIT)', 'PSP-4, Rohini Sector 17, New Delhi', 'B.Tech, MBA, BBA', 'NAAC A'],
    ['7', 'GTBIT', 'Guru Tegh Bahadur Institute of Technology (GTBIT)', 'G-8 Area, Rajouri Garden, New Delhi', 'B.Tech', 'NAAC A'],
    ['8', 'VIPS', 'Vivekananda Institute of Professional Studies (VIPS)', 'AU Block, Pitampura, New Delhi', 'BCA, MCA, BBA, BALLB, BJMC', 'NAAC A++'],
    ['9', 'JIMS', 'Jagan Institute of Management Studies (JIMS)', 'Sector 5, Rohini, New Delhi', 'BBA, BCA, MCA', 'NAAC A']
  ];

  for (const col of ggsipuColleges) {
    insertCollege.run(...col);
  }
}

export default db;
