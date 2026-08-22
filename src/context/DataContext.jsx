import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

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
    location: 'Computer Lab 204, Block A'
  },
  {
    id: 'GRV-902',
    studentName: 'Anonymous Student',
    studentEnrollment: 'HIDDEN-SECURE-KEY',
    isAnonymous: true,
    title: 'Syllabus Pace for Machine Learning Elective',
    category: 'Academic Concern',
    destination: 'hod',
    priority: 'Medium',
    description: 'Unit 3 (Backpropagation & CNNs) requires more lab practical sessions before midterms.',
    imageUrl: null,
    status: 'Under-Review',
    timestamp: 'Yesterday, 04:45 PM',
    assignedTo: 'HOD Academic Committee',
    location: 'CSE Department Classrooms'
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
    location: 'Block B Cafeteria'
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
    location: 'Central Library, 3rd Floor'
  },
  {
    id: 'GRV-905',
    studentName: 'Anonymous Student',
    studentEnrollment: 'HIDDEN-SECURE-KEY',
    isAnonymous: true,
    title: 'First Aid Kit Restocking Request in Block 1',
    category: 'Emergency Medical',
    destination: 'staff',
    priority: 'Urgent',
    description: 'First aid box outside Chemistry lab lacks antiseptic spray and burn ointments.',
    imageUrl: null,
    status: 'Open',
    timestamp: 'Today, 08:30 AM',
    assignedTo: 'Emergency Medical Response Team',
    location: 'Block 1, Level 1 Corridor'
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
    semester: '6th Semester',
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
    semester: '6th Semester',
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
    semester: '6th Semester',
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
    semester: '6th Semester',
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
    targetAudience: 'CSE Department (All Semesters)'
  },
  {
    id: 'BC-02',
    sender: 'Ground Security & Operations',
    role: 'Staff',
    title: '📡 BLE Beacon Calibration at Block 3',
    message: 'Proximity beacons in Labs 301-305 upgraded to DTU-style ultra-low latency mesh.',
    time: '2 hours ago',
    isUrgent: false,
    targetAudience: 'All Campus Students'
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
  },
  {
    id: 'SUB-104',
    date: 'Yesterday, 21 Aug',
    slot: '01:00 PM - 02:00 PM',
    subject: 'CSE-306: Compiler Design',
    semester: '6th Semester (Sec A)',
    room: 'Room 205, Block B',
    absentFaculty: 'Prof. Ananya Roy',
    reason: 'University Senate Meeting',
    status: 'Completed',
    assignedTo: 'Dr. Manish Verma',
    urgency: 'Normal',
    suggestedFaculty: ['Dr. Manish Verma']
  }
];

