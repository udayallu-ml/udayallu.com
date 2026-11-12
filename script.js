(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EMAIL = $('#copyEmail')?.dataset.email || 'udayallu2010@gmail.com';

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

  /* ---------- Dock magnification (macOS style) ---------- */
  const dock = $('#dock');
  const dockItems = $$('.dock-item', dock);
  if (dock && matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const RANGE = 130, MAX = 0.55;
    dock.addEventListener('mousemove', (e) => {
      dockItems.forEach(el => {
        const r = el.getBoundingClientRect();
        const d = Math.abs(e.clientX - (r.left + r.width / 2));
        const t = Math.max(0, 1 - d / RANGE);
        el.style.setProperty('--s', (1 + MAX * Math.cos((1 - t) * Math.PI / 2) ** 2 * (t > 0)).toFixed(3));
      });
    });
    dock.addEventListener('mouseleave', () => dockItems.forEach(el => el.style.setProperty('--s', 1)));
  }

  /* ---------- Scroll: active dock item, timeline ---------- */
  const sections = $$('main section[id]');
  const links = $$('.dock-item[href]:not(.dock-logo)');
  const timeline = $('#timeline');
  const onScroll = () => {

    let current = '';
    sections.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * 0.4) current = s.id; });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + (current || 'top')));

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

  /* ---------- Sunrise on the portrait: tap to toggle on touch screens ---------- */
  const sunPortrait = $('#portrait');
  const sunWord = $('#sunWord');
  const SUN_WORDS = ['the rising sun', 'उगता हुआ सूरज', 'ఉదయించే సూర్యుడు'];
  let sunTimer = null, sunIdx = 0;
  const setSunWord = (i) => {
    sunWord.classList.add('out');
    setTimeout(() => {
      sunWord.textContent = SUN_WORDS[i];
      sunWord.classList.remove('out'); sunWord.classList.add('pre');
      void sunWord.offsetWidth;
      sunWord.classList.remove('pre');
    }, 300);
  };
  const startSun = () => {
    if (!sunWord || sunTimer) return;
    sunTimer = setInterval(() => { sunIdx = (sunIdx + 1) % SUN_WORDS.length; setSunWord(sunIdx); }, 1800);
  };
  const stopSun = () => {
    clearInterval(sunTimer); sunTimer = null; sunIdx = 0;
    if (sunWord) setTimeout(() => { if (!sunTimer) sunWord.textContent = SUN_WORDS[0]; }, 500);
  };
  if (sunPortrait) {
    if (matchMedia('(hover: hover)').matches) {
      sunPortrait.addEventListener('mouseenter', startSun);
      sunPortrait.addEventListener('mouseleave', stopSun);
    } else {
      sunPortrait.addEventListener('click', () => {
        const on = sunPortrait.classList.toggle('sunrise');
        on ? startSun() : stopSun();
      });
    }
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

  /* ---------- Travel: world map + gallery ---------- */
  // EDIT: countries visited. id = ISO 3166 numeric code used by the map; lat/lon = where the pin goes.
  const VISITED = [
    { code: 'IN', id: '356', name: 'India',                flag: '🇮🇳', lat: 21.0, lon: 78.9 },
    { code: 'MV', id: '462', name: 'Maldives',             flag: '🇲🇻', lat: 3.2,  lon: 73.2 },
    { code: 'TH', id: '764', name: 'Thailand',             flag: '🇹🇭', lat: 15.4, lon: 101.0 },
    { code: 'ID', id: '360', name: 'Indonesia',            flag: '🇮🇩', lat: -2.2, lon: 117.5 },
    { code: 'OM', id: '512', name: 'Oman',                 flag: '🇴🇲', lat: 21.0, lon: 57.0 },
    { code: 'MY', id: '458', name: 'Malaysia',             flag: '🇲🇾', lat: 3.6,  lon: 102.3 },
    { code: 'AE', id: '784', name: 'United Arab Emirates', flag: '🇦🇪', lat: 24.2, lon: 54.4 },
  ];
  const byId = Object.fromEntries(VISITED.map(c => [c.id, c]));
  const byCode = Object.fromEntries(VISITED.map(c => [c.code, c]));
  const photos = (window.TRAVEL_PHOTOS || []).filter(p => p && p.src);
  const countEl = $('#countryCount');
  if (countEl) countEl.textContent = VISITED.length;

  let activeCountry = 'all';
  let setActive = () => {};

  // Country chips
  const chips = $('#countryChips');
  if (chips) {
    const count = code => photos.filter(p => p.country === code).length;
    const chip = (code, label, flag) => {
      const n = code === 'all' ? photos.length : count(code);
      return `<button type="button" class="chip-btn${code === 'all' ? ' active' : ''}" data-country="${code}">` +
        (flag ? `<span class="flag">${flag}</span>` : '') + `<span>${label}</span>` + (n ? `<span class="n">${n}</span>` : '') + `</button>`;
    };
    chips.innerHTML = chip('all', 'All countries') + VISITED.map(c => chip(c.code, c.name, c.flag)).join('');
    chips.addEventListener('click', e => {
      const b = e.target.closest('.chip-btn');
      if (b) setActive(b.dataset.country);
    });
  }

  // Gallery
  const gallery = $('#gallery'), empty = $('#galleryEmpty'), more = $('#galleryMore');
  const PREVIEW = 9;
  let expanded = false;
  let visiblePhotos = [];
  const renderGallery = () => {
    if (!gallery) return;
    if (!photos.length) { if (empty) empty.hidden = false; return; }
    const list = photos.filter(p => activeCountry === 'all' || p.country === activeCountry);
    const shown = expanded ? list : list.slice(0, PREVIEW);
    visiblePhotos = list;
    gallery.innerHTML = shown.map((p, i) => {
      const c = byCode[p.country];
      const cap = p.caption ? p.caption.replace(/</g, '&lt;') : '';
      return `<button type="button" class="photo" data-i="${i}"><img src="${p.src}" alt="${cap || (c ? c.name : 'Travel photo')}" loading="lazy">` +
        `<figcaption>${c ? `<span>${c.flag} ${c.name}</span>` : ''}${cap}</figcaption></button>`;
    }).join('');
    if (empty) empty.hidden = list.length > 0;
    if (more) more.hidden = expanded || list.length <= PREVIEW;
  };
  if (more) more.addEventListener('click', () => { expanded = true; renderGallery(); });

  // Lightbox
  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
  let lbIndex = 0;
  const showLb = i => {
    if (!visiblePhotos.length) return;
    lbIndex = (i + visiblePhotos.length) % visiblePhotos.length;
    const p = visiblePhotos[lbIndex], c = byCode[p.country];
    lbImg.src = p.src;
    lbImg.alt = p.caption || (c ? c.name : 'Travel photo');
    lbCap.textContent = [c ? `${c.flag} ${c.name}` : '', p.caption || ''].filter(Boolean).join(' · ');
    lb.hidden = false;
  };
  if (gallery) gallery.addEventListener('click', e => { const b = e.target.closest('.photo'); if (b) showLb(+b.dataset.i); });
  if (lb) {
    lb.addEventListener('click', e => {
      const a = e.target.closest('[data-lb]')?.dataset.lb;
      if (a === 'close' || e.target === lb) lb.hidden = true;
      else if (a === 'prev') showLb(lbIndex - 1);
      else if (a === 'next') showLb(lbIndex + 1);
    });
    addEventListener('keydown', e => {
      if (lb.hidden) return;
      if (e.key === 'Escape') lb.hidden = true;
      else if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
      else if (e.key === 'ArrowRight') showLb(lbIndex + 1);
    });
  }

  // World map (d3 + world-atlas, loaded from jsDelivr)
  const mapEl = $('#worldMap'), tip = $('#mapTip'), zoomBtn = $('#mapZoom');
  let highlightMap = () => {};
  const drawMap = async () => {
    if (!mapEl || !window.d3 || !window.topojson) throw new Error('map libraries missing');
    const world = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json').then(r => r.json());
    const features = topojson.feature(world, world.objects.countries).features.filter(f => f.id !== '010');
    const W = 1000, H = 520;
    const proj = d3.geoNaturalEarth1().fitExtent([[8, 8], [W - 8, H - 8]], { type: 'Sphere' });
    const path = d3.geoPath(proj);
    mapEl.innerHTML = '';
    const svg = d3.select(mapEl).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('preserveAspectRatio', 'xMidYMid meet');
    const g = svg.append('g');
    g.append('path').datum({ type: 'Sphere' }).attr('class', 'sphere').attr('d', path);
    g.append('path').datum(d3.geoGraticule10()).attr('class', 'graticule').attr('d', path);
    const countries = g.append('g').selectAll('path').data(features).join('path')
      .attr('class', d => 'country' + (byId[d.id] ? ' visited' : ''))
      .attr('d', path);
    const pinR = 4;
    const pins = g.append('g').selectAll('g').data(VISITED).join('g').attr('class', 'pin')
      .attr('transform', d => `translate(${proj([d.lon, d.lat]).join(',')})`);
    pins.append('circle').attr('class', 'ring').attr('r', pinR);
    pins.append('circle').attr('class', 'dot').attr('r', pinR);

    // Tooltip
    const card = mapEl.parentElement;
    const moveTip = (e, html) => {
      const r = card.getBoundingClientRect();
      tip.innerHTML = html; tip.hidden = false;
      tip.style.left = (e.clientX - r.left) + 'px';
      tip.style.top = (e.clientY - r.top) + 'px';
    };
    countries
      .on('pointermove', (e, d) => {
        const v = byId[d.id];
        moveTip(e, v ? `${v.flag} ${v.name}<span class="v">Visited</span>` : (d.properties && d.properties.name) || '');
      })
      .on('pointerleave', () => { tip.hidden = true; })
      .on('click', (e, d) => { const v = byId[d.id]; if (v) setActive(activeCountry === v.code ? 'all' : v.code); });

    highlightMap = code => countries.classed('active', d => byId[d.id] && byId[d.id].code === code);

    // Zoom between whole world and the visited region
    let bx = [Infinity, Infinity, -Infinity, -Infinity];
    features.filter(f => byId[f.id]).forEach(f => {
      const [[x0, y0], [x1, y1]] = path.bounds(f);
      bx = [Math.min(bx[0], x0), Math.min(bx[1], y0), Math.max(bx[2], x1), Math.max(bx[3], y1)];
    });
    VISITED.forEach(v => { const [x, y] = proj([v.lon, v.lat]); bx = [Math.min(bx[0], x), Math.min(bx[1], y), Math.max(bx[2], x), Math.max(bx[3], y)]; });
    const pad = 40;
    let zx = bx[0] - pad, zy = bx[1] - pad, zw = bx[2] - bx[0] + pad * 2, zh = bx[3] - bx[1] + pad * 2;
    const ratio = W / H;
    if (zw / zh > ratio) { const nh = zw / ratio; zy -= (nh - zh) / 2; zh = nh; } else { const nw = zh * ratio; zx -= (nw - zw) / 2; zw = nw; }
    const FULL = [0, 0, W, H], ZOOM = [zx, zy, zw, zh];
    let cur = FULL.slice(), zoomed = false;
    const setView = vb => {
      cur = vb;
      svg.attr('viewBox', vb.join(' '));
      const k = vb[2] / W;
      pins.selectAll('circle').attr('r', pinR * k);
    };
    const animateTo = target => {
      const from = cur.slice(), t0 = performance.now(), dur = reduced ? 0 : 900;
      const step = t => {
        const p = dur ? Math.min(1, (t - t0) / dur) : 1, e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        setView(from.map((v, i) => v + (target[i] - v) * e));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (zoomBtn) zoomBtn.addEventListener('click', () => {
      zoomed = !zoomed;
      zoomBtn.setAttribute('aria-pressed', zoomed);
      zoomBtn.querySelector('span').textContent = zoomed ? 'Show whole world' : 'Zoom to my travels';
      animateTo(zoomed ? ZOOM : FULL);
    });
  };
  drawMap().catch(() => {
    if (mapEl) mapEl.innerHTML = '<div class="map-loading">Map unavailable offline: ' + VISITED.map(c => c.flag + ' ' + c.name).join(' · ') + '</div>';
    if (zoomBtn) zoomBtn.hidden = true;
  });

  setActive = code => {
    activeCountry = code;
    expanded = false;
    $$('.chip-btn').forEach(b => b.classList.toggle('active', b.dataset.country === code));
    highlightMap(code);
    renderGallery();
  };
  renderGallery();

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
