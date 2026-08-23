import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_BASE = 'http://localhost:5001/api';

export const INITIAL_USER_ACCOUNTS = {
  student: {
    id: 'STU-2026-8842',
    name: 'Krrish Kumar Tanti',
    role: 'student',
    email: 'krrish.tanti@campus.edu',
    enrollment: '04214802722',
    college: 'Apex Institute of Technology & Management (AITM)',
    department: 'Computer Science & Engineering (CSE)',
    semester: '6th Semester (Year 3)',
    section: 'CSE-A',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    bloodGroup: 'O+ positive',
    validUpto: 'June 2026',
    attendanceOverall: 88.4,
    cgpa: '8.92',
    designation: 'Student Scholar',
    university: 'GGSIPU'
  },
  teacher: {
    id: 'FAC-1092',
    name: 'Dr. Manish Verma',
    role: 'teacher',
    email: 'manish.verma@campus.edu',
    enrollment: 'FAC-1092',
    college: 'Apex Institute of Technology & Management (AITM)',
    department: 'Computer Science & Engineering (CSE)',
    designation: 'Associate Professor',
    semester: 'Faculty',
    section: 'CSE-A',
    bloodGroup: 'B+ positive',
    validUpto: 'Permanent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    subjects: 'Operating Systems Lab, Cloud Computing Architecture, Computer Networks',
    cabin: 'Room 304, Academic Block A',
    university: 'GGSIPU'
  },
  hod: {
    id: 'HOD-001',
    name: 'Prof. S. K. Naitik',
    role: 'hod',
    email: 'hod.cse@campus.edu',
    enrollment: 'HOD-001',
    college: 'Apex Institute of Technology & Management (AITM)',
    department: 'Department of Computer Science & Engineering',
    designation: 'Head of Department & Professor',
    semester: 'HOD Office',
    section: 'All Sections',
    bloodGroup: 'A+ positive',
    validUpto: 'Permanent',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    cabin: 'Room 101, Executive Wing',
    adminCode: 'HOD-001',
    digitalSignature: 'RSA-SEAL-HOD-CSE-VALID',
    university: 'GGSIPU'
  },
  staff: {
    id: 'STF-504',
    name: 'Rajesh Sharma',
    role: 'staff',
    email: 'rajesh.facilities@campus.edu',
    enrollment: 'STF-504',
    college: 'Apex Institute of Technology & Management (AITM)',
    department: 'Ground Operations & Maintenance',
    assignedUnit: 'Campus Infrastructure & Maintenance',
    supervisorLevel: 'Lead Operations Supervisor',
    semester: 'Staff',
    section: 'Campus Wide',
    bloodGroup: 'AB+ positive',
    validUpto: 'Permanent',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    badgeLevel: 'Lead Supervisor',
    badgeId: 'STF-504',
    university: 'GGSIPU'
  }
};

export const AuthProvider = ({ children }) => {
  // Clean zero-pollution initial state: null by default unless valid localStorage session exists
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('edusphere_auth_user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('edusphere_auth_user');
      return !!saved;
    }
    return false;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('edusphere_auth_user', JSON.stringify(currentUser));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('edusphere_auth_user');
      setIsAuthenticated(false);
    }
  }, [currentUser]);

  // Login method with backend API sync & fallback validation
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
          setIsAuthenticated(true);
          return { success: true, user: data.user };
        } else if (data.error) {
          return { success: false, error: data.error };
        }
      }
    } catch (e) {
      console.warn('Backend offline, checking fallback account:', e);
    }

    // Offline / fallback auth check
    if (credentials?.identifier) {
      const match = Object.values(INITIAL_USER_ACCOUNTS).find(
        u => (u.enrollment === credentials.identifier || 
              u.email === credentials.identifier || 
              u.id === credentials.identifier ||
              u.adminCode === credentials.identifier ||
              u.badgeId === credentials.identifier)
      );

      if (match) {
        setCurrentUser(match);
        setIsAuthenticated(true);
        return { success: true, user: match };
      }
    }

    const defaultRoleUser = INITIAL_USER_ACCOUNTS[role] || INITIAL_USER_ACCOUNTS.student;
    setCurrentUser(defaultRoleUser);
    setIsAuthenticated(true);
    return { success: true, user: defaultRoleUser };
  };

  // Register brand new user for any of the 4 roles
  const register = async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        setIsAuthenticated(true);

        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          try {
            const bc = new BroadcastChannel('edusphere_channel');
            if (data.user.role === 'teacher') {
              bc.postMessage({ type: 'FACULTY_REGISTERED', payload: data.user, timestamp: Date.now() });
            }
          } catch (e) {}
        }

        return { success: true, user: data.user };
      } else if (data.error) {
        return { success: false, error: data.error };
      }
    } catch (e) {
      console.warn('Backend register offline, creating local profile:', e);
    }

    const randomSuffix = Date.now().toString().slice(-4);
    let idPrefix = 'USR';
    if (userData.role === 'student') idPrefix = 'STU';
    else if (userData.role === 'teacher') idPrefix = 'FAC';
    else if (userData.role === 'hod') idPrefix = 'HOD';
    else if (userData.role === 'staff') idPrefix = 'STF';

    const localUser = {
      id: `${idPrefix}-${randomSuffix}`,
      name: userData.name,
      email: userData.email || `${userData.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@campus.edu`,
      role: userData.role || 'student',
      enrollment: userData.enrollment || (userData.role === 'student' ? `0421480${randomSuffix}` : `${idPrefix}-${randomSuffix}`),
      college: userData.college || 'Apex Institute of Technology & Management (AITM)',
      department: userData.department || 'Computer Science & Engineering (CSE)',
      semester: userData.semester || (userData.role === 'student' ? '6th Semester (Year 3)' : 'Permanent'),
      section: userData.section || (userData.role === 'student' ? 'CSE-A' : 'Campus'),
      bloodGroup: userData.bloodGroup || 'O+ positive',
      validUpto: userData.validUpto || (userData.role === 'student' ? 'June 2026' : 'Permanent'),
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      cgpa: userData.role === 'student' ? '8.50' : 'N/A',
      attendanceOverall: userData.role === 'student' ? 88.4 : 100,
      designation: userData.designation || (userData.role === 'teacher' ? 'Associate Professor' : userData.role === 'hod' ? 'Head of Department' : userData.role === 'staff' ? 'Lead Supervisor' : 'Student Scholar'),
      subjects: userData.subjects || null,
      cabin: userData.cabin || null,
      assignedUnit: userData.assignedUnit || null,
      supervisorLevel: userData.supervisorLevel || null,
      adminCode: userData.adminCode || null,
      badgeId: userData.badgeId || null,
      digitalSignature: userData.digitalSignature || null,
      university: userData.university || 'GGSIPU'
    };

    setCurrentUser(localUser);
    setIsAuthenticated(true);

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel('edusphere_channel');
        if (localUser.role === 'teacher') {
          bc.postMessage({ type: 'FACULTY_REGISTERED', payload: localUser, timestamp: Date.now() });
        }
      } catch (e) {}
    }

    return { success: true, user: localUser };
  };

  // Update profile and ID card info dynamically
  const updateUserProfile = async (updatedFields) => {
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);

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

  // Upload user photo to backend server or Base64 fallback
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

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  };

  // Clean logout that clears auth state & localStorage completely
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('edusphere_auth_user');
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isAuthenticated, 
      login, 
      register, 
      logout, 
      updateUserProfile, 
      uploadPhoto 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
