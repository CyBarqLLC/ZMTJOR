/* =========================================================
   زهرة المدائن — Vanilla JS (minimal, no frameworks)
   ========================================================= */

(function () {
  'use strict';

  // ---------- 1. NAVBAR scroll state ----------
  var navbar = document.getElementById('navbar');
  if (navbar) {
    var onScroll = function () {
      if (window.scrollY > 20) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- 2. MOBILE MENU (separate panel, no transform) ----------
  var menuToggle = document.getElementById('menuToggle');
  var navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    // Build a clone of nav links inside a fixed dropdown panel.
    var panel = document.createElement('div');
    panel.className = 'nav-mobile-panel';
    panel.id = 'navMobilePanel';
    Array.prototype.forEach.call(navLinks.children, function (a) {
      var clone = a.cloneNode(true);
      panel.appendChild(clone);
    });
    document.body.appendChild(panel);

    var closeMenu = function () {
      panel.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle.addEventListener('click', function () {
      var isOpen = panel.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close panel when clicking any link inside it
    Array.prototype.forEach.call(panel.querySelectorAll('a'), function (a) {
      a.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!panel.classList.contains('open')) return;
      if (panel.contains(e.target) || menuToggle.contains(e.target)) return;
      closeMenu();
    });

    // Close on resize to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 900) closeMenu();
    });
  }

  // ---------- 3. SMOOTH SCROLL ----------
  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  Array.prototype.forEach.call(anchorLinks, function (link) {
    var href = link.getAttribute('href');
    if (!href || href === '#' || href.length < 2) return;
    link.addEventListener('click', function (e) {
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ---------- 4. SCROLL REVEAL ----------
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );
    Array.prototype.forEach.call(revealEls, function (el) { observer.observe(el); });
  } else {
    Array.prototype.forEach.call(revealEls, function (el) { el.classList.add('visible'); });
  }

  // ---------- 5. BOARD SLIDER (manual buttons only) ----------
  var boardSlider = document.getElementById('boardSlider');
  if (boardSlider) {
    var slides = boardSlider.querySelectorAll('.board-slide');
    var prevBtn = document.getElementById('boardPrev');
    var nextBtn = document.getElementById('boardNext');
    var current = 0;
    var total = slides.length;

    var goTo = function (idx) {
      current = ((idx % total) + total) % total;
      Array.prototype.forEach.call(slides, function (s, i) {
        s.classList.toggle('active', i === current);
      });
    };

    // RTL: visually-right "previous" arrow advances forward
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current + 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current - 1); });

    // Touch swipe support
    var touchStartX = 0;
    boardSlider.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    boardSlider.addEventListener('touchend', function (e) {
      var diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 50) {
        if (diff < 0) goTo(current - 1);
        else goTo(current + 1);
      }
    }, { passive: true });
  }

  // ---------- 6. PARTNERS marquee — pause when off-screen ----------
  var marquee = document.getElementById('marquee');
  if (marquee && 'IntersectionObserver' in window) {
    var mObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        marquee.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
      });
    });
    mObs.observe(marquee);
  }

  // ---------- 7. LAZY IMAGE FALLBACK ----------
  if (!('loading' in HTMLImageElement.prototype) && 'IntersectionObserver' in window) {
    var lazyImages = document.querySelectorAll('img[loading="lazy"]');
    var lazyObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var img = e.target;
          if (img.dataset && img.dataset.src) img.src = img.dataset.src;
          lazyObs.unobserve(img);
        }
      });
    });
    Array.prototype.forEach.call(lazyImages, function (img) { lazyObs.observe(img); });
  }

})();
