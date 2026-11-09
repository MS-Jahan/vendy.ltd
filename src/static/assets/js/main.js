/* Vendy Ltd — small progressive enhancements. Pages work without this file. */
(function () {
  "use strict";

  /* Old one-page links (/#products, /#resources) now live on their own pages */
  if (window.location.pathname === "/") {
    var oldHash = window.location.hash;
    if (oldHash === "#products") window.location.replace("/products/");
    else if (oldHash === "#resources" || oldHash === "#resouces") window.location.replace("/resources/");
  }

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* Model picker: the lineup, index tabs and compare table all switch the one visible datasheet.
     Without JS every datasheet stays visible and the links jump to them. */
  var sheets = document.querySelectorAll(".datasheet");
  if (sheets.length) {
    var picks = document.querySelectorAll("[data-pick]");
    var rows = document.querySelectorAll("[data-row]");
    var productsEl = document.getElementById("products");

    var select = function (id, scroll) {
      var found = false;
      sheets.forEach(function (sheet) {
        var on = sheet.id === id;
        sheet.hidden = !on;
        if (on) found = true;
      });
      if (!found) return false;
      picks.forEach(function (link) {
        var on = link.getAttribute("data-pick") === id;
        link.classList.toggle("is-active", on);
        if (on) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
      rows.forEach(function (row) {
        row.classList.toggle("is-active", row.getAttribute("data-row") === id);
      });
      if (scroll && productsEl) productsEl.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      return true;
    };

    picks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var id = link.getAttribute("data-pick");
        var inTabs = !!link.closest(".model-tabs");
        select(id, !inTabs);
        if (window.history && history.replaceState) history.replaceState(null, "", "#" + id);
      });
    });
    rows.forEach(function (row) {
      row.addEventListener("click", function (e) {
        if (e.target.closest("a")) return;
        select(row.getAttribute("data-row"), true);
      });
    });

    var fromHash = window.location.hash.replace("#", "");
    if (!fromHash || !select(fromHash, true)) select(sheets[0].id, false);
  }

  /* Slider: whole posters with a counter and caption. Autoplay pauses on hover, focus, off-screen and via Pause. */
  var slider = document.querySelector("[data-slider]");
  if (slider) {
    var slides = slider.querySelectorAll(".slide");
    var prev = slider.querySelector(".slider-btn.prev");
    var next = slider.querySelector(".slider-btn.next");
    var pauseBtn = slider.querySelector(".slider-pause");
    var dotsWrap = slider.querySelector(".slider-dots");
    var controls = slider.querySelector(".slider-controls");
    var counter = slider.querySelector(".slider-no");
    var caption = slider.querySelector(".slider-caption");
    var current = 0;
    var timer = null;
    var dots = [];
    var userPaused = reduceMotion;
    var visible = true;
    var held = false;

    controls.hidden = false;

    slides.forEach(function (slide, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "slider-dot";
      dot.setAttribute("aria-label", "Show slide " + (i + 1));
      dot.addEventListener("click", function () {
        show(i);
      });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        var active = i === current;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
        dots[i].setAttribute("aria-current", String(active));
      });
      var n = current + 1;
      counter.textContent = "0" + n + " / 0" + slides.length;
      caption.textContent = slides[current].querySelector("img").alt;
    }

    function sync() {
      if (timer) window.clearInterval(timer);
      timer = null;
      if (!userPaused && visible && !held && slides.length > 1) {
        timer = window.setInterval(function () {
          show(current + 1);
        }, 3000);
      }
      pauseBtn.textContent = userPaused ? "Play" : "Pause";
      pauseBtn.setAttribute("aria-pressed", String(userPaused));
    }

    prev.addEventListener("click", function () {
      show(current - 1);
    });
    next.addEventListener("click", function () {
      show(current + 1);
    });
    pauseBtn.addEventListener("click", function () {
      userPaused = !userPaused;
      sync();
    });

    slider.addEventListener("mouseenter", function () { held = true; sync(); });
    slider.addEventListener("mouseleave", function () { held = false; sync(); });
    slider.addEventListener("focusin", function () { held = true; sync(); });
    slider.addEventListener("focusout", function () { held = false; sync(); });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        sync();
      }).observe(slider);
    }

    var startX = null;
    slider.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    slider.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) show(dx < 0 ? current + 1 : current - 1);
    });

    show(0);
    sync();
  }

  /* YouTube facade: swap thumbnail for the player only when clicked */
  document.querySelectorAll("[data-youtube-id]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var frame = document.createElement("iframe");
      frame.src = "https://www.youtube-nocookie.com/embed/" + link.getAttribute("data-youtube-id") + "?autoplay=1&rel=0";
      frame.title = link.getAttribute("data-title") || "Video";
      frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      frame.allowFullscreen = true;
      frame.setAttribute("loading", "lazy");
      link.parentNode.replaceChild(frame, link);
    });
  });
  /* Home: looping muted clips with no gaps. Two YouTube players are stacked.
     The next clip starts playing hidden a few seconds before the current one
     ends, then the two cross-fade. Each clip runs from start to end seconds. */
  var loopBox = document.querySelector("[data-loop-video]");
  if (loopBox && !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
    var clips = [];
    try { clips = JSON.parse(loopBox.getAttribute("data-clips")) || []; } catch (err) { clips = []; }
    if (clips.length > 1) {
      var TAIL = 2;           /* keep playing this long past the clip end so YouTube never shows its ended / replay screen */
      var PREROLL = 6;       /* seconds the next clip plays hidden before the fade */
      var COVER_MS = 4500;    /* first clip stays behind the still image this long */
      var coverTimer = null;
      var targets = loopBox.querySelectorAll(".loop-target");
      var pl = [null, null];
      var isReady = [false, false];
      var front = 0;
      var curIdx = 0;
      var nextIdx = 1;
      var preStarted = false;
      var visible = true;

      ["https://www.youtube-nocookie.com", "https://i.ytimg.com"].forEach(function (href) {
        var l = document.createElement("link");
        l.rel = "preconnect";
        l.href = href;
        document.head.appendChild(l);
      });

      var other = function (n) { return n === 0 ? 1 : 0; };
      var showFront = function () {
        loopBox.querySelectorAll("iframe").forEach(function (f, k) {
          f.classList.toggle("is-front", k === front);
        });
      };

      var startPreroll = function () {
        preStarted = true;
        var back = other(front);
        var c = clips[nextIdx];
        var lead = Math.min(PREROLL, Math.max(1, (clips[curIdx].end - clips[curIdx].start) / 2));
        isReady[back] = false; good[back] = 0; last[back] = -1;
        pl[back].mute();
        pl[back].loadVideoById({
          videoId: c.id,
          startSeconds: Math.max(0, c.start - lead),
          endSeconds: c.end + TAIL
        });
      };

      var swap = function () {
        var old = front;
        front = other(front);
        curIdx = nextIdx;
        nextIdx = (nextIdx + 1) % clips.length;
        preStarted = false;
        showFront();
        setTimeout(function () { isReady[old] = false; good[old] = 0; last[old] = -1; pl[old].stopVideo(); }, 600);
      };

      var last = [-1, -1];
      var good = [0, 0];
      var offSince = [0, 0];

      /* A player counts as "really playing" only when its time advances on two
         checks in a row. If the front one stalls or pauses for >1.2s it is faded
         out, so YouTube's pause / loading UI is never on screen. */
      var watch = function (n) {
        var p = pl[n];
        var st = -2, t = 0;
        try { st = p.getPlayerState(); t = p.getCurrentTime(); } catch (err) { return; }
        if (st === 1) {
          offSince[n] = 0;
          if (t > last[n]) { good[n] += 1; }
          last[n] = t;
        } else {
          good[n] = 0;
          last[n] = -1;
          if (!offSince[n]) { offSince[n] = Date.now(); }
        }
        isReady[n] = good[n] > 1;
      };

      var tick = function () {
        if (!pl[0] || !pl[1] || !pl[0].getPlayerState || !pl[1].getPlayerState) { return; }
        watch(0);
        watch(1);
        if (!visible) { return; }
        var stalled = !isReady[front] && offSince[front] && Date.now() - offSince[front] > 1200;
        loopBox.classList.toggle("is-stalled", !!stalled);
        if (!isReady[front]) {
          if (offSince[front] && pl[front].getPlayerState() !== 3) { try { pl[front].playVideo(); } catch (err) {} }
          return;
        }
        var c = clips[curIdx];
        var t = pl[front].getCurrentTime();
        var lead = Math.min(PREROLL, Math.max(1, (c.end - c.start) / 2));
        if (!preStarted && t >= c.end - lead) { startPreroll(); }
        if (preStarted && t >= c.end - 0.1 && isReady[other(front)]) { swap(); }
      };

      var onState = function (n) {
        return function (e) {
          if (e.data === 1 && n === front && !coverTimer) {
            coverTimer = setTimeout(function () { loopBox.classList.add("is-playing"); }, COVER_MS);
          }
          /* Front clip ended before the next one was ready: switch as soon as it is */
          if (e.data === 0 && n === front) {
            if (!preStarted) { startPreroll(); }
            var wait = setInterval(function () {
              if (isReady[other(front)]) { clearInterval(wait); swap(); }
            }, 100);
          }
        };
      };

      var onErr = function (n) {
        return function () {
          if (n !== front) {
            nextIdx = (nextIdx + 1) % clips.length;
            if (preStarted) { startPreroll(); }
          } else {
            nextIdx = curIdx;
            startPreroll();
          }
        };
      };

      var build = function (n, clip, autoplay) {
        return new window.YT.Player(targets[n], {
          host: "https://www.youtube-nocookie.com",
          width: "100%",
          height: "100%",
          videoId: clip.id,
          playerVars: {
            autoplay: autoplay, mute: 1, controls: 0, disablekb: 1, fs: 0, rel: 0,
            iv_load_policy: 3, modestbranding: 1, playsinline: 1, enablejsapi: 1,
            start: clip.start, end: clip.end + TAIL,
            origin: window.location.origin
          },
          events: {
            onReady: function (e) {
              e.target.mute();
              if (autoplay) { e.target.playVideo(); }
              var fr = e.target.getIframe && e.target.getIframe();
              if (fr) { fr.setAttribute("tabindex", "-1"); fr.setAttribute("title", ""); fr.setAttribute("aria-hidden", "true"); if ("inert" in fr) { fr.inert = true; } }
            },
            onStateChange: onState(n),
            onError: onErr(n)
          }
        });
      };

      window.onYouTubeIframeAPIReady = function () {
        pl[0] = build(0, clips[0], 1);
        pl[1] = build(1, clips[1], 0);
        showFront();
        setInterval(tick, 200);
      };

      /* Pause while the video is off screen */
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          visible = entries[0].isIntersecting;
          if (!pl[front] || !pl[front].pauseVideo) { return; }
          if (visible) { pl[front].playVideo(); } else { pl[front].pauseVideo(); }
        }, { threshold: 0.1 }).observe(loopBox);
      }

      var apiScript = document.createElement("script");
      apiScript.src = "https://www.youtube.com/iframe_api";
      apiScript.async = true;
      document.head.appendChild(apiScript);
    }
  }
})();
