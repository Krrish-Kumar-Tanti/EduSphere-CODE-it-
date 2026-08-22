# EduSphere — Project Master Context & Hackathon Execution Blueprint

## 📌 Project & Team Overview
- **Project Name:** EduSphere (Smart Campus Operating System)
- **Team Name:** CODE it
- **Hackathon:** Prasunethon 2.0 (Prototype & Working MVP Round)
- **Core Concept:** Unified, paperless multi-role campus management web application connecting Students, Faculty, HODs, and Ground Staff with Anti-Proxy BLE Attendance, Double-Escalation Grievance Triage, SQLite database persistence, and Global Context-Aware AI Assistant.

---

### 👥 Team Division & Roles
1. **Krrish (Lead / Main Repository Maintainer):**
   - Repository setup, core routing, full SQLite database & REST API architecture (`server/db.js`, `server/index.js`).
   - Clean Light-Theme Glassmorphism design system (`#F8FAFC`, `.glass-panel`, `.glass-panel-elevated`).
   - Universal 4-Role Authentication & GGSIPU Searchable Student Registration with real photo uploads.
   - Searchable Dropdown Engine (`SearchableSelect.jsx`) with viewport collision detection and scroll management.
   - Complete Student Portal Suite (3D Flippable Virtual Student ID Pass with 30s rotating encrypted QR code, BLE Proximity Attendance Client, Double-Triage Grievance Drawer, Notes & Faculty Vault).
   - Git branch management, conflict resolution, and master codebase merging.
2. **Manish (Antigravity Pro) — [✅ COMPLETED & INTEGRATED INTO MAIN]:**
   - **Faculty / Teacher Portal (`src/pages/teacher/`)**:
     - `TeacherDashboard.jsx`: Master faculty hub with metrics, today's schedule, and tab switcher.
     - `TakeAttendance.jsx`: Dynamic room code generator `EDUS-XXXX`, BLE beacon transmitter control, session countdown timer, and live color-coded student roster grid (`Green=Present / Red=Absent / Grey=Leave`).
     - `NotesPublisher.jsx`: Course material & PDF publisher syncing with student Notes Feed.
   - **HOD Command Console (`src/pages/hod/`)**:
     - `HodDashboard.jsx`: Department pulse metrics, live classroom telemetry, and academic grievance triage.
     - `SubstitutionEngine.jsx`: Visual schedule matrix of absent faculty, free teacher availability pool, and 1-click automated smart reassignment algorithm.
     - `DigitalApprovals.jsx`: Cryptographic digital signature & seal engine for event budgets, OD leaves, and lab grants.
     - `Broadcasts.jsx`: Urgent push alert transmitter syncing immediately with student marquee banners & notifications.
   - **Ground Staff Portal (`src/pages/staff/`)**:
     - `StaffDashboard.jsx`: Operations hub, 24x7 emergency hotline trigger (`Ext: 108/112`), field worker squad tracking, and turnaround KPIs.
     - `TicketInbox.jsx`: 6 domain selectors (Maintenance, Cleaning, Medical, Anti-Bullying, Tech Support, Admission) + live incident queue, photo evidence review, technician assignment, and resolution remarks.
3. **Naitik (Antigravity) — [✅ COMPLETED & INTEGRATED INTO MAIN]:**
   - Global Roaming Context-Aware AI Campus Assistant (**EduBot**).
   - Floating interactive widget across all pages (`src/components/Chatbot/EduBot.jsx`, `botKnowledge.js`) with suggested chips, campus FAQs, feature guidance, and navigation shortcuts.

---

## 🛠️ Full-Stack Technology Stack & Architecture

### Frontend:
- **Framework:** React 19 + Vite 8 (Ultra-fast ~100ms builds)
- **Styling:** Tailwind CSS v4 + Custom Frosted White Glassmorphism Design System
- **Icons & Visuals:** Lucide React + Canvas-Confetti
- **QR Code Engine:** `qrcode.react` (High-definition SVG cryptographic scannable QR tokens)
- **Design Palette:**
  - Background Canvas: Clean Slate (`#F8FAFC`, `bg-slate-50 text-slate-800`)
  - Elevated Cards: White Frosted Glass (`bg-white/95 border-slate-200 shadow-xl rounded-3xl p-6 backdrop-blur-xl`)
  - Student Theme: Royal Indigo (`bg-indigo-50 text-indigo-700 border-indigo-200`)
  - Faculty Theme: Emerald Green (`bg-emerald-50 text-emerald-700 border-emerald-200`)
  - HOD Console Theme: Deep Purple (`bg-purple-50 text-purple-700 border-purple-200`)
  - Ground Operations Theme: Warm Amber (`bg-amber-50 text-amber-700 border-amber-200`)
  - Urgent / SOS Theme: Crimson Rose (`bg-rose-50 text-rose-700 border-rose-200`)

