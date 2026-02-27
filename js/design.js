(() => {
  const config = window.DESIGN_CONFIG ?? {};
  const cases = Array.isArray(config.cases) ? config.cases : [];

  const highlightsBlock = document.getElementById("design-highlights");
  const gridRoot = document.getElementById("case-highlights-grid");

  const modalEl = document.getElementById("caseModal");
  const modalBodyEl = document.getElementById("caseModalBody");

  if (!gridRoot) return;

  const state = {
    lang: getInitialLang(),
    activeCaseId: null,
    lastFocusEl: null
  };

  const uiText = {
    "pt-BR": {
      viewCase: "Ver case",
      problem: "Desafio",
      solution: "Solução",
      deliverables: "Entregáveis",
      tools: "Ferramentas"
    },
    "en-US": {
      viewCase: "View case",
      problem: "Challenge",
      solution: "Solution",
      deliverables: "Deliverables",
      tools: "Tools"
    }
  };

  renderHighlights();
  setupLangObserver();
  setupModalClose();

  function getInitialLang() {
    const stored = localStorage.getItem("preferredLang");
    const htmlLang = document.documentElement.lang;
    return normalizeLang(stored || htmlLang || "pt-BR");
  }

  function normalizeLang(lang) {
    return lang === "en-US" ? "en-US" : "pt-BR";
  }

  function t(key, ...args) {
    const dict = uiText[state.lang] || uiText["pt-BR"];
    const entry = dict[key];
    if (typeof entry === "function") return entry(...args);
    return entry ?? "";
  }

  function isEnabled(item) {
    return item && item.enabled !== false;
  }

  function getLocalized(value) {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value;

    if (typeof value === "object") {
      const direct = value[state.lang];
      if (typeof direct === "string" || Array.isArray(direct)) return direct;
      const fallback = value["pt-BR"];
      if (typeof fallback === "string" || Array.isArray(fallback)) return fallback;
    }

    return "";
  }

  function renderHighlights() {
    const enabledCases = cases.filter(isEnabled);

    if (highlightsBlock) {
      highlightsBlock.hidden = enabledCases.length === 0;
    }

    gridRoot.innerHTML = "";
    if (!enabledCases.length) return;

    const locale = state.lang === "en-US" ? "en" : "pt";
    const sorted = [...enabledCases].sort((a, b) => {
      const featuredDelta = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      if (featuredDelta) return featuredDelta;

      const aTitle = String(getLocalized(a.title) || a.id || "");
      const bTitle = String(getLocalized(b.title) || b.id || "");
      return aTitle.localeCompare(bTitle, locale, { sensitivity: "base" });
    });

    sorted.forEach((item) => {
      const card = createCaseCard(item);
      if (card) gridRoot.appendChild(card);
    });
  }

  function createCaseCard(item) {
    const id = String(item.id || "").trim();
    if (!id) return null;

    const title = String(getLocalized(item.title) || "Case");
    const description = String(getLocalized(item.description) || "");

    const article = document.createElement("article");
    article.className = `portfolio-item case-card${item.featured ? " featured" : ""}`;
    article.dataset.caseId = id;

    const cover = document.createElement("div");
    cover.className = `portfolio-image case-cover${item.cover ? " has-image" : ""}`;

    if (item.cover) {
      const img = document.createElement("img");
      img.src = item.cover;
      img.alt = title;
      img.className = "project-image";
      cover.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.style.height = "100%";
      placeholder.style.background = "rgba(var(--accent-primary-rgb), 0.08)";
      cover.appendChild(placeholder);
    }

    const info = document.createElement("div");
    info.className = "portfolio-info";

    const h3 = document.createElement("h3");
    h3.className = "portfolio-title";
    h3.textContent = title;

    const p = document.createElement("p");
    p.className = "portfolio-description";
    p.textContent = description;

    const tagWrap = document.createElement("div");
    tagWrap.className = "portfolio-tech";
    const tagsList = Array.isArray(item.tags) ? item.tags : [];
    tagsList.slice(0, 4).forEach((tag) => {
      const value = typeof tag === "string" ? tag.trim() : "";
      if (!value) return;
      const chip = document.createElement("span");
      chip.className = "tech-tag";
      chip.textContent = value;
      tagWrap.appendChild(chip);
    });

    const actions = document.createElement("div");
    actions.className = "case-actions";

    const openBtn = document.createElement("button");
    openBtn.type = "button";
    openBtn.className = "btn btn-small btn-outline case-open";
    openBtn.innerHTML = `<i class="fas fa-eye" aria-hidden="true"></i><span>${t("viewCase")}</span>`;
    openBtn.addEventListener("click", () => openCaseModal(id));

    const links = createCaseLinks(item.links);

    actions.appendChild(openBtn);
    if (links) actions.appendChild(links);

    cover.addEventListener("click", () => openCaseModal(id));
    cover.style.cursor = "pointer";

    info.appendChild(h3);
    if (description) info.appendChild(p);
    if (tagWrap.childElementCount) info.appendChild(tagWrap);
    info.appendChild(actions);

    article.appendChild(cover);
    article.appendChild(info);

    return article;
  }

  function createCaseLinks(links) {
    if (!links || typeof links !== "object") return null;

    const candidates = [
      { key: "site", icon: "fas fa-arrow-up-right-from-square", label: "Site" },
      { key: "figma", icon: "fab fa-figma", label: "Figma" },
      { key: "behance", icon: "fab fa-behance", label: "Behance" },
      { key: "dribbble", icon: "fab fa-dribbble", label: "Dribbble" }
    ];

    const entries = candidates
      .map((c) => ({ ...c, href: typeof links[c.key] === "string" ? links[c.key].trim() : "" }))
      .filter((c) => c.href);

    if (!entries.length) return null;

    const wrap = document.createElement("div");
    wrap.className = "case-links";

    entries.forEach((entry) => {
      const a = document.createElement("a");
      a.href = entry.href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "case-link-icon";
      a.setAttribute("aria-label", entry.label);
      a.innerHTML = `<i class="${entry.icon}" aria-hidden="true"></i>`;
      wrap.appendChild(a);
    });

    return wrap;
  }

  function setupModalClose() {
    if (!modalEl) return;
    modalEl.querySelectorAll("[data-case-close]").forEach((el) => {
      el.addEventListener("click", closeCaseModal);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (!modalEl.classList.contains("is-open")) return;
      closeCaseModal();
    });
  }

  function openCaseModal(caseId) {
    if (!modalEl || !modalBodyEl) return;

    const item = cases.find((c) => isEnabled(c) && String(c.id) === String(caseId));
    if (!item) return;

    state.activeCaseId = caseId;
    state.lastFocusEl = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    renderCaseModal(item);

    modalEl.classList.add("is-open");
    modalEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("case-modal-open");

    const closeButton = modalEl.querySelector(".case-modal__close");
    if (closeButton instanceof HTMLElement) closeButton.focus();
  }

  function closeCaseModal() {
    if (!modalEl) return;
    modalEl.classList.remove("is-open");
    modalEl.setAttribute("aria-hidden", "true");
    document.body.classList.remove("case-modal-open");

    if (modalBodyEl) modalBodyEl.innerHTML = "";
    state.activeCaseId = null;

    if (state.lastFocusEl) {
      state.lastFocusEl.focus();
      state.lastFocusEl = null;
    }
  }

  function renderCaseModal(item) {
    if (!modalBodyEl) return;
    modalBodyEl.innerHTML = "";

    const title = String(getLocalized(item.title) || "Case");
    const description = String(getLocalized(item.description) || "");

    if (item.cover) {
      const hero = document.createElement("div");
      hero.className = "case-modal__hero";
      const img = document.createElement("img");
      img.src = item.cover;
      img.alt = title;
      hero.appendChild(img);
      modalBodyEl.appendChild(hero);
    }

    const header = document.createElement("div");
    header.className = "case-modal__header";

    const h3 = document.createElement("h3");
    h3.className = "case-modal__title";
    h3.textContent = title;

    const sub = document.createElement("p");
    sub.className = "case-modal__subtitle";
    sub.textContent = description;

    header.appendChild(h3);
    if (description) header.appendChild(sub);
    modalBodyEl.appendChild(header);

    const grid = document.createElement("div");
    grid.className = "case-modal__grid";

    const left = document.createElement("div");
    const right = document.createElement("div");

    left.appendChild(
      createPanel(t("problem"), String(getLocalized(item.problem) || ""), { kind: "text" })
    );
    left.appendChild(
      createPanel(t("solution"), String(getLocalized(item.solution) || ""), { kind: "text" })
    );

    const deliverables = getLocalized(item.deliverables);
    right.appendChild(
      createPanel(t("deliverables"), deliverables, { kind: "list" })
    );

    const tools = Array.isArray(item.tools) ? item.tools : [];
    right.appendChild(createPanel(t("tools"), tools, { kind: "list", panelType: "tools" }));

    grid.appendChild(left);
    grid.appendChild(right);
    modalBodyEl.appendChild(grid);

    const footer = document.createElement("div");
    footer.className = "case-modal__footer";
    const links = createModalLinks(item.links);
    if (links) footer.appendChild(links);
    if (footer.childElementCount) modalBodyEl.appendChild(footer);
  }

  function createPanel(title, content, options) {
    const panel = document.createElement("section");
    panel.className = "case-modal__panel";
    if (options?.panelType) panel.dataset.panelType = options.panelType;

    const h4 = document.createElement("h4");
    h4.textContent = title;
    panel.appendChild(h4);

    const kind = options?.kind;

    if (kind === "list") {
      const items = Array.isArray(content) ? content : [];
      if (!items.length) return panel;
      const ul = document.createElement("ul");
      items.forEach((value) => {
        const text = typeof value === "string" ? value.trim() : "";
        if (!text) return;
        const li = document.createElement("li");
        li.textContent = text;
        ul.appendChild(li);
      });
      panel.appendChild(ul);
      return panel;
    }

    const p = document.createElement("p");
    p.textContent = typeof content === "string" ? content : "";
    panel.appendChild(p);
    return panel;
  }

  function createModalLinks(links) {
    if (!links || typeof links !== "object") return null;

    const entries = [
      { key: "site", className: "btn btn-primary", icon: "fas fa-arrow-up-right-from-square", label: "Abrir" },
      { key: "figma", className: "btn btn-outline", icon: "fab fa-figma", label: "Figma" },
      { key: "behance", className: "btn btn-outline", icon: "fab fa-behance", label: "Behance" },
      { key: "dribbble", className: "btn btn-outline", icon: "fab fa-dribbble", label: "Dribbble" }
    ]
      .map((entry) => ({
        ...entry,
        href: typeof links[entry.key] === "string" ? links[entry.key].trim() : ""
      }))
      .filter((entry) => entry.href);

    if (!entries.length) return null;

    const wrap = document.createElement("div");
    wrap.style.display = "flex";
    wrap.style.gap = "10px";
    wrap.style.flexWrap = "wrap";

    entries.forEach((entry) => {
      const a = document.createElement("a");
      a.href = entry.href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = entry.className;
      a.innerHTML = `<i class="${entry.icon}" aria-hidden="true"></i><span>${entry.label}</span>`;
      wrap.appendChild(a);
    });

    return wrap;
  }

  function setupLangObserver() {
    const observer = new MutationObserver(() => {
      const nextLang = normalizeLang(document.documentElement.lang);
      if (nextLang === state.lang) return;
      state.lang = nextLang;
      renderHighlights();

      if (state.activeCaseId) {
        const item = cases.find((c) => isEnabled(c) && String(c.id) === String(state.activeCaseId));
        if (item) renderCaseModal(item);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"]
    });
  }
})();
