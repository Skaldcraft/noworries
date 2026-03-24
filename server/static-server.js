/**
 * Static file server for Hostinger Node.js hosting.
 * Serves the Vite-built `dist/` folder under the ROOT path.
 * 
 * Usage: 
 * 1. npm run build
 * 2. node server/static-server.js
 */

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { DEPLOYMENT_CONFIG } from '../app-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || DEPLOYMENT_CONFIG.PORT || 3000;
const DIST = join(__dirname, '..', 'dist');
const SUBPATH = DEPLOYMENT_CONFIG.BASE_PATH;

// 0. Health check
app.get('/ping', (req, res) => res.send('pong'));

// 1. Serve the holding page at the root URL
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'under-construction.html'));
});

// 2. Serve static assets for the app under the specific subpath
app.use(SUBPATH, express.static(DIST, { index: false }));

// 3. SPA Fallback for the real app
app.get(`${SUBPATH}*`, (req, res) => {
  res.sendFile(join(DIST, 'index.html'));
});

// 4. Global fallback for any other path: redirect to root
app.get('*', (req, res) => {
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
