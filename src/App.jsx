import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useScroll,
  useTransform,
} from 'framer-motion';

/* =====================================================================
   KONFIGURASI: ubah teks, nama, aset, dan posisi di bagian ini saja
===================================================================== */
const NAME = 'Saffanah';
const FROM = 'Radith';

const ASSETS = {
  background: '/bg-utama.jpg',
  envelopeClosed: '/amplop-tutup.png',
  envelopeOpen: '/amplop-buka.png',
  storyPhoto: '/foto-awal.jpg',
  frame: '/frame-oval.png',
  flowerLeft: '/bunga-kiri.png',
  flowerRight: '/bunga-kanan.png',
  vinyl: '/vinyl-record.png',
  vinylLabel: '/foto-kita.jpg',
  song: '/Lagu-Kita.mp3', // file ada di folder public/ (huruf besar/kecil harus sama persis)
  paper: '/kertas-surat.png',
};

const FONTS = {
  script: "'Great Vibes', 'Snell Roundhand', cursive",
  hand: "'Caveat', 'Segoe Script', 'Bradley Hand', cursive",
};
const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Great+Vibes&display=swap';

/* Amplop: ukuran & posisi teks di atas kartu.
   Semua persentase dihitung terhadap gambar amplop yang sudah dipangkas
   (area transparan dibuang otomatis), jadi hasilnya konsisten. */
const ENVELOPE = {
  maxWidth: 520, // px, lebar maksimum di layar besar
  maxHeightVh: 80, // tinggi maksimum relatif tinggi layar
  text: { x: '50%', y: '35.5%', width: '60%' }, // pusat teks & lebar area teks
};

/* Bingkai oval: area "lubang" tempat foto muncul (juga dalam persen). */
const FRAME = {
  maxWidth: 340,
  photo: { x: '50%', y: '51.5%', width: '73%', height: '66.5%' },
};

const STORY = [
  'Semuanya mengalir begitu aja. Dari obrolan biasa sampai akhirnya kita punya tempat buat saling cerita apapun. Tahun pertama ini bukti kalau hal-hal baik butuh waktu buat tumbuh.',
  `Terima kasih udah jadi teman debat, teman main, dan pendengar paling sabar buat aku. Perjalanan ini mungkin jauh dari kata sempurna, tapi aku bersyukur menjalaninya sama kamu, ${NAME}.`,
];

/* Galeri: foto diambil dari public/galeri-N.jpg
   - Foto 1-6 sudah ada. Slot 7-15 sudah disiapkan.
   - Tinggal taruh file galeri-7.jpg ... galeri-15.jpg di folder public/,
     lalu (kalau mau) ubah title & note-nya di bawah.
   - Slot yang filenya belum ada otomatis disembunyikan, jadi tidak ada kotak kosong.
   - Mau lebih dari 15? Tambah baris baru dengan pola yang sama.
   - note boleh dikosongkan (''), maka hanya judul yang tampil di layar penuh. */
