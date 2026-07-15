/* MACS Cushman Cabin — one small deferred script, progressively enhanced. */
(function () {
  "use strict";

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

  /* Gallery lightbox */
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var lbImg = lightbox.querySelector("img");
    var lbCap = lightbox.querySelector(".lightbox__caption");
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-lightbox]");
      if (btn) {
        var img = btn.querySelector("img");
        lbImg.src = img.dataset.full || img.src;
        lbImg.alt = img.alt;
        lbCap.textContent = img.alt;
        lightbox.showModal();
      }
    });
    lightbox.addEventListener("click", function (e) {
      // click on backdrop or close button dismisses
      if (e.target === lightbox || e.target.closest(".lightbox__close")) lightbox.close();
    });
  }

  /* Declarative analytics: one delegated listener, data-analytics="event_name" */
  function track(name, params) {
    if (typeof window.gtag === "function") window.gtag("event", name, params || {});
  }

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-analytics]");
    if (!el) return;
    var params = {};
    for (var key in el.dataset) {
      if (key !== "analytics" && key.indexOf("analytics") === 0) {
        params[key.replace(/^analytics/, "").toLowerCase()] = el.dataset[key];
      }
    }
    track(el.dataset.analytics, params);
  });

  /* FAQ research signal: fire once per question open (not on close) */
  document.querySelectorAll("details.faq").forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open) track("faq_open", { question: d.querySelector("summary").textContent.trim() });
    });
  });
})();
