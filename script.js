(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EMAIL = $('#copyEmail')?.dataset.email || 'hello@udayallu.com';

  /* ---------- Marquee: duplicate content for a seamless loop ---------- */
  $$('.marquee-track, .voices-track').forEach(t => {
    const n = t.children.length;
    t.insertAdjacentHTML('beforeend', t.innerHTML);
    [...t.children].slice(n).forEach(el => { el.setAttribute('aria-hidden', 'true'); el.setAttribute('tabindex', '-1'); });
  });

  /* ---------- Toast ---------- */
  const toast = $('#toast');
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  };

  /* ---------- Theme ---------- */
  const toggleTheme = () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    $('meta[name="theme-color"]').setAttribute('content', next === 'light' ? '#f8f6f3' : '#121212');
  };
  $('#themeBtn').addEventListener('click', toggleTheme);

  /* ---------- Copy email ---------- */
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(EMAIL); showToast('Email copied to clipboard ✓'); }
    catch (e) { showToast(EMAIL); }
  };
  $('#copyEmail').addEventListener('click', copyEmail);

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('#menuBtn'), navLinks = $('#navLinks');
  const setMenu = (open) => { navLinks.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', open); };
  menuBtn.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
  $$('a', navLinks).forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ---------- Scroll: nav state, progress bar, active link, timeline ---------- */
  const nav = $('#nav');
  const sections = $$('main section[id]');
  const links = $$('.nav-links a');
  const timeline = $('#timeline');
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('scrolled', y > 20);
    root.style.setProperty('--p', h > 0 ? (y / h).toFixed(4) : 0);

    let current = '';
    sections.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * 0.4) current = s.id; });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));

    if (timeline) {
      const r = timeline.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
      timeline.style.setProperty('--tl', t.toFixed(3));
    }
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  // Stagger siblings
  $$('.reveal').forEach(el => {
    const sibs = $$(':scope > .reveal', el.parentElement);
    const i = sibs.indexOf(el);
    if (i > 0) el.style.setProperty('--d', (i * 0.08) + 's');
    io.observe(el);
  });

  /* ---------- Counters ---------- */
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count, dur = 1600, t0 = performance.now();
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(end * eased);
        if (k < 1) requestAnimationFrame(tick);
      };
      reduced ? (el.textContent = end) : requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$('[data-count]').forEach(el => countIO.observe(el));

  /* ---------- Rotating words in hero ---------- */
  // EDIT: the phrases that rotate in your intro line
  const words = ['retrieval-augmented generation', 'multimodal document AI', 'retrieval-aware chunking', 'reliable LLM systems'];
  const rot = $('#rotator');
  if (rot && !reduced) {
    let wi = 0, ci = words[0].length, deleting = true;
    const type = () => {
      const w = words[wi];
      if (deleting) {
        ci--;
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
      } else {
        ci++;
      }
      rot.textContent = words[wi].slice(0, ci) || '​';
      let delay = deleting ? 35 : 70;
      if (!deleting && ci === words[wi].length) { deleting = true; delay = 2200; }
      setTimeout(type, delay);
    };
    setTimeout(type, 2600);
  }

  /* ---------- Pointer effects: spotlight, card glow, parallax, tilt ---------- */
  const fine = matchMedia('(pointer: fine)').matches;
  if (fine && !reduced) {
    const shapes = $$('.shape');
    const portrait = $('.tilt');
    let raf;
    addEventListener('pointermove', (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        root.style.setProperty('--mx', e.clientX + 'px');
        root.style.setProperty('--my', e.clientY + 'px');
        const cx = e.clientX / innerWidth - 0.5, cy = e.clientY / innerHeight - 0.5;
        shapes.forEach(s => {
          const d = +s.dataset.depth || 20;
          s.style.transform = `translate(${cx * d}px, ${cy * d}px)`;
        });
        if (portrait) portrait.style.transform = `rotateY(${cx * 10}deg) rotateX(${-cy * 10}deg)`;
      });
    });
    $$('.spot').forEach(card => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--x', (e.clientX - r.left) + 'px');
        card.style.setProperty('--y', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- Research filters ---------- */
  $$('.filter').forEach(btn => btn.addEventListener('click', () => {
    $$('.filter').forEach(b => b.classList.toggle('active', b === btn));
    const f = btn.dataset.filter;
    $$('.work').forEach(w => {
      const show = f === 'all' || w.dataset.type === f;
      w.classList.toggle('hidden', !show);
      // only feature-span when showing all
      if (w.dataset.featured === undefined && w.classList.contains('featured')) w.dataset.featured = '1';
      if (w.dataset.featured) w.classList.toggle('featured', f === 'all');
      if (show) { w.classList.remove('in'); requestAnimationFrame(() => w.classList.add('in')); }
    });
  }));

  /* ---------- Contact form → opens email app ---------- */
  $('#contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(e.target);
    const subject = `Hello from ${d.get('name')}`;
    const body = `${d.get('message')}\n\n— ${d.get('name')} (${d.get('email')})`;
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showToast('Opening your email app…');
  });

  /* ---------- Footer: year + local time ---------- */
  $('#year').textContent = new Date().getFullYear();
  const lt = $('#localTime');
  // EDIT: your time zone, e.g. 'Asia/Kolkata', 'America/New_York'
  const TZ = 'Asia/Dubai';
  const updTime = () => {
    try {
      lt.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: TZ }) + ' local time';
    } catch (e) { lt.textContent = ''; }
  };
  updTime(); setInterval(updTime, 30000);

  /* ---------- Command palette (press K or ⌘K) ---------- */
  const cmd = $('#cmd'), input = $('#cmdInput'), list = $('#cmdList');
  const items = $$('li', list);
  let sel = 0;
  const visible = () => items.filter(li => !li.hidden);
  const highlight = () => { const v = visible(); v.forEach((li, i) => li.classList.toggle('sel', i === sel)); v[sel]?.scrollIntoView({ block: 'nearest' }); };
  const openCmd = () => { cmd.hidden = false; input.value = ''; items.forEach(li => li.hidden = false); sel = 0; highlight(); setTimeout(() => input.focus(), 10); };
  const closeCmd = () => { cmd.hidden = true; };
  const run = (li) => {
    if (!li) return;
    closeCmd();
    if (li.dataset.action === 'copy') copyEmail();
    else if (li.dataset.action === 'theme') toggleTheme();
    else if (li.dataset.href?.startsWith('#')) $(li.dataset.href)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    else if (li.dataset.href) location.href = li.dataset.href;
  };
  $('#cmdBtn').addEventListener('click', openCmd);
  $$('[data-close]', cmd).forEach(el => el.addEventListener('click', closeCmd));
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    items.forEach(li => li.hidden = !li.textContent.toLowerCase().includes(q));
    sel = 0; highlight();
  });
  items.forEach(li => {
    li.addEventListener('click', () => run(li));
    li.addEventListener('mousemove', () => { sel = visible().indexOf(li); highlight(); });
  });
  addEventListener('keydown', (e) => {
    const typing = /INPUT|TEXTAREA/.test(document.activeElement?.tagName);
    if (cmd.hidden) {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey || !typing)) { e.preventDefault(); openCmd(); }
      return;
    }
    const v = visible();
    if (e.key === 'Escape') closeCmd();
    else if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % v.length; highlight(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + v.length) % v.length; highlight(); }
    else if (e.key === 'Enter') { e.preventDefault(); run(v[sel]); }
  });
})();
