/* ============================================================
   digibeg – Website V2
   Gemeinsames JavaScript: Theme-Umschaltung, Navigation, Header,
   Produkt-Ablauf (Scroll-Zustand), Sprach-Sektion (ruhiger Wechsel).
   Vanilla JS, keine Abhängigkeiten. Wird mit `defer` geladen.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var STORAGE_KEY = 'digibeg-theme';
  var THEME_COLORS = { light: '#f7f8fb', dark: '#0b1220' };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Theme ---------- */

  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* Speicher nicht verfügbar – Theme gilt nur für diese Seite */
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', THEME_COLORS[theme]);
    }
    updateThemeButtons();
  }

  function updateThemeButtons() {
    var isDark = currentTheme() === 'dark';
    var buttons = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      var labelLight = btn.getAttribute('data-label-light') || 'Helles Design aktivieren';
      var labelDark = btn.getAttribute('data-label-dark') || 'Dunkles Design aktivieren';
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.setAttribute('aria-label', isDark ? labelLight : labelDark);
    }
  }

  function initTheme() {
    var buttons = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {
        applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
      });
    }
    updateThemeButtons();
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', THEME_COLORS[currentTheme()]);
    }
  }

  /* ---------- Navigation (Mobile) ---------- */

  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById(toggle ? toggle.getAttribute('aria-controls') : '');
    var backdrop = document.querySelector('.nav-backdrop');
    if (!toggle || !nav) {
      return;
    }

    var mq = window.matchMedia('(min-width: 1240px)');
    var labelOpen = toggle.getAttribute('data-label-open') || 'Menü öffnen';
    var labelClose = toggle.getAttribute('data-label-close') || 'Menü schließen';

    function isOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    function open() {
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', labelClose);
      nav.classList.add('is-open');
      document.body.classList.add('nav-open');
    }

    function close(returnFocus) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', labelOpen);
      nav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
      if (returnFocus) {
        toggle.focus();
      }
    }

    toggle.addEventListener('click', function () {
      if (isOpen()) {
        close(false);
      } else {
        open();
      }
    });

    if (backdrop) {
      backdrop.addEventListener('click', function () {
        close(true);
      });
    }

    nav.addEventListener('click', function (event) {
      var link = event.target.closest ? event.target.closest('a') : null;
      if (link && !mq.matches) {
        close(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        close(true);
      }
    });

    function onBreakpointChange() {
      if (mq.matches && isOpen()) {
        close(false);
      }
    }
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', onBreakpointChange);
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(onBreakpointChange);
    }
  }

  /* ---------- Header: dezente Linie nach dem Scrollen ---------- */

  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) {
      return;
    }
    var ticking = false;
    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /* ---------- Produkt-Ablauf: aktiver Schritt steuert das Gerät ---------- */

  function initFlow() {
    var flow = document.querySelector('.flow');
    if (!flow || !('IntersectionObserver' in window)) {
      return;
    }
    var steps = flow.querySelectorAll('.flow__step');
    var shots = flow.querySelectorAll('.flow__stage .flow__shot');
    if (!steps.length || !shots.length) {
      return;
    }

    function activate(index) {
      for (var i = 0; i < steps.length; i++) {
        steps[i].classList.toggle('is-active', i === index);
      }
      for (var j = 0; j < shots.length; j++) {
        shots[j].classList.toggle('is-active', j === index);
      }
    }

    var observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          var index = parseInt(entries[i].target.getAttribute('data-step'), 10) - 1;
          if (index >= 0) {
            activate(index);
          }
        }
      }
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

    for (var k = 0; k < steps.length; k++) {
      observer.observe(steps[k]);
    }
    activate(0);
  }

  /* ---------- Sprache: ruhiger Wechsel der Hervorhebung ---------- */

  function initLanguages() {
    var list = document.querySelector('.lang__list');
    if (!list) {
      return;
    }
    var items = list.querySelectorAll('.lang__item');
    if (items.length < 2) {
      return;
    }

    var index = 0;
    var timer = null;
    var visible = false;
    var INTERVAL = 3600;

    function highlight(i) {
      for (var k = 0; k < items.length; k++) {
        items[k].classList.toggle('is-active', k === i);
      }
    }

    function tick() {
      index = (index + 1) % items.length;
      highlight(index);
    }

    function start() {
      if (timer || reduceMotion.matches || !visible || document.hidden) {
        return;
      }
      timer = window.setInterval(tick, INTERVAL);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function onMotionChange() {
      if (reduceMotion.matches) {
        stop();
        highlight(0);
      } else {
        start();
      }
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) {
          start();
        } else {
          stop();
        }
      }, { threshold: 0.15 });
      observer.observe(list);
    } else {
      visible = true;
      start();
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    });

    if (typeof reduceMotion.addEventListener === 'function') {
      reduceMotion.addEventListener('change', onMotionChange);
    } else if (typeof reduceMotion.addListener === 'function') {
      reduceMotion.addListener(onMotionChange);
    }

    highlight(0);
  }

  initTheme();
  initNav();
  initHeader();
  initFlow();
  initLanguages();
})();
