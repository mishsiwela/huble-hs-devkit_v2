import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { build } from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modulesDir = path.join(__dirname, '../theme/modules');
const modules = fs.readdirSync(modulesDir).filter((f) => f.endsWith('.module'));

async function buildModules() {
  for (const moduleName of modules) {
    const moduleDir = path.join(modulesDir, moduleName);
    const jsFile = path.join(moduleDir, 'module.js');

    if (fs.existsSync(jsFile)) {
      const fileContent = fs.readFileSync(jsFile, 'utf-8');

      // Skip build for static components (no imports)
      if (!fileContent.includes('import')) {
        console.log(`⏭️  Skipped ${moduleName} (static component)`);
        continue;
      }

      try {
        await build({
          entryPoints: [jsFile],
          bundle: true,
          outfile: path.join(moduleDir, 'module.bundle.js'),
          format: 'iife',
          target: 'es2020',
          minify: true,
          external: ['react', 'react-dom'], // These come from CDN or global bundle
          loader: { '.js': 'jsx' },
          jsx: 'automatic',
        });

        console.log(`✅ Built ${moduleName}`);
      } catch (error) {
        console.error(`❌ Failed to build ${moduleName}:`, error);
      }
    }
  }
}

buildModules();
