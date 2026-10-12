import db from './db.js';
import crypto from 'crypto';

export async function initAuthTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        salt VARCHAR(64) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        full_name VARCHAR(150) DEFAULT 'Administrator',
        session_token VARCHAR(255) DEFAULT NULL,
        token_expiry DATETIME DEFAULT NULL,
        last_login DATETIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    const [existing] = await db.query('SELECT * FROM admin_users WHERE username = ?', ['admin']);
    if (existing.length === 0) {
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.scryptSync('admin123', salt, 64).toString('hex');
      await db.query(
        'INSERT INTO admin_users (username, email, password_hash, salt, role, full_name) VALUES (?, ?, ?, ?, ?, ?)',
        ['admin', 'admin@sdg.org', hash, salt, 'admin', 'System Administrator']
      );
      console.log('✅ Created default admin user: admin / admin123');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  } catch (err) {
    console.error('❌ Error initializing auth table:', err);
  }
}

if (process.argv[1]?.includes('setup_auth_table.js')) {
  initAuthTable().then(() => {
    console.log('✅ Auth table initialization complete');
    process.exit(0);
  });
}
