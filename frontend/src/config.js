// Runtime Configuration - loads from environment or localStorage
const getApiUrl = () => {
  // Try environment variable first (set during build)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Try localStorage (user can set it dynamically)
  const stored = localStorage.getItem('apiUrl');
  if (stored) {
    return stored;
  }

  // Development fallback
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000';
  }

  // Production fallback - assumes backend is same origin
  // This works when backend and frontend are on same domain
  return window.location.origin.replace(/:\d+$/, ':8000');
};

export const config = {
  apiUrl: getApiUrl(),
  setApiUrl: (url) => {
    localStorage.setItem('apiUrl', url);
    window.location.reload();
  }
};

export default config;
