
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'node:process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GIFTS_PATH = path.join(__dirname, 'src/data/gifts.json');
const SECONDARY_PATH = path.join(__dirname, 'src/data/secondary-gifts-es.json');
const IMAGES_DIR = path.join(__dirname, 'public/images');

// Mapeo de prefijos antiguos a nuevos para mantener consistencia
const PREFIX_MAP = {
    'invisible-friend': 'for-invisible-friend',
    'detalle': 'small-gift',
    'solo-porque-si': 'just-because',
    'quien-lo-tiene-todo': 'for-someone-who-has-everything'
};

// Mapeo de recipient a prefijo correcto
const RECIPIENT_PREFIX_MAP = {
    'PARA AMIGO INVISIBLE': 'for-invisible-friend',
    'EL DETALLE': 'small-gift',
    'SOLO PORQUE SÍ': 'just-because',
    'PARA QUIEN LO TIENE TODO': 'for-someone-who-has-everything',
    'BÁSICOS ÚTILES': 'basicos-utiles'
};

function getCorrectPrefix(product) {
    // Primero verificar si el recipient tiene mapeo directo
    const recipientUpper = product.recipient?.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    for (const [key, value] of Object.entries(RECIPIENT_PREFIX_MAP)) {
        const keyNormalized = key.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (recipientUpper.includes(keyNormalized)) {
            return value;
        }
    }
    
    // Si no, verificar si el prefijo actual necesita corrección
    for (const [oldPrefix, newPrefix] of Object.entries(PREFIX_MAP)) {
        if (product.id.startsWith(oldPrefix + '-')) {
            return newPrefix;
        }
    }
    
    // Devolver el prefijo original
    return product.id.split('-').slice(0, 2).join('-');
}

function getProfileFromId(giftId) {
    const prefix = giftId.split('-').slice(0, 2).join('-');
    for (const [oldPrefix, newPrefix] of Object.entries(PREFIX_MAP)) {
        if (prefix === oldPrefix) return newPrefix;
    }
    return prefix;
}

function loadData() {
    const gifts = JSON.parse(fs.readFileSync(GIFTS_PATH, 'utf8'));
    const secondary = JSON.parse(fs.readFileSync(SECONDARY_PATH, 'utf8'));
    return { gifts, secondary };
}

function saveData(gifts, secondary) {
    fs.writeFileSync(GIFTS_PATH, JSON.stringify(gifts, null, 2), 'utf8');
    fs.writeFileSync(SECONDARY_PATH, JSON.stringify(secondary, null, 2), 'utf8');
}

function status() {
    const { gifts, secondary } = loadData();
    console.log(`\n=== ESTADO DEL PROYECTO ===`);
    console.log(`Showroom (gifts.json):     ${gifts.length} productos`);
    console.log(`Warehouse (secondary.json): ${secondary.length} productos`);
    
    // Check duplicates
    const giftAsins = new Set(gifts.map(p => p.asin));
    const duplicates = secondary.filter(p => giftAsins.has(p.asin));
    if (duplicates.length > 0) {
        console.log(`\n[!] ADVERTENCIA: ${duplicates.length} productos del almacén ya están en el escaparate.`);
    }
}

function clean() {
    const { gifts, secondary } = loadData();
    const giftAsins = new Set(gifts.map(p => p.asin).filter(Boolean));
    const giftIds = new Set(gifts.map(p => p.id));
    
    const initialCount = secondary.length;
    const cleaned = secondary.filter(p => !giftAsins.has(p.asin) && !giftIds.has(p.id));
    
    if (cleaned.length < initialCount) {
        saveData(gifts, cleaned);
        console.log(`\n[+] Limpieza completada: se han eliminado ${initialCount - cleaned.length} duplicados del Almacén.`);
    } else {
        console.log(`\n[+] El Almacén ya está limpio de duplicados.`);
    }
}

