(() => {
  const config = window.BIO_CONFIG ?? {};

  const body = document.body;
  const cardsRoot = document.getElementById("bio-cards");
  const linksRoot = document.getElementById("bio-links");
  const toast = document.getElementById("bio-toast");

  const avatarEl = document.getElementById("bio-avatar");
  const nameEl = document.getElementById("bio-name");
  const taglineEl = document.getElementById("bio-tagline");
  const statusEl = document.getElementById("bio-status");
  const metaEl = document.getElementById("bio-meta");

  const primaryCtaEl = document.getElementById("bio-primary-cta");
  const themeToggleEl = document.getElementById("bio-theme-toggle");

  const footerBrandEl = document.getElementById("bio-footer-brand");
  const footerNameEl = document.getElementById("bio-footer-name");
  const footerRightEl = document.getElementById("bio-footer-right");
  const yearEl = document.getElementById("bio-year");

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let toastTimeoutId = null;

  init();

  function init() {
    const devAnchors = new Set(["#home", "#about", "#skills", "#portfolio", "#contact"]);
    if (devAnchors.has(window.location.hash)) {
      window.location.replace(`dev.html${window.location.hash}`);
      return;
    }

    hydrateProfile(config.profile);
    hydratePrimaryCta(config.primaryCta);
    renderCards(config.cards);
    renderLinks(config.links);
    hydrateFooter(config.footer);
    initTheme();
    initPointerGlow();
  }

  function hydrateProfile(profile = {}) {
    if (avatarEl && profile.avatar) avatarEl.src = profile.avatar;
    if (nameEl && profile.name) nameEl.textContent = profile.name;
    if (taglineEl && profile.tagline) taglineEl.textContent = profile.tagline;

    const statusText = typeof profile.status === "string" ? profile.status.trim() : "";

    if (statusEl) {
      statusEl.style.display = "none";
      if (statusText) statusEl.textContent = statusText;
    }

    if (metaEl) {
      metaEl.innerHTML = "";
      const items = Array.isArray(profile.meta) ? profile.meta : [];

      const chips = [];
      if (statusText) {
        chips.push({ icon: "fas fa-circle", text: statusText, variant: "status" });
      }
      items
        .filter((item) => item?.enabled !== false)
        .forEach((item) => chips.push(item));

      chips.forEach((item) => metaEl.appendChild(createChip(item)));
    }
  }

  function hydratePrimaryCta(primaryCta = {}) {
    if (!primaryCtaEl) return;
    if (primaryCta.href) primaryCtaEl.href = primaryCta.href;
    if (primaryCta.label) {
      const span = primaryCtaEl.querySelector("span");
      if (span) span.textContent = primaryCta.label;
    }
    if (primaryCta.icon) {
      const iconEl = primaryCtaEl.querySelector("i");
      if (iconEl) iconEl.className = primaryCta.icon;
    }
  }

  function hydrateFooter(footer = {}) {
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
    if (footerBrandEl && footer.brand) footerBrandEl.textContent = footer.brand;
    if (footerNameEl && footer.name) footerNameEl.textContent = footer.name;

    if (footerRightEl) {
      footerRightEl.innerHTML = "";
      const items = Array.isArray(footer.right) ? footer.right : [];
      items.filter((item) => item?.enabled !== false).forEach((item) => {
        const link = createLinkLike(item);
        if (!link) return;
        link.setAttribute("aria-label", item.label ?? "Link");
        link.innerHTML = "";
        const icon = createIcon(item.icon);
        if (icon) link.appendChild(icon);
        footerRightEl.appendChild(link);
      });
    }
  }

  function renderCards(cards) {
    if (!cardsRoot) return;
    cardsRoot.innerHTML = "";
    const items = Array.isArray(cards) ? cards : [];
    items.filter((card) => card?.enabled !== false).forEach((card) => {
      const el = createCard(card);
      if (el) cardsRoot.appendChild(el);
    });
  }

  function renderLinks(links) {
    if (!linksRoot) return;
    linksRoot.innerHTML = "";
    const items = Array.isArray(links) ? links : [];
    items.filter((link) => link?.enabled !== false).forEach((link) => {
      const el = createLinkItem(link);
      if (el) linksRoot.appendChild(el);
    });
  }

  function createCard(card = {}) {
    const accent = card.accent ?? "#8b5cf6";
    const el = createLinkLike(card);
    if (!el) return null;

    el.className = "bio-card";
    el.style.setProperty("--accent", accent);

    const top = document.createElement("div");
    top.className = "bio-card-top";

    const iconWrap = document.createElement("div");
    iconWrap.className = "bio-card-icon";
    const icon = createIcon(card.icon);
    if (icon) iconWrap.appendChild(icon);
    top.appendChild(iconWrap);

    if (card.badge) {
      const badge = document.createElement("span");
      badge.className = "bio-card-badge";
      badge.textContent = card.badge;
      top.appendChild(badge);
    }

    const title = document.createElement("h3");
    title.className = "bio-card-title";
    title.textContent = card.title ?? "Card";

    const desc = document.createElement("p");
    desc.className = "bio-card-desc";
    desc.textContent = card.description ?? "";

    el.appendChild(top);
    el.appendChild(title);
    if (card.description) el.appendChild(desc);

    return el;
  }

  function createLinkItem(link = {}) {
    const accent = link.accent ?? "#8b5cf6";
    const el = createLinkLike(link);
    if (!el) return null;

    el.className = "bio-link";
    el.style.setProperty("--accent", accent);

    const left = document.createElement("div");
    left.className = "bio-link-left";

    const iconWrap = document.createElement("div");
    iconWrap.className = "bio-link-icon";
    const icon = createIcon(link.icon);
    if (icon) iconWrap.appendChild(icon);

    const text = document.createElement("div");
    text.className = "bio-link-text";

    const label = document.createElement("p");
    label.className = "bio-link-label";
    label.textContent = link.label ?? "Link";

    const subtitle = document.createElement("p");
    subtitle.className = "bio-link-subtitle";
    subtitle.textContent = link.subtitle ?? "";

    text.appendChild(label);
    if (link.subtitle) text.appendChild(subtitle);

    left.appendChild(iconWrap);
    left.appendChild(text);

    const right = document.createElement("div");
    right.className = "bio-link-right";

    const kind = document.createElement("span");
    kind.className = "bio-link-kind";
    kind.textContent = link.type === "copy" ? "Copiar" : "Abrir";

    const chevron = document.createElement("i");
    chevron.className = link.type === "copy" ? "fas fa-copy" : "fas fa-arrow-up-right-from-square";
    chevron.setAttribute("aria-hidden", "true");

    right.appendChild(kind);
    right.appendChild(chevron);

    el.appendChild(left);
    el.appendChild(right);

    return el;
  }

  function createChip(item = {}) {
    const chip = document.createElement("span");
    chip.className = item.variant ? `bio-chip bio-chip--${item.variant}` : "bio-chip";
    const icon = createIcon(item.icon);
    if (icon) chip.appendChild(icon);
    const text = document.createElement("span");
    text.textContent = item.text ?? "";
    chip.appendChild(text);
    return chip;
  }

  function createIcon(className) {
    if (!className) return null;
    const icon = document.createElement("i");
    icon.className = className;
    icon.setAttribute("aria-hidden", "true");
    return icon;
  }

  function createLinkLike(item = {}) {
    if (item.type === "copy") {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.addEventListener("click", async () => {
        const value = String(item.value ?? "");
        if (!value) return;
        const ok = await copyText(value);
        showToast(ok ? "Copiado!" : "Não consegui copiar");
      });
      return btn;
    }

    if (!item.href) return null;
    const a = document.createElement("a");
    a.href = item.href;

    const external = isExternalHref(item.href);
    const shouldNewTab = item.newTab ?? external;
    if (shouldNewTab) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    return a;
  }

  function isExternalHref(href = "") {
    return /^(https?:)?\/\//i.test(href) || /^mailto:/i.test(href) || /^tel:/i.test(href);
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // ignore and fallback below
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.style.pointerEvents = "none";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }

  function showToast(message) {
    if (!toast) return;
    if (toastTimeoutId) window.clearTimeout(toastTimeoutId);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimeoutId = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2200);
  }

  function initTheme() {
    if (!themeToggleEl) return;
    const stored = localStorage.getItem("preferredTheme");
    const initialTheme = stored || (body.classList.contains("light-theme") ? "light" : "dark");
    applyTheme(initialTheme);
    themeToggleEl.addEventListener("click", () => {
      const next = body.classList.contains("light-theme") ? "dark" : "light";
      applyTheme(next);
      localStorage.setItem("preferredTheme", next);
    });
  }

  function applyTheme(theme) {
    if (theme === "light") {
      body.classList.remove("dark-theme");
      body.classList.add("light-theme");
      return;
    }

    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
  }

  function initPointerGlow() {
    if (prefersReducedMotion) return;

    let rafId = null;
    let lastX = window.innerWidth * 0.5;
    let lastY = window.innerHeight * 0.2;

    const onMove = (ev) => {
      if (!ev || typeof ev.clientX !== "number") return;
      lastX = ev.clientX;
      lastY = ev.clientY;
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        document.documentElement.style.setProperty("--mx", `${lastX}px`);
        document.documentElement.style.setProperty("--my", `${lastY}px`);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
  }
})();
