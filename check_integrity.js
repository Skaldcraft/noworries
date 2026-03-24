
import fs from 'fs';
import path from 'path';

const giftsPath = 'c:/Users/tradu/OneDrive/Documentos/Aplicaciones/OneClickFix/src/data/gifts.json';
const secondaryPath = 'c:/Users/tradu/OneDrive/Documentos/Aplicaciones/OneClickFix/src/data/secondary-products.json';
const imagesDir = 'c:/Users/tradu/OneDrive/Documentos/Aplicaciones/OneClickFix/public/images';

const gifts = JSON.parse(fs.readFileSync(giftsPath, 'utf8'));
const secondary = JSON.parse(fs.readFileSync(secondaryPath, 'utf8'));
const imagesInDir = fs.readdirSync(imagesDir);

console.log('--- INTEGRITY CHECK ---');
const allProducts = [...gifts, ...secondary];
const referencedImages = new Set();
const missing = [];

allProducts.forEach(p => {
    if (p.image && p.image.startsWith('/images/')) {
        const imageName = p.image.replace('/images/', '');
        referencedImages.add(imageName);
        if (!imagesInDir.includes(imageName)) {
            missing.push({ file: p.id === gifts[0].id ? 'gifts.json' : 'secondary or gifts', id: p.id, name: p.product_name, image: p.image });
        }
    }
});

if (missing.length > 0) {
    console.log('\n[!] MISSING IMAGES:');
    missing.forEach(m => console.log(`- ${m.name} (${m.id}): ${m.image}`));
} else {
    console.log('\n[+] All referenced images exist in /public/images/.');
}

const unused = imagesInDir.filter(img => !referencedImages.has(img));
if (unused.length > 0) {
    console.log('\n[?] UNUSED IMAGES IN FOLDER:');
    unused.forEach(u => console.log(`- ${u}`));
}

// Special check for common mismatches
console.log('\n--- SUGGESTIONS ---');
if (imagesInDir.includes('difusor-aceite.jpg') && gifts.some(g => g.image === '/images/humidificador-llama.jpg')) {
    console.log('- Suggestion: Renaming /images/humidificador-llama.jpg to difusor-aceite.jpg in gifts.json');
}
if (imagesInDir.includes('lavadora-viaje.jpg') && !referencedImages.has('lavadora-viaje.jpg')) {
    console.log('- Suggestion: Add lavadora-viaje.jpg to relevant product in JSON.');
}
