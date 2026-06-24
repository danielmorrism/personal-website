/* ─── CUSTOM CURSOR ────────────────────────────────────── */
(function () {
  const cursor = document.createElement('div');
  cursor.classList.add('cursor');
  document.body.appendChild(cursor);

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let cx = mx;
  let cy = my;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    cx = lerp(cx, mx, 0.18);
    cy = lerp(cy, my, 0.18);
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    raf = requestAnimationFrame(tick);
  }

  tick();

  // Expand on hoverable elements
  const hoverEls = document.querySelectorAll(
    'a, .grid__item, button'
  );

  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('expanded'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('expanded'));
  });

  // Hide native cursor on desktop
  if (!window.matchMedia('(pointer: coarse)').matches) {
    document.body.style.cursor = 'none';
    document.querySelectorAll('a, button, .grid__item').forEach(el => {
      el.style.cursor = 'none';
    });
  }
})();

/* ─── ENTRANCE ANIMATION ───────────────────────────────── */
(function () {
  const hero   = document.querySelector('.hero');
  const nav    = document.querySelector('.nav');
  const items  = document.querySelectorAll('.grid__item');

  // Fade-in hero + nav on load
  [nav, hero].forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = `opacity 0.9s ease ${i * 0.15}s, transform 0.9s ease ${i * 0.15}s`;
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });

  // Stagger grid items on scroll into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
          el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  items.forEach((item, i) => {
    item.dataset.delay = (i % 3) * 80;
    observer.observe(item);
  });
})();

/* ─── SMOOTH ACTIVE NAV LINK ───────────────────────────── */
(function () {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(a => {
          a.style.opacity = a.getAttribute('href') === `#${id}` ? '1' : '0.5';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));
})();
