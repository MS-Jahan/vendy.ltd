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
})();
