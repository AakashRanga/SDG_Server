import express from 'express';
import cors from 'cors';
import { router as greenOfficeRoutes } from './server_green-office.js';
import { router as environmentRoutes } from './server_env.js';

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/green-office', greenOfficeRoutes);
app.use('/api/env', environmentRoutes);

app.listen(8005, () => console.log('✅ Main server running on port 8005'));