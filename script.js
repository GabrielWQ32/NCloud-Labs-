/* ─── NCloud Labs · script.js ──────────────────────────────────────────── */

/* ── Grid / Dot Canvas Background ── */
(function initCanvas() {
  const canvas = document.getElementById('grid-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, dots = [], animId;

  const YELLOW = 'rgba(223,209,83,';
  const DOT_COUNT = 55;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function spawnDot() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      a: Math.random() * 0.5 + 0.15,
    };
  }

  function init() {
    dots = Array.from({ length: DOT_COUNT }, spawnDot);
  }

  function drawGrid() {
    const step = 60;
    ctx.strokeStyle = 'rgba(255,255,255,0.025)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < W; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
    for (let y = 0; y < H; y += step) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
    ctx.stroke();
  }

  function connect(a, b, dist) {
    const alpha = (1 - dist / 140) * 0.15;
    ctx.strokeStyle = YELLOW + alpha + ')';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();

    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0) d.x = W;
      if (d.x > W) d.x = 0;
      if (d.y < 0) d.y = H;
      if (d.y > H) d.y = 0;

      // draw dot
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = YELLOW + d.a + ')';
      ctx.fill();

      // connect nearby
      for (let j = i + 1; j < dots.length; j++) {
        const e = dots[j];
        const dx = d.x - e.x, dy = d.y - e.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) connect(d, e, dist);
      }
    }
    animId = requestAnimationFrame(frame);
  }

  resize();
  init();
  frame();
  window.addEventListener('resize', () => { resize(); });
})();

/* ── Navbar scroll state ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── Mobile nav toggle ── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── Typed tagline ── */
const lines = [
  'Cloud infrastructure that actually fits your budget.',
  'AWS architecture — designed for the mid-market.',
  'No full-time IT team required.',
  'Secure. Scalable. Surprisingly affordable.',
];
let lineIdx = 0, charIdx = 0, deleting = false;
const el = document.getElementById('typedTagline');

function typeLoop() {
  const current = lines[lineIdx];
  if (!deleting) {
    el.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 2200);
      return;
    }
    setTimeout(typeLoop, 42);
  } else {
    el.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      lineIdx = (lineIdx + 1) % lines.length;
      setTimeout(typeLoop, 400);
      return;
    }
    setTimeout(typeLoop, 22);
  }
}
typeLoop();

/* ── Intersection observer fade-in ── */
const fadeEls = document.querySelectorAll(
  '.service-card, .cred-card, .contact-card, .edu-item, .hero-inner, .section-title, .about-body, .hero-stats'
);
fadeEls.forEach(el => el.classList.add('fade-up'));

const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      // stagger cards
      const delay = e.target.closest('.services-grid, .creds-grid, .contact-cards, .edu-row')
        ? [...e.target.parentElement.children].indexOf(e.target) * 80
        : 0;
      setTimeout(() => e.target.classList.add('visible'), delay);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

fadeEls.forEach(el => io.observe(el));

/* ── Smooth active nav highlight ── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));
