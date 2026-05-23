export function formatDueDate(dateStr) {
  if (!dateStr) return '';
  const due = new Date(dateStr);
  const now = new Date();
  const diff = due - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (diff < 0) {
    const absDays = Math.abs(days);
    return absDays === 0 ? 'OVERDUE TODAY' : `OVERDUE ${absDays}D`;
  }
  if (days === 0) return `${hours}H LEFT`;
  if (days === 1) return `1D ${hours}H`;
  return `${days}D LEFT`;
}

export function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function getToday() {
  return new Date().toISOString().split('T')[0];
}

export function getRelativeTime(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'JUST NOW';
  if (mins < 60) return `${mins}M AGO`;
  if (hours < 24) return `${hours}H AGO`;
  if (days < 7) return `${days}D AGO`;
  return formatDate(dateStr);
}
