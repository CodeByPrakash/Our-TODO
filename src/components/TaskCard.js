import { formatDueDate, isOverdue } from '../utils/date.js';

export function renderTaskCard(task) {
  const priorityMarks = '!'.repeat(task.priority || 1);
  const assigneeLabels = { mine: 'MINE', yours: 'YOURS', ours: 'OURS' };
  const dueText = formatDueDate(task.dueDate);
  const overdue = isOverdue(task.dueDate) && !task.completed;

  return `
    <div class="task-card ${task.completed ? 'task-card--done' : ''}" data-task-id="${task.id}">
      <div class="task-card__header">
        <span class="task-card__priority priority--${task.priority}">${priorityMarks}</span>
        <span>${assigneeLabels[task.assignee] || 'MINE'}</span>
      </div>
      <div class="task-card__body">
        <button class="task-card__check ${task.completed ? 'task-card__check--done' : ''}" data-action="toggle" data-task-id="${task.id}">
          ${task.completed ? '✓' : ''}
        </button>
        <div class="task-card__content">
          <h3 class="task-card__title">${escapeHtml(task.title)}</h3>
          ${task.description ? `<p class="task-card__desc">${escapeHtml(task.description)}</p>` : ''}
        </div>
      </div>
      ${task.photo ? `
        <div class="task-card__photo" data-action="photo" data-task-id="${task.id}">
          <img src="${task.photo}" alt="Task photo" loading="lazy" />
        </div>
      ` : ''}
      ${dueText ? `
        <div class="task-card__footer">
          <span class="task-card__due ${overdue ? 'task-card__due--overdue' : ''}">${overdue ? '⚠ ' : ''}${dueText}</span>
          ${task.completedAt ? `<span>DONE ✓</span>` : ''}
        </div>
      ` : ''}
      <div class="task-card__actions">
        <button data-action="edit" data-task-id="${task.id}">✎ EDIT</button>
        <button class="btn-danger" data-action="delete" data-task-id="${task.id}">✕ DELETE</button>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
