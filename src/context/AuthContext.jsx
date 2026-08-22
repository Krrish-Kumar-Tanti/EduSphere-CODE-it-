import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const DEMO_USERS = {
  student: {
    id: 'STU-2026-8842',
    name: 'Krrish Kumar Tanti',
    role: 'student',
    email: 'krrish.tanti@adgitm.ac.in',
    enrollment: '04214802722',
    department: 'Computer Science & Engineering',
    semester: '6th Semester',
    section: 'CSE-A',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    bloodGroup: 'O+ positive',
    validUpto: 'June 2026',
    attendanceOverall: 88.4,
    cgpa: '8.92'
  },
  teacher: {
    id: 'FAC-1092',
    name: 'Dr. Manish Verma',
    role: 'teacher',
    email: 'manish.verma@adgitm.ac.in',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    subjects: ['Operating Systems', 'Cloud Computing', 'Computer Networks']
  },
  hod: {
    id: 'HOD-001',
    name: 'Prof. S. K. Naitik',
    role: 'hod',
    email: 'hod.cse@adgitm.ac.in',
    department: 'Department of Computer Science',
    designation: 'Head of Department',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    cabin: 'Room 304, Admin Block 2'
  },
  staff: {
    id: 'STF-504',
    name: 'Rajesh Sharma',
    role: 'staff',
    email: 'rajesh.facilities@adgitm.ac.in',
    department: 'Ground Operations & Maintenance',
    subDomain: 'Campus Infrastructure & Cleanliness',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    badgeLevel: 'Lead Supervisor'
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('edusphere_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.student;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('edusphere_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('edusphere_user');
    }
  }, [currentUser]);

  const login = (role = 'student') => {
    const user = DEMO_USERS[role] || DEMO_USERS.student;
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const switchRole = (role) => {
    if (DEMO_USERS[role]) {
      setCurrentUser(DEMO_USERS[role]);
      setIsAuthenticated(true);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
