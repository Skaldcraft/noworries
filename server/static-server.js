/**
 * Static file server for Hostinger Node.js hosting.
 * Serves the Vite-built `dist/` folder under the ROOT path
 * and exposes the /api/products endpoint for Amazon PA API 5.0.
 *
 * Usage:
 * 1. npm run build
 * 2. node server/static-server.js
 */

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { DEPLOYMENT_CONFIG } from '../app-config.js';
import { handleProductsRequest, amazonRateLimit } from './amazon-api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || DEPLOYMENT_CONFIG.PORT || 3000;
const DIST = join(__dirname, '..', 'dist');
const SUBPATH = DEPLOYMENT_CONFIG.BASE_PATH;
const CANONICAL_ES = DEPLOYMENT_CONFIG.ALTERNATE_DOMAINS?.es || DEPLOYMENT_CONFIG.CANONICAL_DOMAIN;

app.set('trust proxy', 1);
app.use(express.json({ limit: '16kb' }));

// Canonical redirects:
// - noworries.gift / www.noworries.gift -> https://es.noworries.gift
// - any other host: force https and drop leading www.
app.use((req, res, next) => {
  const rawHost = (req.headers.host || '').split(':')[0].toLowerCase();
  const forwardedProto = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim().toLowerCase();
  const isHttps = forwardedProto === 'https' || req.secure;
  const isLocal = rawHost === 'localhost' || rawHost === '127.0.0.1';
  const hostNoWww = rawHost.startsWith('www.') ? rawHost.slice(4) : rawHost;
  const originalUrl = req.originalUrl || '/';

  if (rawHost === 'noworries.gift' || rawHost === 'www.noworries.gift') {
    const target = `${CANONICAL_ES}${originalUrl}`;
    return res.redirect(301, target);
  }

  if (!isLocal && (!isHttps || hostNoWww !== rawHost)) {
    return res.redirect(301, `https://${hostNoWww}${originalUrl}`);
  }

  return next();
});

// 0. Health check
app.get('/ping', (req, res) => res.send('pong'));

// 1. Amazon PA API proxy — activado cuando AMAZON_ACCESS_KEY y AMAZON_SECRET_KEY
//    están en las variables de entorno; devuelve 503 si no están configuradas.
app.post('/api/products', amazonRateLimit, handleProductsRequest);

// 1. Redirect root to canonical ES domain
app.get('/', (_req, res) => {
  res.redirect(301, `${CANONICAL_ES}/`);
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
