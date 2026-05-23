import { openDB } from 'idb';

const DB_NAME = 'minetime';
const DB_VERSION = 1;

let db;

export async function initDB() {
  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(database) {
      if (!database.objectStoreNames.contains('tasks')) {
        const store = database.createObjectStore('tasks', { keyPath: 'id' });
        store.createIndex('assignee', 'assignee', { unique: false });
        store.createIndex('completed', 'completed', { unique: false });
      }
      if (!database.objectStoreNames.contains('profiles')) {
        database.createObjectStore('profiles', { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains('settings')) {
        database.createObjectStore('settings', { keyPath: 'key' });
      }
    },
  });

  // Initialize default profiles
  const profiles = await db.getAll('profiles');
  if (profiles.length === 0) {
    await db.put('profiles', { id: 'user1', name: 'ME', emoji: '🖤' });
    await db.put('profiles', { id: 'user2', name: 'BAE', emoji: '❤️' });
  }

  return db;
}

// ─── TASKS ───────────────────────────────────────
export async function getAllTasks() {
  return db.getAll('tasks');
}

export async function getTask(id) {
  return db.get('tasks', id);
}

export async function addTask(task) {
  return db.add('tasks', task);
}

export async function updateTask(task) {
  return db.put('tasks', task);
}

export async function deleteTask(id) {
  return db.delete('tasks', id);
}

// ─── PROFILES ────────────────────────────────────
export async function getProfiles() {
  return db.getAll('profiles');
}

export async function updateProfile(profile) {
  return db.put('profiles', profile);
}

// ─── SETTINGS ────────────────────────────────────
export async function getSetting(key) {
  const result = await db.get('settings', key);
  return result?.value;
}

export async function setSetting(key, value) {
  return db.put('settings', { key, value });
}

// ─── STATS ───────────────────────────────────────
export async function getStats() {
  const tasks = await getAllTasks();
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;

  const byAssignee = (assignee) => {
    const group = tasks.filter(t => t.assignee === assignee);
    const done = group.filter(t => t.completed).length;
    return {
      total: group.length,
      completed: done,
      percentage: group.length > 0 ? Math.round((done / group.length) * 100) : 0,
    };
  };

  // Calculate streak
  const completedTasks = tasks
    .filter(t => t.completed && t.completedAt)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

  let streak = 0;
  if (completedTasks.length > 0) {
    const checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);

    // Allow today to not have completions yet
    const todayStr = checkDate.toISOString().split('T')[0];
    const hasToday = completedTasks.some(t =>
      new Date(t.completedAt).toISOString().split('T')[0] === todayStr
    );

    if (!hasToday) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasTasks = completedTasks.some(t =>
        new Date(t.completedAt).toISOString().split('T')[0] === dateStr
      );
      if (hasTasks) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // This week stats
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const weekTasks = tasks.filter(t => new Date(t.createdAt) >= startOfWeek);

  return {
    total,
    completed,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    mine: byAssignee('mine'),
    yours: byAssignee('yours'),
    ours: byAssignee('ours'),
    streak,
    thisWeek: {
      total: weekTasks.length,
      completed: weekTasks.filter(t => t.completed).length,
    },
  };
}
