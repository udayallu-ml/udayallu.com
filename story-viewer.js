// Renders window.STORIES (from stories.js) into the Stories section.
// Left/right arrows in the section header move between stories; inside a story,
// the photo, the progress bars, the thumbnails and swipes move between photos.
(() => {
  const stories = window.STORIES || [];
  const stage = document.getElementById('storyStage');
  const prev = document.getElementById('storyPrev');
  const next = document.getElementById('storyNext');
  const count = document.getElementById('storyCount');
  if (!stage) return;
  if (!stories.length) { stage.innerHTML = '<p class="story-empty">Stories coming soon.</p>'; return; }

  let s = 0, p = 0;
  const esc = (t = '') => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = n => String(n).padStart(2, '0');

  function render() {
    const st = stories[s];
    const ph = st.photos[p];
    const many = st.photos.length > 1;
    stage.innerHTML = `
      <article class="story" aria-roledescription="story" aria-label="${esc(st.title)}">
        <div class="story-media">
          <div class="story-bars" aria-hidden="true">${st.photos.map((_, i) => `<i class="${i < p ? 'done' : i === p ? 'now' : ''}"></i>`).join('')}</div>
          <button class="story-photo" type="button" ${many ? '' : 'disabled'} aria-label="${many ? 'Next photo' : esc(ph.alt)}">
            <img src="${esc(ph.src)}" alt="${esc(ph.alt)}" width="${ph.w || ''}" height="${ph.h || ''}" loading="lazy" decoding="async">
          </button>
          ${many ? `<button class="story-step story-step-prev" type="button" aria-label="Previous photo" ${p === 0 ? 'disabled' : ''}><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button>
          <button class="story-step story-step-next" type="button" aria-label="Next photo" ${p === st.photos.length - 1 ? 'disabled' : ''}><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button>` : ''}
          <p class="story-caption"><span>${pad(p + 1)} / ${pad(st.photos.length)}</span>${esc(ph.caption || '')}</p>
        </div>
        <div class="story-body">
          <p class="story-meta">${[st.date, st.place].filter(Boolean).map(esc).join('<span aria-hidden="true">·</span>')}</p>
          <h3 class="story-title">${esc(st.title)}${st.subtitle ? `<span>${esc(st.subtitle)}</span>` : ''}</h3>
          <p class="story-text">${esc(st.text)}</p>
          ${many ? `<div class="story-thumbs" role="group" aria-label="Photos in this story">${st.photos.map((x, i) =>
            `<button type="button" class="${i === p ? 'on' : ''}" aria-label="Photo ${i + 1}: ${esc(x.caption || x.alt)}" aria-current="${i === p}"><img src="${esc(x.thumb || x.src)}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}
          ${st.post ? `<a class="link-arrow" href="${esc(st.post)}">Read the full story
            <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>` : ''}
        </div>
      </article>`;
    count.textContent = `${pad(s + 1)} / ${pad(stories.length)}`;
    prev.disabled = s === 0;
    next.disabled = s === stories.length - 1;
    const title = stories.length > 1 ? '' : 'More stories coming soon';
    prev.title = next.title = title;
    // preload the next photo so stepping through feels instant
    const nx = st.photos[p + 1];
    if (nx) { const im = new Image(); im.src = nx.src; }
  }

  const goStory = d => { const n = s + d; if (n < 0 || n >= stories.length) return; s = n; p = 0; render(); };
  const goPhoto = d => { const n = p + d, len = stories[s].photos.length; if (n < 0 || n >= len) return; p = n; render(); };

  prev.addEventListener('click', () => goStory(-1));
  next.addEventListener('click', () => goStory(1));
  stage.addEventListener('click', e => {
    if (e.target.closest('.story-photo')) { const len = stories[s].photos.length; p = (p + 1) % len; render(); return; }
    if (e.target.closest('.story-step-prev')) return goPhoto(-1);
    if (e.target.closest('.story-step-next')) return goPhoto(1);
    const t = e.target.closest('.story-thumbs button');
    if (t) { p = [...t.parentElement.children].indexOf(t); render(); }
  });
  stage.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { goPhoto(1); stage.querySelector('.story-photo')?.focus(); }
    if (e.key === 'ArrowLeft') { goPhoto(-1); stage.querySelector('.story-photo')?.focus(); }
  });
  let x0 = null;
  stage.addEventListener('touchstart', e => { if (e.target.closest('.story-media')) x0 = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) { e.preventDefault(); goPhoto(dx < 0 ? 1 : -1); }
  });
  render();
})();
