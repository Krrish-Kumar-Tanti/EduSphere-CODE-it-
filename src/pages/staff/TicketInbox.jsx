import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import confetti from 'canvas-confetti';
import { 
  Wrench, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldAlert, 
  PhoneCall, 
  Search, 
  Filter, 
  MapPin, 
  User, 
  Camera, 
  Check, 
  Send, 
  Layers,
  ChevronRight,
  ExternalLink,
  Plus,
  Trash2,
  X,
  HardHat,
  MessageSquare
} from 'lucide-react';

export default function TicketInbox({ activeDomain, setActiveDomain }) {
  const { grievances, updateGrievanceStatus, addGrievance, deleteGrievance, openDirectChat } = useData();

  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Active' | 'Resolved'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [resolutionRemark, setResolutionRemark] = useState('');
  const [resolvingTicketId, setResolvingTicketId] = useState(null);
  const [assignedWorker, setAssignedWorker] = useState({
    'GRV-001': 'Ramu (Senior Electrician)',
    'GRV-002': 'Suresh (Plumbing & Water)',
    'GRV-003': 'Amit (Network Engineer)'
  });
  const [workDoneStatus, setWorkDoneStatus] = useState({}); // { [ticketId]: boolean }
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // New Work Order form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Maintenance');
  const [newLocation, setNewLocation] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState('Urgent');

  const staffDomains = [
    'All Domains',
    'Maintenance',
    'Cleaning & Hygiene',
    'Emergency Medical',
    'Anti-Bullying Safeguard',
    'Technical Support',
    'Admission Cell'
  ];

  const fieldWorkers = [
    { name: 'Ramu (Senior Electrician)', phone: 'Ext 104' },
    { name: 'Suresh (Plumbing & Water)', phone: 'Ext 109' },
    { name: 'Amit (Network Engineer)', phone: 'Ext 115' },
    { name: 'Dr. Kavita (Campus Medical Officer)', phone: 'Ext 108' },
    { name: 'Sunil (Sanitation Lead)', phone: 'Ext 112' }
  ];

  // Filter tickets for staff
  const staffTickets = grievances.filter(g => g.destination === 'staff' || !g.destination);

  const filteredTickets = staffTickets.filter(ticket => {
    // Domain match
    const matchesDomain = 
      activeDomain === 'All' || 
      activeDomain === 'All Domains' || 
      ticket.category?.toLowerCase().includes(activeDomain.toLowerCase()) ||
      activeDomain.toLowerCase().includes(ticket.category?.toLowerCase());

    // Status tab match: Active / In-Progress vs Resolved / Archived
    let matchesStatus = true;
    if (statusFilter === 'Active') {
      matchesStatus = ticket.status !== 'Resolved';
    } else if (statusFilter === 'Resolved') {
      matchesStatus = ticket.status === 'Resolved';
    } else if (statusFilter === 'Urgent') {
      matchesStatus = ticket.priority === 'Urgent' || ticket.priority === 'High';
    }

    // Search match
    const matchesSearch = 
      ticket.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.location && ticket.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ticket.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDomain && matchesStatus && matchesSearch;
  });

  const handleAssignWorker = (ticketId, workerName) => {
    setAssignedWorker(prev => ({ ...prev, [ticketId]: workerName }));
  };

  const handleMarkWorkDone = (ticketId) => {
    setWorkDoneStatus(prev => ({ ...prev, [ticketId]: true }));
    setResolvingTicketId(ticketId); // Immediately prompt for closing remarks
  };

  const handleResolveTicket = (ticketId) => {
    updateGrievanceStatus(ticketId, 'Resolved', resolutionRemark || 'Field work completed and verified by Operations Supervisor.');
    setResolvingTicketId(null);
    setResolutionRemark('');

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#10B981', '#38BDF8', '#818CF8']
    });
  };

  const handleCreateWorkOrder = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLocation.trim()) return;

    const newTicket = {
      id: `WO-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim(),
      category: newCategory,
      location: newLocation.trim(),
      description: newDescription.trim(),
      priority: newPriority,
      status: 'In Progress',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      studentName: 'Operations Lead Dispatch',
      destination: 'staff'
    };

    addGrievance(newTicket);
    setShowNewOrderModal(false);
    setNewTitle('');
    setNewLocation('');
    setNewDescription('');

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Domain Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket ID, room / lab, issue title, or keyword..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:border-amber-500 focus:outline-none transition shadow-2xs"
            />
          </div>

          {/* Quick Filter Tabs & Add Work Order */}
          <div className="flex flex-wrap items-center gap-2">
            
            <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200">
              {['All', 'Active', 'Resolved', 'Urgent'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setStatusFilter(mode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    statusFilter === mode
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowNewOrderModal(true)}
              className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Work Order</span>
            </button>

          </div>

        </div>

        {/* Domain Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Domain:
          </span>
          {staffDomains.map(domain => {
            const isSelected = activeDomain === domain || (domain === 'All Domains' && activeDomain === 'All');
            return (
              <button
                key={domain}
                onClick={() => setActiveDomain(domain === 'All Domains' ? 'All' : domain)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition ${
                  isSelected
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {domain}
              </button>
            );
          })}
        </div>

      </div>

      {/* Ticket Cards Grid */}
      <div className="space-y-4">
        
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-500" />
            Active Service Work Orders ({filteredTickets.length})
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Showing matching grievances & field dispatches
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTickets.length === 0 ? (
            <div className="col-span-2 p-12 rounded-3xl bg-white border border-slate-200 text-center text-slate-400 space-y-2">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
              <h4 className="font-bold text-slate-700 text-sm">No Pending Work Orders</h4>
              <p className="text-xs text-slate-500">All student grievances and facility requests in this domain are resolved.</p>
            </div>
          ) : (
            filteredTickets.map(ticket => {
              const isResolved = ticket.status === 'Resolved';
              const isUrgent = ticket.priority === 'Urgent' || ticket.priority === 'High';
              const currentWorker = assignedWorker[ticket.id];
              const isWorkDone = workDoneStatus[ticket.id] || isResolved;

              return (
                <div
                  key={ticket.id}
                  className={`p-5 rounded-3xl border transition shadow-sm space-y-4 flex flex-col justify-between ${
                    isResolved
                      ? 'bg-emerald-50/30 border-emerald-200'
                      : isWorkDone
                      ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20'
                      : isUrgent
                      ? 'bg-white border-rose-200 hover:border-rose-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  
                  {/* Top Bar: Category, Priority, ID */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isUrgent ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {ticket.priority || 'Normal'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                          {ticket.id}
                        </span>
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono">
                        {ticket.createdAt || 'Just now'}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm leading-snug">
                      {ticket.title}
                    </h4>

                    {ticket.description && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {ticket.description}
                      </p>
                    )}

                    {/* Location & Requester */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                      {ticket.location && (
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-amber-500" />
                          {ticket.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {ticket.studentName || 'Student Requester'}
                      </span>
                    </div>

                    {/* Attached Proof Image */}
                    {ticket.imageProof && (
                      <div className="relative group rounded-2xl overflow-hidden border border-slate-200 max-h-36">
                        <img
                          src={ticket.imageProof}
                          alt="Grievance Proof"
                          className="w-full h-36 object-cover"
                        />
                        <button
                          onClick={() => setSelectedImage(ticket.imageProof)}
                          className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 text-white font-bold text-xs transition"
                        >
                          <Camera className="w-4 h-4 text-amber-300" />
                          <span>Expand Proof</span>
                        </button>
                      </div>
                    )}

                    {/* Multi-Stage Field Worker & Work Done Banner */}
                    <div className={`p-3 rounded-2xl border text-xs transition-all ${
                      isWorkDone 
                        ? 'bg-emerald-100/90 border-emerald-300 text-emerald-900' 
                        : currentWorker 
                        ? 'bg-indigo-50/80 border-indigo-200 text-indigo-900' 
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <HardHat className={`w-4 h-4 ${isWorkDone ? 'text-emerald-700' : 'text-indigo-600'}`} />
                          <div>
                            <span className="font-bold block text-[11px]">
                              {currentWorker || 'Unassigned Technician'}
                            </span>
                            <span className={`text-[10px] font-semibold ${isWorkDone ? 'text-emerald-800' : 'text-slate-500'}`}>
                              {isWorkDone ? '✓ Field Work Completed • Awaiting Final Sign-Off' : 'Assigned Field Specialist'}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Work Done Action Button */}
                        {!isResolved && (
                          <button
                            onClick={() => handleMarkWorkDone(ticket.id)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition flex items-center gap-1 shadow-2xs ${
                              isWorkDone
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isWorkDone ? 'Work Done ✓' : 'Mark Work Done'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Resolution Notes */}
                    {ticket.resolutionNotes && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800">
                        <span className="font-bold block">Supervisor Sign-Off Note:</span>
                        <span className="font-medium">{ticket.resolutionNotes}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    {!isResolved ? (
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        
                        {/* Assign Worker Dropdown */}
                        <select
                          value={currentWorker || ''}
                          onChange={(e) => handleAssignWorker(ticket.id, e.target.value)}
                          className="w-full sm:w-1/2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:bg-white focus:border-amber-500 focus:outline-none font-semibold"
                        >
                          <option value="" disabled>Dispatch Worker...</option>
                          {fieldWorkers.map(w => (
                            <option key={w.name} value={w.name}>{w.name}</option>
                          ))}
                        </select>

                        {/* Close Ticket & Archive Button */}
                        <button
                          onClick={() => setResolvingTicketId(ticket.id)}
                          className={`w-full sm:flex-1 py-2 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs ${
                            isWorkDone
                              ? 'bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-400/40 animate-pulse'
                              : 'bg-emerald-600 hover:bg-emerald-700'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Close Ticket & Archive</span>
                        </button>

                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-[11px] text-emerald-700 font-bold">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Issue Successfully Resolved & Archived
                        </span>

                        {deleteConfirmId === ticket.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                deleteGrievance(ticket.id);
                                setDeleteConfirmId(null);
                              }}
                              className="px-2 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-bold"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 rounded-lg bg-slate-200 text-slate-700 text-[10px]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(ticket.id)}
                            className="text-rose-600 hover:text-rose-800 text-[10px] font-semibold flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Inline Resolution Remark Drawer */}
                    {resolvingTicketId === ticket.id && (
                      <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-300 space-y-2 mt-2 animate-fadeIn">
                        <span className="font-bold text-emerald-900 block text-xs">
                          Final Supervisory Resolution Remarks:
                        </span>
                        <input
                          type="text"
                          value={resolutionRemark}
                          onChange={(e) => setResolutionRemark(e.target.value)}
                          placeholder="e.g. Replaced condenser coil in Lab 204. Airflow verified."
                          className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 text-xs text-slate-900 focus:outline-none"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleResolveTicket(ticket.id)}
                            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                          >
                            Confirm Resolution & Notify Student
                          </button>
                          <button
                            onClick={() => setResolvingTicketId(null)}
                            className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* New Work Order Modal */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="max-w-md w-full rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4 relative">
            
            <button
              onClick={() => setShowNewOrderModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-500" />
                Dispatch New Campus Work Order
              </h3>
              <p className="text-xs text-slate-500">
                Log a proactive maintenance, sanitation, or safety work order for ground staff.
              </p>
            </div>

            <form onSubmit={handleCreateWorkOrder} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Issue Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Broken Water Filter or Lab AC Inspection"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:outline-none"
                  >
                    <option value="Maintenance">Maintenance</option>
                    <option value="Cleaning & Hygiene">Cleaning & Hygiene</option>
                    <option value="Emergency Medical">Emergency Medical</option>
                    <option value="Technical Support">Technical Support</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:outline-none"
                  >
                    <option value="Urgent">🚨 Urgent</option>
                    <option value="High">⚠️ High</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Room / Location *</label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Lab 204, Academic Block 4"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Work Instructions</label>
                <textarea
                  rows="3"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide details for the field worker..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition"
              >
                Dispatch Work Order to Field
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Expanded Photographic Proof Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="max-w-2xl w-full rounded-3xl bg-white border border-slate-200 p-4 shadow-2xl space-y-3 text-center relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-amber-500" />
                Photographic Grievance Evidence
              </span>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs"
              >
                ✕ Close
              </button>
            </div>
            <img
              src={selectedImage}
              alt="Expanded Proof"
              className="w-full max-h-[70vh] object-contain rounded-2xl border border-slate-200"
            />
          </div>
        </div>
      )}

    </div>
  );
}
