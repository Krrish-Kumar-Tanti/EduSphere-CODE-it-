# 🏛️ EduSphere — Master Technical Reference Manual & Context Blueprint (v2.0)

## 📌 1. Project Overview & Architecture Vision
- **System Name:** EduSphere Smart Campus Operating System (v2.0)
- **Team Name:** CODE it
- **Target Deployment:** Production-grade full-stack web application designed for higher education campuses across Delhi NCR and India.
- **Architectural Philosophy:** Zero-dependency runtime resilience, instant multi-tab real-time communication via `BroadcastChannel`, and persistent local storage powered by SQLite3 with Write-Ahead Logging (`WAL` mode).

---

## 🛠️ 2. Technology Stack & Component Topology

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         EduSphere Client Layer                           │
│     React 19 • Tailwind CSS v4 • Lucide React • Framer Motion Physics    │
├────────────────────────────────┬─────────────────────────────────────────┤
│    Multi-Tab Live Sync Mesh    │           Procedural Audio Engine       │
│  BroadcastChannel ('edusphere')│       Web Audio API (Zero External MP3s)│
├────────────────────────────────┴─────────────────────────────────────────┤
│                         Node.js Express 5 REST API                       │
│    Auth • Attendance • Notes Stream • Grievances • Substitution • Chats  │
├──────────────────────────────────────────────────────────────────────────┤
│                  SQLite3 (better-sqlite3) Storage Layer                  │
│   WAL Mode • Atomic Transactions • Safe Auto-Migrations • Indexed Tables │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ 3. SQLite Database Schema & Migration Protocol (`server/db.js`)

All tables are created with `IF NOT EXISTS` and migrated using column reflection queries (`PRAGMA table_info`):

### 1. `users`
Stores user profile credentials, digital badges, institutional affiliations, and cryptographic signatures.
- `id` (TEXT PRIMARY KEY)
- `name` (TEXT)
- `email` (TEXT)
- `password` (TEXT)
- `role` (TEXT) — `'student' | 'teacher' | 'hod' | 'staff'`
- `enrollment` (TEXT)
- `college` (TEXT)
- `department` (TEXT)
- `semester` (TEXT)
- `section` (TEXT)
- `bloodGroup` (TEXT)
- `validUpto` (TEXT)
- `avatar` (TEXT)
- `designation` (TEXT)
- `subjects` (TEXT)
- `cabin` (TEXT)
- `assignedUnit` (TEXT)
- `supervisorLevel` (TEXT)
- `adminCode` (TEXT)
- `badgeId` (TEXT)
- `digitalSignature` (TEXT)

### 2. `substitutions`
Tracks real-time faculty leave requests, affected classrooms, and assigned substitutes.
- `id` (TEXT PRIMARY KEY, e.g. `'SUB-101'`)
- `date` (TEXT)
- `slot` (TEXT, e.g. `'03:00 PM - 04:00 PM'`)
- `subject` (TEXT)
- `semester` (TEXT)
- `room` (TEXT)
- `absentFaculty` (TEXT)
- `reason` (TEXT)
- `status` (TEXT DEFAULT `'Pending'`, `'Assigned'`, `'Completed'`)
- `assignedTo` (TEXT)
- `urgency` (TEXT DEFAULT `'Normal'`, `'Urgent'`)
- `suggestedFaculty` (TEXT JSON array)
- `notes` (TEXT)
- `assignedAt` (TEXT)

### 3. `grievances`
Double-triage incident reports and academic complaints with cryptographic privacy shields.
- `id` (TEXT PRIMARY KEY, e.g. `'GRV-1024'`)
- `userId` (TEXT)
- `studentName` (TEXT)
- `studentEnrollment` (TEXT)
- `isAnonymous` (INTEGER DEFAULT 0)
- `title` (TEXT)
- `category` (TEXT)
- `destination` (TEXT) — `'hod' | 'staff'`
- `priority` (TEXT) — `'Urgent' | 'High' | 'Medium' | 'Low'`
- `description` (TEXT)
- `imageUrl` (TEXT)
- `status` (TEXT) — `'In-Progress' | 'Under Review' | 'Resolved' | 'Dismissed'`
- `assignedTo` (TEXT)
- `resolutionNotes` (TEXT)
- `rsaSeal` (TEXT) — e.g. `'RSA-HOD-CSE-0x9F42A7C8E2'`
- `resolvedBy` (TEXT)
- `resolvedAt` (TEXT)

