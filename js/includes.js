/* ================================================================
   CEYSAN — Shared Components: Header, Footer, WhatsApp, Search
   ================================================================ */

(function () {
  'use strict';

  /* ── Helpers ─────────────────────────────────────────────────── */
  const t = (key) => {
    const lang = localStorage.getItem('ceysan_lang') || 'tr';
    return CEYSAN.i18n[lang][key] || key;
  };

  const co = CEYSAN.company;

  /* ── Current Page Detection ──────────────────────────────────── */
  const path  = location.pathname;
  const isEn  = localStorage.getItem('ceysan_lang') === 'en';

  const activePage = () => {
    if (path.includes('urunler'))  return 'products';
    if (path.includes('kurumsal')) return 'corporate';
    if (path.includes('galeri'))   return 'gallery';
    if (path.includes('teklif'))   return 'quote';
    if (path.includes('iletisim')) return 'contact';
    return 'home';
  };

  const active = activePage();

  const navA = (page, href, key) =>
    `<a href="${href}" class="nav-link${active === page ? ' active' : ''}" data-i18n="${key}">${t(key)}</a>`;

  /* ── Header HTML ─────────────────────────────────────────────── */
  const headerHTML = () => `
<a href="#main-content" class="skip-link">İçeriğe geç</a>
<div class="scroll-progress" id="scrollProgress"></div>
<header class="site-header transparent" id="siteHeader">
  <div class="header-inner">

    <!-- Logo: CEYSAN & Pimapen ortaklık -->
    <div class="site-logo-group">
      <a href="index.html" class="site-logo" aria-label="CEYSAN Ana Sayfa">
        <img src="${co.logo}" alt="CEYSAN Alüminyum" width="140" height="40"
             onerror="this.classList.add('broken')">
        <span class="logo-text">CEYSAN</span>
      </a>
      <span class="logo-divider" aria-hidden="true">&amp;</span>
      <div class="partner-logos-col">
        <a href="https://www.pimapen.com.tr" class="partner-logo" target="_blank" rel="noopener" aria-label="Pimapen Yetkili Bayii">
          <img src="https://pimapen.com.tr/site/img/logo.svg" alt="Pimapen" height="24" width="auto">
        </a>
        <a href="https://www.isicam.com.tr" class="partner-logo partner-logo-isicam" target="_blank" rel="noopener" aria-label="Isıcam Sistemleri Yetkili Bayii">
          <svg class="isicam-svg-logo" viewBox="0 0 110 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Isıcam Sistemleri">
            <!-- Glass pane icon -->
            <rect x="0" y="1" width="7" height="9" rx="1" fill="currentColor" opacity=".9"/>
            <rect x="8.5" y="1" width="7" height="9" rx="1" fill="currentColor" opacity=".9"/>
            <rect x="0" y="11.5" width="15.5" height="5" rx="1" fill="currentColor" opacity=".55"/>
            <!-- "Isıcam" text -->
            <text x="19" y="11" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="700" fill="currentColor" letter-spacing=".3">ISICAM</text>
            <!-- "Sistemleri" text -->
            <text x="19" y="17" font-family="Arial, Helvetica, sans-serif" font-size="6" font-weight="500" fill="currentColor" opacity=".7" letter-spacing=".8">SİSTEMLERİ</text>
          </svg>
        </a>
      </div>
    </div>

    <nav class="site-nav" aria-label="Ana Navigasyon">
      ${navA('home', 'index.html', 'nav_home')}

      <div class="nav-item">
        <a href="urunler.html" class="nav-link has-dropdown${active === 'products' ? ' active' : ''}">
          ${t('nav_products')}
          <svg class="arrow" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </a>
        <div class="mmx" id="mmx" role="navigation" aria-label="Ürün kategorileri">
          <div class="mmx-head">
            <span class="mmx-kicker">Ürün Aileleri</span>
            <a href="urunler.html" class="mmx-all">Tüm Ürünler
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
          <div class="mmx-grid">
            <a class="mmx-card mmx-card--feat" href="urunler.html#cam-balkon-sistemleri">
              <img src="https://ceysanaluminyum.com/resimler/urungrubu/urun_urungrubu_1730795591592836906.jpeg" alt="Cam Balkon" loading="lazy" onerror="this.src='https://ceysanaluminyum.com/resimler/urungrubu/resim_yok.png'">
              <div class="mmx-card-body">
                <span class="mmx-card-cat">Cam Sistemleri</span>
                <h3>Cam Balkon</h3>
              </div>
              <svg class="mmx-card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </a>
            <a class="mmx-card" href="urunler.html#giyotin-cam-balkon-sistemleri">
              <img src="https://ceysanaluminyum.com/resimler/urungrubu/urun_urungrubu_1730795825129986665.jfif" alt="Giyotin Cam" loading="lazy" onerror="this.src='https://ceysanaluminyum.com/resimler/urungrubu/resim_yok.png'">
              <div class="mmx-card-body">
                <span class="mmx-card-cat">Cam Sistemleri</span>
                <h3>Giyotin Cam</h3>
              </div>
              <svg class="mmx-card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </a>
            <a class="mmx-card" href="urunler.html#pimapen-pencere-sistemleri">
              <img src="https://ceysanaluminyum.com/resimler/urungrubu/urun_urungrubu_1730796158940348448.jpg" alt="Pimapen Pencere" loading="lazy" onerror="this.src='https://ceysanaluminyum.com/resimler/urungrubu/resim_yok.png'">
              <div class="mmx-card-body">
                <span class="mmx-card-cat">Pencere &amp; Doğrama</span>
                <h3>Pimapen Pencere</h3>
              </div>
              <svg class="mmx-card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </a>
            <a class="mmx-card" href="urunler.html#aluminyum-dograma-sistemleri">
              <img src="https://ceysanaluminyum.com/resimler/urungrubu/urun_urungrubu_17307956391740415725.jpeg" alt="Alüminyum Doğrama" loading="lazy" onerror="this.src='https://ceysanaluminyum.com/resimler/urungrubu/resim_yok.png'">
              <div class="mmx-card-body">
                <span class="mmx-card-cat">Pencere &amp; Doğrama</span>
                <h3>Alüminyum Doğrama</h3>
              </div>
              <svg class="mmx-card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </a>
            <a class="mmx-card" href="urunler.html#otomatik-pergole-sistemleri">
              <img src="https://ceysanaluminyum.com/resimler/urungrubu/urun_urungrubu_1730795703876593671.jfif" alt="Otomatik Pergole" loading="lazy" onerror="this.src='https://ceysanaluminyum.com/resimler/urungrubu/resim_yok.png'">
              <div class="mmx-card-body">
                <span class="mmx-card-cat">Dış Mekan</span>
                <h3>Otomatik Pergole</h3>
              </div>
              <svg class="mmx-card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </a>
          </div>
          <div class="mmx-foot">
            <span class="mmx-foot-note">Ücretsiz keşif &amp; yerinde ölçüm — İstanbul geneli</span>
            <a href="teklif.html" class="mmx-foot-cta">Hemen Teklif Alın
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </div>
      </div>

      ${navA('corporate', 'kurumsal.html', 'nav_corporate')}
      ${navA('gallery',   'galeri.html',   'nav_gallery')}
      ${navA('contact',   'iletisim.html', 'nav_contact')}
    </nav>

    <div class="header-actions">
      <button class="btn-search" id="searchTrigger" aria-label="Ara">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </button>

      <div class="lang-toggle" role="group" aria-label="Dil seçimi">
        <button class="lang-btn${!isEn ? ' active' : ''}" data-lang="tr" aria-pressed="${!isEn}">TR</button>
        <button class="lang-btn${isEn  ? ' active' : ''}" data-lang="en" aria-pressed="${isEn}">EN</button>
      </div>

      <a href="teklif.html" class="btn-header-cta" data-i18n="nav_quote">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
        ${t('nav_quote')}
      </a>
    </div>

    <button class="hamburger" id="hamburger" aria-label="Menü" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>

  </div>
</header>

<!-- Mobile Nav -->
<nav class="mobile-nav" id="mobileNav" aria-label="Mobil Navigasyon">
  <a href="index.html"    class="mobile-nav-link" data-i18n="nav_home">${t('nav_home')}</a>
  <a href="urunler.html"  class="mobile-nav-link" data-i18n="nav_products">${t('nav_products')}</a>
  <a href="kurumsal.html" class="mobile-nav-link" data-i18n="nav_corporate">${t('nav_corporate')}</a>
  <a href="galeri.html"   class="mobile-nav-link" data-i18n="nav_gallery">${t('nav_gallery')}</a>
  <a href="iletisim.html" class="mobile-nav-link" data-i18n="nav_contact">${t('nav_contact')}</a>
  <a href="teklif.html"   class="mobile-nav-link" style="margin-top:1rem;" data-i18n="nav_quote">${t('nav_quote')}</a>
  <div class="lang-toggle" style="margin-top:1.5rem;background:rgba(255,255,255,.08);">
    <button class="lang-btn${!isEn ? ' active' : ''}" data-lang="tr">TR</button>
    <button class="lang-btn${isEn  ? ' active' : ''}" data-lang="en">EN</button>
  </div>
</nav>

<!-- Search Modal -->
<div class="search-modal" id="searchModal" role="dialog" aria-modal="true" aria-label="Ürün Arama">
  <div class="search-box">
    <div class="search-input-wrap">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="search" id="search-input" placeholder="${t('search_ph')}" autocomplete="off" spellcheck="false">
      <button id="searchClose" style="color:var(--c-silver)" aria-label="Kapat">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="search-results" id="searchResults"></div>
    <div class="search-footer">
      <span><kbd>ESC</kbd> ${t('search_hint1')}</span>
      <span><kbd>↵</kbd> ${t('search_hint2')}</span>
    </div>
  </div>
</div>
  `;

  /* ── Footer HTML ─────────────────────────────────────────────── */
  const footerHTML = () => `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">

      <!-- Brand -->
      <div class="footer-logo-col">
        <a href="index.html" class="footer-logo">
          <img src="${co.logo}" alt="CEYSAN Alüminyum" width="120" height="36">
        </a>
        <p class="footer-desc" data-i18n="footer_desc">${t('footer_desc')}</p>
        <div class="social-links">
          <a href="${co.instagram}" class="social-link" target="_blank" rel="noopener" aria-label="Instagram">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <a href="${co.facebook}" class="social-link" target="_blank" rel="noopener" aria-label="Facebook">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
          </a>
          <a href="https://api.whatsapp.com/send?phone=${co.wa}" class="social-link" target="_blank" rel="noopener" aria-label="WhatsApp">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
        </div>
      </div>

      <!-- Menu -->
      <div>
        <h3 class="footer-heading" data-i18n="footer_menu">${t('footer_menu')}</h3>
        <div class="footer-links">
          <a href="index.html"    class="footer-link" data-i18n="nav_home">${t('nav_home')}</a>
          <a href="urunler.html"  class="footer-link" data-i18n="nav_products">${t('nav_products')}</a>
          <a href="kurumsal.html" class="footer-link" data-i18n="nav_corporate">${t('nav_corporate')}</a>
          <a href="galeri.html"   class="footer-link" data-i18n="nav_gallery">${t('nav_gallery')}</a>
          <a href="teklif.html"   class="footer-link" data-i18n="nav_quote">${t('nav_quote')}</a>
          <a href="iletisim.html" class="footer-link" data-i18n="nav_contact">${t('nav_contact')}</a>
        </div>
      </div>

      <!-- Products -->
      <div>
        <h3 class="footer-heading" data-i18n="footer_products">${t('footer_products')}</h3>
        <div class="footer-links">
          <a href="urunler.html" class="footer-link">Cam Balkon</a>
          <a href="urunler.html" class="footer-link">Pimapen Pencere</a>
          <a href="urunler.html" class="footer-link">Alüminyum Doğrama</a>
          <a href="urunler.html" class="footer-link">Otomatik Pergole</a>
          <a href="urunler.html" class="footer-link">Panjur Sistemleri</a>
          <a href="sineklik-siparis.html" class="footer-link">Sineklik</a>
        </div>
      </div>

      <!-- Contact -->
      <div>
        <h3 class="footer-heading" data-i18n="footer_contact">${t('footer_contact')}</h3>
        <div class="footer-contact-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span data-i18n="contact_address">${t('contact_address')}</span>
        </div>
        <div class="footer-contact-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5 19.79 19.79 0 01.5 4.18C.5 3.09 1.38 2 2.5 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          <div>
            <a href="tel:${co.phone1}" style="display:block">${co.phone1_fmt}</a>
            <a href="tel:${co.phone2}">${co.phone2_fmt}</a>
          </div>
        </div>
        <div class="footer-contact-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <a href="mailto:${co.email}">${co.email}</a>
        </div>
      </div>

    </div>

    <div class="footer-bottom">
      <span data-i18n="footer_copy">${t('footer_copy')}</span>
      <span>Ümraniye / İstanbul</span>
    </div>
  </div>
</footer>

<!-- WhatsApp Float -->
<div class="wa-float">
  <span class="wa-tooltip" data-i18n="wa_tooltip">${t('wa_tooltip')}</span>
  <a href="https://api.whatsapp.com/send?phone=${co.wa}&text=Merhaba%2C%20bilgi%20almak%20istiyorum."
     class="wa-btn" target="_blank" rel="noopener" aria-label="WhatsApp">
    <div class="wa-pulse"></div>
    <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  </a>
</div>

<!-- Toast -->
<div class="toast" id="toast" role="alert" aria-live="polite"></div>
  `;

  /* ── Inject Components ───────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    // Header
    const headerEl = document.getElementById('header-mount');
    if (headerEl) {
      headerEl.outerHTML = headerHTML();
      initHeader();
    }

    // Footer
    const footerEl = document.getElementById('footer-mount');
    if (footerEl) {
      footerEl.outerHTML = footerHTML();
    }

    // Floating WhatsApp + Back-to-top
    injectFloatingWidgets();

    initSearch();
    initLangToggle();
  });

  /* ── Header Behaviour ────────────────────────────────────────── */
  function initHeader() {
    const header   = document.getElementById('siteHeader');
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const progress  = document.getElementById('scrollProgress');

    if (!header) return;

    // Scroll handler
    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle('transparent', y < 60);
      header.classList.toggle('scrolled',    y >= 60);

      // Scroll progress bar
      if (progress) {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = total > 0 ? `${(y / total) * 100}%` : '0%';
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Hamburger
    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('open');
        mobileNav.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      // Close on nav link click
      mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('open');
          mobileNav.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }
  }

  /* ── Search ──────────────────────────────────────────────────── */
  function initSearch() {
    const trigger   = document.getElementById('searchTrigger');
    const modal     = document.getElementById('searchModal');
    const closeBtn  = document.getElementById('searchClose');
    const input     = document.getElementById('search-input');
    const results   = document.getElementById('searchResults');

    if (!modal || !input) return;

    // Fuse.js setup
    const lang = localStorage.getItem('ceysan_lang') || 'tr';
    const fuseItems = CEYSAN.products.map(p => ({
      id:    p.id,
      slug:  p.slug,
      name:  lang === 'tr' ? p.tr_name : p.en_name,
      desc:  lang === 'tr' ? p.tr_desc : p.en_desc,
      tags:  (lang === 'tr' ? p.tr_tags : p.en_tags).join(' '),
      image: p.image,
    }));

    let fuse;
    if (window.Fuse) {
      fuse = new window.Fuse(fuseItems, {
        keys: [
          { name: 'name', weight: 3 },
          { name: 'tags', weight: 2 },
          { name: 'desc', weight: 1 },
        ],
        threshold: 0.4,
        includeMatches: true,
        minMatchCharLength: 2,
      });
    }

    const openModal = () => {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => input.focus(), 150);
    };

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      input.value = '';
      results.innerHTML = '';
    };

    if (trigger) trigger.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openModal();
      }
    });

    // Search input
    let debounceTimer;
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => renderResults(input.value.trim()), 120);
    });

    function renderResults(query) {
      if (!query) { results.innerHTML = ''; return; }

      const i18n = CEYSAN.i18n[lang];

      if (!fuse) {
        // Fallback: simple includes
        const filtered = fuseItems.filter(p =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.toLowerCase().includes(query.toLowerCase())
        );
        displayResults(filtered.map(p => ({ item: p })), i18n);
        return;
      }

      const raw = fuse.search(query);
      displayResults(raw, i18n);
    }

    function displayResults(items, i18n) {
      if (!items.length) {
        results.innerHTML = `<div class="search-empty">${i18n.search_no}</div>`;
        return;
      }

      results.innerHTML = items.slice(0, 8).map(({ item }) => `
        <div class="search-result-item" role="button" tabindex="0"
             onclick="location.href='urunler.html#${item.slug}'"
             onkeydown="if(event.key==='Enter')location.href='urunler.html#${item.slug}'">
          <img class="search-result-img" src="${item.image}" alt="${item.name}"
               loading="lazy" onerror="this.src='https://ceysanaluminyum.com/resimler/urungrubu/resim_yok.png'">
          <div>
            <div class="search-result-name">${item.name}</div>
            <div class="search-result-tag">${item.desc.slice(0, 70)}…</div>
          </div>
        </div>
      `).join('');
    }
  }

  /* ── Language Toggle ─────────────────────────────────────────── */
  function initLangToggle() {
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        localStorage.setItem('ceysan_lang', lang);
        location.reload();
      });
    });
  }

  /* ── Toast ───────────────────────────────────────────────────── */
  window.CEYSAN.showToast = function (msg, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.className = `toast ${type} show`;
    setTimeout(() => { toast.classList.remove('show'); }, 3500);
  };

  /* ── Floating Widgets: WhatsApp + Back-to-top ────────────────── */
  function injectFloatingWidgets() {
    // Avoid double-inject
    if (document.getElementById('floatWidgets')) return;

    const el = document.createElement('div');
    el.id = 'floatWidgets';
    el.innerHTML = `
      <a id="floatWA"
         href="https://api.whatsapp.com/send?phone=905324514233&text=Merhaba%2C%20bilgi%20almak%20istiyorum."
         target="_blank" rel="noopener" aria-label="WhatsApp'tan Yaz">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span class="float-wa-label">Bize Yazın</span>
      </a>
      <button id="floatTop" aria-label="Yukarı çık" onclick="window.scrollTo({top:0,behavior:'smooth'})">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
      </button>
    `;
    document.body.appendChild(el);

    // Show/hide back-to-top based on scroll
    const topBtn = el.querySelector('#floatTop');
    const onScroll = () => {
      topBtn.classList.toggle('visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── AI Chat Widget ──────────────────────────────────────────── */
  function loadChatBot() {
    const s = document.createElement('script');
    s.src = 'js/chat-bot.js';
    s.defer = true;
    document.body.appendChild(s);
  }

  loadChatBot();

})();
