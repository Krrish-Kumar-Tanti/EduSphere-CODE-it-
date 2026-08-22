import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  BookOpen, 
  Download, 
  Search, 
  UserCheck, 
  Star, 
  Clock, 
  FileText, 
  Folder, 
  Sparkles, 
  Mail, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export default function NotesFeed() {
  const { notes, facultyDirectory, broadcasts } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'faculty'

  const filteredNotes = notes.filter(n => 
    n.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.faculty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaculty = facultyDirectory.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Search & Filter Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm bg-white/90">
        
        {/* Tab switchers */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'notes'
                ? 'bg-white text-indigo-700 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Lecture Notes & PDFs</span>
          </button>
          <button
            onClick={() => setActiveTab('faculty')}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'faculty'
                ? 'bg-white text-indigo-700 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Faculty Directory</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'notes' ? "Search subject or PDF..." : "Search professor..."}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:border-indigo-600 focus:outline-none shadow-inner"
          />
        </div>

      </div>

      {activeTab === 'notes' ? (
        /* ========================================================
           NOTES FEED
           ======================================================== */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="glass-panel p-5 rounded-3xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {note.subject}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {note.fileSize}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2">
                  {note.title}
                </h4>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                  <span className="font-semibold text-slate-700">Prof:</span>
                  <span>{note.faculty}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">{note.semester}</span>
                <button
                  onClick={() => alert(`Downloading ${note.title} from campus repository.`)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition border border-indigo-200"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ========================================================
           FACULTY DIRECTORY
           ======================================================== */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFaculty.map((prof) => (
            <div
              key={prof.id}
              className="glass-panel p-5 rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-500 text-white font-bold text-base flex items-center justify-center shadow-md">
                    {prof.name.split(' ')[1]?.[0] || 'P'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{prof.name}</h4>
                    <p className="text-[11px] text-indigo-600 font-semibold">{prof.designation}</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600 mb-4">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Domain:</span>
                    <span className="font-bold text-slate-800">{prof.subject}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Office:</span>
                    <span>{prof.cabin}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 truncate max-w-[150px]">{prof.email}</span>
                <a
                  href={`mailto:${prof.email}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition border border-slate-200"
                >
                  <Mail className="w-3 h-3 text-indigo-600" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
