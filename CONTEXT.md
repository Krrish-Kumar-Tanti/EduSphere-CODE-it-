# EduSphere — Project Master Context & Hackathon Execution Blueprint

## 📌 Project & Team Overview
- **Project Name:** EduSphere (Smart Campus Operating System)
- **Team Name:** CODE it
- **Hackathon:** Prasunethon 2.0 (Prototype & Working MVP Round)
- **Submission Deadline:** Tomorrow @ 11:00 PM
- **Core Concept:** Unified, paperless multi-role campus management web application connecting Students, Faculty, HODs, and Ground Staff with Anti-Proxy BLE Attendance, Double-Escalation Grievance Triage, and a Global Context-Aware AI Assistant.

### 👥 Team Division & Roles
1. **Krrish (Lead / Main Repository Maintainer):**
   - Repository setup, core routing, shared state contexts (`AuthContext`, `DataContext`).
   - Unified Glassmorphism Dark Theme design system.
   - Login Portal (with 1-click demo role auto-fills).
   - Complete Student Portal (Dynamic Virtual ID Card with animated QR, DTU-style BLE Proximity Attendance Client, Photo-supported Grievance Drawer with HOD/Staff triage, Faculty Directory & Notes feed).
2. **Manish (Antigravity Pro):**
   - Faculty / Teacher Portal (Take Attendance with dynamic code generator, real-time color-coded roster grid `Green/Red/Grey`, Lecture Notes publisher).
   - HOD Command Console (Department attendance analytics, Teacher Substitution matrix, Digital Signatures & Approvals, Urgent Broadcast transmitter).
   - Ground Staff Portal (Domain selector: Medical, Cleaning, Anti-Bullying, Maintenance, Admission, Tech Support + Live Ticket Inbox & resolution).
3. **Naitik (Antigravity):**
   - Global Roaming Context-Aware AI Campus Assistant (**EduBot**).
   - Floating interactive widget across all pages with page/role context awareness, suggested chips, feature guidance, and navigation shortcuts.

---

## 🛠 Target Tech Stack & Design Aesthetics
- **Frontend Framework:** React (Vite) + Tailwind CSS + Framer Motion + Lucide React + Canvas-Confetti
- **Design System:** Ultra-modern dark-mode Cyber-Glassmorphism
  - Background: Deep slate (`#0B0F19`, `#0F172A`, `#1E293B`)
  - Accent Colors: Electric Cyan (`#38BDF8`), Royal Indigo/Violet (`#818CF8`), Emerald Green (`#10B981`), Rose Red (`#F43F5E`), Amber Gold (`#F59E0B`)
  - Effects: Glass frosted cards (`backdrop-blur-xl bg-slate-900/60 border border-slate-700/50 shadow-2xl`), smooth micro-animations, glowing pill badges.
- **AI Engine:** Built-in intelligent context engine + Google Gemini API readiness.

---

## 📁 Standard Project Directory & Component Contract
All team members must adhere to this folder structure to avoid import and merge conflicts:

```text
edusphere/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx               # Shared top navigation header
│   │   ├── Sidebar.jsx              # Shared sidebar navigation
│   │   └── Chatbot/                 # 🤖 NAITIK'S DOMAIN
│   │       ├── EduBot.jsx           # Global floating AI assistant widget
│   │       └── botKnowledge.js      # Context rules, FAQs & smart responses
│   ├── context/                     # 👑 KRRISH'S DOMAIN
│   │   ├── AuthContext.jsx          # Auth state (Student, Teacher, HOD, Staff)
│   │   └── DataContext.jsx          # Shared state (Grievances, Attendance, Broadcasts)
│   ├── pages/
│   │   ├── Login.jsx                # 👑 KRRISH'S DOMAIN (Role switcher & 1-click test fill)
│   │   ├── student/                 # 👑 KRRISH'S DOMAIN
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── VirtualIDCard.jsx    # Dynamic rotating QR & student badge
│   │   │   ├── AttendanceClient.jsx # BLE Proximity radar + Passcode entry
│   │   │   ├── GrievanceDrawer.jsx  # Photo upload, Anonymous toggle, HOD/Staff routing
│   │   │   └── NotesFeed.jsx        # Subject notes & urgent broadcasts
│   │   ├── teacher/                 # ⚡ MANISH'S DOMAIN
│   │   │   ├── TeacherDashboard.jsx
│   │   │   ├── TakeAttendance.jsx   # Dynamic room code + Live Color Grid (Green/Red/Grey)
│   │   │   └── NotesPublisher.jsx   # Upload subject PDF/notes
│   │   ├── hod/                     # ⚡ MANISH'S DOMAIN
│   │   │   ├── HodDashboard.jsx
│   │   │   ├── SubstitutionEngine.jsx # Absent faculty auto-reassignment
│   │   │   ├── DigitalApprovals.jsx   # Digital signature & stamp workflow
│   │   │   └── Broadcasts.jsx         # Live department-wide alerts
│   │   └── staff/                   # ⚡ MANISH'S DOMAIN
│   │       ├── StaffDashboard.jsx
│   │       └── TicketInbox.jsx      # Domain filters (Medical, Cleaning, Anti-Bullying, etc.)
│   ├── App.jsx                      # Main Router & Global EduBot wrapper
│   └── index.css                    # Unified Tailwind & Glassmorphism styles
```

