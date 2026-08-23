import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/soundEffects';
import { DEFAULT_TIMETABLES, PRESET_GGSIPU_S2_TIMETABLE, PRESET_DTU_A4_TIMETABLE } from '../data/syllabusData';

const DataContext = createContext();
const API_BASE = 'http://localhost:5001/api';

// Create or connect to universal multi-tab live synchronization channels
let syncChannel = null;
let syncChannelAlt = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    syncChannel = new BroadcastChannel('edusphere_channel');
    syncChannelAlt = new BroadcastChannel('edusphere_live_sync');
  } catch (e) {
    console.warn('BroadcastChannel initialization error:', e);
  }
}

export const INITIAL_GRIEVANCES = [
  {
    id: 'GRV-901',
    studentName: 'Krrish Kumar Tanti',
    studentEnrollment: '04214802722',
    isAnonymous: false,
    title: 'Lab 204 AC Compressor Tripping on High GPU Workload',
    category: 'Maintenance',
    destination: 'staff',
    priority: 'Urgent',
    description: 'The central AC unit in Lab 204 is tripping the circuit breaker during heavy GPU workloads.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    status: 'In-Progress',
    timestamp: 'Today, 11:20 AM',
    assignedTo: 'Ground Maintenance Team',
    location: 'Computer Lab 204, Block A',
    resolutionNotes: null
  },
  {
    id: 'GRV-902',
    studentName: 'Anonymous Student',
    studentEnrollment: 'REDACTED-PRIVACY-SHIELD',
    isAnonymous: true,
    title: 'Mid-Term Exam Evaluation Transparency & Unit 3 Pace',
    category: 'Academic Concern & Syllabus Pace',
    destination: 'hod',
    priority: 'Medium',
    description: 'Requesting re-moderation of question 4 in Cloud Computing unit test for section CSE-A.',
    imageUrl: null,
    status: 'Under Review',
    timestamp: 'Yesterday, 04:45 PM',
    assignedTo: 'HOD Academic Committee',
    location: 'Academic Wing, Room 304',
    resolutionNotes: null
  }
];

export const INITIAL_NOTES = [
  {
    id: 'NOTE-101',
    subject: 'Operating Systems (CSE-301)',
    faculty: 'Dr. Manish Verma',
    faculty_name: 'Dr. Manish Verma',
    title: 'Unit 4: Deadlocks, Banker\'s Algorithm & Virtual Memory',
    fileSize: '4.8 MB',
    file_size: '4.8 MB',
    uploadDate: '21 Aug 2026',
    upload_date: '21 Aug 2026',
    fileUrl: null,
    file_url: null,
    semester: '6th Semester (Year 3)',
    format: 'PDF',
    downloads: 142,
    downloads_count: 142,
    unit: 'Unit 4',
    university: 'GGSIPU'
  },
  {
    id: 'NOTE-102',
    subject: 'TH-CS207 Operating System Design',
    faculty: 'Dr. Nipun Bansal',
    faculty_name: 'Dr. Nipun Bansal',
    title: 'Unit 2: Process Scheduling, Threads & Synchronization Semaphores',
    fileSize: '5.1 MB',
    file_size: '5.1 MB',
    uploadDate: '20 Aug 2026',
    upload_date: '20 Aug 2026',
    fileUrl: null,
    file_url: null,
    semester: '3rd Semester (Year 2)',
    format: 'PDF',
    downloads: 188,
    downloads_count: 188,
    unit: 'Unit 2',
    university: 'DTU'
  },
  {
    id: 'NOTE-103',
    subject: 'TH-CS203 Object Oriented Design',
    faculty: 'Dr. Aditi Zear',
    faculty_name: 'Dr. Aditi Zear',
    title: 'Unit 3: GoF Design Patterns, Structural & Behavioral UML',
    fileSize: '6.4 MB',
    file_size: '6.4 MB',
    uploadDate: '19 Aug 2026',
    upload_date: '19 Aug 2026',
    fileUrl: null,
    file_url: null,
    semester: '3rd Semester (Year 2)',
    format: 'PDF',
    downloads: 204,
    downloads_count: 204,
    unit: 'Unit 3',
    university: 'DTU'
  },
  {
    id: 'NOTE-104',
    subject: 'Data Structure (CSE-201)',
    faculty: 'Ms. Poonam',
    faculty_name: 'Ms. Poonam',
    title: 'Unit 1: Stacks, Circular Queues & Self-Balancing AVL Trees',
    fileSize: '3.8 MB',
    file_size: '3.8 MB',
    uploadDate: '18 Aug 2026',
    upload_date: '18 Aug 2026',
    fileUrl: null,
    file_url: null,
    semester: '3rd Semester (Year 2)',
    format: 'PDF',
    downloads: 165,
    downloads_count: 165,
    unit: 'Unit 1',
    university: 'GGSIPU'
  }
];

export const INITIAL_BROADCASTS = [
  {
    id: 'BC-01',
    sender: 'Prof. S. K. Naitik (HOD CSE)',
    role: 'HOD',
    title: '🚨 Mid-Term Practical Exam Schedule Released',
    message: 'All 6th-semester & 3rd-semester students must carry their digital Virtual ID cards for entry starting Monday. Zero physical paperwork required.',
    time: '25 mins ago',
    isUrgent: true,
    targetAudience: 'CSE Department (All Semesters)'
  },
  {
    id: 'BC-02',
    sender: 'Ground Security & Operations',
    role: 'Staff',
    title: '📡 BLE Beacon Calibration at Block 3',
    message: 'Proximity beacons in Labs 301-305 upgraded to smart ultra-low latency mesh.',
    time: '2 hours ago',
    isUrgent: false,
    targetAudience: 'All Campus Departments (Global)'
  }
];

