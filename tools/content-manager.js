import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';

const getGeminiPrompt = (productName, amazonDescription, profileTitle, profileDescription, keywords) => `
Eres el redactor creativo principal de "Regalo en un clic", un recomendador de regalos experto con un tono cercano, inteligente y que aporta valor real.

CONTEXTO DEL PRODUCTO:
- Nombre: ${productName}
- Características de Amazon: ${amazonDescription}

PERFIL DESTINATARIO:
- Título: ${profileTitle}
- Definición estratégica del regalo: ${profileDescription}
- Palabras clave a evocar: ${keywords.join(', ')}

TU TAREA:
Escribe una reseña/descripción corta (máx. 100 palabras) que convenza al comprador de que este es el regalo perfecto.

REGLAS DE ORO DE REDACCIÓN:
1. No digas "es el regalo perfecto para ${profileTitle}". Demuéstralo.
2. Enfócate en el beneficio emocional o cotidiano.
3. Evita clichés publicitarios y adjetivos vacíos. Usa descripciones concretas y sensoriales.
4. El estilo debe ser coherente con el perfil.
5. Menciona un aspecto técnico del producto que refuerce la calidad.
6. El texto debe estar en una sola pieza (un párrafo o párrafo + frase final de impacto).

SALIDA ESPERADA:
Texto limpio, listo para publicar. Responde solo con el texto de la descripción.
`.trim();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Cargar .env explícitamente desde la raíz del proyecto
dotenv.config({ path: path.join(__dirname, '../.env') });

const STYLE_GUIDE_PATH = path.join(__dirname, '../src/config/style-guide.json');
const HISTORY_PATH = path.join(__dirname, '../src/data/history.json');

// --- CONFIGURACIÓN AMAZON PAAPI ---
const AMAZON_CONFIG = {
    ACCESS_KEY: process.env.AMAZON_ACCESS_KEY,
    SECRET_KEY: process.env.AMAZON_SECRET_KEY,
    PARTNER_TAG: process.env.AMAZON_PARTNER_TAG || 'skaldcraft-21',
    HOST: 'webservices.amazon.es',
    REGION: 'eu-west-1',
    MARKETPLACE: 'www.amazon.es'
};

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Cargar Guía de Estilo
const styleGuide = JSON.parse(fs.readFileSync(STYLE_GUIDE_PATH, 'utf8'));

// --- LOGICA DE FIRMA AWS V4 ---
function sign(key, msg) {
    return crypto.createHmac('sha256', key).update(msg).digest();
}

function getSignatureKey(secret, dateStamp, region, service) {
    const kDate = sign(Buffer.from('AWS4' + secret, 'utf8'), dateStamp);
    const kRegion = sign(kDate, region);
    const kService = sign(kRegion, service);
    return sign(kService, 'aws4_request');
}

async function callAmazonAPI(target, payload) {
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '').slice(0, 15) + 'Z';
    const dateStamp = amzDate.slice(0, 8);
    const path = '/paapi5/' + target.toLowerCase().split('.').pop();
    const service = 'ProductAdvertisingAPI';
    const payloadStr = JSON.stringify(payload);
    const payloadHash = crypto.createHash('sha256').update(payloadStr).digest('hex');

    const canonicalHeaders =
        `content-encoding:amz-1.0\n` +
        `content-type:application/json; charset=UTF-8\n` +
        `host:${AMAZON_CONFIG.HOST}\n` +
        `x-amz-date:${amzDate}\n` +
        `x-amz-target:${target}\n`;
    const signedHeaders = 'content-encoding;content-type;host;x-amz-date;x-amz-target';

    const canonicalRequest = ['POST', path, '', canonicalHeaders, signedHeaders, payloadHash].join('\n');
    const credentialScope = `${dateStamp}/${AMAZON_CONFIG.REGION}/${service}/aws4_request`;
    const stringToSign = [
        'AWS4-HMAC-SHA256', amzDate, credentialScope,
        crypto.createHash('sha256').update(canonicalRequest).digest('hex')
    ].join('\n');

    const signingKey = getSignatureKey(AMAZON_CONFIG.SECRET_KEY, dateStamp, AMAZON_CONFIG.REGION, service);
    const signature = sign(signingKey, stringToSign).toString('hex');
    const authHeader = `AWS4-HMAC-SHA256 Credential=${AMAZON_CONFIG.ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`https://${AMAZON_CONFIG.HOST}${path}`, {
        method: 'POST',
        headers: {
            'content-encoding': 'amz-1.0',
            'content-type': 'application/json; charset=UTF-8',
            'host': AMAZON_CONFIG.HOST,
            'x-amz-date': amzDate,
            'x-amz-target': target,
            'Authorization': authHeader
        },
        body: payloadStr
    });

    const data = await response.json();
    if (!response.ok) throw new Error(`Amazon API Error: ${JSON.stringify(data)}`);
    return data;
}

