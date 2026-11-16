// Home page research slider: one paper at a time, with arrows, dots, keyboard and swipe.
// Auto-advances every 5 seconds while it is on screen. It pauses while the pointer is over it,
// while something inside it has keyboard focus, and when the tab is hidden.
// Visitors who prefer reduced motion get no auto-advance.
(() => {
  const track = document.getElementById('paperTrack');
  if (!track) return;
  const slider = track.parentElement;
  const slides = [...track.children];
  const prev = document.getElementById('paperPrev');
  const next = document.getElementById('paperNext');
  const count = document.getElementById('paperCount');
  const dots = document.getElementById('paperDots');
  const pad = n => String(n).padStart(2, '0');
  const INTERVAL = 5000;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i = 0;

  dots.innerHTML = slides.map((s, k) => {
    const t = s.querySelector('h3')?.textContent.split(':')[0].trim() || `Paper ${k + 1}`;
    return `<button type="button" aria-label="Paper ${k + 1}: ${t.replace(/"/g, '&quot;')}"><i></i></button>`;
  }).join('');
  dots.style.setProperty('--paper-interval', INTERVAL + 'ms');

  function go(n) {
    i = (n + slides.length) % slides.length;
    track.style.transform = `translateX(${-100 * i}%)`;
    slides.forEach((s, k) => { const on = k === i; s.setAttribute('aria-hidden', String(!on)); s.inert = !on; });
    [...dots.children].forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
    count.textContent = `${pad(i + 1)} / ${pad(slides.length)}`;
    restart();
  }

  /* ---------- autoplay ---------- */
  let timer = null, hovering = false, focused = false, onScreen = false;
  const canPlay = () => !reduced && onScreen && !hovering && !focused && !document.hidden;
  function restart() {
    clearTimeout(timer);
    const active = dots.children[i];
    // restart the progress fill on the active dot
    [...dots.children].forEach(d => d.classList.remove('run'));
    if (!canPlay()) { dots.classList.add('paused'); return; }
    dots.classList.remove('paused');
    void active.offsetWidth;
    active.classList.add('run');
    timer = setTimeout(() => go(i + 1), INTERVAL);
  }
  slider.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hovering = true; restart(); } });
  slider.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { hovering = false; restart(); } });
  slider.addEventListener('focusin', () => { focused = true; restart(); });
  slider.addEventListener('focusout', () => { focused = slider.contains(document.activeElement); restart(); });
  document.addEventListener('visibilitychange', restart);
  new IntersectionObserver(es => { onScreen = es[0].isIntersecting; restart(); }, { threshold: 0.35 }).observe(slider);

  prev.addEventListener('click', () => go(i - 1));
  next.addEventListener('click', () => go(i + 1));
  dots.addEventListener('click', e => { const b = e.target.closest('button'); if (b) go([...dots.children].indexOf(b)); });
  slider.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') go(i + 1);
    if (e.key === 'ArrowLeft') go(i - 1);
  });
  let x0 = null, y0 = null;
  track.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  track.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? i + 1 : i - 1);
  }, { passive: true });
  go(0);
})();
