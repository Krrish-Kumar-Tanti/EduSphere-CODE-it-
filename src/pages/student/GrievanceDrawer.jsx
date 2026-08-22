import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  AlertTriangle, 
  Send, 
  Image as ImageIcon, 
  ShieldAlert, 
  EyeOff, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Wrench, 
  Sparkles, 
  UserX,
  X,
  FileText,
  Filter
} from 'lucide-react';

export default function GrievanceDrawer() {
  const { currentUser } = useAuth();
  const { grievances, addGrievance } = useData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [destination, setDestination] = useState('hod'); // 'hod' | 'staff'
  const [category, setCategory] = useState('Academic Concern');
  const [priority, setPriority] = useState('Medium');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const staffCategories = [
    'Maintenance & Infrastructure',
    'Cleaning & Sanitation',
    'Canteen & Food Hygiene',
    'Emergency Medical Cell',
    'Anti-Bullying & Ragging Hotline',
    'Wi-Fi & IT Lab Support'
  ];

  const hodCategories = [
    'Academic Concern & Syllabus Pace',
    'Lab Practical Equipment Quality',
    'Faculty Grading Retaliation / Discrepancy',
    'Leave & Attendance Discrepancy'
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newTicket = {
      id: `GRV-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: isAnonymous ? 'Anonymous Scholar' : currentUser.name,
      studentEnrollment: isAnonymous ? 'REDACTED-PRIVACY-SHIELD' : currentUser.enrollment,
      isAnonymous,
      title,
      category,
      destination,
      priority,
      description,
      imageUrl: imagePreview,
      status: 'In-Progress',
      timestamp: 'Just now (Today)',
      assignedTo: destination === 'hod' ? 'HOD Academic Committee' : category
    };

    addGrievance(newTicket);
    setShowSuccessToast(true);

    // Reset form
    setTitle('');
    setDescription('');
    setImagePreview(null);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const filteredGrievances = filterCategory === 'all' 
    ? grievances 
    : grievances.filter(g => g.destination === filterCategory);

  return (
    <div className="space-y-6">
      
      {/* Top Banner explaining Double-Escalation Triage */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-purple-950/40 to-slate-900 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-rose-200">
              Direct Zero-Bureaucracy Double-Escalation Desk
            </h4>
            <p className="text-xs text-slate-300">
              Route academic issues directly to the HOD (with grading anonymity) or ground issues straight to maintenance/medical staff.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold px-3 py-1 rounded-xl bg-slate-900 border border-rose-500/30 text-rose-300">
          🛡 Zero Retaliation Shield Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Complaint Creation Form */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 shadow-2xl relative">
            
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              File New Issue / Grievance Ticket
            </h3>

            {showSuccessToast && (
              <div className="mb-4 p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Ticket lodged and routed successfully with instant tracking token!</span>
                </div>
                <button onClick={() => setShowSuccessToast(false)}><X className="w-3.5 h-3.5" /></button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Step 1: Destination Selector (HOD vs Ground Staff) */}
              <div>
                <label className="text-slate-300 font-semibold block mb-2">
                  1. Choose Triage Routing Destination:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setDestination('hod');
                      setCategory('Academic Concern & Syllabus Pace');
                    }}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition ${
                      destination === 'hod'
                        ? 'bg-purple-950/50 border-purple-500/60 ring-2 ring-purple-500/20 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-purple-400 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-100 block">HOD Academic Office</span>
                      <span className="text-[10px] text-slate-400">Curriculum, faculty pace, leaves</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDestination('staff');
                      setCategory('Maintenance & Infrastructure');
                    }}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition ${
                      destination === 'staff'
                        ? 'bg-amber-950/50 border-amber-500/60 ring-2 ring-amber-500/20 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Wrench className="w-4 h-4 text-amber-400 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-100 block">Ground Operations Staff</span>
                      <span className="text-[10px] text-slate-400">AC, cleaning, anti-bullying, medical</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 2: Category & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1.5">
                    2. Specific Issue Domain:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    {(destination === 'hod' ? hodCategories : staffCategories).map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1.5">
                    Priority Urgency:
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Emergency / Urgent</option>
                  </select>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">
                  Subject / Summary:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lab 204 Air Conditioner Not Functioning"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">
                  Detailed Description & Exact Location:
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details (Room number, machine ID, symptoms)..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Image / Proof Attachment */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">
                  Attach Photo / Proof (Optional):
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 flex items-center gap-2 transition">
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                    <span>Upload Picture</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {imagePreview && (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-12 h-12 object-cover rounded-xl border border-cyan-500/50" />
                      <button 
                        type="button" 
                        onClick={() => setImagePreview(null)}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-600 rounded-full flex items-center justify-center text-white text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Anonymous Shield Toggle */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${isAnonymous ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>
                    <EyeOff className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-200 block">Anonymous Scholar Mode</span>
                    <span className="text-[10px] text-slate-400">
                      Hides your name & enrollment from faculty to prevent grading bias.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${isAnonymous ? 'bg-cyan-500' : 'bg-slate-800'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${isAnonymous ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition"
              >
                <Send className="w-4 h-4" />
                <span>Submit Grievance to {destination === 'hod' ? 'HOD Office' : 'Ground Staff'}</span>
              </button>

            </form>

          </div>

        </div>

        {/* Right Column: Live Track Tickets & Status Timeline */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Live Campus Ticket Queue
            </h4>

            {/* Filter */}
            <div className="flex items-center gap-1 text-[11px]">
              <button 
                onClick={() => setFilterCategory('all')} 
                className={`px-2 py-0.5 rounded-md ${filterCategory === 'all' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-500'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilterCategory('hod')} 
                className={`px-2 py-0.5 rounded-md ${filterCategory === 'hod' ? 'bg-purple-950 text-purple-300 font-semibold' : 'text-slate-500'}`}
              >
                HOD
              </button>
              <button 
                onClick={() => setFilterCategory('staff')} 
                className={`px-2 py-0.5 rounded-md ${filterCategory === 'staff' ? 'bg-amber-950 text-amber-300 font-semibold' : 'text-slate-500'}`}
              >
                Staff
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredGrievances.map((g) => (
              <div key={g.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md text-xs space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">{g.id}</span>
                    <h5 className="font-bold text-white text-sm mt-0.5">{g.title}</h5>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    g.status === 'Resolved' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                      : g.status === 'In-Progress' 
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                  }`}>
                    {g.status}
                  </span>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">{g.description}</p>

                {g.imageUrl && (
                  <div className="mt-2">
                    <img src={g.imageUrl} alt="Attached Proof" className="h-28 w-full object-cover rounded-xl border border-slate-700" />
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    {g.isAnonymous ? (
                      <span className="text-cyan-400 font-semibold flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Anonymous
                      </span>
                    ) : (
                      <span>By {g.studentName}</span>
                    )}
                  </span>
                  <span>Routed to: <strong className="text-slate-200">{g.assignedTo}</strong></span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
