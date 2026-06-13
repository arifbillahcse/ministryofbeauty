/* ============================================================
   MINISTRY OF BEAUTY — ADVANCED MARKETING JAVASCRIPT
   ============================================================ */

'use strict';

/* ─── PRELOADER ──────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('hidden');
  }, 2000);
});

/* ─── CUSTOM CURSOR ──────────────────────────────────────── */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

// Smooth ring follow
(function animateCursor() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateCursor);
})();

// Hover state
document.querySelectorAll('a, button, [role="button"]').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
});

// Hide on mobile
if ('ontouchstart' in window) {
  cursorDot.style.display  = 'none';
  cursorRing.style.display = 'none';
  document.body.style.cursor = 'auto';
}

/* ─── HERO PARTICLES ──────────────────────────────────────── */
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  const count = 25;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 8}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    container.appendChild(p);
  }
}
createParticles();

/* ─── NAVBAR SCROLL BEHAVIOUR ─────────────────────────────── */
const navbar = document.getElementById('navbar');

const onScroll = () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', onScroll, { passive: true });

/* ─── MOBILE DRAWER ──────────────────────────────────────── */
const hamburger     = document.getElementById('hamburger');
const mobileDrawer  = document.getElementById('mobileDrawer');
const drawerClose   = document.getElementById('drawerClose');
const drawerOverlay = document.getElementById('drawerOverlay');

function openDrawer() {
  mobileDrawer.classList.add('open');
  drawerOverlay.classList.add('visible');
  document.body.classList.add('locked');
}

function closeDrawer() {
  mobileDrawer.classList.remove('open');
  drawerOverlay.classList.remove('visible');
  document.body.classList.remove('locked');
}

hamburger?.addEventListener('click', openDrawer);
drawerClose?.addEventListener('click', closeDrawer);
drawerOverlay?.addEventListener('click', closeDrawer);

document.querySelectorAll('.drawer-link').forEach(link => {
  link.addEventListener('click', closeDrawer);
});

/* ─── SMOOTH SCROLL ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── SCROLL REVEAL (IntersectionObserver) ────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.dataset.delay = (i % 3) * 120; // stagger in groups of 3
  revealObserver.observe(el);
});

/* ─── COUNTER ANIMATION ──────────────────────────────────── */
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  const startVal = 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);
    const current = Math.round(startVal + (target - startVal) * easedProgress);
    el.textContent = current.toLocaleString('it-IT');
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target.querySelector('.stat-value');
      const target = parseInt(el.dataset.target);
      if (!isNaN(target)) animateCounter(el, target, 2200);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-block').forEach(block => {
  counterObserver.observe(block);
});

/* ─── TESTIMONIALS SLIDER ─────────────────────────────────── */
const track     = document.getElementById('testimonialsTrack');
const prevBtn   = document.getElementById('testiPrev');
const nextBtn   = document.getElementById('testiNext');
const dotsWrap  = document.getElementById('testiDots');
const cards     = track ? Array.from(track.querySelectorAll('.testi-card')) : [];

let currentSlide = 0;
let slidesVisible = getSlidesVisible();
let autoplayTimer;

function getSlidesVisible() {
  if (window.innerWidth < 600) return 1;
  if (window.innerWidth < 900) return 2;
  return 3;
}

function totalSlides() {
  return Math.max(0, cards.length - slidesVisible + 1);
}

function buildDots() {
  if (!dotsWrap) return;
  dotsWrap.innerHTML = '';
  for (let i = 0; i < totalSlides(); i++) {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === currentSlide ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  }
}

function goToSlide(index) {
  currentSlide = Math.max(0, Math.min(index, totalSlides() - 1));
  const cardWidth = cards[0]?.offsetWidth + 24; // gap = 1.5rem ≈ 24px
  if (track) track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
  if (track) track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

  cards.forEach((c, i) => {
    c.classList.toggle('active', i === currentSlide);
  });

  document.querySelectorAll('.testi-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function nextSlide() {
  const next = currentSlide + 1 >= totalSlides() ? 0 : currentSlide + 1;
  goToSlide(next);
}

function prevSlide() {
  const prev = currentSlide - 1 < 0 ? totalSlides() - 1 : currentSlide - 1;
  goToSlide(prev);
}

function startAutoplay() {
  stopAutoplay();
  autoplayTimer = setInterval(nextSlide, 5000);
}

function stopAutoplay() {
  clearInterval(autoplayTimer);
}

nextBtn?.addEventListener('click', () => { nextSlide(); stopAutoplay(); startAutoplay(); });
prevBtn?.addEventListener('click', () => { prevSlide(); stopAutoplay(); startAutoplay(); });

// Touch/swipe support
let touchStartX = 0;
let touchEndX   = 0;

track?.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

track?.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    diff > 0 ? nextSlide() : prevSlide();
  }
});

