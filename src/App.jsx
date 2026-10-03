import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, MotionConfig, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

/* ============================ KONFIGURASI ============================ */
const NAME = 'Saffanah';
const FROM = 'Radith';
const START_DATE = '2025-10-03T00:00:00'; // GANTI: tanggal jadian kalian
const WHATSAPP = '6283137723555'; // GANTI (opsional): nomor Radith, contoh '628123456789'

const ASSETS = {
  background: '/bg-utama.jpg', envelopeClosed: '/amplop-tutup.png', envelopeOpen: '/amplop-buka.png',
  storyPhoto: '/foto-awal.jpg', frame: '/frame-oval.png', flowerLeft: '/bunga-kiri.png',
  flowerRight: '/bunga-kanan.png', vinyl: '/vinyl-record.png', vinylLabel: '/foto-kita.jpg',
  song: '/Lagu-Kita.mp3', paper: '/kertas-surat.png',
};
const FONTS = {
  display: "'Cormorant Garamond', Georgia, serif",
  script: "'Great Vibes', cursive",
  hand: "'Caveat', cursive",
};
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Great+Vibes&display=swap';
const ENVELOPE = { maxWidth: 520, maxHeightVh: 76, text: { x: '50%', y: '35.5%', width: '60%' } };
const FRAME = { maxWidth: 340, photo: { x: '50%', y: '51.5%', width: '73%', height: '66.5%' } };

const STORY = [
  'Semuanya mengalir begitu aja. Dari obrolan biasa sampai akhirnya kita punya tempat buat saling cerita apapun. Tahun pertama ini bukti kalau hal-hal baik butuh waktu buat tumbuh.',
  `Terima kasih udah jadi teman debat, teman main, dan pendengar paling sabar buat aku. Perjalanan ini mungkin jauh dari kata sempurna, tapi aku bersyukur menjalaninya sama kamu, ${NAME}.`,
];

const GALLERY = [
  { src: '/galeri-1.jpg', title: 'Fotbar pertama', note: 'Disini pertama kali kita duduk sebelahan dan foto bareng pertama kita, lcuu bgt yekan' },
  { src: '/galeri-2.jpg', title: 'Couple Dino', note: 'Disini kita lucu bgt couple dino, dan dari momen sini sudah muali bnyk wishlist ku ke kamu yg terlaksanakan' },
  { src: '/galeri-3.jpg', title: 'Ramayana', note: 'disini kiat bingung jir mw kemana, jadi keramayana aja. trus bingung lagi wkwk', pos: 'center 30%' },
  { src: '/galeri-4.jpg', title: 'Gacoan kala itu', note: 'Disini mama kamu tiba tiba ngajakin aku makan gacoan bareng keluarga mu, lucu bgt' },
  { src: '/galeri-5.jpg', title: 'Trend pertama', note: 'ini trend pertama yg kita buat bareng, ingat kan videonya sayang. Lucu bgttt' },
  { src: '/galeri-6.jpg', title: 'Fotbar terakhir', note: 'ini fotbar terakhir, soalnya blm ada fotbar lagi wkwkwk', pos: 'center 30%' },
  { src: '/galeri-7.jpg', title: 'Tahun Baru', note: 'ini pertama kali kita tahun baruan bareng, disini kita jadi makin loplop' },
  { src: '/galeri-8.jpg', title: 'Teater', note: 'ini pertama kali kita nonton teater bareng, disini kita minta potbar lucu tuh' },
  { src: '/galeri-9.jpg', title: 'Mixue', note: 'Aku suka makeup mu yang ini, rasanya kyk aku ngeliat bidadari, so beautiful' },
  { src: '/galeri-10.jpg', title: 'NextLevel', note: 'Date ps pertama kita tuh, byone tekken bos' },
  { src: '/galeri-11.jpg', title: 'Babandungan', note: 'Disini kamu lucu bgt, pipinya tembem bgt wkwk, terus langganan kita tuh seblaknya' },
  { src: '/galeri-12.jpg', title: 'Jogging bareng', note: 'Ini jogging date pertama kita, terus lu ngosngosan tuh. maunya gw gendong' },
  { src: '/galeri-13.jpg', title: 'UTTARA where it all begins', note: 'ini momen makan bareng pertama kali kita disini, disini aku mulai suka sama kamu karena kmu ngertiin aku bgt' },
  { src: '/galeri-14.jpg', title: 'Pramuka', note: 'ini fotbar kita sebelum libur ujian tuh, kmu lucu bgt disini pengen aku cium' },
  { src: '/galeri-15.jpg', title: 'Bioskop', note: 'ini momen pertama kali kita nonton bioskop bareng, dan film yg kita tonton itu AADC. disini aku clingy bgt ke kmu' },
];


/* Alasan aku sayang kamu: ketuk kartu untuk membuka. Tambah/ubah sesukamu. */
const REASONS = [
  'Kamu sempurna buat aku', 'Pelukanmu ngebuat aku meleleh.', 'Kamu org yang paling bisa ngertiin aku',
  'Aku cinta kamu selamanya', 'Matamu indah banget', 'Kamu ngebuat momen kita jadi seru',
];

const LETTER = {
  paragraphs: [
    `Happy anniversary, sayangkuu ${NAME}.`,
    'Ngga kerasa ya kita udah ngelewatin banyak waktu bareng bareng sampai detik ini. Makasih banyak ya sayang udah selalu nemenin akuu di setiap keadaan, jadi rumah paling nyaman buat aku pulang, dan selalu sabar buat ngadepin aku.',
    'Kamu bener bener alasan di balik senyumku setiap harii, dan keberadaanmu bikin hari hariku jauh lebih bermakna.',
    'Semoga ke depannya kita bisa terus bareng yaa, makin langgeng, dan ngelewatin semua hal hal lainnya berdua.',
  ],
  closing: 'I love you so much babe',
  hearts: '🤍🤍',
};

const NAV = [['#opening', 'Opening'], ['#inside', 'Inside'], ['#time', 'Time'], ['#song', 'Song'], ['#memories', 'Memories'], ['#letter', 'Letter']];

/* ============================ UTILITAS ============================ */
const GlobalStyle = () => (
  <style>{`
    html{scroll-behavior:smooth;scrollbar-gutter:stable}
    html,body{margin:0!important;padding:0!important;background:#14010a}
    body{display:block!important;min-width:0!important;place-items:unset!important}
    #root{max-width:none!important;width:100%!important;margin:0!important;padding:0!important;text-align:left!important}
    @keyframes floatUp{0%{transform:translateY(105vh) translateX(0) rotate(0);opacity:0}10%{opacity:.7}90%{opacity:.5}100%{transform:translateY(-10vh) translateX(var(--dx)) rotate(var(--r));opacity:0}}
    @keyframes shimmer{to{background-position:200% center}}
    @keyframes pulseSeal{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
    .gold-text{background:linear-gradient(90deg,#b8902e,#f6e27a,#d4af37,#f6e27a,#b8902e);background-size:200% auto;-webkit-background-clip:text;background-clip:text;color:transparent;animation:shimmer 6s linear infinite}
    .grain::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:60;opacity:.07;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E")}
    @media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}.petal,.gold-text{animation:none!important}}
  `}</style>
);

function useGoogleFonts(href) {
  useEffect(() => {
    if (document.querySelector('link[data-app-fonts]')) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = href; l.dataset.appFonts = '1';
    document.head.append(l);
  }, [href]);
}

