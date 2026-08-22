import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import confetti from 'canvas-confetti';
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
  Check
} from 'lucide-react';

export default function SubstitutionEngine() {
  const { substitutions, assignSubstitution, facultyDirectory } = useData();
  const [selectedSub, setSelectedSub] = useState(null);
  const [manualTeacher, setManualTeacher] = useState('Dr. Manish Verma');
  const [successNotice, setSuccessNotice] = useState(null);

  const handleAutoAssign = (sub) => {
    // Pick the best available suggested faculty
    const candidate = sub.suggestedFaculty?.[0] || 'Dr. Manish Verma';
    assignSubstitution(sub.id, candidate);
    
    setSuccessNotice({
      subId: sub.id,
      teacher: candidate,
      subject: sub.subject
    });

    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#7C3AED', '#4F46E5', '#10B981']
    });

    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handleManualAssign = (subId) => {
    if (!manualTeacher) return;
    assignSubstitution(subId, manualTeacher);
    
    setSuccessNotice({
      subId,
      teacher: manualTeacher,
      subject: 'Class session'
    });

    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const pendingCount = substitutions.filter(s => s.status === 'Pending').length;
  const assignedCount = substitutions.filter(s => s.status === 'Assigned' || s.status === 'Completed').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              AI Automated Reassignment Matrix
            </span>
            <span className="text-xs text-slate-500 font-medium">Zero class cancellation algorithm</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Teacher Substitution & Timetable Matrix</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Detects faculty leaves and automatically re-routes unoccupied free teachers with matched subject domain competencies.
          </p>
        </div>

        {/* Quick KPI pills */}
        <div className="flex items-center gap-2">
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-center">
            <span className="text-[10px] text-rose-800 font-bold block uppercase">Unfilled Slots</span>
            <span className="text-lg font-black text-rose-700">{pendingCount} Classes</span>
          </div>
          <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-center">
            <span className="text-[10px] text-purple-800 font-bold block uppercase">Resolved Today</span>
            <span className="text-lg font-black text-purple-700">{assignedCount} Reassigned</span>
          </div>
        </div>
      </div>

      {/* Success Alert Toast */}
      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-xs animate-fadeIn shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="font-bold">Smart Substitution Successfully Dispatched!</span>
              <p className="text-slate-600 mt-0.5 font-medium">
                <span className="text-emerald-700 font-bold">{successNotice.teacher}</span> has been designated substitute for <span className="text-slate-900 font-bold">{successNotice.subject}</span>.
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg font-mono font-bold">
            Push Notification Sent
          </span>
        </div>
      )}

      {/* Visual Schedule Matrix of Absent Faculty Slots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Absent Faculty Slots List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserX className="w-4 h-4 text-rose-600" />
                Today's Faculty Leave Slots Requiring Substitution ({substitutions.length})
              </h3>
              <span className="text-xs text-slate-500 font-mono font-medium">22 August 2026</span>
            </div>

            <div className="space-y-3">
              {substitutions.map((sub) => {
                const isPending = sub.status === 'Pending';
                const isAssigned = sub.status === 'Assigned';
                const isCompleted = sub.status === 'Completed';

                return (
                  <div
                    key={sub.id}
                    className={`p-5 rounded-2xl border transition-all text-xs space-y-3 ${
                      isPending
                        ? 'bg-rose-50/70 border-rose-200 shadow-xs'
                        : isAssigned
                        ? 'bg-purple-50/70 border-purple-200'
                        : 'bg-slate-50 border-slate-200 opacity-75'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {sub.id}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">
                          {sub.subject}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full font-bold">
                          {sub.slot}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          isPending ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse' :
                          isAssigned ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          'bg-slate-200 text-slate-700'
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                    </div>

                    {/* Absent details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-white border border-slate-200 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Absent Lecturer:</span>
                        <span className="font-bold text-rose-600">{sub.absentFaculty}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Leave Reason:</span>
                        <span className="text-slate-700 font-medium">{sub.reason}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Room & Target Section:</span>
                        <span className="text-slate-700 font-medium">{sub.room} • {sub.semester}</span>
                      </div>
                    </div>

                    {/* Assigned substitute or Action Bar */}
                    <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      {isPending ? (
                        <>
                          <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                            <span>AI Top Match:</span>
                            <span className="font-bold text-purple-700">{sub.suggestedFaculty?.[0]} (Free at {sub.slot.split('-')[0]})</span>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => handleAutoAssign(sub)}
                              className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                            >
                              <Zap className="w-3.5 h-3.5" />
                              <span>1-Click Auto Reassign</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-emerald-600" />
                            <span className="text-slate-600">Designated Substitute Teacher:</span>
                            <span className="font-bold text-emerald-700 text-xs">{sub.assignedTo}</span>
                          </div>

                          <span className="text-[10px] text-slate-400 font-mono">
                            Status: Auto-Synced with Faculty App
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Free Faculty Pool & Manual Reassignment Controls */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Free Faculty Availability Pool */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              Free Faculty Pool (Available Now)
            </h3>
            <p className="text-xs text-slate-500">
              Department professors without scheduled lectures during current & next period slots:
            </p>

            <div className="space-y-2.5">
              {facultyDirectory.map((fac) => (
                <div key={fac.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={fac.avatar} alt={fac.name} className="w-9 h-9 rounded-xl object-cover border border-slate-200" />
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs">{fac.name}</h5>
                      <span className="text-[10px] text-slate-500">{fac.subject.split('&')[0]}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Available
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Manual Override Dispatch */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              Manual Substitution Override
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Select Professor:</label>
                <select
                  value={manualTeacher}
                  onChange={(e) => setManualTeacher(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-purple-500 focus:outline-none"
                >
                  {facultyDirectory.map(f => (
                    <option key={f.id} value={f.name}>{f.name} ({f.department})</option>
                  ))}
                </select>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Assigning manually overrides automated scheduling algorithms and sends an emergency Push alert to the lecturer.
              </p>

              <button
                onClick={() => {
                  const firstPending = substitutions.find(s => s.status === 'Pending');
                  if (firstPending) {
                    handleManualAssign(firstPending.id);
                  } else {
                    alert('All current substitution slots are already fulfilled!');
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Assign to Next Pending Slot</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

