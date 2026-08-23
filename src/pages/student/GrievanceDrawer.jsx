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
      assignedTo: destination === 'hod' ? 'HOD Academic Office' : `Ground Unit: ${category}`,
      timestamp: 'Today, Just now'
    };

    addGrievance(newTicket);
    setShowSuccessToast(true);

    // Reset Form
    setTitle('');
    setDescription('');
    setImagePreview(null);

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  const filteredGrievances = grievances.filter(g => {
    if (filterCategory === 'all') return true;
    return g.destination === filterCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner Alert */}
      <div className="p-4 rounded-3xl bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500 text-white shadow-sm">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Double-Triage Grievance Matrix</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-extrabold">
                Zero-Retaliation Protocol
              </span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Academics auto-route directly to the HOD. Infrastructure & Hygiene route directly to Ground Operations.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns: File a Grievance Form */}
        <div className="lg:col-span-7">
          <div className="glass-panel-elevated p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl bg-white/95">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  File Anonymous or Named Grievance
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  End-to-end encrypted ticket dispatch.
                </p>
              </div>
            </div>

            {showSuccessToast && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Ticket registered in SQLite database and routed successfully!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Triage Routing Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  Select Triage Destination:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setDestination('hod');
                      setCategory(hodCategories[0]);
                    }}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition ${
                      destination === 'hod'
                        ? 'border-purple-500 bg-purple-50/70 text-purple-900 shadow-sm ring-1 ring-purple-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Building2 className={`w-4 h-4 mt-0.5 ${destination === 'hod' ? 'text-purple-600' : 'text-slate-400'}`} />
                    <div>
                      <span className="font-bold block text-xs">HOD Academic Office</span>
                      <span className="text-[10px] text-slate-500">Grading, Exam, Syllabus Pace</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDestination('staff');
                      setCategory(staffCategories[0]);
                    }}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition ${
                      destination === 'staff'
                        ? 'border-amber-500 bg-amber-50/70 text-amber-900 shadow-sm ring-1 ring-amber-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Wrench className={`w-4 h-4 mt-0.5 ${destination === 'staff' ? 'text-amber-600' : 'text-slate-400'}`} />
                    <div>
                      <span className="font-bold block text-xs">Ground Staff & Facilities</span>
                      <span className="text-[10px] text-slate-500">AC, Cleanliness, Lab Wi-Fi</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Category Tag:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:border-indigo-600 focus:outline-none shadow-sm"
                >
                  {destination === 'hod' ? (
                    hodCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)
                  ) : (
                    staffCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)
                  )}
                </select>
              </div>

              {/* Title & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Ticket Subject / Title:
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Lab 204 Air Conditioner Tripping Power"
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:border-indigo-600 focus:outline-none shadow-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Urgency Priority:
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:border-indigo-600 focus:outline-none shadow-sm"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Urgency</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Detailed Description & Location:
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details of the issue so the assigned officer can inspect immediately..."
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:border-indigo-600 focus:outline-none shadow-sm"
                ></textarea>
              </div>

              {/* Image Upload Preview */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Attach Photo Evidence (Optional):
                </label>
                <div className="flex items-center gap-3">
                  <label className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-sm transition">
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {imagePreview && (
                    <div className="flex items-center gap-2">
                      <img src={imagePreview} alt="Evidence" className="w-10 h-10 rounded-lg object-cover border border-slate-300" />
                      <button type="button" onClick={() => setImagePreview(null)} className="p-1 rounded-lg text-rose-500 hover:bg-rose-50">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Anonymous Shield Toggle */}
              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-600 text-white">
                    <EyeOff className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-indigo-950 block text-xs">Enable Anonymous Identity Shield</span>
                    <span className="text-[10px] text-indigo-700">Zero name or roll number will be visible to recipient.</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Grievance Ticket</span>
              </button>

            </form>

          </div>
        </div>

        {/* Right 5 Columns: Grievance Stream */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="glass-panel p-5 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-3">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                Live Ticket Stream ({filteredGrievances.length})
              </span>
              
              {/* Filter */}
              <div className="flex items-center gap-1">
                {['all', 'hod', 'staff'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterCategory(f)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase transition ${
                      filterCategory === f
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {filteredGrievances.map((ticket) => (
                <div key={ticket.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                  
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-400">{ticket.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ticket.priority === 'Urgent' || ticket.priority === 'High' || ticket.priority === 'Critical'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {ticket.priority} Priority
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900">{ticket.title}</h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">{ticket.description}</p>

                  {ticket.imageUrl && (
                    <img src={ticket.imageUrl} alt="Attached" className="w-full h-24 object-cover rounded-xl border border-slate-200" />
                  )}

                  {/* Resolution Notes & RSA Seal display */}
                  {ticket.status === 'Resolved' && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[10px] space-y-1">
                      <div className="flex items-center justify-between font-bold text-emerald-900">
                        <span>✅ Resolved by HOD / Staff</span>
                        {ticket.rsaSeal && (
                          <span className="font-mono text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded text-[9px]">
                            {ticket.rsaSeal}
                          </span>
                        )}
                      </div>
                      {ticket.resolutionNotes && (
                        <p className="text-slate-700 italic">"{ticket.resolutionNotes}"</p>
                      )}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 font-semibold">{ticket.studentName}</span>
                    <span className={`font-bold px-2 py-0.5 rounded-md border ${
                      ticket.status === 'Resolved' 
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                        : ticket.status?.includes('Review') 
                        ? 'text-amber-700 bg-amber-50 border-amber-200'
                        : 'text-indigo-700 bg-indigo-50 border-indigo-200'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
