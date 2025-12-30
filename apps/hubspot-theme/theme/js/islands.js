/**
 * Global Islands Hydration System
 * Loads React/ReactDOM globally and manages island hydration
 */

// Wait for React and ReactDOM to be available from CDN
function waitForReact() {
  return new Promise((resolve) => {
    if (window.React && window.ReactDOM) {
      resolve();
    } else {
      const checkInterval = setInterval(() => {
        if (window.React && window.ReactDOM) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 50);
    }
  });
}

// Initialize islands hydration system
async function initIslands() {
  await waitForReact();

  // Island components will register themselves when their scripts load
  console.log('✅ Islands hydration system ready');
}

// Start the hydration system
initIslands();
