export const BOT_RESPONSES = [
  {
    triggers: ['attendance', 'ble', 'beacon', 'proxy', 'mark attendance', 'code', 'room code'],
    response: 'EduSphere uses DTU-style BLE Proximity Validation. Your phone automatically scans for the classroom Bluetooth beacon. Once within range (0.8m), enter the dynamic room code displayed by your professor (e.g., EDUS-8492) to record attendance with zero chance of remote proxy fraud!'
  },
  {
    triggers: ['teacher', 'faculty', 'take attendance', 'roster', 'publish note'],
    response: 'In the Faculty Portal, professors can start live BLE attendance radar sessions, generate dynamic room PINs, view color-coded roster grids (🟢 Present, 🔴 Absent, ⚪ Leave), and upload lecture PDFs directly into student vaults!'
  },
  {
    triggers: ['hod', 'substitution', 'signature', 'approval', 'stamp', 'broadcast'],
    response: 'The HOD Console empowers department heads with an automated Teacher Substitution Matrix for absent faculty, Cryptographic RSA Digital Stamp Approvals for event budgets / OD leaves, and real-time Urgent Broadcast transmitters!'
  },
  {
    triggers: ['staff', 'maintenance', 'cleaning', 'hotline', 'repair', 'ticket'],
    response: 'The Ground Staff Portal features 6 domain dispatch cells (Maintenance, Cleaning, Emergency Medical, Anti-Bullying, Tech Support, Admission), photographic evidence reviews, on-duty worker squads, and the 24x7 Campus SOS Hotline (Ext: 108/112).'
  },
  {
    triggers: ['virtual id', 'id card', 'qr', 'lost card', 'pass'],
    response: 'Your Virtual ID features a dynamic cryptographic QR code that auto-refreshes every 30 seconds. This prevents screenshot sharing and plastic card loss. It is accepted at all campus gates, labs, and exam halls!'
  },
  {
    triggers: ['grievance', 'complaint', 'anonymous', 'ac broken', 'food', 'hygiene'],
    response: 'EduSphere features Double-Escalation Triage: Academic complaints route directly to the HOD with optional Anonymous Scholar Mode to protect grading bias, while facility issues (AC, water, hygiene, anti-bullying) route straight to Ground Staff.'
  },
  {
    triggers: ['notes', 'pdf', 'download', 'teachers', 'syllabus'],
    response: 'You can browse and download course notes in the "Notes & Faculty" tab, or check faculty consultation hours and ratings in the Faculty Directory!'
  },
  {
    triggers: ['who are you', 'what is edusphere', 'help', 'features'],
    response: 'I am EduSphere AI (EduBot) 🤖 — your smart campus companion! I assist students, teachers, HODs, and staff in navigating attendance, grievance resolution, digital ID passes, teacher substitutions, and announcements.'
  }
];

export const getSmartResponse = (query) => {
  const q = query.toLowerCase();
  for (const item of BOT_RESPONSES) {
    if (item.triggers.some(t => q.includes(t))) {
      return item.response;
    }
  }
  return `Thanks for asking! As EduSphere AI, I can help you with BLE Attendance, Dynamic Virtual IDs, Filing Anonymous Grievances, Teacher Substitutions, Digital Approvals, or finding Lecture Notes. Try asking "How does the substitution engine work?"`;
};