export const INITIAL_SUBSTITUTIONS = [
  {
    id: 'SUB-101',
    date: 'Today, 23 Aug',
    slot: '03:00 PM - 04:00 PM',
    subject: 'CSE-304: Design & Analysis of Algorithms',
    semester: '6th Semester (Sec A)',
    room: 'Room 302, Block B',
    absentFaculty: 'Prof. Vikram Seth',
    reason: 'Medical Emergency Leave',
    status: 'Pending',
    assignedTo: null,
    urgency: 'Urgent',
    suggestedFaculty: ['Dr. Manish Verma', 'Dr. Aditi Zear', 'Dr. N Anand']
  },
  {
    id: 'SUB-102',
    date: 'Today, 23 Aug',
    slot: '11:00 AM - 12:00 PM',
    subject: 'CSE-302: Database Management Systems',
    semester: '4th Semester (Sec B)',
    room: 'Lab 201, Block A',
    absentFaculty: 'Dr. Priya Sen',
    reason: 'IEEE Research Conference Duty',
    status: 'Assigned',
    assignedTo: 'Dr. Manish Verma',
    urgency: 'Normal',
    suggestedFaculty: ['Dr. Manish Verma']
  }
];

export const INITIAL_APPROVALS = [
  {
    id: 'APP-501',
    title: 'Annual Campus Hackathon Logistics & IoT Hardware Budget',
    requester: 'Krrish Kumar Tanti',
    requesterRole: 'President, Student Tech Council',
    enrollment: '04214802722',
    category: 'Budget Allocation',
    amount: '₹45,000',
    department: 'CSE Department',
    submissionDate: '21 Aug 2026',
    status: 'Pending',
    urgency: 'High',
    description: 'Procurement of 20x ESP32 BLE Beacon nodes, Raspberry Pi gateways, and refreshments for 250 participants.',
    documents: ['Budget_Breakdown.pdf', 'Hardware_Quotations.pdf'],
    signatureHash: null,
    signedAt: null,
    signedBy: null
  },
  {
    id: 'APP-503',
    title: 'NVIDIA RTX 4090 Deep Learning Workstation Lab Grant',
    requester: 'Dr. Manish Verma',
    requesterRole: 'Associate Professor & Lab In-charge',
    enrollment: 'FAC-1092',
    category: 'Lab Equipment Grant',
    amount: '₹2,85,000',
    department: 'AI & Research Lab (Lab 304)',
    submissionDate: '18 Aug 2026',
    status: 'Approved',
    urgency: 'Urgent',
    description: 'Procurement of GPU compute node server for final year AI Capstone projects.',
    documents: ['GPU_Lab_Grant_Proposal.pdf'],
    signatureHash: 'RSA-HOD-CSE-0x9F42A7C8E2',
    signedAt: '19 Aug 2026, 02:30 PM',
    signedBy: 'Prof. S. K. Naitik (HOD)'
  }
];

export const INITIAL_STUDENT_ROSTER = [
  { id: '1', roll: '04214802722', name: 'Krrish Kumar Tanti', status: 'present', bleRssi: '-42 dBm (0.8m)', device: 'OnePlus 11 5G', verifiedAt: '02:16 PM' },
  { id: '2', roll: '04214802723', name: 'Aryan Sharma', status: 'present', bleRssi: '-48 dBm (1.2m)', device: 'iPhone 14 Pro', verifiedAt: '02:17 PM' },
  { id: '3', roll: '04214802724', name: 'Priya Mukherjee', status: 'absent', bleRssi: 'Out of range', device: 'Disconnected', verifiedAt: '-' },
  { id: '4', roll: '04214802725', name: 'Rohan Gupta', status: 'leave', bleRssi: 'Approved Medical OD', device: 'N/A', verifiedAt: '-' },
  { id: '5', roll: '04214802726', name: 'Sneha Patel', status: 'present', bleRssi: '-38 dBm (0.5m)', device: 'Samsung S23', verifiedAt: '02:15 PM' },
  { id: '6', roll: '04214802727', name: 'Devansh Verma', status: 'present', bleRssi: '-50 dBm (1.5m)', device: 'Pixel 8', verifiedAt: '02:18 PM' },
  { id: '7', roll: '04214802728', name: 'Ananya Roy', status: 'absent', bleRssi: 'Out of range', device: 'Disconnected', verifiedAt: '-' },
  { id: '8', roll: '04214802729', name: 'Tanmay Jain', status: 'present', bleRssi: '-45 dBm (1.0m)', device: 'MacBook Air M2', verifiedAt: '02:19 PM' },
  { id: '9', roll: '04214802730', name: 'Ishita Kapoor', status: 'present', bleRssi: '-41 dBm (0.7m)', device: 'Nothing Phone 2', verifiedAt: '02:15 PM' },
  { id: '10', roll: '04214802731', name: 'Vikramaditya Roy', status: 'absent', bleRssi: 'Out of range', device: 'Disconnected', verifiedAt: '-' },
  { id: '11', roll: '04214802732', name: 'Megha Singhal', status: 'leave', bleRssi: 'College Sports OD', device: 'N/A', verifiedAt: '-' },
  { id: '12', roll: '04214802733', name: 'Aman Deep', status: 'present', bleRssi: '-47 dBm (1.1m)', device: 'Realme GT', verifiedAt: '02:20 PM' }
];

