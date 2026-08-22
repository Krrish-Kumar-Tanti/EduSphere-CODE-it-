import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

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
    title: 'Lab 204 AC Compressor Failure',
    category: 'Maintenance',
    destination: 'staff',
    priority: 'Urgent',
    description: 'The AC unit in Lab 204 is vibrating heavily and emitting heat during the 2 PM lab slot.',
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
    title: 'Syllabus Pace for Machine Learning Elective',
    category: 'Academic Concern & Syllabus Pace',
    destination: 'hod',
    priority: 'Medium',
    description: 'Unit 3 (Backpropagation & CNNs) requires more lab practical sessions before midterms.',
    imageUrl: null,
    status: 'Under Review',
    timestamp: 'Yesterday, 04:45 PM',
    assignedTo: 'HOD Academic Committee',
    location: 'Academic Wing, Room 304',
    resolutionNotes: null
  },
  {
    id: 'GRV-903',
    studentName: 'Aryan Sharma',
    studentEnrollment: '04214802723',
    isAnonymous: false,
    title: 'Canteen Water Dispenser Filter Replacement',
    category: 'Cleaning & Hygiene',
    destination: 'staff',
    priority: 'High',
    description: 'Block B Ground Floor water cooler display indicates filter replacement overdue by 12 days.',
    imageUrl: 'https://images.unsplash.com/photo-1546768292-fb12f6c92568?auto=format&fit=crop&q=80&w=600',
    status: 'Resolved',
    timestamp: '2 days ago',
    assignedTo: 'Hygiene & Cleanliness Cell',
    location: 'Block B Cafeteria',
    resolutionNotes: 'Filter cartridge replaced with new NSF-certified filter. Water TDS measured at 85 PPM.'
  },
  {
    id: 'GRV-904',
    studentName: 'Sneha Patel',
    studentEnrollment: '04214802726',
    isAnonymous: false,
    title: 'Campus WiFi Deadzone in 3rd Floor Library',
    category: 'Technical Support',
    destination: 'staff',
    priority: 'Medium',
    description: 'Access Point AP-LIB-04 has blinking amber LED and drops connections repeatedly.',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600',
    status: 'In-Progress',
    timestamp: 'Today, 09:15 AM',
    assignedTo: 'IT & Network Infrastructure',
    location: 'Central Library, 3rd Floor',
    resolutionNotes: null
  }
];

export const INITIAL_NOTES = [
  {
    id: 'NOTE-101',
    subject: 'Operating Systems (CSE-301)',
    faculty: 'Dr. Manish Verma',
    title: 'Unit 4: Deadlocks, Banker\'s Algorithm & Virtual Memory',
    fileSize: '4.8 MB',
    uploadDate: '21 Aug 2026',
    downloadUrl: '#',
    semester: '6th Semester (Year 3)',
    format: 'PDF',
    downloads: 142
  },
  {
    id: 'NOTE-102',
    subject: 'Computer Networks (CSE-303)',
    faculty: 'Prof. Ananya Roy',
    title: 'TCP/IP Flow Control & Congestion Management PPTs',
    fileSize: '12.4 MB',
    uploadDate: '20 Aug 2026',
    downloadUrl: '#',
    semester: '6th Semester (Year 3)',
    format: 'PPTX',
    downloads: 98
  },
  {
    id: 'NOTE-103',
    subject: 'Cloud Computing & DevOps (CSE-305)',
    faculty: 'Dr. S. K. Naitik',
    title: 'Kubernetes Pod Scheduling & Docker Hands-on Lab Manual',
    fileSize: '8.1 MB',
    uploadDate: '19 Aug 2026',
    downloadUrl: '#',
    semester: '6th Semester (Year 3)',
    format: 'PDF',
    downloads: 215
  },
  {
    id: 'NOTE-104',
    subject: 'Design & Analysis of Algorithms (CSE-304)',
    faculty: 'Prof. Vikram Seth',
    title: 'Dynamic Programming vs Greedy: Complete Practice Problem Set',
    fileSize: '3.2 MB',
    uploadDate: '17 Aug 2026',
    downloadUrl: '#',
    semester: '6th Semester (Year 3)',
    format: 'PDF',
    downloads: 176
  }
];

