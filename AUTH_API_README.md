# 🔐 SDG Admin Portal - Authentication & Password Management REST API

This document details the authentication, session validation, and password management REST API powering the SDG Admin Portal (`http://localhost:8080/`).

---

## 🌟 Quick Overview & Credentials

* **Backend Base URL**: `http://localhost:8006` (or `http://180.235.121.250:8006` in production)
* **Admin Portal URL**: `http://localhost:8080/`
* **Login Page URL**: `http://localhost:8080/login`
* **Database Table**: `admin_users` (in MySQL `sustain_db`)
* **Default Admin Credentials**:
  * **Username**: `admin`
  * **Password**: `admin123`
  * **Email**: `admin@sdg.org`

---

## 🛡️ Session Validation Architecture

1. **Token Generation**: Upon successful authentication, a cryptographically secure 64-character token is generated (`crypto.randomBytes(32).toString('hex')`).
2. **Session Lifespan**: Tokens remain active for **7 days** from creation or renewal (`token_expiry` column).
3. **Authorization Header**: Client requests to protected endpoints pass the token in the standard HTTP header:
   ```http
   Authorization: Bearer <your_session_token>
   ```
4. **Client-Side Persistence**: Tokens are persisted in `localStorage` under key `sdg_admin_token`. On page load, `GET /api/auth/verify` validates token authenticity. If expired or revoked, the user is redirected to `/login`.

---

## 📋 Endpoints Summary

| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| [`/api/auth/login`](#1-post-apiauthlogin) | `POST` | No | Authenticate user and issue 7-day session token |
| [`/api/auth/verify`](#2-get-apiauthverify) | `GET` | Yes (Bearer Token) | Validate active session token and return user profile |
| [`/api/auth/logout`](#3-post-apiauthlogout) | `POST` | Yes (Bearer Token) | Invalidate current session token in database |
| [`/api/auth/create-password`](#4-post-apiauthcreate-password) | `POST` | No (or Admin) | Register/create new user credentials with salted password hash |
| [`/api/auth/update-password`](#5-put-apiauthupdate-password) | `PUT` | Optional (Token or Username + Current Password) | Update existing password and reissue refreshed token |

---

## 🚀 Endpoint Specifications

### 1. POST `/api/auth/login`
Authenticate admin user and create an active session.

* **URL**: `http://localhost:8006/api/auth/login`
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`

#### Request Payload
```json
{
  "username": "admin",
  "password": "admin123"
}
```
> *Note: The `username` field also accepts the user's email address (e.g. `admin@sdg.org`).*

#### Success Response (HTTP 200 OK)
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

#### Error Response - Invalid Credentials (HTTP 401 Unauthorized)
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

#### Error Response - Missing Fields (HTTP 400 Bad Request)
```json
{
  "success": false,
  "message": "Username and password are required"
}
```

---

### 2. GET `/api/auth/verify`
Validate if the client's session token is active and unexpired.

* **URL**: `http://localhost:8006/api/auth/verify`
* **Method**: `GET`
* **Headers**: 
  ```http
  Authorization: Bearer <session_token>
  ```

#### Success Response (HTTP 200 OK)
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

#### Error Response - Expired or Invalid Token (HTTP 401 Unauthorized)
```json
{
  "success": false,
  "authenticated": false,
  "message": "Session expired or invalid token"
}
```

#### Error Response - No Token Provided (HTTP 401 Unauthorized)
```json
{
  "success": false,
  "authenticated": false,
  "message": "No authorization token provided"
}
```

---

### 3. POST `/api/auth/logout`
Log out and invalidate the session token in the database.

* **URL**: `http://localhost:8006/api/auth/logout`
* **Method**: `POST`
* **Headers**: 
  ```http
  Authorization: Bearer <session_token>
  ```

#### Success Response (HTTP 200 OK)
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 4. POST `/api/auth/create-password`
Create / register a new user credential with salted scrypt password hashing.

* **URL**: `http://localhost:8006/api/auth/create-password`
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`

#### Request Payload
```json
{
  "username": "editor_john",
  "email": "john@sdg.org",
  "password": "SecurePassword123!",
  "full_name": "John Doe",
  "role": "admin"
}
```

#### Success Response (HTTP 201 Created)
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

#### Error Response - Username/Email Already Taken (HTTP 409 Conflict)
```json
{
  "success": false,
  "message": "Username is already in use"
}
```

#### Error Response - Password Too Short (HTTP 400 Bad Request)
```json
{
  "success": false,
  "message": "Password must be at least 6 characters long"
}
```

---

### 5. PUT `/api/auth/update-password`
Update an existing user's password directly from inside the admin portal or via API. **No old password is required** — simply provide the new password.

* **URL**: `http://localhost:8006/api/auth/update-password`
* **Method**: `PUT`
* **Headers**:
  * `Content-Type`: `application/json`
  * `Authorization`: `Bearer <token>` *(recommended when logged in)*

#### Request Payload
```json
{
  "new_password": "NewSecretPassword2026!"
}
```
> *Optionally, you can also pass `"username": "admin"` if calling without a bearer token.*

#### Success Response (HTTP 200 OK)
```json
{
  "success": true,
  "message": "Password updated successfully",
  "token": "b4eeb7b45579bf378acdcdeddf9a24cd2a8619bda8fd2187a5511dbecc1b0099"
}
```

#### Error Response - Incorrect Current Password (HTTP 401 Unauthorized)
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

#### Error Response - Password Length Error (HTTP 400 Bad Request)
```json
{
  "success": false,
  "message": "New password must be at least 6 characters long"
}
```

---

## 💻 cURL Test Commands

### 1. Test Login
```bash
curl -X POST http://localhost:8006/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 2. Test Verify Session
```bash
curl -X GET http://localhost:8006/api/auth/verify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Test Create Password / User
```bash
curl -X POST http://localhost:8006/api/auth/create-password \
  -H "Content-Type: application/json" \
  -d '{"username":"sdg_manager","email":"manager@sdg.org","password":"password123","full_name":"Sustainability Manager"}'
```

### 4. Test Update Password
```bash
curl -X PUT http://localhost:8006/api/auth/update-password \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","current_password":"admin123","new_password":"newpassword456"}'
```

---

## 🖥️ Frontend Route Protection

All admin modules on `http://localhost:8080/` are wrapped with `<ProtectedRoute>` in [AppRouter.tsx](file:///d:/projects/sdg_server/web_site3.0/src/AppRouter.tsx):

* If an unauthenticated user opens `http://localhost:8080/`, they are redirected to `http://localhost:8080/login`.
* Upon logging in, they are redirected straight to the requested dashboard.
* Clicking **Logout** in the dashboard top navigation bar invalidates the session and returns the user to the login screen.
* Public visitors viewing `http://localhost:8081/` or public `/site` paths are unaffected and can explore rankings freely without login.