// Init
if (cards.length > 0) {
  buildDots();
  goToSlide(0);
  startAutoplay();
}

window.addEventListener('resize', () => {
  slidesVisible = getSlidesVisible();
  buildDots();
  goToSlide(Math.min(currentSlide, totalSlides() - 1));
});

/* ─── CONTACT FORM VALIDATION & SUBMIT ───────────────────── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn   = document.getElementById('submitBtn');
const btnText     = document.getElementById('btnText');
const btnSpinner  = document.getElementById('btnSpinner');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.closest('.form-group').classList.add('error');
  if (error) error.style.display = 'block';
}

function clearErrors() {
  document.querySelectorAll('.form-group.error').forEach(g => g.classList.remove('error'));
  document.querySelectorAll('.input-error').forEach(e => e.style.display = 'none');
}

contactForm?.addEventListener('submit', async function(e) {
  e.preventDefault();
  clearErrors();

  const fname   = document.getElementById('fname')?.value.trim();
  const lname   = document.getElementById('lname')?.value.trim();
  const email   = document.getElementById('email')?.value.trim();
  const message = document.getElementById('message')?.value.trim();

  let valid = true;

  if (!fname) { showError('fname', 'fnameErr'); valid = false; }
  if (!lname) { showError('lname', 'lnameErr'); valid = false; }
  if (!email || !validateEmail(email)) { showError('email', 'emailErr'); valid = false; }
  if (!message) { showError('message', 'messageErr'); valid = false; }

  if (!valid) return;

  // Loading state
  btnText.style.display    = 'none';
  btnSpinner.classList.add('visible');
  submitBtn.disabled = true;

  // Simulate API call
  await new Promise(r => setTimeout(r, 1800));

  // Success
  contactForm.style.display   = 'none';
  formSuccess.style.display   = 'block';
  formSuccess.style.animation = 'fade-up 0.5s ease forwards';

  console.log('Form submitted:', { fname, lname, email, message });
});

// Live validation: clear error on input
['fname', 'lname', 'email', 'message'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', function() {
    this.closest('.form-group').classList.remove('error');
    const err = this.closest('.form-group').querySelector('.input-error');
    if (err) err.style.display = 'none';
  });
});

/* ─── SCROLL TO TOP ──────────────────────────────────────── */
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 600) {
    scrollTopBtn?.classList.add('visible');
  } else {
    scrollTopBtn?.classList.remove('visible');
  }
}, { passive: true });

scrollTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── FOOTER YEAR ─────────────────────────────────────────── */
const yearEl = document.getElementById('footerYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ─── PARALLAX ON HERO VISUAL ─────────────────────────────── */
const heroVisual = document.querySelector('.hero-visual');

window.addEventListener('scroll', () => {
  if (!heroVisual) return;
  const scroll = window.scrollY;
  if (scroll < window.innerHeight) {
    heroVisual.style.transform = `translateY(${scroll * 0.12}px)`;
  }
}, { passive: true });

/* ─── COURSE CARD TILT EFFECT ─────────────────────────────── */
document.querySelectorAll('.course-card, .feat-card').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    this.style.transform = `
      translateY(-12px)
      perspective(800px)
      rotateY(${x * 8}deg)
      rotateX(${-y * 8}deg)
    `;
  });

  card.addEventListener('mouseleave', function() {
    this.style.transform = '';
    this.style.transition = 'transform 0.5s ease';
    setTimeout(() => { this.style.transition = ''; }, 500);
  });
});

/* ─── MAGNETIC BUTTONS ────────────────────────────────────── */
document.querySelectorAll('.btn-gold').forEach(btn => {
  btn.addEventListener('mousemove', function(e) {
    const rect  = this.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = (e.clientX - cx) * 0.25;
    const dy    = (e.clientY - cy) * 0.25;
    this.style.transform = `translate(${dx}px, ${dy}px) translateY(-3px)`;
  });

  btn.addEventListener('mouseleave', function() {
    this.style.transform = '';
    this.style.transition = 'transform 0.5s ease, box-shadow 0.4s';
    setTimeout(() => { this.style.transition = ''; }, 500);
  });
});