### Backend & Database (Real SQLite3 Persistence):
- **Server:** Node.js + Express 5 (Runs concurrently on `http://localhost:5001/api`)
- **Database Engine:** `better-sqlite3` with Write-Ahead Logging (`WAL` mode) for zero-latency concurrent transactions (`server/edusphere.db`)
- **File & Media Storage:** Multer middleware storing real user avatars and grievance evidence photos on disk under `uploads/`
- **Database Schema Tables:**
  - `users`: Full profile data (Name, Email, Role, Enrollment, College, Department, Semester, Section, Blood Group, Valid Upto, Avatar URL, Password, CGPA, Attendance %).
  - `attendance_sessions`: Active lecturer room sessions, dynamic PIN codes, room IDs, and beacon telemetry.
  - `attendance_logs` & `attendance_records`: Student presence verification logs with timestamps and method (`BLE Proximity`, `Dynamic PIN`).
  - `grievances`: Double-triage complaint tickets, destination routing (`hod` vs `staff`), anonymous flags, and photo URLs.
  - `notes`: Published lecture notes, PDF metadata, faculty names, semesters, and download URLs.
  - `broadcasts`: High-priority campus flash announcements, target audience, and urgency status.
  - `colleges`: GGSIPU and affiliated university colleges dataset with codes, locations, programs, and NAAC grades.

---

## 📁 Repository Directory & Component Structure

```text
edusphere/
├── server/                          # ⚡ BACKEND REST API & SQLITE ENGINE
│   ├── db.js                        # SQLite schema initialization, WAL config & seed data
│   ├── index.js                     # Express API (Auth, Uploads, Attendance, Grievances, Notes, Broadcasts)
│   └── edusphere.db                 # SQLite database file (gitignored)
├── uploads/                         # 📸 Real uploaded avatars & evidence photos
│   └── .gitkeep
├── src/
│   ├── components/
│   │   ├── Navbar.jsx               # Top navigation header with live role capsule & notification feed
│   │   ├── SearchableSelect.jsx     # Viewport-aware combobox with text search & upward flipping
│   │   └── Chatbot/                 # 🤖 NAITIK'S DOMAIN
│   │       ├── EduBot.jsx           # Global floating AI assistant widget
│   │       └── botKnowledge.js      # Context rules, FAQs & intelligent response matcher
│   ├── context/                     # 👑 KRRISH'S DOMAIN & SHARED STATE
│   │   ├── AuthContext.jsx          # SQLite-synced Auth, photo upload & profile persistence
│   │   └── DataContext.jsx          # Shared state & multi-tab synchronization
│   ├── data/
│   │   └── ggsipuData.js            # Comprehensive dataset of affiliated colleges, branches, blood groups
│   ├── pages/
│   │   ├── Login.jsx                # 👑 Universal 4-role login & searchable student registration
│   │   ├── student/                 # 👑 KRRISH'S DOMAIN
│   │   │   ├── StudentDashboard.jsx # Student portal with metrics & 4 feature tabs
│   │   │   ├── VirtualIDCard.jsx    # 3D Flip Smart ID Pass with 30s rotating QR & photo editor
│   │   │   ├── AttendanceClient.jsx # Dual-factor BLE proximity radar + dynamic room PIN entry
│   │   │   ├── GrievanceDrawer.jsx  # Photo upload, Anonymous shield & HOD/Staff double triage
│   │   │   └── NotesFeed.jsx        # Subject notes PDF vault & faculty directory
│   │   ├── teacher/                 # ⚡ MANISH'S DOMAIN [MERGED]
│   │   │   ├── TeacherDashboard.jsx # Master faculty dashboard with schedule & stats
│   │   │   ├── TakeAttendance.jsx   # Dynamic room PIN generator + BLE beacon + Live Color Roster
│   │   │   └── NotesPublisher.jsx   # Upload subject PDF/notes directly to student feed
│   │   ├── hod/                     # ⚡ MANISH'S DOMAIN [MERGED]
│   │   │   ├── HodDashboard.jsx     # Command metrics & department analytics
│   │   │   ├── SubstitutionEngine.jsx # Absent faculty auto-reassignment algorithm
│   │   │   ├── DigitalApprovals.jsx   # Cryptographic RSA digital stamp workflow
│   │   │   └── Broadcasts.jsx         # Live department-wide urgent push alerts
│   │   └── staff/                   # ⚡ MANISH'S DOMAIN [MERGED]
│   │       ├── StaffDashboard.jsx   # Emergency hotline & ground operations squad
│   │       └── TicketInbox.jsx      # 6 domain filters + photo evidence & technician dispatch
│   ├── App.jsx                      # Universal 4-Role Router & Global EduBot wrapper
│   └── index.css                    # Clean Light-theme Tailwind styles & frosted glassmorphism
├── package.json                     # Concurrently script ("npm run dev" starts Server + Client)
└── CONTEXT.md                       # Master blueprint & architectural documentation
```

