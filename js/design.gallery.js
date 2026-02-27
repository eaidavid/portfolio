(() => {
  const galleryRoot = document.getElementById("design-gallery");
  const emptyEl = document.getElementById("design-gallery-empty");
  const viewport = document.getElementById("design-gallery-viewport");
  const track = document.getElementById("design-gallery-track");
  const counterEl = document.getElementById("design-gallery-counter");

  if (!galleryRoot || !viewport || !track) return;

  const prevBtn = galleryRoot.querySelector("[data-gallery-prev]");
  const nextBtn = galleryRoot.querySelector("[data-gallery-next]");

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const state = {
    index: 0,
    total: 0,
    timerId: null,
    animating: false,
    layoutRafId: null,
    pendingLayout: false
  };

  const sizing = {
    minWidth: 260,
    maxWidth: 680,
    relativeWidth: 0.72,
    defaultRatio: 1
  };

  init();

  async function init() {
    const files = await loadManifest();
    const urls = filesToUrls(files);

    if (!urls.length) {
      galleryRoot.hidden = true;
      if (emptyEl) emptyEl.hidden = false;
      return;
    }

    if (emptyEl) emptyEl.hidden = true;
    galleryRoot.hidden = false;

    buildSlides(urls);
    applySlideSizing();
    bindEvents();
    jumpTo(state.index, false);
    updateCounter();

    if (!prefersReducedMotion) startAuto();
  }

  async function loadManifest() {
    try {
      const url = `posts-design/manifest.json?ts=${Date.now()}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return [];
      const data = await res.json();
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.files)) return data.files;
      return [];
    } catch {
      return [];
    }
  }

  function filesToUrls(files) {
    const list = Array.isArray(files) ? files : [];
    const exts = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif", ".svg"]);

    return list
      .map((value) => (typeof value === "string" ? value.trim() : ""))
      .filter(Boolean)
      .filter((name) => {
        const lower = name.toLowerCase();
        const dot = lower.lastIndexOf(".");
        if (dot < 0) return false;
        return exts.has(lower.slice(dot));
      })
      .map((name) => `posts-design/${encodeURIComponent(name)}`);
  }

  function buildSlides(urls) {
    track.innerHTML = "";
    state.total = urls.length;

    if (state.total === 1) {
      state.index = 0;
      track.appendChild(createSlide(urls[0], 1, 1));
      setNavEnabled(false);
      return;
    }

    const sources = [urls[state.total - 1], ...urls, urls[0]];
    state.index = 1;
    sources.forEach((src, i) => {
      const logical = i === 0 ? state.total : i === sources.length - 1 ? 1 : i;
      track.appendChild(createSlide(src, logical, state.total));
    });

    setNavEnabled(true);
  }

  function createSlide(src, index, total) {
    const slide = document.createElement("div");
    slide.className = "design-gallery__slide";
    slide.dataset.galleryRatio = String(sizing.defaultRatio);
    slide.style.setProperty("--design-gallery-image", `url(\"${src}\")`);

    const img = document.createElement("img");
    img.alt = `Arte ${index} de ${total}`;
    img.loading = "lazy";
    img.decoding = "async";
    img.draggable = false;
    img.className = "design-gallery__img";

    let handled = false;
    const handleLoad = () => {
      if (handled) return;
      handled = true;
      const ratio = getImageRatio(img);
      slide.dataset.galleryRatio = String(ratio);
      applySlideSize(slide, ratio);
      scheduleLayoutUpdate();
    };

    img.addEventListener("load", handleLoad, { once: true });
    img.src = src;
    if (img.complete) handleLoad();

    slide.appendChild(img);
    return slide;
  }

  function bindEvents() {
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        go(-1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        go(1);
      });
    }

    galleryRoot.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    });

    track.addEventListener("transitionend", (e) => {
      if (!e || e.target !== track) return;
      if ("propertyName" in e && e.propertyName !== "transform") return;
      if (state.total <= 1) return;

      if (state.index === 0) {
        state.index = state.total;
        jumpTo(state.index, false);
      } else if (state.index === state.total + 1) {
        state.index = 1;
        jumpTo(state.index, false);
      }

      state.animating = false;
      updateCounter();

      if (state.pendingLayout) {
        state.pendingLayout = false;
        scheduleLayoutUpdate();
      }
    });

    window.addEventListener("resize", () => {
      applySlideSizing();
      jumpTo(state.index, false);
    });

    galleryRoot.addEventListener("pointerenter", stopAuto);
    galleryRoot.addEventListener("pointerleave", startAuto);
    galleryRoot.addEventListener("focusin", stopAuto);
    galleryRoot.addEventListener("focusout", startAuto);
  }

  function setNavEnabled(enabled) {
    if (prevBtn instanceof HTMLElement) prevBtn.hidden = !enabled;
    if (nextBtn instanceof HTMLElement) nextBtn.hidden = !enabled;
    galleryRoot.toggleAttribute("data-has-nav", enabled);
  }

  function jumpTo(index, animate) {
    const translateX = getTranslateXForIndex(index);
    track.classList.toggle("is-animating", Boolean(animate) && !prefersReducedMotion);
    track.style.transform = `translate3d(${translateX}px, 0, 0)`;
    updateSlideStates();
  }

  function go(delta) {
    if (state.total <= 1) return;
    if (state.animating && !prefersReducedMotion) return;

    stopAuto();

    state.animating = true;
    state.index += delta;
    jumpTo(state.index, true);
    updateCounter();

    if (!prefersReducedMotion) startAuto();

    if (prefersReducedMotion) {
      if (state.index === 0) state.index = state.total;
      if (state.index === state.total + 1) state.index = 1;
      jumpTo(state.index, false);
      state.animating = false;
      updateCounter();
    }
  }

  function getTranslateXForIndex(index) {
    const slide = track.children[index];
    if (!(slide instanceof HTMLElement)) return 0;
    const viewportCenter = (viewport.clientWidth || 0) / 2;
    const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
    return viewportCenter - slideCenter;
  }

  function updateSlideStates() {
    const slides = Array.from(track.children);
    slides.forEach((slide, i) => {
      if (!(slide instanceof HTMLElement)) return;
      slide.classList.toggle("is-active", i === state.index);
      slide.classList.toggle("is-prev", i === state.index - 1);
      slide.classList.toggle("is-next", i === state.index + 1);
    });
  }

  function scheduleLayoutUpdate() {
    if (state.animating && !prefersReducedMotion) {
      state.pendingLayout = true;
      return;
    }

    if (state.layoutRafId) return;

    state.layoutRafId = window.requestAnimationFrame(() => {
      state.layoutRafId = null;
      jumpTo(state.index, false);
    });
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function getTargetSlideWidth() {
    const width = (viewport.clientWidth || 0) * sizing.relativeWidth;
    return clamp(width, sizing.minWidth, sizing.maxWidth);
  }

  function getSlideRatio(slide) {
    if (!(slide instanceof HTMLElement)) return sizing.defaultRatio;
    const parsed = Number.parseFloat(slide.dataset.galleryRatio || "");
    if (!Number.isFinite(parsed) || parsed <= 0) return sizing.defaultRatio;
    return parsed;
  }

  function applySlideSize(slide, ratio) {
    if (!(slide instanceof HTMLElement)) return;

    const maxHeight = viewport.clientHeight || 0;
    if (!maxHeight) return;

    const safeRatio = Number.isFinite(ratio) && ratio > 0 ? ratio : sizing.defaultRatio;
    const targetWidth = getTargetSlideWidth();
    const width = Math.max(1, Math.min(targetWidth, maxHeight * safeRatio));
    const height = Math.max(1, width / safeRatio);

    const widthPx = `${width.toFixed(2)}px`;
    const heightPx = `${height.toFixed(2)}px`;

    slide.style.flex = `0 0 ${widthPx}`;
    slide.style.width = widthPx;
    slide.style.height = heightPx;
  }

  function applySlideSizing() {
    const slides = Array.from(track.children);
    slides.forEach((slide) => {
      if (!(slide instanceof HTMLElement)) return;
      applySlideSize(slide, getSlideRatio(slide));
    });
  }

  function getImageRatio(img) {
    if (!(img instanceof HTMLImageElement)) return sizing.defaultRatio;
    const w = img.naturalWidth || 0;
    const h = img.naturalHeight || 0;
    if (!w || !h) return sizing.defaultRatio;
    return w / h;
  }

  function getCurrentLogicalIndex() {
    if (state.total <= 1) return 1;
    if (state.index === 0) return state.total;
    if (state.index === state.total + 1) return 1;
    return state.index;
  }

  function updateCounter() {
    if (!counterEl) return;
    const current = getCurrentLogicalIndex();
    counterEl.textContent = `${current} / ${state.total || 1}`;
  }

  function startAuto() {
    if (prefersReducedMotion) return;
    if (state.total <= 1) return;
    if (state.timerId) return;

    state.timerId = window.setInterval(() => {
      go(1);
    }, 4200);
  }

  function stopAuto() {
    if (!state.timerId) return;
    window.clearInterval(state.timerId);
    state.timerId = null;
  }
})();
