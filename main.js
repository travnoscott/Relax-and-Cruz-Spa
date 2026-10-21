// Relax & Cruz Spa. Mobile menu and price finder.

(function () {
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
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      }
    });
  }

  // Homepage intro video: plays muted on load; the button restarts it with sound.
  var intro = document.getElementById('intro-video');
  var sound = document.getElementById('intro-sound');
  if (intro && sound) {
    sound.addEventListener('click', function () {
      if (intro.muted) {
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
  var BOOK = 'https://book.squareup.com/appointments/5c3y8w34fg9goo/location/LR7VH9PK37BJG/services';
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
          '<img src="' + base + 'images/offer-hero.jpg" alt="Laser hair removal on a client\u2019s legs" width="720" height="1020">' +
          '<p class="promo-ribbon">October only &middot; ' + countdown + '</p>' +
          '<p class="promo-badge"><span>20%</span>off</p>' +
        '</div>' +
        '<div class="promo-body">' +
          '<h2 class="promo-title" id="promo-title">Smooth skin season is here. <em>Treat yourself.</em></h2>' +
          '<p class="promo-text">Good on any 4, 8 or 12 session laser hair removal package. No more razor bumps, no more waxing appointments.</p>' +
          '<a class="btn btn-leaf promo-cta" href="' + BOOK + '">Claim my offer <span class="promo-arrow" aria-hidden="true">&rarr;</span></a>' +
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
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PAUSE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
  var PLAY = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';
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
      if (v.paused) { v.play(); } else { v.pause(); }
    });
    v.addEventListener('play', sync);
    v.addEventListener('pause', sync);
    if (reduce) { v.autoplay = false; v.pause(); }
    sync();
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
