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
  CheckCircle2,
  MessageSquareQuote,
  MessageCircle,
  Building,
  GraduationCap
} from 'lucide-react';

export default function NotesFeed() {
  const { notes, facultyDirectory, broadcasts, openDirectChat } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'faculty'

  const filteredNotes = notes.filter(n => 
    n.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.faculty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.semester?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaculty = facultyDirectory.filter(f => 
    f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.designation?.toLowerCase().includes(searchQuery.toLowerCase())
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
            <span>Lecture Notes & Vault ({notes.length})</span>
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
            <span>Faculty Directory ({facultyDirectory.length})</span>
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
            placeholder={activeTab === 'notes' ? "Search subject, semester or PDF..." : "Search professor, department or subject..."}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:border-indigo-600 focus:outline-none shadow-inner"
          />
        </div>

      </div>

      {activeTab === 'notes' ? (
        /* ========================================================
           NOTES FEED
           ======================================================== */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.length === 0 ? (
            <div className="col-span-full p-10 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
              <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-bold">No lecture materials found for "{searchQuery}".</p>
              <p className="text-xs text-slate-500 mt-1">Check back once your professors upload their slide decks.</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className="glass-panel p-5 rounded-3xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {note.subject}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">
                      {note.format || 'PDF'} • {note.fileSize}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2 leading-snug">
                    {note.title}
                  </h4>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                    <span className="font-semibold text-slate-700">Faculty:</span>
                    <span>{note.faculty}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">{note.semester}</span>
                  <button
                    onClick={() => alert(`Downloading ${note.title} directly to your device.`)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition border border-indigo-200 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* ========================================================
           FACULTY DIRECTORY
           ======================================================== */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFaculty.length === 0 ? (
            <div className="col-span-full p-10 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
              <UserCheck className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-bold">No faculty members found matching "{searchQuery}".</p>
            </div>
          ) : (
            filteredFaculty.map((prof) => (
              <div
                key={prof.id}
                className="glass-panel p-5 rounded-3xl border border-slate-200 bg-white shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={prof.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'}
                      alt={prof.name}
                      className="w-13 h-13 rounded-2xl object-cover border-2 border-indigo-100 shadow-sm"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">{prof.name}</h4>
                      <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">{prof.designation}</p>
                      <span className="inline-block text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 mt-1">
                        {prof.id}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Curriculum / Subjects:</span>
                      <span className="font-bold text-slate-800 line-clamp-1">{prof.subject}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Department & Cabin:</span>
                      <span className="font-medium text-slate-700">{prof.department} • {prof.cabin}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <a
                    href={`mailto:${prof.email}`}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition"
                    title={`Email ${prof.email}`}
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-600" />
                  </a>

                  {/* WhatsApp-Style 1-on-1 Direct Chat Trigger Button */}
                  <button
                    onClick={() => openDirectChat(prof)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>💬 Direct Chat</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}

