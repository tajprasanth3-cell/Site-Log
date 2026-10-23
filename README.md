# SiteLog – Construction Site Operations & Daily Reporting Platform

> **Full-Stack Development Intern Assignment | Adz4needz**  
> *"Create a reliable digital record of what happened at every construction site, every day."*

---

## 🏗️ Overview

**SiteLog** is a centralized construction site operations platform designed for construction enterprises managing multiple projects, work sites, and field teams.

Field engineers and managers frequently face disorganized communication across messaging apps, paper notebooks, and fragmented spreadsheets. SiteLog replaces this with a single, high-performance, responsive platform that captures daily progress, workforce muster rolls, equipment utilization, material requisitions, hazards, and progress photographs.

---

## 🎨 UI & Screens Implemented (Faithful to Mockups)

1. **Login & Role Authentication**: Clean hero split-screen with instant 1-click demo logins for Site Engineer, Project Manager, and Admin.
2. **Operations Dashboard**: Live stats cards, SVG Donut chart displaying overall project progress (68%), recent daily site reports, open critical issues, and priority site quick cards.
3. **Project Management**: Multi-project tracking (Commercial, Residential, Industrial, Institutional, Infrastructure), status filters, completion progress bars, and `+ New Project` creation modal.
4. **Construction Site Management**: Sites and work areas, GPS coordinates, current construction phase, assigned engineers, and notes.
5. **Daily Site Report (Core Module)**:
   - **Section 1: Basic Information**: Project, site, date, shift hours, and weather/working conditions.
   - **Section 2: Worker Attendance**: Real-time roll summary (Total, Present, Absent, Half-Day, Leave).
   - **Section 3: Work Progress**: Dynamic multi-row task tracker with category, planned vs completed quantities, auto-calculated progress percentages, and `+ Add Row`.
   - **Section 4: Observations & Remarks**: Site observations, blockers/delays, safety notes, and planned next-day targets.
   - **Section 5: Shift Photographs**: Embedded visual progress records.
   - **Workflow**: Draft preservation, instant report preview modal, and submission for Manager sign-off.
6. **Manager Review Workflow**:
   - Status progression: `Draft` &rarr; `Submitted` &rarr; `Manager Review` &rarr; `Approved` or `Revision Required`.
   - Complete review audit history with timestamped feedback comments.
7. **Workers & Attendance**: Workforce muster roll by trade (Mason, Electrician, Carpenter, Welder, Helper, etc.) with clickable attendance badges to quickly toggle Present / Absent / Half Day / Leave.
8. **Material Management & Requisition Workflow**: Real-time stock levels (Opening, Received, Used, Balance), combined with requisition approval pipeline (`Pending Review` &rarr; `Approved` &rarr; `In Delivery` &rarr; `Received`).
9. **Equipment Management**: Fleet register (Cranes, Excavators, Concrete Mixers, Generators), maintenance status certificates, and daily operational hours logging.
10. **Issues & Safety Observations**:
    - **Issues**: Problem reporting categorized by equipment failure, material shortage, weather, etc., with severity ratings (Critical, High, Medium, Low) and resolution workflows.
    - **Safety**: Inspection hazards, risk levels, corrective actions, and closure audit trails.
11. **Site Photographs Gallery**: Categorized photo cards (Work Progress, Safety, Materials, Completed Work) with image zoom modal, photo capture time tracking (`Taken:` timestamp), and upload time tracking (`Uploaded:` timestamp).
12. **Reports & Export Center**: Instant client-ready **CSV and PDF Document generation** across 7 modules (Daily Reports, Project Progress, Worker Attendance, Material Inventory, Equipment Usage, Site Issues, Safety Observations) featuring light-accented styling and direct browser downloads.
13. **User Profile**: Clean, horizontally centered profile view with personal account credentials, role details, contact information, and assigned work sites.
14. **In-App Notifications**: Real-time alerts for report submissions, safety warnings, and material requisition approvals.
15. **Mobile & Tablet Responsive System**: Off-canvas sliding sidebar drawer, adaptive top header with collapsing brand text and flexible search, touch momentum scrolling, and responsive form grids across all breakpoints (<360px, <480px, <640px, <768px, <1024px).

---

## 👥 Role-Based Access Control (RBAC)

SiteLog includes a top-bar **Role Selector** and a dynamically tailored sidebar for each user perspective:

| Feature / Permission | Site Engineer 👷‍♂️ | Project Manager 📋 | Admin ⚙️ |
| :--- | :---: | :---: | :---: |
| **Dashboard & Live Metrics** | Assigned Sites | All Projects | Organization Wide |
| **Create Daily Site Reports** | ✅ | ✅ | ✅ |
| **Approve / Request Report Revisions** | ❌ | ✅ | ✅ |
| **Record Daily Worker Attendance** | ✅ | ✅ | ✅ |
| **Request Material Requisitions** | ✅ | ✅ | ✅ |
| **Approve Material Requests** | ❌ | ✅ | ✅ |
| **Log Daily Equipment Hours** | ✅ | ✅ | ✅ |
| **Report Issues & Safety Observations**| ✅ | ✅ | ✅ |
| **Upload Site Photos with Date/Time** | ✅ | ✅ | ✅ |
| **Export CSV & PDF Reports** | ✅ | ✅ | ✅ |
| **Manage Users & Role Assignment** | ❌ | ❌ | ✅ |
| **Configure Master Taxonomies** | ❌ | ❌ | ✅ |

---

## 💻 Tech Stack

- **Core Framework**: React 19 + TypeScript + Vite
- **Styling**: Vanilla CSS Design System with CSS tokens, micro-interactions, responsive flex/grid layouts, responsive media queries, and Google Fonts (*Plus Jakarta Sans*)
- **Icons**: Lucide Icons
- **State & Storage**: React Context API with automatic `localStorage` persistence across page reloads
- **Export Engine**:
  - **CSV**: Pure client-side UTF-8 CSV generation (compatible with Excel & Google Sheets)
  - **PDF**: Client-side styled document generation using `jspdf` and `jspdf-autotable`
- **Responsive Architecture**: Multi-tier CSS media queries covering ultra-compact mobile (<360px), small mobile (<480px), standard mobile (<640px), tablet portrait (<768px), and tablet landscape (<1024px)


---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🔑 Demo Logins

When accessing the login screen, you can click on any of the **1-Click Demo Accounts**:
- **Site Engineer**: `rahul@sitelog.com` (Rahul Sharma)
- **Project Manager**: `priya@sitelog.com` (Priya Nair)
- **Admin**: `admin@sitelog.com` (Arjun Mehta)
