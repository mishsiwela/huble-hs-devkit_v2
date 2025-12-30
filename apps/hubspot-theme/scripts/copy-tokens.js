import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tokensCSS = path.join(__dirname, '../../../packages/design-tokens/build/tokens.css');
const destination = path.join(__dirname, '../theme/css/tokens.css');

// Ensure destination directory exists
const destDir = path.dirname(destination);
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(tokensCSS, destination);
console.log('✅ Copied design tokens to theme/css/');
