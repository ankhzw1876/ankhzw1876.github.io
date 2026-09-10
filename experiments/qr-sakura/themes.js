(() => {
  'use strict';
  // Three color studies of the existing garden, not new scenes or motion effects.
  // Display accents may be pale; QR ink remains darker on an independent light paper.
  const themes = {
    night: {
      name: '夜樱', scheme: 'dark',
      colors: { bg: '#191d2b', surface: '#242a3a', ink: '#eeedf2', muted: '#adb3c4', line: '#444b61', accent: '#e5adc6', 'accent-ink': '#30202a', selected: '#343448', error: '#f4a7b4' },
      palette: ['#ac6689', '#577e73', '#b7becd', '#73847f', '#eff0f6']
    },
    moon: {
      name: '月白', scheme: 'light',
      colors: { bg: '#edf1f5', surface: '#f8fafc', ink: '#343f56', muted: '#5b687b', line: '#c3cdd8', accent: '#586fa3', 'accent-ink': '#ffffff', selected: '#dce3ef', error: '#a33e54' },
      palette: ['#586fa3', '#477d7d', '#b7c5d7', '#66898b', '#f1f5fa']
    },
    spring: {
      name: '暖春', scheme: 'light',
      colors: { bg: '#f7eee4', surface: '#fff8f0', ink: '#554339', muted: '#7a604e', line: '#d4bfae', accent: '#a55a3d', 'accent-ink': '#ffffff', selected: '#ecd8c9', error: '#a23b4a' },
      palette: ['#b56b49', '#6c7950', '#c8b08e', '#8a9065', '#fcf2e4']
    }
  };
  const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const valid = key => Object.hasOwn(themes, key);
  const storageKey = 'xiahua:sakura:palette';
  const launchParams = new URLSearchParams(location.search);
  if (launchParams.get('embed') === '1') document.documentElement.dataset.embed = 'true';
  let current = 'night';
  const requested = launchParams.get('palette');
  if (valid(requested)) current = requested;
  else {
    try {
      const saved = localStorage.getItem(storageKey);
      if (valid(saved)) current = saved;
    } catch { /* Private or embedded contexts may block storage. */ }
  }
  function apply(key, persist = true) {
    if (!valid(key)) return false;
    current = key;
    const theme = themes[key], root = document.documentElement;
    root.dataset.palette = key;
    root.style.colorScheme = theme.scheme;
    for (const [token, value] of Object.entries(theme.colors)) root.style.setProperty(`--${token}`, value);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.colors.bg);
    if (persist) {
      try { localStorage.setItem(storageKey, key); } catch { /* The switch still works without persistence. */ }
    }
    return true;
  }
  window.SakuraThemes = {
    themes,
    get current() { return current; },
    get active() { return themes[current]; },
    get scene() { return { background: rgb(themes[current].colors.bg), palette: themes[current].palette.map(rgb), effect: 'calm' }; },
    apply
  };
  apply(current, false);
})();
