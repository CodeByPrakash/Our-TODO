import { navigate, getCurrentRoute } from '../router.js';

const NAV_ITEMS = [
  { id: 'tasks', icon: '☐', label: 'Tasks' },
  { id: 'progress', icon: '▮', label: 'Stats' },
  { id: 'memories', icon: '◫', label: 'Memory' },
  { id: 'settings', icon: '⚙', label: 'Setup' },
];

export function renderNavBar() {
  const current = getCurrentRoute();
  return `
    <nav class="nav-bar" id="nav-bar">
      ${NAV_ITEMS.map(item => `
        <button
          class="nav-bar__item ${current === item.id ? 'nav-bar__item--active' : ''}"
          data-nav="${item.id}"
        >
          <span class="nav-bar__icon">${item.icon}</span>
          <span>${item.label}</span>
        </button>
      `).join('')}
    </nav>
  `;
}

export function mountNavBar() {
  const nav = document.getElementById('nav-bar');
  if (!nav) return;

  nav.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-nav]');
    if (!btn) return;
    const route = btn.dataset.nav;
    navigate(route);
  });
}

export function updateNavBar() {
  const current = getCurrentRoute();
  const items = document.querySelectorAll('[data-nav]');
  items.forEach(item => {
    item.classList.toggle('nav-bar__item--active', item.dataset.nav === current);
  });
}