### 4. `direct_messages`
Strictly isolated 1-on-1 WhatsApp-style direct chat messages.
- `id` (TEXT PRIMARY KEY, e.g. `'MSG-884201'`)
- `threadId` (TEXT) — computed as `[senderId, recipientId].sort().join('_')`
- `senderId` (TEXT)
- `senderName` (TEXT)
- `senderRole` (TEXT)
- `senderAvatar` (TEXT)
- `recipientId` (TEXT)
- `recipientName` (TEXT)
- `recipientRole` (TEXT)
- `text` (TEXT)
- `isRead` (INTEGER DEFAULT 0)
- `fileUrl` (TEXT)
- `fileName` (TEXT)
- `timestamp` (DATETIME DEFAULT CURRENT_TIMESTAMP)

---

## 📡 4. Real-Time Multi-Tab Synchronization Protocol (`DataContext.jsx`)

The frontend uses the HTML5 `BroadcastChannel` API across channels `'edusphere_channel'` and `'edusphere_live_sync'`.

| Event Type | Payload Attributes | Recipient Behavior |
|---|---|---|
| `DIRECT_MESSAGE_SENT` | `id, threadId, senderId, recipientId, text` | Drops payload if recipient does not match active tab `currentUid`. Triggers double-chime audio and toast on recipient tab. |
| `SUBSTITUTION_ASSIGNED` | `subId, facultyName, notes, assignedAt` | Plays fanfare chime, updates substitution state, and highlights substitute in teacher's schedule. |
| `GRIEVANCE_STATUS_UPDATED` | `id, status, resolutionNotes, rsaSeal, resolvedBy` | Instantly updates student's grievance drawer with the green RSA cryptographic seal. |
| `ATTENDANCE_VERIFIED` | `studentEnrollment, studentName, verifiedAt` | Appends verified scholar to the teacher's live classroom roster with BLE RSSI telemetry. |
| `TIMETABLE_PUBLISHED` | `university, department, semester, section, schedule` | Refreshes weekly class schedule across all student and faculty dashboards. |

---

## 🔐 5. 1-to-1 WhatsApp Direct Message Scoping Logic

To ensure peer-to-peer confidentiality between scholars and faculty:
```javascript
// 1. Thread Identity
const threadId = [currentUser.id || currentUser.enrollment, targetPartner.id || targetPartner.enrollment].sort().join('_');

// 2. BroadcastChannel Filter in DataContext.jsx
const myIds = [myUser?.id, myUser?.enrollment, myUser?.email].filter(Boolean);
const isForMe = myIds.includes(payload.recipientId);
const isFromMe = myIds.includes(payload.senderId);

if (!isForMe && !isFromMe) {
  return; // ⛔ DROP immediately to prevent cross-role data leaks
}
```

---

## 🤖 6. EduBot Multilingual Knowledge Engine Architecture (`botKnowledge.js`)

EduBot employs a phrase-weighted string similarity matcher across 9 distinct domains in both **Hinglish and English**:
1. 📍 **BLE Attendance Radar & 75% Criteria**
2. 💳 **3D Holographic Virtual ID Pass & Security QR**
3. ⚖️ **Anonymous Grievance Filing & Anti-Retaliation Shield**
4. 🛠️ **Ground Staff Repairs & Work Order Dispatch**
5. 📚 **Course Notes & Universal Syllabus Vault**
6. 🏛️ **HOD Faculty Substitution & Master Timetable Publishing**
7. 💬 **Ultra-Private 1-on-1 WhatsApp Chat**
8. 📅 **Weekly Class Schedules & Room Allocations**
9. 👋 **Conversational Greetings & Feature Shortcuts**

---

## 🚀 7. Zero-Downtime Deployment Configuration
- **Containerization:** Production multi-stage [`Dockerfile`](file:///home/manish/Desktop/PROJECT%20CODEIT/EduSphere-CODE-it-/Dockerfile) serving Express backend and compiled Vite static assets on port 5001.
- **Cloud Infrastructure:** [`render.yaml`](file:///home/manish/Desktop/PROJECT%20CODEIT/EduSphere-CODE-it-/render.yaml) blueprint with persistent SQLite disk mount at `/data`.
