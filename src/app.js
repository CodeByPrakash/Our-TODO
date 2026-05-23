import { getProfiles } from './db.js';
import { registerRoute, onRoute, initRouter } from './router.js';
import { renderNavBar, mountNavBar, updateNavBar } from './components/NavBar.js';
import { TasksPage } from './pages/TasksPage.js';
import { ProgressPage } from './pages/ProgressPage.js';
import { MemoriesPage } from './pages/MemoriesPage.js';
import { SettingsPage } from './pages/SettingsPage.js';

export async function initApp() {
  const app = document.getElementById('app');
  const profiles = await getProfiles();
  const user1 = profiles.find(p => p.id === 'user1') || { name: 'ME', emoji: '🖤' };
  const user2 = profiles.find(p => p.id === 'user2') || { name: 'BAE', emoji: '❤️' };

  // Render app shell
  app.innerHTML = `
    <header class="app-header">
      <div class="app-header__logo">MINE<span>·</span>TIME</div>
      <div class="app-header__profiles">
        <div class="couple-header">
          <div class="profile-badge">${user1.emoji}</div>
          <span class="couple-heart">♥</span>
          <div class="profile-badge">${user2.emoji}</div>
        </div>
      </div>
    </header>
    <main class="app-main" id="page-container"></main>
    ${renderNavBar()}
  `;

  mountNavBar();

  const pageContainer = document.getElementById('page-container');

  // Register routes
  registerRoute('tasks', () => TasksPage(pageContainer));
  registerRoute('progress', () => ProgressPage(pageContainer));
  registerRoute('memories', () => MemoriesPage(pageContainer));
  registerRoute('settings', () => SettingsPage(pageContainer));

  // Update nav on route change
  onRoute(() => updateNavBar());

  // Start router
  initRouter('tasks');
}