---

## 🔄 Git & GitHub Zero-Conflict Workflow

### Step 1: Krrish (Project Initialization)
```bash
npm create vite@latest edusphere -- --template react
cd edusphere
npm install lucide-react framer-motion canvas-confetti tailwindcss @tailwindcss/vite
git init
git add .
git commit -m "feat: initial EduSphere baseline foundation"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/edusphere.git
git push -u origin main
```

### Step 2: Manish & Naitik Clone & Create Branch
```bash
# Manish:
git clone https://github.com/<YOUR_GITHUB_USERNAME>/edusphere.git
cd edusphere
npm install
git checkout -b feature/faculty-hod-staff

# Naitik:
git clone https://github.com/<YOUR_GITHUB_USERNAME>/edusphere.git
cd edusphere
npm install
git checkout -b feature/ai-chatbot
```

### Step 3: Pushing & Merging
```bash
git add .
git commit -m "feat: implement assigned module"
git push origin <branch-name>
# Open PR on GitHub -> Krrish merges into main -> Everyone pulls latest main
```

---

## 🤖 Exact Prompts for Antigravity IDE

### 👑 1. Prompt for Krrish (Lead: Foundation, Auth & Student Portal)
```markdown
Role: Antigravity Lead Engineer for Hackathon Project "EduSphere"
Tech Stack: React, Tailwind CSS, Lucide Icons, Framer Motion, Canvas-Confetti

Objective: Build the Foundation, Authentication, Shared Contexts, and full Student Portal with ultra-premium glassmorphism UI (dark theme: #0F172A background, glowing cyan #38BDF8 and violet #818CF8 accents).

Tasks to complete:
1. Setup `src/context/AuthContext.jsx` and `src/context/DataContext.jsx`:
   - Store active user (roles: 'student', 'teacher', 'hod', 'staff').
   - Provide pre-filled mock data for fast hackathon demo: students list, live grievances, notices, class attendance status.
2. Build `src/pages/Login.jsx`:
   - Ultra-sleek login with "1-Click Quick Demo Login" buttons for all 4 roles (Student, Faculty, HOD, Ground Staff).
3. Build `src/pages/student/StudentDashboard.jsx` and subcomponents:
   - **Virtual ID Card (`VirtualIDCard.jsx`)**: Glowing cybernetic digital ID badge with student photo, barcode/rotating animated QR code, security watermark, and department details.
   - **DTU-Style Attendance Client (`AttendanceClient.jsx`)**: BLE Proximity radar simulation (scanning for campus beacon) + PIN entry modal for room passcodes (e.g., `EDUS-8492`) with instant success animation (confetti effect).
   - **Smart Grievance Drawer (`GrievanceDrawer.jsx`)**: Complaint submission with image upload preview, anonymous mode toggle, and smart routing destination selector (HOD for academics vs Ground Staff: Maintenance, Cleaning, Medical, Anti-Bullying).
   - **Faculty Directory & Notes Feed (`NotesFeed.jsx`)**: Searchable list of teachers with subjects, experience, downloadable PDFs/notes, and HOD urgent broadcast banner alerts.
4. Integrate routing in `App.jsx` and add shared `Navbar.jsx` with active role indicator.

Make every UI element responsive, interactive, and visually stunning with micro-animations.
```

---

