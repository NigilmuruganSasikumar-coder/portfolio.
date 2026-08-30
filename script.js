
/* ─── Page Loader ──────────────────────────────────────────── */
(function () {
  const loader  = document.getElementById('pageLoader');
  const fill    = document.getElementById('loaderFill');
  const percent = document.getElementById('loaderPercent');
  const phases  = document.querySelectorAll('.loader-status span');
  if (!loader) return;
 
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.style.overflow = 'hidden';
 
  if (reduceMotion) { finish(); return; }
 
  let progress = 0;
  let pageLoaded = false;
  let activePhase = 0;
 
  function setPhase(i) {
    if (i === activePhase) return;
    phases[activePhase]?.classList.remove('active');
    phases[i]?.classList.add('active');
    activePhase = i;
  }
 
  function tick() {
    const ceiling = pageLoaded ? 100 : 90;
    progress += (ceiling - progress) * 0.06 + 0.15;
    if (progress >= ceiling) progress = ceiling;
 
    fill.style.width = progress + '%';
    percent.textContent = Math.floor(progress) + '%';
 
    if (progress < 25)      setPhase(0);
    else if (progress < 60) setPhase(1);
    else if (progress < 95) setPhase(2);
    else                    setPhase(3);
 
    if (progress >= 100) { finish(); return; }
    requestAnimationFrame(tick);
  }
 
  window.addEventListener('load', () => { pageLoaded = true; });
  requestAnimationFrame(tick);
 
  function finish() {
    setPhase(3);
    setTimeout(() => {
      loader.classList.add('is-hidden');
      document.body.style.overflow = '';
      setTimeout(() => loader.remove(), 1000);
    }, 300);
  }
})();

/* ─── Particles ───────────────────────────────────────────── */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  container.innerHTML = '';
  const count = window.innerWidth < 768 ? 18 : 36;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 1.5;
    const left = Math.random() * 100;
    const duration = Math.random() * 18 + 10;
    const delay = Math.random() * 15;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -10px;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
    `;
    container.appendChild(p);
  }
}

createParticles();
window.addEventListener('resize', createParticles);

/* ─── Theme Switcher ──────────────────────────────────────── */
const html = document.documentElement;
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themePanel = document.getElementById('themePanel');
const themeOptions = document.querySelectorAll('.theme-option');

const THEME_KEY = 'nigil_portfolio_theme';
const savedTheme = localStorage.getItem(THEME_KEY) || 'dark-color';
applyTheme(savedTheme);

themeToggleBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  themePanel.classList.toggle('open');
});

document.addEventListener('click', () => {
  themePanel.classList.remove('open');
});

themePanel.addEventListener('click', (e) => e.stopPropagation());

themeOptions.forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme;
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
    themePanel.classList.remove('open');
  });
});

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeOptions.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
}

/* ─── Active Nav Link on Scroll ───────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

/* ─── Stat Counter Animation ──────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const statNumbers = document.querySelectorAll('.stat-number');

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

statNumbers.forEach(el => statObserver.observe(el));

/* ─── Navbar scroll glass effect ─────────────────────────── */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 40
    ? '0 4px 32px rgba(0,0,0,0.25)'
    : 'none';
});

/* ─── Smooth anchor scroll ────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
/* ─── Skills: scroll reveal + tilt ────────────────────────── */
(function () {
  const skillCards = document.querySelectorAll('.skill-card');
  if (!skillCards.length) return;
 
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
 
  skillCards.forEach(card => skillObserver.observe(card));
 
  // Subtle cursor-follow tilt, disabled on touch devices
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) return;
 
  skillCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(0)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
/* ─── Projects: continuous auto-scroll slider ─────────────── */
(function () {
  const slider = document.getElementById('projectsSlider');
  const track  = document.getElementById('projectsTrack');
  const dots   = document.querySelectorAll('.projects-dot');
  if (!slider || !track) return;
 
  const ORIGINAL_COUNT = 6;
  const SPEED = 0.6; // px per frame — tweak to taste
 
  // Duplicate the original 6 cards once, so the track can loop seamlessly
  const originalCards = Array.from(track.children).slice(0, ORIGINAL_COUNT);
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
 
  let step = 0;          // width of one card + gap
  let singleSetWidth = 0; // total width of the original 6 cards
  let scrollX = 0;
  let hoverPaused = false;
  let dotPaused = false;
  let dotResumeTimer = null;
  let lastActive = 0;
  let rafId = null;
 
  function measure() {
    const first = originalCards[0];
    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    step = first.getBoundingClientRect().width + gap;
    singleSetWidth = step * ORIGINAL_COUNT;
  }
 
  function applyScroll() {
    track.style.transform = `translateX(${-scrollX}px)`;
  }
 
  function updateActiveDot() {
    if (!singleSetWidth) return;
    const posInSet = ((scrollX % singleSetWidth) + singleSetWidth) % singleSetWidth;
    const idx = Math.round(posInSet / step) % ORIGINAL_COUNT;
    if (idx !== lastActive) {
      dots[lastActive]?.classList.remove('active');
      dots[idx]?.classList.add('active');
      lastActive = idx;
    }
  }
 
  function tick() {
    if (!hoverPaused && !dotPaused && singleSetWidth) {
      scrollX += SPEED;
      if (scrollX >= singleSetWidth) scrollX -= singleSetWidth;
      applyScroll();
      updateActiveDot();
    }
    rafId = requestAnimationFrame(tick);
  }
 
  function goToIndex(i) {
    if (!step) return;
    const lap = Math.floor(scrollX / singleSetWidth);
    scrollX = lap * singleSetWidth + i * step;
    applyScroll();
    updateActiveDot();
 
    dotPaused = true;
    clearTimeout(dotResumeTimer);
    dotResumeTimer = setTimeout(() => { dotPaused = false; }, 2200);
  }
 
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const i = parseInt(dot.dataset.index, 10);
      goToIndex(i);
    });
  });
 
  slider.addEventListener('mouseenter', () => { hoverPaused = true; });
  slider.addEventListener('mouseleave', () => { hoverPaused = false; });
 
  window.addEventListener('resize', measure);
 
  measure();
  applyScroll();
  rafId = requestAnimationFrame(tick);
})();

/* ─── Contact: row reveal + magnetic button ───────────────── */
(function () {
  const rows = document.querySelectorAll('.contact-row');
  if (rows.length) {
    const rowObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          rowObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    rows.forEach(row => rowObserver.observe(row));
  }
 
  const cta = document.getElementById('contactCta');
  if (cta && !window.matchMedia('(pointer: coarse)').matches) {
    cta.addEventListener('mousemove', (e) => {
      const rect = cta.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      cta.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    cta.addEventListener('mouseleave', () => {
      cta.style.transform = 'translate(0, 0)';
    });
  }
})();