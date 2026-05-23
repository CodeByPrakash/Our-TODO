import { getStats, getProfiles } from '../db.js';
import { renderProgressBar } from '../components/ProgressBar.js';

export async function ProgressPage(container) {
  const stats = await getStats();
  const profiles = await getProfiles();
  const user1 = profiles.find(p => p.id === 'user1') || { name: 'ME', emoji: '🖤' };
  const user2 = profiles.find(p => p.id === 'user2') || { name: 'BAE', emoji: '❤️' };

  container.innerHTML = `
    <div class="anim-stagger">
      <!-- Together Score -->
      <div class="section-header">TOGETHER SCORE</div>
      <div style="padding: var(--sp-lg);">
        ${renderProgressBar(stats.percentage, 'accent')}
        <div style="text-align: center; margin-top: var(--sp-md); font-size: var(--fs-3xl); font-weight: var(--fw-black);">
          ${stats.percentage}<span style="font-size: var(--fs-lg); color: var(--color-text-muted);">%</span>
        </div>
        <div style="text-align: center; font-size: var(--fs-2xs); color: var(--color-text-muted); letter-spacing: 2px;">
          ${stats.completed} OF ${stats.total} TASKS COMPLETE
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-card__value stat-card__value--accent">${stats.streak}</div>
          <div class="stat-card__label">🔥 STREAK</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value stat-card__value--success">${stats.thisWeek.completed}</div>
          <div class="stat-card__label">THIS WEEK</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value">${stats.total}</div>
          <div class="stat-card__label">TOTAL TASKS</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value stat-card__value--love">${stats.completed}</div>
          <div class="stat-card__label">COMPLETED</div>
        </div>
      </div>

      <!-- Per-person breakdown -->
      <div class="section-header">${user1.emoji} ${user1.name}</div>
      <div style="padding: var(--sp-lg);">
        ${renderProgressBar(stats.mine.percentage)}
        <div style="font-size: var(--fs-2xs); color: var(--color-text-muted); margin-top: var(--sp-sm); letter-spacing: 1px;">
          ${stats.mine.completed}/${stats.mine.total} TASKS
        </div>
      </div>

      <div class="section-header">${user2.emoji} ${user2.name}</div>
      <div style="padding: var(--sp-lg);">
        ${renderProgressBar(stats.yours.percentage)}
        <div style="font-size: var(--fs-2xs); color: var(--color-text-muted); margin-top: var(--sp-sm); letter-spacing: 1px;">
          ${stats.yours.completed}/${stats.yours.total} TASKS
        </div>
      </div>

      <div class="section-header">💕 OURS</div>
      <div style="padding: var(--sp-lg);">
        ${renderProgressBar(stats.ours.percentage, 'accent')}
        <div style="font-size: var(--fs-2xs); color: var(--color-text-muted); margin-top: var(--sp-sm); letter-spacing: 1px;">
          ${stats.ours.completed}/${stats.ours.total} TASKS
        </div>
      </div>

      ${stats.total === 0 ? `
        <div class="empty-state">
          <div class="empty-state__icon">📊</div>
          <div class="empty-state__title">NO DATA YET</div>
          <div class="empty-state__desc">Add some tasks to see your progress here</div>
        </div>
      ` : ''}
    </div>
  `;
}