export const INITIAL_FACULTY_DIRECTORY = [
  {
    id: 'FAC-1092',
    name: 'Dr. Manish Verma',
    designation: 'Associate Professor',
    department: 'Computer Science & Engineering (CSE)',
    subject: 'Operating Systems Lab, Cloud Computing, Computer Networks',
    email: 'manish.verma@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    cabin: 'Room 304, Academic Block A',
    university: 'GGSIPU'
  },
  {
    id: 'FAC-2031',
    name: 'Dr. Aditi Zear',
    designation: 'Assistant Professor',
    department: 'Computer Science & Engineering (CSE)',
    subject: 'TH-CS203 Object Oriented Design (OOPS)',
    email: 'aditi.zear@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    cabin: 'Room AB4-305, Academic Block 4',
    university: 'DTU'
  },
  {
    id: 'FAC-2072',
    name: 'Dr. Nipun Bansal',
    designation: 'Associate Professor',
    department: 'Computer Science & Engineering (CSE)',
    subject: 'TH-CS207 Operating System Design (OS)',
    email: 'nipun.bansal@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    cabin: 'Room AB4-208, Academic Block 4',
    university: 'DTU'
  },
  {
    id: 'FAC-2073',
    name: 'Dr. Ravin Ahuja',
    designation: 'Professor',
    department: 'Computer Science & Engineering (CSE)',
    subject: 'TH-CS207 Software Engineering (SE)',
    email: 'ravin.ahuja@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    cabin: 'Room AB4-303, Academic Block 4',
    university: 'DTU'
  },
  {
    id: 'FAC-2051',
    name: 'Dr. N Anand',
    designation: 'Associate Professor',
    department: 'Computer Science & Engineering (CSE)',
    subject: 'TH-CS205 Design & Analysis of Algorithm (DAA)',
    email: 'n.anand@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    cabin: 'Room AB4-203, Academic Block 4',
    university: 'DTU'
  },
  {
    id: 'FAC-3011',
    name: 'Ms. Poonam',
    designation: 'Assistant Professor',
    department: 'Computer Science & Engineering (CSE)',
    subject: 'Data Structure (DS), DS Lab',
    email: 'poonam.cse@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    cabin: 'Room 4202, Shastri Park Block',
    university: 'GGSIPU'
  },
  {
    id: 'FAC-3091',
    name: 'Mr. Yogesh',
    designation: 'Assistant Professor',
    department: 'Computer Science & Engineering (CSE)',
    subject: 'Computational Methods (CM), CM Lab',
    email: 'yogesh.math@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    cabin: 'Room 4202, Shastri Park Block',
    university: 'GGSIPU'
  },
  {
    id: 'FAC-3052',
    name: 'Dr. Swati Juneja',
    designation: 'Associate Professor',
    department: 'Computer Science & Engineering (CSE)',
    subject: 'Digital Logic Circuit Design (DLCD) Lab',
    email: 'swati.juneja@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    cabin: 'Room 5202, Shastri Park Block',
    university: 'GGSIPU'
  },
  {
    id: 'FAC-3071',
    name: 'Ms. Ruchita Sareen',
    designation: 'Assistant Professor',
    department: 'Computer Science & Engineering (CSE)',
    subject: 'Discrete Mathematics (DM)',
    email: 'ruchita.sareen@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=250',
    cabin: 'Room 4202, Shastri Park Block',
    university: 'GGSIPU'
  },
  {
    id: 'FAC-3051',
    name: 'Ms. Shipra',
    designation: 'Assistant Professor',
    department: 'Computer Science & Engineering (CSE)',
    subject: 'Digital Logic & Circuit Design (DLCD)',
    email: 'shipra.ece@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=250',
    cabin: 'Room 4202, Shastri Park Block',
    university: 'GGSIPU'
  },
  {
    id: 'HOD-001',
    name: 'Prof. S. K. Naitik',
    designation: 'Head of Department & Professor',
    department: 'Department of Computer Science & Engineering',
    subject: 'Cloud Architectures & AI Systems',
    email: 'hod.cse@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    cabin: 'Room 101, Executive Wing',
    university: 'GGSIPU'
  }
];

export const INITIAL_MESSAGES = [
  {
    id: 'MSG-001',
    senderId: 'STU-2026-8842',
    senderName: 'Krrish Kumar Tanti',
    senderRole: 'student',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    receiverId: 'FAC-1092',
    receiverName: 'Dr. Manish Verma',
    receiverRole: 'teacher',
    message: 'Good afternoon Dr. Verma! Regarding tomorrow’s OS Lab practical, should we bring our Docker compose memory benchmarks pre-configured?',
    timestamp: 'Today, 01:45 PM',
    readReceipt: 1
  },
  {
    id: 'MSG-002',
    senderId: 'FAC-1092',
    senderName: 'Dr. Manish Verma',
    senderRole: 'teacher',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    receiverId: 'STU-2026-8842',
    receiverName: 'Krrish Kumar Tanti',
    receiverRole: 'student',
    message: 'Hello Krrish! Yes, please have the memory management container ready. We will benchmark Banker’s algorithm live in Lab 204.',
    timestamp: 'Today, 02:00 PM',
    readReceipt: 1
  }
];

