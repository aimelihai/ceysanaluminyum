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
      // Still register triggers but make elements visible instantly (no animation)
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

    // Refresh after all content
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

    // Hero text entrance handled by CSS @keyframes (heroFadeUp) — no GSAP needed here

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
        const eased    = 1 - Math.pow(1 - progress, 3); // cubic ease-out
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

    const cats = CEYSAN.categories.filter(c => c.id !== 'all');

    // Build sidebar buttons
    const sidebarItems = cats.map((cat, i) => {
      const products = CEYSAN.products.filter(p => p.category === cat.id);
      if (!products.length) return '';
      const label  = lang === 'tr' ? cat.tr : cat.en;
      const num    = String(i + 1).padStart(2, '0');
      const panelId = `cex-panel-${cat.id}`;
      return `
        <button class="cex-cat" data-cat="${cat.id}" aria-controls="${panelId}" aria-expanded="false">
          <span class="cex-num">${num}</span>
          <span class="cex-name">${label}</span>
          <span class="cex-count">${products.length}</span>
          <svg class="cex-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>`;
    }).join('');

    // Build product panels
    const panels = cats.map(cat => {
      const products = CEYSAN.products.filter(p => p.category === cat.id);
      if (!products.length) return '';
      const label = lang === 'tr' ? cat.tr : cat.en;

      const cards = products.map(p => {
        const name = lang === 'tr' ? p.tr_name : p.en_name;
        return `
          <a class="cex-product" href="urunler.html#${p.slug}">
            <div class="cex-product-img">
              <img src="${p.image}" alt="${name}" loading="lazy"
                   onerror="this.src='https://ceysanaluminyum.com/resimler/urungrubu/resim_yok.png'">
            </div>
            <div class="cex-product-name">${name}</div>
          </a>`;
      }).join('');

      return `
        <div class="cex-panel" id="cex-panel-${cat.id}" hidden>
          <div class="cex-panel-hd">
            <h3 class="cex-panel-title">${label}</h3>
            <a href="urunler.html#cat-${cat.id}" class="cex-panel-cta">
              Tümünü Gör
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
          <div class="cex-panel-grid">${cards}</div>
        </div>`;
    }).join('');

    grid.innerHTML = `
      <div class="cex-explorer" role="tablist">
        <div class="cex-sidebar">${sidebarItems}</div>
        <div class="cex-stage">
          ${panels}
          <div class="cex-stage-empty" id="cex-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" opacity=".25"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            <p>Kategori seçin</p>
          </div>
        </div>
      </div>`;

    // Event handlers
    const activateCat = (btn) => {
      const panelId = btn.getAttribute('aria-controls');
      const isOpen  = btn.getAttribute('aria-expanded') === 'true';

      // Deactivate all
      grid.querySelectorAll('.cex-cat').forEach(b => b.setAttribute('aria-expanded', 'false'));
      grid.querySelectorAll('.cex-panel').forEach(p => { p.hidden = true; });

      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        const panel = document.getElementById(panelId);
        if (panel) {
          panel.hidden = false;
          document.getElementById('cex-empty').hidden = true;
        }
      } else {
        document.getElementById('cex-empty').hidden = false;
      }
    };

    grid.querySelectorAll('.cex-cat').forEach(btn => {
      btn.addEventListener('click', () => activateCat(btn));
      btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateCat(btn); }
      });
    });

    // Auto-open first category
    const firstBtn = grid.querySelector('.cex-cat');
    if (firstBtn) activateCat(firstBtn);
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

    // Category icons map
    const catIcons = {
      'cam':       '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="2" y="3" width="9" height="18" rx="1.5"/><rect x="13" y="3" width="9" height="18" rx="1.5"/></svg>',
      'aluminyum': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="3" y="2" width="12" height="20" rx="2"/><circle cx="13.5" cy="12" r="1.25" fill="currentColor"/><line x1="16" y1="6" x2="21" y2="6"/><line x1="16" y1="12" x2="21" y2="12"/><line x1="16" y1="18" x2="21" y2="18"/></svg>',
      'pvc':       '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="2" y1="12" x2="22" y2="12"/></svg>',
      'kepenk':    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="2" y="2" width="20" height="18" rx="2"/><path d="M2 7h20M2 12h20M2 17h20"/></svg>',
      'dis-mekan': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M2 8h20"/><path d="M5 8v10M19 8v10"/><path d="M5 18h14"/><line x1="8" y1="8" x2="8" y2="4"/><line x1="12" y1="8" x2="12" y2="4"/><line x1="16" y1="8" x2="16" y2="4"/></svg>',
      'ic-mekan':  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 21V8a4 4 0 014-4h8a4 4 0 014 4v13"/><line x1="12" y1="4" x2="12" y2="21"/></svg>',
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
              <div class="cat-section-meta">
                <h2 class="cat-section-title">${catLabel}</h2>
                <span class="cat-section-count">${products.length} ürün</span>
              </div>
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

      // Animate
      if (window.gsap) {
        container.querySelectorAll('.product-card').forEach((el, i) => {
          gsap.from(el, { opacity: 0, y: 22, duration: .45, delay: i * 0.04, ease: 'power2.out' });
        });
      }
    }

    // Search
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

      // Re-bind search after innerHTML replace
      const newSearch = document.getElementById('productSearch');
      if (newSearch) {
        newSearch.addEventListener('input', () => {
          renderGrouped(newSearch.value.trim() || null);
        });
      }
    }

    // Handle hash anchor scroll
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
      <div class="product-modal-inner" role="dialog" aria-modal="true" aria-label="${name}">
        <button class="product-modal-close" onclick="closeProductModal()" aria-label="Kapat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div class="product-modal-img">
          <img src="${p.image}" alt="${name}"
               onerror="this.src='https://ceysanaluminyum.com/resimler/urungrubu/resim_yok.png'">
        </div>
        <div class="product-modal-body">
          <span class="product-card-tag" style="margin-bottom:.75rem;display:inline-block">${getCatLabel(p.category)}</span>
          <h2 style="font-family:var(--ff-display);font-size:1.6rem;margin-bottom:.75rem">${name}</h2>
          <p style="color:var(--c-muted);line-height:1.7;margin-bottom:1.25rem">${desc}</p>
          <div style="display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:1.75rem">
            ${tags.map(tag => `<span class="badge badge-blue">${tag}</span>`).join('')}
          </div>
          <div style="display:flex;gap:.75rem;flex-wrap:wrap">
            ${p.id === 11
              ? `<a href="sineklik-siparis.html" class="btn btn-primary" style="background:linear-gradient(135deg,#1a3660,#1a5276)">
                   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 3 L21 21 M3 9 L9 3 M3 15 L15 3 M9 21 L21 9 M15 21 L21 15"/></svg>
                   Sineklik Sipariş Ver
                 </a>`
              : `<a href="teklif.html" class="btn btn-primary">
                   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                   ${t('nav_quote')}
                 </a>`
            }
            <a href="https://api.whatsapp.com/send?phone=${co.wa}&text=Merhaba%2C%20${encodeURIComponent(name)}%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
               class="btn btn-dark" target="_blank" rel="noopener">
              WhatsApp
            </a>
          </div>
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
      <div class="gallery-item ${item.span}" data-cat="${item.cat || ''}" onclick="openLightbox(${i})">
        <img src="${item.src}"
             alt="${lang === 'tr' ? item.tr_cap : item.en_cap}"
             loading="lazy"
             onload="this.classList.add('loaded')"
             onerror="this.src='https://ceysanaluminyum.com/resimler/urungrubu/resim_yok.png';this.classList.add('loaded')">
        <div class="gallery-overlay">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </div>
      </div>
    `).join('');

    // Lightbox
    const galleryItems = items; // capture for closure
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
      if (e.key === 'Escape')      { lb.classList.remove('active'); document.body.style.overflow = ''; }
      if (e.key === 'ArrowRight')  { openLightbox((currentIdx + 1) % galleryItems.length); }
      if (e.key === 'ArrowLeft')   { openLightbox((currentIdx - 1 + galleryItems.length) % galleryItems.length); }
    });
  }

  /* ── Homepage Gallery Preview ────────────────────────────────── */
  function initHomeGallery() {
    const grid = document.getElementById('homeGalleryGrid');
    if (!grid) return;

    const items = CEYSAN.gallery.slice(0, 6);
    grid.innerHTML = items.map((item, i) => `
      <div class="gallery-item${i === 0 ? ' span-2' : ''}">
        <img src="${item.src}"
             alt="${lang === 'tr' ? item.tr_cap : item.en_cap}"
             loading="lazy"
             onload="this.classList.add('loaded')"
             onerror="this.src='https://ceysanaluminyum.com/resimler/urungrubu/resim_yok.png';this.classList.add('loaded')">
        <div class="gallery-overlay">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
        </div>
      </div>
    `).join('');
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
        if (currentStep > 1) {
          currentStep--;
          showStep(currentStep);
        }
      });
    });

    // Populate districts
    const districtSel = document.getElementById('quoteDistrict');
    if (districtSel) {
      districtSel.innerHTML = `<option value="">İlçe seçin…</option>` +
        CEYSAN.districts.map(d => `<option value="${d}">${d}</option>`).join('');
    }

    // Populate products
    const productSel = document.getElementById('quoteProduct');
    if (productSel) {
      productSel.innerHTML = `<option value="">Ürün seçin…</option>` +
        CEYSAN.products.map(p => `<option value="${p.slug}">${lang === 'tr' ? p.tr_name : p.en_name}</option>`).join('');
    }

    // Submit
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name  = form.querySelector('#quoteName')?.value  || '';
      const phone = form.querySelector('#quotePhone')?.value || '';

      if (!name || !phone) {
        window.CEYSAN.showToast('Lütfen gerekli alanları doldurun.', 'error');
        return;
      }

      // WhatsApp redirect
      const product  = form.querySelector('#quoteProduct')?.value || '';
      const district = form.querySelector('#quoteDistrict')?.value || '';
      const note     = form.querySelector('#quoteNote')?.value || '';

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
      const name    = contactForm.querySelector('#contactName')?.value || '';
      const phone   = contactForm.querySelector('#contactPhone')?.value || '';
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
    // Set lang attribute on html
    document.documentElement.lang = lang === 'tr' ? 'tr-TR' : 'en-GB';

    applyTranslations();
    initMegaMenu();
    initCounters();
    initHomeProducts();
    initProductsPage();
    initGallery();
    initHomeGallery();
    initQuoteForm();
    initContactPage();
    initAccordions();

    // GSAP after small delay (let DOM settle)
    setTimeout(initGSAP, 50);

    // Product modal backdrop
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
