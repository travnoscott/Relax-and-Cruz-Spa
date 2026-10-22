// Relax & Cruz Spa. Booking links, mobile menu and price finder.

(function () {
  // Booking links. Every Book button on the site says which service it books, with
  // data-book="…". To send those buttons straight to one service in Square, paste that
  // service's own Square booking link between the quotes next to its name. Anything left
  // empty opens the full booking list, so a missing link never breaks a button.
  var BOOK_ALL = 'https://book.squareup.com/appointments/5c3y8w34fg9goo/location/LR7VH9PK37BJG/services';
  var BOOKING = {
    'consult': 'https://app.squareup.com/appointments/buyer/widget/gktj812dom61am/LR7VH9PK37BJG',           // Free Consultation (every "Book a free consult" button)
    'laser': 'https://app.squareup.com/appointments/buyer/widget/mukyns53urogtr/LR7VH9PK37BJG',             // Laser hair removal, any size (laser, ingrown hair and men's pages)
    'laser-xs': 'https://app.squareup.com/appointments/buyer/widget/jvnb8mbt8ku5ls/LR7VH9PK37BJG',          // Laser: Extra-Small Areas (price finder, "Book this area")
    'laser-s': 'https://app.squareup.com/appointments/buyer/widget/eyxslovgyuizz6/LR7VH9PK37BJG',           // Laser: Small Areas
    'laser-m': 'https://app.squareup.com/appointments/buyer/widget/q191xbxhlfomoa/LR7VH9PK37BJG',           // Laser: Medium Areas
    'laser-l': 'https://app.squareup.com/appointments/buyer/widget/968xy3w4byqz1q/LR7VH9PK37BJG',           // Laser: Large Areas
    'laser-xl': 'https://app.squareup.com/appointments/buyer/widget/dtcr3r7676uyll/LR7VH9PK37BJG',          // Laser: Extra-Large Areas
    'laser-fb': 'https://app.squareup.com/appointments/buyer/widget/tojyxuzdnwwz55/LR7VH9PK37BJG',          // Laser: Full Body
    'electrolysis': 'https://app.squareup.com/appointments/buyer/widget/39tnbm4lon5k2t/LR7VH9PK37BJG',      // Electrolysis (Permanent Hair Removal)
    'facials': '',           // Facials and Peels
    'lymphatic': 'https://app.squareup.com/appointments/buyer/widget/yp293sdkwsbvwz/LR7VH9PK37BJG',         // Post-Op Lymphatic Massage
    'massage': 'https://app.squareup.com/appointments/buyer/widget/w6wqzu05cqj1ck/LR7VH9PK37BJG',           // Swedish Massage
    'body-contouring': 'https://app.squareup.com/appointments/buyer/widget/1j0wfes92udquj/LR7VH9PK37BJG',   // Body Contouring
    'all': ''                // Homepage, contact and shop buttons: keep empty for the full list
  };
  var bookLink = function (key) { return BOOKING[key] || BOOK_ALL; };
  document.querySelectorAll('a[data-book]').forEach(function (a) {
    a.href = bookLink(a.getAttribute('data-book'));
  });

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      }
    });
  }

  // Desktop menu: a green leaf rests on the current page and glides to the link being pointed at.
  // Its points swap sides with the direction it moves, like the logo leaf turning.
  if (nav) {
    var glider = document.createElement('span');
    glider.className = 'nav-glider';
    glider.setAttribute('aria-hidden', 'true');
    nav.insertBefore(glider, nav.firstChild);
    var navLinks = [].slice.call(nav.querySelectorAll('a'));
    var current = nav.querySelector('[aria-current="page"]');
    var lastX = null;
    var glideTo = function (a) {
      navLinks.forEach(function (l) { l.classList.toggle('is-lit', l === a); });
      if (!a) { glider.classList.remove('is-on'); return; }
      if (!glider.classList.contains('is-on')) glider.classList.add('no-anim');
      var x = a.offsetLeft;
      glider.classList.toggle('flip', lastX !== null && x < lastX);
      lastX = x;
      glider.style.transform = 'translate(' + x + 'px, ' + a.offsetTop + 'px)';
      glider.style.width = a.offsetWidth + 'px';
      glider.style.height = a.offsetHeight + 'px';
      glider.offsetWidth; // apply the jump before turning the glide back on
      glider.classList.remove('no-anim');
      glider.classList.add('is-on');
    };
    navLinks.forEach(function (a) {
      a.addEventListener('mouseenter', function () { glideTo(a); });
      a.addEventListener('focus', function () { glideTo(a); });
    });
    nav.addEventListener('mouseleave', function () { glideTo(current); });
    nav.addEventListener('focusout', function (e) { if (!nav.contains(e.relatedTarget)) glideTo(current); });
    var rest = function () { glider.classList.remove('is-on'); glideTo(current); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(rest); else rest();
    window.addEventListener('resize', rest);
  }

  // Homepage intro video: plays muted on load; the button restarts it with sound.
  var intro = document.getElementById('intro-video');
  var sound = document.getElementById('intro-sound');
  if (intro && sound) {
    sound.addEventListener('click', function () {
      if (intro.muted) {
        if (!intro.getAttribute('src') && intro.dataset.src) intro.src = intro.dataset.src;
        intro.muted = false;
        intro.loop = false;
        intro.currentTime = 0;
        intro.play();
        sound.setAttribute('aria-pressed', 'true');
        sound.querySelector('span').textContent = 'Mute';
      } else {
        intro.muted = true;
        sound.setAttribute('aria-pressed', 'false');
        sound.querySelector('span').textContent = 'Tap for sound';
      }
    });
    intro.addEventListener('ended', function () {
      intro.muted = true;
      intro.loop = true;
      intro.play();
      sound.setAttribute('aria-pressed', 'false');
      sound.querySelector('span').textContent = 'Tap for sound';
    });
  }

  // Intro video slider: drag to jump to any point in the video.
  var seek = document.getElementById('intro-seek');
  var time = document.getElementById('intro-time');
  if (intro && seek) {
    var dragging = false;
    var fmt = function (s) {
      s = Math.max(0, Math.floor(s || 0));
      return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
    };
    var showTime = function () {
      if (time && intro.duration) time.textContent = fmt(intro.currentTime) + ' / ' + fmt(intro.duration);
    };
    intro.addEventListener('timeupdate', function () {
      if (!dragging && intro.duration) seek.value = Math.round(intro.currentTime / intro.duration * 1000);
      showTime();
    });
    intro.addEventListener('loadedmetadata', showTime);
    seek.addEventListener('input', function () {
      dragging = true;
      if (intro.duration) intro.currentTime = seek.value / 1000 * intro.duration;
      showTime();
    });
    seek.addEventListener('change', function () { dragging = false; });
  }

  // Laser deal popup: opens once per visit, on whichever page the visitor lands on.
  // After that, a small "saved" tab stays in the corner of every page to bring it back.
  // "No thanks" hides both for the rest of the visit. Everything stops once PROMO_ENDS passes.
  var PROMO_ENDS = new Date(2026, 10, 1); // midnight starting November 1, 2026
  var base = (document.currentScript && document.currentScript.src || '').replace(/main\.js.*$/, '');
  var store = function (key, val) {
    try {
      if (val === undefined) return sessionStorage.getItem(key);
      sessionStorage.setItem(key, val);
    } catch (e) { return null; }
  };
  if (new Date() < PROMO_ENDS && store('laserDeal') !== 'dismissed') {
    var now = new Date();
    var daysLeft = Math.ceil((PROMO_ENDS - now) / 86400000);
    var countdown = daysLeft <= 1 ? 'Last day!' : 'Ends in ' + daysLeft + ' days';
    var promo = document.createElement('div');
    promo.className = 'promo';
    promo.innerHTML =
      '<div class="promo-card" role="dialog" aria-modal="true" aria-labelledby="promo-title">' +
        '<button class="promo-close" type="button" aria-label="Close">&times;</button>' +
        '<div class="promo-photo">' +
          '<img src="' + base + 'offer-hero.jpg" alt="Laser hair removal on a client\u2019s legs" width="720" height="1020">' +
          '<p class="promo-ribbon">October only &middot; ' + countdown + '</p>' +
          '<p class="promo-badge"><span>20%</span>off</p>' +
        '</div>' +
        '<div class="promo-body">' +
          '<h2 class="promo-title" id="promo-title">Smooth skin season is here. <em>Treat yourself.</em></h2>' +
          '<p class="promo-text">Good on any 4, 8 or 12 session laser hair removal package. No more razor bumps, no more waxing appointments.</p>' +
          '<a class="btn btn-leaf promo-cta" data-book="consult" href="' + bookLink('consult') + '">Claim my offer <span class="promo-arrow" aria-hidden="true">&rarr;</span></a>' +
          '<p class="promo-how">Book your free consult and mention this offer.</p>' +
          '<div class="promo-links">' +
            '<a class="promo-link" href="' + base + 'laser-hair-removal#prices">See package prices</a>' +
            '<button class="promo-skip" type="button">No thanks</button>' +
          '</div>' +
          '<p class="promo-fine">Offer ends October 31. Subject to change.</p>' +
        '</div>' +
      '</div>';
    promo.hidden = true;
    document.body.appendChild(promo);

    var tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'promo-tab';
    tab.hidden = true;
    tab.innerHTML = '<span class="promo-tab-dot" aria-hidden="true"></span>Your 20% off is saved';
    document.body.appendChild(tab);

    var lastFocus = null;
    var onKey = function (e) { if (e.key === 'Escape') closePromo(); };
    var openPromo = function () {
      lastFocus = document.activeElement;
      tab.hidden = true;
      promo.hidden = false;
      document.addEventListener('keydown', onKey);
      requestAnimationFrame(function () {
        promo.classList.add('is-open');
        promo.querySelector('.promo-close').focus();
      });
    };
    var closePromo = function (dismiss) {
      promo.classList.remove('is-open');
      document.removeEventListener('keydown', onKey);
      setTimeout(function () { promo.hidden = true; }, 250);
      if (dismiss) {
        store('laserDeal', 'dismissed');
      } else {
        tab.hidden = false;
      }
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    promo.addEventListener('click', function (e) {
      if (e.target.closest('.promo-skip')) closePromo(true);
      else if (e.target === promo || e.target.closest('.promo-close')) closePromo();
    });
    tab.addEventListener('click', openPromo);

    if (store('laserDeal') === 'seen') {
      tab.hidden = false;
    } else {
      store('laserDeal', 'seen');
      openPromo();
    }
  }

  // Price finder. Prices come from her price sheet; update them here.
  var list = document.getElementById('area-list');
  var panel = document.getElementById('finder-panel');
  if (!list || !panel) return;

  var TIERS = {
    xs: { name: 'Extra-small area', covers: 'the upper lip, chin, sideburns, forehead, fingers or toes', p4: '$120', p8: '$230', p12: '$350', per: '$29', single: '$40' },
    s:  { name: 'Small area', covers: 'the full face, basic bikini, underarms or areola', p4: '$215', p8: '$420', p12: '$635', per: '$53', single: '$65' },
    m:  { name: 'Medium area', covers: 'the upper arms, forearms, upper or lower back, chest, abdomen, full face with front and back of neck, or Brazilian', p4: '$280', p8: '$530', p12: '$810', per: '$68', single: '$85' },
    l:  { name: 'Large area', covers: 'full arms, full chest and abdomen, full back, full butt, upper legs and knees, or lower legs and knees', p4: '$310', p8: '$590', p12: '$900', per: '$75', single: '$100' },
    xl: { name: 'Extra-large area', covers: 'full legs: upper legs, knees, lower legs front and back, feet and toes', p4: '$560', p8: '$1,075', p12: '$1,600', per: '$133', single: '$160' },
    fb: { name: 'Full body', covers: 'every area, head to toe', p4: '$1,700', p8: '$3,000', p12: '$4,700', per: '$392', single: '$550' }
  };

  var PICK_ONE = 'you can add one of: upper lip, chin, sideburns, areolas, or hands and fingers.';

  var AREAS = [
    { name: 'Upper lip', tier: 'xs', note: 'Gray or light hairs here respond better to electrolysis. Your consult will tell you which.', offer: 'First visit? The upper lip is included in the $499 unlimited year.' },
    { name: 'Chin', tier: 'xs', note: 'Gray or light hairs here respond better to electrolysis. Your consult will tell you which.', offer: 'First visit? The chin is included in the $499 unlimited year.' },
    { name: 'Full face', tier: 's', note: 'Covers the cheeks, sideburns, upper lip and chin.', offer: 'The $499 year covers the upper lip, chin and sideburns, but not the full face.' },
    { name: 'Face and neck', tier: 'm', note: 'Full face plus the front and back of the neck. Keeps a beard line sharp and cuts down razor bumps.', offer: 'The $499 year can cover the front or back of the neck plus one face area, like the chin.' },
    { name: 'Underarms', tier: 's', note: 'One of the quickest areas to treat, and a common first area for new clients.', offer: 'First visit? Underarms qualify for the $499 year, and ' + PICK_ONE },
    { name: 'Full arms', tier: 'l', note: 'Upper arms or forearms on their own are priced as a medium area.', offer: 'The $499 year covers the lower arms only.' },
    { name: 'Full back', tier: 'l', note: 'Upper or lower back on its own is priced as a medium area.', offer: 'The $499 year covers the lower center back only.' },
    { name: 'Basic bikini', tier: 's', note: 'Clears the edge of the bikini line, where razor bumps are most common.', offer: 'First visit? The bikini line qualifies for the $499 year, and ' + PICK_ONE },
    { name: 'Brazilian', tier: 'm', note: 'Covers the full bikini area.', offer: 'First visit? The Brazilian qualifies for the $499 year on its own.' },
    { name: 'Full legs', tier: 'xl', note: 'Upper and lower legs, front and back, including knees, feet and toes.', offer: 'Legs aren\u2019t part of the $499 year.' },
    { name: 'Full body', tier: 'fb', note: 'Every area, head to toe, in one visit.', offer: 'Full body isn\u2019t part of the $499 year.' }
  ];

  var fields = {};
  panel.querySelectorAll('[data-f]').forEach(function (el) { fields[el.getAttribute('data-f')] = el; });
  var bookArea = panel.querySelector('a[data-book]');

  function show(i) {
    var a = AREAS[i];
    var t = TIERS[a.tier];
    fields.name.textContent = a.name;
    fields.tier.textContent = t.name;
    fields.covers.textContent = t.covers;
    fields.single.textContent = t.single;
    fields.p4.textContent = t.p4;
    fields.p8.textContent = t.p8;
    fields.p12.textContent = t.p12;
    fields.per.textContent = t.per;
    fields.note.textContent = a.note;
    fields.offer.textContent = a.offer;
    if (bookArea) {
      bookArea.setAttribute('data-book', 'laser-' + a.tier);
      bookArea.href = bookLink('laser-' + a.tier);
    }
    list.querySelectorAll('.area-btn').forEach(function (b) {
      b.setAttribute('aria-pressed', Number(b.getAttribute('data-area')) === i ? 'true' : 'false');
    });
  }

  list.innerHTML = AREAS.map(function (a, i) {
    return '<li><button class="area-btn" type="button" data-area="' + i + '" aria-pressed="false">' + a.name + '</button></li>';
  }).join('');

  list.addEventListener('click', function (e) {
    var btn = e.target.closest('.area-btn');
    if (btn) show(Number(btn.getAttribute('data-area')));
  });

  show(4);
})();

