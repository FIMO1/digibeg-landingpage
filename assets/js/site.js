/* ============================================================
   digibeg – Website V2
   Gemeinsames JavaScript: Theme-Umschaltung, Navigation, Header.
   Vanilla JS, keine Abhängigkeiten. Wird mit `defer` geladen.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var STORAGE_KEY = 'digibeg-theme';
  var THEME_COLORS = { light: '#f7f8fb', dark: '#0b1220' };

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

    var mq = window.matchMedia('(min-width: 1200px)');
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

  initTheme();
  initNav();
  initHeader();
})();
