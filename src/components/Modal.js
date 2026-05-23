export function renderModal(title, bodyHtml) {
  return `
    <div class="modal-overlay" id="modal-overlay">
      <div class="modal" id="modal">
        <div class="modal__header">
          <h2 class="modal__title">${title}</h2>
          <button class="modal__close" id="modal-close">✕</button>
        </div>
        <div class="modal__body">
          ${bodyHtml}
        </div>
      </div>
    </div>
  `;
}

export function openModal(title, bodyHtml, onMount) {
  // Remove existing
  closeModal();

  const div = document.createElement('div');
  div.id = 'modal-container';
  div.innerHTML = renderModal(title, bodyHtml);
  document.body.appendChild(div);

  // Close handlers
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') closeModal();
  });

  // Prevent body scroll
  document.body.style.overflow = 'hidden';

  // Custom mount logic
  if (onMount) onMount();
}

export function closeModal() {
  const container = document.getElementById('modal-container');
  if (container) {
    container.remove();
    document.body.style.overflow = '';
  }
}
