const fs = require('fs');
const path = require('path');
const { translate } = require('google-translate-api-x');

const frPath = path.join(__dirname, '..', 'src', 'locales', 'fr.json');
const arPath = path.join(__dirname, '..', 'src', 'locales', 'ar.json');

async function main() {
  const fr = JSON.parse(fs.readFileSync(frPath, 'utf-8'));
  const ar = {};

  for (const [key, value] of Object.entries(fr)) {
    if (typeof value === 'string' && value.trim() !== '') {
      try {
        const res = await translate(value, { from: 'fr', to: 'ar' });
        ar[key] = res.text;
        console.log(`✅ ${key}: "${value}" → "${res.text}"`);
      } catch (err) {
        console.error(`❌ Erreur pour ${key}: "${value}"`, err.message);
        ar[key] = value; // fallback
      }
    } else {
      ar[key] = value;
    }
  }

  fs.writeFileSync(arPath, JSON.stringify(ar, null, 2), 'utf-8');
  console.log('\n🎉 Traduction terminée : ar.json mis à jour !');
}

main();