const GALLERY = [
  {
    src: '/galeri-1.jpg',
    title: 'Fotbar pertama',
    note: 'Disini pertama kali kita duduk sebelahan dan foto bareng pertama kita, lcuu bgt yekan',
  },
  {
    src: '/galeri-2.jpg',
    title: 'Couple Dino',
    note: 'Disini kita lucu bgt couple dino, dan dari momen sini sudah muali bnyk wishlist ku ke kamu yg terlaksanakan',
  },
  {
    src: '/galeri-3.jpg',
    title: 'Ramayana',
    note: 'disini kiat bingung jir mw kemana, jadi keramayana aja. trus bingung lagi wkwk',
    pos: 'center 30%',
  },
  {
    src: '/galeri-4.jpg',
    title: 'Gacoan kala itu',
    note: 'Disini mama kamu tiba tiba ngajakin aku makan gacoan bareng keluarga mu, lucu bgt',
  },
  {
    src: '/galeri-5.jpg',
    title: 'Trend pertama',
    note: 'ini trend pertama yg kita buat bareng, ingat kan videonya sayang. Lucu bgttt',
  },
  {
    src: '/galeri-6.jpg',
    title: 'Fotbar terakhir',
    note: 'ini fotbar terakhir, soalnya blm ada fotbar lagi wkwkwk',
    pos: 'center 30%',
  },
  {
    src: '/galeri-7.jpg',
    title: 'Tahun Baru',
    note: 'ini pertama kali kita tahun baruan bareng, disini kita jadi makin loplop'
  },
  {
    src: '/galeri-8.jpg',
    title: 'Teater',
    note: 'ini pertama kali kita nonton teater bareng, disini kita minta potbar lucu tuh'
  },
  {
    src: '/galeri-9.jpg',
    title: 'Mixue',
    note: 'Aku suka makeup mu yang ini, rasanya kyk aku ngeliat bidadari, so beautiful'
  },
  {
    src: '/galeri-10.jpg',
    title: 'NextLevel',
    note: 'Date ps pertama kita tuh, byone tekken bos'
  },
  {
    src: '/galeri-11.jpg',
    title: 'Babandungan',
    note: 'Disini kamu lucu bgt, pipinya tembem bgt wkwk, terus langganan kita tuh seblaknya'
  },
  {
    src: '/galeri-12.jpg',
    title: 'Jogging bareng',
    note: 'Ini jogging date pertama kita, terus lu ngosngosan tuh. maunya gw gendong'
  },
  {
    src: '/galeri-13.jpg',
    title: 'Terra where it all begins',
    note: 'ini momen makan bareng pertama kali kita disini, disini aku mulai suka sama kamu karena kmu ngertiin aku bgt'
  },
  {
    src: '/galeri-14.jpg',
    title: 'Pramuka',
    note: 'ini fotbar kita sebelum libur ujian tuh, kmu lucu bgt disini pengen aku cium'
  },
  {
    src: '/galeri-15.jpg',
    title: 'Bioskop',
    note: 'ini momen pertama kali kita nonton bioskop bareng, dan film yg kita tonton itu AADC. disini aku clingy bgt ke kmu'
  },
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

const NAV_LINKS = [
  { href: '#opening', label: 'Opening' },
  { href: '#inside', label: 'Inside' },
  { href: '#letter', label: 'Letter' },
];

/* =====================================================================
   RESET GLOBAL
   Template Vite bawaan memakai `body { display:flex; min-width:320px }` dan
   `#root { padding; text-align:center }` yang membuat halaman melebar dan
   terpotong. Blok ini menimpanya.
===================================================================== */
const GlobalReset = () => (
  <style>{`
    html { scroll-behavior: smooth; scrollbar-gutter: stable; }
    html, body { margin: 0 !important; padding: 0 !important; background: #1a0207; }
    body { display: block !important; min-width: 0 !important; place-items: unset !important; }
    #root { max-width: none !important; width: 100% !important; margin: 0 !important; padding: 0 !important; text-align: left !important; }
    @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
  `}</style>
);

/* Muat font Google (tulisan tangan untuk surat) satu kali saja */
function useGoogleFonts(href) {
  useEffect(() => {
    if (document.querySelector('link[data-app-fonts]')) return;
    const pre = document.createElement('link');
    pre.rel = 'preconnect';
    pre.href = 'https://fonts.gstatic.com';
    pre.crossOrigin = 'anonymous';
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.appFonts = '1';
    document.head.append(pre, link);
  }, [href]);
}

/* =====================================================================
   PANGKAS AREA TRANSPARAN GAMBAR PNG
   File PNG biasanya punya "padding" transparan yang tidak terlihat, sehingga
   gambar tampak lebih kecil dan posisi teks/foto di atasnya meleset.
   Fungsi ini memangkas padding itu, jadi ukuran & posisi bisa dihitung presisi.
===================================================================== */
const trimCache = new Map();

function trimTransparentPadding(src, alphaThreshold = 16) {
  if (trimCache.has(src)) return trimCache.get(src);

  const promise = new Promise((resolve) => {
    const img = new Image();
    img.onerror = () => resolve({ url: src, width: 0, height: 0 });
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const fallback = { url: src, width: w, height: h };
      try {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);
        const { data } = ctx.getImageData(0, 0, w, h);

        let minX = w, minY = h, maxX = -1, maxY = -1;
        for (let y = 0; y < h; y++) {
          const row = y * w * 4;
          for (let x = 0; x < w; x++) {
            if (data[row + x * 4 + 3] > alphaThreshold) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }
        if (maxX < 0) return resolve(fallback);

        const cw = maxX - minX + 1;
        const ch = maxY - minY + 1;
        if (cw === w && ch === h) return resolve(fallback);

        const out = document.createElement('canvas');
        out.width = cw;
        out.height = ch;
        out.getContext('2d').drawImage(canvas, minX, minY, cw, ch, 0, 0, cw, ch);
        out.toBlob((blob) => {
          if (!blob) return resolve(fallback);
          resolve({ url: URL.createObjectURL(blob), width: cw, height: ch });
        }, 'image/png');
      } catch (err) {
        console.warn('Gagal memangkas gambar, memakai gambar asli:', src, err);
        resolve(fallback);
      }
    };
    img.src = src;
  });

  trimCache.set(src, promise);
  return promise;
}

