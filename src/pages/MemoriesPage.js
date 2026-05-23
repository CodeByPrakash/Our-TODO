import { getAllTasks } from '../db.js';
import { getRelativeTime } from '../utils/date.js';

export async function MemoriesPage(container) {
  const tasks = await getAllTasks();
  const memories = tasks
    .filter(t => t.completed)
    .sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt));

  const withPhotos = memories.filter(t => t.photo);
  const milestones = getMilestones(memories.length);

  container.innerHTML = `
    <div class="anim-stagger">
      <div class="section-header">
        MEMORIES — ${memories.length} COMPLETED
      </div>

      ${milestones.length > 0 ? `
        <div style="padding: var(--sp-md) var(--sp-lg); border-bottom: var(--border-muted);">
          ${milestones.map(m => `
            <span style="display: inline-block; padding: var(--sp-xs) var(--sp-sm); border: var(--border-accent); font-size: var(--fs-2xs); letter-spacing: 1px; margin-right: var(--sp-sm); margin-bottom: var(--sp-xs); color: var(--color-accent);">
              ${m}
            </span>
          `).join('')}
        </div>
      ` : ''}

      ${memories.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state__icon">🖼</div>
          <div class="empty-state__title">NO MEMORIES YET</div>
          <div class="empty-state__desc">Complete tasks to build your memory wall together</div>
        </div>
      ` : `
        <div class="memories-grid">
          ${memories.map(task => {
            if (task.photo) {
              return `
                <div class="memory-card" data-memory-photo="${task.photo.substring(0, 50)}">
                  <img src="${task.photo}" alt="${escapeAttr(task.title)}" loading="lazy" />
                  <div class="memory-card__overlay">
                    ${escapeHtml(task.title)}<br/>
                    <span style="opacity: 0.6">${getRelativeTime(task.completedAt)}</span>
                  </div>
                </div>
              `;
            }
            return `
              <div class="memory-card memory-card--text">
                <div>
                  <div>✓ ${escapeHtml(task.title)}</div>
                  <div style="font-size: var(--fs-2xs); color: var(--color-text-muted); margin-top: var(--sp-xs);">
                    ${getRelativeTime(task.completedAt)}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    </div>
  `;

  // Lightbox for photo memories
  container.querySelectorAll('.memory-card:not(.memory-card--text)').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (!img) return;
      const div = document.createElement('div');
      div.className = 'lightbox';
      div.innerHTML = `<img src="${img.src}" alt="Memory" />`;
      div.addEventListener('click', () => div.remove());
      document.body.appendChild(div);
    });
  });
}

function getMilestones(count) {
  const milestones = [];
  const thresholds = [1, 5, 10, 25, 50, 100, 200, 500];
  thresholds.forEach(t => {
    if (count >= t) milestones.push(`🏆 ${t} TASKS`);
  });
  return milestones;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/"/g, '&quot;');
}
