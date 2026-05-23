import { getToday } from '../utils/date.js';

export function renderTaskForm(task = null) {
  const isEdit = !!task;
  const title = task?.title || '';
  const description = task?.description || '';
  const assignee = task?.assignee || 'mine';
  const priority = task?.priority || 2;
  const dueDate = task?.dueDate || '';
  const photo = task?.photo || '';

  return `
    <form id="task-form" class="task-form">
      <div class="form-group">
        <label class="form-label">WHAT NEEDS DOING?</label>
        <input
          type="text"
          class="form-input"
          id="task-title"
          value="${escapeAttr(title)}"
          placeholder="Enter task..."
          required
          autocomplete="off"
        />
      </div>

      <div class="form-group">
        <label class="form-label">DETAILS (OPTIONAL)</label>
        <textarea
          class="form-input form-textarea"
          id="task-description"
          placeholder="Add notes..."
        >${escapeAttr(description)}</textarea>
      </div>

      <div class="form-group">
        <label class="form-label">WHO'S ON IT?</label>
        <div class="radio-group" id="assignee-group">
          <button type="button" class="radio-option ${assignee === 'mine' ? 'radio-option--active' : ''}" data-value="mine">🖤 MINE</button>
          <button type="button" class="radio-option ${assignee === 'yours' ? 'radio-option--active' : ''}" data-value="yours">❤️ YOURS</button>
          <button type="button" class="radio-option ${assignee === 'ours' ? 'radio-option--active' : ''}" data-value="ours">💕 OURS</button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">PRIORITY</label>
        <div class="radio-group" id="priority-group">
          <button type="button" class="radio-option ${priority === 1 ? 'radio-option--active' : ''}" data-value="1">! LOW</button>
          <button type="button" class="radio-option ${priority === 2 ? 'radio-option--active' : ''}" data-value="2">!! MED</button>
          <button type="button" class="radio-option ${priority === 3 ? 'radio-option--active' : ''}" data-value="3">!!! HIGH</button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">DUE DATE</label>
        <input
          type="date"
          class="form-input"
          id="task-due"
          value="${dueDate}"
          min="${getToday()}"
        />
      </div>

      <div class="form-group">
        <label class="form-label">PHOTO</label>
        <input type="file" id="photo-input" accept="image/*" capture="environment" style="display:none" />
        <div id="photo-area">
          ${photo ? `
            <div class="photo-preview">
              <img src="${photo}" alt="Preview" />
              <button type="button" class="photo-preview__remove" id="photo-remove">✕</button>
            </div>
          ` : `
            <div class="photo-picker" id="photo-picker">
              <div class="photo-picker__icon">📷</div>
              <div class="photo-picker__text">TAP TO ADD PHOTO</div>
            </div>
          `}
        </div>
      </div>

      <button type="submit" class="btn-submit">
        ${isEdit ? '✓ UPDATE TASK' : '+ ADD TASK'}
      </button>

      ${isEdit ? `<button type="button" class="btn-delete" id="task-delete">✕ DELETE THIS TASK</button>` : ''}
    </form>
  `;
}

export function mountTaskForm(onSubmit, onDelete, existingPhoto) {
  const form = document.getElementById('task-form');
  if (!form) return;

  let selectedAssignee = document.querySelector('#assignee-group .radio-option--active')?.dataset.value || 'mine';
  let selectedPriority = parseInt(document.querySelector('#priority-group .radio-option--active')?.dataset.value || '2');
  let photoData = existingPhoto || '';

  // Radio groups
  const setupRadio = (groupId, callback) => {
    const group = document.getElementById(groupId);
    if (!group) return;
    group.addEventListener('click', (e) => {
      const btn = e.target.closest('.radio-option');
      if (!btn) return;
      group.querySelectorAll('.radio-option').forEach(b => b.classList.remove('radio-option--active'));
      btn.classList.add('radio-option--active');
      callback(btn.dataset.value);
    });
  };

  setupRadio('assignee-group', (val) => { selectedAssignee = val; });
  setupRadio('priority-group', (val) => { selectedPriority = parseInt(val); });

  // Photo picker
  const photoInput = document.getElementById('photo-input');
  const photoPicker = document.getElementById('photo-picker');
  const photoArea = document.getElementById('photo-area');

  if (photoPicker) {
    photoPicker.addEventListener('click', () => photoInput.click());
  }

  photoInput?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const { compressImage } = await import('../utils/photo.js');
    photoData = await compressImage(file);

    photoArea.innerHTML = `
      <div class="photo-preview">
        <img src="${photoData}" alt="Preview" />
        <button type="button" class="photo-preview__remove" id="photo-remove">✕</button>
      </div>
    `;

    document.getElementById('photo-remove')?.addEventListener('click', () => {
      photoData = '';
      photoArea.innerHTML = `
        <div class="photo-picker" id="photo-picker">
          <div class="photo-picker__icon">📷</div>
          <div class="photo-picker__text">TAP TO ADD PHOTO</div>
        </div>
      `;
      document.getElementById('photo-picker')?.addEventListener('click', () => photoInput.click());
    });
  });

  // Existing photo remove
  document.getElementById('photo-remove')?.addEventListener('click', () => {
    photoData = '';
    photoArea.innerHTML = `
      <div class="photo-picker" id="photo-picker">
        <div class="photo-picker__icon">📷</div>
        <div class="photo-picker__text">TAP TO ADD PHOTO</div>
      </div>
    `;
    document.getElementById('photo-picker')?.addEventListener('click', () => photoInput.click());
  });

  // Form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title').value.trim();
    if (!title) return;

    onSubmit({
      title,
      description: document.getElementById('task-description').value.trim(),
      assignee: selectedAssignee,
      priority: selectedPriority,
      dueDate: document.getElementById('task-due').value || null,
      photo: photoData,
    });
  });

  // Delete button
  document.getElementById('task-delete')?.addEventListener('click', () => {
    if (onDelete) onDelete();
  });
}

function escapeAttr(str) {
  return str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