// Pause buttons for the looping videos. Videos stay still for visitors who ask for reduced motion.
// Videos below the top of the page (data-src) only download when they're about to scroll into
// view, and every video pauses while it's off screen, which keeps phones fast and saves data.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PAUSE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
  var PLAY = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';
  var onScreen = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) {
        if (reduce) return;
        if (!v.getAttribute('src') && v.dataset.src) v.src = v.dataset.src;
        if (v.paused && !v.dataset.userPaused) {
          var playing = v.play();
          if (playing && playing.catch) playing.catch(function () {});
        }
      } else if (!v.paused) {
        v.pause();
      }
    });
  }, { rootMargin: '300px 0px' }) : null;

  document.querySelectorAll('video[autoplay]').forEach(function (v) {
    var host = v.parentElement;
    if (!host.matches('.hero-frame, .result, .about-video')) {
      host = document.createElement('div');
      host.className = 'vid-wrap';
      v.parentNode.insertBefore(host, v);
      host.appendChild(v);
    }
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'vid-ctl' + (v.classList.contains('leaf-rev') ? ' vid-ctl--right' : '');
    host.appendChild(btn);
    var sync = function () {
      var paused = v.paused;
      btn.innerHTML = paused ? PLAY : PAUSE;
      btn.setAttribute('aria-label', paused ? 'Play video' : 'Pause video');
    };
    btn.addEventListener('click', function () {
      if (v.paused) {
        if (!v.getAttribute('src') && v.dataset.src) v.src = v.dataset.src;
        delete v.dataset.userPaused;
        v.play();
      } else {
        v.dataset.userPaused = '1';
        v.pause();
      }
    });
    v.addEventListener('play', sync);
    v.addEventListener('pause', sync);
    if (reduce) { v.autoplay = false; v.pause(); }
    sync();
    if (onScreen) onScreen.observe(v);
    else if (!reduce && !v.getAttribute('src') && v.dataset.src) v.src = v.dataset.src;
  });
})();

