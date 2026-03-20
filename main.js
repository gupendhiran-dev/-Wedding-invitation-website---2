/* =============================================
   WEDDING INVITE — MAIN.JS
   App initialization, Lenis, cursor, nav
   ============================================= */

// ─── Preloader ───────────────────────────────
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  setTimeout(() => {
    preloader.style.transition = 'opacity 1.2s ease';
    preloader.style.opacity = '0';
    setTimeout(() => {
      preloader.style.display = 'none';
      initAnimations();
    }, 1200);
  }, 2500);
}

// ─── Smooth Scrolling (Lenis) ─────────────────
let lenis;

function initLenis() {
  if (typeof Lenis === 'undefined') return;
  lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // GSAP ScrollTrigger integration
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }
}

// ─── Custom Cursor ────────────────────────────
function initCursor() {
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effects
  document.querySelectorAll('a, button, [data-cursor="pointer"]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2)';
      cursor.style.background = 'var(--rose)';
      follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
      follower.style.opacity = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.background = 'var(--gold)';
      follower.style.transform = 'translate(-50%, -50%) scale(1)';
      follower.style.opacity = '0.6';
    });
  });
}

// ─── Navigation Dots ──────────────────────────
function initNavDots() {
  const dots = document.querySelectorAll('.nav-dot');
  const sections = document.querySelectorAll('section[id]');
  if (!dots.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        dots.forEach(d => d.classList.remove('active'));
        const active = document.querySelector(`.nav-dot[data-target="${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.target);
      if (target && lenis) lenis.scrollTo(target, { duration: 2 });
      else if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ─── Scroll Progress Bar ──────────────────────
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollTop / docHeight;
    bar.style.transform = `scaleX(${progress})`;
  });
}

// ─── Music Toggle ─────────────────────────────
function initMusicToggle() {
  const btn = document.getElementById('music-btn');
  const audio = document.getElementById('bg-music');
  if (!btn || !audio) return;

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.volume = 0;
      audio.play();
      fadeAudio(audio, 0, 0.3, 2000);
      btn.classList.add('playing');
      btn.querySelector('.music-icon').textContent = '🎵';
    } else {
      fadeAudio(audio, audio.volume, 0, 1000, () => audio.pause());
      btn.classList.remove('playing');
      btn.querySelector('.music-icon').textContent = '🎶';
    }
  });
}

function fadeAudio(audio, from, to, duration, cb) {
  const steps = 30;
  const stepTime = duration / steps;
  const stepSize = (to - from) / steps;
  let step = 0;

  const interval = setInterval(() => {
    audio.volume = Math.max(0, Math.min(1, from + stepSize * step));
    step++;
    if (step > steps) {
      clearInterval(interval);
      if (cb) cb();
    }
  }, stepTime);
}

// ─── Scroll Reveal ────────────────────────────
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ─── Envelope Opening ─────────────────────────
function initEnvelope() {
  const openBtn = document.getElementById('open-env-btn');
  const envelope = document.querySelector('.envelope');
  const flap = document.querySelector('.envelope-flap');
  const card = document.querySelector('.invitation-card');
  const glow = document.querySelector('.envelope-glow');
  if (!openBtn || !envelope) return;

  openBtn.addEventListener('click', () => {
    envelope.classList.add('opened');
    flap.classList.add('open');
    setTimeout(() => {
      if (card) card.classList.add('revealed');
      if (glow) glow.classList.add('active');
    }, 800);
    openBtn.style.opacity = '0';
    openBtn.style.pointerEvents = 'none';
    createEnvelopeParticles();
  });
}

function createEnvelopeParticles() {
  const container = document.querySelector('.envelope-wrapper');
  if (!container) return;
  const emojis = ['✨', '💛', '🌸', '✨', '🌟'];
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'float-element sparkle';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.cssText = `
      left: ${20 + Math.random() * 60}%;
      top: ${Math.random() * 60}%;
      font-size: ${0.8 + Math.random()}rem;
      --duration: ${2 + Math.random() * 3}s;
      --delay: ${Math.random() * 0.5}s;
      background: transparent;
      box-shadow: none;
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), 5000);
  }
}

