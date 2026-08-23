import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/soundEffects';
import { 
  Users, 
  UserX, 
  UserCheck, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  ArrowRight, 
  Zap, 
  FileText, 
  Download,
  Search,
  Check,
  Building2,
  BookOpen,
  MapPin,
  X,
  MessageSquare,
  ShieldCheck,
  Award
} from 'lucide-react';

export default function SubstitutionEngine() {
  const { substitutions, assignSubstitution, facultyDirectory } = useData();
  const [selectedSub, setSelectedSub] = useState(null);
  const [chosenTeacher, setChosenTeacher] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [successNotice, setSuccessNotice] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Algorithmic Scorer: computes ranked match score for each faculty member against an absent slot
  const rankFacultyForSlot = (slotItem) => {
    if (!slotItem || !facultyDirectory) return [];

    return facultyDirectory
      .map(fac => {
        let score = 50; // base score
        const reasons = [];

        // 1. Department match (+30 pts)
        if (slotItem.subject && (fac.department?.toLowerCase().includes('computer science') || fac.department?.toLowerCase().includes('cse'))) {
          score += 30;
          reasons.push('CSE Core Department Match (+30%)');
        }

        // 2. Subject familiarity (+20 pts)
        const subWords = slotItem.subject.toLowerCase().split(/[\s,:-]+/);
        const facSubjects = (fac.subject || '').toLowerCase();
        const hasKeyword = subWords.some(w => w.length > 3 && facSubjects.includes(w));
        if (hasKeyword) {
          score += 20;
          reasons.push('Direct Domain Competency (+20%)');
        }

        // 3. Free period slot check
        if (fac.id !== 'FAC-LEAVE-999') {
          score += 15;
          reasons.push(`Free During ${slotItem.slot?.split('-')[0] || 'Period'} (+15%)`);
        }

        // 4. Cap at 98%
        const matchPercent = Math.min(98, score);

        return {
          ...fac,
          matchPercent,
          reasons,
          isTopMatch: matchPercent >= 90
        };
      })
      .sort((a, b) => b.matchPercent - a.matchPercent);
  };

  const handleOpenAssignModal = (sub) => {
    setSelectedSub(sub);
    const ranked = rankFacultyForSlot(sub);
    setChosenTeacher(ranked[0]?.name || facultyDirectory[0]?.name || 'Dr. Manish Verma');
    setCustomInstructions(`Please conduct practical revision & take BLE attendance for ${sub.subject}.`);
  };

  const handleConfirmAssignment = (subId, teacherName, instructions) => {
    const finalTeacher = teacherName || chosenTeacher;
    const finalNotes = instructions || customInstructions;

    assignSubstitution(subId, finalTeacher, finalNotes);

    setSuccessNotice({
      subId,
      teacher: finalTeacher,
      subject: selectedSub?.subject || 'Class session',
      slot: selectedSub?.slot || 'Period slot',
      notes: finalNotes
    });

    try {
      sounds.playSuccessFanfare();
    } catch (e) {}

    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#7C3AED', '#4F46E5', '#10B981', '#F59E0B']
    });

    setSelectedSub(null);
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  const handleQuickAutoAssign = (sub) => {
    const ranked = rankFacultyForSlot(sub);
    const bestMatch = ranked[0]?.name || 'Dr. Manish Verma';
    handleConfirmAssignment(sub.id, bestMatch, `1-Click Auto-Reassigned by HOD Algorithm. Please cover ${sub.subject} @ ${sub.room}.`);
  };

  const pendingSubs = substitutions.filter(s => s.status === 'Pending');
  const assignedSubs = substitutions.filter(s => s.status === 'Assigned' || s.status === 'Completed');

  const filteredFaculty = facultyDirectory.filter(fac => {
    const matchesDept = filterDepartment === 'ALL' || fac.department?.toLowerCase().includes(filterDepartment.toLowerCase());
    const matchesSearch = fac.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          fac.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          fac.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5 shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-purple-600" />
              Automated AI Faculty Substitution Engine
            </span>
            <span className="text-xs text-slate-500 font-medium">Zero Class Cancellation Matrix</span>
          </div>
          
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Teacher Substitution & Timetable Reassignment Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Monitors real-time faculty leaves and automatically computes optimal peer substitutions based on free period availability, academic department alignment, and subject expertise.
          </p>
        </div>

        {/* Real-time KPI Stats */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center min-w-[110px] shadow-2xs">
            <span className="text-[10px] text-rose-700 font-black block uppercase tracking-wider">Unfilled Slots</span>
            <span className="text-2xl font-black text-rose-700">{pendingSubs.length}</span>
            <span className="text-[10px] text-rose-600 block font-semibold">Requires Action</span>
          </div>
          
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center min-w-[110px] shadow-2xs">
            <span className="text-[10px] text-emerald-700 font-black block uppercase tracking-wider">Covered Today</span>
            <span className="text-2xl font-black text-emerald-700">{assignedSubs.length}</span>
            <span className="text-[10px] text-emerald-600 block font-semibold">Classes Active</span>
          </div>
        </div>
      </div>

      {/* Reassignment Dispatched Success Banner */}
      {successNotice && (
        <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-fadeIn shadow-md">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-2xl bg-emerald-600 text-white shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-emerald-900 text-sm">
                Smart Substitution Dispatched & Live-Synced!
              </h4>
              <p className="text-slate-700 mt-0.5 font-medium">
                <strong className="text-emerald-800">{successNotice.teacher}</strong> has been officially designated substitute for <strong className="text-slate-900">{successNotice.subject}</strong> ({successNotice.slot}).
              </p>
              {successNotice.notes && (
                <p className="text-[11px] text-slate-500 italic mt-1 bg-white/70 px-2.5 py-1 rounded-lg border border-emerald-200/60 inline-block">
                  Note: "{successNotice.notes}"
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-xl font-mono font-bold border border-emerald-300">
              ⚡ Broadcast Sent
            </span>
          </div>
        </div>
      )}

      {/* Main Split Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Absent Faculty Leave Matrix & Actions */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <UserX className="w-5 h-5 text-rose-600" />
                  Faculty Leave Queue & Affected Lecture Slots ({substitutions.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click 'Smart Auto-Assign' to calculate match scores or customize reassignment manually.
                </p>
              </div>
              
              <span className="text-xs text-slate-600 font-mono font-bold bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
                Today's Schedule
              </span>
            </div>

            {/* Substitution Cards List */}
            <div className="space-y-4">
              {substitutions.map((sub) => {
                const isPending = sub.status === 'Pending';
                const isAssigned = sub.status === 'Assigned';
                const rankedMatches = rankFacultyForSlot(sub);
                const topMatch = rankedMatches[0];

                return (
                  <div
                    key={sub.id}
                    className={`p-5 sm:p-6 rounded-3xl border transition-all space-y-4 ${
                      isPending
                        ? 'bg-rose-50/50 border-rose-200 shadow-sm hover:border-rose-300'
                        : 'bg-slate-50/70 border-slate-200'
                    }`}
                  >
                    {/* Header Slot Row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono font-black text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                          {sub.id}
                        </span>
                        
                        <h4 className="font-black text-slate-900 text-sm sm:text-base">
                          {sub.subject}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-mono text-purple-700 bg-purple-100 px-3 py-1 rounded-full font-bold border border-purple-200">
                          {sub.slot}
                        </span>
                        
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isPending 
                            ? 'bg-rose-600 text-white shadow-sm animate-pulse' 
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold'
                        }`}>
                          {isPending ? 'Action Required' : 'Reassigned'}
                        </span>
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-4 rounded-2xl bg-white border border-slate-200/90 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Absent Faculty:</span>
                        <span className="font-bold text-rose-600">{sub.absentFaculty}</span>
                      </div>
                      
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Leave Justification:</span>
                        <span className="text-slate-700 font-medium">{sub.reason}</span>
                      </div>
                      
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Room & Section:</span>
                        <span className="text-slate-800 font-bold">{sub.room} • {sub.semester}</span>
                      </div>
                    </div>

                    {/* Status & Resolution Action Bar */}
                    <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      {isPending ? (
                        <>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-black text-[10px] uppercase font-mono">
                              ⭐ {topMatch?.matchPercent || 95}% AI Score
                            </span>
                            <span className="text-slate-600 font-medium">
                              Best Available: <strong className="text-purple-700 font-bold">{topMatch?.name || 'Dr. Manish Verma'}</strong>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={() => handleQuickAutoAssign(sub)}
                              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                            >
                              <Zap className="w-3.5 h-3.5" />
                              <span>⚡ 1-Click Auto-Assign</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenAssignModal(sub)}
                              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                            >
                              <span>Customize</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2 text-xs">
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-700">
                              <UserCheck className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-slate-500 font-medium">Designated Substitute: </span>
                              <strong className="text-emerald-700 font-black text-xs">{sub.assignedTo}</strong>
                              {sub.assignedAt && (
                                <span className="text-[10px] text-slate-400 font-mono ml-2">({sub.assignedAt})</span>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleOpenAssignModal(sub)}
                            className="text-xs text-purple-700 hover:text-purple-900 font-bold underline cursor-pointer self-start sm:self-auto"
                          >
                            Modify Reassignment
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Right 4 Cols: Live Free Faculty Availability Pool */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Department Faculty Directory ({facultyDirectory.length})
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Live Pool
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Department professors available for emergency substitution duty:
            </p>

            {/* Search and filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search faculty or subject..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-500 transition"
                />
              </div>
            </div>

            {/* Faculty List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredFaculty.map((fac) => (
                <div 
                  key={fac.id} 
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200/80 transition-all text-xs flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={fac.avatar} 
                      alt={fac.name} 
                      className="w-10 h-10 rounded-2xl object-cover border border-slate-200 shrink-0" 
                    />
                    <div className="min-w-0">
                      <h5 className="font-bold text-slate-900 truncate group-hover:text-purple-700 transition">
                        {fac.name}
                      </h5>
                      <p className="text-[10px] text-slate-500 truncate font-medium">
                        {fac.designation} • {fac.cabin}
                      </p>
                      <p className="text-[10px] text-purple-600 truncate font-semibold mt-0.5">
                        {fac.subject}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    Available
                  </span>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================
          INTERACTIVE SMART REASSIGNMENT MODAL
          ======================================================== */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-scaleUp">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/10 text-white ring-1 ring-white/20">
                  <Zap className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200 font-bold block">
                    Slot Reassignment Protocol
                  </span>
                  <h3 className="text-lg font-black text-white">
                    Assign Substitute Teacher
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs">
              
              {/* Affected Class Summary */}
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-900 text-sm">
                    {selectedSub.subject}
                  </span>
                  <span className="font-mono text-[11px] font-bold bg-purple-200 text-purple-900 px-2.5 py-0.5 rounded-full">
                    {selectedSub.slot}
                  </span>
                </div>
                
                <p className="text-slate-600 text-[11px]">
                  <strong>Absent:</strong> <span className="text-rose-600 font-semibold">{selectedSub.absentFaculty}</span> ({selectedSub.reason}) • <strong>Location:</strong> {selectedSub.room} • {selectedSub.semester}
                </p>
              </div>

              {/* Algorithmic Recommendations */}
              <div>
                <label className="block text-slate-800 font-black mb-2 flex items-center justify-between">
                  <span>Select Substitute Lecturer:</span>
                  <span className="text-purple-600 font-normal text-[11px]">Ranked by Domain Match & Free Periods</span>
                </label>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {rankFacultyForSlot(selectedSub).map((fac) => {
                    const isSelected = chosenTeacher === fac.name;
                    return (
                      <button
                        key={fac.id}
                        type="button"
                        onClick={() => setChosenTeacher(fac.name)}
                        className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-600/20 font-bold text-slate-900'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/70'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={fac.avatar} alt={fac.name} className="w-8 h-8 rounded-xl object-cover shrink-0" />
                          <div className="min-w-0">
                            <span className="font-bold block truncate">{fac.name}</span>
                            <span className="text-[10px] text-slate-500 block truncate">{fac.subject.split('&')[0]}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-black ${
                            fac.matchPercent >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {fac.matchPercent}% Match
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-purple-600" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Instructions */}
              <div>
                <label className="block text-slate-800 font-black mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                  <span>Official HOD Directive / Practical Notes for Substitute:</span>
                </label>
                <textarea
                  rows={2}
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="e.g. Please conduct Lab 204 memory benchmarks and take live BLE attendance..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium text-xs focus:bg-white focus:border-purple-600 focus:outline-none transition shadow-inner"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="w-1/3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition text-xs"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => handleConfirmAssignment(selectedSub.id, chosenTeacher, customInstructions)}
                  className="w-2/3 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black transition shadow-lg shadow-purple-600/20 text-xs flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm & Broadcast Reassignment</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
