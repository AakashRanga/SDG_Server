# SDG Server - Project Documentation

This repository contains the full stack platform for the SDG Portal, consisting of:
1. **`web_site3.0`**: Main portal web application (Vite + React frontend & Node.js backend).
2. **`visitsite`**: Visitor & public-facing web application (Vite + React frontend).
3. **`server/`**: Express.js REST API servers (`update_server.js`) powering the SDG database operations.

---

## ⚙️ Central Environment Configuration

All environment credentials are centralized in **one single `.env` file** at the root of the repository:

- **Path**: `d:\projects\sdg_server\.env`

```env
# Database Configuration (Centralized MySQL)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=12345
DB_NAME=sustain_db
DB_PORT=3308

# Backend Server Port (node update_server.js)
SERVER_PORT=8006

# Frontend Dev Server Ports
VISITSITE_PORT=8081
WEBSITE_PORT=8080
```

Both `visitsite` and `web_site3.0` (as well as `server/db.js`) read directly from this single `.env` file. Do not create `.env` files in subdirectories.

---

## 📁 Uploads Folders Directory & Maintenance Guide

All upload directories are excluded from Git version control (via `.gitignore`) to prevent committing large binary assets, images, and user documents into the repository. 

When deploying, migrating, or setting up a fresh environment, ensure the following upload folders exist and are preserved/backed up:

### 1. `web_site3.0/uploads/`
- **Relative Path**: `web_site3.0/uploads/`
- **Absolute Path**: `d:\projects\sdg_server\web_site3.0\uploads\`
- **Purpose**: Client-accessible uploaded assets, public media, student research files, and ranking documents.
- **Subdirectories to maintain/update**:
  - `web_site3.0/uploads/ranking-data/` — Ranking submissions and institutional reports.
  - `web_site3.0/uploads/certificates/` — Uploaded sustainability and achievement certificates.
  - `web_site3.0/uploads/annual_reports/` — PDF and report documents.
  - `web_site3.0/uploads/impact_reports/` — Impact report media and PDFs.

---

### 2. `web_site3.0/server/uploads/`
- **Relative Path**: `web_site3.0/server/uploads/`
- **Absolute Path**: `d:\projects\sdg_server\web_site3.0\server\uploads\`
- **Purpose**: Backend server multer upload destination for API endpoints managed by `update_server.js`.
- **Subdirectories to maintain/update**:
  - General file uploads (images, PDFs, documents uploaded via admin forms).
  - Member profile photos and committee uploads.

---

### 3. `visitsite/uploads/`
- **Relative Path**: `visitsite/uploads/`
- **Absolute Path**: `d:\projects\sdg_server\visitsite\uploads\`
- **Purpose**: Static media files, downloaded reports, and public portal assets for the visitor site.
- **Subdirectories to maintain/update**:
  - `visitsite/uploads/ranking-data/` — Ranking data and public downloads.

---

### 4. `visitsite/server/uploads/`
- **Relative Path**: `visitsite/server/uploads/`
- **Absolute Path**: `d:\projects\sdg_server\visitsite\server\uploads\`
- **Purpose**: Backend multer uploads and storage when running the visitor portal API server.

---

### 📌 Uploads Maintenance Summary Table

| Folder Path | Primary Usage | Needs Periodic Backup / Sync |
|---|---|:---:|
| `web_site3.0/uploads/` | Public media, research docs, ranking data | **Yes** |
| `web_site3.0/server/uploads/` | Server multer uploads, admin file inputs | **Yes** |
| `visitsite/uploads/` | Visitor site static downloads & documents | **Yes** |
| `visitsite/server/uploads/` | Visitor server multer uploads | **Yes** |

> **Note for Deployment**:
> If deploying on a new server, run the following command to ensure all required upload directories exist:
> ```powershell
> New-Item -ItemType Directory -Force -Path "web_site3.0/uploads/ranking-data", "web_site3.0/uploads/certificates", "web_site3.0/uploads/annual_reports", "web_site3.0/uploads/impact_reports", "web_site3.0/server/uploads", "visitsite/uploads/ranking-data", "visitsite/server/uploads"
> ```

---

## 🚀 Running the Project

### 1. Start Backend API Server
```powershell
cd d:\projects\sdg_server\web_site3.0\server
node update_server.js
```
*Listens on `http://localhost:8006` (or `SERVER_PORT` in `.env`).*

### 2. Start Main Portal (web_site3.0)
```powershell
cd d:\projects\sdg_server\web_site3.0
npm run dev
```
*Listens on `http://localhost:8080` (or `WEBSITE_PORT` in `.env`).*

### 3. Start Visitor Site (visitsite)
```powershell
cd d:\projects\sdg_server\visitsite
npm run dev
```
*Listens on `http://localhost:8081` (or `VISITSITE_PORT` in `.env`).*
