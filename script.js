/* =========================================================
   KANZLEI PAECH — Script v2
   ========================================================= */

'use strict';

/* === 1. HEADER === */
(function () {
  const header = document.getElementById('header');
  if (!header) return;

  function update() {
    if (window.scrollY > 60) {
      header.classList.remove('is-transparent');
      header.classList.add('is-solid');
    } else {
      header.classList.remove('is-solid');
      header.classList.add('is-transparent');
    }
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
})();


/* === 2. DESKTOP DROPDOWN === */
(function () {
  const items = document.querySelectorAll('.nav-items > li');

  items.forEach(function (li) {
    const drop = li.querySelector('.nav-drop');
    if (!drop) return;

    li.addEventListener('mouseenter', function () {
      li.classList.add('is-open');
    });

    li.addEventListener('mouseleave', function () {
      li.classList.remove('is-open');
    });

    // Keyboard
    const btn = li.querySelector('button');
    if (btn) {
      btn.addEventListener('click', function () {
        li.classList.toggle('is-open');
      });
    }
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    items.forEach(function (li) {
      if (!li.contains(e.target)) li.classList.remove('is-open');
    });
  });
})();


/* === 3. MOBILE NAV === */
(function () {
  const burger = document.querySelector('.burger');
  const nav    = document.querySelector('.mobile-nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', function () {
    const open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Submenu toggles
  document.querySelectorAll('.mobile-sub-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const sub = btn.nextElementSibling;
      const isOpen = btn.classList.toggle('open');
      if (sub) sub.classList.toggle('open', isOpen);
    });
  });

  // Close on link click
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on resize
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      nav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();


/* === 4. REVEAL ANIMATIONS === */
(function () {
  const els = document.querySelectorAll('.reveal, .reveal-fade');
  if (!els.length) return;

  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -50px 0px', threshold: 0.08 }
  );

  els.forEach(function (el) { io.observe(el); });
})();


/* === 5. FAQ === */
(function () {
  document.querySelectorAll('.faq-item').forEach(function (item) {
    const trigger  = item.querySelector('.faq-trigger');
    const answer   = item.querySelector('.faq-answer');
    if (!trigger) return;

    trigger.addEventListener('click', function () {
      const opening = !item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(function (i) {
        i.classList.remove('open');
      });

      if (opening) item.classList.add('open');
    });

    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });
  });
})();


/* === 6. CONTACT FORM === */
(function () {
  const form    = document.getElementById('contact-form');
  if (!form) return;

  const success = document.getElementById('form-success');
  const submit  = form.querySelector('[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let valid = true;
    form.querySelectorAll('[required]').forEach(function (f) {
      f.closest('.form-row, .form-check')?.classList.remove('form-invalid');
      if (f.type === 'checkbox' && !f.checked) {
        f.closest('.form-check')?.classList.add('form-invalid');
        valid = false;
      } else if (f.type !== 'checkbox' && !f.value.trim()) {
        f.closest('.form-row')?.classList.add('form-invalid');
        valid = false;
      }
    });

    const email = form.querySelector('[type="email"]');
    if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.closest('.form-row')?.classList.add('form-invalid');
      valid = false;
    }

    if (!valid) return;

    if (submit) { submit.disabled = true; submit.textContent = 'Wird gesendet …'; }

    setTimeout(function () {
      if (success) { success.style.display = 'block'; }
      form.reset();
      if (submit) { submit.disabled = false; submit.textContent = 'Anfrage absenden'; }
    }, 1000);
  });

  // Clear validation on input
  form.querySelectorAll('.form-input').forEach(function (f) {
    f.addEventListener('input', function () {
      f.closest('.form-row')?.classList.remove('form-invalid');
    });
  });
})();


/* === 7. VIDEO PERFORMANCE === */
(function () {
  const video = document.querySelector('.hero-video');
  if (!video) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.pause();
    video.removeAttribute('autoplay');
    return;
  }

  const io = new IntersectionObserver(
    function (entries) {
      entries[0].isIntersecting ? video.play().catch(() => {}) : video.pause();
    },
    { threshold: 0.1 }
  );

  io.observe(video);
})();


/* === 8. ACTIVE NAV LINK === */
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#header a, .mobile-nav a').forEach(function (a) {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.style.opacity = '1';
      a.style.color = 'inherit';
    }
  });
})();


/* === 9. SMOOTH SCROLL === */
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth'
      });
    }
  });
});
