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
          // Bundle UI components, but external React/ReactDOM (loaded globally)
          external: ['react', 'react-dom'],
          loader: { '.js': 'jsx' },
          jsx: 'automatic',
          // Map workspace packages to their built versions
          alias: {
            '@huble/ui': path.resolve(__dirname, '../../../packages/ui/dist/index.js'),
          },
        });

        console.log(`✅ Built ${moduleName}`);
      } catch (error) {
        console.error(`❌ Failed to build ${moduleName}:`, error);
      }
    }
  }
}

buildModules();