export const INITIAL_APPROVALS = [
  {
    id: 'APP-501',
    title: 'Prasunethon 2.0 Hackathon Hardware & Logistics Budget',
    requester: 'Krrish Kumar Tanti',
    requesterRole: 'President, Student Tech Council',
    enrollment: '04214802722',
    category: 'Budget Allocation',
    amount: '₹45,000',
    department: 'CSE Department',
    submissionDate: '21 Aug 2026',
    status: 'Pending',
    urgency: 'High',
    description: 'Procurement of 20x ESP32 BLE Beacon nodes, Raspberry Pi gateways, fast IoT cables, and refreshments for 250 participants in the Annual 24-hr Hackathon.',
    documents: ['Budget_Breakdown_Prasunethon.pdf', 'Vendor_Hardware_Quotations.pdf'],
    signatureHash: null,
    signedAt: null,
    signedBy: null
  },
  {
    id: 'APP-502',
    title: 'On-Duty (OD) Leave for Smart India Hackathon Grand Finale',
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
    description: 'Selected for National Grand Finale of Smart India Hackathon 2026 at IIT Bombay nodal center. Requesting official attendance waiver for 6 lecture sessions.',
    documents: ['SIH_Official_Selection_Letter.pdf', 'Train_Travel_Ticket.pdf'],
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
    description: 'Procurement of GPU compute node server for final year B.Tech AI Capstone projects and faculty LLM fine-tuning research.',
    documents: ['GPU_Lab_Grant_Proposal_v3.pdf', 'Dell_HPC_Invoice.pdf'],
    signatureHash: 'RSA-HOD-CSE-0x9F42A7C8E2',
    signedAt: '19 Aug 2026, 02:30 PM',
    signedBy: 'Prof. S. K. Naitik (HOD)'
  },
  {
    id: 'APP-504',
    title: 'IEEE International Conference Registration & Travel Waiver',
    requester: 'Dr. Priya Sen',
    requesterRole: 'Assistant Professor',
    enrollment: 'FAC-1095',
    category: 'Faculty Conference Grant',
    amount: '₹18,500',
    department: 'CSE Department',
    submissionDate: '15 Aug 2026',
    status: 'Approved',
    urgency: 'Normal',
    description: 'Presenting research paper on "Federated Learning in Edge-BLE Campus Networks" at IEEE ICACCI Singapore.',
    documents: ['IEEE_Acceptance_Letter.pdf', 'Registration_Receipt.pdf'],
    signatureHash: 'RSA-HOD-CSE-0x7C118B44D9',
    signedAt: '16 Aug 2026, 10:15 AM',
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

export const FACULTY_DIRECTORY = [
  {
    id: 'FAC-01',
    name: 'Dr. Manish Verma',
    designation: 'Associate Professor',
    department: 'CSE',
    subject: 'Operating Systems & Linux Kernel',
    experience: '12 Years',
    rating: '4.9/5.0',
    email: 'manish.verma@adgitm.ac.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    availableTime: 'Mon & Wed (2:00 PM - 4:00 PM)'
  },
  {
    id: 'FAC-02',
    name: 'Prof. S. K. Naitik',
    designation: 'HOD & Professor',
    department: 'CSE',
    subject: 'Cloud Architectures & AI Systems',
    experience: '18 Years',
    rating: '5.0/5.0',
    email: 'hod.cse@adgitm.ac.in',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    availableTime: 'Tue & Thu (11:00 AM - 1:00 PM)'
  },
  {
    id: 'FAC-03',
    name: 'Dr. Priya Sen',
    designation: 'Assistant Professor',
    department: 'CSE',
    subject: 'Database Systems & Big Data',
    experience: '8 Years',
    rating: '4.8/5.0',
    email: 'priya.sen@adgitm.ac.in',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    availableTime: 'Daily (3:00 PM - 5:00 PM)'
  },
  {
    id: 'FAC-04',
    name: 'Prof. Vikram Seth',
    designation: 'Professor',
    department: 'CSE',
    subject: 'Algorithms & Computational Complexity',
    experience: '15 Years',
    rating: '4.7/5.0',
    email: 'vikram.seth@adgitm.ac.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    availableTime: 'Mon & Fri (10:00 AM - 12:00 PM)'
  }
];

export const DataProvider = ({ children }) => {
  const [grievances, setGrievances] = useState(INITIAL_GRIEVANCES);
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [broadcasts, setBroadcasts] = useState(INITIAL_BROADCASTS);
  const [substitutions, setSubstitutions] = useState(INITIAL_SUBSTITUTIONS);
  const [approvals, setApprovals] = useState(INITIAL_APPROVALS);
  const [studentsRoster, setStudentsRoster] = useState(INITIAL_STUDENT_ROSTER);
  
  // Active classroom session
  const [activeSession, setActiveSession] = useState({
    subject: 'Operating Systems Lab (CSE-301)',
    room: 'Lab 204, Block A',
    code: 'EDUS-8492',
    beaconId: 'BLE_BEACON_CSE_LAB_204',
    faculty: 'Dr. Manish Verma',
    expiresInSeconds: 480,
    isActive: true,
    section: 'CSE-6A',
    txPower: '-59 dBm (Classroom Mesh)'
  });

  const [studentAttendanceRecord, setStudentAttendanceRecord] = useState([
    { subject: 'Operating Systems Lab', code: 'EDUS-8492', date: 'Today, 02:15 PM', status: 'Pending', verifiedVia: 'Bluetooth Proximity' },
    { subject: 'Computer Networks', code: 'EDUS-1194', date: '21 Aug 2026', status: 'Present', verifiedVia: 'BLE + Passcode' },
    { subject: 'Cloud Computing', code: 'EDUS-6721', date: '20 Aug 2026', status: 'Present', verifiedVia: 'BLE + Passcode' },
    { subject: 'Web Technologies', code: 'EDUS-3398', date: '19 Aug 2026', status: 'Present', verifiedVia: 'BLE + Passcode' }
  ]);

  // Grievance Handlers
  const addGrievance = (newGrievance) => {
    setGrievances(prev => [newGrievance, ...prev]);
  };

  const updateGrievanceStatus = (id, newStatus, resolutionNotes = '') => {
    setGrievances(prev => prev.map(g => g.id === id ? { ...g, status: newStatus, resolutionNotes: resolutionNotes || g.resolutionNotes } : g));
  };

  // Notes Publisher Handlers
  const addNote = (newNote) => {
    setNotes(prev => [newNote, ...prev]);
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // Broadcast Transmitter Handlers
  const addBroadcast = (newBroadcast) => {
    setBroadcasts(prev => [newBroadcast, ...prev]);
  };

  const deleteBroadcast = (id) => {
    setBroadcasts(prev => prev.filter(b => b.id !== id));
  };

  // Substitution Engine Handlers
  const assignSubstitution = (subId, facultyName) => {
    setSubstitutions(prev => prev.map(s => s.id === subId ? { ...s, status: 'Assigned', assignedTo: facultyName } : s));
  };

  // Digital Approvals Handlers
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

  // Teacher Attendance Studio Handlers
  const updateStudentRosterStatus = (studentId, nextStatus) => {
    setStudentsRoster(prev => prev.map(s => {
      if (s.id === studentId) {
        const status = nextStatus || (s.status === 'present' ? 'absent' : s.status === 'absent' ? 'leave' : 'present');
        return {
          ...s,
          status,
          verifiedAt: status === 'present' ? 'Just now (Teacher Override)' : s.verifiedAt
        };
      }
      return s;
    }));
  };

  const markAllStudents = (statusToSet = 'present') => {
    setStudentsRoster(prev => prev.map(s => ({
      ...s,
      status: statusToSet,
      verifiedAt: statusToSet === 'present' ? 'Quick Override (All)' : '-'
    })));
  };

  const generateNewPasscode = () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const newCode = `EDUS-${randomDigits}`;
    setActiveSession(prev => ({
      ...prev,
      code: newCode,
      expiresInSeconds: 480
    }));
    return newCode;
  };

  const toggleBeaconActive = () => {
    setActiveSession(prev => ({
      ...prev,
      isActive: !prev.isActive
    }));
  };

  // Student Attendance Handshake Handler
  const markStudentAttendance = (codeEntered) => {
    if (codeEntered.trim().toUpperCase() === activeSession.code) {
      setStudentAttendanceRecord(prev => [
        {
          subject: activeSession.subject,
          code: activeSession.code,
          date: 'Just now (Today)',
          status: 'Present',
          verifiedVia: 'BLE Proximity + Verified Passcode'
        },
        ...prev.filter(r => r.code !== activeSession.code)
      ]);

      // Also reflect in teacher live roster for Krrish (id: '1')
      setStudentsRoster(prev => prev.map(s => s.id === '1' ? { ...s, status: 'present', bleRssi: '-39 dBm (0.7m)', verifiedAt: 'Just now' } : s));

      return { success: true, message: 'Attendance recorded successfully via Anti-Proxy BLE!' };
    } else {
      return { success: false, message: 'Invalid room passcode. Check the lecturer display screen.' };
    }
  };

  return (
    <DataContext.Provider value={{
      grievances,
      addGrievance,
      updateGrievanceStatus,
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
      studentsRoster,
      setStudentsRoster,
      updateStudentRosterStatus,
      markAllStudents,
      generateNewPasscode,
      toggleBeaconActive,
      facultyDirectory: FACULTY_DIRECTORY,
      activeSession,
      setActiveSession,
      studentAttendanceRecord,
      markStudentAttendance
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

