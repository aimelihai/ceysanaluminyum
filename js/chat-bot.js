/* ================================================================
   CEYSAN AI Chat Widget
   Self-mounting floating assistant — Claude-powered, Turkish-first
   ================================================================ */

(function () {
  'use strict';

  /* ── Config ─────────────────────────────────────────────────── */
  const WA_URL      = 'https://wa.me/905324514233?text=Merhaba%2C%20bilgi%20almak%20istiyorum.';
  const STORAGE_KEY = 'ceysan_chat_v1';
  const MAX_MSGS    = 20; // saved in sessionStorage

  /* ── Kural tabanlı yanıt motoru ─────────────────────────────── */
  const RULES = [
    {
      keys: ['merhaba', 'selam', 'günaydın', 'iyi akşam', 'iyi günler', 'hay', 'hello', 'hi'],
      replies: [
        'Merhaba! 😊 Size nasıl yardımcı olabilirim? Cam balkon, PVC pencere, pergole veya diğer ürünlerimiz hakkında soru sorabilirsiniz.',
        'Hoş geldiniz! CEYSAN Alüminyum olarak 20 yılı aşkın deneyimimizle hizmetinizdeyiz. Ne öğrenmek istersiniz?',
      ],
    },
    {
      keys: ['ürün', 'ne yapıyorsunuz', 'ne satıyorsunuz', 'hizmetler', 'çeşit', 'neler'],
      replies: [
        'Başlıca ürünlerimiz: Cam Balkon, Giyotin Cam Balkon, PVC Pencere (Pimapen bayi), Alüminyum Doğrama, Otomatik Pergole, Panjur, Kepenk, Sineklik ve Banyo Cam Uygulamaları. Detaylı bilgi için WhatsApp\'tan ulaşabilirsiniz: 0532 451 42 33 💬',
      ],
    },
    {
      keys: ['cam balkon', 'cambalkon', 'balkon cam', 'balkon kapatma'],
      replies: [
        'Cam balkon sistemlerimiz alüminyum profil ile sürme ya da katlanır olarak yapılmaktadır. Balkonunuzu four-seasons odaya dönüştürür, yağmur ve rüzgardan korur. Ölçü ve malzemeye göre fiyat değiştiğinden ücretsiz keşif öneriyoruz. 📞 0532 451 42 33',
        'Cam balkon için yerinde ölçüm yapılmadan net fiyat veremiyoruz — her balkon farklıdır. Uzmanlarımız ücretsiz gelip ölçer ve teklif hazırlar. WhatsApp: 0532 451 42 33',
      ],
    },
    {
      keys: ['giyotin', 'panoramik', 'çerçevesiz'],
      replies: [
        'Giyotin cam balkon sistemi çerçevesizdir; paneller yukarı kalkarak tam açılır. Yerden tavana cam görünümüyle muhteşem bir estetik sunar. Ücretsiz keşif için 0532 451 42 33\'ü arayabilirsiniz.',
      ],
    },
    {
      keys: ['pimapen', 'pvc', 'pencere', 'kapı', 'doğrama', 'çift cam', 'ısı yalıtım', 'ses yalıtım'],
      replies: [
        'Pimapen yetkili bayisiyiz. PVC pencere ve kapılarımız ısı-ses yalıtımı konusunda üst düzey performans sunar. Enerji tasarrufu sağlar, kışın ısı kaybını minimuma indirir. Teklif için: 0532 451 42 33 📞',
        'PVC (Pimapen) doğrama ürünlerimiz A sınıfı enerji verimliliği sunar. Sürme, kanat ve sabit pencere modellerimiz mevcuttur. Ücretsiz keşif randevusu için WhatsApp\'tan ulaşın: 0532 451 42 33',
      ],
    },
    {
      keys: ['pergole', 'tente', 'gölge', 'motorlu', 'otomatik'],
      replies: [
        'Otomatik pergolelerimiz uzaktan kumandalıdır; yağmur sensörü ile otomatik kapanır. Terasta veya bahçede harika bir yaşam alanı oluşturur. Detaylar için 0532 451 42 33\'ü arayın veya WhatsApp\'tan yazın.',
      ],
    },
    {
      keys: ['panjur', 'jaluzi', 'güneş', 'stor'],
      replies: [
        'Panjur sistemlerimiz güneş ışığını kontrol ederken ısı yalıtımı da sağlar. İçten ve dıştan motorlu modeller mevcuttur. Fiyat için ölçü gerektiğinden ücretsiz keşif talep edebilirsiniz: 0532 451 42 33',
      ],
    },
    {
      keys: ['kepenk', 'ticari', 'iş yeri', 'dükkan', 'güvenlik'],
      replies: [
        'Motorlu ve manuel güvenlik kepenklerimiz hem konutlar hem de ticari mekanlar için uygundur. Çelik ve alüminyum seçeneklerimiz mevcuttur. Teklif için: 0216 520 57 34 veya 0532 451 42 33',
      ],
    },
    {
      keys: ['sineklik', 'böcek', 'plise', 'sürgülü'],
      replies: [
        'Plise, sürgülü ve sabit sineklik modellerimiz vardır; her pencere boyutuna göre ölçülü üretilir. Montaj da tarafımızdan yapılmaktadır. Bilgi için WhatsApp: 0532 451 42 33 💬',
      ],
    },
    {
      keys: ['duşakabin', 'duş', 'banyo', 'hijyen', 'cam bölücü'],
      replies: [
        'Temperli cam duşakabin ve banyo cam bölücülerimiz mevcuttur. Farklı açılma sistemleri (kayar, menteşeli, sabit) sunuyoruz. Ölçülü üretim yaptığımızdan ücretsiz keşif öneririz: 0532 451 42 33',
      ],
    },
    {
      keys: ['isıcam', 'mimari cam', 'lamine', 'temperli'],
      replies: [
        'Isıcam sistemleri yetkili bayisiyiz. Lamine, temperli ve özel mimari cam uygulamaları da yapıyoruz. Projeniz için detaylı bilgi almak ister misiniz? 0532 451 42 33',
      ],
    },
    {
      keys: ['fiyat', 'ücret', 'para', 'maliyet', 'kadar', 'ne kadar', 'tutar', 'teklif', 'fiyatlandırma'],
      replies: [
        'Ürünlerimizin fiyatı ölçü, malzeme ve uygulama tipine göre farklılık gösterir. Kesin fiyat için ücretsiz keşif hizmetimizden yararlanabilirsiniz — uzmanlarımız gelir, ölçer ve net teklif hazırlar. WhatsApp: 0532 451 42 33 💬',
        'Yerinde ölçüm yapılmadan kesin fiyat veremiyoruz. Ancak ücretsiz keşif randevusu ile net teklif alabilirsiniz. Randevu için: 0532 451 42 33 veya 0216 520 57 34',
      ],
    },
    {
      keys: ['keşif', 'randevu', 'gelin', 'bakın', 'ölçün', 'ziyaret', 'gelir misiniz'],
      replies: [
        'Ücretsiz keşif için WhatsApp\'tan veya telefonla ulaşabilirsiniz. Uzmanlarımız uygun bir zamanda gelip ölçüm yapar ve teklif hazırlar. 📞 0532 451 42 33 | 0216 520 57 34',
      ],
    },
    {
      keys: ['telefon', 'numara', 'ara', 'call', 'iletişim', 'ulaş', 'whatsapp', 'wp', 'yazın'],
      replies: [
        'Bize şu kanallardan ulaşabilirsiniz:\n📞 Sabit: 0216 520 57 34\n📱 GSM/WhatsApp: 0532 451 42 33\n✉️ E-posta: info@ceysanaluminyum.com.tr\nÇalışma saatlerimiz: Pzt–Cmt 08:00–18:00',
      ],
    },
    {
      keys: ['adres', 'konum', 'nerede', 'showroom', 'mağaza', 'ümraniye'],
      replies: [
        'Showroom adresimiz: Esenevler Mah. Cengiz Topel Cad. No:150/152-B, Ümraniye / İstanbul. Pazartesi–Cumartesi 08:00–18:00 saatleri arasında ziyaret edebilirsiniz. 🗺️',
      ],
    },
    {
      keys: ['saat', 'çalışma', 'açık', 'kapalı', 'kaçta', 'hafta'],
      replies: [
        'Çalışma saatlerimiz: Pazartesi–Cumartesi 08:00–18:00. Pazar günleri kapalıyız. 🕐',
      ],
    },
    {
      keys: ['garanti', 'sertifika', 'kalite', 'marka', 'güvence'],
      replies: [
        'Ürünlerimiz sertifikalı ve garantilidir. Pimapen ve Isıcam gibi köklü markaların yetkili bayisiyiz. 20+ yıllık deneyimle işçilik garantisi de veriyoruz. Detaylar için: 0532 451 42 33',
      ],
    },
    {
      keys: ['montaj', 'kurulum', 'takma', 'yerleştirme'],
      replies: [
        'Montaj hizmetimiz mevcuttur; profesyonel ekibimiz ürünlerinizi teslim eder ve kurar. Montaj dahil fiyat teklifi için ücretsiz keşif talep edebilirsiniz: 0532 451 42 33 📞',
      ],
    },
    {
      keys: ['teşekkür', 'sağ ol', 'tamam', 'anladım', 'oldu', 'harika', 'süper'],
      replies: [
        'Rica ederim! Başka bir sorunuz olursa buradayım. İyi günler! 😊',
        'Ne zaman isterseniz yardımcı olmaktan memnuniyet duyarım. İyi günler! 🌟',
      ],
    },
  ];

  function getLocalReply(input) {
    const q = input.toLowerCase()
      .replace(/[çÇ]/g, 'c').replace(/[şŞ]/g, 's').replace(/[ğĞ]/g, 'g')
      .replace(/[üÜ]/g, 'u').replace(/[öÖ]/g, 'o').replace(/[ıİ]/g, 'i');

    let best = null, bestScore = 0;
    for (const rule of RULES) {
      const score = rule.keys.reduce((s, k) => {
        const kn = k.toLowerCase()
          .replace(/[çÇ]/g, 'c').replace(/[şŞ]/g, 's').replace(/[ğĞ]/g, 'g')
          .replace(/[üÜ]/g, 'u').replace(/[öÖ]/g, 'o').replace(/[ıİ]/g, 'i');
        return s + (q.includes(kn) ? kn.length : 0);
      }, 0);
      if (score > bestScore) { bestScore = score; best = rule; }
    }
    if (best && bestScore > 0) {
      return best.replies[Math.floor(Math.random() * best.replies.length)];
    }
    return 'Sorunuzu tam anlayamadım. Detaylı bilgi için WhatsApp\'tan ulaşabilirsiniz: 0532 451 42 33 💬 veya 0216 520 57 34 numaralı hattımızı arayabilirsiniz.';
  }

  const WELCOME = 'Merhaba! 👋 CEYSAN Alüminyum\'a hoş geldiniz. Cam balkon, PVC pencere, pergole ve daha fazlası hakkında size yardımcı olabilirim.';

  const QUICK_REPLIES = [
    { label: 'Ürünleriniz neler?',        msg: 'Hangi ürünleri yapıyorsunuz?' },
    { label: 'Ücretsiz keşif istiyorum',  msg: 'Ücretsiz keşif randevusu almak istiyorum.' },
    { label: 'Cam balkon fiyatı?',        msg: 'Cam balkon sistemlerinin fiyatı ne kadar?' },
    { label: 'WhatsApp\'tan yaz →',       msg: null, href: WA_URL },
  ];

  /* ── State ───────────────────────────────────────────────────── */
  let messages   = [];   // [{ role: 'user'|'assistant', content: '' }]
  let isLoading  = false;
  let quickDismissed = false;

  /* ── DOM refs ────────────────────────────────────────────────── */
  let $root, $panel, $messages, $input, $send, $toggle;

  /* ── SVGs ────────────────────────────────────────────────────── */
  const SVG_STAR = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>`;

  const SVG_CLOSE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>`;

  const SVG_SEND = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>`;

  const SVG_WA = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

  /* ── Mount ───────────────────────────────────────────────────── */
  function mount() {
    const el = document.createElement('div');
    el.id = 'ceysanChat';
    el.className = 'cx-chat';
    el.setAttribute('role', 'complementary');
    el.setAttribute('aria-label', 'CEYSAN AI Asistan');

    el.innerHTML = `
      <!-- Panel -->
      <div class="cx-panel" id="cxPanel" hidden aria-live="polite" aria-label="Sohbet penceresi">
        <!-- Header -->
        <div class="cx-head">
          <div class="cx-head-left">
            <div class="cx-avatar" aria-hidden="true">${SVG_STAR}</div>
            <div>
              <span class="cx-head-name">CEYSAN Asistan</span>
              <span class="cx-head-status">● Çevrimiçi</span>
            </div>
          </div>
          <button class="cx-close" id="cxClose" aria-label="Sohbeti kapat">${SVG_CLOSE}</button>
        </div>
        <!-- Messages -->
        <div class="cx-messages" id="cxMessages" role="log" aria-label="Sohbet mesajları"></div>
        <!-- Input -->
        <div class="cx-input-area">
          <input class="cx-input" id="cxInput"
            type="text" placeholder="Mesajınızı yazın…"
            autocomplete="off" maxlength="500"
            aria-label="Mesaj yazın">
          <button class="cx-send" id="cxSend" aria-label="Mesaj gönder">${SVG_SEND}</button>
        </div>
      </div>

      <!-- Toggle button -->
      <button class="cx-toggle" id="cxToggle"
        aria-label="CEYSAN AI Asistanı aç"
        aria-expanded="false"
        aria-controls="cxPanel">
        <span class="cx-icon-open"  aria-hidden="true">${SVG_STAR}</span>
        <span class="cx-icon-close" aria-hidden="true">${SVG_CLOSE}</span>
      </button>
    `;

    document.body.appendChild(el);

    /* Cache refs */
    $root     = el;
    $panel    = document.getElementById('cxPanel');
    $messages = document.getElementById('cxMessages');
    $input    = document.getElementById('cxInput');
    $send     = document.getElementById('cxSend');
    $toggle   = document.getElementById('cxToggle');

    /* Bind events */
    $toggle.addEventListener('click', toggle);
    document.getElementById('cxClose').addEventListener('click', closePanel);
    $send.addEventListener('click', onSend);
    $input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); }
    });

    /* Keyboard: Escape closes */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !$panel.hidden) closePanel();
    });

    /* Load session history or show welcome */
    loadHistory();

    if (messages.length === 0) {
      renderBotBubble(WELCOME);
      renderQuickReplies();
    } else {
      messages.forEach(m => renderBubble(m.role, m.content, false));
    }
  }

  /* ── Panel open / close ──────────────────────────────────────── */
  function toggle() {
    $panel.hidden ? openPanel() : closePanel();
  }

  function openPanel() {
    $panel.hidden = false;
    $root.classList.add('is-open');
    $toggle.setAttribute('aria-expanded', 'true');
    scrollBottom();
    requestAnimationFrame(() => $input.focus());
  }

  function closePanel() {
    $panel.hidden = true;
    $root.classList.remove('is-open');
    $toggle.setAttribute('aria-expanded', 'false');
  }

  /* ── Quick replies ───────────────────────────────────────────── */
  function renderQuickReplies() {
    const wrap = document.createElement('div');
    wrap.className = 'cx-quick-replies';
    wrap.id = 'cxQuickReplies';

    QUICK_REPLIES.forEach(({ label, msg, href }) => {
      const btn = document.createElement('button');
      btn.className = 'cx-chip';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        removeQuickReplies();
        if (href) {
          window.open(href, '_blank', 'noopener');
        } else {
          processUserMessage(msg);
        }
      });
      wrap.appendChild(btn);
    });

    $messages.appendChild(wrap);
    scrollBottom();
  }

  function removeQuickReplies() {
    document.getElementById('cxQuickReplies')?.remove();
    quickDismissed = true;
  }

  /* ── Send ────────────────────────────────────────────────────── */
  function onSend() {
    const text = $input.value.trim();
    if (!text || isLoading) return;
    $input.value = '';
    removeQuickReplies();
    processUserMessage(text);
  }

  async function processUserMessage(text) {
    /* Render user bubble */
    renderBubble('user', text);
    pushHistory('user', text);

    /* Start loading */
    isLoading = true;
    $send.disabled = true;
    const $typing = showTyping();

    /* Simulate a short thinking delay then answer locally — no network needed */
    await new Promise(r => setTimeout(r, 600 + Math.random() * 500));

    hideTyping($typing);
    const reply = getLocalReply(text);
    renderBotBubble(reply);
    pushHistory('assistant', reply);

    /* Offer WA after 3rd bot reply */
    const botCount = messages.filter(m => m.role === 'assistant').length;
    if (botCount === 3 && !quickDismissed) {
      renderWaHandoff();
    }

    isLoading = false;
    $send.disabled = false;
    $input.focus();
  }

  /* ── Bubble rendering ────────────────────────────────────────── */
  function renderBubble(role, content, animate = true) {
    const wrap = document.createElement('div');
    wrap.className = `cx-msg cx-msg--${role === 'user' ? 'user' : 'bot'}`;
    if (animate) wrap.style.opacity = '0';

    const p = document.createElement('p');
    p.textContent = content;
    wrap.appendChild(p);
    $messages.appendChild(wrap);
    scrollBottom();

    if (animate) {
      requestAnimationFrame(() => {
        wrap.style.transition = 'opacity .18s ease';
        wrap.style.opacity = '1';
      });
    }
    return wrap;
  }

  function renderBotBubble(text) {
    return renderBubble('assistant', text);
  }

  function renderWaHandoff() {
    const a = document.createElement('a');
    a.className = 'cx-wa-handoff';
    a.href = WA_URL;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.innerHTML = `${SVG_WA} Daha fazlası için WhatsApp`;
    $messages.appendChild(a);
    scrollBottom();
  }

  /* ── Typing indicator ────────────────────────────────────────── */
  function showTyping() {
    const el = document.createElement('div');
    el.className = 'cx-typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    $messages.appendChild(el);
    scrollBottom();
    return el;
  }

  function hideTyping(el) {
    el?.remove();
  }

  /* ── History ─────────────────────────────────────────────────── */
  function pushHistory(role, content) {
    messages.push({ role, content });
    if (messages.length > MAX_MSGS) messages = messages.slice(-MAX_MSGS);
    saveHistory();
  }

  function saveHistory() {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
  }

  function loadHistory() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) messages = JSON.parse(raw);
    } catch {}
  }

  /* ── Scroll ──────────────────────────────────────────────────── */
  function scrollBottom() {
    requestAnimationFrame(() => {
      $messages.scrollTop = $messages.scrollHeight;
    });
  }

  /* ── Bootstrap ───────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

})();