const trimCache = new Map();
function trimTransparentPadding(src, th = 16) {
  if (trimCache.has(src)) return trimCache.get(src);
  const p = new Promise((resolve) => {
    const img = new Image();
    img.onerror = () => resolve({ url: src, width: 0, height: 0 });
    img.onload = () => {
      const w = img.naturalWidth, h = img.naturalHeight, fb = { url: src, width: w, height: h };
      try {
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);
        const { data } = ctx.getImageData(0, 0, w, h);
        let x0 = w, y0 = h, x1 = -1, y1 = -1;
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++)
          if (data[(y * w + x) * 4 + 3] > th) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
        if (x1 < 0) return resolve(fb);
        const cw = x1 - x0 + 1, ch = y1 - y0 + 1;
        if (cw === w && ch === h) return resolve(fb);
        const o = document.createElement('canvas'); o.width = cw; o.height = ch;
        o.getContext('2d').drawImage(c, x0, y0, cw, ch, 0, 0, cw, ch);
        o.toBlob((b) => resolve(b ? { url: URL.createObjectURL(b), width: cw, height: ch } : fb), 'image/png');
      } catch { resolve(fb); }
    };
    img.src = src;
  });
  trimCache.set(src, p);
  return p;
}
function useTrimmedImage(src) {
  const [info, setInfo] = useState(null);
  useEffect(() => { let a = true; trimTransparentPadding(src).then((r) => a && setInfo(r)); return () => { a = false; }; }, [src]);
  return info;
}
const ratioOf = (i, f) => (i && i.width && i.height ? i.width / i.height : f);
const fmt = (s) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00');

function useLocalSet(key) {
  const [set, setSet] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')); } catch { return new Set(); }
  });
  const toggle = (v) => setSet((p) => {
    const n = new Set(p); n.has(v) ? n.delete(v) : n.add(v);
    try { localStorage.setItem(key, JSON.stringify([...n])); } catch { /* abaikan */ }
    return n;
  });
  return [set, toggle];
}

function usePlayer(src) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [t, setT] = useState({ cur: 0, dur: 0 });
  useEffect(() => {
    const a = ref.current; if (!a) return;
    const tick = () => setT({ cur: a.currentTime, dur: a.duration });
    const on = { timeupdate: tick, loadedmetadata: tick, play: () => setPlaying(true), pause: () => setPlaying(false), error: () => { setPlaying(false); setError(true); }, canplay: () => setError(false) };
    Object.entries(on).forEach(([k, f]) => a.addEventListener(k, f));
    return () => Object.entries(on).forEach(([k, f]) => a.removeEventListener(k, f));
  }, []);
  const play = useCallback(async () => { try { await ref.current?.play(); } catch (e) { if (e?.name !== 'AbortError') setError(true); } }, []);
  const toggle = useCallback(() => { const a = ref.current; if (!a) return; a.paused ? play() : a.pause(); }, [play]);
  const skip = (s) => { const a = ref.current; if (a?.duration) a.currentTime = Math.min(Math.max(0, a.currentTime + s), a.duration); };
  const seek = (r) => { const a = ref.current; if (a?.duration) a.currentTime = Math.min(Math.max(r, 0), 1) * a.duration; };
  return { ref, src, playing, error, ...t, play, toggle, skip, seek };
}

const fadeUp = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } } };
const reveal = { initial: 'hidden', whileInView: 'visible', viewport: { once: true, margin: '-80px' }, variants: fadeUp };

const Icon = ({ children, className = 'h-6 w-6', fill = 'none' }) => (
  <svg viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{children}</svg>
);
const HeartIcon = ({ filled, className = 'h-6 w-6' }) => (
  <Icon className={className} fill={filled ? 'currentColor' : 'none'}><path d="M12 21s-7.5-4.6-9.5-9.3C1.2 8.5 3 5 6.3 5c2 0 3.6 1.1 5.7 3.3C14.1 6.1 15.7 5 17.7 5 21 5 22.8 8.5 21.5 11.7 19.5 16.4 12 21 12 21z" /></Icon>
);
const PlayIcon = () => <Icon fill="currentColor" className="ml-0.5 h-6 w-6"><path stroke="none" d="M5 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L6.5 3.64A1 1 0 0 0 5 4.5z" /></Icon>;
const PauseIcon = () => <Icon><path d="M15.75 5.25v13.5m-7.5-13.5v13.5" /></Icon>;
const CloseIcon = () => <Icon><path d="M6 6l12 12M18 6L6 18" /></Icon>;
const Chevron = ({ dir }) => <Icon><path d={dir === 'right' ? 'M9 5l7 7-7 7' : 'M15 5l-7 7 7 7'} /></Icon>;

const Title = ({ children, sub, className = '' }) => (
  <motion.div {...reveal} className={`mb-14 text-center ${className}`}>
    <h2 className="gold-text text-4xl md:text-6xl" style={{ fontFamily: FONTS.script, lineHeight: 1.3 }}>{children}</h2>
    {sub && <p className="mx-auto mt-3 max-w-md text-base italic text-[#f5e7e1]/65" style={{ fontFamily: FONTS.display }}>{sub}</p>}
    <div className="mx-auto mt-5 flex items-center justify-center gap-3 text-[#d4af37]/70"><span className="h-px w-14 bg-current" /><HeartIcon filled className="h-3 w-3" /><span className="h-px w-14 bg-current" /></div>
  </motion.div>
);

/* Hati melayang di latar */
function Petals() {
  const items = useMemo(() => Array.from({ length: 16 }, (_, i) => ({
    left: `${(i * 37) % 100}%`, size: 10 + ((i * 7) % 14), dur: 16 + ((i * 5) % 14), delay: -((i * 3) % 20),
    dx: `${((i % 2 ? 1 : -1) * (30 + ((i * 11) % 60)))}px`, r: `${(i % 2 ? 1 : -1) * 120}deg`, ch: i % 3 ? '♥' : '❀',
  })), []);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {items.map((p, i) => (
        <span key={i} className="petal absolute top-0 text-[#e8a0b4]/40"
          style={{ left: p.left, fontSize: p.size, '--dx': p.dx, '--r': p.r, animation: `floatUp ${p.dur}s linear ${p.delay}s infinite` }}>{p.ch}</span>
      ))}
    </div>
  );
}

/* Ledakan hati saat layar diketuk / tombol ditekan */
function Bursts({ bursts }) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      {bursts.map((b) => Array.from({ length: b.n }, (_, k) => {
        const a = (k / b.n) * Math.PI * 2 + b.id, d = 60 + ((k * 29) % 110);
        return (
          <motion.span key={`${b.id}-${k}`} className="absolute text-[#ff8fa8]" style={{ left: b.x, top: b.y, fontSize: 14 + ((k * 5) % 16) }}
            initial={{ opacity: 1, scale: 0.4, x: 0, y: 0 }}
            animate={{ opacity: 0, scale: 1.2, x: Math.cos(a) * d, y: Math.sin(a) * d - 50 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}>♥</motion.span>
        );
      }))}
    </div>
  );
}

