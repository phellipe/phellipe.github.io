/* =================================================================
   phellipe.eti.br — interactions
   Hero typing, scroll reveal, nav state, the video player and the
   video page (chapters, ?t=).
   Each page is static in its own language (/ = pt-BR, /en/ = en):
   nothing here translates or redirects content.
   Vanilla JS, no dependencies, no third-party requests.
   ================================================================= */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  /* ---------- Hero typing ---------- */
  // Types a few words and stops on a whole word after ~5 s, so nothing moves on
  // its own for longer than that (WCAG 2.2.2). Screen readers and crawlers get
  // the full list from a visually hidden text; the typed word is aria-hidden.
  function initTyping() {
    const el = document.querySelector('[data-typed]');
    if (!el) return;
    const words = (el.dataset.typedWords || el.textContent).split('|');
    el.textContent = words[0];
    if (reduceMotion || words.length < 2) return;

    const stopAt = performance.now() + 5000;
    let wordIndex = 0;
    let charIndex = words[0].length;
    let deleting = false;

    const tick = () => {
      if (performance.now() >= stopAt) {
        el.textContent = words[wordIndex % words.length];
        return;
      }
      const word = words[wordIndex % words.length];
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
    if (reduceMotion || !hasIO) {
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
  // A 24px sentinel at the top of the page: when it leaves the viewport the
  // header gets its background. No scroll listener and no forced layout at boot.
  function initHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    if (!hasIO) {
      const update = () => header.classList.toggle('scrolled', window.scrollY > 24);
      window.addEventListener('scroll', update, { passive: true });
      requestAnimationFrame(update);
      return;
    }
    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:24px;pointer-events:none;';
    document.body.prepend(sentinel);
    new IntersectionObserver(([entry]) => {
      header.classList.toggle('scrolled', !entry.isIntersecting);
    }).observe(sentinel);
  }

  /* ---------- Nav: mobile menu + active link ---------- */
  function initNav() {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('[data-menu-toggle]');
    const menu = document.getElementById('nav-menu');

    if (header && toggle && menu) {
      const close = () => {
        header.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      };
      toggle.addEventListener('click', () => {
        const open = header.classList.toggle('menu-open');
        toggle.setAttribute('aria-expanded', String(open));
      });
      menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
      // Escape closes the open menu and returns focus to its button
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && header.classList.contains('menu-open')) {
          close();
          toggle.focus();
        }
      });
    }

    const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
    const sections = new Map();
    links.forEach((link) => {
      const section = document.getElementById(link.getAttribute('href').slice(1));
      if (section) sections.set(section, link);
    });

    if (sections.size && hasIO) {
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

  /* ---------- Video: friendly fallback when the MP4 can't be loaded ---------- */
  // If the MP4 can't be loaded, say so in plain text. The message goes into
  // an empty role="status" region, so screen readers announce it.
  function watchFallback(video) {
    const fallback = video.parentElement && video.parentElement.querySelector('.video-fallback');
    const showFallback = () => {
      if (fallback && !fallback.textContent) fallback.textContent = fallback.dataset.msg || '';
    };
    video.querySelectorAll('source').forEach((source) => source.addEventListener('error', showFallback));
    video.addEventListener('error', showFallback);
  }

  /* ---------- Video on the home: rendered and poster loaded on approach ---------- */
  function initVideo() {
    document.querySelectorAll('video[data-poster]').forEach((video) => {
      const frame = video.closest('.video-frame') || video;
      const activate = () => {
        if (!video.getAttribute('poster')) video.setAttribute('poster', video.dataset.poster);
        frame.classList.add('is-ready');
      };
      // The player sits below the fold: render it (native controls included) and
      // fetch the poster only when it gets close, so neither competes with the
      // hero portrait (the LCP image) during load.
      if (hasIO) {
        const io = new IntersectionObserver((entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            activate();
            io.disconnect();
          }
        }, { rootMargin: '600px 0px' });
        io.observe(frame);
        // Keyboard users may Tab past the fold before it renders: the first Tab
        // renders the player, so it is in the focus order when they get there.
        const onTab = (event) => {
          if (event.key !== 'Tab') return;
          activate();
          io.disconnect();
          document.removeEventListener('keydown', onTab, true);
        };
        document.addEventListener('keydown', onTab, true);
      } else {
        activate();
      }

      watchFallback(video);
    });
  }

  /* ---------- Video page: chapters and ?t= ---------- */
  // The player is the main content here: no lazy rendering, the poster is in the
  // HTML. Chapter links are plain "?t=SECONDS" URLs (valid without JS); with JS a
  // click seeks, plays and keeps the address bar in sync (history.replaceState).
  // Opening the page with ?t=N (or #t=N) positions the video at N, without autoplay.
  function initWatch() {
    const video = document.querySelector('video[data-watch]');
    if (!video) return;
    watchFallback(video);

    const parseTime = (value) => {
      if (value == null || value === '') return null;
      const n = Number(value);
      return Number.isFinite(n) && n >= 0 ? n : null;
    };
    const seek = (seconds) => {
      try { video.currentTime = seconds; } catch (e) { /* metadata not ready: handled below */ }
    };

    const fromUrl = parseTime(new URLSearchParams(location.search).get('t')) ??
      parseTime((/^#t=(\d+(?:\.\d+)?)$/.exec(location.hash) || [])[1]);
    if (fromUrl) {
      // preload="none" doesn't load metadata: ask for it only when a start time is given
      const apply = () => {
        const max = Number.isFinite(video.duration) ? video.duration : Infinity;
        seek(Math.min(fromUrl, max));
      };
      if (video.readyState >= 1) apply();
      else {
        video.addEventListener('loadedmetadata', apply, { once: true });
        video.preload = 'metadata';
      }
    }

    document.querySelectorAll('a[data-t]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const seconds = parseTime(link.dataset.t);
        if (seconds === null) return;
        event.preventDefault();
        seek(seconds);
        const played = video.play();
        if (played && played.catch) played.catch(() => { /* autoplay blocked or MP4 missing: the controls and the fallback message cover it */ });
        history.replaceState(null, '', '?t=' + seconds);
        // on phones the chapter list is below the fold: bring the player back into view
        const box = video.getBoundingClientRect();
        if (box.top < 0 || box.bottom > window.innerHeight) {
          video.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      });
    });
  }

  /* ---------- In-page anchors and content-visibility ---------- */
  // Sections below the hero use `content-visibility: auto` (estimated heights
  // until rendered). Before the browser scrolls to an #anchor, render them all
  // so the target lands exactly where it should.
  function initAnchors() {
    const root = document.documentElement;
    document.addEventListener('click', (event) => {
      const link = event.target.closest && event.target.closest('a[href^="#"]');
      if (link && link.getAttribute('href').length > 1) root.classList.add('cv-off');
    }, true);
    window.addEventListener('hashchange', () => {
      if (root.classList.contains('cv-off')) return;
      root.classList.add('cv-off');
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView();
    });
  }

  /* ---------- Boot ---------- */
  // Each module runs in its own task, so no single task blocks the main thread
  // for long while the page is still loading.
  function init() {
    const queue = [initAnchors, initHeader, initReveal, initNav, initVideo, initWatch, initTyping];
    const next = () => {
      const fn = queue.shift();
      if (!fn) return;
      fn();
      if (queue.length) setTimeout(next, 0);
    };
    next();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
