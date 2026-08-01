/* ============================================================
   Littlebird.ai rebuild — interaction scripts
   Re-implements the 15 custom scripts captured from the live site:
   reveal system, nav scroll/blur, dropdown, mobile menu, FAQ
   accordion, embed lazy-load + height bridge, OS-detect CTA.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var html = document.documentElement;

  /* ---------- Scroll-linked card reveal (branches from hero demo center) ---------- */
  html.classList.add('js-reveal');

  if (!reduceMotion && 'IntersectionObserver' in window) {
    // Store card final positions for interpolation
    var cardData = [];
    var cardsSection = document.querySelector('.cards_stage');
    var heroDemo = document.querySelector('.hero_demo');
    
    document.querySelectorAll('.lb_card').forEach(function (card, i) {
      var cs = getComputedStyle(card);
      cardData.push({
        el: card,
        finalTop: parseFloat(cs.top) || 0,
        finalLeft: parseFloat(cs.left) || 0,
        finalWidth: parseFloat(cs.width) || 0,
      });
    });

    // Scroll-linked animation
    var ticking = false;
    function updateCards() {
      if (!cardsSection || !heroDemo) return;
      
      // Get exact center of hero demo box
      var heroRect = heroDemo.getBoundingClientRect();
      var heroCenterX = heroRect.left + heroRect.width / 2;
      var heroCenterY = heroRect.top + heroRect.height / 2 + window.scrollY;
      
      var rect = cardsSection.getBoundingClientRect();
      var sectionTop = rect.top + window.scrollY;
      var sectionHeight = rect.height;
      
      // Slower animation — cards stay visible longer
      var scrollProgress = (window.scrollY - sectionTop + window.innerHeight * 0.8) / (sectionHeight * 1.5);
      scrollProgress = Math.max(0, Math.min(1, scrollProgress));

      cardData.forEach(function (data, i) {
        var card = data.el;
        
        if (scrollProgress > 0.02 && scrollProgress < 0.98) {
          // In view — animate based on scroll progress
          var progress = Math.min(1, scrollProgress * 1.5);
          var ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          
          // Start from EXACT center of hero demo box
          var startX = heroCenterX;
          var startY = heroCenterY - sectionTop;
          
          // End at final position (centered on card)
          var endX = data.finalLeft + data.finalWidth / 2;
          var endY = data.finalTop + 50;
          
          var currentX = startX + (endX - startX) * ease;
          var currentY = startY + (endY - startY) * ease;
          var currentScale = 0.3 + (1 - 0.3) * ease;
          var currentOpacity = Math.min(1, ease * 1.5);
          
          card.style.transform = 'translate(' + (currentX - endX) + 'px, ' + (currentY - endY) + 'px) scale(' + currentScale + ')';
          card.style.opacity = currentOpacity;
          
          if (!card.classList.contains('is-visible')) {
            card.classList.add('is-visible');
          }
        } else if (scrollProgress <= 0.02) {
          // Above view — converged at hero demo center (invisible)
          card.style.transform = '';
          card.style.opacity = '0';
          card.classList.remove('is-visible');
        } else {
          // Below view — show at final position
          card.style.transform = '';
          card.style.opacity = '1';
          if (!card.classList.contains('is-visible')) card.classList.add('is-visible');
        }
      });
      
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateCards);
        ticking = true;
      }
    }, { passive: true });
    
    // Initial state
    updateCards();
  } else {
    // reduced motion or no IO: show everything
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  // cards heading pop
  var headingWrap = document.querySelector('.cards_heading_wrap');
  if (headingWrap && 'IntersectionObserver' in window && !reduceMotion) {
    var hObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          hObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    hObs.observe(headingWrap);
  } else if (headingWrap) {
    headingWrap.classList.add('is-in');
  }

  /* ---------- Nav scroll reveal + blur ---------- */
  var navWrap = document.querySelector('.nav_wrap');
  if (navWrap) {
    var SHOWN = 90; // scroll threshold
    function onScroll() {
      html.classList.toggle('nav-shown', window.scrollY > SHOWN);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav ---------- */
  var burger = document.querySelector('[data-nav-burger]');
  var mobilePanel = document.querySelector('[data-nav-mobile]');
  if (burger && mobilePanel) {
    var open = false;
    function setOpen(v) {
      open = v;
      html.classList.toggle('nav-open', v);
      burger.setAttribute('aria-expanded', v ? 'true' : 'false');
    }
    burger.addEventListener('click', function () { setOpen(!open); });
    mobilePanel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) setOpen(false);
    });
  }

  /* ---------- FAQ accordion ---------- */
  var faqRows = document.querySelectorAll('.faq-row');
  if (faqRows.length) {
    faqRows.forEach(function (row) {
      var btn = row.querySelector('.faq__title, .faq__plus');
      var ans = row.querySelector('.faq-answer');
      if (!btn || !ans) return;
      btn.addEventListener('click', function () {
        var isOpen = row.classList.contains('is-open');
        // close all
        faqRows.forEach(function (r) {
          r.classList.remove('is-open');
          var a = r.querySelector('.faq-answer');
          if (a) a.style.maxHeight = '0px';
        });
        if (!isOpen) {
          row.classList.add('is-open');
          ans.style.maxHeight = ans.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---------- Embed lazy-load on scroll ---------- */
  var embeds = document.querySelectorAll('iframe[data-src]');
  function loadFrame(f) {
    var s = f.getAttribute('data-src');
    if (s) { f.src = s; f.removeAttribute('data-src'); }
  }
  if (embeds.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { loadFrame(e.target); io.unobserve(e.target); }
        });
      }, { rootMargin: '200px 0px', threshold: 0.01 });
      embeds.forEach(function (f) { io.observe(f); });
    } else {
      embeds.forEach(loadFrame);
    }
  }

  /* ---------- Embed -> parent height bridge ---------- */
  var LB_MAP = {
    'lb-hero-height': '.apps_embed[data-lb-hero]',
    'lb-msg-height': '.apps_embed[data-lb-msg]',
    'lb-roles-height': '.apps_embed[data-lb-roles]',
    'lb-prob-height': '.apps_embed[data-lb-prob]'
  };
  window.addEventListener('message', function (e) {
    var d = e && e.data;
    if (!d || !d.type) return;
    var sel = LB_MAP[d.type];
    if (sel) {
      var frames = document.querySelectorAll(sel);
      var h = parseInt(d.height, 10);
      if (h && h > 0) frames.forEach(function (f) { f.style.height = h + 'px'; });
    }
    if (d.type === 'lb-hero-height') {
      var heroFrames = document.querySelectorAll('[data-lb-hero]');
      var hh = parseInt(d.height, 10);
      if (hh && hh > 0) heroFrames.forEach(function (f) { f.style.height = hh + 'px'; });
    }
  });

  /* ---------- OS detect for download buttons ---------- */
  (function () {
    var ua = navigator.userAgent;
    var p = navigator.platform || '';
    var os = 'mac-as';
    if (/iPhone|iPad|iPod/i.test(ua)) os = 'ios';
    else if (/Android/i.test(ua)) os = 'android';
    else if (/Win/i.test(p) || /Windows/i.test(ua)) os = 'windows';
    else if (/Mac/i.test(p) || /Mac/i.test(ua)) os = 'mac-as';

    var OS_LABELS = {
      'mac-as': { cls: 'cta-mac-as', label: 'Download for free' },
      'ios': { cls: 'cta-ios', label: 'Get the app' },
      'android': { cls: 'cta-android', label: 'Get the app' },
      'windows': { cls: 'cta-windows', label: 'Download for free' },
      'others': { cls: 'cta-others', label: 'Download for free' }
    };

    // Show the matching CTA variant across all cta_group blocks
    document.querySelectorAll('.cta_group').forEach(function (group) {
      var variant = group.querySelector('.cta-' + os);
      if (!variant) {
        variant = group.querySelector('.cta-mac-as') || group.querySelector('.cta-mac');
      }
      if (variant) {
        group.querySelectorAll('[class*="cta-"]').forEach(function (el) {
          if (!el.classList.contains('cta_group') && el !== variant) el.style.display = 'none';
        });
        variant.style.display = 'flex';
        var label = variant.querySelector('[data-os-label]');
        if (label && OS_LABELS[os]) label.textContent = OS_LABELS[os].label;
      }
    });

    // fineprint handling
    document.querySelectorAll('.hero_fineprint').forEach(function (fp) {
      if (os !== 'windows') fp.style.display = 'none';
      else fp.style.display = '';
    });
  })();

  /* ---------- Share via navigator.share ---------- */
  document.querySelectorAll('[data-os-share]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (navigator.share) {
        e.preventDefault();
        navigator.share({ title: document.title, url: window.location.href });
      }
    });
  });

})();
