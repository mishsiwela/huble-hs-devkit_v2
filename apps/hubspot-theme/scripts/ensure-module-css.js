#!/usr/bin/env node

/**
 * Ensure all HubSpot modules have module.css files
 *
 * This is CRITICAL for the HubSpot Module → React mapping to work correctly.
 * Without module.css, CSS custom properties (design tokens) won't load,
 * causing components to appear unstyled in HubSpot Design Manager.
 *
 * Architecture Principle:
 * - React components use Tailwind classes mapped to CSS custom properties
 * - HubL macros use BEM classes that reference CSS custom properties
 * - Both environments share the same design tokens via CSS custom properties
 * - module.css ensures tokens load automatically with each module
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modulesDir = path.join(__dirname, '../theme/modules');

/**
 * Determine which CSS files a module needs based on its content
 */
function determineRequiredCSS(moduleName, moduleHtmlContent) {
  const required = new Set(['tokens.css']); // All modules need tokens

  // Check module.html for component usage
  if (moduleHtmlContent.includes('components.Button')) {
    required.add('components.css'); // Button uses components.css
  }
  if (moduleHtmlContent.includes('components.Card') || moduleHtmlContent.includes('components.Hero')) {
    required.add('react-components.css'); // Card/Hero use react-components.css
  }

  // Hero modules also need button styles (CTAs)
  if (moduleName.includes('hero')) {
    required.add('components.css');
  }

  return Array.from(required).sort();
}

/**
 * Read CSS file content
 * For tokens.css, always read from the SOURCE OF TRUTH in design-tokens package
 */
function readCSSFile(cssFileName) {
  if (cssFileName === 'tokens.css') {
    // CRITICAL: Read from source of truth, not the copied file
    // This ensures we always have the latest design tokens
    const tokensSourcePath = path.join(__dirname, '../../../packages/design-tokens/build/tokens.css');
    if (fs.existsSync(tokensSourcePath)) {
      return fs.readFileSync(tokensSourcePath, 'utf-8');
    }
    console.warn('⚠️  Warning: Source tokens.css not found. Build design-tokens first: pnpm run build:tokens');
    return '';
  }

  const cssPath = path.join(__dirname, '../theme/css', cssFileName);
  if (fs.existsSync(cssPath)) {
    return fs.readFileSync(cssPath, 'utf-8');
  }
  return '';
}

/**
 * Generate module.css content with inlined CSS
 * Using @import causes ERR_BLOCKED_BY_ORB errors in HubSpot's CDN
 */
function generateModuleCSSContent(moduleName, requiredCSS) {
  const header = `/* ${moduleName} CSS - Auto-generated */
/* HubSpot's CDN blocks @import url() statements, so we inline the CSS directly */
/* This prevents ERR_BLOCKED_BY_ORB errors */

`;

  let content = header;

  // Inline each required CSS file
  requiredCSS.forEach((cssFile) => {
    const cssContent = readCSSFile(cssFile);
    if (cssContent) {
      const sectionName = cssFile.replace('.css', '').replace('-', ' ');
      content += `/* ========== ${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} ========== */\n`;
      content += cssContent.trim() + '\n\n';
    }
  });

  return content;
}

/**
 * Main execution
 */
function main() {
  console.log('🔧 Ensuring all modules have module.css files...\n');

  if (!fs.existsSync(modulesDir)) {
    console.error('❌ modules/ directory not found');
    process.exit(1);
  }

  const modules = fs.readdirSync(modulesDir).filter((f) => f.endsWith('.module'));

  if (modules.length === 0) {
    console.log('⚠️  No modules found\n');
    return;
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;

  modules.forEach((moduleName) => {
    const moduleDir = path.join(modulesDir, moduleName);
    const moduleCSSPath = path.join(moduleDir, 'module.css');
    const moduleHTMLPath = path.join(moduleDir, 'module.html');

    // Read module.html to determine required CSS
    let moduleHTMLContent = '';
    if (fs.existsSync(moduleHTMLPath)) {
      moduleHTMLContent = fs.readFileSync(moduleHTMLPath, 'utf-8');
    }

    const requiredCSS = determineRequiredCSS(moduleName, moduleHTMLContent);
    const newContent = generateModuleCSSContent(moduleName, requiredCSS);

    if (!fs.existsSync(moduleCSSPath)) {
      // Create new module.css
      fs.writeFileSync(moduleCSSPath, newContent);
      console.log(`✅ Created: ${moduleName}/module.css`);
      console.log(`   Imports: ${requiredCSS.join(', ')}\n`);
      created++;
    } else {
      // Check if existing module.css needs updating
      const existingContent = fs.readFileSync(moduleCSSPath, 'utf-8');

      // Check if all required CSS files are imported
      const missingImports = requiredCSS.filter(
        (cssFile) => !existingContent.includes(cssFile)
      );

      if (missingImports.length > 0) {
        fs.writeFileSync(moduleCSSPath, newContent);
        console.log(`🔄 Updated: ${moduleName}/module.css`);
        console.log(`   Added imports: ${missingImports.join(', ')}\n`);
        updated++;
      } else {
        console.log(`✓ OK: ${moduleName}/module.css`);
        skipped++;
      }
    }
  });

  console.log('\n📊 Summary:');
  console.log(`   Created: ${created}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   OK: ${skipped}`);
  console.log(`   Total modules: ${modules.length}\n`);

  if (created > 0 || updated > 0) {
    console.log('✨ Module CSS files ensured!\n');
    console.log('📤 Next steps:');
    console.log('   1. Upload theme: hs upload theme huble-devkit-theme');
    console.log('   2. Test module preview in HubSpot Design Manager\n');
  } else {
    console.log('✅ All modules already have correct module.css files\n');
  }
}

main();
