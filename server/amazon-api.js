/**
 * Amazon PA API 5.0 — backend handler for /api/products
 *
 * Firmado con AWS Signature V4. Las credenciales solo viven en variables de entorno;
 * nunca se exponen al cliente.
 *
 * Variables de entorno requeridas para activar:
 *   AMAZON_ACCESS_KEY  — AWS Access Key ID
 *   AMAZON_SECRET_KEY  — AWS Secret Access Key
 *
 * Mientras las variables no estén configuradas, el endpoint devuelve 503
 * y el frontend cae al fallback de datos locales de forma transparente.
 */

import crypto from 'node:crypto';
import fetch  from 'node-fetch';
import rateLimit from 'express-rate-limit';

// --- Constantes de PAAPI por región ----------------------------------------
const ENDPOINTS = {
  'eu-west-1': 'webservices.amazon.es',
  'us-east-1': 'webservices.amazon.com',
};

const MARKETPLACES = {
  'eu-west-1': 'www.amazon.es',
  'us-east-1': 'www.amazon.com',
};

const DEFAULT_TAGS = {
  'eu-west-1': 'skaldcraft-21',
  'us-east-1': 'noworriesgift-20',
};

const PAAPI_PATH   = '/paapi5/getitems';
const PAAPI_TARGET = 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems';
const CONTENT_TYPE = 'application/json; charset=utf-8';

// Los recursos que necesitamos de cada producto
const RESOURCES = [
  'ItemInfo.Title',
  'Offers.Listings.Price',
  'Offers.Listings.Availability.Message',
  'Images.Primary.Large',
];

// --- Rate limiter: 1 req/s por IP para respetar la cuota de PAAPI -----------
export const amazonRateLimit = rateLimit({
  windowMs:       1000,
  max:            1,
  standardHeaders: true,
  legacyHeaders:  false,
  message:        { error: 'Too many requests.' },
});

// --- AWS Signature V4 helpers -----------------------------------------------
function hmac(key, data, encoding) {
  return crypto.createHmac('sha256', key).update(data, 'utf8').digest(encoding);
}

function sha256hex(data) {
  return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
}

function signingKey(secret, dateStamp, region, service) {
  const kDate    = hmac('AWS4' + secret, dateStamp);
  const kRegion  = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  return hmac(kService, 'aws4_request');
}

function buildAuthorizationHeader({ accessKey, secret, region, host, body, amzDate, dateStamp }) {
  const service    = 'ProductAdvertisingAPI';
  const payloadHash = sha256hex(body);

  const canonicalHeaders =
    `content-type:${CONTENT_TYPE}\n` +
    `host:${host}\n` +
    `x-amz-date:${amzDate}\n` +
    `x-amz-target:${PAAPI_TARGET}\n`;
  const signedHeaders = 'content-type;host;x-amz-date;x-amz-target';

  const canonicalRequest = [
    'POST',
    PAAPI_PATH,
    '',              // query string vacío
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    sha256hex(canonicalRequest),
  ].join('\n');

  const signature = hmac(signingKey(secret, dateStamp, region, service), stringToSign, 'hex');

  return (
    `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`
  );
}

// --- Detección de región a partir del partner tag ---------------------------
function regionFromTag(tag) {
  if (!tag) return 'eu-west-1';
  return tag.endsWith('-20') ? 'us-east-1' : 'eu-west-1';
}

// --- Handler principal ------------------------------------------------------
export async function handleProductsRequest(req, res) {
  const accessKey = process.env.AMAZON_ACCESS_KEY;
  const secretKey = process.env.AMAZON_SECRET_KEY;

  if (!accessKey || !secretKey) {
    // Sin credenciales → fallback transparente para el frontend
    return res.status(503).json({
      error: 'Amazon PA API credentials not configured.',
      code:  'CREDENTIALS_MISSING',
    });
  }

  const { asin, tag } = req.body ?? {};

  if (!asin || typeof asin !== 'string' || !/^[A-Z0-9]{10}$/.test(asin)) {
    return res.status(400).json({ error: 'Invalid or missing ASIN.' });
  }

  const region      = regionFromTag(tag);
  const host        = ENDPOINTS[region];
  const marketplace = MARKETPLACES[region];
  const partnerTag  = (tag && typeof tag === 'string') ? tag : DEFAULT_TAGS[region];

  // Timestamp en formato AWS: YYYYMMDDTHHmmssZ
  const now       = new Date();
  const amzDate   = now.toISOString().replace(/[:\-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);

  const payload = JSON.stringify({
    ItemIds:     [asin],
    Resources:   RESOURCES,
    PartnerTag:  partnerTag,
    PartnerType: 'Associates',
    Marketplace: marketplace,
  });

  const authorization = buildAuthorizationHeader({
    accessKey, secret: secretKey,
    region, host, body: payload, amzDate, dateStamp,
  });

  try {
    const response = await fetch(`https://${host}${PAAPI_PATH}`, {
      method:  'POST',
      headers: {
        'content-type':  CONTENT_TYPE,
        'host':          host,
        'x-amz-date':   amzDate,
        'x-amz-target': PAAPI_TARGET,
        'Authorization': authorization,
      },
      body: payload,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[amazon-api] PAAPI ${response.status}:`, errText);
      return res.status(502).json({ error: 'Amazon API error.', status: response.status });
    }

    const data = await response.json();
    const item = data?.ItemsResult?.Items?.[0];

    if (!item) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const title         = item.ItemInfo?.Title?.DisplayValue ?? null;
    const price         = item.Offers?.Listings?.[0]?.Price?.Amount ?? null;
    const available     = !!item.Offers?.Listings?.[0];
    const image         = item.Images?.Primary?.Large?.URL ?? null;
    const affiliate_url = `https://${marketplace}/dp/${asin}/?tag=${partnerTag}`;

    return res.json({ title, price, available, image, affiliate_url });

  } catch (err) {
    console.error('[amazon-api] Network error:', err.message);
    return res.status(503).json({ error: 'Failed to reach Amazon API.' });
  }
}
