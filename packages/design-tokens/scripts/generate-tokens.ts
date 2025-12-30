import fs from 'fs';
import path from 'path';

// Import token files
import colors from '../src/colors.json';
import spacing from '../src/spacing.json';
import typography from '../src/typography.json';
import breakpoints from '../src/breakpoints.json';

// Ensure build directory exists
const buildDir = path.join(__dirname, '../build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Generate CSS custom properties
function generateCSS() {
  let css = ':root {\n';

  // Colors
  Object.entries(colors.color).forEach(([category, shades]) => {
    Object.entries(shades).forEach(([shade, value]) => {
      css += `  --color-${category}-${shade}: ${value};\n`;
    });
  });

  // Spacing
  Object.entries(spacing.spacing).forEach(([key, value]) => {
    css += `  --spacing-${key}: ${value};\n`;
  });

  // Typography
  Object.entries(typography).forEach(([category, values]) => {
    Object.entries(values).forEach(([key, value]) => {
      const cssValue = Array.isArray(value) ? value.join(', ') : value;
      css += `  --${category}-${key}: ${cssValue};\n`;
    });
  });

  // Breakpoints
  Object.entries(breakpoints.breakpoint).forEach(([key, value]) => {
    css += `  --breakpoint-${key}: ${value};\n`;
  });

  css += '}\n';

  fs.writeFileSync(path.join(buildDir, 'tokens.css'), css);
}

// Generate TypeScript constants
function generateTS() {
  const tokens = {
    colors: colors.color,
    spacing: spacing.spacing,
    typography: typography,
    breakpoints: breakpoints.breakpoint,
  };

  const ts = `export const tokens = ${JSON.stringify(tokens, null, 2)} as const;\n`;

  fs.writeFileSync(path.join(buildDir, 'tokens.ts'), ts);
}

generateCSS();
generateTS();
console.log('✅ Design tokens generated');
