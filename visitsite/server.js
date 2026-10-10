import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import history from 'express-history-api-fallback';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const root = path.join(__dirname, 'dist');

// Serve static files
app.use(express.static(root));

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Node.js on IIS is working!' });
});

// SPA fallback
app.use(history('index.html', { root }));

const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});