export const INITIAL_BROADCASTS = [
  {
    id: 'BC-01',
    sender: 'Prof. S. K. Naitik (HOD CSE)',
    role: 'HOD',
    title: '🚨 Mid-Term Practical Exam Schedule Released',
    message: 'All 6th-semester students must carry their digital Virtual ID cards for entry starting Monday. Zero physical paperwork required.',
    time: '25 mins ago',
    isUrgent: true,
    targetAudience: 'Computer Science & Engineering (CSE)'
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
    date: 'Today, 22 Aug',
    slot: '03:00 PM - 04:00 PM',
    subject: 'CSE-304: Design & Analysis of Algorithms',
    semester: '6th Semester (Sec A)',
    room: 'Room 302, Block B',
    absentFaculty: 'Prof. Vikram Seth',
    reason: 'Medical Emergency Leave',
    status: 'Pending',
    assignedTo: null,
    urgency: 'Urgent',
    suggestedFaculty: ['Dr. Manish Verma', 'Dr. Priya Sen', 'Prof. Ananya Roy']
  },
  {
    id: 'SUB-102',
    date: 'Today, 22 Aug',
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
  },
  {
    id: 'SUB-103',
    date: 'Today, 22 Aug',
    slot: '04:00 PM - 05:00 PM',
    subject: 'CSE-308: Machine Learning Lab',
    semester: '6th Semester (Sec B)',
    room: 'Lab 204, Block A',
    absentFaculty: 'Dr. Rahul Saxena',
    reason: 'Family Emergency Leave',
    status: 'Pending',
    assignedTo: null,
    urgency: 'High',
    suggestedFaculty: ['Prof. S. K. Naitik', 'Dr. Manish Verma']
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
    description: 'Procurement of 20x ESP32 BLE Beacon nodes, Raspberry Pi gateways, fast IoT cables, and refreshments for 250 participants.',
    documents: ['Budget_Breakdown.pdf', 'Vendor_Hardware_Quotations.pdf'],
    signatureHash: null,
    signedAt: null,
    signedBy: null
  },
  {
    id: 'APP-502',
    title: 'On-Duty (OD) Leave for Smart Hackathon Grand Finale',
    requester: 'Aryan Sharma',
    requesterRole: 'Student (Team Lead)',
    enrollment: '04214802723',
    category: 'OD Leave Request',
    amount: null,
    duration: '3 Days (24 - 26 Aug 2026)',
    department: 'CSE 6th Semester',
    submissionDate: '20 Aug 2026',
    status: 'Pending',
    urgency: 'Medium',
    description: 'Selected for National Grand Finale at IIT Bombay nodal center. Requesting official attendance waiver for 6 lecture sessions.',
    documents: ['Official_Selection_Letter.pdf', 'Travel_Ticket.pdf'],
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
    description: 'Procurement of GPU compute node server for final year AI Capstone projects and faculty LLM research.',
    documents: ['GPU_Lab_Grant_Proposal.pdf', 'Dell_HPC_Invoice.pdf'],
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
    subject: 'Operating Systems & Linux Kernel',
    experience: '12 Years',
    rating: '4.9/5.0',
    email: 'manish.verma@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    cabin: 'Room 304, Academic Block A'
  },
  {
    id: 'HOD-001',
    name: 'Prof. S. K. Naitik',
    designation: 'Head of Department & Professor',
    department: 'Department of Computer Science & Engineering',
    subject: 'Cloud Architectures & AI Systems',
    experience: '18 Years',
    rating: '5.0/5.0',
    email: 'hod.cse@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    cabin: 'Room 101, Executive Wing'
  },
  {
    id: 'FAC-2041',
    name: 'Dr. Priya Sen',
    designation: 'Assistant Professor',
    department: 'Information Technology (IT)',
    subject: 'Database Systems & Big Data Analytics',
    experience: '8 Years',
    rating: '4.8/5.0',
    email: 'priya.sen@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    cabin: 'Room 208, Academic Block A'
  },
  {
    id: 'FAC-3094',
    name: 'Prof. Vikram Seth',
    designation: 'Professor',
    department: 'AI & Data Science (AIDS)',
    subject: 'Algorithms & Computational Complexity',
    experience: '15 Years',
    rating: '4.7/5.0',
    email: 'vikram.seth@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    cabin: 'Room 312, Academic Block B'
  },
  {
    id: 'STF-504',
    name: 'Rajesh Sharma',
    designation: 'Facilities Lead Supervisor',
    department: 'Ground Operations & Maintenance',
    subject: 'Campus Infrastructure, Electrical & Sanitation',
    experience: '10 Years',
    rating: '4.9/5.0',
    email: 'rajesh.facilities@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    cabin: 'Operations Control Room 04'
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
    message: 'Good afternoon Dr. Verma! Regarding tomorrow’s OS Lab practical, should we bring our Docker compose scripts pre-configured?',
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
  
  // Direct Messaging State (WhatsApp Style)
  const [directMessages, setDirectMessages] = useState(INITIAL_MESSAGES);
  const [activeChatPartner, setActiveChatPartner] = useState(null);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [incomingChatToast, setIncomingChatToast] = useState(null);

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

  const [studentAttendanceRecord, setStudentAttendanceRecord] = useState([
    { id: '1', subject: 'Operating Systems Lab', code: 'OS42', date: 'Today, 02:15 PM', status: 'Present', verifiedVia: 'BLE Proximity (0.8m) + PIN' },
    { id: '2', subject: 'Computer Networks', code: 'CN81', date: '21 Aug 2026', status: 'Present', verifiedVia: 'BLE + Passcode' },
    { id: '3', subject: 'Cloud Computing', code: 'CC19', date: '20 Aug 2026', status: 'Present', verifiedVia: 'BLE + Passcode' },
    { id: '4', subject: 'Web Technologies', code: 'WT33', date: '19 Aug 2026', status: 'Present', verifiedVia: 'BLE + Passcode' }
  ]);

  // Broadcast helper function to notify all other open tabs across channels
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
        case 'ATTENDANCE_VERIFIED':
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
            resolutionNotes: payload.resolutionNotes || g.resolutionNotes
          } : g));
          break;

        case 'GRIEVANCE_DELETED':
          setGrievances(prev => prev.filter(g => g.id !== payload.id));
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

        case 'SUBSTITUTION_ASSIGNED':
          setSubstitutions(prev => prev.map(s => s.id === payload.subId ? {
            ...s,
            status: 'Assigned',
            assignedTo: payload.facultyName
          } : s));
          break;

        case 'APPROVAL_SIGNED':
          setApprovals(prev => prev.map(a => a.id === payload.appId ? {
            ...a,
            status: 'Approved',
            signatureHash: payload.signatureHash,
            signedAt: payload.signedAt,
            signedBy: payload.signedBy
          } : a));
          break;

        case 'APPROVAL_ACKNOWLEDGED':
          setApprovals(prev => prev.map(a => a.id === payload.appId ? {
            ...a,
            status: 'Acknowledged (Under Review)'
          } : a));
          break;

        case 'APPROVAL_REJECTED':
          setApprovals(prev => prev.map(a => a.id === payload.appId ? {
            ...a,
            status: 'Rejected',
            rejectionReason: payload.reason
          } : a));
          break;

        case 'FACULTY_REGISTERED':
          if (payload) {
            setFacultyDirectory(prev => {
              if (prev.some(f => f.id === payload.id || f.email === payload.email)) {
                return prev.map(f => (f.id === payload.id || f.email === payload.email) ? { ...f, ...payload } : f);
              }
              return [payload, ...prev];
            });
          }
          break;

        case 'DIRECT_MESSAGE_SENT':
          if (payload) {
            setDirectMessages(prev => {
              if (prev.some(m => m.id === payload.id)) return prev;
              return [...prev, payload];
            });

            // Show floating WhatsApp notification toast on recipient tab
            setIncomingChatToast({
              id: payload.id,
              senderId: payload.senderId,
              senderName: payload.senderName,
              senderRole: payload.senderRole,
              senderAvatar: payload.senderAvatar,
              message: payload.message,
              time: 'Just now'
            });
          }
          break;

        case 'DIRECT_MESSAGE_DELETED':
          setDirectMessages(prev => prev.filter(m => m.id !== payload.id));
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

        // Fetch registered faculty & staff from DB
        const usersRes = await fetch(`${API_BASE}/users?role=teacher`);
        const usersData = await usersRes.json();
        if (usersData.success && Array.isArray(usersData.users) && usersData.users.length > 0) {
          const mappedFaculty = usersData.users.map(u => ({
            id: u.id,
            name: u.name,
            designation: u.designation || 'Faculty Member',
            department: u.department || 'Computer Science',
            subject: u.subjects || 'Core Academic Curriculum',
            email: u.email,
            avatar: u.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
            cabin: u.cabin || 'Faculty Desk'
          }));

          // Merge with initial directory without duplicating
          setFacultyDirectory(prev => {
            const combined = [...prev];
            mappedFaculty.forEach(mf => {
              const idx = combined.findIndex(c => c.id === mf.id || c.email === mf.email);
              if (idx !== -1) {
                combined[idx] = { ...combined[idx], ...mf };
              } else {
                combined.unshift(mf);
              }
            });
            return combined;
          });
        }

        // Fetch direct messages
        const msgRes = await fetch(`${API_BASE}/messages`);
        const msgData = await msgRes.json();
        if (msgData.success && Array.isArray(msgData.messages) && msgData.messages.length > 0) {
          setDirectMessages(msgData.messages);
        }
      } catch (e) {
        // Backend offline fallback - keeping local state intact
      }
    };

    fetchFreshData();
    const pollInterval = setInterval(fetchFreshData, 3000);
    return () => clearInterval(pollInterval);
  }, []);

  // --- ACTIONS & MUTATIONS WITH INSTANT BROADCAST ---

  // A. Grievance Handlers
  const addGrievance = async (newGrievance) => {
    setGrievances(prev => [newGrievance, ...prev]);
    broadcastSync('GRIEVANCE_CREATED', newGrievance);

    try {
      await fetch(`${API_BASE}/grievances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGrievance)
      });
    } catch (e) {
      console.warn('Grievance API sync error:', e);
    }
  };

  const updateGrievanceStatus = async (id, newStatus, resolutionNotes = '') => {
    setGrievances(prev => prev.map(g => g.id === id ? {
      ...g,
      status: newStatus,
      resolutionNotes: resolutionNotes || g.resolutionNotes
    } : g));

    broadcastSync('GRIEVANCE_STATUS_UPDATED', { id, status: newStatus, resolutionNotes });

    try {
      await fetch(`${API_BASE}/grievances/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, resolutionNotes })
      });
    } catch (e) {
      console.warn('Grievance status API sync error:', e);
    }
  };

  const deleteGrievance = async (id) => {
    setGrievances(prev => prev.filter(g => g.id !== id));
    broadcastSync('GRIEVANCE_DELETED', { id });

    try {
      await fetch(`${API_BASE}/grievances/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Grievance delete API error:', e);
    }
  };

  // B. Notes Vault Handlers
  const addNote = async (newNote) => {
    setNotes(prev => [newNote, ...prev]);
    broadcastSync('NOTE_ADDED', newNote);

    try {
      await fetch(`${API_BASE}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote)
      });
    } catch (e) {
      console.warn('Notes API sync error:', e);
    }
  };

  const deleteNote = async (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    broadcastSync('NOTE_DELETED', { id });

    try {
      await fetch(`${API_BASE}/notes/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Note delete API error:', e);
    }
  };

  // C. Broadcast Handlers
  const addBroadcast = async (newBroadcast) => {
    setBroadcasts(prev => [newBroadcast, ...prev]);
    broadcastSync('BROADCAST_CREATED', newBroadcast);

    try {
      await fetch(`${API_BASE}/broadcasts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBroadcast)
      });
    } catch (e) {
      console.warn('Broadcast API sync error:', e);
    }
  };

  const deleteBroadcast = async (id) => {
    setBroadcasts(prev => prev.filter(b => b.id !== id));
    broadcastSync('BROADCAST_DELETED', { id });

    try {
      await fetch(`${API_BASE}/broadcasts/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Broadcast delete API error:', e);
    }
  };

  // D. Substitution Engine Handlers
  const assignSubstitution = (subId, facultyName) => {
    setSubstitutions(prev => prev.map(s => s.id === subId ? {
      ...s,
      status: 'Assigned',
      assignedTo: facultyName
    } : s));

    broadcastSync('SUBSTITUTION_ASSIGNED', { subId, facultyName });
  };

  // E. Digital Approvals Handlers
  const acknowledgeApproval = (appId) => {
    setApprovals(prev => prev.map(a => a.id === appId ? {
      ...a,
      status: 'Acknowledged (Under Review)'
    } : a));

    broadcastSync('APPROVAL_ACKNOWLEDGED', { appId });
  };

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

    broadcastSync('APPROVAL_SIGNED', { appId, signatureHash, signedAt: timeString, signedBy: signerName });
    return { signatureHash, signedAt: timeString };
  };

  const rejectApproval = (appId, reason = 'Insufficient documentation or budget exceeded') => {
    setApprovals(prev => prev.map(app => app.id === appId ? {
      ...app,
      status: 'Rejected',
      rejectionReason: reason
    } : app));

    broadcastSync('APPROVAL_REJECTED', { appId, reason });
  };

  // F. Teacher Classroom & Attendance Studio Handlers
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

  const deleteAttendanceLog = async (id) => {
    try {
      await fetch(`${API_BASE}/attendance/logs/${id}`, { method: 'DELETE' });
    } catch (e) {}
  };

  const purgeAllAttendanceLogs = async () => {
    setStudentsRoster(prev => prev.map(s => ({
      ...s,
      status: 'absent',
      verifiedAt: '-'
    })));
    try {
      await fetch(`${API_BASE}/attendance/logs`, { method: 'DELETE' });
    } catch (e) {}
  };

  const generateNewPasscode = async () => {
    const codePrefixes = ['OS', 'CS', 'AI', 'NET', 'ED'];
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
    } catch (e) {
      console.warn('Session API sync error:', e);
    }

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

  // G. Student Attendance Handshake Handler (STUDENT ➔ TEACHER LIVE SYNC)
  const markStudentAttendance = async (codeEntered, studentInfo = null) => {
    const entered = codeEntered.trim().toUpperCase();
    const expected = activeSession.code.trim().toUpperCase();

    if (entered === expected) {
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const studentName = studentInfo?.name || 'Krrish Kumar Tanti';
      const studentRoll = studentInfo?.enrollment || '04214802722';

      // 1. Update Student Local Attendance Log History
      setStudentAttendanceRecord(prev => [
        {
          id: `REC-${Date.now()}`,
          subject: activeSession.subject,
          code: activeSession.code,
          date: `Today, ${nowTime}`,
          status: 'Present',
          verifiedVia: 'BLE Proximity (0.8m) + PIN'
        },
        ...prev.filter(r => r.code !== activeSession.code)
      ]);

      // 2. Update Teacher's Live Roster in Current Tab
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

      // 3. BROADCAST INSTANTLY ACROSS ALL OPEN BROWSER TABS (<50ms)
      broadcastSync('ATTENDANCE_VERIFIED', {
        studentEnrollment: studentRoll,
        studentName,
        verifiedAt: `Live ${nowTime}`,
        device: 'BLE Validated Smartphone',
        subject: activeSession.subject
      });

      // 4. Save to Backend SQLite
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

  // H. Direct WhatsApp-Style 1-on-1 Messaging Handlers
  const sendDirectMessage = async (messageText, currentUser, targetPartner) => {
    if (!messageText.trim() || !targetPartner) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: `MSG-${Date.now().toString().slice(-6)}`,
      senderId: currentUser?.id || currentUser?.enrollment || 'STU-001',
      senderName: currentUser?.name || 'Anonymous Member',
      senderRole: currentUser?.role || 'student',
      senderAvatar: currentUser?.avatar,
      receiverId: targetPartner.id || targetPartner.enrollment || 'FAC-1092',
      receiverName: targetPartner.name,
      receiverRole: targetPartner.role || 'teacher',
      message: messageText.trim(),
      timestamp: `Today, ${nowTime}`,
      readReceipt: 0
    };

    setDirectMessages(prev => [...prev, newMsg]);
    broadcastSync('DIRECT_MESSAGE_SENT', newMsg);

    try {
      await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg)
      });
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
      deleteAttendanceLog,
      purgeAllAttendanceLogs,
      generateNewPasscode,
      toggleBeaconActive,
      facultyDirectory,
      setFacultyDirectory,
      activeSession,
      setActiveSession,
      studentAttendanceRecord,
      markStudentAttendance,
      // Direct Messaging
      directMessages,
      activeChatPartner,
      isChatDrawerOpen,
      incomingChatToast,
      sendDirectMessage,
      deleteDirectMessage,
      openDirectChat,
      closeDirectChat,
      dismissIncomingToast
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);


