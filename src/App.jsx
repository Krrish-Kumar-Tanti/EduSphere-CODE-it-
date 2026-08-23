import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import HodDashboard from './pages/hod/HodDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';
import EduBot from './components/Chatbot/EduBot';
import GlobalAlertBanner from './components/GlobalAlertBanner';
import DirectChatDrawer from './components/DirectChatDrawer';
import IncomingChatToast from './components/IncomingChatToast';

function AppContent() {
  const { currentUser, isAuthenticated } = useAuth();
  const { registerTabUser } = useData();

  React.useEffect(() => {
    if (currentUser && registerTabUser) {
      registerTabUser(currentUser);
    }
  }, [currentUser, registerTabUser]);

  if (!isAuthenticated || !currentUser) {
    return <Login />;
  }

  const role = currentUser?.role?.toLowerCase();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Global Emergency Alert Banner for Urgent Broadcasts */}
      <GlobalAlertBanner />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Role-Based Dashboard View with Safe Fallback */}
      <main className="flex-1">
        {role === 'student' && <StudentDashboard />}
        {role === 'teacher' && <TeacherDashboard />}
        {role === 'hod' && <HodDashboard />}
        {role === 'staff' && <StaffDashboard />}
        {!['student', 'teacher', 'hod', 'staff'].includes(role) && <StudentDashboard />}
      </main>

      {/* WhatsApp-Style 1-on-1 Direct Messaging Drawer & Floating Toast */}
      <DirectChatDrawer />
      <IncomingChatToast />

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
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
