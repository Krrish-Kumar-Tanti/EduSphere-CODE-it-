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
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Faculty Directory ({facultyDirectory.length})</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'notes' ? "Search notes, subject, faculty..." : "Search professor or subject..."}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:border-indigo-600 focus:outline-none placeholder-slate-400 shadow-inner"
          />
        </div>

      </div>

      {/* Content Area */}
      {activeTab === 'notes' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.map((note) => (
            <div key={note.id} className="glass-panel p-5 rounded-3xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all flex flex-col justify-between group bg-white">
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px]">
                    {note.semester}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-medium">{note.fileSize}</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 group-hover:scale-105 transition">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition">
                      {note.subject}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                      {note.title}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Uploaded by:</span>
                  <span className="text-[11px] font-bold text-slate-700">{note.faculty}</span>
                </div>

                <button 
                  onClick={() => alert(`Downloading ${note.title}...`)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-600 text-slate-600 hover:text-white border border-slate-200 hover:border-indigo-600 transition shadow-sm"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFaculty.map((fac) => (
            <div key={fac.id} className="glass-panel p-6 rounded-3xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all bg-white">
              <div className="flex items-center gap-4">
                <img
                  src={fac.avatar}
                  alt={fac.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-200 shadow-md shadow-indigo-100"
                />
                <div>
                  <h4 className="text-sm font-black text-slate-900">{fac.name}</h4>
                  <p className="text-xs font-semibold text-indigo-600">{fac.designation}</p>
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{fac.rating} Scholar Score</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block">Core Subjects:</span>
                  <span className="font-bold text-slate-800">{fac.subject}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block">Office Consultation Hours:</span>
                  <span className="text-indigo-700 font-mono text-[11px] font-bold">{fac.availableTime}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500 font-medium">{fac.experience} Teaching Exp</span>
                <a
                  href={`mailto:${fac.email}`}
                  className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700"
                >
                  <Mail className="w-3 h-3" /> Connect
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