// --- CICLO DE GENERACIÓN ---
async function runGenerationCycle() {
    console.log('🚀 Iniciando ciclo de generación de OneClickFix...');

    if (!process.env.AI_KEY || !AMAZON_CONFIG.ACCESS_KEY || !AMAZON_CONFIG.SECRET_KEY) {
        console.error('❌ Error: Credenciales faltantes en .env (AI_KEY o AMAZON_KEYS)');
        return;
    }

    const history = loadHistory();
    const newEntries = [];

    for (const [profileId, profile] of Object.entries(styleGuide.profiles)) {
        if (profileId === 'todos') continue;

        console.log(`\n📦 Procesando perfil: ${profile.title}`);
        const priceTiers = {
            bajo: { min: 0, max: 25 },
            medio: { min: 25, max: 75 },
            alto: { min: 75, max: 300 }
        };

        for (const [tierName, range] of Object.entries(priceTiers)) {
            try {
                console.log(`   🔍 Buscando producto para rango: ${tierName.toUpperCase()} (${range.min}-${range.max}€)`);

                // 1. SearchItems para encontrar un producto relevante
                const keywords = profile.examples.join(' ') + ' ' + (profile.keywords[0] || '');
                const searchResult = await callAmazonAPI('com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems', {
                    Keywords: keywords,
                    Resources: ['ItemInfo.Title', 'Offers.Listings.Price', 'Images.Primary.Large', 'ItemInfo.Features'],
                    MinPrice: range.min * 100, // en centavos
                    MaxPrice: range.max * 100,
                    PartnerTag: AMAZON_CONFIG.PARTNER_TAG,
                    PartnerType: 'Associates',
                    Marketplace: AMAZON_CONFIG.MARKETPLACE,
                    ItemCount: 1
                });

                const item = searchResult?.SearchResult?.Items?.[0];
                if (!item) {
                    console.warn(`   ⚠️ No se encontró producto para este rango.`);
                    continue;
                }

                const asin = item.ASIN;
                const title = item.ItemInfo?.Title?.DisplayValue;
                const price = item.Offers?.Listings?.[0]?.Price?.DisplayAmount || 'Consultar';
                const image = item.Images?.Primary?.Large?.URL;
                const features = item.ItemInfo?.Features?.DisplayValues?.join('. ') || '';

                console.log(`   ✍️  Generando descripción con Gemini para: ${title.substring(0, 30)}...`);

                const prompt = getGeminiPrompt(title, features, profile.title, profile.description, profile.keywords);
                const result = await model.generateContent(prompt);
                const aiDescription = result.response.text().trim();

                const entry = {
                    id: `entry-${Date.now()}-${asin}`,
                    date: new Date().toISOString(),
                    profileId,
                    tier: tierName,
                    asin,
                    title,
                    price,
                    image,
                    affiliate_url: `https://www.amazon.es/dp/${asin}/?tag=${AMAZON_CONFIG.PARTNER_TAG}`,
                    ai_description: aiDescription,
                    commission_rate: 0.05
                };

                newEntries.push(entry);
                console.log(`   ✅ Guardado con éxito.`);
            } catch (error) {
                console.error(`   ❌ Error en ${profile.title} (${tierName}):`, error.message);
            }
        }
    }

    if (newEntries.length > 0) {
        saveToHistory([...newEntries, ...history]);
        console.log(`\n🎉 Ciclo completado. Se han añadido ${newEntries.length} productos al histórico.`);
    }
}

function loadHistory() {
    if (!fs.existsSync(HISTORY_PATH)) {
        if (!fs.existsSync(path.dirname(HISTORY_PATH))) fs.mkdirSync(path.dirname(HISTORY_PATH), { recursive: true });
        return [];
    }
    return JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8'));
}

function saveToHistory(history) {
    fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2));
}

if (process.argv.includes('--run')) {
    runGenerationCycle().catch(console.error);
} else {
    console.log('Uso: node tools/content-manager.js --run');
}