/* ============================ 1. AMPLOP ============================ */
function EnvelopeSection({ isOpen, onOpen }) {
  const closed = useTrimmedImage(ASSETS.envelopeClosed);
  const open = useTrimmedImage(ASSETS.envelopeOpen);
  const cur = isOpen ? open : closed;
  const ratio = ratioOf(cur, 0.6);
  return (
    <section id="opening" className="relative z-10 flex min-h-screen scroll-mt-16 flex-col items-center justify-center px-5 py-24">
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1.2 }}
        className="mb-2 text-lg italic text-[#f5e7e1]/70" style={{ fontFamily: FONTS.display }}>Untuk {NAME}, dari {FROM}</motion.p>
      <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="gold-text mb-8 text-center text-5xl sm:text-6xl md:mb-10 md:text-7xl" style={{ fontFamily: FONTS.script, lineHeight: 1.3 }}>
        Special Letter For You
      </motion.h1>
      <div
        role={!isOpen ? 'button' : undefined} tabIndex={!isOpen ? 0 : undefined} aria-label={!isOpen ? 'Buka amplop' : undefined}
        onClick={!isOpen ? onOpen : undefined}
        onKeyDown={!isOpen ? (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen()) : undefined}
        className={`relative rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/70 ${!isOpen ? 'cursor-pointer' : ''}`}
        style={{ width: `min(90vw, ${ENVELOPE.maxWidth}px, calc(${ENVELOPE.maxHeightVh}vh * ${ratio}))`, aspectRatio: ratio, opacity: cur ? 1 : 0, transition: 'opacity .5s' }}>
        <div className="pointer-events-none absolute inset-[-12%] -z-10 rounded-full bg-[#d4af37]/10 blur-3xl" />
        <AnimatePresence mode="wait">
          {cur && !isOpen && (
            <motion.div key="c" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1, y: [0, -8, 0] }} exit={{ scale: 1.05, opacity: 0 }}
              transition={{ duration: 0.5, y: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }} className="h-full w-full">
              <img src={cur.url} alt="Amplop tertutup" className="block h-full w-full drop-shadow-[0_24px_44px_rgba(0,0,0,0.65)]" />
            </motion.div>
          )}
          {cur && isOpen && (
            <motion.div key="o" initial={{ scale: 0.88, opacity: 0, rotate: -2 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ duration: 0.9, type: 'spring' }} className="relative h-full w-full">
              <img src={cur.url} alt="Amplop terbuka" className="block h-full w-full drop-shadow-[0_24px_50px_rgba(0,0,0,0.8)]" />
              <div className="absolute z-20 text-center text-[#3b0715]" style={{ left: ENVELOPE.text.x, top: ENVELOPE.text.y, width: ENVELOPE.text.width, transform: 'translate(-50%,-50%)', containerType: 'inline-size' }}>
                <p style={{ fontSize: '6.5cqw', letterSpacing: '0.3em', marginRight: '-0.3em', fontFamily: FONTS.display }} className="uppercase">Happy</p>
                <p style={{ fontSize: '17cqw', lineHeight: 1.1, margin: '1.5cqw 0', fontFamily: FONTS.display, fontWeight: 600 }}>1st Year</p>
                <p className="italic" style={{ fontSize: '11cqw', lineHeight: 1.15, fontFamily: FONTS.display }}>Anniversary<br />Sayang</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {!isOpen ? (
        <p className="mt-8 text-base italic text-[#f5e7e1]/75 motion-safe:animate-pulse" style={{ fontFamily: FONTS.display }}>Tap to open</p>
      ) : (
        <motion.a href="#inside" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="mt-8 rounded-full border border-[#d4af37]/60 px-7 py-2.5 text-lg italic text-[#d4af37] transition hover:bg-[#d4af37] hover:text-[#3b0715]" style={{ fontFamily: FONTS.display }}>
          Lanjut baca
        </motion.a>
      )}
    </section>
  );
}

