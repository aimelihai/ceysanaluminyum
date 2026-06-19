/* ================================================================
   CEYSAN — Main JS: GSAP Animations, Counters, Page Logic
   ================================================================ */

(function () {
  'use strict';

  const lang = localStorage.getItem('ceysan_lang') || 'tr';
  const t    = key => CEYSAN.i18n[lang][key] || key;

  /* ── GSAP Init ───────────────────────────────────────────────── */
  function initGSAP() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.utils.toArray('[data-reveal]').forEach(el => { el.style.opacity = 1; });
      gsap.utils.toArray('[data-stagger]').forEach(parent => {
        Array.from(parent.children).forEach(c => { c.style.opacity = 1; });
      });
      return;
    }

    // Generic reveal: elements with [data-reveal]
    gsap.utils.toArray('[data-reveal]').forEach(el => {
      const dir = el.dataset.reveal || 'up';
      gsap.from(el, {
        opacity:  0,
        y:  dir === 'up'   ?  40 : dir === 'down' ? -40 : 0,
        x:  dir === 'left' ?  40 : dir === 'right'? -40 : 0,
        duration: .8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom-=60px',
          once: true,
        },
      });
    });

    // Stagger children: elements with [data-stagger]
    gsap.utils.toArray('[data-stagger]').forEach(parent => {
      const children = Array.from(parent.children).filter(c => !c.classList.contains('filter-search-wrap'));
      if (!children.length) return;
      gsap.from(children, {
        opacity: 0,
        y: 28,
        stagger: 0.09,
        duration: .65,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: parent,
          start: 'top bottom-=40px',
          once: true,
        },
      });
    });

    ScrollTrigger.refresh();

    // Hero parallax
    const heroBgImg = document.querySelector('.hero-bg-img');
    if (heroBgImg) {
      gsap.to(heroBgImg, {
        y: 80,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    // Statement band parallax
    const stImgs = document.querySelectorAll('.lux-statement-img');
    if (stImgs.length) {
      gsap.to(stImgs, {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: { trigger: '.lux-statement', start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }

    // Hero visual
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
      gsap.from('.hero-card-main',  { opacity: 0, x: 50, duration: 1, delay: .4, ease: 'power3.out' });
      gsap.from('.hero-card-float', { opacity: 0, x: -30, duration: .8, delay: .7, ease: 'power3.out' });
    }
  }

  /* ── Animated Counters ───────────────────────────────────────── */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target   = parseInt(el.dataset.count, 10);
      const suffix   = el.dataset.suffix || '';
      const duration = 2000;
      const start    = Date.now();

      const update = () => {
        const elapsed  = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = Math.round(eased * target);
        el.textContent = current.toLocaleString('tr-TR') + suffix;
        if (progress < 1) requestAnimationFrame(update);
      };

      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = '1';
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  /* ── Homepage Catalog — Sidebar Explorer ────────────────────── */
  function initHomeProducts() {
    const grid = document.getElementById('homeProductGrid');
    if (!grid) return;

    const items = CEYSAN.products;

    const rows = items.map((p, i) => {
      const name = lang === 'tr' ? p.tr_name : p.en_name;
      const num = String(i + 1).padStart(2, '0');
      return `
        <a class="lux-index-row${i === 0 ? ' is-active' : ''}" href="urunler.html#${p.slug}" data-idx="${i}">
          <span class="lux-index-n">${num}</span>
          <span class="lux-index-name">${name}</span>
          <span class="lux-index-count">${getCatLabel(p.category)}</span>
          <svg class="lux-index-arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>`;
    }).join('');

    const imgs = items.map((p, i) => {
      const name = lang === 'tr' ? p.tr_name : p.en_name;
      return `<img class="lux-index-img${i === 0 ? ' active' : ''}" src="${p.image}" alt="${name}" loading="lazy" onerror="this.src='https://ceysanaluminyum.com/resimler/urungrubu/resim_yok.png'">`;
    }).join('');

    grid.className = '';
    grid.innerHTML = `
      <div class="lux-index" data-reveal="up">
        <div class="lux-index-list">${rows}</div>
        <div class="lux-index-visual">
          <div class="lux-index-imgs">${imgs}</div>
          <span class="lux-index-tag">${lang === 'tr' ? 'Ölçüye özel üretim · ücretsiz keşif' : 'Custom-made · free site survey'}</span>
        </div>
      </div>`;

    const rowEls = grid.querySelectorAll('.lux-index-row');
    const imgEls = grid.querySelectorAll('.lux-index-img');
    rowEls.forEach(row => {
      const activate = () => {
        const idx = +row.dataset.idx;
        rowEls.forEach(x => x.classList.remove('is-active'));
        imgEls.forEach(x => x.classList.remove('active'));
        row.classList.add('is-active');
        if (imgEls[idx]) imgEls[idx].classList.add('active');
      };
      row.addEventListener('mouseenter', activate);
      row.addEventListener('focus', activate);
    });
  }

  function initHomeShowcase() {
    const track = document.getElementById('homeShowcase');
    if (!track) return;
    const picks = CEYSAN.products.filter(p => p.image && p.image.indexOf('resim_yok') === -1).slice(0, 10);
    track.innerHTML = picks.map((p, i) => {
      const name = lang === 'tr' ? p.tr_name : p.en_name;
      const cat = getCatLabel(p.category);
      return `<a class="lux-sc-card" href="urunler.html#${p.slug}">
          <div class="lux-sc-img"><img src="${p.image}" alt="${name}" loading="lazy" onerror="this.src='https://ceysanaluminyum.com/resimler/urungrubu/resim_yok.png'"></div>
          <span class="lux-sc-idx">${String(i + 1).padStart(2, '0')}</span>
          <div class="lux-sc-body">
            <span class="lux-sc-tag">${cat}</span>
            <h3 class="lux-sc-name">${name}</h3>
          </div>
        </a>`;
    }).join('');

    const section = track.closest('.lux-showcase');
    if (section) section.querySelectorAll('.lux-sc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = track.querySelector('.lux-sc-card');
        const step = card ? card.getBoundingClientRect().width + 16 : 320;
        track.scrollBy({ left: (+btn.dataset.dir) * step * 1.5, behavior: 'smooth' });
      });
    });

    let down = false, moved = false, startX = 0, startScroll = 0;
    track.addEventListener('pointerdown', e => { down = true; moved = false; startX = e.clientX; startScroll = track.scrollLeft; });
    track.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startScroll - dx;
      track.classList.toggle('dragging', moved);
    });
    const end = () => { down = false; track.classList.remove('dragging'); };
    track.addEventListener('pointerup', end);
    track.addEventListener('pointerleave', end);
    track.addEventListener('click', e => { if (moved) e.preventDefault(); }, true);
  }

  function initHeroSlides() {
    const slides = document.querySelectorAll('.lux-hero-slide');
    const cap = document.querySelector('.lux-hero-caption');
    const labels = lang === 'tr'
      ? ['Cam Balkon', 'Alüminyum Doğrama', 'Panjur Sistemleri', 'Pimapen Pencere']
      : ['Glass Balcony', 'Aluminium Joinery', 'Roller Shutters', 'PVC Windows'];
    function setCap(i) {
      if (!cap) return;
      const n = cap.querySelector('.n'), t = cap.querySelector('.t');
      if (n) n.textContent = String(i + 1).padStart(2, '0');
      if (t) t.textContent = labels[i] || '';
    }
    setCap(0);
    if (slides.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let i = 0;
    setInterval(function () {
      slides[i].classList.remove('active');
      i = (i + 1) % slides.length;
      slides[i].classList.add('active');
      setCap(i);
    }, 5200);
  }

  function initStatementWipe() {
    const sec = document.querySelector('.lux-statement');
    if (!sec) return;
    const clear = sec.querySelector('.lux-statement-img--clear');
    if (!clear) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const lens = document.createElement('div');
    lens.className = 'lux-statement-lens';
    sec.appendChild(lens);

    sec.addEventListener('pointermove', function (e) {
      const r = clear.getBoundingClientRect();
      clear.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      clear.style.setProperty('--my', (e.clientY - r.top) + 'px');
      const sr = sec.getBoundingClientRect();
      lens.style.setProperty('--lx', (e.clientX - sr.left) + 'px');
      lens.style.setProperty('--ly', (e.clientY - sr.top) + 'px');
      sec.classList.add('is-wiping');
    });
    sec.addEventListener('pointerleave', function () {
      sec.classList.remove('is-wiping');
      clear.style.setProperty('--mx', '-9999px');
      clear.style.setProperty('--my', '-9999px');
      lens.style.setProperty('--lx', '-9999px');
      lens.style.setProperty('--ly', '-9999px');
    });
  }

  function initWhyGlow() {
    const grid = document.querySelector('.why-grid');
    if (!grid) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;
    let rect = null, queued = false, lx = 0, ly = 0;
    grid.addEventListener('pointermove', function (e) {
      lx = e.clientX; ly = e.clientY;
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () {
        queued = false;
        if (!rect) rect = grid.getBoundingClientRect();
        grid.style.setProperty('--gx', (lx - rect.left) + 'px');
        grid.style.setProperty('--gy', (ly - rect.top) + 'px');
        grid.classList.add('glow');
      });
    });
    grid.addEventListener('pointerenter', function () { rect = grid.getBoundingClientRect(); });
    grid.addEventListener('pointerleave', function () { grid.classList.remove('glow'); });
    window.addEventListener('scroll', function () { rect = null; }, { passive: true });
  }

  /* ── Pause infinite marquees when off-screen (perf) ─────────── */
  function initMarqueePause() {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        const tr = en.target.querySelector('.lux-marquee-track, .lux-photomq-track');
        if (tr) tr.style.animationPlayState = en.isIntersecting ? 'running' : 'paused';
      });
    }, { rootMargin: '120px' });
    document.querySelectorAll('.lux-marquee, .lux-photomq').forEach(function (w) { io.observe(w); });
  }

  function getCatLabel(catId) {
    const cat = CEYSAN.categories.find(c => c.id === catId);
    return cat ? (lang === 'tr' ? cat.tr : cat.en) : catId;
  }

  /* ── Product Grid (Products Page) — Grouped by Category ────── */
  function initProductsPage() {
    const container = document.getElementById('productGrid');
    const searchIn  = document.getElementById('productSearch');
    if (!container) return;

    let searchQuery = '';

    const catIcons = {
      'cam':        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="2" y="3" width="9" height="18" rx="1.5"/><rect x="13" y="3" width="9" height="18" rx="1.5"/></svg>',
      'aluminyum':  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="3" y="2" width="12" height="20" rx="2"/><circle cx="13.5" cy="12" r="1.25" fill="currentColor"/><line x1="16" y1="6" x2="21" y2="6"/><line x1="16" y1="12" x2="21" y2="12"/><line x1="16" y1="18" x2="21" y2="18"/></svg>',
      'pvc':        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="2" y1="12" x2="22" y2="12"/></svg>',
      'kepenk':     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="2" y="2" width="20" height="18" rx="2"/><path d="M2 7h20M2 12h20M2 17h20"/></svg>',
      'dis-mekan':  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M2 8h20"/><path d="M5 8v10M19 8v10"/><path d="M5 18h14"/><line x1="8" y1="8" x2="8" y2="4"/><line x1="12" y1="8" x2="12" y2="4"/><line x1="16" y1="8" x2="16" y2="4"/></svg>',
      'ic-mekan':   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 21V8a4 4 0 014-4h8a4 4 0 014 4v13"/><line x1="12" y1="4" x2="12" y2="21"/></svg>',
      'endüstriyel':'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>',
    };

    const productCard = (p) => `
      <article class="product-card" id="${p.slug}"
               onclick="openProductModal(${p.id})"
               role="button" tabindex="0"
               onkeydown="if(event.key==='Enter')openProductModal(${p.id})">
        <div class="product-card-img">
          <img src="${p.image}"
               alt="${lang === 'tr' ? p.tr_name : p.en_name}"
               loading="lazy"
               onerror="this.src='https://ceysanaluminyum.com/resimler/urungrubu/resim_yok.png'">
          <div class="product-card-overlay">
            <span class="product-card-overlay-btn">
              ${t('prod_detail')}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </span>
          </div>
        </div>
        <div class="product-card-body">
          <h3>${lang === 'tr' ? p.tr_name : p.en_name}</h3>
          <p>${lang === 'tr' ? p.tr_desc : p.en_desc}</p>
        </div>
      </article>`;

    function renderGrouped(filterQ) {
      const cats = CEYSAN.categories.filter(c => c.id !== 'all');
      let html = '';

      cats.forEach(cat => {
        let products = CEYSAN.products.filter(p => p.category === cat.id);

        if (filterQ) {
          const q = filterQ.toLowerCase();
          products = products.filter(p => {
            const name = (lang === 'tr' ? p.tr_name : p.en_name).toLowerCase();
            const tags = (lang === 'tr' ? p.tr_tags : p.en_tags).join(' ').toLowerCase();
            return name.includes(q) || tags.includes(q);
          });
        }

        if (!products.length) return;

        const catLabel = lang === 'tr' ? cat.tr : cat.en;
        const icon = catIcons[cat.id] || '';
        html += `
          <div class="cat-section" id="cat-${cat.id}">
            <div class="cat-section-header">
              <div class="cat-section-icon">${icon}</div>
              <h2 class="cat-section-title">${catLabel}</h2>
              <span class="cat-section-rule"></span>
              <span class="cat-section-count">${products.length} ürün</span>
            </div>
            <div class="product-grid cat-product-grid">
              ${products.map(productCard).join('')}
            </div>
          </div>`;
      });

      if (!html) {
        html = `
          <div class="products-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <p>Ürün bulunamadı</p>
          </div>`;
      }

      container.innerHTML = html;

      if (window.gsap) {
        container.querySelectorAll('.product-card').forEach((el, i) => {
          gsap.from(el, { opacity: 0, y: 22, duration: .45, delay: i * 0.04, ease: 'power2.out' });
        });
      }
    }

    if (searchIn) {
      searchIn.addEventListener('input', () => {
        searchQuery = searchIn.value.trim();
        renderGrouped(searchQuery || null);
      });
    }

    renderGrouped(null);

    // Build quick-jump category nav
    const filterBar = document.getElementById('filterBar');
    if (filterBar) {
      const cats = CEYSAN.categories.filter(c => c.id !== 'all');
      filterBar.innerHTML = `
        <div class="cat-jump-nav">
          ${cats.map(c => `
            <a class="cat-jump-link" href="#cat-${c.id}">
              ${lang === 'tr' ? c.tr : c.en}
            </a>`).join('')}
        </div>
        <div class="filter-search-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="search" id="productSearch" placeholder="Ürün ara…" aria-label="Ürün ara">
        </div>`;

      const newSearch = document.getElementById('productSearch');
      if (newSearch) {
        newSearch.addEventListener('input', () => {
          renderGrouped(newSearch.value.trim() || null);
        });
      }
    }

    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    }
  }

  /* ── Product Modal ───────────────────────────────────────────── */
  window.openProductModal = function (id) {
    const p = CEYSAN.products.find(x => x.id === id);
    if (!p) return;

    const name = lang === 'tr' ? p.tr_name : p.en_name;
    const desc = lang === 'tr' ? p.tr_desc : p.en_desc;
    const tags = lang === 'tr' ? p.tr_tags : p.en_tags;

    const modal = document.getElementById('productModal');
    const co    = CEYSAN.company;

    if (!modal) return;

    modal.innerHTML = `
      <div class="product-modal-inner lux-pm" role="dialog" aria-modal="true" aria-label="${name}">
        <button class="product-modal-close" onclick="closeProductModal()" aria-label="Kapat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div class="product-modal-img">
          <img src="${p.image}" alt="${name}"
               onerror="this.src='https://ceysanaluminyum.com/resimler/urungrubu/resim_yok.png'">
          <span class="lux-pm-imgtag">${getCatLabel(p.category)}</span>
        </div>
        <div class="product-modal-body">
          <p class="lux-pm-eyebrow"><span class="lux-pm-rule"></span>${getCatLabel(p.category)}</p>
          <h2 class="lux-pm-title">${name}</h2>
          <p class="lux-pm-desc">${desc}</p>
          <div class="lux-pm-tags">
            ${tags.map(tag => `<span class="lux-pm-chip">${tag}</span>`).join('')}
          </div>
          <div class="lux-pm-actions">
            ${p.id === 11
              ? `<a href="sineklik-siparis.html" class="btn btn-primary lux-pm-btn">
                   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 3 L21 21 M3 9 L9 3 M3 15 L15 3 M9 21 L21 9 M15 21 L21 15"/></svg>
                   Sineklik Sipariş Ver
                 </a>`
              : `<a href="teklif.html" class="btn btn-primary lux-pm-btn">
                   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                   ${t('nav_quote')}
                 </a>`
            }
            <a href="https://api.whatsapp.com/send?phone=${co.wa}&text=Merhaba%2C%20${encodeURIComponent(name)}%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
               class="btn btn-dark lux-pm-btn" target="_blank" rel="noopener">
              WhatsApp
            </a>
          </div>
          <p class="lux-pm-note">Ölçüye özel üretim · ücretsiz keşif &amp; yerinde ölçüm</p>
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeProductModal = function () {
    const modal = document.getElementById('productModal');
    if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
  };

  /* ── Gallery Page ────────────────────────────────────────────── */
  function initGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    const items = CEYSAN.gallery.concat(CEYSAN.products.map(p => ({
      src:    p.image,
      tr_cap: p.tr_name,
      en_cap: p.en_name,
      span:   '',
      cat:    p.category || '',
    })));

    grid.innerHTML = items.map((item, i) => `
      <div class="gallery-item lux-galp ${item.span}" data-cat="${item.cat || ''}" onclick="openLightbox(${i})">
        <img src="${item.src}"
             alt="${lang === 'tr' ? item.tr_cap : item.en_cap}"
             loading="lazy"
             onload="this.classList.add('loaded')"
             onerror="this.src='https://ceysanaluminyum.com/resimler/urungrubu/resim_yok.png';this.classList.add('loaded')">
        <div class="gallery-overlay">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </div>
        <div class="lux-galp-cap"><span>${lang === 'tr' ? item.tr_cap : item.en_cap}</span></div>
      </div>
    `).join('');

    const galleryItems = items;
    let currentIdx = 0;

    window.openLightbox = function (idx) {
      currentIdx = idx;
      const lb = document.getElementById('lightbox');
      const img = document.getElementById('lightboxImg');
      if (!lb || !img) return;
      img.src = galleryItems[idx].src;
      img.alt = lang === 'tr' ? galleryItems[idx].tr_cap : galleryItems[idx].en_cap;
      lb.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const lb = document.getElementById('lightbox');
    if (lb) {
      lb.addEventListener('click', e => {
        if (e.target === lb) { lb.classList.remove('active'); document.body.style.overflow = ''; }
      });
    }

    document.addEventListener('keydown', e => {
      const lb = document.getElementById('lightbox');
      if (!lb?.classList.contains('active')) return;
      if (e.key === 'Escape')     { lb.classList.remove('active'); document.body.style.overflow = ''; }
      if (e.key === 'ArrowRight') { openLightbox((currentIdx + 1) % galleryItems.length); }
      if (e.key === 'ArrowLeft')  { openLightbox((currentIdx - 1 + galleryItems.length) % galleryItems.length); }
    });
  }

  /* ── Homepage Gallery Preview ────────────────────────────────── */
  function initHomeGallery() {
    const grid = document.getElementById('homeGalleryGrid');
    if (!grid) return;

    const items = CEYSAN.gallery.slice(0, 6);
    grid.innerHTML = items.map((item, i) => {
      const cap = lang === 'tr' ? item.tr_cap : item.en_cap;
      return `
        <a class="gallery-item lux-gal${i === 0 ? ' span-2 span-row' : ''}" href="galeri.html" aria-label="${cap}">
          <img src="${item.src}" alt="${cap}" loading="lazy"
               onload="this.classList.add('loaded')"
               onerror="this.src='https://ceysanaluminyum.com/resimler/urungrubu/resim_yok.png';this.classList.add('loaded')">
          <div class="lux-gal-cap">
            <span class="lux-gal-name">${cap}</span>
            <span class="lux-gal-go">Görüntüle
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </span>
          </div>
        </a>`;
    }).join('');
  }

  /* ── Quote Form ──────────────────────────────────────────────── */
  function initQuoteForm() {
    const form = document.getElementById('quoteForm');
    if (!form) return;

    let currentStep = 1;
    const totalSteps = 3;

    const showStep = (step) => {
      form.querySelectorAll('.form-step').forEach((s, i) => {
        s.classList.toggle('active', i + 1 === step);
      });
      form.querySelectorAll('.step-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i + 1 === step);
        dot.classList.toggle('done',   i + 1 < step);
      });
      form.querySelectorAll('.step-line').forEach((line, i) => {
        line.classList.toggle('done', i + 1 < step);
      });
    };

    form.querySelectorAll('[data-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
          currentStep++;
          showStep(currentStep);
          form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    form.querySelectorAll('[data-prev]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep > 1) { currentStep--; showStep(currentStep); }
      });
    });

    const districtSel = document.getElementById('quoteDistrict');
    if (districtSel) {
      districtSel.innerHTML = `<option value="">İlçe seçin…</option>` +
        CEYSAN.districts.map(d => `<option value="${d}">${d}</option>`).join('');
    }

    const productSel = document.getElementById('quoteProduct');
    if (productSel) {
      productSel.innerHTML = `<option value="">Ürün seçin…</option>` +
        CEYSAN.products.map(p => `<option value="${p.slug}">${lang === 'tr' ? p.tr_name : p.en_name}</option>`).join('');
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      const name  = form.querySelector('#quoteName')?.value  || '';
      const phone = form.querySelector('#quotePhone')?.value || '';

      if (!name || !phone) {
        window.CEYSAN.showToast('Lütfen gerekli alanları doldurun.', 'error');
        return;
      }

      const product  = form.querySelector('#quoteProduct')?.value  || '';
      const district = form.querySelector('#quoteDistrict')?.value || '';
      const note     = form.querySelector('#quoteNote')?.value     || '';

      const msg = `Merhaba, teklif almak istiyorum.%0A` +
        `Ad: ${encodeURIComponent(name)}%0A` +
        `Ürün: ${encodeURIComponent(product)}%0A` +
        `İlçe: ${encodeURIComponent(district)}%0A` +
        (note ? `Not: ${encodeURIComponent(note)}` : '');

      window.open(`https://api.whatsapp.com/send?phone=${CEYSAN.company.wa}&text=${msg}`, '_blank');

      window.CEYSAN.showToast(t('quote_success'), 'success');
      currentStep = 1;
      showStep(1);
      form.reset();
    });

    showStep(1);
  }

  /* ── Contact Page ────────────────────────────────────────────── */
  function initContactPage() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name    = contactForm.querySelector('#contactName')?.value    || '';
      const phone   = contactForm.querySelector('#contactPhone')?.value   || '';
      const message = contactForm.querySelector('#contactMessage')?.value || '';

      if (!name || !phone) {
        window.CEYSAN.showToast('Lütfen gerekli alanları doldurun.', 'error');
        return;
      }

      const msg = `Merhaba, ${encodeURIComponent(name)} - ${encodeURIComponent(message || 'İletişim formu mesajı')}`;
      window.open(`https://api.whatsapp.com/send?phone=${CEYSAN.company.wa}&text=${msg}`, '_blank');
      window.CEYSAN.showToast('Mesajınız alındı!', 'success');
      contactForm.reset();
    });
  }

  /* ── Accordion ───────────────────────────────────────────────── */
  function initAccordions() {
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const isOpen = trigger.classList.toggle('open');
        const body   = trigger.nextElementSibling;
        if (body) body.classList.toggle('open', isOpen);
      });
    });
  }

  /* ── Apply i18n to static elements ──────────────────────────── */
  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const val = CEYSAN.i18n[lang][key];
      if (val !== undefined) el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.dataset.i18nHtml;
      const val = CEYSAN.i18n[lang][key];
      if (val !== undefined) el.innerHTML = val;
    });
  }

  /* ── Mega-menu v3 Interaction ────────────────────────────────── */
  function initMegaMenu() {
    const menu = document.getElementById('mm3');
    if (!menu) return;
    const imgs      = menu.querySelectorAll('.mm3-img');
    const rows      = menu.querySelectorAll('.mm3-row');
    const catEl     = document.getElementById('mm3Cat');
    const nameEl    = document.getElementById('mm3Name');
    const descEl    = document.getElementById('mm3Desc');
    const exploreEl = document.getElementById('mm3Explore');
    let current   = 0;
    let fadeTimer = null;

    function activate(idx) {
      if (idx === current) return;
      imgs[current]?.classList.remove('active');
      imgs[idx]?.classList.add('active');
      rows[current]?.classList.remove('is-active');
      rows[idx]?.classList.add('is-active');
      const row = rows[idx];
      if (row && catEl && nameEl && descEl) {
        catEl.classList.add('fading');
        nameEl.classList.add('fading');
        descEl.classList.add('fading');
        clearTimeout(fadeTimer);
        fadeTimer = setTimeout(() => {
          catEl.textContent  = row.dataset.cat  || '';
          nameEl.textContent = row.dataset.name || '';
          descEl.textContent = row.dataset.desc || '';
          if (exploreEl) exploreEl.href = row.href;
          catEl.classList.remove('fading');
          nameEl.classList.remove('fading');
          descEl.classList.remove('fading');
        }, 200);
      }
      current = idx;
    }

    rows.forEach((row, i) => {
      row.addEventListener('mouseenter', () => activate(i));
    });
    menu.addEventListener('mouseleave', () => activate(0));
    rows[0]?.classList.add('is-active');
  }

  /* ── Init All ────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.lang = lang === 'tr' ? 'tr-TR' : 'en-GB';

    applyTranslations();
    initMegaMenu();
    initHeroSlides();
    initWhyGlow();
    initStatementWipe();
    initMarqueePause();
    initCounters();
    initHomeProducts();
    initHomeShowcase();
    initProductsPage();
    initGallery();
    initHomeGallery();
    initQuoteForm();
    initContactPage();
    initAccordions();

    setTimeout(initGSAP, 50);

    const productModal = document.getElementById('productModal');
    if (productModal) {
      productModal.addEventListener('click', e => {
        if (e.target === productModal) window.closeProductModal();
      });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') window.closeProductModal();
      });
    }
  });

})();
