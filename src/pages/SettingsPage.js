import { getProfiles, updateProfile, getAllTasks } from '../db.js';
import { openModal, closeModal } from '../components/Modal.js';

export async function SettingsPage(container) {
  const profiles = await getProfiles();
  const tasks = await getAllTasks();
  const user1 = profiles.find(p => p.id === 'user1') || { id: 'user1', name: 'ME', emoji: '🖤' };
  const user2 = profiles.find(p => p.id === 'user2') || { id: 'user2', name: 'BAE', emoji: '❤️' };

  container.innerHTML = `
    <div class="anim-stagger">
      <div class="section-header">PROFILES</div>

      <div class="settings-item" data-edit-profile="user1">
        <span class="settings-item__icon">${user1.emoji}</span>
        <span class="settings-item__label">${user1.name}</span>
        <span class="settings-item__value">EDIT →</span>
      </div>

      <div class="settings-item" data-edit-profile="user2">
        <span class="settings-item__icon">${user2.emoji}</span>
        <span class="settings-item__label">${user2.name}</span>
        <span class="settings-item__value">EDIT →</span>
      </div>

      <div class="section-header">DATA</div>

      <div class="settings-item" id="export-data">
        <span class="settings-item__icon">↓</span>
        <span class="settings-item__label">EXPORT DATA</span>
        <span class="settings-item__value">${tasks.length} TASKS</span>
      </div>

      <div class="settings-item" id="clear-completed">
        <span class="settings-item__icon">🗑</span>
        <span class="settings-item__label">CLEAR COMPLETED</span>
        <span class="settings-item__value">${tasks.filter(t => t.completed).length} DONE</span>
      </div>

      <div class="section-header">APP</div>

      <div class="settings-item" id="install-pwa" style="display:none">
        <span class="settings-item__icon">📱</span>
        <span class="settings-item__label">INSTALL APP</span>
        <span class="settings-item__value">ADD TO HOME</span>
      </div>

      <div style="padding: var(--sp-3xl) var(--sp-lg); text-align: center;">
        <div style="font-size: var(--fs-lg); font-weight: var(--fw-black); letter-spacing: 3px;">MINE·TIME</div>
        <div style="font-size: var(--fs-2xs); color: var(--color-text-muted); margin-top: var(--sp-sm); letter-spacing: 1px;">
          V1.0.0 — MADE WITH ❤️
        </div>
        <div style="font-size: var(--fs-2xs); color: var(--color-text-dim); margin-top: var(--sp-xs);">
          BRUTALIST TODO FOR COUPLES
        </div>
      </div>
    </div>
  `;

  // Edit profile
  container.querySelectorAll('[data-edit-profile]').forEach(item => {
    item.addEventListener('click', () => {
      const profileId = item.dataset.editProfile;
      const profile = profiles.find(p => p.id === profileId);
      openProfileEditor(profile, container);
    });
  });

  // Export data
  document.getElementById('export-data')?.addEventListener('click', () => {
    const data = JSON.stringify(tasks, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minetime-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Clear completed
  document.getElementById('clear-completed')?.addEventListener('click', async () => {
    const completed = tasks.filter(t => t.completed);
    if (completed.length === 0) return;
    if (!confirm(`Delete ${completed.length} completed tasks?`)) return;

    const { deleteTask } = await import('../db.js');
    for (const task of completed) {
      await deleteTask(task.id);
    }
    SettingsPage(container);
  });

  // PWA install
  if (window.deferredPrompt) {
    const installBtn = document.getElementById('install-pwa');
    if (installBtn) {
      installBtn.style.display = '';
      installBtn.addEventListener('click', async () => {
        window.deferredPrompt.prompt();
        const { outcome } = await window.deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          window.deferredPrompt = null;
          installBtn.style.display = 'none';
        }
      });
    }
  }
}

function openProfileEditor(profile, pageContainer) {
  const EMOJIS = ['🖤', '❤️', '💜', '💙', '💚', '🤍', '🧡', '💛', '🩷', '🩵', '🤎', '💖'];

  const formHtml = `
    <form id="profile-form">
      <div class="form-group">
        <label class="form-label">NAME</label>
        <input type="text" class="form-input" id="profile-name" value="${profile.name}" maxlength="10" required />
      </div>
      <div class="form-group">
        <label class="form-label">EMOJI</label>
        <div class="radio-group" style="flex-wrap: wrap;" id="emoji-group">
          ${EMOJIS.map(e => `
            <button type="button" class="radio-option ${e === profile.emoji ? 'radio-option--active' : ''}" data-value="${e}" style="flex: 0 0 auto; padding: var(--sp-md);">
              ${e}
            </button>
          `).join('')}
        </div>
      </div>
      <button type="submit" class="btn-submit">✓ SAVE</button>
    </form>
  `;

  openModal('EDIT PROFILE', formHtml, () => {
    let selectedEmoji = profile.emoji;

    document.getElementById('emoji-group')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.radio-option');
      if (!btn) return;
      document.querySelectorAll('#emoji-group .radio-option').forEach(b => b.classList.remove('radio-option--active'));
      btn.classList.add('radio-option--active');
      selectedEmoji = btn.dataset.value;
    });

    document.getElementById('profile-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('profile-name').value.trim().toUpperCase();
      if (!name) return;

      await updateProfile({ ...profile, name, emoji: selectedEmoji });
      closeModal();
      SettingsPage(pageContainer);
    });
  });
}
