export const BOT_RESPONSES = [
  {
    triggers: ['attendance', 'ble', 'beacon', 'proxy', 'mark attendance', 'code'],
    response: 'EduSphere uses DTU-style BLE Proximity Validation. Your phone automatically scans for the classroom Bluetooth beacon. Once within range (0.8m), enter the dynamic room code displayed by your professor (e.g., EDUS-8492) to record attendance with zero chance of remote proxy fraud!'
  },
  {
    triggers: ['virtual id', 'id card', 'qr', 'lost card', 'pass'],
    response: 'Your Virtual ID features a dynamic cryptographic QR code that auto-refreshes every 30 seconds. This prevents screenshot sharing and plastic card loss. It is accepted at all campus gates, labs, and exam halls!'
  },
  {
    triggers: ['grievance', 'complaint', 'anonymous', 'hod', 'staff', 'ac broken', 'food'],
    response: 'EduSphere features Double-Escalation Triage: Academic complaints route directly to the HOD with optional Anonymous Scholar Mode to protect grading bias, while facility issues (AC, water, hygiene, anti-bullying) route straight to Ground Staff.'
  },
  {
    triggers: ['notes', 'pdf', 'faculty', 'download', 'teachers'],
    response: 'You can browse and download course notes in the "Notes & Faculty" tab, or check faculty consultation hours and ratings in the Faculty Directory!'
  },
  {
    triggers: ['who are you', 'what is edusphere', 'help', 'features'],
    response: 'I am EduSphere AI (EduBot) 🤖 — your smart campus companion! I assist students, teachers, HODs, and staff in navigating attendance, grievance resolution, digital ID passes, and announcements.'
  }
];

export const getSmartResponse = (query) => {
  const q = query.toLowerCase();
  for (const item of BOT_RESPONSES) {
    if (item.triggers.some(t => q.includes(t))) {
      return item.response;
    }
  }
  return `Thanks for asking! As EduSphere AI, I can help you with BLE Attendance, Dynamic Virtual IDs, Filing Anonymous Grievances, or finding Lecture Notes. Try asking "How to mark BLE attendance?"`;
};
