export function renderProgressBar(percentage, variant = '') {
  const fillClass = variant ? `progress-bar__fill--${variant}` : '';
  return `
    <div class="progress-bar">
      <div class="progress-bar__fill ${fillClass}" style="width: ${percentage}%"></div>
      <span class="progress-bar__label">${percentage}%</span>
    </div>
  `;
}
