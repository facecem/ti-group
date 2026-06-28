/* ============================================================
   TI Group — shared site behaviour
   ============================================================ */
(function () {
  'use strict';

  const header = document.getElementById('header');
  const isHomeHero = !!document.querySelector('.hero');

  // ── Sticky header ──
  function onScroll() {
    if (!header) return;
    if (isHomeHero) header.classList.toggle('scrolled', window.scrollY > 60);
  }
  // Subpages: header always solid (no full-bleed hero behind it)
  if (header && !isHomeHero) header.classList.add('solid');
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Mobile menu ──
  const burger = document.querySelector('.burger');
  const menu = document.getElementById('mobileMenu');
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (burger && menu) {
    burger.addEventListener('click', function () {
      const open = menu.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  // ── Cookie banner ──
  const cookie = document.getElementById('cookie-banner');
  if (cookie && !localStorage.getItem('ti_cookie')) {
    setTimeout(() => cookie.classList.remove('hidden'), 1600);
  }
  window.dismissCookie = function (v) {
    localStorage.setItem('ti_cookie', v);
    if (cookie) cookie.classList.add('hidden');
  };

  // ── Scroll reveal ──
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  // ── Projects filter ──
  const chips = document.querySelectorAll('.chip');
  const cards = document.querySelectorAll('[data-cat]');
  if (chips.length && cards.length) {
    chips.forEach(chip => chip.addEventListener('click', function () {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const f = chip.dataset.filter;
      cards.forEach(card => {
        const show = f === 'all' || card.dataset.cat === f;
        card.classList.toggle('hide', !show);
      });
    }));
  }

  // ── Contact form ──
  const form = document.getElementById('kontakt-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.classList.add('hidden');
      const ok = document.getElementById('form-success');
      if (ok) ok.classList.remove('hidden');
    });
  }

  // ── Footer year ──
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
