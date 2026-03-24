/**
 * Static file server for Hostinger Node.js hosting.
 * Serves the Vite-built `dist/` folder under the base path.
 *
 * Hostinger build flow:
 *   1. npm run build  →  generates dist/
 *   2. node server/api-proxy.js  →  starts this server
 */

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { DEPLOYMENT_CONFIG } from '../app-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || DEPLOYMENT_CONFIG.PORT || 3000;

// Must match `base` in vite.config.js — trailing slash removed for Express routes
const BASE = DEPLOYMENT_CONFIG.BASE_PATH;
const DIST = join(__dirname, '..', 'dist');

// 1. Serve all static assets (JS, CSS, images) from dist/
app.use(BASE, express.static(DIST, { index: false }));

// 2. SPA fallback: any route under BASE → index.html
//    Lets react-router-dom handle client-side routing
app.get(`${BASE}/*any`, (_req, res) => {
  res.sendFile(join(DIST, 'index.html'));
});

// 3. Redirect bare root to the app
app.get('/', (_req, res) => res.redirect(301, `${BASE}/`));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} — serving ${BASE}/`);
});
