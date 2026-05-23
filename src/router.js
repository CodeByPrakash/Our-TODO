const routes = {};
let currentRoute = null;
let onRouteChange = null;

export function registerRoute(path, handler) {
  routes[path] = handler;
}

export function navigate(path) {
  window.location.hash = path;
}

export function getCurrentRoute() {
  return window.location.hash.slice(1) || 'tasks';
}

export function onRoute(callback) {
  onRouteChange = callback;
}

export function initRouter(defaultRoute = 'tasks') {
  const handleRoute = () => {
    const path = getCurrentRoute();
    if (routes[path]) {
      currentRoute = path;
      routes[path]();
      if (onRouteChange) onRouteChange(path);
    } else {
      navigate(defaultRoute);
    }
  };

  window.addEventListener('hashchange', handleRoute);

  // Initial route
  if (!window.location.hash) {
    window.location.hash = defaultRoute;
  } else {
    handleRoute();
  }
}
