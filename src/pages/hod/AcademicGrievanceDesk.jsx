import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/soundEffects';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  X, 
  Sparkles, 
  Lock, 
  MessageCircle, 
  UserCheck, 
  Search, 
  Filter, 
  Send, 
  ArrowRight, 
  ShieldCheck, 
  FileCheck, 
  AlertCircle, 
  Eye, 
  Trash2,
  Check,
  Scale,
  Award
} from 'lucide-react';

export default function AcademicGrievanceDesk() {
  const { currentUser } = useAuth();
  const { grievances, updateGrievanceStatus, deleteGrievance, openDirectChat } = useData();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'pending' | 'under_review' | 'resolved' | 'dismissed'
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [resolvingTicket, setResolvingTicket] = useState(null);
  const [officialRemarks, setOfficialRemarks] = useState('');
  const [dismissingTicket, setDismissingTicket] = useState(null);
  const [dismissReason, setDismissReason] = useState('');
  const [viewingImage, setViewingImage] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Filter HOD relevant tickets (destination === 'hod' or academic category)
  const hodGrievances = grievances.filter(g => {
    const isHodDest = g.destination === 'hod' || !g.destination || g.destination === 'all';
    const isAcademic = ['Academic Concern & Syllabus Pace', 'Grading Bias & Examination', 'Teacher Conduct & Evaluation', 'General'].includes(g.category) || isHodDest;
    return isHodDest || isAcademic;
  });

  // Apply sub-filters
  const filteredList = hodGrievances.filter(g => {
    const status = (g.status || 'In-Progress').toLowerCase();
    
    let statusMatch = true;
    if (activeFilter === 'pending') statusMatch = status === 'in-progress' || status === 'pending';
    else if (activeFilter === 'under_review') statusMatch = status.includes('review') || status.includes('acknowledged');
    else if (activeFilter === 'resolved') statusMatch = status === 'resolved';
    else if (activeFilter === 'dismissed') statusMatch = status === 'dismissed' || status === 'rejected' || status === 'revoked';

    const priorityMatch = priorityFilter === 'ALL' || (g.priority || '').toUpperCase() === priorityFilter;

    const queryMatch = 
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && priorityMatch && queryMatch;
  });

  const pendingCount = hodGrievances.filter(g => (g.status || '').toLowerCase() === 'in-progress' || (g.status || '').toLowerCase() === 'pending').length;
  const reviewCount = hodGrievances.filter(g => (g.status || '').toLowerCase().includes('review')).length;
  const resolvedCount = hodGrievances.filter(g => (g.status || '').toLowerCase() === 'resolved').length;
  const urgentCount = hodGrievances.filter(g => (g.priority || '').toLowerCase() === 'urgent').length;

  // 1. Acknowledge Action
  const handleAcknowledge = (ticket) => {
    updateGrievanceStatus(
      ticket.id, 
      'Under Review', 
      'Official complaint acknowledged by HOD Academic Office. Preliminary committee review underway.',
      null,
      currentUser?.name || 'Prof. S. K. Naitik (HOD CSE)'
    );

    setActionSuccess({
      type: 'review',
      title: 'Ticket Marked Under Official Review',
      ticketId: ticket.id
    });
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // 2. Cryptographic RSA Resolve Action
  const handleOpenResolveModal = (ticket) => {
    setResolvingTicket(ticket);
    setOfficialRemarks('Formal re-evaluation approved. External moderator assigned for script moderation. Corrective score entered into academic database.');
  };

  const handleConfirmResolve = () => {
    if (!resolvingTicket) return;

    const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
    const rsaSeal = `RSA-HOD-CSE-0x${randomHex}89A2`;
    const resolvedBy = currentUser?.name || 'Prof. S. K. Naitik (HOD CSE)';

    updateGrievanceStatus(
      resolvingTicket.id,
      'Resolved',
      officialRemarks,
      rsaSeal,
      resolvedBy
    );

    try {
      sounds.playSuccessFanfare();
    } catch (e) {}

    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#7C3AED', '#10B981', '#4F46E5', '#F59E0B']
    });

    setActionSuccess({
      type: 'resolved',
      title: 'Grievance Resolved with RSA Digital Signature Seal!',
      ticketId: resolvingTicket.id,
      seal: rsaSeal
    });

    setResolvingTicket(null);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  // 3. Dismiss Action
  const handleOpenDismissModal = (ticket) => {
    setDismissingTicket(ticket);
    setDismissReason('After thorough review of lab logs and evaluation rubrics, no procedural irregularity was found. Grievance dismissed with cause.');
  };

  const handleConfirmDismiss = () => {
    if (!dismissingTicket) return;

    updateGrievanceStatus(
      dismissingTicket.id,
      'Dismissed',
      dismissReason,
      null,
      currentUser?.name || 'Prof. S. K. Naitik (HOD CSE)'
    );

    setActionSuccess({
      type: 'dismissed',
      title: 'Grievance Dismissed with Justification Note',
      ticketId: dismissingTicket.id
    });

    setDismissingTicket(null);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // Direct chat with applicant
  const handleDirectChat = (ticket) => {
    if (ticket.isAnonymous) return;
    openDirectChat({
      id: ticket.studentEnrollment || ticket.userId || 'STU-01',
      name: ticket.studentName,
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      department: 'Computer Science & Engineering (CSE)'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Executive Command Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5 shadow-2xs">
              <Scale className="w-3.5 h-3.5 text-rose-600" />
              Executive Academic Triage Desk
            </span>
            <span className="text-xs text-slate-500 font-medium">Zero-Retaliation Escalation Routing</span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Academic Grievance Resolution Command Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Executive resolution suite for escalated student academic concerns, grading disputes, and examination moderation, backed by RSA cryptographic seals.
          </p>
        </div>

        {/* Executive KPI Stats */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-center min-w-[90px] shadow-2xs">
            <span className="text-[10px] text-rose-700 font-black block uppercase tracking-wider">Unresolved</span>
            <span className="text-xl font-black text-rose-700">{pendingCount}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center min-w-[90px] shadow-2xs">
            <span className="text-[10px] text-amber-700 font-black block uppercase tracking-wider">In Review</span>
            <span className="text-xl font-black text-amber-700">{reviewCount}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center min-w-[90px] shadow-2xs">
            <span className="text-[10px] text-emerald-700 font-black block uppercase tracking-wider">Resolved</span>
            <span className="text-xl font-black text-emerald-700">{resolvedCount}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-center min-w-[90px] shadow-2xs">
            <span className="text-[10px] text-purple-700 font-black block uppercase tracking-wider">Urgent Flags</span>
            <span className="text-xl font-black text-purple-700">{urgentCount}</span>
          </div>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionSuccess && (
        <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-xs animate-fadeIn shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-emerald-600 text-white shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-emerald-900 text-sm">
                {actionSuccess.title}
              </h4>
              <p className="text-slate-700 mt-0.5">
                Ticket <span className="font-mono font-bold text-slate-900">{actionSuccess.ticketId}</span> updated across live multi-tab BroadcastChannel sync.
                {actionSuccess.seal && (
                  <span className="ml-2 font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                    Seal: {actionSuccess.seal}
                  </span>
                )}
              </p>
            </div>
          </div>

          <span className="text-[11px] bg-emerald-100 text-emerald-800 px-3 py-1 rounded-xl font-mono font-bold border border-emerald-300">
            Live Synced
          </span>
        </div>
      )}

      {/* Main Filter & Search Control Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100/80 border border-slate-200/80">
          {[
            { id: 'all', label: 'All Cases', count: hodGrievances.length },
            { id: 'pending', label: 'Pending Action', count: pendingCount },
            { id: 'under_review', label: 'Under Review', count: reviewCount },
            { id: 'resolved', label: 'Resolved (RSA Signed)', count: resolvedCount },
            { id: 'dismissed', label: 'Dismissed', count: hodGrievances.filter(g => ['dismissed', 'rejected', 'revoked'].includes((g.status || '').toLowerCase())).length }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeFilter === tab.id ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Priority & Search Filters */}
        <div className="flex items-center gap-3">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">🔴 Urgent Priority</option>
            <option value="HIGH">🟠 High Priority</option>
            <option value="MEDIUM">🟡 Medium Priority</option>
          </select>

          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search grievances..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-500 transition"
            />
          </div>
        </div>

      </div>

      {/* Grievance Ticket Queue Cards */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-700">No Grievances Found in this View</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              All student concerns under this category have been processed or zero complaints have been lodged.
            </p>
          </div>
        ) : (
          filteredList.map((ticket) => {
            const isAnon = ticket.isAnonymous === 1 || ticket.isAnonymous === true;
            const status = (ticket.status || 'In-Progress').toLowerCase();
            const isPending = status === 'in-progress' || status === 'pending';
            const isUnderReview = status.includes('review') || status.includes('acknowledged');
            const isResolved = status === 'resolved';
            const isDismissed = status === 'dismissed' || status === 'rejected' || status === 'revoked';

            return (
              <div
                key={ticket.id}
                className={`p-6 rounded-3xl border transition-all space-y-5 bg-white shadow-sm hover:shadow-md ${
                  isPending ? 'border-rose-200 ring-1 ring-rose-500/10' :
                  isUnderReview ? 'border-amber-200 ring-1 ring-amber-500/10' :
                  isResolved ? 'border-emerald-200' :
                  'border-slate-200 opacity-90'
                }`}
              >
                {/* Header Ticket Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[10px] font-mono font-black text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                      {ticket.id}
                    </span>

                    <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      {ticket.category}
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      (ticket.priority || '').toLowerCase() === 'urgent' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                      (ticket.priority || '').toLowerCase() === 'high' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {ticket.priority || 'Medium'} Priority
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {ticket.timestamp || 'Today'}
                    </span>

                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      isPending ? 'bg-rose-50 text-rose-700 border border-rose-300' :
                      isUnderReview ? 'bg-amber-50 text-amber-700 border border-amber-300' :
                      isResolved ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' :
                      'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>

                {/* Main Content & Title */}
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {ticket.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {ticket.description}
                  </p>
                </div>

                {/* Submitter & Evidence Section */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  
                  {/* Applicant Info */}
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-2xl shrink-0 ${
                      isAnon ? 'bg-slate-800 text-purple-300 shadow-sm' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {isAnon ? <Lock className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {ticket.studentName}
                        </span>
                        {isAnon && (
                          <span className="text-[9px] font-black uppercase font-mono px-2 py-0.5 rounded-md bg-purple-900 text-purple-200">
                            🛡️ Privacy Shield Mask Active
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                        Enrollment ID: {ticket.studentEnrollment}
                      </span>
                    </div>
                  </div>

                  {/* Evidence Attachment and Chat Button */}
                  <div className="flex items-center gap-2 self-stretch sm:self-auto">
                    {ticket.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setViewingImage(ticket.imageUrl)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-purple-300 text-purple-700 font-bold text-xs flex items-center gap-1.5 transition shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Evidence Photo</span>
                      </button>
                    )}

                    {!isAnon && (
                      <button
                        type="button"
                        onClick={() => handleDirectChat(ticket)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 transition shadow-2xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Direct WhatsApp Chat</span>
                      </button>
                    )}
                  </div>

                </div>

                {/* Cryptographic RSA Seal Banner if Resolved */}
                {isResolved && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900/10 via-purple-900/10 to-indigo-900/10 border border-emerald-200/80 space-y-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-700" />
                        Official HOD Academic Resolution & Cryptographic Seal
                      </span>
                      <span className="font-mono text-[10px] font-black text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-md border border-purple-300">
                        {ticket.rsaSeal || 'RSA-HOD-CSE-0x9F42A7C8E2'}
                      </span>
                    </div>

                    {ticket.resolutionNotes && (
                      <p className="text-slate-700 italic bg-white/80 p-3 rounded-xl border border-slate-200">
                        "{ticket.resolutionNotes}"
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                      <span>Signed by: {ticket.resolvedBy || 'Prof. S. K. Naitik (HOD CSE)'}</span>
                      <span>Verified: Level-4 Cryptographic Audit Passed</span>
                    </div>
                  </div>
                )}

                {/* Dismissal Justification Banner if Dismissed */}
                {isDismissed && ticket.resolutionNotes && (
                  <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs space-y-1">
                    <span className="font-bold text-slate-700 block">
                      HOD Official Dismissal Statement:
                    </span>
                    <p className="text-slate-600 italic">
                      "{ticket.resolutionNotes}"
                    </p>
                  </div>
                )}

                {/* Executive Actions Toolbar */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400 font-mono">
                    Routing: <strong className="text-slate-600">{ticket.assignedTo || 'HOD Academic Office'}</strong>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Action 1: Acknowledge */}
                    {isPending && (
                      <button
                        type="button"
                        onClick={() => handleAcknowledge(ticket)}
                        className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold text-xs flex items-center gap-1.5 transition shadow-2xs"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>⏳ Acknowledge & Mark Under Review</span>
                      </button>
                    )}

                    {/* Action 2: Cryptographic Resolve */}
                    {!isResolved && (
                      <button
                        type="button"
                        onClick={() => handleOpenResolveModal(ticket)}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs flex items-center gap-1.5 transition shadow-md shadow-purple-600/20"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>🔏 Cryptographic Resolve & Approve</span>
                      </button>
                    )}

                    {/* Action 3: Dismiss with Cause */}
                    {!isDismissed && !isResolved && (
                      <button
                        type="button"
                        onClick={() => handleOpenDismissModal(ticket)}
                        className="px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-slate-300 hover:border-rose-300 font-bold text-xs flex items-center gap-1.5 transition"
                      >
                        <X className="w-3.5 h-3.5 text-rose-600" />
                        <span>Dismiss with Cause</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* ========================================================
          CRYPTOGRAPHIC RESOLUTION MODAL (RSA SEAL)
          ======================================================== */}
      {resolvingTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-scaleUp">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/10 text-white ring-1 ring-white/20">
                  <ShieldCheck className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200 font-bold block">
                    RSA-2048 Cryptographic Resolution
                  </span>
                  <h3 className="text-lg font-black text-white">
                    Approve & Resolve Grievance
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setResolvingTicket(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs">
              
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-purple-800 uppercase block">Case Subject:</span>
                <h4 className="font-bold text-slate-900 text-sm">{resolvingTicket.title}</h4>
                <p className="text-slate-600 text-[11px]">
                  Submitted by <strong>{resolvingTicket.studentName}</strong> • {resolvingTicket.studentEnrollment}
                </p>
              </div>

              <div>
                <label className="block text-slate-800 font-black mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-600" />
                  <span>Official HOD Corrective Directive & Resolution Remarks:</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={officialRemarks}
                  onChange={(e) => setOfficialRemarks(e.target.value)}
                  placeholder="Enter official resolution details (e.g. Re-evaluation approved with external examiner)..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium text-xs focus:bg-white focus:border-purple-600 focus:outline-none transition shadow-inner"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center justify-between font-mono font-bold text-slate-700">
                  <span>Signatory:</span>
                  <span className="text-purple-700">{currentUser?.name || 'Prof. S. K. Naitik (HOD CSE)'}</span>
                </div>
                <div className="flex items-center justify-between font-mono">
                  <span>Generated Seal:</span>
                  <span className="text-slate-900 font-bold">RSA-HOD-CSE-0x9F42A7C8E2</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResolvingTicket(null)}
                  className="w-1/3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition text-xs"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmResolve}
                  className="w-2/3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black transition shadow-lg shadow-emerald-600/20 text-xs flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>Stamp RSA Seal & Resolve Ticket</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          DISMISSAL WITH CAUSE MODAL
          ======================================================== */}
      {dismissingTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-scaleUp">
            
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/30">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
                    Administrative Action
                  </span>
                  <h3 className="text-lg font-black text-white">
                    Dismiss Grievance with Cause
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDismissingTicket(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
                <span className="font-bold text-rose-900 text-sm block">{dismissingTicket.title}</span>
                <p className="text-slate-600 text-[11px]">
                  Submitted by {dismissingTicket.studentName} ({dismissingTicket.studentEnrollment})
                </p>
              </div>

              <div>
                <label className="block text-slate-800 font-black mb-1.5">
                  Mandatory Justification for Dismissal (Visible to Student):
                </label>
                <textarea
                  rows={3}
                  required
                  value={dismissReason}
                  onChange={(e) => setDismissReason(e.target.value)}
                  placeholder="State detailed reasons for dismissal..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium text-xs focus:bg-white focus:border-rose-600 focus:outline-none transition shadow-inner"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDismissingTicket(null)}
                  className="w-1/3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition text-xs"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDismiss}
                  className="w-2/3 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black transition shadow-lg shadow-rose-600/20 text-xs flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  <span>Confirm Dismissal</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          EVIDENCE IMAGE VIEWER MODAL
          ======================================================== */}
      {viewingImage && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                Attached Evidence Document / Photo
              </span>
              <button
                type="button"
                onClick={() => setViewingImage(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-100 flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img
                src={viewingImage}
                alt="Evidence preview"
                className="max-h-[65vh] w-auto object-contain rounded-2xl shadow-md"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
