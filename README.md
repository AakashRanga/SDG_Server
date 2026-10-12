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

---

## 🔐 Admin Authentication & Session Management

All admin portal routes on `http://localhost:8080/` require authentication via `<ProtectedRoute>`. Unauthenticated requests redirect to `http://localhost:8080/login`.

* **Detailed API Reference**: See [AUTH_API_README.md](file:///d:/projects/sdg_server/AUTH_API_README.md)
* **Default Admin Credentials**:
  * **Username**: `admin`
  * **Password**: `admin123`
* **Session Lifespan**: 7 days per token with verification via `GET /api/auth/verify`.

---

## 📮 Complete Postman API Testing Guide

### ⚙️ Postman Setup & Environment
* **Base URL**: `http://localhost:8006`
* **Default Admin Credentials**:
  * Username / Email: `admin` *(or `admin@sdg.org`)*
  * Password: `admin123`

> [!TIP]
> **Automatic Token Handling in Postman:**
> In the **Login** request, go to the **Tests** tab and add this script:
> ```javascript
> if (pm.response.code === 200) {
>     const data = pm.response.json();
>     pm.environment.set("token", data.token);
>     console.log("Session token saved:", data.token);
> }
> ```
> For subsequent requests, under the **Authorization** tab choose **Bearer Token** and set the token to `{{token}}`.

---

### 1. Admin Login (Generate Session Token)
Authenticate the admin user and receive a 7-day bearer session token.

* **Method**: `POST`
* **URL**: `http://localhost:8006/api/auth/login`
* **Headers**:
  * `Content-Type`: `application/json`
* **Body** (`raw` -> `JSON`):
```json
{
  "username": "admin",
  "password": "admin123"
}
```
* **Expected Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "d0d316c310cac8999bb7e12733f4d4bd52e4b0c3e8363be6ecc973db1c0b5b09",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@sdg.org",
    "full_name": "System Administrator",
    "role": "admin",
    "last_login": "2026-10-12T09:16:00.971Z"
  }
}
```

---

### 2. Verify Session Token
Check if a token is still valid, active, and unexpired.

* **Method**: `GET`
* **URL**: `http://localhost:8006/api/auth/verify`
* **Headers**:
  * `Authorization`: `Bearer {{token}}`
* **Body**: *None*
* **Expected Response (`200 OK`)**:
```json
{
  "success": true,
  "authenticated": true,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@sdg.org",
    "full_name": "System Administrator",
    "role": "admin",
    "last_login": "2026-10-12T09:16:00.000Z"
  }
}
```
* **Invalid/Expired Response (`401 Unauthorized`)**:
```json
{
  "success": false,
  "authenticated": false,
  "message": "Session expired or invalid token"
}
```

---

### 3. Create New Admin User / Set Password
Register or provision new credentials with a salted password hash.

* **Method**: `POST`
* **URL**: `http://localhost:8006/api/auth/create-password`
* **Headers**:
  * `Content-Type`: `application/json`
  * `Authorization`: `Bearer {{token}}` *(optional)*
* **Body** (`raw` -> `JSON`):
```json
{
  "username": "editor_john",
  "email": "john@sdg.org",
  "password": "SecurePassword123!",
  "full_name": "John Doe",
  "role": "admin"
}
```
* **Expected Response (`201 Created`)**:
```json
{
  "success": true,
  "message": "User credentials created successfully",
  "user": {
    "id": 2,
    "username": "editor_john",
    "email": "john@sdg.org",
    "full_name": "John Doe",
    "role": "admin"
  }
}
```
* **Duplicate Username/Email Error (`409 Conflict`)**:
```json
{
  "success": false,
  "message": "Username is already in use"
}
```

---

### 4. Update Password
Update an existing user's password directly from inside the admin portal or via API. **No old password is required** — simply provide the new password.

* **Method**: `PUT`
* **URL**: `http://localhost:8006/api/auth/update-password`
* **Headers**:
  * `Content-Type`: `application/json`
  * `Authorization`: `Bearer {{token}}` *(recommended)*
* **Body** (`raw` -> `JSON`):
```json
{
  "new_password": "NewSecretPassword2026!"
}
```
* **Expected Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Password updated successfully",
  "token": "b4eeb7b45579bf378acdcdeddf9a24cd2a8619bda8fd2187a5511dbecc1b0099"
}
```

---

### 5. Admin Logout
Invalidate the current session token in the database.

* **Method**: `POST`
* **URL**: `http://localhost:8006/api/auth/logout`
* **Headers**:
  * `Authorization`: `Bearer {{token}}`
* **Body**: *None*
* **Expected Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 📂 Postman Collection v2.1 Import JSON
You can import this entire test collection directly into Postman (**File -> Import -> Raw text**):

```json
{
  "info": {
    "name": "SDG Admin Auth API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Admin Login",
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"admin\",\n  \"password\": \"admin123\"\n}"
        },
        "url": { "raw": "http://localhost:8006/api/auth/login" }
      }
    },
    {
      "name": "2. Verify Session",
      "request": {
        "method": "GET",
        "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
        "url": { "raw": "http://localhost:8006/api/auth/verify" }
      }
    },
    {
      "name": "3. Create User & Password",
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"newadmin\",\n  \"email\": \"newadmin@sdg.org\",\n  \"password\": \"password123\",\n  \"full_name\": \"New Admin\",\n  \"role\": \"admin\"\n}"
        },
        "url": { "raw": "http://localhost:8006/api/auth/create-password" }
      }
    },
    {
      "name": "4. Update Password",
      "request": {
        "method": "PUT",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"admin\",\n  \"current_password\": \"admin123\",\n  \"new_password\": \"newpassword456\"\n}"
        },
        "url": { "raw": "http://localhost:8006/api/auth/update-password" }
      }
    },
    {
      "name": "5. Admin Logout",
      "request": {
        "method": "POST",
        "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
        "url": { "raw": "http://localhost:8006/api/auth/logout" }
      }
    }
  ]
}
```


