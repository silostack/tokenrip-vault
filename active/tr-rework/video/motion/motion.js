/* ---------------------------------------------------------------------------
   Tokenrip motion layer

   Rules this enforces, so motion never costs the page anything:
   - nothing downloads until the element is near the viewport
   - everything pauses when it scrolls away
   - a clip that 404s (not generated yet) leaves the still in place, silently
   - prefers-reduced-motion short-circuits the whole file
   --------------------------------------------------------------------------- */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  /* Load a video only once it is close to the viewport, play it while visible,
     pause it when it is not. `sources` is [[src, type], ...]. */
  function lazyVideo(video, onReady) {
    var loaded = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          if (!loaded) {
            loaded = true;
            video.querySelectorAll('source[data-src]').forEach(function (s) {
              s.src = s.dataset.src;
            });
            video.load();
          }
          var p = video.play();
          if (p && p.catch) p.catch(function () { /* autoplay refused: still stands */ });
        } else if (loaded) {
          video.pause();
        }
      });
    }, { rootMargin: '300px 0px' });
    io.observe(video);

    video.addEventListener('loadeddata', function () {
      video.classList.add('is-playing');
      if (onReady) onReady();
    }, { once: true });
    video.addEventListener('error', function () {
      // clip missing or undecodable — leave the poster/still showing
      video.classList.remove('is-playing');
      video.style.display = 'none';
    });
  }

  /* 1 · Composite patch bay, with an optional intro that plays once ---------- */
  document.querySelectorAll('.tr-pb').forEach(function (pb) {
    var loop = pb.querySelector('.tr-pb__vid');
    var intro = pb.querySelector('.tr-pb__intro');

    if (loop) lazyVideo(loop, function () { pb.classList.add('is-playing'); });

    if (intro) {
      // the intro ends on the hero still, so the hand-off to the loop is invisible
      var started = false;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting || started) return;
          started = true;
          io.disconnect();
          intro.querySelectorAll('source[data-src]').forEach(function (s) {
            s.src = s.dataset.src;
          });
          intro.load();
          intro.play().then(function () {
            pb.classList.add('is-intro');
          }).catch(function () { intro.remove(); });
          intro.addEventListener('ended', function () {
            pb.classList.remove('is-intro');
            setTimeout(function () { intro.remove(); }, 500);
          });
          intro.addEventListener('error', function () { intro.remove(); });
        });
      }, { threshold: 0.25 });
      io.observe(pb);
    }
  });

  /* 2 · Scroll-scrubbed sequence -------------------------------------------- */
  document.querySelectorAll('.tr-scrub').forEach(function (wrap) {
    var video = wrap.querySelector('video');
    var rail = wrap.querySelector('.tr-scrub__rail i');
    if (!video) return;

    var ready = false, dur = 0, target = 0, current = 0, raf = null;

    video.querySelectorAll('source[data-src]').forEach(function (s) { s.src = s.dataset.src; });
    video.load();
    video.addEventListener('loadedmetadata', function () {
      dur = video.duration || 0;
      ready = dur > 0;
      wrap.classList.add('is-playing');
    });
    video.addEventListener('error', function () { video.style.display = 'none'; });

    /* Progress is driven by how far the section has travelled through the
       viewport, so the reader scrubs the clip with their own scroll. */
    function progress() {
      var r = wrap.getBoundingClientRect();
      var vh = window.innerHeight;
      var span = r.height + vh;
      var p = (vh - r.top) / span;
      return Math.max(0, Math.min(1, p));
    }

    function tick() {
      // ease toward the target so a flicked scroll does not judder the decoder
      current += (target - current) * 0.18;
      if (ready && Math.abs(current - video.currentTime) > 0.012) {
        try { video.currentTime = current; } catch (e) { /* seeking */ }
      }
      if (rail && dur) rail.style.width = (current / dur * 100).toFixed(2) + '%';
      raf = Math.abs(target - current) > 0.004 ? requestAnimationFrame(tick) : null;
    }

    function onScroll() {
      if (!ready) return;
      target = progress() * dur;
      if (!raf) raf = requestAnimationFrame(tick);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          window.addEventListener('scroll', onScroll, { passive: true });
          onScroll();
        } else {
          window.removeEventListener('scroll', onScroll);
        }
      });
    }, { rootMargin: '200px 0px' });
    io.observe(wrap);
  });

  /* 3 · Everything else: glow layers, bands, module loops, the CTA bed ------- */
  document.querySelectorAll(
    '.tr-glow, .tr-band video, .tr-mod-loop video, .tr-cta-bed video'
  ).forEach(function (v) {
    lazyVideo(v, function () { v.classList.add('is-playing'); });
  });
})();