// ─── Countdown Timer ──────────────────────────
function initCountdown() {
  const weddingDate = new Date('2025-12-15T10:00:00');

  function update() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-mins').textContent = '00';
      document.getElementById('cd-secs').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    setNumber('cd-days', days);
    setNumber('cd-hours', hours);
    setNumber('cd-mins', mins);
    setNumber('cd-secs', secs);
  }

  function setNumber(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    const str = String(val).padStart(2, '0');
    if (el.textContent !== str) {
      el.classList.add('countdown-flip');
      el.textContent = str;
      setTimeout(() => el.classList.remove('countdown-flip'), 300);
    }
  }

  update();
  setInterval(update, 1000);
}

// ─── RSVP Form ────────────────────────────────
function initRSVP() {
  const form = document.getElementById('rsvp-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.rsvp-submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      const success = document.querySelector('.rsvp-success');
      if (success) success.classList.add('show');
      createConfetti();
    }, 1500);
  });
}

function createConfetti() {
  const colors = ['🌸', '✨', '💛', '🌺', '💕', '🌿'];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'float-element heart';
    p.textContent = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: 0;
      font-size: ${0.8 + Math.random() * 1.2}rem;
      --duration: ${3 + Math.random() * 4}s;
      --delay: ${Math.random() * 2}s;
      --rot: ${Math.random() * 40 - 20}deg;
      background: transparent;
    `;
    document.querySelector('#rsvp').appendChild(p);
    setTimeout(() => p.remove(), 7000);
  }
}

// ─── Gallery Lightbox ─────────────────────────
function initGallery() {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbClose = document.getElementById('lightbox-close');
  const items = document.querySelectorAll('.gallery-item');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const emoji = item.querySelector('.gallery-item-inner')?.textContent;
      if (!lightbox) return;
      // Show placeholder in lightbox
      lbImg.src = '';
      lbImg.alt = emoji || 'Gallery';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (lbClose) {
    lbClose.addEventListener('click', closeLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  function closeLightbox() {
    if (lightbox) lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

// ─── Floating Decorations ─────────────────────
function createHeroDecorations() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  // Petals
  const petalColors = ['petal-pink', 'petal-cream', 'petal-rose'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = `float-element petal ${petalColors[i % 3]}`;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${-20 + Math.random() * 20}px;
      --duration: ${7 + Math.random() * 8}s;
      --delay: ${Math.random() * 8}s;
      --drift: ${(Math.random() - 0.5) * 120}px;
      transform: rotate(${Math.random() * 360}deg);
    `;
    hero.appendChild(p);
  }

  // Butterflies
  const butterflyEmojis = ['🦋', '🦋'];
  for (let i = 0; i < 4; i++) {
    const b = document.createElement('div');
    b.className = 'float-element butterfly';
    b.textContent = butterflyEmojis[i % 2];
    b.style.cssText = `
      left: ${10 + Math.random() * 80}%;
      top: ${20 + Math.random() * 50}%;
      --size: ${1.2 + Math.random() * 0.8}rem;
      --duration: ${8 + Math.random() * 6}s;
      --delay: ${Math.random() * 6}s;
    `;
    hero.appendChild(b);
  }

  // Sparkles
  for (let i = 0; i < 25; i++) {
    const s = document.createElement('div');
    s.className = 'float-element sparkle';
    s.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 80}%;
      --size: ${3 + Math.random() * 6}px;
      --duration: ${4 + Math.random() * 4}s;
      --delay: ${Math.random() * 5}s;
    `;
    hero.appendChild(s);
  }

  // Birds
  for (let i = 0; i < 3; i++) {
    const b = document.createElement('div');
    b.className = 'float-element bird';
    b.textContent = '🕊️';
    b.style.cssText = `
      top: ${10 + Math.random() * 25}%;
      left: -80px;
      --size: ${0.9 + Math.random() * 0.4}rem;
      --duration: ${12 + Math.random() * 8}s;
      --delay: ${Math.random() * 10}s;
    `;
    hero.appendChild(b);
  }

  // Clouds
  for (let i = 0; i < 3; i++) {
    const c = document.createElement('div');
    c.className = 'float-element cloud-anim';
    c.textContent = '☁';
    c.style.cssText = `
      top: ${5 + Math.random() * 25}%;
      left: -150px;
      --size: ${3 + Math.random() * 3}rem;
      --duration: ${50 + Math.random() * 40}s;
      --delay: ${Math.random() * 20}s;
      --opacity: ${0.08 + Math.random() * 0.12};
    `;
    hero.appendChild(c);
  }
}

function createThankYouDecorations() {
  const section = document.getElementById('thankyou');
  if (!section) return;

  // Hearts
  for (let i = 0; i < 20; i++) {
    const h = document.createElement('div');
    h.className = 'float-element heart';
    h.textContent = ['❤️', '🌸', '✨', '💛'][Math.floor(Math.random() * 4)];
    h.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 30}%;
      --size: ${0.8 + Math.random() * 1.4}rem;
      --duration: ${6 + Math.random() * 5}s;
      --delay: ${Math.random() * 4}s;
      --rot: ${Math.random() * 30 - 15}deg;
    `;
    section.appendChild(h);
  }

  // Lanterns
  for (let i = 0; i < 6; i++) {
    const l = document.createElement('div');
    l.className = 'float-element lantern';
    l.textContent = '🏮';
    l.style.cssText = `
      left: ${10 + Math.random() * 80}%;
      bottom: ${-5 + Math.random() * 20}%;
      --size: ${1.5 + Math.random() * 1}rem;
      --duration: ${12 + Math.random() * 8}s;
      --delay: ${Math.random() * 6}s;
      --drift: ${(Math.random() - 0.5) * 60}px;
      --drift2: ${(Math.random() - 0.5) * 40}px;
    `;
    section.appendChild(l);
  }
}

