
import fs from 'fs';
import path from 'path';

const GIFTS_PATH = 'c:/Users/tradu/OneDrive/Documentos/Aplicaciones/OneClickFix/src/data/gifts.json';
const SECONDARY_PATH = 'c:/Users/tradu/OneDrive/Documentos/Aplicaciones/OneClickFix/src/data/secondary-products.json';
const IMAGES_DIR = 'c:/Users/tradu/OneDrive/Documentos/Aplicaciones/OneClickFix/public/images';

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
    
    const product = secondary[index];
    
    // Check if ASIN already in gifts
    if (gifts.some(p => p.asin === product.asin)) {
        console.log(`\n[!] Error: El producto '${product.product_name}' ya existe en el escaparate.`);
        return;
    }
    
    // Check image
    if (product.image && product.image.trim() !== "") {
        const imgName = product.image.replace('/images/', '').split('?')[0];
        if (!fs.existsSync(path.join(IMAGES_DIR, imgName))) {
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
