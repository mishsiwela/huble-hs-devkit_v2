import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const themeDir = path.join(__dirname, '../theme');
const modulesDir = path.join(themeDir, 'modules');
const errors = [];
const warnings = [];

console.log('🔍 Validating HubSpot theme...\n');

// Check theme structure
function checkThemeStructure() {
  const requiredDirs = ['modules', 'templates', 'css', 'js'];
  const requiredFiles = ['theme.json'];

  requiredDirs.forEach((dir) => {
    const dirPath = path.join(themeDir, dir);
    if (!fs.existsSync(dirPath)) {
      errors.push(`Missing required directory: ${dir}/`);
    }
  });

  requiredFiles.forEach((file) => {
    const filePath = path.join(themeDir, file);
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing required file: ${file}`);
    }
  });
}

// Check design tokens
function checkDesignTokens() {
  const tokensPath = path.join(themeDir, 'css/tokens.css');
  if (!fs.existsSync(tokensPath)) {
    errors.push('Missing tokens.css - run "pnpm run build:tokens" first');
  } else {
    const tokensContent = fs.readFileSync(tokensPath, 'utf-8');
    if (!tokensContent.includes(':root {')) {
      errors.push('tokens.css is invalid - missing :root declaration');
    }
  }
}

// Check modules
function checkModules() {
  if (!fs.existsSync(modulesDir)) {
    errors.push('modules/ directory does not exist');
    return;
  }

  const modules = fs.readdirSync(modulesDir).filter((f) => f.endsWith('.module'));

  if (modules.length === 0) {
    warnings.push('No modules found in theme/modules/');
  }

  modules.forEach((moduleName) => {
    const moduleDir = path.join(modulesDir, moduleName);
    const requiredFiles = ['fields.json', 'module.html', 'meta.json'];

    requiredFiles.forEach((file) => {
      const filePath = path.join(moduleDir, file);
      if (!fs.existsSync(filePath)) {
        errors.push(`${moduleName}: Missing ${file}`);
      }
    });

    // Check fields.json structure
    const fieldsPath = path.join(moduleDir, 'fields.json');
    if (fs.existsSync(fieldsPath)) {
      try {
        const fields = JSON.parse(fs.readFileSync(fieldsPath, 'utf-8'));
        if (!Array.isArray(fields)) {
          errors.push(`${moduleName}: fields.json must be an array`);
        }
      } catch (e) {
        errors.push(`${moduleName}: fields.json is not valid JSON`);
      }
    }

    // Check meta.json structure
    const metaPath = path.join(moduleDir, 'meta.json');
    if (fs.existsSync(metaPath)) {
      try {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
        if (!meta.label) {
          warnings.push(`${moduleName}: meta.json missing 'label' field`);
        }
        if (!meta.is_available_for_new_content) {
          warnings.push(
            `${moduleName}: meta.json has 'is_available_for_new_content' set to false`
          );
        }
      } catch (e) {
        errors.push(`${moduleName}: meta.json is not valid JSON`);
      }
    }

    // Check if module.js exists and is built
    const jsPath = path.join(moduleDir, 'module.js');
    const bundlePath = path.join(moduleDir, 'module.bundle.js');
    if (fs.existsSync(jsPath)) {
      const jsContent = fs.readFileSync(jsPath, 'utf-8');
      if (jsContent.includes('import') && !fs.existsSync(bundlePath)) {
        warnings.push(
          `${moduleName}: module.js has imports but module.bundle.js not found - run "pnpm run build:theme"`
        );
      }
    }
  });

  console.log(`✅ Found ${modules.length} module(s)\n`);
}

// Run all checks
checkThemeStructure();
checkDesignTokens();
checkModules();

// Report results
if (errors.length > 0) {
  console.log('❌ ERRORS:\n');
  errors.forEach((error) => console.log(`   - ${error}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  WARNINGS:\n');
  warnings.forEach((warning) => console.log(`   - ${warning}`));
  console.log('');
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All validation checks passed!');
  process.exit(0);
} else {
  console.log(
    `\n📊 Summary: ${errors.length} error(s), ${warnings.length} warning(s)\n`
  );
  process.exit(errors.length > 0 ? 1 : 0);
}
