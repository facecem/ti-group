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

  // ── E-Mail-Adressen (verschleiert) ──
  // Im HTML steht keine Adresse im Klartext. Benutzername und Domain liegen getrennt hier
  // und werden erst im Browser zu einem klickbaren mailto-Link zusammengesetzt.
  // Ohne JavaScript bleibt der Text "info [at] tahir-investments [dot] com" stehen.
  const MAILS = {
    info:        ['info', 'tahir-investments', 'com'],
    development: ['development', 'tahir-investments', 'com']
  };
  function decodeMails(root) {
    (root || document).querySelectorAll('[data-mail]').forEach(function (a) {
      const p = MAILS[a.getAttribute('data-mail')];
      if (!p) return;
      const addr = p[0] + '@' + p[1] + '.' + p[2];
      a.setAttribute('href', 'mailto:' + addr + (a.getAttribute('data-subject') ? '?subject=' + encodeURIComponent(a.getAttribute('data-subject')) : ''));
      if (!a.hasAttribute('data-keep-text')) a.textContent = addr;
    });
  }
  decodeMails();

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

  // ── Kontaktformular (Web3Forms) ──
  // Je Postfach ein Access Key von web3forms.com. "Objektangebot" geht an development@,
  // alle anderen Betreffs an info@. Fehlt der development-Key, geht alles an info@.
  // Sind KEINE Keys eingetragen, wird das Formular ausgeblendet und E-Mail/Telefon groß angezeigt.
  const FORM_KEYS = {
    info:        'c5cfbed3-1fb4-452e-a25f-74690d279dd0',   // Access Key für info@tahir-investments.com
    development: 'db2d7ec7-463d-4e71-a137-8bbf7106efe3'    // Access Key für development@tahir-investments.com
  };
  const form = document.getElementById('kontakt-form');
  if (form) {
    const fallback = document.getElementById('form-fallback');
    const errBox = document.getElementById('form-error');
    const btn = document.getElementById('form-btn');
    const subj = document.getElementById('f-subj');

    if (!FORM_KEYS.info && !FORM_KEYS.development) {
      form.classList.add('hidden');
      if (fallback) fallback.classList.remove('hidden');
    }

    // Betreff per Link vorauswählen: kontakt.html?betreff=Objektangebot
    const pre = new URLSearchParams(location.search).get('betreff');
    if (pre && subj) {
      [].forEach.call(subj.options, function (o) { if (o.text.toLowerCase() === pre.toLowerCase()) subj.value = o.text; });
    }

    const showError = function (html) { errBox.innerHTML = html; errBox.classList.remove('hidden'); };
    const direct = 'Bitte schreiben Sie uns direkt an <a class="js-mail" data-mail="info">info [at] tahir-investments [dot] com</a> oder rufen Sie an: <a href="tel:+4924143010030">0241 430 100 30</a>.';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      errBox.classList.add('hidden');
      form.querySelectorAll('.is-invalid').forEach(function (el) { el.classList.remove('is-invalid'); });

      // Pflichtfelder prüfen
      let firstBad = null;
      form.querySelectorAll('[required]').forEach(function (el) {
        const bad = el.type === 'checkbox' ? !el.checked : !el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value));
        if (bad) { (el.type === 'checkbox' ? el.closest('.form-check') : el).classList.add('is-invalid'); firstBad = firstBad || el; }
      });
      if (firstBad) {
        showError(firstBad.type === 'email' && firstBad.value ? 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' : 'Bitte füllen Sie alle mit * markierten Felder aus und bestätigen Sie die Datenschutzerklärung.');
        firstBad.focus(); return;
      }

      const F = form.elements;
      const toDev = subj.value === 'Objektangebot' && FORM_KEYS.development;
      const data = {
        access_key: toDev ? FORM_KEYS.development : (FORM_KEYS.info || FORM_KEYS.development),
        subject: 'Website-Anfrage: ' + subj.value,
        from_name: 'Website TI Group',
        name: F.name.value.trim(),
        email: F.email.value.trim(),
        telefon: F.telefon.value.trim() || '–',
        betreff: subj.value,
        nachricht: F.nachricht.value.trim(),
        botcheck: F.botcheck.checked
      };
      if (data.botcheck) return; // Bot: still ignorieren

      btn.disabled = true; const label = btn.textContent; btn.textContent = 'Wird gesendet …';
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok && j.success, j: j }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error((res.j && res.j.message) || 'Versand fehlgeschlagen');
          form.classList.add('hidden');
          const ok = document.getElementById('form-success');
          if (ok) ok.classList.remove('hidden');
        })
        .catch(function () {
          showError('Ihre Nachricht konnte gerade nicht gesendet werden. Ihre Eingaben bleiben erhalten. ' + direct);
          decodeMails(errBox);
        })
        .finally(function () { btn.disabled = false; btn.textContent = label; });
    });
  }

  // ── Footer year ──
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
