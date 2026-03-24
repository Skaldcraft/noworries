
import fs from 'fs';
import path from 'path';

const giftsPath = 'c:/Users/tradu/OneDrive/Documentos/Aplicaciones/OneClickFix/src/data/gifts.json';
const secondaryPath = 'c:/Users/tradu/OneDrive/Documentos/Aplicaciones/OneClickFix/src/data/secondary-products.json';
const imagesDir = 'c:/Users/tradu/OneDrive/Documentos/Aplicaciones/OneClickFix/public/images';

const gifts = JSON.parse(fs.readFileSync(giftsPath, 'utf8'));
const secondary = JSON.parse(fs.readFileSync(secondaryPath, 'utf8'));
const imagesInDir = fs.readdirSync(imagesDir);

const allProducts = [...gifts, ...secondary];
const referencedImages = new Set();
const missing = [];

console.log('--- SCANNING ALL PRODUCT DATA ---');

allProducts.forEach(gift => {
    if (gift.image && gift.image.trim() !== "") {
        const imageName = gift.image.replace('/images/', '').split('?')[0]; // Remove potential query params
        referencedImages.add(imageName);
        if (!fs.existsSync(path.join(imagesDir, imageName))) {
            missing.push({ id: gift.id, product: gift.product_name, image: gift.image });
        }
    } else {
        // Log products without image field or empty image
        // console.log(`No image for: ${gift.product_name} (${gift.id})`);
    }
});

if (missing.length > 0) {
    console.log('\nMISSING IMAGES (Referenced in JSON but not in /public/images/):');
    missing.forEach(m => console.log(`- ${m.product} (${m.id}): ${m.image}`));
} else {
    console.log('\nNo missing images found in JSON files.');
}

console.log('\n--- SCANNING DIRECTORY ---');
const unused = imagesInDir.filter(img => !referencedImages.has(img) && img !== '.gitkeep');

if (unused.length > 0) {
    console.log('UNUSED IMAGES (In folder but not referenced in JSON):');
    unused.forEach(u => console.log(`- ${u}`));
} else {
    console.log('No unused images found in folder.');
}

const productsWithNoImage = allProducts.filter(p => !p.image || p.image.trim() === "");
if (productsWithNoImage.length > 0) {
    console.log('\nPRODUCTS WITH NO IMAGE DEFINED:');
    productsWithNoImage.forEach(p => console.log(`- ${p.product_name} (${p.id})`));
}
