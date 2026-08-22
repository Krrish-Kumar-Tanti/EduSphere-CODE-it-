import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import HodDashboard from './pages/hod/HodDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';
import EduBot from './components/Chatbot/EduBot';

function AppContent() {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Role-Based Dashboard View */}
      <main className="flex-1">
        {currentUser.role === 'student' && <StudentDashboard />}
        {currentUser.role === 'teacher' && <TeacherDashboard />}
        {currentUser.role === 'hod' && <HodDashboard />}
        {currentUser.role === 'staff' && <StaffDashboard />}
      </main>

      {/* Global Roaming Context-Aware AI Campus Companion */}
      <EduBot />

      {/* Clean Portal Footer */}
      <footer className="border-t border-slate-200/80 py-6 text-center text-xs text-slate-500 bg-white/50 backdrop-blur-sm">
        <p>EduSphere © 2026 • Smart Campus Operating System • Team CODE it</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
