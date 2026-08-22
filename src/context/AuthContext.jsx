import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_BASE = 'http://localhost:5001/api';

export const DEMO_USERS = {
  student: {
    id: 'STU-2026-8842',
    name: 'Krrish Kumar Tanti',
    role: 'student',
    email: 'krrish.tanti@adgitm.ac.in',
    enrollment: '04214802722',
    college: 'ADGITM (Dr. Akhilesh Das Gupta Institute of Technology & Management)',
    department: 'Computer Science & Engineering (CSE)',
    semester: '6th Semester (Year 3)',
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
    enrollment: 'FAC-1092',
    college: 'ADGITM (Dr. Akhilesh Das Gupta Institute of Technology & Management)',
    department: 'Computer Science & Engineering (CSE)',
    designation: 'Associate Professor',
    semester: 'Faculty',
    section: 'CSE-A',
    bloodGroup: 'B+ positive',
    validUpto: 'Permanent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    subjects: ['Operating Systems', 'Cloud Computing', 'Computer Networks']
  },
  hod: {
    id: 'HOD-001',
    name: 'Prof. S. K. Naitik',
    role: 'hod',
    email: 'hod.cse@adgitm.ac.in',
    enrollment: 'HOD-001',
    college: 'ADGITM (Dr. Akhilesh Das Gupta Institute of Technology & Management)',
    department: 'Department of Computer Science',
    designation: 'Head of Department',
    semester: 'HOD Office',
    section: 'All',
    bloodGroup: 'A+ positive',
    validUpto: 'Permanent',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    cabin: 'Room 304, Admin Block 2'
  },
  staff: {
    id: 'STF-504',
    name: 'Rajesh Sharma',
    role: 'staff',
    email: 'rajesh.facilities@adgitm.ac.in',
    enrollment: 'STF-504',
    college: 'ADGITM (Dr. Akhilesh Das Gupta Institute of Technology & Management)',
    department: 'Ground Operations & Maintenance',
    subDomain: 'Campus Infrastructure & Cleanliness',
    semester: 'Staff',
    section: 'Campus',
    bloodGroup: 'AB+ positive',
    validUpto: 'Permanent',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    badgeLevel: 'Lead Supervisor'
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedStudent = localStorage.getItem('edusphere_student_profile');
    if (savedStudent) {
      try {
        return JSON.parse(savedStudent);
      } catch (e) {}
    }
    const saved = localStorage.getItem('edusphere_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.student;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('edusphere_user', JSON.stringify(currentUser));
      if (currentUser.role === 'student') {
        localStorage.setItem('edusphere_student_profile', JSON.stringify(currentUser));
      }
    } else {
      localStorage.removeItem('edusphere_user');
    }
  }, [currentUser]);

  // Login method with backend API sync
  const login = async (role = 'student', credentials = null) => {
    try {
      if (credentials) {
        const res = await fetch(`${API_BASE}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentUser(data.user);
          if (data.user.role === 'student') {
            localStorage.setItem('edusphere_student_profile', JSON.stringify(data.user));
          }
          setIsAuthenticated(true);
          return { success: true, user: data.user };
        }
      }
    } catch (e) {
      console.warn('Backend offline, using fallback auth:', e);
    }

    // If logging in as student and we have a custom saved student profile with photo, use it!
    if (role === 'student') {
      const savedStudent = localStorage.getItem('edusphere_student_profile');
      if (savedStudent) {
        const parsed = JSON.parse(savedStudent);
        setCurrentUser(parsed);
        setIsAuthenticated(true);
        return { success: true, user: parsed };
      }
    }

    const user = DEMO_USERS[role] || DEMO_USERS.student;
    setCurrentUser(user);
    setIsAuthenticated(true);
    return { success: true, user };
  };

  // Register a brand new student with real info & uploaded photo
  const register = async (studentData) => {
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        localStorage.setItem('edusphere_student_profile', JSON.stringify(data.user));
        setIsAuthenticated(true);
        return { success: true, user: data.user };
      }
    } catch (e) {
      console.warn('Backend register offline, creating local profile:', e);
    }

    const localUser = {
      id: `STU-${Date.now().toString().slice(-4)}`,
      name: studentData.name,
      email: studentData.email || `${studentData.name.toLowerCase().replace(/\s+/g, '.')}@adgitm.ac.in`,
      role: 'student',
      enrollment: studentData.enrollment || '04214802722',
      college: studentData.college || 'ADGITM (Dr. Akhilesh Das Gupta Institute of Technology & Management)',
      department: studentData.department || 'Computer Science & Engineering (CSE)',
      semester: studentData.semester || '6th Semester (Year 3)',
      section: studentData.section || 'CSE-A',
      bloodGroup: studentData.bloodGroup || 'O+ positive',
      validUpto: studentData.validUpto || 'June 2026',
      avatar: studentData.avatar || DEMO_USERS.student.avatar,
      cgpa: studentData.cgpa || '8.50',
      attendanceOverall: 88.4
    };

    setCurrentUser(localUser);
    localStorage.setItem('edusphere_student_profile', JSON.stringify(localUser));
    setIsAuthenticated(true);
    return { success: true, user: localUser };
  };

  // Update user profile and ID card information dynamically
  const updateUserProfile = async (updatedFields) => {
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);

    if (updated.role === 'student') {
      localStorage.setItem('edusphere_student_profile', JSON.stringify(updated));
    }

    try {
      if (currentUser?.id) {
        await fetch(`${API_BASE}/user/${currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedFields)
        });
      }
    } catch (e) {
      console.warn('Backend update sync error:', e);
    }

    return updated;
  };

  // Upload user photo to backend server or Base64
  const uploadPhoto = async (file) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const res = await fetch(`${API_BASE}/upload-avatar`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        return data.url;
      }
    } catch (e) {
      console.warn('Photo upload server error, converting to base64:', e);
    }

    // Fallback: convert file to local Base64 data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Switch role without wiping student custom profile & photo
  const switchRole = (role) => {
    if (role === 'student') {
      const savedStudent = localStorage.getItem('edusphere_student_profile');
      if (savedStudent) {
        try {
          const parsed = JSON.parse(savedStudent);
          setCurrentUser(parsed);
          setIsAuthenticated(true);
          return;
        } catch (e) {}
      }
    } else {
      // If currently on student, save active student profile first before switching
      if (currentUser && currentUser.role === 'student') {
        localStorage.setItem('edusphere_student_profile', JSON.stringify(currentUser));
      }
    }

    if (DEMO_USERS[role]) {
      setCurrentUser(DEMO_USERS[role]);
      setIsAuthenticated(true);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isAuthenticated, 
      login, 
      register, 
      logout, 
      switchRole, 
      updateUserProfile, 
      uploadPhoto 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
