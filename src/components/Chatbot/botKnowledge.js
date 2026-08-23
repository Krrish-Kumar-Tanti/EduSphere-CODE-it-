// Comprehensive Multilingual (English + Hindi/Hinglish) Campus AI Companion Knowledge Engine

export const INTENT_RESPONSES = [
  // --- 1. ATTENDANCE, BLE PROXIMITY RADAR & 75% QUOTA ---
  {
    category: 'Attendance & BLE Mesh',
    triggers: [
      'attendance kaise lagaye', 'attendance mark', 'ble radar', 'beacon', 'proxy',
      'room code', 'pin', 'attendance nahi lag rahi', 'attendance status', '75%', 'shortage',
      'attendance criteria', 'absent mark ho gaya', 'presence', 'mark attendance'
    ],
    response: `📍 **Attendance Kaise Lagaye (BLE Proximity Radar Guide):**

1. **Classroom Range**: Apne phone ka Bluetooth on rakhein aur classroom ke BLE Beacon (0.8m range) ke paas aayein.
2. **Dynamic PIN**: Screen par green radar blink karega. Apne Professor ke projector/display par dikh raha **4-digit dynamic room code** (e.g. *OS42*) enter karein.
3. **Live Verification**: PIN submit karte hi aap live roster me 🟢 **Present** mark ho jayenge.
4. **75% Mandatory Quota**: Attendance Client calendar me green/red dots se aap period-by-period status aur 75% minimum quota calculator check kar sakte hain!`
  },

  // --- 2. VIRTUAL ID CARD, 3D HOLOGRAPHIC PASS & QR SCAN ---
  {
    category: 'Virtual ID & Security QR',
    triggers: [
      'virtual id', 'id card', 'qr code', 'scan nahi ho raha', 'gate entry', 'nfc tap',
      'holographic pass', 'digital id', 'id card download', 'id card kaise milega', 'barcode',
      'rotating qr', 'photo change'
    ],
    response: `💳 **3D Holographic Virtual ID Pass & Security QR:**

1. **30-Second Dynamic QR**: Screenshot fraud rokne ke liye Virtual ID ka QR code har 30 seconds me cryptographic hash ke sath auto-rotate hota hai.
2. **Gate Entry Scan**: Campus security gate ya exam hall par "Live Laser Scan" simulator se apna Level-H dynamic QR dikhayein.
3. **3D Tilt & NFC Tap**: ID card par cursor ghumane se physics-based holographic sheen effect dikhta hai. Back card flip karke **RFID NFC Tap** simulate kar sakte hain.
4. **Offline PDF Badge**: 'Printable Formal PDF' button se official 300 DPI PVC pass download kar sakte hain!`
  },

  // --- 3. ACADEMIC GRIEVANCES & ANONYMOUS SCHOLAR DESK ---
  {
    category: 'Grievance & Academic Triage',
    triggers: [
      'teacher ko complaint', 'marks issue', 'grading bias', 'grievance', 'complaint',
      'anonymous mode', 'hod ko complaint', 'ragging', 'harassment', 'retaliation',
      'unfair marking', 'academic complaint'
    ],
    response: `⚖️ **Double-Escalation Grievance & Anonymous Scholar Desk:**

1. **Zero-Retaliation Guarantee**: Agar aapko grading bias ya harassment ki complaint karni hai, toh Grievance Drawer me **"Anonymous Scholar Identity Mask"** toggle on karein.
2. **Destination Triage**:
   - 🎓 **Academic / Grading / Teacher Issues** ➔ Seedhe **HOD Academic Office** ko route hote hain.
   - 🛠️ **Facility / Infrastructure Issues** ➔ Ground Staff ko dispatch hote hain.
3. **Live Tracking**: HOD desk par review hone par ticket status *In Progress* se *Resolved* me update ho jayega!`
  },

  // --- 4. GROUND MAINTENANCE & FACILITY REPAIRS ---
  {
    category: 'Ground Staff & Maintenance',
    triggers: [
      'ac kharab hai', 'water filter', 'paani nahi aa raha', 'fan nahi chal raha',
      'light repair', 'washroom safai', 'cleaning', 'maintenance', 'staff ticket',
      'broken bench', 'lab maintenance', 'campus hygiene'
    ],
    response: `🛠️ **Campus Facilities & Maintenance Work Orders:**

1. **Ticket Kaise Raise Karein**: Grievance Desk me 'Facility / Maintenance' category select karein aur Room/Lab number enter karein (e.g. *Lab 204, Block 4*).
2. **Photo Evidence**: Problem ki picture upload karein taaki ground technician seedhe spare parts lekar aaye.
3. **Technician Dispatch**: Staff portal par Ramu Electrician ya Suresh Plumbing ko work order allot hota hai. Kaam poora hote hi **Emerald Green "Work Done"** verification se ticket resolve hota hai!`
  },

  // --- 5. NOTES VAULT & SYLLABUS PDF DOWNLOADS ---
  {
    category: 'Notes & Syllabus Vault',
    triggers: [
      'notes kahan milenge', 'pdf download', 'notes download', 'study material',
      'syllabus', 'unit 1', 'unit 2', 'lecture pdf', 'book download', 'curriculum'
    ],
    response: `📚 **Notes Vault & Universal Syllabus Repository:**

1. **Notes Download**: Student Dashboard me **"Notes & Faculty"** tab kholein. Wahan semester aur branch ke hisab se verified faculty PDFs available hain.
2. **Unit-by-Unit Modules**: Har PDF par topic tags aur unit breakdown (Unit 1 se Unit 4) highlighted hain.
3. **Faculty Syllabus Tracker**: Teachers dwara live cover kiye gaye unit completion percentages aap syllabus progress meter me dekh sakte hain!`
  },

  // --- 6. HOD TEACHER SUBSTITUTION & RSA APPROVALS ---
  {
    category: 'HOD Console & Substitution',
    triggers: [
      'teacher absent hai', 'substitution', 'free period', 'proxy teacher',
      'hod dashboard', 'rsa approval', 'budget grant', 'timetable publish'
    ],
    response: `🏛️ **HOD Executive Command & Substitution Matrix:**

1. **Automated Teacher Reassignment**: Jab koi faculty leave par hote hain, HOD console department timetable matrix analyze karke free teachers ko smart auto-allot karta hai.
2. **RSA Cryptographic Approvals**: Hackathon budgets, lab equipment grants aur duty leaves ko HOD digital signature stamp ke sath 1-click me approve karte hain.
3. **Master Timetable Sync**: HOD weekly section matrix edit karke publish karte hi sabhi students ke screen par live broadcast ho jata hai!`
  },

  // --- 7. ULTRA-PRIVATE 1-ON-1 WHATSAPP CHAT ---
  {
    category: 'Direct WhatsApp Chat',
    triggers: [
      'teacher se baat kaise kare', 'direct message', 'chat drawer', 'whatsapp',
      'message private hai', 'private chat', 'faculty consultation', 'chat leak'
    ],
    response: `💬 **Ultra-Private 1-on-1 Direct WhatsApp Chat:**

1. **Peer-to-Peer Privacy**: Har chat strict thread isolation (`[User1_User2]`) par kaam karti hai. Student aur Teacher ki baatein HOD ya Staff ke screen par **kabhi leak nahi hoti**.
2. **Instant Audio & Toasts**: Message aane par recipient ke screen par real-time audio chime aur floating popup toast display hota hai.
3. **Double Ticks & Files**: WhatsApp ki tarah Blue double-ticks, dynamic timestamps aur file attachments supported hain!`
  },

  // --- 8. TIMETABLES & CLASS SCHEDULES ---
  {
    category: 'Timetable Matrix',
    triggers: [
      'timetable kaise dekhe', 'class schedule', 'room 4202', 'section s2',
      'section a4', 'classes kab hai', 'period time', 'lunch break'
    ],
    response: `📅 **Section Timetable Matrix Engine:**

1. **Personalized View**: Student Dashboard me "Class Timetable" tab aapke registered section (e.g. *Section-S2*, *Section-A4*, *CSE-A*) ka complete Monday–Friday schedule load karta hai.
2. **Room & Faculty**: Har slot me Subject Code, Room Number (e.g. *Room 4202, Shastri Park Block*), aur assigned professor ka naam dikhta hai!`
  },

  // --- 9. HINGLISH GREETINGS & CASUAL TALK ---
  {
    category: 'Greetings & Introduction',
    triggers: [
      'namaste', 'kaise ho', 'kya haal hai', 'bhai', 'who are you', 'kya kar sakte ho',
      'hello', 'hi', 'hey', 'help', 'edubot', 'madad'
    ],
    response: `👋 **Namaste! Main hoon EduBot 🤖 — Aapka Intelligent Campus AI Companion!**

Main aapki in cheezon me madad kar sakta hoon:
- 📡 **BLE Attendance PIN & Quota** ("*attendance kaise lagaye?*")
- 💳 **3D Virtual ID Pass & QR** ("*ID card scan nahi ho raha*")
- ⚖️ **Anonymous Grievance Filing** ("*teacher ko complaint kaise kare?*")
- 🛠️ **Hostel & Lab Repairs** ("*AC kharab hai lab me*")
- 📚 **Notes & Syllabus Vault** ("*notes download kaise kare?*")
- 💬 **Private 1-on-1 Faculty Chat** ("*teacher se chat kaise kare?*")

Bataiye, aaj main aapki kya madad karoon?`
  }
];

export const getSmartResponse = (query = '') => {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return "Please enter your campus query or select a quick topic below!";

  let bestMatch = null;
  let highestScore = 0;

  for (const item of INTENT_RESPONSES) {
    let score = 0;
    for (const trigger of item.triggers) {
      if (cleanQuery.includes(trigger.toLowerCase())) {
        score += trigger.length; // weight longer specific phrase matches higher
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && highestScore > 0) {
    return bestMatch.response;
  }

  // Smart Contextual Fallback with suggestions
  return `🤖 **EduBot Intelligence Hub**:

Aapka sawal *"**${query}**"* note ho gaya hai! Main EduSphere Smart Campus OS ka AI companion hoon. Aap mujhse pooch sakte hain:

1. 📍 *"Attendance kaise lagaye BLE radar se?"*
2. 💳 *"Virtual ID pass ka rotating QR code kaise kaam karta hai?"*
3. ⚖️ *"Teacher ke against anonymous complaint kaise karein?"*
4. 🛠️ *"Lab ka AC ya water cooler repair work order kaise raise karein?"*
5. 📚 *"Subject notes aur lecture PDF kahan milenge?"*
6. 💬 *"Faculty se 1-on-1 direct WhatsApp chat kaise karein?"*`;
};
