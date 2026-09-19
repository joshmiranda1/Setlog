import { useCallback, useEffect, useState } from 'react';

const KEY = 'setlog.theme';
const media = () => window.matchMedia('(prefers-color-scheme: dark)');

function savedTheme() {
  try {
    const t = localStorage.getItem(KEY);
    return t === 'light' || t === 'dark' ? t : null;
  } catch {
    return null;
  }
}

const systemTheme = () => (media().matches ? 'dark' : 'light');

function syncThemeColor() {
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg || '#ffffff');
}

/** Light/dark theme. Follows the system until the user picks one; the choice is remembered. */
export function useTheme() {
  const [theme, setThemeState] = useState(() => savedTheme() ?? systemTheme());

  useEffect(() => {
    syncThemeColor();
    // Track system changes only while the user hasn't chosen.
    const m = media();
    const onChange = () => {
      if (!savedTheme()) {
        setThemeState(systemTheme());
        requestAnimationFrame(syncThemeColor);
      }
    };
    m.addEventListener('change', onChange);
    return () => m.removeEventListener('change', onChange);
  }, []);

  const setTheme = useCallback((next) => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage unavailable: the choice lasts until reload */
    }
    setThemeState(next);
    syncThemeColor();
  }, []);

  return [theme, setTheme];
}
