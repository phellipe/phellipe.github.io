/* =================================================================
   phellipe.eti.br — interactions
   Language toggle (PT/EN), hero typing, scroll reveal, nav state.
   Vanilla JS, no dependencies.
   ================================================================= */
(() => {
  'use strict';

  const LANG_KEY = 'phellipe-lang';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const store = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } };
  const recall = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };

  /* ---------- i18n ---------- */
  function applyLang(lang) {
    const isEn = lang === 'en';
    document.documentElement.lang = isEn ? 'en' : 'pt-BR';

    document.querySelectorAll('[data-en]').forEach((el) => {
      if (el.dataset.pt === undefined) el.dataset.pt = el.textContent;
      el.textContent = isEn ? el.dataset.en : el.dataset.pt;
    });

    document.querySelectorAll('[data-en-aria]').forEach((el) => {
      if (el.dataset.ptAria === undefined) {
        el.dataset.ptAria = el.getAttribute('aria-label') || '';
      }
      el.setAttribute('aria-label', isEn ? el.dataset.enAria : el.dataset.ptAria);
    });

    const toggle = document.querySelector('[data-lang-toggle]');
    if (toggle) {
      toggle.textContent = isEn ? 'PT' : 'EN';
      toggle.setAttribute('aria-label', isEn ? 'Mudar para português' : 'Switch to English');
    }

    // keep the (static) typed word in sync when motion is reduced
    const typed = document.querySelector('[data-typed]');
    if (typed && reduceMotion) {
      const list = (isEn ? typed.dataset.typedWordsEn : typed.dataset.typedWords).split('|');
      typed.textContent = list[0];
    }

    store(LANG_KEY, lang);
  }

  function initLang() {
    const saved = recall(LANG_KEY);
    const detected = (navigator.language || '').toLowerCase().startsWith('pt') ? 'pt' : 'en';
    applyLang(saved || detected);

    const toggle = document.querySelector('[data-lang-toggle]');
    if (toggle) {
      toggle.addEventListener('click', () => {
        applyLang(document.documentElement.lang === 'en' ? 'pt' : 'en');
      });
    }
  }

  /* ---------- Hero typing ---------- */
  function initTyping() {
    const el = document.querySelector('[data-typed]');
    if (!el) return;

    const words = () => (
      document.documentElement.lang === 'en'
        ? el.dataset.typedWordsEn
        : el.dataset.typedWords
    ).split('|');

    if (reduceMotion) {
      el.textContent = words()[0];
      return;
    }

    let wordIndex = 0;
    let charIndex = words()[0].length;
    let deleting = false;
    el.textContent = words()[0];

    const tick = () => {
      const list = words();
      const word = list[wordIndex % list.length];
      charIndex += deleting ? -1 : 1;
      charIndex = Math.max(0, Math.min(charIndex, word.length));
      el.textContent = word.slice(0, charIndex);

      let delay = deleting ? 45 : 95;
      if (!deleting && charIndex === word.length) {
        delay = 1500;
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex += 1;
        delay = 320;
      }
      setTimeout(tick, delay);
    };

    setTimeout(tick, 1800);
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Header background on scroll ---------- */
  function initHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const update = () => header.classList.toggle('scrolled', window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ---------- Nav: mobile menu + active link ---------- */
  function initNav() {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('[data-menu-toggle]');
    const menu = document.getElementById('nav-menu');

    if (header && toggle && menu) {
      toggle.addEventListener('click', () => {
        const open = header.classList.toggle('menu-open');
        toggle.setAttribute('aria-expanded', String(open));
      });
      menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          header.classList.remove('menu-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    const links = Array.from(document.querySelectorAll('.nav-links a'));
    const sections = new Map();
    links.forEach((link) => {
      const section = document.getElementById(link.getAttribute('href').slice(1));
      if (section) sections.set(section, link);
    });

    if (sections.size && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            links.forEach((l) => l.classList.remove('active'));
            const active = sections.get(entry.target);
            if (active) active.classList.add('active');
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach((_, section) => io.observe(section));
    }
  }

  /* ---------- Boot ---------- */
  function init() {
    initLang();
    initHeader();
    initNav();
    initReveal();
    initTyping();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