// ─── Stars for dark sections ──────────────────
function createStars(container) {
  if (!container) return;
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('div');
    s.className = 'float-element star-twinkle';
    s.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      --size: ${1 + Math.random() * 3}px;
      --duration: ${2 + Math.random() * 4}s;
      --delay: ${Math.random() * 4}s;
    `;
    container.appendChild(s);
  }
}

// ─── Animate Hero Elements ────────────────────
function initAnimations() {
  // Hero content stagger
  const heroEls = [
    { selector: '.hero-pre-title', delay: 300 },
    { selector: '.hero-name:first-of-type', delay: 600 },
    { selector: '.hero-ampersand', delay: 900 },
    { selector: '.hero-name:last-of-type', delay: 1000 },
    { selector: '.hero-date', delay: 1300 },
    { selector: '.hero-location', delay: 1500 },
    { selector: '.scroll-indicator', delay: 2000 },
  ];

  heroEls.forEach(({ selector, delay }) => {
    const el = document.querySelector(selector);
    if (el) {
      setTimeout(() => {
        el.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, delay);
    }
  });

  // Start all the decorations
  createHeroDecorations();
  createThankYouDecorations();
  createStars(document.querySelector('#our-story'));
  createStars(document.querySelector('#gallery'));
  createStars(document.querySelector('#thankyou'));

  // Ring pulse decorations on hero
  const hero = document.getElementById('hero');
  if (hero) {
    for (let i = 0; i < 3; i++) {
      const ring = document.createElement('div');
      ring.className = 'ring-decoration';
      const size = 200 + i * 150;
      ring.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: 50%; top: 50%;
        transform: translate(-50%, -50%);
        --duration: ${6 + i * 2}s;
        --delay: ${i * 2}s;
        position: absolute;
      `;
      hero.querySelector('.hero-content')?.appendChild(ring);
    }
  }
}

// ─── Init ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initLenis();
  initCursor();
  initNavDots();
  initScrollProgress();
  initMusicToggle();
  initScrollReveal();
  initEnvelope();
  initCountdown();
  initRSVP();
  initGallery();
});
