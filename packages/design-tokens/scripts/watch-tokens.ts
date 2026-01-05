import chokidar from 'chokidar';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '../src');

console.log('👀 Watching design tokens for changes...\n');
console.log(`📂 Watching: ${srcDir}/**/*.json\n`);

// Initial build
console.log('🔨 Initial build...');
try {
  execSync('tsx scripts/generate-tokens.ts', {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
  });
  console.log('✅ Initial build complete\n');
} catch (error) {
  console.error('❌ Initial build failed:', error);
}

// Watch for changes
const watcher = chokidar.watch(`${srcDir}/**/*.json`, {
  ignoreInitial: true,
  persistent: true,
});

watcher.on('change', (filePath) => {
  const fileName = path.basename(filePath);
  console.log(`\n📝 Change detected: ${fileName}`);
  console.log('🔄 Regenerating tokens...');

  try {
    execSync('tsx scripts/generate-tokens.ts', {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
    });
    console.log('✅ Tokens regenerated successfully\n');
    console.log('👀 Watching for more changes...\n');
  } catch (error) {
    console.error('❌ Token generation failed:', error);
  }
});

watcher.on('error', (error) => {
  console.error('❌ Watcher error:', error);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Stopping token watcher...');
  watcher.close();
  process.exit(0);
});
