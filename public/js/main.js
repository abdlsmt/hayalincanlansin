/* Hayalin Canlansın — ana JavaScript dosyası
   Bağımsız, kütüphanesiz; erişilebilir menü ve hafif scroll efektleri. */

(function () {
  'use strict';

  var body = document.body;
  var header = document.getElementById('siteHeader');
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('navMenu');
  var menuLinks = menu ? menu.querySelectorAll('a') : [];

  /* ---- Mobil menü ---- */
  function setMenu(open) {
    body.classList.toggle('nav-open', open);
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    }
    if (open && menuLinks.length) {
      menuLinks[0].focus();
    }
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setMenu(!body.classList.contains('nav-open'));
    });
  }

  menuLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      setMenu(false);
      toggle.focus();
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && body.classList.contains('nav-open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  /* ---- Header kaydırma durumu ---- */
  var ticking = false;
  function updateHeader() {
    if (header) {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
  updateHeader();

  /* ---- Scroll-reveal (IntersectionObserver) ---- */
  var revealElements = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      revealElements.forEach(function (el) {
        el.classList.add('is-visible');
      });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      revealElements.forEach(function (el) {
        observer.observe(el);
      });
    }
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
})();
