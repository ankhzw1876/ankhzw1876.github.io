(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function runHeroIntro() {
    var ready = function () {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          root.classList.add('motion-ready');
          window.setTimeout(function () { root.classList.add('motion-settled'); }, 1300);
        });
      });
    };

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(ready);
    else ready();
  }

  function setupReveals() {
    var selectors = [
      '.home-card',
      '.work-section .section-head',
      '.project-card',
      '.method-section .section-head',
      '.method-item',
      '.feed-head',
      '.feed .entry',
      '.sidebar .widget'
    ];
    var elements = Array.prototype.slice.call(document.querySelectorAll(selectors.join(',')));

    elements.forEach(function (element, index) {
      element.classList.add('motion-reveal');
      element.style.setProperty('--reveal-delay', ((index % 4) * 65) + 'ms');
    });

    var band = document.querySelector('.chapter-band');
    if (band) band.classList.add('motion-band');

    if (!('IntersectionObserver' in window) || reduceMotion) {
      elements.forEach(function (element) { element.classList.add('is-visible'); });
      if (band) band.classList.add('is-visible');
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.11, rootMargin: '0px 0px -7% 0px' });

    elements.forEach(function (element) { observer.observe(element); });
    if (band) observer.observe(band);
  }

  function setupHeroDepth() {
    if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var hero = document.querySelector('.hero');
    var portrait = document.querySelector('.hero-portrait');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.proof-card'));
    if (!hero) return;

    var frame = 0;
    var targetX = 0;
    var targetY = 0;

    function paint() {
      frame = 0;
      hero.style.setProperty('--hero-wash-x', (targetX * 22).toFixed(1) + 'px');
      hero.style.setProperty('--hero-wash-y', (targetY * 18).toFixed(1) + 'px');

      if (portrait) {
        portrait.style.setProperty('--portrait-x', (targetX * 8).toFixed(1) + 'px');
        portrait.style.setProperty('--portrait-y', (targetY * 7).toFixed(1) + 'px');
        portrait.style.setProperty('--portrait-rx', (-targetY * 3.2).toFixed(2) + 'deg');
        portrait.style.setProperty('--portrait-ry', (targetX * 4).toFixed(2) + 'deg');
      }

      cards.forEach(function (card, index) {
        var depth = 1 + index * 0.22;
        card.style.setProperty('--card-x', (targetX * -8 * depth).toFixed(1) + 'px');
        card.style.setProperty('--card-y', (targetY * -6 * depth).toFixed(1) + 'px');
        card.style.setProperty('--card-rx', (targetY * 1.8).toFixed(2) + 'deg');
        card.style.setProperty('--card-ry', (targetX * -2.2).toFixed(2) + 'deg');
      });
    }

    function requestPaint() {
      if (!frame) frame = requestAnimationFrame(paint);
    }

    hero.addEventListener('pointermove', function (event) {
      var rect = hero.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      requestPaint();
    });

    hero.addEventListener('pointerleave', function () {
      targetX = 0;
      targetY = 0;
      requestPaint();
    });
  }

  function setupMagneticButtons() {
    if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    document.querySelectorAll('.button').forEach(function (button) {
      button.addEventListener('pointermove', function (event) {
        var rect = button.getBoundingClientRect();
        var x = event.clientX - rect.left - rect.width / 2;
        var y = event.clientY - rect.top - rect.height / 2;
        button.style.setProperty('--mag-x', (x * 0.16).toFixed(1) + 'px');
        button.style.setProperty('--mag-y', (y * 0.18).toFixed(1) + 'px');
      });
      button.addEventListener('pointerleave', function () {
        button.style.setProperty('--mag-x', '0px');
        button.style.setProperty('--mag-y', '0px');
      });
    });
  }

  function setupProjectTilt() {
    if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    document.querySelectorAll('.project-card').forEach(function (card) {
      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        var x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        var y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        card.style.setProperty('--tilt-x', (-y * 1.8).toFixed(2) + 'deg');
        card.style.setProperty('--tilt-y', (x * 2.4).toFixed(2) + 'deg');

        var image = card.querySelector('.project-visual img');
        if (image) {
          image.style.setProperty('--img-x', (x * -7).toFixed(1) + 'px');
          image.style.setProperty('--img-y', (y * -6).toFixed(1) + 'px');
        }
      });

      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
        var image = card.querySelector('.project-visual img');
        if (image) {
          image.style.setProperty('--img-x', '0px');
          image.style.setProperty('--img-y', '0px');
        }
      });
    });
  }

  function setupScrollDepth() {
    if (reduceMotion) return;

    var hero = document.querySelector('.hero');
    var band = document.querySelector('.chapter-band');
    var visuals = Array.prototype.slice.call(document.querySelectorAll('.project-visual img'));
    var scheduled = false;

    function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

    function paint() {
      scheduled = false;

      if (hero) {
        var heroRect = hero.getBoundingClientRect();
        var heroProgress = clamp(-heroRect.top / Math.max(heroRect.height, 1), 0, 1);
        hero.style.setProperty('--hero-scroll-main', (-heroProgress * 16).toFixed(1) + 'px');
        hero.style.setProperty('--hero-scroll-aside', (-heroProgress * 34).toFixed(1) + 'px');
      }

      if (band) {
        var bandRect = band.getBoundingClientRect();
        var bandProgress = clamp((window.innerHeight - bandRect.top) / (window.innerHeight + bandRect.height), 0, 1);
        band.style.setProperty('--chapter-x', ((bandProgress - 0.5) * 28).toFixed(1) + 'px');
      }

      visuals.forEach(function (image) {
        var rect = image.parentElement.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;
        var centerDelta = (window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight;
        image.style.setProperty('--parallax-y', (clamp(centerDelta * 24, -18, 18)).toFixed(1) + 'px');
      });
    }

    function schedule() {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(paint);
      }
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
  }

  runHeroIntro();
  setupReveals();
  setupHeroDepth();
  setupMagneticButtons();
  setupProjectTilt();
  setupScrollDepth();
})();
