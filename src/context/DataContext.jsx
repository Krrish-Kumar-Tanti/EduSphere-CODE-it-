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
    assignedTo: 'Ground Maintenance Team'
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
    assignedTo: 'HOD Academic Committee'
  },
  {
    id: 'GRV-903',
    studentName: 'Aryan Sharma',
    studentEnrollment: '04214802723',
    isAnonymous: false,
    title: 'Canteen Water Dispenser Filter',
    category: 'Cleaning & Hygiene',
    destination: 'staff',
    priority: 'High',
    description: 'Block B Ground Floor water cooler display indicates filter replacement due.',
    imageUrl: 'https://images.unsplash.com/photo-1546768292-fb12f6c92568?auto=format&fit=crop&q=80&w=600',
    status: 'Resolved',
    timestamp: '2 days ago',
    assignedTo: 'Hygiene Department'
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
    semester: '6th Semester'
  },
  {
    id: 'NOTE-102',
    subject: 'Computer Networks (CSE-303)',
    faculty: 'Prof. Ananya Roy',
    title: 'TCP/IP Flow Control & Congestion Management PPTs',
    fileSize: '12.4 MB',
    uploadDate: '20 Aug 2026',
    downloadUrl: '#',
    semester: '6th Semester'
  },
  {
    id: 'NOTE-103',
    subject: 'Cloud Computing & DevOps (CSE-305)',
    faculty: 'Dr. S. K. Naitik',
    title: 'Kubernetes Pod Scheduling & Docker Hands-on Lab Manual',
    fileSize: '8.1 MB',
    uploadDate: '19 Aug 2026',
    downloadUrl: '#',
    semester: '6th Semester'
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
    isUrgent: true
  },
  {
    id: 'BC-02',
    sender: 'Ground Security & Operations',
    role: 'Staff',
    title: '📡 BLE Beacon Calibration at Block 3',
    message: 'Proximity beacons in Labs 301-305 upgraded to DTU-style ultra-low latency mesh.',
    time: '2 hours ago',
    isUrgent: false
  }
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
  }
];

export const DataProvider = ({ children }) => {
  const [grievances, setGrievances] = useState(INITIAL_GRIEVANCES);
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [broadcasts, setBroadcasts] = useState(INITIAL_BROADCASTS);
  
  // Active classroom session
  const [activeSession, setActiveSession] = useState({
    subject: 'Operating Systems Lab (CSE-301)',
    room: 'Lab 204, Block A',
    code: 'EDUS-8492',
    beaconId: 'BLE_BEACON_CSE_LAB_204',
    faculty: 'Dr. Manish Verma',
    expiresInSeconds: 480,
    isActive: true
  });

  const [studentAttendanceRecord, setStudentAttendanceRecord] = useState([
    { subject: 'Operating Systems Lab', code: 'EDUS-8492', date: 'Today, 02:15 PM', status: 'Pending', verifiedVia: 'Bluetooth Proximity' },
    { subject: 'Computer Networks', code: 'EDUS-1194', date: '21 Aug 2026', status: 'Present', verifiedVia: 'BLE + Passcode' },
    { subject: 'Cloud Computing', code: 'EDUS-6721', date: '20 Aug 2026', status: 'Present', verifiedVia: 'BLE + Passcode' },
    { subject: 'Web Technologies', code: 'EDUS-3398', date: '19 Aug 2026', status: 'Present', verifiedVia: 'BLE + Passcode' }
  ]);

  const addGrievance = (newGrievance) => {
    setGrievances(prev => [newGrievance, ...prev]);
  };

  const updateGrievanceStatus = (id, newStatus) => {
    setGrievances(prev => prev.map(g => g.id === id ? { ...g, status: newStatus } : g));
  };

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
      broadcasts,
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
