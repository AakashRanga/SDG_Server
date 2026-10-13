import express from 'express';
import crypto from 'crypto';
import pool from '../db.js';
import { initAuthTable } from '../setup_auth_table.js';

const router = express.Router();

// Auto-ensure admin_users table exists on server start
initAuthTable().catch(err => console.error('⚠️ [Auth table auto-init warning]:', err.message));

// Helper: Hash password with salt using native crypto.scryptSync
function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

// Helper: Extract token from Authorization header or custom header
function extractToken(req) {
  const authHeader = req.headers.authorization || req.headers['x-auth-token'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  if (authHeader) {
    return authHeader.trim();
  }
  return req.query.token || null;
}

// ============================================================
// 1. POST /api/auth/login - Authenticate and create session
// ============================================================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Lookup user by username or email
    const [users] = await pool.query(
      'SELECT * FROM admin_users WHERE username = ? OR email = ? LIMIT 1',
      [username.trim(), username.trim()]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const user = users[0];
    const computedHash = hashPassword(password, user.salt);

    if (computedHash !== user.password_hash) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Generate random 64-char session token valid for 7 days
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await pool.query(
      'UPDATE admin_users SET session_token = ?, token_expiry = ?, last_login = NOW() WHERE id = ?',
      [token, expiry, user.id]
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        last_login: new Date()
      }
    });
  } catch (err) {
    console.error('❌ Error during login:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during login: ' + err.message
    });
  }
});

// ============================================================
// 2. GET /api/auth/verify - Verify session token
// ============================================================
router.get('/verify', async (req, res) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        message: 'No authorization token provided'
      });
    }

    const [users] = await pool.query(
      'SELECT id, username, email, role, full_name, last_login, token_expiry FROM admin_users WHERE session_token = ? AND token_expiry > NOW() LIMIT 1',
      [token]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        message: 'Session expired or invalid token'
      });
    }

    const user = users[0];
    return res.status(200).json({
      success: true,
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        last_login: user.last_login
      }
    });
  } catch (err) {
    console.error('❌ Error verifying session:', err);
    return res.status(500).json({
      success: false,
      authenticated: false,
      message: 'Server error during session verification: ' + err.message
    });
  }
});

// ============================================================
// 3. POST /api/auth/logout - Invalidate session token
// ============================================================
router.post('/logout', async (req, res) => {
  try {
    const token = extractToken(req);

    if (token) {
      await pool.query(
        'UPDATE admin_users SET session_token = NULL, token_expiry = NULL WHERE session_token = ?',
        [token]
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (err) {
    console.error('❌ Error logging out:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during logout: ' + err.message
    });
  }
});

// ============================================================
// 4. POST /api/auth/create-password - Create / Register new user
// ============================================================
router.post('/create-password', async (req, res) => {
  try {
    const { username, email, password, full_name, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if username or email already exists
    const [existing] = await pool.query(
      'SELECT id, username, email FROM admin_users WHERE username = ? OR email = ? LIMIT 1',
      [username.trim(), email.trim()]
    );

    if (existing.length > 0) {
      const match = existing[0];
      const field = match.username.toLowerCase() === username.trim().toLowerCase() ? 'Username' : 'Email';
      return res.status(409).json({
        success: false,
        message: `${field} is already in use`
      });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const password_hash = hashPassword(password, salt);

    const [result] = await pool.query(
      'INSERT INTO admin_users (username, email, password_hash, salt, full_name, role) VALUES (?, ?, ?, ?, ?, ?)',
      [
        username.trim(),
        email.trim(),
        password_hash,
        salt,
        full_name?.trim() || 'Admin User',
        role?.trim() || 'admin'
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'User credentials created successfully',
      user: {
        id: result.insertId,
        username: username.trim(),
        email: email.trim(),
        full_name: full_name?.trim() || 'Admin User',
        role: role?.trim() || 'admin'
      }
    });
  } catch (err) {
    console.error('❌ Error creating user credentials:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error creating user: ' + err.message
    });
  }
});

// ============================================================
// 5. PUT /api/auth/update-password - Update existing password
// ============================================================
router.put('/update-password', async (req, res) => {
  try {
    const { username } = req.body;
    // Accept password from new_password, password, or current_password
    const new_password = req.body.new_password || req.body.password || req.body.current_password;
    const token = extractToken(req);

    if (!new_password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    let user = null;

    // Option A: Identify by bearer token
    if (token) {
      const [tokenUsers] = await pool.query(
        'SELECT * FROM admin_users WHERE session_token = ? AND token_expiry > NOW() LIMIT 1',
        [token]
      );
      if (tokenUsers.length > 0) {
        user = tokenUsers[0];
      }
    }

    // Option B: Identify by username
    if (!user && username) {
      const [namedUsers] = await pool.query(
        'SELECT * FROM admin_users WHERE username = ? OR email = ? LIMIT 1',
        [username.trim(), username.trim()]
      );
      if (namedUsers.length > 0) {
        user = namedUsers[0];
      }
    }

    // Default to the first admin if neither token nor username is specified
    if (!user) {
      const [defaultAdmins] = await pool.query('SELECT * FROM admin_users ORDER BY id ASC LIMIT 1');
      if (defaultAdmins.length > 0) {
        user = defaultAdmins[0];
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found'
      });
    }

    // Generate fresh salt and new password hash
    const newSalt = crypto.randomBytes(16).toString('hex');
    const newHash = hashPassword(new_password, newSalt);

    // Keep session or generate new token
    const newToken = crypto.randomBytes(32).toString('hex');
    const newExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await pool.query(
      'UPDATE admin_users SET password_hash = ?, salt = ?, session_token = ?, token_expiry = ? WHERE id = ?',
      [newHash, newSalt, newToken, newExpiry, user.id]
    );

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      token: newToken
    });
  } catch (err) {
    console.error('❌ Error updating password:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error updating password: ' + err.message
    });
  }
});

export default router;