// Phone-only folds: long homepage sections open with a button.
(function () {
  var phone = window.matchMedia('(max-width: 720px)');
  var makeBtn = function (label, target, after, open) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-outline fold-btn';
    btn.textContent = label;
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', target.id);
    after.parentNode.insertBefore(btn, after.nextSibling);
    btn.addEventListener('click', function () {
      open();
      btn.remove();
    });
  };
  document.querySelectorAll('[data-fold]').forEach(function (el) {
    el.classList.add('is-folded');
    makeBtn(el.getAttribute('data-fold'), el, el.previousElementSibling || el, function () { el.classList.remove('is-folded'); });
  });
  document.querySelectorAll('[data-fold-after]').forEach(function (grid) {
    var keep = Number(grid.getAttribute('data-fold-after'));
    var extra = Array.prototype.slice.call(grid.children, keep);
    if (!extra.length) return;
    extra.forEach(function (c) { c.classList.add('is-folded-item'); });
    makeBtn(grid.getAttribute('data-fold-label'), grid, grid, function () {
      extra.forEach(function (c) { c.classList.remove('is-folded-item'); });
      var first = extra[0].querySelector('img, video');
      if (first && phone.matches) { first.setAttribute('tabindex', '-1'); first.focus({ preventScroll: true }); }
    });
  });
})();

