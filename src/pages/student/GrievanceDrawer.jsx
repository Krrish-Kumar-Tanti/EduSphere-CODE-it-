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
  const [category, setCategory] = useState('Academic Concern & Syllabus Pace');
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
      <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-600 text-white shadow-sm">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Direct Zero-Bureaucracy Double-Escalation Desk
            </h4>
            <p className="text-xs text-slate-600">
              Route academic issues directly to the HOD (with grading anonymity) or ground issues straight to maintenance/medical staff.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-3 py-1 rounded-xl bg-white border border-rose-200 text-rose-700 shadow-sm">
          🛡 Zero Retaliation Shield Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Complaint Creation Form */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="glass-panel-elevated p-6 rounded-3xl border border-slate-200 shadow-xl relative bg-white/95">
            
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              File New Issue / Grievance Ticket
            </h3>

            {showSuccessToast && (
              <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ticket lodged and routed successfully with instant tracking token!</span>
                </div>
                <button onClick={() => setShowSuccessToast(false)}><X className="w-3.5 h-3.5" /></button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Step 1: Destination Selector (HOD vs Ground Staff) */}
              <div>
                <label className="text-slate-700 font-bold block mb-2">
                  1. Choose Triage Routing Destination:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setDestination('hod');
                      setCategory('Academic Concern & Syllabus Pace');
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-2.5 transition ${
                      destination === 'hod'
                        ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-600/20 text-purple-900 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-purple-600 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">HOD Academic Office</span>
                      <span className="text-[10px] text-slate-500">Curriculum, faculty pace, leaves</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDestination('staff');
                      setCategory('Maintenance & Infrastructure');
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-2.5 transition ${
                      destination === 'staff'
                        ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-600/20 text-amber-900 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Wrench className="w-4 h-4 text-amber-600 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Ground Operations Staff</span>
                      <span className="text-[10px] text-slate-500">AC, cleaning, anti-bullying, medical</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 2: Category & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1.5">
                    2. Specific Issue Domain:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 focus:border-indigo-600 focus:outline-none"
                  >
                    {(destination === 'hod' ? hodCategories : staffCategories).map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1.5">
                    Priority Urgency:
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 focus:border-indigo-600 focus:outline-none"
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
                <label className="text-slate-700 font-bold block mb-1.5">
                  Subject / Summary:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lab 204 Air Conditioner Not Functioning"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1.5">
                  Detailed Description & Exact Location:
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details (Room number, machine ID, symptoms)..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              {/* Image / Proof Attachment */}
              <div>
                <label className="text-slate-700 font-bold block mb-1.5">
                  Attach Photo / Proof (Optional):
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold flex items-center gap-2 transition shadow-sm">
                    <ImageIcon className="w-4 h-4 text-indigo-600" />
                    <span>Upload Picture</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {imagePreview && (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-12 h-12 object-cover rounded-xl border border-indigo-200" />
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
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${isAnonymous ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    <EyeOff className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Anonymous Scholar Mode</span>
                    <span className="text-[10px] text-slate-500">
                      Hides your name & enrollment from faculty to prevent grading bias.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${isAnonymous ? 'bg-indigo-600' : 'bg-slate-300'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${isAnonymous ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition"
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
              <FileText className="w-4 h-4 text-indigo-600" />
              Live Campus Ticket Queue
            </h4>

            {/* Filter */}
            <div className="flex items-center gap-1 text-[11px]">
              <button 
                onClick={() => setFilterCategory('all')} 
                className={`px-2.5 py-0.5 rounded-md font-semibold ${filterCategory === 'all' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-500'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilterCategory('hod')} 
                className={`px-2.5 py-0.5 rounded-md font-semibold ${filterCategory === 'hod' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'text-slate-500'}`}
              >
                HOD
              </button>
              <button 
                onClick={() => setFilterCategory('staff')} 
                className={`px-2.5 py-0.5 rounded-md font-semibold ${filterCategory === 'staff' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'text-slate-500'}`}
              >
                Staff
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredGrievances.map((g) => (
              <div key={g.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-indigo-600 font-bold">{g.id}</span>
                    <h5 className="font-bold text-slate-900 text-sm mt-0.5">{g.title}</h5>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    g.status === 'Resolved' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : g.status === 'In-Progress' 
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-purple-50 text-purple-700 border border-purple-200'
                  }`}>
                    {g.status}
                  </span>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed">{g.description}</p>

                {g.imageUrl && (
                  <div className="mt-2">
                    <img src={g.imageUrl} alt="Attached Proof" className="h-28 w-full object-cover rounded-xl border border-slate-200" />
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    {g.isAnonymous ? (
                      <span className="text-indigo-600 font-bold flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Anonymous
                      </span>
                    ) : (
                      <span>By {g.studentName}</span>
                    )}
                  </span>
                  <span>Routed to: <strong className="text-slate-800">{g.assignedTo}</strong></span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
