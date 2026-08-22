import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import confetti from 'canvas-confetti';
import { 
  FileCheck, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Clock, 
  Eye, 
  Download, 
  Lock, 
  Key, 
  BadgeCheck, 
  Building,
  User,
  Filter,
  Check
} from 'lucide-react';

export default function DigitalApprovals() {
  const { currentUser } = useAuth();
  const { approvals, signApproval, rejectApproval } = useData();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'Pending' | 'Approved' | 'Rejected'
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isSigning, setIsSigning] = useState(false);
  const [signedDocId, setSignedDocId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingDocId, setRejectingDocId] = useState(null);

  const handleSign = (appId) => {
    setIsSigning(true);
    setSignedDocId(appId);

    setTimeout(() => {
      signApproval(appId, currentUser?.name || 'Prof. S. K. Naitik (HOD)');
      setIsSigning(false);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7C3AED', '#4F46E5', '#10B981']
      });
    }, 1000);
  };

  const handleReject = (appId) => {
    rejectApproval(appId, rejectionReason || 'Documentation does not meet university budget guidelines.');
    setRejectingDocId(null);
    setRejectionReason('');
  };

  const filteredApprovals = approvals.filter(a => {
    if (activeFilter === 'all') return true;
    return a.status === activeFilter;
  });

  const pendingCount = approvals.filter(a => a.status === 'Pending').length;
  const approvedCount = approvals.filter(a => a.status === 'Approved').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Cryptographic Sign & Stamp Protocol
            </span>
            <span className="text-xs text-slate-500 font-medium">RSA-2048 Digital Stamp Engine</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Digital Approvals & Institutional Grants</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Authorize event budgets, student On-Duty leaves, and research lab requisitions with cryptographic signing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-center">
            <span className="text-[10px] text-purple-800 font-bold block uppercase">Pending Review</span>
            <span className="text-xl font-black text-purple-700">{pendingCount} Requests</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-[10px] text-emerald-800 font-bold block uppercase">Approved Total</span>
            <span className="text-xl font-black text-emerald-700">{approvedCount} Sealed</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-slate-500 font-semibold flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3" /> Status:
        </span>
        {[
          { id: 'all', label: `All Requests (${approvals.length})` },
          { id: 'Pending', label: `Pending Queue (${pendingCount})`, color: 'text-purple-600' },
          { id: 'Approved', label: `Approved Archive (${approvedCount})`, color: 'text-emerald-600' },
          { id: 'Rejected', label: 'Rejected', color: 'text-rose-600' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeFilter === tab.id
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Approvals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredApprovals.map((app) => {
          const isPending = app.status === 'Pending';
          const isApproved = app.status === 'Approved';
          const isRejected = app.status === 'Rejected';

          return (
            <div
              key={app.id}
              className={`p-6 rounded-3xl border transition-all text-xs flex flex-col justify-between space-y-4 relative overflow-hidden bg-white ${
                isApproved
                  ? 'border-emerald-300 shadow-sm'
                  : isPending
                  ? 'border-purple-300 shadow-sm'
                  : 'border-rose-300 shadow-sm'
              }`}
            >
              {/* Watermark for approved */}
              {isApproved && (
                <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none text-emerald-600">
                  <BadgeCheck className="w-40 h-40" />
                </div>
              )}

              <div className="space-y-3">
                
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                        {app.id}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        {app.category}
                      </span>
                      {app.urgency === 'High' || app.urgency === 'Urgent' ? (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          {app.urgency}
                        </span>
                      ) : null}
                    </div>

                    <h4 className="font-bold text-slate-900 text-base mt-1.5 leading-snug">
                      {app.title}
                    </h4>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isApproved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    isPending ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                    'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {app.status}
                  </span>
                </div>

                {/* Requester & Financial/Duration Details */}
                <div className="grid grid-cols-2 gap-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Submitted By:</span>
                    <span className="font-bold text-slate-800">{app.requester}</span>
                    <span className="text-slate-500 block text-[10px]">{app.requesterRole}</span>
                  </div>

                  <div>
                    {app.amount ? (
                      <>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Requested Budget:</span>
                        <span className="font-black text-emerald-700 text-sm">{app.amount}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Duration / Scope:</span>
                        <span className="font-bold text-indigo-700">{app.duration}</span>
                      </>
                    )}
                    <span className="text-slate-500 block text-[10px]">{app.submissionDate}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-600 leading-relaxed font-medium">
                  {app.description}
                </p>

                {/* Document Attachments */}
                {app.documents && app.documents.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Attached Evidence & Invoices:</span>
                    <div className="flex flex-wrap gap-2">
                      {app.documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-[11px] hover:border-purple-400 transition"
                        >
                          <FileText className="w-3.5 h-3.5 text-purple-600" />
                          <span className="font-medium">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Digital Seal / Actions Footer */}
              <div className="pt-4 border-t border-slate-100">
                {isApproved ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                        <BadgeCheck className="w-4 h-4 text-emerald-600" />
                        <span>Digitally Sealed & Approved</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{app.signedAt}</span>
                    </div>
                    <div className="text-[10px] font-mono text-emerald-700 flex items-center justify-between">
                      <span>Auth Hash: {app.signatureHash}</span>
                      <span>By {app.signedBy}</span>
                    </div>
                  </div>
                ) : isPending ? (
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <button
                      onClick={() => handleSign(app.id)}
                      disabled={isSigning && signedDocId === app.id}
                      className="w-full sm:flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs"
                    >
                      {isSigning && signedDocId === app.id ? (
                        <>
                          <Sparkles className="w-4 h-4 animate-spin text-purple-200" />
                          <span>Generating Cryptographic RSA Seal...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Digital Sign & Stamp (Approve)</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setRejectingDocId(app.id)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">
                    <span className="font-bold block">Rejected by HOD:</span>
                    <span>{app.rejectionReason || 'Requirements not satisfied.'}</span>
                  </div>
                )}
              </div>

              {/* Rejection Remarks Modal/Drawer */}
              {rejectingDocId === app.id && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-rose-200 space-y-3 mt-3 animate-fadeIn">
                  <span className="font-bold text-rose-800 block">State Reason for Rejection:</span>
                  <input
                    type="text"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Budget quotation missing GST invoice or date conflict"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:border-rose-500 focus:outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReject(app.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                    >
                      Confirm Rejection
                    </button>
                    <button
                      onClick={() => setRejectingDocId(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}