/* ============================ 2. CERITA ============================ */
function OvalFrame() {
  const frame = useTrimmedImage(ASSETS.frame);
  const p = FRAME.photo;
  return (
    <div className="relative" style={{ width: `min(76vw, ${FRAME.maxWidth}px)`, aspectRatio: ratioOf(frame, 0.68), opacity: frame ? 1 : 0, transition: 'opacity .5s' }}>
      <img src={ASSETS.storyPhoto} alt="Awal cerita kita" className="absolute z-0 rounded-[50%] object-cover shadow-2xl"
        style={{ left: p.x, top: p.y, width: p.width, height: p.height, transform: 'translate(-50%,-50%)', objectPosition: '50% 35%' }} />
      {frame && <img src={frame.url} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 h-full w-full drop-shadow-2xl" />}
      <img src={ASSETS.flowerLeft} alt="" aria-hidden="true" className="pointer-events-none absolute z-20 object-contain drop-shadow-lg" style={{ right: '-9%', top: '1%', width: '34%', transform: 'rotate(18deg)' }} />
    </div>
  );
}

function StorySection() {
  return (
    <section id="inside" className="relative z-10 mx-auto max-w-6xl scroll-mt-16 px-6 py-24 md:py-32">
      <div className="flex flex-col items-center gap-16 md:flex-row md:gap-20">
        <motion.div {...reveal} className="flex w-full justify-center md:w-1/2"><OvalFrame /></motion.div>
        <motion.div {...reveal} className="w-full space-y-8 text-center md:w-1/2 md:text-left">
          <h2 className="gold-text text-5xl md:text-6xl" style={{ fontFamily: FONTS.script, lineHeight: 1.3 }}>Did you remember how this story began?</h2>
          <div className="mx-auto max-w-prose space-y-6 text-left text-xl leading-[1.75] text-[#f5e7e1]/90 md:mx-0 md:text-[1.35rem]" style={{ fontFamily: FONTS.display }}>
            {STORY.map((s, i) => <p key={i} className={i === 0 ? 'first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-[#d4af37]' : ''}>{s}</p>)}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================ 3. HITUNG WAKTU ============================ */
const MILES = [100, 200, 300, 365, 500, 730, 1000];
function Counter() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const start = new Date(START_DATE);
  const diff = Math.max(0, now - start.getTime());
  const days = Math.floor(diff / 864e5);
  const today = new Date(now); today.setHours(0, 0, 0, 0);
  const next = new Date(today.getFullYear(), start.getMonth(), start.getDate());
  if (next < today) next.setFullYear(next.getFullYear() + 1);
  const left = Math.round((next - today) / 864e5);
  const units = [['Hari', days], ['Jam', Math.floor(diff / 36e5) % 24], ['Menit', Math.floor(diff / 6e4) % 60], ['Detik', Math.floor(diff / 1e3) % 60]];
  return (
    <section id="time" className="relative z-10 scroll-mt-16 border-y border-[#d4af37]/15 bg-black/25 px-5 py-24">
      <Title sub="Setiap detiknya, aku masih memilih kamu.">Sudah berapa lama kita bersama?</Title>
      <motion.div {...reveal} className="mx-auto grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4" role="timer" aria-live="off">
        {units.map(([l, v]) => (
          <div key={l} className="rounded-2xl border border-[#d4af37]/30 bg-gradient-to-b from-[#3b0715]/70 to-[#1a0207]/70 px-3 py-7 text-center shadow-[0_0_30px_rgba(212,175,55,0.08)]">
            <div className="gold-text text-5xl tabular-nums md:text-6xl" style={{ fontFamily: FONTS.display, fontWeight: 600 }}>{String(v).padStart(2, '0')}</div>
            <div className="mt-2 text-lg italic text-[#f5e7e1]/70" style={{ fontFamily: FONTS.display }}>{l}</div>
          </div>
        ))}
      </motion.div>
      <motion.div {...reveal} className="mx-auto mt-10 max-w-3xl text-center">
        <p className="text-xl italic text-[#f5e7e1]/80" style={{ fontFamily: FONTS.display }}>
          {left === 0 ? 'Hari ini hari spesial kita 🤍' : `${left} hari lagi menuju anniversary berikutnya`}
        </p>
        <div className="mx-auto mt-3 h-1.5 max-w-md overflow-hidden rounded-full bg-[#f5e7e1]/15">
          <div className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#ff8fa8]" style={{ width: `${Math.max(2, 100 - (left / 365) * 100)}%` }} />
        </div>
        <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
          {MILES.map((m) => (
            <li key={m} className={`rounded-full border px-4 py-1 text-lg italic ${days >= m ? 'border-[#d4af37] bg-[#d4af37] text-[#3b0715]' : 'border-[#d4af37]/30 text-[#f5e7e1]/55'}`} style={{ fontFamily: FONTS.display }}>
              {days >= m ? '♥ ' : ''}{m} hari
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}


/* ============================ 4. PLAYER VINYL ============================ */
const Tonearm = ({ playing }) => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30">
    <div className="absolute rounded-full shadow-lg" style={{ left: '92%', top: '6%', width: '10%', height: '10%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle at 35% 30%,#f1ead9,#9b917c 60%,#4a4438)' }} />
    <motion.div initial={false} animate={{ rotate: playing ? 30 : -22 }} transition={{ type: 'spring', stiffness: 40, damping: 14 }} className="absolute" style={{ left: '92%', top: '6%', width: '2.4%', height: '46%', marginLeft: '-1.2%', transformOrigin: '50% 0%' }}>
      <div className="h-full w-full rounded-full bg-gradient-to-r from-[#8d836f] via-[#e9e2d0] to-[#8d836f]" />
      <div className="absolute -bottom-[2%] left-1/2 h-[10%] w-[240%] -translate-x-1/2 rounded-[2px] bg-[#1d1a16]" />
    </motion.div>
  </div>
);

function MusicSection({ player }) {
  const vinyl = useTrimmedImage(ASSETS.vinyl);
  const pct = player.dur ? Math.min((player.cur / player.dur) * 100, 100) : 0;
  const onSeek = (e) => { const r = e.currentTarget.getBoundingClientRect(); player.seek((e.clientX - r.left) / r.width); };
  const onKey = (e) => { if (e.key === 'ArrowRight') player.skip(5); if (e.key === 'ArrowLeft') player.skip(-5); };
  return (
    <section id="song" className="relative z-10 flex scroll-mt-16 flex-col items-center px-6 py-24 md:py-32">
      <Title>Play Our Favorite Song</Title>
      <div className="relative mb-8" style={{ width: 'min(72vw,400px)', aspectRatio: ratioOf(vinyl, 1), opacity: vinyl ? 1 : 0, transition: 'opacity .5s' }}>
        <div className={`pointer-events-none absolute inset-[-10%] rounded-full bg-[#d4af37]/20 blur-3xl transition-opacity duration-1000 ${player.playing ? 'opacity-100' : 'opacity-0'}`} />
        <button type="button" onClick={player.toggle} aria-label={player.playing ? 'Hentikan lagu' : 'Putar lagu'} className="absolute inset-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/70">
          <div className="h-full w-full animate-spin" style={{ animationDuration: '6s', animationTimingFunction: 'linear', animationPlayState: player.playing ? 'running' : 'paused' }}>
            {vinyl && <img src={vinyl.url} alt="" className="block h-full w-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]" />}
            <img src={ASSETS.vinylLabel} alt="" className="absolute left-1/2 top-1/2 h-[32%] w-[32%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[#1a1a1a] object-cover" />
          </div>
        </button>
        <Tonearm playing={player.playing} />
      </div>
      {/* equalizer */}
      <div className="mb-3 flex h-6 items-end gap-1" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span key={i} className="w-1 rounded-full bg-[#d4af37]" animate={player.playing ? { height: ['20%', '100%', '35%', '80%', '20%'] } : { height: '20%' }}
            transition={{ duration: 1 + i * 0.15, repeat: Infinity, ease: 'easeInOut' }} style={{ height: '20%' }} />
        ))}
      </div>
      <p role="status" className="mb-8 min-h-[1.5rem] text-center text-lg italic text-[#f5e7e1]/70" style={{ fontFamily: FONTS.display }}>
        {player.error ? 'Lagunya belum bisa diputar. Coba muat ulang halaman ya.' : player.playing ? 'Sedang berputar. Ketuk piringan untuk menghentikan.' : 'Ketuk piringan untuk memutar lagu kita.'}
      </p>
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <div className="w-full">
          <div role="slider" tabIndex={0} aria-label="Posisi lagu" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} onKeyDown={onKey} onClick={onSeek} className="flex h-6 w-full cursor-pointer items-center outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/60">
            <div className="relative h-[3px] w-full rounded-full bg-[#f5e7e1]/25">
              <div className="absolute left-0 top-0 h-full rounded-full bg-[#d4af37] shadow-[0_0_10px_#d4af37]" style={{ width: `${pct}%` }} />
              <div className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg" style={{ left: `${pct}%` }} />
            </div>
          </div>
          <div className="mt-1 flex justify-between text-sm text-[#f5e7e1]/60"><span>{fmt(player.cur)}</span><span>{fmt(player.dur)}</span></div>
        </div>
        <div className="flex items-center gap-10">
          <button type="button" onClick={() => player.skip(-10)} aria-label="Mundur 10 detik" className="text-[#f5e7e1]/70 transition hover:scale-110 hover:text-white">−10s</button>
          <button type="button" onClick={player.toggle} aria-label={player.playing ? 'Hentikan lagu' : 'Putar lagu'} className="flex h-16 w-16 items-center justify-center rounded-full border border-[#d4af37] text-[#d4af37] shadow-[0_0_24px_rgba(212,175,55,0.25)] outline-none transition hover:bg-[#d4af37] hover:text-[#3b0715] focus-visible:ring-2 focus-visible:ring-[#d4af37]/70">
            {player.playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button type="button" onClick={() => player.skip(10)} aria-label="Maju 10 detik" className="text-[#f5e7e1]/70 transition hover:scale-110 hover:text-white">+10s</button>
        </div>
      </div>
    </section>
  );
}

/* ============================ 5. GALERI ============================ */
const slide = {
  enter: (d) => ({ opacity: 0, x: d * 60, scale: 0.92 }),
  center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: (d) => ({ opacity: 0, x: d * -60, scale: 0.96, transition: { duration: 0.2 } }),
};

function Lightbox({ items, index, direction, onClose, onNavigate, favs, onFav }) {
  const ref = useRef(null);
  const closeRef = useRef(null);
  const [auto, setAuto] = useState(false);
  const item = items[index];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onNavigate(1);
      else if (e.key === 'ArrowLeft') onNavigate(-1);
      else if (e.key === 'Tab' && ref.current) {
        const f = ref.current.querySelectorAll('button'); if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onNavigate]);

  useEffect(() => {
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden'; closeRef.current?.focus();
    return () => { document.body.style.overflow = prev; };
  }, []);
  useEffect(() => { [index + 1, index - 1].forEach((i) => { new Image().src = items[(i + items.length) % items.length].src; }); }, [index, items]);
  useEffect(() => { if (!auto) return; const id = setInterval(() => onNavigate(1), 4500); return () => clearInterval(id); }, [auto, onNavigate]);

  const onDragEnd = (_, i) => { if (i.offset.x < -70 || i.velocity.x < -500) onNavigate(1); else if (i.offset.x > 70 || i.velocity.x > 500) onNavigate(-1); };
  const btn = 'flex h-11 w-11 items-center justify-center rounded-full border border-[#f5e7e1]/30 text-[#f5e7e1] outline-none transition hover:bg-[#f5e7e1]/10 focus-visible:ring-2 focus-visible:ring-[#d4af37]';

  return (
    <motion.div ref={ref} role="dialog" aria-modal="true" aria-label={`Foto kenangan: ${item.title}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0d0107]/95 px-4 py-6 backdrop-blur-md">
      <button ref={closeRef} type="button" onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label="Tutup" className={`absolute right-4 top-4 z-10 ${btn}`}><CloseIcon /></button>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.figure key={index} custom={direction} variants={slide} initial="enter" animate="center" exit="exit" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.25} onDragEnd={onDragEnd} onClick={(e) => e.stopPropagation()} className="flex max-h-full w-full max-w-3xl flex-col items-center">
          <img src={item.src} alt={item.title} draggable={false} className="max-h-[56vh] w-auto max-w-full select-none rounded-sm border-[8px] border-[#f5e7e1] object-contain shadow-[0_20px_60px_rgba(0,0,0,0.7)]" />
          <figcaption className="mt-6 max-w-xl text-center">
            <h3 className="gold-text text-5xl" style={{ fontFamily: FONTS.script, lineHeight: 1.3 }}>{item.title}</h3>
            {item.note && <p className="mt-2 text-[1.5rem] leading-snug text-[#f5e7e1]/90 md:text-[1.7rem]" style={{ fontFamily: FONTS.hand, textWrap: 'pretty' }}>{item.note}</p>}
          </figcaption>
        </motion.figure>
      </AnimatePresence>
      <div className="mt-6 flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={() => onNavigate(-1)} aria-label="Foto sebelumnya" className={btn}><Chevron dir="left" /></button>
        <button type="button" onClick={() => setAuto((a) => !a)} aria-pressed={auto} aria-label={auto ? 'Hentikan slideshow' : 'Mulai slideshow'} className={btn}>{auto ? <PauseIcon /> : <PlayIcon />}</button>
        <span className="min-w-[3.5rem] text-center text-sm tabular-nums text-[#f5e7e1]/70">{index + 1} / {items.length}</span>
        <button type="button" onClick={() => onFav(item.src)} aria-pressed={favs.has(item.src)} aria-label="Tandai favorit" className={`${btn} ${favs.has(item.src) ? 'text-[#ff8fa8]' : ''}`}><HeartIcon filled={favs.has(item.src)} /></button>
        <button type="button" onClick={() => onNavigate(1)} aria-label="Foto berikutnya" className={btn}><Chevron dir="right" /></button>
      </div>
    </motion.div>
  );
}

function GallerySection({ burst }) {
  const { award } = useFx();
  const [cinema, setCinema] = useState(false);
  const [failed, setFailed] = useState(() => new Set());
  const [favs, toggleFav] = useLocalSet('fav-photos');
  const [onlyFav, setOnlyFav] = useState(false);
  const [activeSrc, setActiveSrc] = useState(null);
  const [direction, setDirection] = useState(0);
  const trigger = useRef(null);

  const all = useMemo(() => GALLERY.filter((g) => !failed.has(g.src)), [failed]);
  const visible = useMemo(() => (onlyFav ? all.filter((g) => favs.has(g.src)) : all), [all, favs, onlyFav]);
  const vRef = useRef(visible); vRef.current = visible;
  const activeIndex = activeSrc ? visible.findIndex((g) => g.src === activeSrc) : -1;

  const close = useCallback(() => { setActiveSrc(null); requestAnimationFrame(() => trigger.current?.focus()); }, []);
  const navigate = useCallback((dir) => {
    setDirection(dir);
    setActiveSrc((cur) => { const l = vRef.current; const i = l.findIndex((g) => g.src === cur); return i < 0 || !l.length ? cur : l[(i + dir + l.length) % l.length].src; });
  }, []);
  const onFav = (src, e) => { const adding = !favs.has(src); toggleFav(src); if (adding) award('fav'); if (adding && e) burst(e.clientX, e.clientY, 8); };

  return (
    <section id="memories" className="relative z-10 mx-auto max-w-6xl scroll-mt-16 px-5 py-24 md:px-12 md:py-32">
      <Title sub="Ketuk foto untuk melihat lebih dekat">Our Memories</Title>
      <div className="mb-10 flex justify-center gap-3 text-lg italic" style={{ fontFamily: FONTS.display }}>
        {[[false, `Semua (${all.length})`], [true, `Favorit (${favs.size})`]].map(([v, l]) => (
          <button key={l} type="button" onClick={() => setOnlyFav(v)} aria-pressed={onlyFav === v}
            className={`rounded-full border px-5 py-1.5 transition ${onlyFav === v ? 'border-[#d4af37] bg-[#d4af37] text-[#3b0715]' : 'border-[#d4af37]/40 text-[#f5e7e1]/80 hover:border-[#d4af37]'}`}>{l}</button>
        ))}
      </div>
      <div className="-mt-4 mb-10 flex justify-center"><button type="button" onClick={() => { setCinema(true); award('film'); }} className="rounded-full border border-[#d4af37]/60 px-6 py-2 text-lg italic text-[#d4af37] outline-none transition hover:bg-[#d4af37] hover:text-[#3b0715] focus-visible:ring-2 focus-visible:ring-[#d4af37]" style={{ fontFamily: FONTS.display }}>▶ Putar sebagai film</button></div>
      <AnimatePresence>{cinema && all.length > 0 && <Cinema items={all} onClose={() => setCinema(false)} />}</AnimatePresence>
      {!visible.length && onlyFav && <p className="py-10 text-center text-xl italic text-[#f5e7e1]/60" style={{ fontFamily: FONTS.display }}>Belum ada favorit. Ketuk ikon hati di foto untuk menandai.</p>}
      <div className="columns-1 gap-7 sm:columns-2 lg:columns-3 [&>*]:mb-7">
        {visible.map((item, n) => (
          <motion.div key={item.src} {...reveal} className="relative break-inside-avoid">
            <button type="button" onClick={(e) => { trigger.current = e.currentTarget; setDirection(0); setActiveSrc(item.src); }} aria-label={`Perbesar foto: ${item.title}`} className="group block w-full text-left outline-none">
              <div className="bg-[#f5e7e1] p-3 pb-4 shadow-[0_14px_30px_rgba(0,0,0,0.5)] transition duration-500 group-hover:-translate-y-1.5 group-focus-visible:ring-2 group-focus-visible:ring-[#d4af37]" style={{ transform: `rotate(${((n % 3) - 1) * 0.9}deg)` }}>
                <div className="overflow-hidden">
                  <img src={item.src} alt={item.title} loading="lazy" decoding="async" onError={() => setFailed((p) => new Set(p).add(item.src))} className="block w-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ aspectRatio: n % 4 === 1 ? '4/5' : '3/2', objectPosition: item.pos || 'center' }} />
                </div>
                <p className="mt-3 text-center text-[1.7rem] leading-none text-[#3b0715]" style={{ fontFamily: FONTS.hand }}>{item.title}</p>
              </div>
            </button>
            <button type="button" onClick={(e) => onFav(item.src, e)} aria-pressed={favs.has(item.src)} aria-label={`Favorit: ${item.title}`}
              className={`absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#3b0715]/70 backdrop-blur transition hover:scale-110 ${favs.has(item.src) ? 'text-[#ff8fa8]' : 'text-[#f5e7e1]'}`}><HeartIcon filled={favs.has(item.src)} className="h-5 w-5" /></button>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {activeIndex >= 0 && <Lightbox key="lb" items={visible} index={activeIndex} direction={direction} onClose={close} onNavigate={navigate} favs={favs} onFav={(src) => onFav(src)} />}
      </AnimatePresence>
    </section>
  );
}

/* ============================ 7. ALASAN ============================ */
function Reasons({ burst }) {
  const { award } = useFx();
  const [open, setOpen] = useState(() => new Set());
  const flip = (i, e) => { if (!open.has(i) && open.size + 1 >= REASONS.length) award('reasons'); setOpen((p) => new Set(p).add(i)); burst(e.clientX, e.clientY, 7); };
  return (
    <section id="reasons" className="relative z-10 mx-auto max-w-5xl scroll-mt-16 px-5 py-24 md:py-32">
      <Title sub={`Ketuk tiap hati untuk membukanya. Sudah terbuka ${open.size} dari ${REASONS.length}.`}>Alasan Aku Sayang Kamu</Title>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {REASONS.map((r, i) => {
          const o = open.has(i);
          return (
            <motion.button key={i} type="button" {...reveal} onClick={(e) => flip(i, e)} aria-expanded={o} aria-label={o ? r : `Buka alasan ke-${i + 1}`}
              className="relative aspect-[4/3] rounded-2xl border border-[#d4af37]/30 bg-gradient-to-br from-[#4a0a1c] to-[#1f0310] p-4 text-center outline-none transition hover:-translate-y-1 hover:border-[#d4af37] focus-visible:ring-2 focus-visible:ring-[#d4af37]">
              <AnimatePresence mode="wait" initial={false}>
                {o ? (
                  <motion.span key="t" initial={{ opacity: 0, rotateY: 90 }} animate={{ opacity: 1, rotateY: 0 }} className="flex h-full items-center justify-center text-[1.35rem] leading-snug text-[#f5e7e1] md:text-[1.6rem]" style={{ fontFamily: FONTS.hand }}>{r}</motion.span>
                ) : (
                  <motion.span key="h" exit={{ opacity: 0, rotateY: 90 }} className="flex h-full items-center justify-center text-[#ff8fa8]"><HeartIcon filled className="h-10 w-10 drop-shadow-[0_0_12px_rgba(255,143,168,0.6)]" /></motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

/* ============================ KONTEKS: EFEK & PENCAPAIAN ============================ */
const Ctx = React.createContext({ burst() { }, award() { }, ach: new Set() });
const useFx = () => React.useContext(Ctx);
const ls = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* abaikan */ } },
};
const ACHIEVEMENTS = {
  open: 'Pembuka Surat', fav: 'Penyuka Kenangan', film: 'Penonton Setia', reasons: 'Pemilik Hati', wish: 'Pembuat Harapan', letter: 'Pembaca Setia', tap: 'Cinta Tak Terhingga',
};
const goldBtn = 'rounded-full border border-[#d4af37]/60 px-7 py-2.5 text-lg italic text-[#d4af37] outline-none transition hover:bg-[#d4af37] hover:text-[#3b0715] focus-visible:ring-2 focus-visible:ring-[#d4af37]';

/* Jejak kilau emas mengikuti kursor / jari */
function SparkleTrail() {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const c = ref.current, ctx = c.getContext('2d');
    let ps = [], raf;
    const size = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    size();
    const move = (e) => {
      for (let i = 0; i < 2; i++) ps.push({ x: e.clientX, y: e.clientY, vx: (Math.random() - 0.5) * 1.4, vy: Math.random() + 0.3, life: 1, s: 1.5 + Math.random() * 2.5 });
      if (ps.length > 120) ps = ps.slice(-120);
    };
    const tick = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      ps = ps.filter((p) => p.life > 0);
      ctx.fillStyle = '#f6e27a'; ctx.shadowColor = '#d4af37'; ctx.shadowBlur = 8;
      for (const p of ps) { p.x += p.vx; p.y += p.vy; p.life -= 0.025; ctx.globalAlpha = Math.max(p.life, 0); ctx.beginPath(); ctx.arc(p.x, p.y, p.s * p.life, 0, 7); ctx.fill(); }
      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener('resize', size); window.addEventListener('pointermove', move, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', size); window.removeEventListener('pointermove', move); };
  }, []);
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[95]" />;
}

/* ============================ OPEN WHEN ============================ */
const OPEN_WHEN = [
  { t: 'Buka pas kangen', m: 'Chat aku cayang, liatin foto gw tu' },
  { t: 'Buka pas syedih', m: 'cium aku cayang, minta peyuk akuu' },
  { t: 'Buka pas capek', m: 'tidurr cintahh pas capee, apa mau gw cium' },
  { t: 'Buka pas marah', m: 'maafin aku yah cintahku, ilofyu' },
  { t: 'Buka pas susah tidur', m: 'tiduurrr yaaa cintakkuuu cayanggkuuu loveeeyouuuu' },
  { t: 'Buka pas insecure', m: 'kmu cantik bgt sayangggg, kamu sempurnah buat aku ilopyu' },
];
function OpenWhen() {
  const [cur, setCur] = useState(null);
  const [read, setRead] = useState(() => new Set());
  const pick = (i) => { setCur(cur === i ? null : i); setRead((p) => new Set(p).add(i)); };
  return (
    <section className="relative z-10 border-y border-[#d4af37]/15 bg-black/25 px-5 py-24 md:py-32">
      <Title sub={`Satu surat kecil untuk setiap suasana hatimu. Terbaca ${read.size} dari ${OPEN_WHEN.length}.`}>Open When...</Title>
      <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
        {OPEN_WHEN.map((o, i) => (
          <motion.div key={o.t} {...reveal} className="overflow-hidden rounded-2xl border border-[#d4af37]/30 bg-gradient-to-br from-[#3b0715]/80 to-[#1a0207]/80">
            <button type="button" onClick={() => pick(i)} aria-expanded={cur === i} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-xl outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#d4af37]" style={{ fontFamily: FONTS.display }}>
              <span>{o.t}</span><span className="text-[#ff8fa8]">{read.has(i) ? '♥' : '✉'}</span>
            </button>
            <AnimatePresence initial={false}>
              {cur === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-5 pb-5 text-[1.55rem] leading-snug text-[#f5e7e1]/90" style={{ fontFamily: FONTS.hand }}>{o.m}</motion.p>}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ============================ LENTERA HARAPAN ============================ */
function Wishes() {
  const { award } = useFx();
  const [text, setText] = useState('');
  const [wishes, setWishes] = useState(() => ls.get('wishes', []));
  const [fly, setFly] = useState([]);
  const send = (e) => {
    e.preventDefault();
    const t = text.trim(); if (!t) return;
    const id = Math.random();
    setFly((l) => [...l, { id, t, x: 10 + Math.random() * 70 }]);
    const w = [t, ...wishes].slice(0, 12); setWishes(w); ls.set('wishes', w);
    setText(''); award('wish');
  };
  return (
    <section className="relative z-10 mx-auto max-w-3xl px-5 py-24 md:py-32">
      <Title sub="Tulis satu harapan untuk kita, lalu lepaskan bersama lentera.">Lentera Harapan</Title>
      <div className="relative mb-6 h-80 overflow-hidden rounded-3xl border border-[#d4af37]/25 bg-gradient-to-t from-[#3b0715] via-[#1f0310] to-[#0b0108]">
        {Array.from({ length: 24 }, (_, i) => <span key={i} aria-hidden="true" className="absolute h-0.5 w-0.5 rounded-full bg-[#f5e7e1]/60" style={{ left: `${(i * 41) % 100}%`, top: `${(i * 23) % 70}%` }} />)}
        {fly.map((f) => (
          <motion.div key={f.id} initial={{ y: 300, opacity: 1 }} animate={{ y: -120, opacity: [1, 1, 0], x: [0, 14, -10, 8] }} transition={{ duration: 9, ease: 'easeOut' }}
            onAnimationComplete={() => setFly((l) => l.filter((i) => i.id !== f.id))} className="absolute w-28 text-center" style={{ left: `${f.x}%` }}>
            <div className="mx-auto h-16 w-12 rounded-t-[40%] rounded-b-md bg-gradient-to-b from-[#ffd27a] to-[#ff7a4a] shadow-[0_0_40px_10px_rgba(255,160,80,0.45)]" />
            <p className="mt-2 text-lg leading-tight text-[#ffe9c7]" style={{ fontFamily: FONTS.hand }}>{f.t}</p>
          </motion.div>
        ))}
        {!fly.length && <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-xl italic text-[#f5e7e1]/50" style={{ fontFamily: FONTS.display }}>Langit masih sepi. Tulis harapanmu di bawah.</p>}
      </div>
      <form onSubmit={send} className="flex gap-3">
        <input value={text} onChange={(e) => setText(e.target.value)} maxLength={60} placeholder="Aku berharap kita..." aria-label="Tulis harapan"
          className="min-w-0 flex-1 rounded-full border border-[#d4af37]/40 bg-black/30 px-5 py-2.5 text-xl text-[#f5e7e1] outline-none placeholder:text-[#f5e7e1]/40 focus:border-[#d4af37]" style={{ fontFamily: FONTS.display }} />
        <button type="submit" className={goldBtn}>Lepaskan</button>
      </form>
      {wishes.length > 0 && (
        <ul className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Harapan tersimpan">
          {wishes.map((w, i) => <li key={i} className="rounded-full border border-[#d4af37]/25 px-4 py-1 text-lg italic text-[#f5e7e1]/75" style={{ fontFamily: FONTS.display }}>♥ {w}</li>)}
        </ul>
      )}
    </section>
  );
}

/* ============================ MODE FILM ============================ */
function Cinema({ items, onClose }) {
  const [i, setI] = useState(0);
  useEffect(() => { const id = setInterval(() => setI((v) => (v + 1) % items.length), 5500); return () => clearInterval(id); }, [items.length]);
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', k);
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = prev; };
  }, [onClose]);
  const it = items[i];
  return (
    <motion.div role="dialog" aria-modal="true" aria-label="Mode film" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-black">
      <AnimatePresence>
        <motion.img key={it.src} src={it.src} alt={it.title} initial={{ opacity: 0, scale: 1 }} animate={{ opacity: 1, scale: 1.12 }} exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.2 }, scale: { duration: 7, ease: 'linear' } }} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: it.pos || 'center' }} />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50" />
      <motion.div key={`c${i}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }} className="absolute inset-x-0 bottom-0 px-6 pb-16 text-center">
        <h3 className="gold-text text-5xl md:text-7xl" style={{ fontFamily: FONTS.script, lineHeight: 1.3 }}>{it.title}</h3>
        {it.note && <p className="mx-auto mt-2 max-w-2xl text-[1.5rem] leading-snug text-[#f5e7e1] md:text-[1.9rem]" style={{ fontFamily: FONTS.hand }}>{it.note}</p>}
      </motion.div>
      <motion.div key={`p${i}`} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 5.5, ease: 'linear' }} className="absolute inset-x-0 bottom-0 h-1 origin-left bg-[#d4af37]" />
      <button type="button" onClick={onClose} aria-label="Tutup" autoFocus className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#f5e7e1]/40 bg-black/40 text-[#f5e7e1] outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]"><CloseIcon /></button>
    </motion.div>
  );
}


/* ============================ 8. SURAT ============================ */
function Typewriter({ text, active, onDone }) {
  const [n, setN] = useState(0);
  const fin = useRef(false);
  useEffect(() => {
    if (!active) return;
    const done = () => { if (!fin.current) { fin.current = true; onDone(); } };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(text.length); done(); return; }
    let k = 0;
    const id = setInterval(() => { k += 2; setN(k); if (k >= text.length) { clearInterval(id); done(); } }, 28);
    return () => clearInterval(id);
  }, [active]); // eslint-disable-line
  return <span aria-label={text}><span aria-hidden="true">{text.slice(0, n)}<span className="opacity-0">{text.slice(n)}</span></span></span>;
}

function LetterSection() {
  const { award } = useFx();
  const paper = useTrimmedImage(ASSETS.paper);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-25% 0px' });
  const [step, setStep] = useState(0);
  const lines = [...LETTER.paragraphs, LETTER.closing];
  const next = useCallback(() => setStep((s) => s + 1), []);
  useEffect(() => { if (step >= lines.length) award('letter'); }, [step]); // eslint-disable-line
  return (
    <section id="letter" className="relative z-10 flex scroll-mt-16 items-center justify-center bg-black/30 px-5 py-24 md:px-6 md:py-32">
      <motion.div {...reveal} ref={ref} className="relative w-full max-w-[700px]" style={{ opacity: paper ? undefined : 0 }}>
        {paper && <img src={paper.url} alt="" aria-hidden="true" className="absolute inset-0 z-0 h-full w-full object-fill drop-shadow-2xl" />}
        <img src={ASSETS.flowerRight} alt="" aria-hidden="true" className="pointer-events-none absolute -left-4 -top-9 z-20 w-20 drop-shadow-lg md:-left-10 md:-top-12 md:w-40" />
        <div className="relative z-10 px-[13%] pb-20 pt-20 text-[#3b0715] md:px-[14%] md:pb-28 md:pt-28">
          <h2 className="text-5xl leading-tight md:text-6xl" style={{ fontFamily: FONTS.script }}>Dear {NAME},</h2>
          <div className="mt-8 space-y-5 text-[1.4rem] leading-[1.5] md:mt-10 md:text-[1.7rem]" style={{ fontFamily: FONTS.hand, fontWeight: 500, textWrap: 'pretty' }}>
            {lines.map((l, i) => (
              <p key={i}>
                <Typewriter text={l} active={inView && step === i} onDone={next} />
                {i === lines.length - 1 && (
                  <>{' '}<span aria-hidden="true" style={{ opacity: step > i ? 1 : 0, transition: 'opacity .6s', filter: 'drop-shadow(0 0 0.6px #3b0715) drop-shadow(0 0 0.6px #3b0715)' }}>{LETTER.hearts}</span></>
                )}
              </p>
            ))}
          </div>
          <div className="mt-10 text-right md:mt-14">
            <p className="text-2xl md:text-3xl" style={{ fontFamily: FONTS.hand }}>With all my love,</p>
            <p className="mt-1 text-5xl leading-tight md:text-6xl" style={{ fontFamily: FONTS.script }}>{FROM}</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ============================ 9. PENUTUP ============================ */
function Finale() {
  const { burst, award, ach } = useFx();
  const [taps, setTaps] = useState(() => ls.get('love-taps', 0));
  const tap = (e) => {
    const n = taps + 1; setTaps(n); ls.set('love-taps', n); burst(e.clientX, e.clientY, 14);
    if (n >= 10) award('tap');
  };
  const wa = WHATSAPP && `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`iya sayangku ${FROM}, i love u more mwah`)}`;
  return (
    <footer className="relative z-10 px-6 pb-28 pt-24 text-center">
      <motion.div {...reveal}>
        <p className="gold-text text-6xl md:text-8xl" style={{ fontFamily: FONTS.script, lineHeight: 1.3 }}>Forever Yours</p>
        <p className="mx-auto mt-4 max-w-md text-xl italic text-[#f5e7e1]/75" style={{ fontFamily: FONTS.display }}>Ketuk hati ini kalau kamu juga sayang aku.</p>
        <motion.button type="button" onClick={tap} whileTap={{ scale: 0.85 }} aria-label="Kirim cinta" className="mx-auto mt-8 flex h-24 w-24 items-center justify-center rounded-full border border-[#ff8fa8]/50 text-[#ff8fa8] shadow-[0_0_40px_rgba(255,143,168,0.3)] outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]" style={{ animation: 'pulseSeal 2.2s ease-in-out infinite' }}>
          <HeartIcon filled className="h-12 w-12" />
        </motion.button>
        <p className="mt-4 text-lg italic text-[#f5e7e1]/65" style={{ fontFamily: FONTS.display }} aria-live="polite">{taps ? `${taps} cinta terkirim` : 'Belum ada cinta terkirim'}</p>
        {wa && <a href={wa} target="_blank" rel="noreferrer" className={`${goldBtn} mt-8 inline-block`}>Balas lewat WhatsApp</a>}
        <div className="mx-auto mt-16 max-w-2xl">
          <p className="mb-4 text-2xl italic text-[#d4af37]" style={{ fontFamily: FONTS.display }}>Pencapaian ({ach.size} dari {Object.keys(ACHIEVEMENTS).length})</p>
          <ul className="flex flex-wrap justify-center gap-2.5">
            {Object.entries(ACHIEVEMENTS).map(([k, l]) => (
              <li key={k} className={`rounded-full border px-4 py-1 text-lg italic ${ach.has(k) ? 'border-[#d4af37] bg-[#d4af37]/15 text-[#f6e27a]' : 'border-[#f5e7e1]/15 text-[#f5e7e1]/35'}`} style={{ fontFamily: FONTS.display }}>{ach.has(k) ? '🏆' : '🔒'} {l}</li>
            ))}
          </ul>
        </div>
        <p className="mt-16 text-lg italic text-[#f5e7e1]/45" style={{ fontFamily: FONTS.display }}>Dibuat dengan cinta oleh {FROM}</p>
      </motion.div>
    </footer>
  );
}


/* ============================ NAVIGASI & PLAYER MINI ============================ */
function useActiveSection() {
  const [active, setActive] = useState('#opening');
  useEffect(() => {
    const els = NAV.map(([h]) => document.querySelector(h)).filter(Boolean);
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)), { rootMargin: '-40% 0px -55% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

function MiniPlayer({ player, show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.button type="button" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onClick={player.toggle} aria-label={player.playing ? 'Jeda musik' : 'Putar musik'}
          className="fixed bottom-5 right-5 z-[70] flex h-13 items-center gap-3 rounded-full border border-[#d4af37]/50 bg-[#1a0207]/85 py-2 pl-2 pr-5 text-[#d4af37] shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]">
          <img src={ASSETS.vinylLabel} alt="" className="h-10 w-10 rounded-full border border-[#d4af37]/60 object-cover animate-spin" style={{ animationDuration: '6s', animationPlayState: player.playing ? 'running' : 'paused' }} />
          <span className="text-lg italic" style={{ fontFamily: FONTS.display }}>{player.playing ? 'Sedang diputar' : 'Putar lagu'}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ============================ APP ============================ */
export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [bursts, setBursts] = useState([]);
  const [menu, setMenu] = useState(false);
  const [ach, setAch] = useState(() => new Set(ls.get('achv', [])));
  const [toast, setToast] = useState(null);
  const tRef = useRef(null);
  const player = usePlayer(ASSETS.song);
  const active = useActiveSection();
  useGoogleFonts(FONT_URL);

  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  const burst = useCallback((x, y, n = 12) => {
    const id = Date.now() + Math.random();
    setBursts((b) => [...b.slice(-3), { id, x, y, n }]);
    setTimeout(() => setBursts((b) => b.filter((i) => i.id !== id)), 1600);
  }, []);
  const award = useCallback((id) => {
    setAch((p) => {
      if (p.has(id)) return p;
      const n = new Set(p).add(id); ls.set('achv', [...n]);
      setTimeout(() => { setToast(id); clearTimeout(tRef.current); tRef.current = setTimeout(() => setToast(null), 3200); }, 0);
      return n;
    });
  }, []);
  const ctx = useMemo(() => ({ burst, award, ach }), [burst, award, ach]);

  const openEnvelope = () => {
    setIsOpen(true); player.play(); award('open');
    burst(window.innerWidth / 2, window.innerHeight / 2, 26);
  };

  return (
    <MotionConfig reducedMotion="user">
      <Ctx.Provider value={ctx}>
        <div className="grain relative isolate w-full min-w-0 bg-[#14010a] text-[#f5e7e1] selection:bg-[#f5e7e1] selection:text-[#3b0715]" style={{ overflowX: 'clip', fontFamily: FONTS.display }}>
          <GlobalStyle />
          <audio ref={player.ref} src={player.src} loop preload="auto" />

          <motion.div style={{ y: bgY, backgroundImage: `url(${ASSETS.background})` }} className="fixed -top-[10%] left-0 -z-20 h-[120%] w-full bg-cover bg-center" />
          <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#2a040e]/95 via-[#3b0715]/90 to-[#14010a]/96" />
          <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <motion.div animate={{ x: [0, 90, 0], y: [0, 60, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }} className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-[#ff4d6d]/10 blur-3xl" />
            <motion.div animate={{ x: [0, -80, 0], y: [0, -70, 0] }} transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }} className="absolute -right-32 top-2/3 h-[28rem] w-[28rem] rounded-full bg-[#d4af37]/10 blur-3xl" />
          </div>
          <div className="pointer-events-none fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,0,5,0.7) 100%)' }} />
          <Petals />
          <Bursts bursts={bursts} />
          <SparkleTrail />

          <motion.div style={{ scaleX: bar }} className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-gradient-to-r from-[#d4af37] to-[#ff8fa8]" />

          <nav aria-label="Navigasi" className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-[#14010a]/90 to-transparent">
            <div className="hidden justify-end gap-7 px-10 py-6 text-lg italic md:flex">
              {NAV.map(([h, l]) => (
                <a key={h} href={h} aria-current={active === h ? 'true' : undefined} className={`border-b pb-0.5 transition ${active === h ? 'border-[#d4af37] text-[#d4af37]' : 'border-transparent text-[#f5e7e1]/70 hover:text-white'}`}>{l}</a>
              ))}
            </div>
            <div className="flex justify-end px-4 py-3 md:hidden">
              <button type="button" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-label="Menu" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f5e7e1]/30 text-[#f5e7e1]">
                {menu ? <CloseIcon /> : <Icon><path d="M4 7h16M4 12h16M4 17h16" /></Icon>}
              </button>
            </div>
            <AnimatePresence>
              {menu && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mx-4 flex flex-col gap-1 rounded-2xl border border-[#d4af37]/30 bg-[#1a0207]/95 p-3 text-xl italic backdrop-blur md:hidden">
                  {NAV.map(([h, l]) => <a key={h} href={h} onClick={() => setMenu(false)} className={`rounded-lg px-4 py-2 ${active === h ? 'text-[#d4af37]' : 'text-[#f5e7e1]/80'}`}>{l}</a>)}
                </motion.div>
              )}
            </AnimatePresence>
          </nav>

          <EnvelopeSection isOpen={isOpen} onOpen={openEnvelope} />
          <StorySection />
          <Counter />
          <MusicSection player={player} />
          <GallerySection burst={burst} />
          <Reasons burst={burst} />
          <OpenWhen />
          <Wishes />
          <LetterSection />
          <Finale />

          <MiniPlayer player={player} show={isOpen} />

          <AnimatePresence>
            {toast && (
              <motion.div key={toast} role="status" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="fixed left-1/2 top-16 z-[96] -translate-x-1/2 whitespace-nowrap rounded-full border border-[#d4af37] bg-[#1a0207]/95 px-6 py-2.5 text-xl italic text-[#f6e27a] shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur" style={{ fontFamily: FONTS.display }}>
                🏆 Pencapaian baru: {ACHIEVEMENTS[toast]}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Ctx.Provider>
    </MotionConfig>
  );
}