// Gentle reveal: columns, cards and photos rise into place as they scroll into view.
// Groups of cards arrive one after another. The top of each page, and anything already
// on screen when the page opens, stays put. Off for visitors who ask for reduced motion.
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var GROUPS = '.results > *, .menu-group, .steps > li, .faq-list > *, .cross-links > *, ' +
    '.service-row, .offer-card, .price-box, .creds > li, .services > *';
  var items = [].slice.call(document.querySelectorAll('main .section ' + GROUPS.split(', ').join(', main .section ')));
  var columns = [].slice.call(document.querySelectorAll('main .section > .wrap > *')).filter(function (col) {
    return !items.some(function (it) { return col.contains(it); });
  });
  var targets = columns.concat(items).filter(function (el) {
    return !el.closest('.page-hero, .hero') && el.getBoundingClientRect().top > window.innerHeight;
  });

  var seen = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      seen.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });

  targets.forEach(function (el) {
    var siblings = [].slice.call(el.parentElement.children).filter(function (s) { return targets.indexOf(s) > -1; });
    var order = siblings.indexOf(el);
    if (order > 0) el.style.transitionDelay = Math.min(order, 4) * 90 + 'ms';
    if (el.querySelector('img, video') && !el.querySelector('h2, h3, p')) el.classList.add('reveal-media');
    el.classList.add('reveal');
    seen.observe(el);
  });
})();
