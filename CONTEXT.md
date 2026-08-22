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
2. **Manish (Antigravity Pro) — [✅ COMPLETED & INTEGRATED]:**
   - **Faculty / Teacher Portal (`src/pages/teacher/`)**:
     - `TeacherDashboard.jsx` (Master faculty hub with metrics, today's schedule, and tab switcher)
     - `TakeAttendance.jsx` (Dynamic room code generator `EDUS-XXXX`, BLE beacon transmitter control, session countdown timer, and live color-coded student roster grid `Green=Present/Red=Absent/Grey=Leave` with 1-click manual override)
     - `NotesPublisher.jsx` (Course material & PDF publisher syncing live with student Notes Feed)
   - **HOD Command Console (`src/pages/hod/`)**:
     - `HodDashboard.jsx` (Department pulse metrics, live classroom telemetry, and academic grievance triage)
     - `SubstitutionEngine.jsx` (Visual schedule matrix of absent faculty, free teacher availability pool, and 1-click automated smart reassignment algorithm)
     - `DigitalApprovals.jsx` (Cryptographic RSA-2048 digital signature & seal engine for event budgets, OD leaves, and lab equipment grants)
     - `Broadcasts.jsx` (Urgent push alert transmitter syncing immediately with student marquee banners & notifications)
   - **Ground Staff Portal (`src/pages/staff/`)**:
     - `StaffDashboard.jsx` (Operations hub, 24x7 emergency hotline trigger `Ext: 108/112`, field worker squad tracking, and turnaround KPIs)
     - `TicketInbox.jsx` (6 domain selectors: Maintenance, Cleaning, Medical, Anti-Bullying, Tech Support, Admission + live incident queue, photographic evidence review, technician assignment, and resolution remarks)
3. **Naitik (Antigravity):**
   - Global Roaming Context-Aware AI Campus Assistant (**EduBot**).
   - Floating interactive widget across all pages with page/role context awareness, suggested chips, feature guidance, and navigation shortcuts.

---

## 🛠 Target Tech Stack & Design Aesthetics
- **Frontend Framework:** React (Vite) + Tailwind CSS + Framer Motion + Lucide React + Canvas-Confetti
- **Design System:** Ultra-modern Clean Light-Theme Glassmorphism (Pixel-perfect match to high-fidelity reference mockups)
  - Background: Clean Slate canvas (`#F8FAFC`, `bg-slate-50 text-slate-900`)
  - Containers & Cards: Pure white frosted cards (`bg-white border-slate-200 shadow-sm rounded-3xl p-6`)
  - Accent Colors & Role Badges:
    - Student: Royal Indigo (`bg-indigo-50 text-indigo-700 border-indigo-200`)
    - Faculty / Teacher: Emerald Green (`bg-emerald-50 text-emerald-700 border-emerald-200`)
    - HOD Console: Deep Purple (`bg-purple-50 text-purple-700 border-purple-200`)
    - Ground Operations & Staff: Warm Amber (`bg-amber-50 text-amber-700 border-amber-200`)
    - Emergency / SOS / Warnings: Crimson Rose (`bg-rose-50 text-rose-700 border-rose-200`)
  - Micro-interactions: BLE pulse rings, dynamic QR rotation countdown, 1-click auto-fills, and instant status toasts.
- **AI Engine:** Built-in intelligent context engine + Google Gemini API readiness.

---

## 📁 Standard Project Directory & Component Contract
All team members must adhere to this folder structure to avoid import and merge conflicts:

```text
edusphere/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx               # Shared top navigation header (Light glass bar with role capsule)
│   │   └── Chatbot/                 # 🤖 NAITIK'S DOMAIN
│   │       ├── EduBot.jsx           # Global floating AI assistant widget (Light glassmorphism card)
│   │       └── botKnowledge.js      # Context rules, FAQs & smart responses
│   ├── context/                     # 👑 KRRISH'S DOMAIN & SHARED STATE
│   │   ├── AuthContext.jsx          # Auth state (Student, Teacher, HOD, Staff)
│   │   └── DataContext.jsx          # Shared state (Grievances, Attendance, Broadcasts, Substitutions, Approvals, Roster)
│   ├── pages/
│   │   ├── Login.jsx                # 👑 Multi-Role Sign In with 1-click persona quick entry
│   │   ├── student/                 # 👑 KRRISH'S DOMAIN [UPDATED & SYNCED]
│   │   │   ├── StudentDashboard.jsx # Student portal with metrics & 4 feature tabs
│   │   │   ├── VirtualIDCard.jsx    # Dynamic anti-proxy rotating QR & scholar badge
│   │   │   ├── AttendanceClient.jsx # Dual-factor BLE proximity radar + PIN entry
│   │   │   ├── GrievanceDrawer.jsx  # Photo upload, Anonymous shield, HOD/Staff double-triage
│   │   │   └── NotesFeed.jsx        # Subject notes PDF vault & faculty directory
│   │   ├── teacher/                 # ⚡ MANISH'S DOMAIN [100% COMPLETE & VERIFIED]
│   │   │   ├── TeacherDashboard.jsx # Master teacher dashboard with schedule & stats
│   │   │   ├── TakeAttendance.jsx   # Dynamic room code EDUS-XXXX + BLE beacon + Live Color Grid (Present/Absent/Leave)
│   │   │   └── NotesPublisher.jsx   # Upload subject PDF/notes directly to student feed
│   │   ├── hod/                     # ⚡ MANISH'S DOMAIN [100% COMPLETE & VERIFIED]
│   │   │   ├── HodDashboard.jsx     # Command metrics & department analytics
│   │   │   ├── SubstitutionEngine.jsx # Absent faculty auto-reassignment algorithm
│   │   │   ├── DigitalApprovals.jsx   # Cryptographic RSA digital stamp workflow
│   │   │   └── Broadcasts.jsx         # Live department-wide urgent push alerts
│   │   └── staff/                   # ⚡ MANISH'S DOMAIN [100% COMPLETE & VERIFIED]
│   │       ├── StaffDashboard.jsx   # Emergency hotline & ground operations squad
│   │       └── TicketInbox.jsx      # 6 domain filters + photo evidence & technician dispatch
│   ├── App.jsx                      # Main Router & Global EduBot wrapper
│   └── index.css                    # Clean Light-theme Tailwind styles & glassmorphism
```

---

## ⏱ Execution Status
- **Teacher / Faculty Portal:** 100% Complete & Styled
- **HOD Command Console:** 100% Complete & Styled
- **Staff Operations Hub:** 100% Complete & Styled
- **Student Portal:** 100% Complete & Styled
- **Login & Auth System:** 100% Complete & Styled
- **Global AI Assistant (EduBot):** 100% Complete & Styled