function useTrimmedImage(src) {
  const [info, setInfo] = useState(null);
  useEffect(() => {
    let alive = true;
    setInfo(null);
    trimTransparentPadding(src).then((res) => alive && setInfo(res));
    return () => {
      alive = false;
    };
  }, [src]);
  return info;
}

const ratioOf = (info, fallback) =>
  info && info.width && info.height ? info.width / info.height : fallback;

/* =====================================================================
   ANIMASI
===================================================================== */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: 'easeOut' } },
};

const reveal = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-80px' },
  variants: fadeUp,
};

/* =====================================================================
   KOMPONEN KECIL
===================================================================== */
const SectionTitle = ({ children, className = '' }) => (
  <motion.h2
    {...reveal}
    className={`text-center text-[#d4af37] drop-shadow-md ${className}`}
  >
    {children}
  </motion.h2>
);

const formatTime = (s) => {
  if (!Number.isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

const Icon = ({ children, className = 'h-7 w-7', fill = 'none' }) => (
  <svg
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const PlayIcon = () => (
  <Icon fill="currentColor" className="ml-1 h-7 w-7">
    <path
      stroke="none"
      d="M4.5 5.65c0-1.43 1.53-2.33 2.78-1.64l11.54 6.35c1.3.71 1.3 2.57 0 3.28L7.28 19.99c-1.25.69-2.78-.22-2.78-1.64V5.65z"
    />
  </Icon>
);
const PauseIcon = () => (
  <Icon>
    <path d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
  </Icon>
);
const CloseIcon = () => (
  <Icon className="h-6 w-6">
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);
const ChevronIcon = ({ dir = 'right' }) => (
  <Icon className="h-6 w-6">
    <path d={dir === 'right' ? 'M9 5l7 7-7 7' : 'M15 5l-7 7 7 7'} />
  </Icon>
);
const ZoomIcon = () => (
  <Icon className="h-5 w-5">
    <circle cx="11" cy="11" r="6" />
    <path d="M20 20l-4.2-4.2M11 8.5v5M8.5 11h5" />
  </Icon>
);

/* =====================================================================
   1. AMPLOP
===================================================================== */
function EnvelopeSection({ isOpen, onOpen }) {
  const closed = useTrimmedImage(ASSETS.envelopeClosed);
  const open = useTrimmedImage(ASSETS.envelopeOpen);

  const current = isOpen ? open : closed;
  const ratio = ratioOf(current, 0.6);
  const interactive = !isOpen;

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <section
      id="opening"
      className="relative flex min-h-screen scroll-mt-16 flex-col items-center justify-center px-5 py-24"
    >
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mb-8 text-center text-3xl leading-tight text-[#d4af37] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-4xl md:mb-10 md:text-5xl"
      >
        Special Letter For You
      </motion.h1>

      <div
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label={interactive ? 'Buka amplop' : undefined}
        onClick={interactive ? onOpen : undefined}
        onKeyDown={interactive ? handleKey : undefined}
        className={`relative rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/70 ${interactive ? 'cursor-pointer' : ''
          }`}
        style={{
          width: `min(92vw, ${ENVELOPE.maxWidth}px, calc(${ENVELOPE.maxHeightVh}vh * ${ratio}))`,
          aspectRatio: ratio,
          opacity: current ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        {current && !isOpen && (
          <motion.div
            key="closed"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.5 }}
            className="h-full w-full"
          >
            <img
              src={current.url}
              alt="Amplop tertutup"
              className="block h-full w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
            />
          </motion.div>
        )}

        {current && isOpen && (
          <motion.div
            key="open"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="relative h-full w-full"
          >
            <img
              src={current.url}
              alt="Amplop terbuka"
              className="block h-full w-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            />
            {/* Teks berada tepat di tengah kartu. Ukuran huruf (cqw) mengikuti
                lebar area teks, jadi proporsinya sama di semua ukuran layar. */}
            <div
              className="absolute z-20 text-center text-[#3b0715]"
              style={{
                left: ENVELOPE.text.x,
                top: ENVELOPE.text.y,
                width: ENVELOPE.text.width,
                transform: 'translate(-50%, -50%)',
                containerType: 'inline-size',
              }}
            >
              <p
                className="font-sans uppercase"
                style={{ fontSize: '6.5cqw', letterSpacing: '0.3em', marginRight: '-0.3em' }}
              >
                Happy
              </p>
              <p
                className="font-bold"
                style={{ fontSize: '17cqw', lineHeight: 1.1, margin: '1.5cqw 0' }}
              >
                1st Year
              </p>
              <p className="italic" style={{ fontSize: '11cqw', lineHeight: 1.15 }}>
                Anniversary
                <br />
                Sayang
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {!isOpen && (
        <p className="mt-8 text-sm uppercase tracking-[0.2em] text-[#f5e7e1]/70 motion-safe:animate-pulse">
          Tap to open
        </p>
      )}
    </section>
  );
}

/* =====================================================================
   2. BINGKAI OVAL + CERITA
===================================================================== */
function OvalFrame() {
  const frame = useTrimmedImage(ASSETS.frame);
  const ratio = ratioOf(frame, 0.68);
  const p = FRAME.photo;

  return (
    <div
      className="relative"
      style={{
        width: `min(76vw, ${FRAME.maxWidth}px)`,
        aspectRatio: ratio,
        opacity: frame ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
    >
      {/* Foto dipas ke lubang bingkai; tepinya tersembunyi di balik bingkai emas */}
      <img
        src={ASSETS.storyPhoto}
        alt="Awal cerita kita"
        className="absolute z-0 rounded-[50%] object-cover shadow-2xl"
        style={{
          left: p.x,
          top: p.y,
          width: p.width,
          height: p.height,
          transform: 'translate(-50%, -50%)',
          objectPosition: '50% 35%',
        }}
      />
      {frame && (
        <img
          src={frame.url}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 block h-full w-full drop-shadow-2xl"
        />
      )}
      {/* Bunga di kanan atas bingkai */}
      <img
        src={ASSETS.flowerLeft}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute z-20 object-contain drop-shadow-lg"
        style={{ right: '-9%', top: '1%', width: '34%', transform: 'rotate(18deg)' }}
      />
    </div>
  );
}

function StorySection() {
  return (
    <section
      id="inside"
      className="mx-auto max-w-6xl scroll-mt-16 border-t border-[#f5e7e1]/10 px-6 py-24 md:py-32"
    >
      <div className="flex flex-col items-center gap-16 md:flex-row md:gap-20">
        <motion.div {...reveal} className="flex w-full justify-center md:w-1/2">
          <OvalFrame />
        </motion.div>

        <motion.div
          {...reveal}
          className="w-full space-y-8 text-center md:w-1/2 md:text-left"
        >
          <h2 className="text-3xl leading-tight text-[#d4af37] drop-shadow-md sm:text-4xl md:text-5xl">
            Did you remember
            <br />
            how this story began?
          </h2>
          <div className="mx-auto max-w-prose space-y-6 text-left font-sans text-base font-light leading-loose text-[#f5e7e1]/90 md:mx-0 md:text-lg">
            {STORY.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* =====================================================================
   3. PLAYER VINYL
===================================================================== */
const Tonearm = ({ playing }) => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30">
    <div
      className="absolute rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
      style={{
        left: '92%',
        top: '6%',
        width: '10%',
        height: '10%',
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle at 35% 30%, #f1ead9, #9b917c 60%, #4a4438)',
      }}
    />
    <motion.div
      initial={false}
      animate={{ rotate: playing ? 30 : -22 }}
      transition={{ type: 'spring', stiffness: 40, damping: 14 }}
      className="absolute"
      style={{
        left: '92%',
        top: '6%',
        width: '2.4%',
        height: '46%',
        marginLeft: '-1.2%',
        transformOrigin: '50% 0%',
      }}
    >
      <div className="h-full w-full rounded-full bg-gradient-to-r from-[#8d836f] via-[#e9e2d0] to-[#8d836f] shadow-md" />
      <div className="absolute -bottom-[2%] left-1/2 h-[10%] w-[240%] -translate-x-1/2 rounded-[2px] bg-[#1d1a16]" />
    </motion.div>
  </div>
);

function MusicSection() {
  const vinyl = useTrimmedImage(ASSETS.vinyl);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [progress, setProgress] = useState({ current: 0, duration: 0 });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () =>
      setProgress({ current: audio.currentTime, duration: audio.duration });
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      setIsPlaying(false);
      setAudioError(true);
    };
    const onReady = () => setAudioError(false);

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onTime);
    audio.addEventListener('canplay', onReady);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onTime);
      audio.removeEventListener('canplay', onReady);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    try {
      setAudioError(false);
      await audio.play();
    } catch (err) {
      if (err && err.name === 'AbortError') return;
      console.error('Lagu gagal diputar. Pastikan file ada di', ASSETS.song, err);
      setIsPlaying(false);
      setAudioError(true);
    }
  }, []);

  const skip = (seconds) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = Math.min(
      Math.max(0, audio.currentTime + seconds),
      audio.duration
    );
  };

  const seekTo = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = Math.min(Math.max(ratio, 0), 1) * audio.duration;
  };

  const percent = progress.duration
    ? Math.min((progress.current / progress.duration) * 100, 100)
    : 0;
  const ratio = ratioOf(vinyl, 1);

  return (
    <section className="flex flex-col items-center border-t border-[#f5e7e1]/10 bg-black/25 px-6 py-24 md:py-32">
      <SectionTitle className="mb-14 text-3xl tracking-wider md:mb-16 md:text-4xl">
        Play Our Favorite Song
      </SectionTitle>

      {/* loop: lagu berulang terus sampai dihentikan */}
      <audio ref={audioRef} src={ASSETS.song} loop preload="auto" />

      <div
        className="relative mb-8"
        style={{
          width: 'min(72vw, 400px)',
          aspectRatio: ratio,
          opacity: vinyl ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Hentikan lagu' : 'Putar lagu'}
          aria-pressed={isPlaying}
          className="absolute inset-0 rounded-full outline-none transition-transform duration-300 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[#d4af37]/70"
        >
          <div
            className="h-full w-full animate-spin will-change-transform"
            style={{
              animationDuration: '6s',
              animationTimingFunction: 'linear',
              animationPlayState: isPlaying ? 'running' : 'paused',
            }}
          >
            {vinyl && (
              <img
                src={vinyl.url}
                alt=""
                className="block h-full w-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
              />
            )}
            <img
              src={ASSETS.vinylLabel}
              alt=""
              className="absolute left-1/2 top-1/2 h-[32%] w-[32%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[#1a1a1a] object-cover"
            />
          </div>
        </button>
        <Tonearm playing={isPlaying} />
      </div>

      <p
        role="status"
        className="mb-10 min-h-[1.5rem] text-center font-sans text-sm text-[#f5e7e1]/65"
      >
        {audioError
          ? 'Lagunya belum bisa diputar. Coba muat ulang halaman ya.'
          : isPlaying
            ? 'Sedang berputar. Ketuk piringan untuk menghentikan.'
            : 'Ketuk piringan untuk memutar lagu kita.'}
      </p>

      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <div className="w-full">
          <div onClick={seekTo} className="flex h-5 w-full cursor-pointer items-center">
            <div className="relative h-[3px] w-full rounded-full bg-[#f5e7e1]/25">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-[#d4af37] shadow-[0_0_10px_#d4af37]"
                style={{ width: `${percent}%` }}
              />
              <div
                className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg"
                style={{ left: `${percent}%` }}
              />
            </div>
          </div>
          <div className="mt-2 flex justify-between font-sans text-xs text-[#f5e7e1]/60">
            <span>{formatTime(progress.current)}</span>
            <span>{formatTime(progress.duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <button
            type="button"
            onClick={() => skip(-10)}
            aria-label="Mundur 10 detik"
            className="text-sm text-[#f5e7e1]/70 transition hover:scale-110 hover:text-white"
          >
            −10s
          </button>
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Hentikan lagu' : 'Putar lagu'}
            className="flex h-16 w-16 items-center justify-center rounded-full border border-[#d4af37] text-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.2)] outline-none transition-all duration-300 hover:bg-[#d4af37] hover:text-[#3b0715] focus-visible:ring-2 focus-visible:ring-[#d4af37]/70"
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            type="button"
            onClick={() => skip(10)}
            aria-label="Maju 10 detik"
            className="text-sm text-[#f5e7e1]/70 transition hover:scale-110 hover:text-white"
          >
            +10s
          </button>
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   4. GALERI + LIGHTBOX
===================================================================== */
const slide = {
  enter: (dir) => ({ opacity: 0, x: dir * 60, scale: 0.92 }),
  center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: (dir) => ({ opacity: 0, x: dir * -60, scale: 0.96, transition: { duration: 0.2 } }),
};

function Lightbox({ items, index, direction, onClose, onNavigate }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const item = items[index];

  // Keyboard: Esc, panah kiri/kanan, dan Tab tetap berputar di dalam dialog
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onNavigate(1);
      else if (e.key === 'ArrowLeft') onNavigate(-1);
      else if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll('button');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onNavigate]);

  // Kunci scroll halaman selagi lightbox terbuka
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Muat foto sebelum/sesudahnya supaya perpindahan mulus
  useEffect(() => {
    [index + 1, index - 1].forEach((i) => {
      const it = items[(i + items.length) % items.length];
      const img = new Image();
      img.src = it.src;
    });
  }, [index, items]);

  const onDragEnd = (_, info) => {
    if (info.offset.x < -70 || info.velocity.x < -500) onNavigate(1);
    else if (info.offset.x > 70 || info.velocity.x > 500) onNavigate(-1);
  };

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Foto kenangan: ${item.title}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#12010a]/95 px-4 py-6 backdrop-blur-md"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Tutup"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[#f5e7e1]/30 text-[#f5e7e1] outline-none transition hover:bg-[#f5e7e1]/10 focus-visible:ring-2 focus-visible:ring-[#d4af37]"
      >
        <CloseIcon />
      </button>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.figure
          key={index}
          custom={direction}
          variants={slide}
          initial="enter"
          animate="center"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          onDragEnd={onDragEnd}
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-full w-full max-w-3xl flex-col items-center"
        >
          <img
            src={item.src}
            alt={item.title}
            draggable={false}
            className="max-h-[58vh] w-auto max-w-full select-none rounded-sm border-[6px] border-[#f5e7e1] object-contain shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
          />
          <figcaption className="mt-6 max-w-xl text-center">
            <h3
              className="text-4xl text-[#d4af37] md:text-5xl"
              style={{ fontFamily: FONTS.script }}
            >
              {item.title}
            </h3>
            {item.note && (
              <p
                className="mt-3 text-[1.45rem] leading-snug text-[#f5e7e1]/90 md:text-[1.7rem]"
                style={{ fontFamily: FONTS.hand, textWrap: 'pretty' }}
              >
                {item.note}
              </p>
            )}
          </figcaption>
        </motion.figure>
      </AnimatePresence>

      <div
        className="mt-6 flex items-center gap-6 text-[#f5e7e1]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => onNavigate(-1)}
          aria-label="Foto sebelumnya"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f5e7e1]/30 outline-none transition hover:bg-[#f5e7e1]/10 focus-visible:ring-2 focus-visible:ring-[#d4af37]"
        >
          <ChevronIcon dir="left" />
        </button>
        <span className="min-w-[3.5rem] text-center font-sans text-sm tabular-nums text-[#f5e7e1]/70">
          {index + 1} / {items.length}
        </span>
        <button
          type="button"
          onClick={() => onNavigate(1)}
          aria-label="Foto berikutnya"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f5e7e1]/30 outline-none transition hover:bg-[#f5e7e1]/10 focus-visible:ring-2 focus-visible:ring-[#d4af37]"
        >
          <ChevronIcon dir="right" />
        </button>
      </div>
    </motion.div>
  );
}

function GallerySection() {
  const [failed, setFailed] = useState(() => new Set());
  const [activeSrc, setActiveSrc] = useState(null);
  const [direction, setDirection] = useState(0);
  const triggerRef = useRef(null);

  // Foto yang filenya belum ada disembunyikan otomatis
  const visible = useMemo(() => GALLERY.filter((g) => !failed.has(g.src)), [failed]);
  const visibleRef = useRef(visible);
  visibleRef.current = visible;

  // Lightbox melacak foto lewat src (bukan nomor urut), jadi tetap benar
  // walaupun daftar foto yang tampil berubah.
  const activeIndex = activeSrc ? visible.findIndex((g) => g.src === activeSrc) : -1;

  const markFailed = (src) =>
    setFailed((prev) => (prev.has(src) ? prev : new Set(prev).add(src)));

  const openPhoto = (src, el) => {
    triggerRef.current = el;
    setDirection(0);
    setActiveSrc(src);
  };

  const close = useCallback(() => {
    setActiveSrc(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const navigate = useCallback((dir) => {
    setDirection(dir);
    setActiveSrc((current) => {
      const list = visibleRef.current;
      const i = list.findIndex((g) => g.src === current);
      if (i < 0 || !list.length) return current;
      return list[(i + dir + list.length) % list.length].src;
    });
  }, []);

  return (
    <section className="mx-auto max-w-6xl border-t border-[#f5e7e1]/10 px-5 py-24 md:px-12 md:py-32">
      <SectionTitle className="text-3xl sm:text-4xl md:text-5xl">Our Memories</SectionTitle>
      <p className="mb-14 mt-4 text-center font-sans text-sm text-[#f5e7e1]/60 md:mb-16">
        Ketuk foto untuk melihat lebih dekat
      </p>

      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <motion.button
            key={item.src}
            type="button"
            {...reveal}
            onClick={(e) => openPhoto(item.src, e.currentTarget)}
            aria-label={`Perbesar foto: ${item.title}`}
            className="group block w-full text-left outline-none"
          >
            <div className="bg-[#f5e7e1] p-3 pb-4 shadow-[0_12px_28px_rgba(0,0,0,0.5)] transition duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_18px_36px_rgba(0,0,0,0.6)] group-focus-visible:ring-2 group-focus-visible:ring-[#d4af37]">
              <div className="relative overflow-hidden">
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  onError={() => markFailed(item.src)}
                  className="block aspect-[3/2] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: item.pos || 'center' }}
                />
                <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#3b0715]/70 text-[#f5e7e1] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <ZoomIcon />
                </span>
              </div>
              <p
                className="mt-3 text-center text-[1.6rem] leading-none text-[#3b0715]"
                style={{ fontFamily: FONTS.hand }}
              >
                {item.title}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {activeIndex >= 0 && (
          <Lightbox
            key="lightbox"
            items={visible}
            index={activeIndex}
            direction={direction}
            onClose={close}
            onNavigate={navigate}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* =====================================================================
   5. SURAT
===================================================================== */
function LetterSection() {
  // Pangkas area transparan PNG kertas, supaya tepi kertas = tepi kotak surat
  // dan jarak teks ke tepi (padding) dihitung dari kertas yang benar-benar terlihat.
  const paper = useTrimmedImage(ASSETS.paper);

  return (
    <section
      id="letter"
      className="flex scroll-mt-16 items-center justify-center border-t border-[#f5e7e1]/10 bg-black/30 px-5 py-24 md:px-6 md:py-32"
    >
      <motion.div
        {...reveal}
        className="relative w-full max-w-[700px]"
        style={{ opacity: paper ? undefined : 0 }}
      >
        {paper && (
          <img
            src={paper.url}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 z-0 h-full w-full object-fill drop-shadow-2xl"
          />
        )}

        {/* Bunga di sudut kiri atas kertas, tidak menimpa judul */}
        <img
          src={ASSETS.flowerRight}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -left-4 -top-9 z-20 w-20 drop-shadow-lg md:-left-10 md:-top-12 md:w-40"
        />

        {/* Padding dalam persen: teks selalu aman dari tepi kertas yang sobek */}
        <div className="relative z-10 px-[13%] pb-20 pt-20 text-[#3b0715] md:px-[14%] md:pb-28 md:pt-28">
          <h2
            className="text-5xl leading-none md:text-6xl"
            style={{ fontFamily: FONTS.script }}
          >
            Dear {NAME},
          </h2>

          <div
            className="mt-8 space-y-5 text-[1.4rem] leading-[1.5] md:mt-10 md:text-[1.7rem]"
            style={{ fontFamily: FONTS.hand, fontWeight: 500, textWrap: 'pretty' }}
          >
            {LETTER.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p>
              {LETTER.closing}{' '}
              <span
                aria-hidden="true"
                style={{
                  filter:
                    'drop-shadow(0 0 0.6px #3b0715) drop-shadow(0 0 0.6px #3b0715)',
                }}
              >
                {LETTER.hearts}
              </span>
            </p>
          </div>

          <div className="mt-10 text-right md:mt-14">
            <p className="text-2xl md:text-3xl" style={{ fontFamily: FONTS.hand }}>
              With all my love,
            </p>
            <p
              className="mt-1 text-5xl leading-none md:text-6xl"
              style={{ fontFamily: FONTS.script }}
            >
              {FROM}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* =====================================================================
   APP
===================================================================== */
export default function App() {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  useGoogleFonts(GOOGLE_FONTS_URL);

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="relative isolate w-full min-w-0 bg-[#1a0207] font-serif text-[#f5e7e1] selection:bg-[#f5e7e1] selection:text-[#3b0715]"
        style={{ overflowX: 'clip' }}
      >
        <GlobalReset />

        {/* Background */}
        <motion.div
          style={{ y: backgroundY, backgroundImage: `url(${ASSETS.background})` }}
          className="fixed -top-[10%] left-0 -z-20 h-[120%] w-full bg-cover bg-center"
        />
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#2a040e]/95 via-[#3b0715]/90 to-[#1a0207]/95" />

        {/* Navigasi */}
        <nav className="fixed inset-x-0 top-0 z-50 flex justify-center gap-6 bg-gradient-to-b from-[#1a0207]/90 to-transparent px-4 py-4 text-[11px] uppercase tracking-[0.18em] text-[#f5e7e1]/75 md:justify-end md:gap-8 md:px-10 md:py-6 md:text-xs">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>

        <EnvelopeSection
          isOpen={isEnvelopeOpen}
          onOpen={() => setIsEnvelopeOpen(true)}
        />
        <StorySection />
        <MusicSection />
        <GallerySection />
        <LetterSection />
      </div>
    </MotionConfig>
  );
}