### ⚡ 2. Prompt for Manish (Faculty, HOD, & Staff Portals)
```markdown
Role: Antigravity Pro Engineer for Hackathon Project "EduSphere"
Tech Stack: React, Tailwind CSS, Lucide Icons, Framer Motion

Objective: Build the Teacher / Faculty Portal, HOD Command Console, and Operations Ground Staff Portal with state-of-the-art glassmorphism design that integrates with `src/context/DataContext.jsx`.

Files to create in `src/pages/`:
1. **Faculty Portal (`src/pages/teacher/TeacherDashboard.jsx` & `TakeAttendance.jsx`)**:
   - **Take Attendance Studio**: Generate dynamic 4-digit room passcodes (`EDUS-8492`), toggle BLE beacon broadcasting, and live timer.
   - **Real-Time Student Roster Grid ("See Results")**: Color-coded student matrix:
     🟢 Green = Present (verified via BLE + code)
     🔴 Red = Absent
     ⚪ Grey = Approved Leave (teacher 1-click override toggle)
   - **Notes Publisher**: Upload lecture notes/PDFs with subject tag and target semester.

2. **HOD Console (`src/pages/hod/HodDashboard.jsx`)**:
   - **Command Metrics**: Department attendance analytics charts, active class count, grievance resolution rate.
   - **Teacher Substitution Engine (`SubstitutionEngine.jsx`)**: Visual schedule matrix showing absent faculty and 1-click automated reassignment to free teachers.
   - **Digital Approvals & Signatures (`DigitalApprovals.jsx`)**: Review student leave requests/event budget proposals with animated "Digital Stamp / Approved" signing effect.
   - **Urgent Broadcast Transmitter**: Send push alerts displayed instantly on student feeds.

3. **Ground Staff Portal (`src/pages/staff/StaffDashboard.jsx` & `TicketInbox.jsx`)**:
   - Domain selector pills: Technical Support, Admission Cell, Cleaning & Hygiene, Emergency Medical, Anti-Bullying Safeguard, Campus Maintenance.
   - Domain-specific digital badge with emergency hotline indicator.
   - Live grievance ticket inbox with priority tags (High/Urgent), attached photos preview, and "Mark Resolved / In Progress" action buttons.

Ensure all styles match the dark cyber-glassmorphism aesthetic (#0F172A base, rounded-2xl cards, glowing borders).
```

---

### 🤖 3. Prompt for Naitik (Global Roaming AI Campus Chatbot)
```markdown
Role: Antigravity AI Engineer for Hackathon Project "EduSphere"
Tech Stack: React, Tailwind CSS, Lucide Icons, Framer Motion

Objective: Create a floating, roaming, context-aware AI Campus Assistant component named **EduBot** (`src/components/Chatbot/EduBot.jsx`) that sits in the bottom-right corner of the whole app and can be opened anywhere.

Features to implement in `src/components/Chatbot/`:
1. **Floating Avatar Widget**:
   - Sleek glowing orb / mascot in the bottom right with subtle pulse animation.
   - Shows floating notification badges and quick action prompts.
2. **Context-Aware Campus Intelligence (`botKnowledge.js`)**:
   - Detects current user role (Student, Teacher, HOD, Staff) and current page route.
   - Quick Suggested Prompt Chips based on screen context (e.g., on Student Page: "How to mark BLE attendance?", "File anonymous grievance to HOD", "Download physics notes").
3. **Interactive Capabilities**:
   - Answers any question about EduSphere features, anti-proxy BLE attendance, grievance escalation rules, and campus schedules.
   - Supports 1-click Navigation Actions (e.g., clicking "Go to Attendance" switches the view).
   - Natural typing animation, markdown rendering, clear chat history, and voice input mockup.
4. **Fallback & API support**:
   - Works immediately with comprehensive built-in knowledge base and supports optional Gemini API key integration in settings.

Deliver `EduBot.jsx` and export it so `App.jsx` can render `<EduBot />` globally over all pages.
```

---

## ⏱ Execution Schedule (11:00 PM Tomorrow Deadline)
- **Phase 1 (Today 02:30 PM - 04:00 PM):** Git setup, branch initialization, context scaffolding (Krrish).
- **Phase 2 (Today 04:00 PM - 09:30 PM):** Parallel sprint on feature branches (Krrish, Manish, Naitik).
- **Phase 3 (Tonight 09:30 PM - 11:30 PM):** Merge PRs into `main`, test routing, end-to-end state synchronization.
- **Phase 4 (Tomorrow 10:00 AM - 04:00 PM):** Polish UI, micro-animations, mobile responsiveness.
- **Phase 5 (Tomorrow 04:00 PM - 08:00 PM):** Pitch rehearsal, live demo flow check, video recording.
- **Phase 6 (Tomorrow 08:00 PM - 11:00 PM):** Final deployment on Vercel & submission.
