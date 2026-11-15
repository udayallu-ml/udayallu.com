// Theme toggle for the Posts pages (shares the saved choice with the home page).
(() => {
  const root = document.documentElement, btn = document.getElementById('pTheme');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'light' ? '#f8f6f3' : '#121212');
  });
})();
