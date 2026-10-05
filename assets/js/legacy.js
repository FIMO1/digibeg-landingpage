/* ============================================================
   digibeg – LEGACY-JavaScript der V1-Demo-Slideshow.
   Unverändert übernommen, wird mit Commit 2 ersetzt.
   ============================================================ */
(function () {
  'use strict';

  function initSlideshow(slidesId, dotsId, interval) {
    const slides = document.querySelectorAll('#' + slidesId + ' .slide');
    const dots = document.querySelectorAll('#' + dotsId + ' span');
    if (!slides.length) return;
    let current = 0;

    function goTo(n) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetTimer(); }));

    let timer = setInterval(() => goTo(current + 1), interval);
    function resetTimer() { clearInterval(timer); timer = setInterval(() => goTo(current + 1), interval); }
  }

  initSlideshow('mobile-slides', 'mobile-dots', 3000);
  initSlideshow('web-slides', 'web-dots', 4000);

  function showDemo(which) {
    document.getElementById('panel-mobile').classList.toggle('active', which === 'mobile');
    document.getElementById('panel-web').classList.toggle('active', which === 'web');
    document.getElementById('btn-mobile').classList.toggle('active', which === 'mobile');
    document.getElementById('btn-web').classList.toggle('active', which === 'web');
  }


  window.showDemo = showDemo;
})();
