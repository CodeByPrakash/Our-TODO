import { getAllTasks, updateTask, deleteTask, addTask, getProfiles } from '../db.js';
import { renderTaskCard } from '../components/TaskCard.js';
import { renderTaskForm, mountTaskForm } from '../components/TaskForm.js';
import { openModal, closeModal } from '../components/Modal.js';
import { generateId } from '../utils/id.js';

let currentFilter = 'all';

export async function TasksPage(container) {
  const tasks = await getAllTasks();
  const profiles = await getProfiles();

  // Sort: incomplete first, then by priority desc, then by date
  const sorted = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.priority !== b.priority) return b.priority - a.priority;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const filtered = currentFilter === 'all'
    ? sorted
    : sorted.filter(t => t.assignee === currentFilter);

  const counts = {
    all: tasks.length,
    mine: tasks.filter(t => t.assignee === 'mine').length,
    yours: tasks.filter(t => t.assignee === 'yours').length,
    ours: tasks.filter(t => t.assignee === 'ours').length,
  };

  container.innerHTML = `
    <div class="filter-tabs">
      ${['all', 'mine', 'yours', 'ours'].map(f => `
        <button class="filter-tab ${currentFilter === f ? 'filter-tab--active' : ''}" data-filter="${f}">
          ${f.toUpperCase()} <span style="opacity:0.5">${counts[f]}</span>
        </button>
      `).join('')}
    </div>

    <div class="task-list anim-stagger" id="task-list">
      ${filtered.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state__icon">${currentFilter === 'all' ? '☐' : currentFilter === 'ours' ? '💕' : '📋'}</div>
          <div class="empty-state__title">NO TASKS YET</div>
          <div class="empty-state__desc">
            ${currentFilter === 'all'
              ? 'Tap + to add your first task together'
              : `No ${currentFilter.toUpperCase()} tasks. Add one!`
            }
          </div>
        </div>
      ` : filtered.map(task => renderTaskCard(task)).join('')}
    </div>

    <button class="fab" id="fab-add">+</button>
  `;

  // ─── EVENT HANDLERS ───────────────────────────
  // Filter tabs
  container.querySelectorAll('[data-filter]').forEach(tab => {
    tab.addEventListener('click', () => {
      currentFilter = tab.dataset.filter;
      TasksPage(container);
    });
  });

  // Task actions (delegated)
  const taskList = document.getElementById('task-list');
  taskList?.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const taskId = btn.dataset.taskId;

    if (action === 'toggle') {
      const task = await import('../db.js').then(m => m.getTask(taskId));
      if (task) {
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
        await updateTask(task);
        showToast(task.completed ? '✓ DONE!' : 'REOPENED');
        TasksPage(container);
      }
    }

    if (action === 'edit') {
      openEditModal(taskId, container);
    }

    if (action === 'delete') {
      if (confirm('Delete this task?')) {
        await deleteTask(taskId);
        showToast('✕ DELETED');
        TasksPage(container);
      }
    }

    if (action === 'photo') {
      const task = await import('../db.js').then(m => m.getTask(taskId));
      if (task?.photo) {
        openLightbox(task.photo);
      }
    }
  });

  // FAB
  document.getElementById('fab-add')?.addEventListener('click', () => {
    openAddModal(container);
  });
}

function openAddModal(container) {
  const formHtml = renderTaskForm();
  openModal('NEW TASK', formHtml, () => {
    mountTaskForm(async (data) => {
      const task = {
        id: generateId(),
        ...data,
        completed: false,
        completedAt: null,
        createdAt: new Date().toISOString(),
      };
      await addTask(task);
      closeModal();
      showToast('+ TASK ADDED');
      TasksPage(container);
    });
  });
}

async function openEditModal(taskId, container) {
  const { getTask } = await import('../db.js');
  const task = await getTask(taskId);
  if (!task) return;

  const formHtml = renderTaskForm(task);
  openModal('EDIT TASK', formHtml, () => {
    mountTaskForm(
      async (data) => {
        const updated = { ...task, ...data };
        await updateTask(updated);
        closeModal();
        showToast('✓ UPDATED');
        TasksPage(container);
      },
      async () => {
        await deleteTask(taskId);
        closeModal();
        showToast('✕ DELETED');
        TasksPage(container);
      },
      task.photo
    );
  });
}

function openLightbox(photoSrc) {
  const div = document.createElement('div');
  div.className = 'lightbox';
  div.innerHTML = `<img src="${photoSrc}" alt="Photo" />`;
  div.addEventListener('click', () => div.remove());
  document.body.appendChild(div);
}

function showToast(message) {
  // Remove existing toast
  document.querySelector('.toast')?.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2000);
}
