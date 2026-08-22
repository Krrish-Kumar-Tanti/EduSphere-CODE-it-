import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import confetti from 'canvas-confetti';
import { 
  ACADEMIC_DISCIPLINES, 
  SEMESTERS, 
  getSubjectsForBranchAndSemester 
} from '../../data/ggsipuData';
import { 
  BookOpen, 
  UploadCloud, 
  FileText, 
  Trash2, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  FileCheck, 
  Tag, 
  Layers,
  Search,
  ExternalLink,
  GraduationCap
} from 'lucide-react';

export default function NotesPublisher() {
  const { currentUser } = useAuth();
  const { notes, addNote, deleteNote } = useData();

  const [discipline, setDiscipline] = useState('Computer Science & Engineering (CSE)');
  const [semester, setSemester] = useState('6th Semester (Year 3)');
  const [subjectList, setSubjectList] = useState([]);
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [unit, setUnit] = useState('Unit 4: Memory & Scheduling');
  const [fileFormat, setFileFormat] = useState('PDF');
  const [fileSize, setFileSize] = useState('5.6 MB');
  const [fileName, setFileName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Dynamically load subjects when branch or semester changes
  useEffect(() => {
    const subjects = getSubjectsForBranchAndSemester(discipline, semester);
    setSubjectList(subjects);
    if (subjects.length > 0) {
      setSubject(subjects[0]);
    }
  }, [discipline, semester]);

  const handleSimulateFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${sizeMb > 0 ? sizeMb : '2.4'} MB`);
      const ext = file.name.split('.').pop().toUpperCase();
      setFileFormat(ext || 'PDF');
    }
  };

  const handlePublishNote = (e) => {
    e.preventDefault();
    if (!title.trim() || !subject) return;

    const newNote = {
      id: `NOTE-${Math.floor(100 + Math.random() * 900)}`,
      subject: `${subject} (${discipline.split('(')[1]?.replace(')', '') || 'ENG'})`,
      faculty: currentUser?.name || 'Dr. Manish Verma',
      title: `${unit}: ${title}`,
      fileSize: fileSize || '4.2 MB',
      uploadDate: 'Just now (Today)',
      downloadUrl: '#',
      semester,
      format: fileFormat,
      downloads: 0
    };

    addNote(newNote);
    setIsSuccess(true);
    setTitle('');
    setFileName('');

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#10B981', '#38BDF8', '#818CF8']
    });

    setTimeout(() => setIsSuccess(false), 3500);
  };

  const filteredNotes = notes.filter(n => 
    n.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.semester?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Academic Vault Publisher (Semesters 1–8)
            </span>
            <span className="text-xs text-slate-500 font-medium">Syncs across all open tabs via BroadcastChannel</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Publish Study Materials & Lecture Notes</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Empower students across all engineering branches and semesters with instant access to lecture slides, question banks, and lab manuals.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Total Documents Active</span>
          <span className="text-lg font-bold text-emerald-600">{notes.length} PDF / PPT Materials</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Publish New Note */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-emerald-600" />
              Upload New Course Material
            </h3>

            <form onSubmit={handlePublishNote} className="space-y-4 text-xs">
              
              {/* Discipline / Branch Selector */}
              <div>
                <label className="text-slate-700 font-bold block mb-1.5">Target Discipline / Department:</label>
                <select
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none font-medium"
                >
                  {ACADEMIC_DISCIPLINES.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Semester & Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1.5">Target Semester:</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none font-medium"
                  >
                    {SEMESTERS.map(sem => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1.5">Unit / Module:</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g. Unit 4"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none font-medium"
                  />
                </div>
              </div>

              {/* Dynamic Subject Selector based on Discipline & Semester */}
              <div>
                <label className="text-slate-700 font-bold block mb-1.5">Subject / Course Module:</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none font-medium"
                >
                  {subjectList.map((sub, idx) => (
                    <option key={idx} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Lecture Title */}
              <div>
                <label className="text-slate-700 font-bold block mb-1.5">Lecture / Topic Title:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Memory Management & Deadlock Solved Examples"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none placeholder-slate-400 font-medium"
                />
              </div>

              {/* File Attachment Drag & Drop */}
              <div>
                <label className="text-slate-700 font-bold block mb-1.5">Attach PDF / PPTX Document:</label>
                <label className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50 transition group">
                  <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 transition" />
                  <span className="text-xs font-bold text-slate-800 mt-2">
                    {fileName ? fileName : 'Click to choose or drop PDF file'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    {fileName ? `Calculated size: ${fileSize} • Format: ${fileFormat}` : 'Supports PDF, PPTX, DOCX (Max 25MB)'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.pptx,.ppt,.docx"
                    onChange={handleSimulateFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Success Feedback Banner */}
              {isSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Document published live! Students can now view & download it.</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>Publish to Student Portal</span>
              </button>

            </form>
          </div>
        </div>

        {/* Right List: Published Notes Catalog */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-indigo-600" />
                  Live Published Vault ({filteredNotes.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">All active materials accessible by students</p>
              </div>

              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search materials..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none placeholder-slate-400"
                />
              </div>
            </div>

            {/* Notes Cards */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredNotes.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs font-semibold">No course materials matched your query.</p>
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-400 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-emerald-600 mt-0.5 shadow-xs">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
                            {note.semester}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {note.format || 'PDF'} • {note.fileSize}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">{note.subject}</h4>
                        <p className="text-slate-600 text-xs mt-0.5 font-medium">{note.title}</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          By {note.faculty} • Uploaded {note.uploadDate} • {note.downloads || 0} Downloads
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => alert(`Simulating download of ${note.title}...`)}
                        className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition shadow-xs"
                        title="Download Preview"
                      >
                        <Download className="w-4 h-4 text-indigo-600" />
                      </button>

                      {deleteConfirmId === note.id ? (
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-rose-200 shadow-xs">
                          <button
                            onClick={() => {
                              deleteNote(note.id);
                              setDeleteConfirmId(null);
                            }}
                            className="px-2 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] hover:bg-rose-700 transition"
                          >
                            Confirm Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] hover:bg-slate-200 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(note.id)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition shadow-xs"
                          title="Delete Note"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