---

## 🚀 Key Accomplishments & Deliverables Completed Today

1. **SQLite Database & REST Backend Built**:
   - Created `server/db.js` and `server/index.js` supporting multi-user data storage and Multer image file hosting at `http://localhost:5001/uploads/`.
   - Connected `AuthContext.jsx` so profile edits and uploaded photos persist across role switches and browser reloads.

2. **GGSIPU Affiliated College Search & Viewport Combobox**:
   - Created `src/data/ggsipuData.js` covering all major colleges (ADGITM, USICT, MAIT, MSIT, BPIT, BVCOE, GTBIT, USAR, VIPS, JIMS, etc.).
   - Built `SearchableSelect.jsx` with instant text filtering and **auto-upward flipping** (`spaceBelow < 260px`) to prevent off-screen dropdown overflow.

3. **Universal 4-Role Login & Independent Registration**:
   - Built [`Login.jsx`](file:///Users/harshtanti/Krrish/prasunethon/src/pages/Login.jsx) supporting dedicated login tabs for Student, Faculty, HOD, and Staff.
   - Built a registration workflow allowing new students to enter their details, search their college, upload a real photo, and save to SQLite.

4. **World-Class 3D Flippable Virtual Student ID Pass**:
   - Built [`VirtualIDCard.jsx`](file:///Users/harshtanti/Krrish/prasunethon/src/pages/student/VirtualIDCard.jsx) featuring:
     - **Front View**: Verified student photo with in-place upload, college header, and **dynamic 30-second rotating encrypted QR code token (`qrcode.react`)**.
     - **Back View**: Emergency parent/medical contacts, Delhi Metro/DTC transit pass token, and Controller of Examinations digital signature & seal.
     - **Fullscreen Gate Scanner QR Mode**: Instant extra-large display for turnstile scanners.
     - **Printable Vector & Apple/Google Wallet Pass Export**.

5. **Teammate Codebase Merge & Git Synchronization**:
   - Integrated `origin/project1.1` (Manish's Faculty Studio, HOD Console, Ground Staff Portal, and Naitik's EduBot AI) into `main` with merge commit `911e0d1`.
   - Verified 0 build errors (`npm run build` bundles in ~100ms).
   - Successfully pushed unified codebase to GitHub remote `origin/main`.

---

## 🎯 Next Phase: 12-Point Reactive Upgrade Specification
1. **Real-time Notes Sync**: Teacher PDF uploads immediately reflect in the Student Notes vault.
2. **Dynamic Faculty Directory**: Registered professors dynamically appear in the Student Faculty directory.
3. **WhatsApp-Style Direct Chat**: 1-on-1 messaging connecting Students with Teachers, HODs, and Staff with floating incoming query toasts.
4. **Academic Coverage Expansion**: Notes publisher expanded to all 8 Semesters across all engineering disciplines.
5. **Universal 4-Role Digital Badges**: Dedicated digital ID cards for Faculty, HODs, and Ground Staff.
6. **Ticket Archival & State Filters**: Ground staff ticket resolution tabs (`Active` vs `Resolved/Archived`).
7. **Multi-Branch HOD Broadcasts**: Branch selector for department targeting (CSE, IT, AIML, ECE, ME, Civil, All).
8. **Resolution Feedback & Audit Stamps**: Confetti micro-interactions and digital HOD seals upon ticket approval.
9. **Record Deletion / Purge Tooling**: Permanent deletion for resolved tickets, old notes, and past logs.
10. **Global Emergency Alert Marquee**: Pulsing emergency banner displayed across all 4 role portals.
11. **Cross-Tab BroadcastChannel Sync**: Sub-50ms zero-reload synchronization across open browser tabs.
12. **Dropdown Viewport Collision Protection**: Enhanced scroll bounds and upward dropdown positioning.
