import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import StudentDashboard from './pages/student/StudentDashboard';
import { ArrowLeft, GitBranch, Sparkles } from 'lucide-react';

function AppContent() {
  const { currentUser, isAuthenticated, switchRole } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Student Portal or Teammate Module Placeholder */}
      <main className="flex-1">
        {currentUser.role === 'student' ? (
          <StudentDashboard />
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-16 text-center">
            <div className="glass-panel-elevated p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600 mb-6 shadow-sm">
                <GitBranch className="w-8 h-8" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Teammate Module Allocation
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {currentUser.role === 'teacher' && 'Faculty & Teacher Portal'}
                {currentUser.role === 'hod' && 'HOD Command Console'}
                {currentUser.role === 'staff' && 'Operations & Ground Staff'}
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                This module is assigned to <strong className="text-slate-800">Manish</strong> and is being developed on branch <code className="px-2 py-0.5 rounded bg-slate-100 font-mono text-xs text-indigo-600 border border-slate-200">feature/faculty-hod-staff</code>.
              </p>
              <button
                onClick={() => switchRole('student')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition shadow-md shadow-indigo-600/20"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Krrish's Student Portal</span>
              </button>
            </div>
          </div>
        )}
      </main>

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
