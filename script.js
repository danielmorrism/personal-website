/**
 * DANIEL — CREATIVE DESIGNER
 * script.js
 *
 * Sections:
 * 1. DOM Ready Init
 * 2. Navigation — Scroll Behavior & Mobile Menu
 * 3. Hero — Staggered Entrance Animation
 * 4. Intersection Observer — Scroll Reveal
 * 5. Skills — Animated Progress Bars
 * 6. Contact Form — Validation & Submission
 * 7. Active Nav Link — Scroll Spy
 * 8. Footer — Dynamic Year
 * 9. Smooth Anchor Navigation
 */


/* ================================================================
   1. DOM READY INIT
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeroAnimation();
  initScrollReveal();
  initSkillBars();
  initContactForm();
  initScrollSpy();
  setFooterYear();
  initSmoothScroll();
});


/* ================================================================
   2. NAVIGATION — SCROLL BEHAVIOR & MOBILE MENU
================================================================ */
function initNavigation() {
  const header     = document.getElementById('site-header');
  const navToggle  = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!header) return;

  // --- Scroll: add .scrolled class to trigger glassmorphism ---
  const scrollThreshold = 20;

  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on init in case page is already scrolled


  // --- Mobile Menu Toggle ---
  if (!navToggle || !mobileMenu) return;

  function openMenu() {
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    const isOpen = mobileMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  }

  navToggle.addEventListener('click', toggleMenu);

  // Close when a mobile nav link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
      navToggle.focus();
    }
  });

  // Close on outside click
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMenu();
  });
}


/* ================================================================
   3. HERO — STAGGERED ENTRANCE ANIMATION
================================================================ */
function initHeroAnimation() {
  const animateItems = document.querySelectorAll('.animate-in');
  if (!animateItems.length) return;

  // Staggered delay: each item gets 100ms more than the previous
  const BASE_DELAY = 80;
  const STEP       = 120;

  animateItems.forEach(el => {
    const delayIndex = parseInt(el.getAttribute('data-delay') || '0', 10);
    const delayMs    = BASE_DELAY + delayIndex * STEP;

    // Use rAF to ensure a proper paint cycle before adding animation
    requestAnimationFrame(() => {
      setTimeout(() => {
        el.classList.add('entered');
      }, delayMs);
    });
  });
}


/* ================================================================
   4. INTERSECTION OBSERVER — SCROLL REVEAL
================================================================ */
function initScrollReveal() {
  const revealItems = document.querySelectorAll('.reveal-item');
  if (!revealItems.length) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    revealItems.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings in same parent for a cascade effect
          const siblings = entry.target.parentElement
            ? Array.from(entry.target.parentElement.querySelectorAll('.reveal-item:not(.revealed)'))
            : [];
          const index = siblings.indexOf(entry.target);
          const staggerDelay = index > 0 ? index * 80 : 0;

          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, staggerDelay);

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -48px 0px',
    }
  );

  revealItems.forEach(el => observer.observe(el));
}


/* ================================================================
   5. SKILLS — ANIMATED PROGRESS BARS
================================================================ */
function initSkillBars() {
  const skillFills = document.querySelectorAll('.skill-fill');
  if (!skillFills.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Immediately set widths without animation
    skillFills.forEach(fill => {
      fill.style.width = fill.style.getPropertyValue('--skill-width');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5,
      rootMargin: '0px 0px -32px 0px',
    }
  );

  skillFills.forEach(fill => observer.observe(fill));
}


/* ================================================================
   6. CONTACT FORM — VALIDATION & SUBMISSION
================================================================ */
function initContactForm() {
  const form      = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit');
  const statusEl  = document.getElementById('form-status');

  if (!form) return;

  // Simple field validation
  function validateField(input) {
    if (!input.required) return true;

    if (input.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(input.value.trim());
    }

    return input.value.trim().length > 0;
  }

  function setFieldError(input, hasError) {
    if (hasError) {
      input.style.borderColor = '#DC2626';
      input.style.boxShadow   = '0 0 0 3px rgba(220, 38, 38, 0.1)';
    } else {
      input.style.borderColor = '';
      input.style.boxShadow   = '';
    }
  }

  // Real-time validation on blur
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      const isValid = validateField(input);
      if (!isValid && input.value.trim().length > 0) {
        setFieldError(input, true);
      }
    });

    input.addEventListener('input', () => {
      setFieldError(input, false);
    });
  });

  function showStatus(type, message) {
    if (!statusEl) return;
    statusEl.className = `form-status ${type}`;
    statusEl.textContent = message;

    // Auto-hide after 6 seconds
    setTimeout(() => {
      statusEl.className = 'form-status';
      statusEl.textContent = '';
    }, 6000);
  }

  function setLoading(isLoading) {
    if (!submitBtn) return;
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');

    submitBtn.disabled = isLoading;

    if (isLoading) {
      if (btnText) btnText.textContent = 'Sending...';
      if (btnIcon) btnIcon.style.opacity = '0.4';
    } else {
      if (btnText) btnText.textContent = 'Send Message';
      if (btnIcon) btnIcon.style.opacity = '1';
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all required fields
    const requiredInputs = form.querySelectorAll('[required]');
    let allValid = true;

    requiredInputs.forEach(input => {
      const isValid = validateField(input);
      if (!isValid) {
        setFieldError(input, true);
        allValid = false;
      }
    });

    if (!allValid) {
      showStatus('error', 'Please fill in all required fields correctly.');
      return;
    }

    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    setLoading(true);

    // Simulate network request (replace with real endpoint in production)
    // e.g., fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })
    await simulateFormSubmit(data);

    setLoading(false);
    form.reset();
    showStatus('success', '✓ Message sent! I\'ll be in touch within 24 hours.');

    // Scroll status into view on mobile
    if (statusEl && window.innerWidth < 768) {
      statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

/**
 * Simulates a form submission with a fake delay.
 * Replace with your actual API call in production:
 * 
 * async function submitToAPI(data) {
 *   const res = await fetch('/api/contact', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(data)
 *   });
 *   if (!res.ok) throw new Error('Network response was not ok');
 *   return res.json();
 * }
 */
function simulateFormSubmit(data) {
  console.log('Form submitted with data:', data);
  return new Promise(resolve => setTimeout(resolve, 1200));
}


/* ================================================================
   7. ACTIVE NAV LINK — SCROLL SPY
================================================================ */
function initScrollSpy() {
  const navLinks    = document.querySelectorAll('.nav-link:not(.nav-link--cta)');
  const sections    = document.querySelectorAll('section[id]');

  if (!navLinks.length || !sections.length) return;

  let currentSection = '';

  function updateActiveLink() {
    const scrollY = window.scrollY;
    const offset  = 120; // offset for header height

    sections.forEach(section => {
      const sectionTop    = section.offsetTop - offset;
      const sectionHeight = section.offsetHeight;
      const sectionId     = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = sectionId;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink(); // Run once on init
}


/* ================================================================
   8. FOOTER — DYNAMIC YEAR
================================================================ */
function setFooterYear() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}


/* ================================================================
   9. SMOOTH ANCHOR NAVIGATION
   Accounts for fixed header height offset.
================================================================ */
function initSmoothScroll() {
  const NAV_HEIGHT = 80; // slightly more than --nav-height for breathing room

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const targetTop = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });

      // Update URL hash without jumping
      history.pushState(null, '', href);
    });
  });
}


/* ================================================================
   UTILITY — Debounce helper for scroll events
================================================================ */
function debounce(fn, delay = 16) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
