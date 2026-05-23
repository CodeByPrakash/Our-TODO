import { initDB } from './db.js';
import { initApp } from './app.js';

// PWA install prompt
window.deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
});

// Initialize
async function boot() {
  try {
    await initDB();
    await initApp();
    console.log('[MINE·TIME] App initialized');
  } catch (err) {
    console.error('[MINE·TIME] Boot failed:', err);
    document.getElementById('app').innerHTML = `
      <div style="padding: 32px; font-family: monospace; color: #FF2D2D;">
        <h1>ERROR</h1>
        <p>${err.message}</p>
      </div>
    `;
  }
}

boot();
