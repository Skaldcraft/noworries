
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const secondaryPath = path.join(__dirname, 'src', 'data', 'secondary-products.json');
const giftsPath = path.join(__dirname, 'src', 'data', 'gifts.json');

const asins = {
    "for-cooks-under15-garlic-peeler": "B0056N2738",
    "for-cooks-under15-herb-scissors": "B000265696",
    "for-cooks-under15-small-chopper": "B07DPK89T3",
    "for-techies-under15-smart-plug": "B08NDDMC1J",
    "for-techies-15-35-folding-keyboard": "B0B4W6C6P7",
    "for-techies-35-70-ai-webcam": "B09MM9H68V",
    "for-techies-under15-cable-box": "B07GDW4P38",
    "for-selfcare-15-35-eye-massager": "B08D96D29J",
    "for-selfcare-under15-hand-warmer": "B0BKPPFRP3",
    "for-selfcare-under15-pimple-patches": "B0B7R7D6Z3",
    "for-homebodies-under15-led-lights": "B07XHKN8FB",
    "for-homebodies-under15-couch-tray": "B07K7K7D7Q",
    "for-traveler-under15-collapsible-bottle": "B07F1SWY9D",
    "for-traveler-15-35-mini-washer": "B00BUP7Z80",
    "for-petowner-under15-chomchom": "B0002ASO5X",
    "for-petowner-under15-grooming-brush": "B0761TTVKG",
    "for-invisible-friend-under15-yodeling-pickle": "B0010VS078",
    "small-gift-under15-potato-parcel": "B09VPH7Z8V",
    "just-because-under15-color-mug": "B0056ST0XO"
};

function updateFile(filePath, isSecondary = false) {
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return;
    }
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let changed = false;

    data = data.map(item => {
        let itemChanged = false;
        
        // Add ASIN if missing and we have one
        if (isSecondary && !item.asin && asins[item.id]) {
            item.asin = asins[item.id];
            itemChanged = true;
        }

        // Tag update if no link or just general requirement
        if (!item.affiliate_url_format || item.affiliate_url_format === "") {
            item.tag = "skaldcraft-21";
            if (item.asin) {
                item.affiliate_url_format = `https://www.amazon.es/dp/${item.asin}/?tag=skaldcraft-21`;
            }
            itemChanged = true;
        } else if (item.tag !== "skaldcraft-21") {
            item.tag = "skaldcraft-21";
            itemChanged = true;
        }

        if (itemChanged) changed = true;
        return item;
    });

    if (changed) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Updated ${filePath}`);
    } else {
        console.log(`No changes for ${filePath}`);
    }
}

updateFile(secondaryPath, true);
updateFile(giftsPath, false);
