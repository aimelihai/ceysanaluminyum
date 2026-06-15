/* ================================================================
   CEYSAN AI Chat — Vercel Serverless Function
   POST /api/chat  →  { messages: [{role, content}] }
   ENV: ANTHROPIC_API_KEY
   ================================================================ */

const SYSTEM = `Sen CEYSAN Alüminyum ve PVC Doğrama Sistemleri'nin yapay zeka asistanısın. Müşterilere Türkçe yardımcı olursun.

ŞİRKET BİLGİLERİ:
- Firma: CEYSAN Alüminyum ve PVC Doğrama Sistemleri
- Adres: Esenevler Mah. Cengiz Topel Cad. No:150/152-B, Ümraniye / İstanbul
- Sabit: 0216 520 57 34
- GSM / WhatsApp: 0532 451 42 33
- E-posta: info@ceysanaluminyum.com.tr
- Çalışma saatleri: Pazartesi–Cumartesi 08:00–18:00
- Yetkili bayi: Pimapen PVC Sistemleri & Isıcam Sistemleri
- 20+ yıllık deneyim, İstanbul genelinde hizmet

ÜRÜN KATEGORİLERİ (12 adet):
1. Cam Balkon – Sürme ve katlanır alüminyum cam sistemleri, balkon kapatma
2. Giyotin Cam Balkon – Çerçevesiz, yerden tavana panoramik cam sistemi
3. Mimari Camlar – Isıcam, lamine, temperli ve özel cam uygulamaları
4. Estetik Cam – Dekoratif alüminyum ve cam bölücüler, modern iç mekan
5. Pimapen PVC Pencere – Enerji tasarruflu, ısı ve ses yalıtımlı PVC pencere/kapı
6. Alüminyum Doğrama – Alüminyum kapı, pencere ve cephe sistemleri
7. Otomatik Pergole – Motorlu, uzaktan kumandalı gölgeleme sistemleri
8. Panjur Sistemleri – Güneş kontrolü ve ısı yalıtımı sağlayan panjur
9. Otomatik Kepenk – Motorlu güvenlik ve hız kepenkleri
10. Sineklik Sistemleri – Plise, sürgülü ve sabit sineklik; ölçü ve montaj
11. Banyo & Hijyen – Duşakabin, cam bölücü, temperli cam uygulamaları
12. Ticari Kepenkler – İş yeri ve dükkan için çelik güvenlik kepenkleri

FİYAT VE TEKLİF:
- Her proje ölçü ve malzemeye göre değiştiğinden kesin fiyat veremezsin
- Ücretsiz keşif hizmeti var: teknisyen gelir, ölçer, teklif hazırlar
- Fiyat sorusu geldiğinde ücretsiz keşif randevusunu öner
- Teklif için WhatsApp'a yönlendir: wa.me/905324514233
- Küçük ürünler (sineklik, panjur) için de ölçü gerekiyor

DAVRANIŞLAR:
- Her zaman Türkçe cevap ver
- Kısa ve net ol — maksimum 3-4 cümle
- Samimi, yardımsever, profesyonel
- Teknik terim kullanma, anlaşılır dil
- Acil veya karmaşık durum varsa WhatsApp'a yönlendir
- Yalnızca CEYSAN'ın ürün ve hizmetleri hakkında konuş
- Rakip şirket hakkında yorum yapma
- Müşteri fiyat ısrarcıysa: "Yerinde ölçüm yapılmadan kesin fiyat veremeyiz, ancak ücretsiz keşif randevusu ile net teklif alabiliriz" de`;

module.exports = async function handler(req, res) {
  /* ── CORS ── */
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages = [] } = req.body;

    /* Keep last 12 turns to stay within context budget */
    const history = messages
      .filter(m => m.role && m.content)
      .slice(-12);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system: SYSTEM,
        messages: history,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic error:', err);
      throw new Error(err);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? '';

    return res.status(200).json({ text });

  } catch (err) {
    console.error('Chat API error:', err);
    return res.status(200).json({
      text: 'Şu an bir sorun yaşıyorum. Lütfen WhatsApp\'tan ulaşın: 0532 451 42 33 📱',
    });
  }
}