/* ─── RIPPLE EFFECT ON BUTTONS ────────────────────────────── */
document.querySelectorAll('.btn-gold, .btn-outline').forEach(btn => {
  btn.style.overflow = 'hidden';
  btn.style.position = 'relative';

  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top  - size / 2;

    Object.assign(ripple.style, {
      position: 'absolute',
      width:    size + 'px',
      height:   size + 'px',
      left:     x + 'px',
      top:      y + 'px',
      background: 'rgba(255,255,255,0.25)',
      borderRadius: '50%',
      transform: 'scale(0)',
      animation: 'ripple-effect 0.6s ease-out',
      pointerEvents: 'none',
    });

    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

/* Ripple keyframe */
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple-effect {
    to { transform: scale(1); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

/* ─── ACTIVE NAV LINK HIGHLIGHT ───────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active-nav', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* Active nav style */
const activeNavStyle = document.createElement('style');
activeNavStyle.textContent = `
  .nav-link.active-nav { color: var(--gold-dark); }
  .nav-link.active-nav::after { width: 100%; }
`;
document.head.appendChild(activeNavStyle);

/* ─── MARQUEE PAUSE ON HOVER ──────────────────────────────── */
const marqueeTrack = document.querySelector('.marquee-track');
marqueeTrack?.parentElement.addEventListener('mouseenter', () => {
  if (marqueeTrack) marqueeTrack.style.animationPlayState = 'paused';
});
marqueeTrack?.parentElement.addEventListener('mouseleave', () => {
  if (marqueeTrack) marqueeTrack.style.animationPlayState = 'running';
});

/* ─── KEYBOARD ACCESSIBILITY ──────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDrawer();
});

/* ─── VIDEO SHOWREEL PLAYER ──────────────────────────────── */
(function initVideoPlayer() {
  const video          = document.getElementById('showreelVideo');
  const overlay        = document.getElementById('videoOverlay');
  const playBtn        = document.getElementById('playBtn');
  const playIcon       = document.getElementById('playIcon');
  const pauseIcon      = document.getElementById('pauseIcon');
  const muteBtn        = document.getElementById('muteBtn');
  const muteIcon       = document.getElementById('muteIcon');
  const unmuteIcon     = document.getElementById('unmuteIcon');
  const fullscreenBtn  = document.getElementById('fullscreenBtn');
  const progressBar    = document.getElementById('videoProgressBar');
  const progressWrap   = document.getElementById('videoProgressWrap');
  const videoFrame     = video?.closest('.video-frame');

  if (!video) return;

  // Autoplay muted when scrolled into view
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
        overlay.classList.add('playing');
        playIcon.style.display  = 'none';
        pauseIcon.style.display = 'block';
      } else {
        video.pause();
        overlay.classList.remove('playing');
        playIcon.style.display  = 'block';
        pauseIcon.style.display = 'none';
      }
    });
  }, { threshold: 0.4 });

  videoObserver.observe(video);

  // Play / Pause toggle
  function togglePlay() {
    if (video.paused) {
      video.play();
      overlay.classList.add('playing');
      playIcon.style.display  = 'none';
      pauseIcon.style.display = 'block';
    } else {
      video.pause();
      overlay.classList.remove('playing');
      playIcon.style.display  = 'block';
      pauseIcon.style.display = 'none';
    }
  }

  playBtn?.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); });
  overlay?.addEventListener('click', togglePlay);

  // Mute / Unmute toggle
  function toggleMute() {
    video.muted = !video.muted;
    muteIcon.style.display   = video.muted ? 'block' : 'none';
    unmuteIcon.style.display = video.muted ? 'none'  : 'block';
  }

  muteBtn?.addEventListener('click', (e) => { e.stopPropagation(); toggleMute(); });

  // Progress bar update
  video.addEventListener('timeupdate', () => {
    if (!video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    if (progressBar) progressBar.style.width = pct + '%';
  });

  // Seek on progress bar click
  progressWrap?.addEventListener('click', (e) => {
    e.stopPropagation();
    const rect = progressWrap.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    video.currentTime = pct * video.duration;
  });

  // Fullscreen toggle
  fullscreenBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      (videoFrame || video).requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  });

  // Keyboard shortcut: Space = play/pause on the section
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
      const rect = video.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        e.preventDefault();
        togglePlay();
      }
    }
    if (e.code === 'KeyM') toggleMute();
  });

  // On video end — show overlay again
  video.addEventListener('ended', () => {
    overlay.classList.remove('playing');
    playIcon.style.display  = 'block';
    pauseIcon.style.display = 'none';
    if (progressBar) progressBar.style.width = '0%';
  });

  // Fallback: if video can't load, show styled placeholder
  video.addEventListener('error', () => {
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: linear-gradient(135deg, #111, #1a1a1a);
      color: #C9A96E; text-align: center; gap: 1rem;
    `;
    placeholder.innerHTML = `
      <div style="font-size:3.5rem">🎬</div>
      <p style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;color:#fff;font-style:italic;">Ministry of Beauty Showreel</p>
      <p style="font-size:0.8rem;color:#666;letter-spacing:2px;">VIDEO IN CARICAMENTO</p>
    `;
    videoFrame?.appendChild(placeholder);
    if (overlay) overlay.style.display = 'none';
  });
})();

/* ─── INIT LOG ────────────────────────────────────────────── */
console.log(
  '%c✨ Ministry of Beauty',
  'font-family:serif; font-size:22px; font-weight:bold; color:#C9A96E;'
);
console.log(
  '%cAdvanced Luxury Homepage — v2.0',
  'font-size:12px; color:#888;'
);
