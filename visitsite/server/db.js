// db.js - Centralized Database Module
import mysql from 'mysql2';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to load .env variables if not already set in process.env
function loadEnv() {
  const candidatePaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '.env'),
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '../../.env')
  ];

  for (const envPath of candidatePaths) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, 'utf8');
        const lines = content.split(/\r?\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const match = trimmed.match(/^([^=]+)=(.*)$/);
          if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
              value = value.slice(1, -1);
            }
            if (process.env[key] === undefined) {
              process.env[key] = value;
            }
          }
        }
      } catch (e) {
        // Silently continue
      }
    }
  }
}

loadEnv();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
  database: process.env.DB_NAME || 'sustain_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create the underlying MySQL connection pool (supports callback style)
const callbackPool = mysql.createPool(dbConfig);

// Create the promise-based wrapper (supports async/await style)
const promisePool = callbackPool.promise();

// Unified pool query/execute wrapper:
// - If last argument is a callback function -> invokes via callbackPool
// - If no callback function -> returns Promise via promisePool
const originalQuery = promisePool.query.bind(promisePool);
const originalExecute = promisePool.execute.bind(promisePool);

promisePool.query = function (...args) {
  const lastArg = args[args.length - 1];
  if (typeof lastArg === 'function') {
    return callbackPool.query(...args);
  }
  return originalQuery(...args);
};

promisePool.execute = function (...args) {
  const lastArg = args[args.length - 1];
  if (typeof lastArg === 'function') {
    return callbackPool.execute(...args);
  }
  return originalExecute(...args);
};

// Backwards-compatibility for route files calling db.connect()
promisePool.connect = function (cb) {
  callbackPool.getConnection((err, conn) => {
    if (conn) conn.release();
    if (typeof cb === 'function') cb(err);
  });
};

// Cross-assign references for seamless compatibility
callbackPool.promise = () => promisePool;
promisePool.pool = promisePool;
promisePool.db = promisePool;

// Connection test on server startup
promisePool.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error(`   Host: ${dbConfig.host}:${dbConfig.port}, User: ${dbConfig.user}, Database: ${dbConfig.database}`);
    console.error('💡 Please verify your database credentials in .env');
  } else {
    console.log(`✅ Connected to MySQL database: ${dbConfig.database} (${dbConfig.host}:${dbConfig.port})`);
  }
});

export const pool = promisePool;
export const db = promisePool;
export default promisePool;