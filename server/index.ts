import express from 'express';
import cors from 'cors';
import path from 'path';
import './db'; // ensures schema is migrated + seeded before routes run

import authRoutes from './routes/auth';
import articleRoutes from './routes/articles';
import forumRoutes from './routes/forum';
import productRoutes from './routes/products';
import clubRoutes from './routes/clubs';
import eventRoutes from './routes/events';
import visitorRoutes from './routes/visitors';
import tutorialRoutes from './routes/tutorials';
import governanceRoutes from './routes/governance';
import teamMemberRoutes from './routes/team-members';
import galleryRoutes from './routes/gallery';
import uploadRoutes from './routes/uploads';

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
const CORS_ORIGIN = process.env.CORS_ORIGIN;

// Trust the Nginx reverse proxy's X-Forwarded-For header so req.ip reflects
// the real client IP (used for visitor de-duplication).
app.set('trust proxy', 1);

app.use(cors(CORS_ORIGIN ? { origin: CORS_ORIGIN.split(',') } : {}));
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/products', productRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/tutorials', tutorialRoutes);
app.use('/api/governance-documents', governanceRoutes);
app.use('/api/team-members', teamMemberRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/uploads', uploadRoutes);

// Bound to loopback only — in production this process sits behind an Nginx
// reverse proxy on the same host, and should never be reachable directly
// from outside. Local dev (Vite proxy targets localhost:5000) is unaffected.
const HOST = process.env.HOST || '127.0.0.1';
app.listen(PORT, HOST, () => {
  console.log(`[Vizball Pro Server] Listening on http://${HOST}:${PORT}`);
});
