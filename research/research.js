// Research page: reveal-on-scroll, streaming summaries, topic filters and card glow.
// Same behaviour as the home page, copied from script.js so this page works on its own.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
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

  /* ---------- Featured papers: stream the summary like an LLM ---------- */
  const tokenize = (text) => {
    // Rough LLM-style pieces: words, punctuation and spaces, long words split up
    const parts = text.match(/\s+|[A-Za-z]+|\d+|[^\sA-Za-z\d]/g) || [];
    const out = [];
    parts.forEach(p => {
      if (/^[A-Za-z]{8,}$/.test(p)) { for (let i = 0; i < p.length; i += 5) out.push(p.slice(i, i + 5)); }
      else out.push(p);
    });
    // merge leading spaces into the next token, like real tokenizers do
    const merged = [];
    out.forEach(t => { if (/^\s+$/.test(t) && merged.length) merged.push(t); else if (merged.length && /^\s+$/.test(merged[merged.length - 1])) merged[merged.length - 1] += t; else merged.push(t); });
    return merged;
  };
  $$('.gen').forEach(gen => {
    const cover = gen.closest('.cover');
    const textEl = $('.gen-text', gen);
    const tok = $('.gen-tok', cover);
    const count = $('b', tok);
    const tokens = tokenize(gen.dataset.gen);
    const finish = () => {
      textEl.textContent = gen.dataset.gen;
      count.textContent = tokens.length;
      gen.classList.add('done'); tok.classList.remove('running'); tok.classList.add('done');
    };
    if (reduced) { finish(); return; }
    const run = () => {
      tok.classList.add('running');
      let i = 0;
      const step = () => {
        if (i >= tokens.length) { finish(); return; }
        const burst = 1 + (Math.random() < 0.3 ? 1 : 0);
        for (let b = 0; b < burst && i < tokens.length; b++) textEl.textContent += tokens[i++];
        count.textContent = i;
        const pause = /[.,:]$/.test(tokens[i - 1]) ? 140 : 0;
        setTimeout(step, 28 + Math.random() * 45 + pause);
      };
      setTimeout(step, 450);
    };
    const genIO = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) { genIO.disconnect(); run(); }
    }, { threshold: 0.45 });
    genIO.observe(cover);
  });

  /* ---------- Card glow follows the pointer ---------- */
  if (matchMedia('(pointer: fine)').matches && !reduced) {
    $$('.spot').forEach(card => card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--x', (e.clientX - r.left) + 'px');
      card.style.setProperty('--y', (e.clientY - r.top) + 'px');
    }));
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
})();
