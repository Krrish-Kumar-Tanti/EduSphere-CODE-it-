import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import confetti from 'canvas-confetti';
import { 
  Send, 
  Bell, 
  AlertTriangle, 
  Radio, 
  Trash2, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  Volume2
} from 'lucide-react';

export default function Broadcasts() {
  const { currentUser } = useAuth();
  const { broadcasts, addBroadcast, deleteBroadcast } = useData();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isUrgent, setIsUrgent] = useState(true);
  const [targetAudience, setTargetAudience] = useState('CSE Department (All Semesters)');
  const [isSent, setIsSent] = useState(false);

  const audienceOptions = [
    'All Campus Students',
    'CSE Department (All Semesters)',
    '6th Semester Students Only',
    'Faculty & Ground Staff Only'
  ];

  const handleTransmitBroadcast = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newBroadcast = {
      id: `BC-${Math.floor(10 + Math.random() * 90)}`,
      sender: `${currentUser?.name || 'Prof. S. K. Naitik'} (HOD CSE)`,
      role: 'HOD',
      title: `${isUrgent ? '🚨 ' : '📢 '}${title}`,
      message,
      time: 'Just now (Today)',
      isUrgent,
      targetAudience
    };

    addBroadcast(newBroadcast);
    setIsSent(true);
    setTitle('');
    setMessage('');

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#7C3AED', '#E11D48', '#4F46E5']
    });

    setTimeout(() => setIsSent(false), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              Live Campus Push Transmitter
            </span>
            <span className="text-xs text-slate-500 font-medium">Instantly overlays student dashboards & alert feeds</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Urgent Department Broadcast Console</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast emergency alerts, exam schedule shifts, or campus advisories directly to all student smartphones.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
          <span className="font-bold block text-sm">Real-Time Sync</span>
          <span className="text-rose-600">Reflects immediately on student marquee</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Transmit Push Alert */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-purple-600" />
              Compose & Transmit Urgent Alert
            </h3>

            <form onSubmit={handleTransmitBroadcast} className="space-y-4 text-xs">
              
              {/* Priority Toggle */}
              <div>
                <label className="text-slate-700 font-bold block mb-1.5">Broadcast Priority Level:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUrgent(true)}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                      isUrgent
                        ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-500/20'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>🚨 Urgent / Critical</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsUrgent(false)}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                      !isUrgent
                        ? 'bg-purple-600 text-white shadow-xs ring-2 ring-purple-500/20'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>📢 Standard Notice</span>
                  </button>
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="text-slate-700 font-bold block mb-1.5">Target Audience Segment:</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-purple-500 focus:outline-none"
                >
                  {audienceOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="text-slate-700 font-bold block mb-1.5">Announcement Headline:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mid-Term Lab Exam Slot Shift for CSE-6A"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-purple-500 focus:outline-none placeholder-slate-400 font-medium"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-slate-700 font-bold block mb-1.5">Full Notification Body:</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type clear instructions for students, timings, required ID card passes, etc."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-purple-500 focus:outline-none placeholder-slate-400 leading-relaxed font-medium"
                />
              </div>

              {/* Success Notification */}
              {isSent && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Push notification transmitted instantly to all target devices!</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs ${
                  isUrgent
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Transmit Live Push Alert</span>
              </button>

            </form>
          </div>
        </div>

        {/* Right List: Broadcasts History */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-rose-600" />
                Active Campus Broadcasts Stream ({broadcasts.length})
              </h3>
              <span className="text-xs text-slate-500 font-medium">Over-the-air push logs</span>
            </div>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {broadcasts.map((bc) => (
                <div
                  key={bc.id}
                  className={`p-5 rounded-2xl border transition-all text-xs space-y-2.5 ${
                    bc.isUrgent
                      ? 'bg-rose-50/70 border-rose-200 shadow-xs'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">{bc.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          bc.isUrgent ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-purple-100 text-purple-800 border border-purple-200'
                        }`}>
                          {bc.isUrgent ? 'URGENT MARQUEE' : 'STANDARD'}
                        </span>
                        <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 font-medium">
                          {bc.targetAudience || 'All Campus'}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm mt-1.5">
                        {bc.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => deleteBroadcast(bc.id)}
                      className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 transition"
                      title="Recall / Delete Broadcast"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-slate-700 leading-relaxed font-medium">
                    {bc.message}
                  </p>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Transmitted by: <span className="font-bold text-slate-800">{bc.sender}</span></span>
                    <span className="font-mono">{bc.time}</span>
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

