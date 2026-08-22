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
  Plus
} from 'lucide-react';

export default function TicketInbox({ activeDomain, setActiveDomain }) {
  const { grievances, updateGrievanceStatus, addGrievance, deleteGrievance, openDirectChat } = useData();

  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Active' | 'Resolved'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [resolutionRemark, setResolutionRemark] = useState('');
  const [resolvingTicketId, setResolvingTicketId] = useState(null);
  const [assignedWorker, setAssignedWorker] = useState({});
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

  const handleResolveTicket = (ticketId) => {
    updateGrievanceStatus(ticketId, 'Resolved', resolutionRemark || 'Resolved by Ground Staff Technician');
    setResolvingTicketId(null);
    setResolutionRemark('');

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#10B981', '#4F46E5']
    });
  };

  const handleAssignWorker = (ticketId, workerName) => {
    setAssignedWorker(prev => ({ ...prev, [ticketId]: workerName }));
    updateGrievanceStatus(ticketId, 'In-Progress');
  };

  const handleCreateWorkOrder = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTicket = {
      id: `GRV-${Math.floor(900 + Math.random() * 99)}`,
      studentName: 'Staff Internal Dispatch',
      studentEnrollment: 'STF-504',
      isAnonymous: false,
      title: newTitle,
      category: newCategory,
      destination: 'staff',
      priority: newPriority,
      description: newDescription || 'Immediate ground inspection order dispatched by Supervisor.',
      imageUrl: null,
      status: 'In-Progress',
      timestamp: 'Just now (Today)',
      assignedTo: 'Ground Operations Team',
      location: newLocation || 'Campus Common Area'
    };

    addGrievance(newTicket);
    setShowNewOrderModal(false);
    setNewTitle('');
    setNewLocation('');
    setNewDescription('');

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.5 }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Domain Selector Pills Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            Operations Domain Selector:
          </span>
          <span className="text-xs text-amber-700 font-bold hidden sm:inline">
            Active Filter: {activeDomain}
          </span>
        </div>

        <div className="flex overflow-x-auto pb-1 gap-2 scrollbar-none">
          {staffDomains.map((domain) => {
            const isSelected = activeDomain === domain || (domain === 'All Domains' && activeDomain === 'All');
            return (
              <button
                key={domain}
                onClick={() => setActiveDomain(domain === 'All Domains' ? 'All' : domain)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{domain}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ticket List Header & Search/Filter Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-600" />
              Live Incident & Ticket Dispatch Inbox ({filteredTickets.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Real-time facility requests reported across campus</p>
          </div>

          {/* Quick Create Work Order & Search */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket, location, ID..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none placeholder-slate-400 font-medium"
              />
            </div>

            <button
              onClick={() => setShowNewOrderModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition whitespace-nowrap shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Dispatch Order</span>
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {[
            { id: 'All', label: 'All Tickets' },
            { id: 'Active', label: '⏳ Active / In-Progress' },
            { id: 'Urgent', label: '🚨 Urgent Priority' },
            { id: 'Resolved', label: '✅ Resolved & Archived' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Ticket Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTickets.length === 0 ? (
            <div className="col-span-full p-8 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-60" />
              <p className="text-xs font-bold">No incident tickets matching the selected filter.</p>
            </div>
          ) : (
            filteredTickets.map((ticket) => {
              const isResolved = ticket.status === 'Resolved';
              const isUrgent = ticket.priority === 'Urgent' || ticket.priority === 'High';

              return (
                <div
                  key={ticket.id}
                  className={`p-5 rounded-3xl border transition-all text-xs flex flex-col justify-between space-y-4 relative overflow-hidden bg-white ${
                    isResolved
                      ? 'border-emerald-200/80 bg-slate-50/50'
                      : isUrgent
                      ? 'border-amber-300 shadow-sm'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-3">
                    
                    {/* Top Bar */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            {ticket.id}
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                            {ticket.category}
                          </span>
                          {isUrgent && (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                              {ticket.priority}
                            </span>
                          )}
                        </div>

                        <h4 className={`font-bold text-base mt-1.5 leading-snug ${isResolved ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {ticket.title}
                        </h4>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isResolved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        ticket.status === 'In-Progress' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>

                    {/* Student & Location Info */}
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Reported By:</span>
                        {ticket.isAnonymous ? (
                          <span className="font-bold text-indigo-700 flex items-center gap-1">
                            🔒 Anonymous Student
                          </span>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">{ticket.studentName}</span>
                            <button
                              onClick={() => openDirectChat({
                                id: ticket.studentEnrollment,
                                name: ticket.studentName,
                                role: 'student',
                                designation: 'Student Scholar'
                              })}
                              className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold underline"
                              title="Chat with student"
                            >
                              💬 Chat
                            </button>
                          </div>
                        )}
                        <span className="text-slate-500 block text-[10px]">{ticket.studentEnrollment}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Physical Location:</span>
                        <span className="font-bold text-amber-800 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-600" />
                          {ticket.location || 'Campus Premises'}
                        </span>
                        <span className="text-slate-500 block text-[10px]">{ticket.timestamp}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className={`leading-relaxed font-medium ${isResolved ? 'text-slate-500' : 'text-slate-600'}`}>
                      {ticket.description}
                    </p>

                    {/* Attached Photo Preview */}
                    {ticket.imageUrl && (
                      <div className="relative group rounded-2xl overflow-hidden border border-slate-200 max-h-36">
                        <img
                          src={ticket.imageUrl}
                          alt="Evidence"
                          className="w-full h-36 object-cover group-hover:scale-105 transition duration-300"
                        />
                        <button
                          onClick={() => setSelectedImage(ticket.imageUrl)}
                          className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 text-white font-bold text-xs transition"
                        >
                          <Camera className="w-4 h-4 text-amber-300" />
                          <span>Expand Photographic Proof</span>
                        </button>
                      </div>
                    )}

                    {/* Assigned Technician */}
                    {assignedWorker[ticket.id] && (
                      <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-[11px] text-indigo-900 flex items-center justify-between">
                        <span className="font-medium">Assigned Field Worker:</span>
                        <span className="font-bold text-indigo-800">{assignedWorker[ticket.id]}</span>
                      </div>
                    )}

                    {/* Resolution remark if already resolved */}
                    {ticket.resolutionNotes && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800">
                        <span className="font-bold block">Resolution Note:</span>
                        <span className="font-medium">{ticket.resolutionNotes}</span>
                      </div>
                    )}

                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    {!isResolved ? (
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        {/* Assign dropdown */}
                        <select
                          onChange={(e) => handleAssignWorker(ticket.id, e.target.value)}
                          defaultValue=""
                          className="w-full sm:w-1/2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:bg-white focus:border-amber-500 focus:outline-none font-medium"
                        >
                          <option value="" disabled>Dispatch Worker...</option>
                          {fieldWorkers.map(w => (
                            <option key={w.name} value={w.name}>{w.name}</option>
                          ))}
                        </select>

                        <button
                          onClick={() => setResolvingTicketId(ticket.id)}
                          className="w-full sm:flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Resolved</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-[11px] text-emerald-700 font-bold">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Issue Closed & Archived
                        </span>

                        {/* Permanent Delete Button for Resolved Ticket */}
                        {deleteConfirmId === ticket.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                deleteGrievance(ticket.id);
                                setDeleteConfirmId(null);
                              }}
                              className="px-2 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-700 transition"
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
                            className="text-rose-600 hover:text-rose-800 font-semibold text-[10px] flex items-center gap-1"
                            title="Delete permanently"
                          >
                            🗑️ Delete Record
                          </button>
                        )}
                      </div>
                    )}

                    {/* Inline Remark Box when resolving */}
                    {resolvingTicketId === ticket.id && (
                      <div className="p-3 rounded-2xl bg-slate-50 border border-emerald-300 space-y-2 mt-2 animate-fadeIn">
                        <span className="font-bold text-emerald-800 block text-[11px]">Add Technician Resolution Remarks:</span>
                        <input
                          type="text"
                          value={resolutionRemark}
                          onChange={(e) => setResolutionRemark(e.target.value)}
                          placeholder="e.g. AC compressor capacitor replaced and tested."
                          className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleResolveTicket(ticket.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                          >
                            Confirm & Close Ticket
                          </button>
                          <button
                            onClick={() => setResolvingTicketId(null)}
                            className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold"
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


      {/* Expanded Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="max-w-2xl w-full rounded-3xl bg-white border border-slate-200 p-4 shadow-2xl space-y-3 text-center relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-600" />
                High-Resolution Evidence Photo
              </span>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <img
              src={selectedImage}
              alt="High Res Proof"
              className="w-full max-h-[70vh] object-contain rounded-2xl border border-slate-200"
            />
          </div>
        </div>
      )}

      {/* Dispatch New Work Order Modal */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="max-w-md w-full rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-600" />
                Dispatch Internal Work Order
              </h4>
              <button
                onClick={() => setShowNewOrderModal(false)}
                className="p-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWorkOrder} className="space-y-3">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Issue Title:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Block B 2nd Floor Light Fixture Blown"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Maintenance">Maintenance</option>
                    <option value="Cleaning & Hygiene">Cleaning & Hygiene</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Emergency Medical">Emergency Medical</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Priority:</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Urgent">🚨 Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Venue / Location:</label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Block B, 2nd Floor Staircase"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Task Instructions:</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Details for electrician or plumber..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition shadow-xs"
              >
                Dispatch Work Order to Field
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