function promote(idOrAsin) {
    const { gifts, secondary } = loadData();
    const index = secondary.findIndex(p => p.id === idOrAsin || p.asin === idOrAsin);
    
    if (index === -1) {
        console.log(`\n[!] Error: No se encontró el producto '${idOrAsin}' en el Almacén.`);
        return;
    }
    
    const product = JSON.parse(JSON.stringify(secondary[index])); // Clonar para no mutar el original
    
    // Corregir prefijo del ID si es necesario
    const correctPrefix = getCorrectPrefix(product);
    let oldPrefix = '';
    
    for (const [old, _newPrefix] of Object.entries(PREFIX_MAP)) {
        if (product.id.startsWith(old + '-')) {
            oldPrefix = old;
            break;
        }
    }
    
    if (oldPrefix && oldPrefix !== correctPrefix) {
        const newId = product.id.replace(oldPrefix + '-', correctPrefix + '-');
        console.log(`\n[*] Corrigiendo ID: ${product.id} → ${newId}`);
        product.id = newId;
    }
    
    // Check if ASIN already in gifts (only if ASIN is not empty)
    if (product.asin && gifts.some(p => p.asin === product.asin)) {
        console.log(`\n[!] Error: El producto '${product.product_name}' ya existe en el escaparate.`);
        return;
    }
    
    // Check if there's already a product with same profile and price_range
    const productProfile = getProfileFromId(product.id);
    const existingIndex = gifts.findIndex(g => {
        const gProfile = getProfileFromId(g.id);
        return gProfile === productProfile && g.price_range === product.price_range;
    });
    
    if (existingIndex !== -1) {
        const existing = gifts[existingIndex];
        console.log(`\n[*] Moviendo producto anterior '${existing.product_name}' al almacén...`);
        gifts.splice(existingIndex, 1);
        secondary.push(existing);
    }
    
    // Check image
    if (product.image && product.image.trim() !== "") {
        let imgName = product.image.replace('/images/', '').split('?')[0];
        let imgExists = false;
        
        // Buscar archivos sin extensión o con cualquier extensión
        if (fs.existsSync(path.join(IMAGES_DIR, imgName))) {
            imgExists = true;
        } else {
            const files = fs.readdirSync(IMAGES_DIR);
            const match = files.find(f => f.startsWith(imgName + '.') || f === imgName);
            if (match) {
                imgExists = true;
                product.image = '/images/' + match;
            }
        }
        
        if (!imgExists) {
            console.log(`\n[?] Aviso: La imagen '${imgName}' no existe, pero el producto será promovido igual.`);
        }
    } else {
        console.log(`\n[?] Aviso: El producto no tiene imagen definida.`);
    }
    
    secondary.splice(index, 1);
    gifts.push(product);
    
    saveData(gifts, secondary);
    console.log(`\n[+] PROMOVIDO: '${product.product_name}' movido al Escaparate.`);
}

function demote(idOrAsin) {
    const { gifts, secondary } = loadData();
    const index = gifts.findIndex(p => p.id === idOrAsin || p.asin === idOrAsin);
    
    if (index === -1) {
        console.log(`\n[!] Error: No se encontró el producto '${idOrAsin}' en el Escaparate.`);
        return;
    }
    
    const product = gifts[index];
    gifts.splice(index, 1);
    secondary.push(product);
    
    saveData(gifts, secondary);
    console.log(`\n[-] RETIRADO: '${product.product_name}' devuelto al Almacén.`);
}

function listWarehouse(profile) {
    const { secondary } = loadData();
    const filtered = profile 
        ? secondary.filter(p => p.profile_fit && p.profile_fit.includes(profile))
        : secondary;
        
    console.log(`\n=== PRODUCTOS EN ALMÁCEN${profile ? ' (Perfil: ' + profile + ')' : ''} ===`);
    if (filtered.length === 0) {
        console.log("No hay productos que coincidan.");
        return;
    }
    
    filtered.forEach(p => {
        const hasImg = (p.image && p.image.trim() !== "") ? "[IMG]" : "[   ]";
        console.log(`${hasImg} ID: ${p.id.padEnd(35)} | ASIN: ${p.asin.padEnd(10)} | ${p.product_name}`);
    });
}

// MAIN
const args = process.argv.slice(2);
const cmd = args[0];
const target = args[1];

switch(cmd) {
    case 'status': status(); break;
    case 'clean': clean(); break;
    case 'list': listWarehouse(target); break;
    case 'promote': promote(target); break;
    case 'demote': demote(target); break;
    default:
        console.log("\nUso de manage.js:");
        console.log("  node manage.js status             - Ver estado general");
        console.log("  node manage.js clean              - Eliminar duplicados del Almacén");
        console.log("  node manage.js list [perfil]      - Listar productos del Almacén");
        console.log("  node manage.js promote [ID/ASIN]  - Mover del Almacén al Escaparate");
        console.log("  node manage.js demote [ID/ASIN]   - Mover del Escaparate al Almacén");
}