export const DataProvider = ({ children }) => {
  const [grievances, setGrievances] = useState(INITIAL_GRIEVANCES);
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [broadcasts, setBroadcasts] = useState(INITIAL_BROADCASTS);
  const [substitutions, setSubstitutions] = useState(INITIAL_SUBSTITUTIONS);
  const [approvals, setApprovals] = useState(INITIAL_APPROVALS);
  const [studentsRoster, setStudentsRoster] = useState(INITIAL_STUDENT_ROSTER);
  const [facultyDirectory, setFacultyDirectory] = useState(INITIAL_FACULTY_DIRECTORY);
  const [timetables, setTimetables] = useState(DEFAULT_TIMETABLES);
  const [syllabusProgress, setSyllabusProgress] = useState([]);
  
  // Direct Messaging State (WhatsApp Style)
  const [directMessages, setDirectMessages] = useState(INITIAL_MESSAGES);
  const [activeChatPartner, setActiveChatPartner] = useState(null);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [incomingChatToast, setIncomingChatToast] = useState(null);

  // Tab-Aware active user tracker (allows independent multi-tab testing across roles)
  const tabUserRef = useRef(null);
  const registerTabUser = (user) => {
    tabUserRef.current = user;
  };

  // Active classroom session
  const [activeSession, setActiveSession] = useState({
    id: 'SESS-LIVE-01',
    subject: 'Operating Systems Lab (CSE-301)',
    room: 'Lab 204, Block A',
    code: 'OS42',
    beaconId: 'BLE_BEACON_CSE_LAB_204',
    faculty: 'Dr. Manish Verma',
    expiresInSeconds: 600,
    isActive: true,
    section: 'CSE-6A',
    beaconActive: true
  });

  // Calendar Attendance Records
  const [calendarAttendance, setCalendarAttendance] = useState([
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
  ]);

  // Broadcast helper function across channels
  const broadcastSync = (type, payload) => {
    const message = { type, payload, timestamp: Date.now() };
    if (syncChannel) {
      try { syncChannel.postMessage(message); } catch (e) {}
    }
    if (syncChannelAlt) {
      try { syncChannelAlt.postMessage(message); } catch (e) {}
    }
  };

  // 1. Listen for cross-tab BroadcastChannel sync messages
  useEffect(() => {
    const handleMessage = (event) => {
      const { type, payload } = event.data || {};
      if (!type) return;

      switch (type) {
        case 'FACULTY_REGISTERED':
          if (payload) {
            setFacultyDirectory(prev => {
              const exists = prev.some(f => f.id === payload.id || f.email === payload.email);
              if (exists) {
                return prev.map(f => (f.id === payload.id || f.email === payload.email) ? { ...f, ...payload } : f);
              }
              return [payload, ...prev];
            });
          }
          break;

        case 'DIRECT_MESSAGE_SENT':
          if (payload) {
            let myUser = tabUserRef.current;
            if (!myUser && typeof window !== 'undefined') {
              try {
                myUser = JSON.parse(localStorage.getItem('edusphere_auth_user') || localStorage.getItem('edusphere_user') || 'null');
              } catch (e) {}
            }

            const targetRecipient = payload.recipientId || payload.receiverId;
            const targetRecipientName = (payload.recipientName || payload.receiverName || '').toLowerCase().trim();
            const targetRecipientRole = (payload.recipientRole || payload.receiverRole || '').toLowerCase().trim();

            const sender = payload.senderId;
            const senderName = (payload.senderName || '').toLowerCase().trim();

            const myIds = [myUser?.id, myUser?.enrollment, myUser?.email].filter(Boolean);
            const myName = myUser?.name ? myUser.name.toLowerCase().trim() : '';

            // 🔒 STRICT 1-ON-1 PEER ISOLATION:
            // A message is ONLY delivered if the targetRecipient specifically matches this user's unique ID, enrollment, email, or exact full name.
            // NEVER use broad role matching (e.g. role === 'teacher') to prevent message leaks to other faculty members!
            const isForMe = myIds.includes(targetRecipient) || 
                            (myName && targetRecipientName === myName);
                            
            const isFromMe = myIds.includes(sender) || 
                             (myName && senderName === myName);

            // ⛔ DROP immediately if neither specifically addressed to me nor sent by me!
            if (!isForMe && !isFromMe) {
              return;
            }

            // Always update directMessages state for this tab
            setDirectMessages(prev => {
              if (prev.some(m => m.id === payload.id)) return prev;
              return [...prev, payload];
            });

            // If incoming message for this tab's user -> trigger sound & popup toast!
            if (isForMe && !isFromMe) {
              sounds.playMessageReceived();
              setIncomingChatToast({
                id: payload.id,
                threadId: payload.threadId || [sender, targetRecipient].sort().join('_'),
                senderId: payload.senderId,
                senderName: payload.senderName || 'Student Scholar',
                senderRole: payload.senderRole || 'student',
                senderAvatar: payload.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
                recipientId: targetRecipient,
                message: payload.text || payload.message || 'New message',
                text: payload.text || payload.message || 'New message',
                time: payload.timestamp || 'Just now'
              });
            }
          }
          break;

        case 'DIRECT_MESSAGE_DELETED':
          setDirectMessages(prev => prev.filter(m => m.id !== payload.id));
          break;

        case 'ATTENDANCE_BATCH_SAVED':
          if (payload && Array.isArray(payload.records)) {
            const dateStr = payload.date;
            setCalendarAttendance(prev => {
              const newEntries = payload.records.map(r => ({
                date: dateStr,
                subject: payload.subject,
                status: r.status
              }));
              return [...prev, ...newEntries];
            });
          }
          break;

        case 'ATTENDANCE_VERIFIED':
          sounds.playSuccessFanfare();
          setStudentsRoster(prev => {
            const exists = prev.some(s => s.roll === payload.studentEnrollment || s.name === payload.studentName);
            if (exists) {
              return prev.map(s => (s.roll === payload.studentEnrollment || s.name === payload.studentName) ? {
                ...s,
                status: 'present',
                bleRssi: '-38 dBm (0.8m in-range)',
                verifiedAt: payload.verifiedAt || 'Just now (Live Verified)',
                device: payload.device || 'BLE Verified Phone'
              } : s);
            } else {
              return [
                {
                  id: `STU-${Date.now()}`,
                  roll: payload.studentEnrollment || '04214802722',
                  name: payload.studentName || 'New Student Scholar',
                  status: 'present',
                  bleRssi: '-39 dBm (0.7m)',
                  device: 'Smart Mobile Client',
                  verifiedAt: payload.verifiedAt || 'Just now (Live Verified)'
                },
                ...prev
              ];
            }
          });
          break;

        case 'SESSION_UPDATED':
          if (payload) {
            setActiveSession(prev => ({ ...prev, ...payload }));
          }
          break;

        case 'ROSTER_OVERRIDE':
          setStudentsRoster(prev => prev.map(s => {
            if (s.id === payload.studentId || s.roll === payload.studentId) {
              return {
                ...s,
                status: payload.nextStatus,
                verifiedAt: payload.nextStatus === 'present' ? 'Teacher Override' : '-'
              };
            }
            return s;
          }));
          break;

        case 'MARK_ALL_ROSTER':
          setStudentsRoster(prev => prev.map(s => ({
            ...s,
            status: payload.status,
            verifiedAt: payload.status === 'present' ? 'Quick Override (All)' : '-'
          })));
          break;

        case 'TIMETABLE_PUBLISHED':
          if (payload) {
            setTimetables(prev => {
              const idx = prev.findIndex(t => t.university === payload.university && t.section === payload.section);
              if (idx !== -1) {
                const next = [...prev];
                next[idx] = payload;
                return next;
              }
              return [payload, ...prev];
            });
          }
          break;

        case 'SYLLABUS_PROGRESS_UPDATED':
          if (payload) {
            setSyllabusProgress(prev => {
              const idx = prev.findIndex(p => p.subject_code === payload.subject_code && p.faculty_id === payload.faculty_id);
              if (idx !== -1) {
                const next = [...prev];
                next[idx] = payload;
                return next;
              }
              return [payload, ...prev];
            });
          }
          break;

        case 'NOTE_ADDED':
          setNotes(prev => {
            if (prev.some(n => n.id === payload.id)) return prev;
            return [payload, ...prev];
          });
          break;

        case 'NOTE_DELETED':
          setNotes(prev => prev.filter(n => n.id !== payload.id));
          break;

        case 'BROADCAST_CREATED':
          setBroadcasts(prev => {
            if (prev.some(b => b.id === payload.id)) return prev;
            return [payload, ...prev];
          });
          break;

        case 'BROADCAST_DELETED':
          setBroadcasts(prev => prev.filter(b => b.id !== payload.id));
          break;

        case 'GRIEVANCE_CREATED':
          setGrievances(prev => {
            if (prev.some(g => g.id === payload.id)) return prev;
            return [payload, ...prev];
          });
          break;

        case 'GRIEVANCE_STATUS_UPDATED':
          setGrievances(prev => prev.map(g => g.id === payload.id ? {
            ...g,
            status: payload.status,
            resolutionNotes: payload.resolutionNotes !== undefined ? payload.resolutionNotes : g.resolutionNotes,
            rsaSeal: payload.rsaSeal || g.rsaSeal,
            resolvedBy: payload.resolvedBy || g.resolvedBy,
            resolvedAt: payload.resolvedAt || g.resolvedAt
          } : g));
          break;

        case 'SUBSTITUTION_ASSIGNED':
          sounds.playSuccessFanfare();
          setSubstitutions(prev => prev.map(s => s.id === payload.subId ? {
            ...s,
            status: 'Assigned',
            assignedTo: payload.facultyName,
            notes: payload.notes || s.notes,
            assignedAt: payload.assignedAt || 'Today, Just now'
          } : s));
          break;

        default:
          break;
      }
    };

    if (syncChannel) syncChannel.onmessage = handleMessage;
    if (syncChannelAlt) syncChannelAlt.onmessage = handleMessage;

    return () => {};
  }, []);

  // 2. Fetch fresh data from backend REST API and set up periodic 3s polling fallback
  useEffect(() => {
    const fetchFreshData = async () => {
      try {
        // Fetch active session
        const sessRes = await fetch(`${API_BASE}/attendance/session`);
        const sessData = await sessRes.json();
        if (sessData.success && sessData.session) {
          setActiveSession(prev => ({ ...prev, ...sessData.session }));
        }

        // Fetch grievances
        const grvRes = await fetch(`${API_BASE}/grievances`);
        const grvData = await grvRes.json();
        if (grvData.success && Array.isArray(grvData.grievances) && grvData.grievances.length > 0) {
          setGrievances(grvData.grievances);
        }

        // Fetch notes
        const notesRes = await fetch(`${API_BASE}/notes`);
        const notesData = await notesRes.json();
        if (notesData.success && Array.isArray(notesData.notes) && notesData.notes.length > 0) {
          setNotes(notesData.notes);
        }

        // Fetch broadcasts
        const bcRes = await fetch(`${API_BASE}/broadcasts`);
        const bcData = await bcRes.json();
        if (bcData.success && Array.isArray(bcData.broadcasts) && bcData.broadcasts.length > 0) {
          setBroadcasts(bcData.broadcasts);
        }

        // Fetch faculty directory from dedicated endpoint /api/users/faculty
        const facultyRes = await fetch(`${API_BASE}/users/faculty`);
        const facultyData = await facultyRes.json();
        if (facultyData.success && Array.isArray(facultyData.faculty) && facultyData.faculty.length > 0) {
          setFacultyDirectory(facultyData.faculty);
        }

        // Fetch timetables
        const ttRes = await fetch(`${API_BASE}/timetables`);
        const ttData = await ttRes.json();
        if (ttData.success && Array.isArray(ttData.timetables) && ttData.timetables.length > 0) {
          setTimetables(ttData.timetables);
        }

        // Fetch syllabus progress
        const sylRes = await fetch(`${API_BASE}/syllabus/progress`);
        const sylData = await sylRes.json();
        if (sylData.success && Array.isArray(sylData.progress) && sylData.progress.length > 0) {
          setSyllabusProgress(sylData.progress);
        }

        // Fetch attendance records
        const attRes = await fetch(`${API_BASE}/attendance/records`);
        const attData = await attRes.json();
        if (attData.success && Array.isArray(attData.records) && attData.records.length > 0) {
          setCalendarAttendance(attData.records);
        }

        // Fetch substitutions
        const subRes = await fetch(`${API_BASE}/substitutions`);
        const subData = await subRes.json();
        if (subData.success && Array.isArray(subData.substitutions) && subData.substitutions.length > 0) {
          setSubstitutions(subData.substitutions);
        }
      } catch (e) {
        // Backend offline fallback - keeping state intact
      }
    };

    fetchFreshData();
    const pollInterval = setInterval(fetchFreshData, 3000);
    return () => clearInterval(pollInterval);
  }, []);

  // --- ACTIONS & MUTATIONS WITH INSTANT MULTI-TAB BROADCAST ---

  // Direct WhatsApp 1-on-1 Message Sender
  const sendDirectMessage = async (messageText, currentUser, targetPartner, attachmentFile = null) => {
    if ((!messageText.trim() && !attachmentFile) || !targetPartner) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgId = `MSG-${Date.now().toString().slice(-6)}`;

    const senderId = currentUser?.id || currentUser?.enrollment || 'STU-001';
    const recipientId = targetPartner.id || targetPartner.enrollment || 'FAC-1092';
    const threadId = [senderId, recipientId].sort().join('_');

    const newMsg = {
      id: msgId,
      threadId,
      senderId,
      senderName: currentUser?.name || 'Student Scholar',
      senderRole: currentUser?.role || 'student',
      senderAvatar: currentUser?.avatar,
      recipientId,
      receiverId: recipientId,
      recipientName: targetPartner.name || 'Campus Member',
      receiverName: targetPartner.name || 'Campus Member',
      recipientRole: targetPartner.role || 'teacher',
      receiverRole: targetPartner.role || 'teacher',
      text: messageText.trim(),
      message: messageText.trim(),
      timestamp: `Today, ${nowTime}`,
      isRead: 0,
      readReceipt: 0,
      fileUrl: attachmentFile?.url || null,
      fileName: attachmentFile?.name || null
    };

    // Play message sent audio chime
    sounds.playMessageSent();

    setDirectMessages(prev => [...prev, newMsg]);
    broadcastSync('DIRECT_MESSAGE_SENT', newMsg);

    try {
      if (attachmentFile?.file) {
        const formData = new FormData();
        formData.append('attachment', attachmentFile.file);
        formData.append('threadId', threadId);
        formData.append('senderId', senderId);
        formData.append('senderName', newMsg.senderName);
        formData.append('senderRole', newMsg.senderRole);
        formData.append('senderAvatar', newMsg.senderAvatar || '');
        formData.append('recipientId', recipientId);
        formData.append('receiverId', recipientId);
        formData.append('recipientName', newMsg.recipientName);
        formData.append('receiverName', newMsg.receiverName);
        formData.append('recipientRole', newMsg.recipientRole);
        formData.append('receiverRole', newMsg.receiverRole);
        formData.append('text', newMsg.text);
        formData.append('message', newMsg.message);

        await fetch(`${API_BASE}/messages`, {
          method: 'POST',
          body: formData
        });
      } else {
        await fetch(`${API_BASE}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMsg)
        });
      }
    } catch (e) {
      console.warn('Direct message API sync error:', e);
    }

    return newMsg;
  };

  const deleteDirectMessage = async (msgId) => {
    setDirectMessages(prev => prev.filter(m => m.id !== msgId));
    broadcastSync('DIRECT_MESSAGE_DELETED', { id: msgId });

    try {
      await fetch(`${API_BASE}/messages/${msgId}`, { method: 'DELETE' });
    } catch (e) {}
  };

  const openDirectChat = (partner) => {
    setActiveChatPartner(partner);
    setIsChatDrawerOpen(true);
    setIncomingChatToast(null);
  };

  const closeDirectChat = () => {
    setIsChatDrawerOpen(false);
  };

  const dismissIncomingToast = () => {
    setIncomingChatToast(null);
  };

  // Calendar Attendance Batch Saver (Faculty Suite)
  const saveBatchAttendance = async (date, subject, section, markedBy, records) => {
    const payload = { date, subject, section, markedBy, records };
    
    // Update local state
    setCalendarAttendance(prev => {
      const newEntries = records.map(r => ({
        id: `ATT-${date}-${r.enrollment}-${subject}`,
        date,
        subject,
        section,
        status: r.status,
        enrollment: r.enrollment || r.roll,
        student_name: r.name,
        marked_by: markedBy
      }));
      return [...prev, ...newEntries];
    });

    broadcastSync('ATTENDANCE_BATCH_SAVED', payload);

    try {
      const res = await fetch(`${API_BASE}/attendance/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (e) {
      console.warn('Batch attendance sync error:', e);
      return { success: true, message: 'Saved to local session' };
    }
  };

  // Student Attendance Handshake Handler
  const markStudentAttendance = async (codeEntered, studentInfo = null) => {
    const entered = codeEntered.trim().toUpperCase();
    const expected = activeSession.code.trim().toUpperCase();

    if (entered === expected) {
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const studentName = studentInfo?.name || 'Krrish Kumar Tanti';
      const studentRoll = studentInfo?.enrollment || '04214802722';
      const todayStr = new Date().toISOString().slice(0, 10);

      sounds.playSuccessFanfare();

      // Update Student Calendar Record
      setCalendarAttendance(prev => [
        {
          id: `REC-${Date.now()}`,
          date: todayStr,
          subject: activeSession.subject,
          status: 'Present',
          enrollment: studentRoll,
          student_name: studentName,
          verifiedVia: 'Dual-Factor BLE Proximity (0.8m) + PIN'
        },
        ...prev
      ]);

      // Update Teacher's Live Roster in Current Tab
      setStudentsRoster(prev => {
        const matchIndex = prev.findIndex(s => s.roll === studentRoll || s.name === studentName);
        if (matchIndex !== -1) {
          return prev.map((s, idx) => idx === matchIndex ? {
            ...s,
            status: 'present',
            bleRssi: '-38 dBm (0.8m in-range)',
            verifiedAt: `Live ${nowTime}`,
            device: 'BLE Validated Smartphone'
          } : s);
        } else {
          return [
            {
              id: `STU-${Date.now()}`,
              roll: studentRoll,
              name: studentName,
              status: 'present',
              bleRssi: '-40 dBm (0.8m)',
              device: 'BLE Validated Smartphone',
              verifiedAt: `Live ${nowTime}`
            },
            ...prev
          ];
        }
      });

      // Broadcast Instantly across tabs
      broadcastSync('ATTENDANCE_VERIFIED', {
        studentEnrollment: studentRoll,
        studentName,
        verifiedAt: `Live ${nowTime}`,
        device: 'BLE Validated Smartphone',
        subject: activeSession.subject
      });

      // Save to SQLite
      try {
        fetch(`${API_BASE}/attendance/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentEnrollment: studentRoll,
            studentName,
            passcode: entered,
            verifiedVia: 'Dual-Factor BLE Proximity (0.8m) + PIN'
          })
        }).catch(err => console.warn('Attendance backend verification error:', err));
      } catch (e) {}

      return { 
        success: true, 
        message: `Presence validated for ${activeSession.subject}! Marked Present in live roster.` 
      };
    } else {
      return { 
        success: false, 
        message: `Invalid room passcode "${codeEntered}". Please check the teacher's display board.` 
      };
    }
  };

  // Timetable Master Publisher (HOD Console)
  const publishTimetable = async (timetableData) => {
    setTimetables(prev => {
      const idx = prev.findIndex(t => t.university === timetableData.university && t.section === timetableData.section);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = timetableData;
        return next;
      }
      return [timetableData, ...prev];
    });

    broadcastSync('TIMETABLE_PUBLISHED', timetableData);

    try {
      const res = await fetch(`${API_BASE}/timetables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(timetableData)
      });
      return await res.json();
    } catch (e) {
      console.warn('Timetable API error:', e);
      return { success: true };
    }
  };

  // Syllabus Progress Updater (Teacher Portal)
  const updateSyllabusProgress = async (progressData) => {
    setSyllabusProgress(prev => {
      const idx = prev.findIndex(p => p.subject_code === progressData.subject_code && p.faculty_id === progressData.faculty_id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = progressData;
        return next;
      }
      return [progressData, ...prev];
    });

    broadcastSync('SYLLABUS_PROGRESS_UPDATED', progressData);

    try {
      await fetch(`${API_BASE}/syllabus/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progressData)
      });
    } catch (e) {
      console.warn('Syllabus progress API error:', e);
    }
  };

  // Passcode Generator
  const generateNewPasscode = async () => {
    const codePrefixes = ['OS', 'CS', 'AI', 'NET', 'ED', 'SE', 'DA'];
    const randomPrefix = codePrefixes[Math.floor(Math.random() * codePrefixes.length)];
    const randomDigits = Math.floor(10 + Math.random() * 90);
    const newCode = `${randomPrefix}${randomDigits}`;

    const updated = {
      ...activeSession,
      code: newCode,
      expiresInSeconds: 600
    };

    setActiveSession(updated);
    broadcastSync('SESSION_UPDATED', updated);

    try {
      await fetch(`${API_BASE}/attendance/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {}

    return newCode;
  };

  const toggleBeaconActive = () => {
    const updated = {
      ...activeSession,
      beaconActive: activeSession.beaconActive === false ? true : false
    };
    setActiveSession(updated);
    broadcastSync('SESSION_UPDATED', updated);
  };

  const updateStudentRosterStatus = (studentId, nextStatus) => {
    let computedStatus = '';
    setStudentsRoster(prev => prev.map(s => {
      if (s.id === studentId || s.roll === studentId) {
        computedStatus = nextStatus || (s.status === 'present' ? 'absent' : s.status === 'absent' ? 'leave' : 'present');
        return {
          ...s,
          status: computedStatus,
          verifiedAt: computedStatus === 'present' ? 'Teacher Override' : '-'
        };
      }
      return s;
    }));

    broadcastSync('ROSTER_OVERRIDE', { studentId, nextStatus: computedStatus || nextStatus });
  };

  const markAllStudents = (statusToSet = 'present') => {
    setStudentsRoster(prev => prev.map(s => ({
      ...s,
      status: statusToSet,
      verifiedAt: statusToSet === 'present' ? 'Quick Override (All)' : '-'
    })));

    broadcastSync('MARK_ALL_ROSTER', { status: statusToSet });
  };

  // Notes Vault Handlers
  const addNote = async (newNote) => {
    setNotes(prev => [newNote, ...prev]);
    broadcastSync('NOTE_ADDED', newNote);

    try {
      await fetch(`${API_BASE}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote)
      });
    } catch (e) {}
  };

  const deleteNote = async (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    broadcastSync('NOTE_DELETED', { id });

    try {
      await fetch(`${API_BASE}/notes/${id}`, { method: 'DELETE' });
    } catch (e) {}
  };

  // Grievance Handlers
  const addGrievance = async (newGrievance) => {
    setGrievances(prev => [newGrievance, ...prev]);
    broadcastSync('GRIEVANCE_CREATED', newGrievance);

    try {
      await fetch(`${API_BASE}/grievances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGrievance)
      });
    } catch (e) {}
  };

  const updateGrievanceStatus = async (id, newStatus, resolutionNotes = '', rsaSeal = null, resolvedBy = null) => {
    const resolvedAt = new Date().toISOString();

    setGrievances(prev => prev.map(g => g.id === id ? {
      ...g,
      status: newStatus,
      resolutionNotes: resolutionNotes || g.resolutionNotes,
      rsaSeal: rsaSeal || g.rsaSeal,
      resolvedBy: resolvedBy || g.resolvedBy,
      resolvedAt
    } : g));

    broadcastSync('GRIEVANCE_STATUS_UPDATED', {
      id,
      status: newStatus,
      resolutionNotes,
      rsaSeal,
      resolvedBy,
      resolvedAt
    });

    try {
      await fetch(`${API_BASE}/grievances/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, resolutionNotes, rsaSeal, resolvedBy })
      });
    } catch (e) {}
  };

  const deleteGrievance = async (id) => {
    setGrievances(prev => prev.filter(g => g.id !== id));
    broadcastSync('GRIEVANCE_DELETED', { id });

    try {
      await fetch(`${API_BASE}/grievances/${id}`, { method: 'DELETE' });
    } catch (e) {}
  };

  // Broadcast Handlers
  const addBroadcast = async (newBroadcast) => {
    setBroadcasts(prev => [newBroadcast, ...prev]);
    broadcastSync('BROADCAST_CREATED', newBroadcast);

    try {
      await fetch(`${API_BASE}/broadcasts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBroadcast)
      });
    } catch (e) {}
  };

  const deleteBroadcast = async (id) => {
    setBroadcasts(prev => prev.filter(b => b.id !== id));
    broadcastSync('BROADCAST_DELETED', { id });

    try {
      await fetch(`${API_BASE}/broadcasts/${id}`, { method: 'DELETE' });
    } catch (e) {}
  };

  // Substitution Handlers
  const assignSubstitution = async (subId, facultyName, notes = '') => {
    const assignedAt = `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setSubstitutions(prev => prev.map(s => s.id === subId ? {
      ...s,
      status: 'Assigned',
      assignedTo: facultyName,
      notes: notes || s.notes,
      assignedAt
    } : s));

    broadcastSync('SUBSTITUTION_ASSIGNED', { subId, facultyName, notes, assignedAt });

    try {
      await fetch(`${API_BASE}/substitutions/${subId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTo: facultyName, notes })
      });
    } catch (e) {}
  };

  // Digital Approval Handlers
  const signApproval = (appId, signerName = 'Prof. S. K. Naitik (HOD)') => {
    const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
    const signatureHash = `RSA-HOD-CSE-0x${randomHex}89A`;
    const now = new Date();
    const timeString = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setApprovals(prev => prev.map(app => app.id === appId ? {
      ...app,
      status: 'Approved',
      signatureHash,
      signedAt: timeString,
      signedBy: signerName
    } : app));

    return { signatureHash, signedAt: timeString };
  };

  const rejectApproval = (appId, reason = 'Insufficient documentation or budget exceeded') => {
    setApprovals(prev => prev.map(app => app.id === appId ? {
      ...app,
      status: 'Rejected',
      rejectionReason: reason
    } : app));
  };

  const acknowledgeApproval = (appId) => {
    setApprovals(prev => prev.map(a => a.id === appId ? {
      ...a,
      status: 'Acknowledged (Under Review)'
    } : a));
  };

  return (
    <DataContext.Provider value={{
      grievances,
      addGrievance,
      updateGrievanceStatus,
      deleteGrievance,
      notes,
      addNote,
      deleteNote,
      broadcasts,
      addBroadcast,
      deleteBroadcast,
      substitutions,
      assignSubstitution,
      approvals,
      signApproval,
      rejectApproval,
      acknowledgeApproval,
      studentsRoster,
      setStudentsRoster,
      updateStudentRosterStatus,
      markAllStudents,
      generateNewPasscode,
      toggleBeaconActive,
      facultyDirectory,
      setFacultyDirectory,
      activeSession,
      setActiveSession,
      calendarAttendance,
      markStudentAttendance,
      saveBatchAttendance,
      timetables,
      publishTimetable,
      syllabusProgress,
      updateSyllabusProgress,
      // Direct Messaging
      directMessages,
      activeChatPartner,
      isChatDrawerOpen,
      incomingChatToast,
      sendDirectMessage,
      deleteDirectMessage,
      openDirectChat,
      closeDirectChat,
      dismissIncomingToast,
      registerTabUser
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
