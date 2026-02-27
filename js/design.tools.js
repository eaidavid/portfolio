(() => {
  const body = document.body;
  const isDesignPage = body.classList.contains("design-portfolio");
  const isBioPage = body.classList.contains("bio-body");

  const logosByTool = {
    html: { type: "icon", value: "fab fa-html5" },
    html5: { type: "icon", value: "fab fa-html5" },
    css: { type: "icon", value: "fab fa-css3-alt" },
    css3: { type: "icon", value: "fab fa-css3-alt" },
    javascript: { type: "icon", value: "fab fa-js" },
    react: { type: "icon", value: "fab fa-react" },
    node: { type: "icon", value: "fab fa-node-js" },
    nodejs: { type: "icon", value: "fab fa-node-js" },
    sql: { type: "icon", value: "fas fa-database" },
    tailwind: { type: "icon", value: "fas fa-wind" },
    tailwindcss: { type: "icon", value: "fas fa-wind" },
    git: { type: "icon", value: "fab fa-git-alt" },
    github: { type: "icon", value: "fab fa-github" },
    vscode: { type: "icon", value: "fas fa-code" },
    figma: { type: "icon", value: "fab fa-figma" },
    figjam: { type: "icon", value: "fab fa-figma" },
    photoshop: { type: "image", value: "assets/tools/photoshop.svg" },
    illustrator: { type: "image", value: "assets/tools/illustrator.svg" },
    aftereffects: { type: "image", value: "assets/tools/after-effects.svg" },
    capcut: { type: "image", value: "assets/tools/capcut.svg" },
    typescript: { type: "fallback", value: "TS" }
  };

  const singleToolSelectors = [];
  const toolListSelectors = [];

  if (isDesignPage) {
    singleToolSelectors.push(
      ".tool-pill",
      ".service-chip",
      ".case-modal__panel[data-panel-type='tools'] li"
    );
    toolListSelectors.push(".about-info .info-value[data-key='tools-value']");
  }

  if (!isDesignPage && !isBioPage) {
    singleToolSelectors.push(".portfolio-tech .tech-tag", ".modal-project-tech .tech-tag");
  }

  if (!singleToolSelectors.length && !toolListSelectors.length) return;

  applyToolBranding(document);

  const observer = new MutationObserver((mutations) => {
    let shouldRefresh = false;
    mutations.forEach((mutation) => {
      if (mutation.type === "characterData") shouldRefresh = true;
      if (mutation.type === "childList" && (mutation.addedNodes.length || mutation.removedNodes.length)) {
        shouldRefresh = true;
      }
    });

    if (shouldRefresh) applyToolBranding(document);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  function applyToolBranding(root) {
    singleToolSelectors.forEach((selector) => {
      root.querySelectorAll(selector).forEach((element) => {
        if (!(element instanceof HTMLElement)) return;
        decorateSingleTool(element);
      });
    });

    toolListSelectors.forEach((selector) => {
      root.querySelectorAll(selector).forEach((element) => {
        if (!(element instanceof HTMLElement)) return;
        decorateToolList(element);
      });
    });
  }

  function decorateSingleTool(element) {
    const rawText = (element.dataset.toolLabel || element.textContent || "").trim();
    if (!rawText) return;

    const normalized = normalizeToolName(rawText);
    if (!normalized) return;

    const isAlreadyDecorated =
      element.dataset.toolDecorated === normalized && Boolean(element.querySelector(".tool-pill-logo"));
    if (isAlreadyDecorated) return;

    element.dataset.toolLabel = rawText;
    element.dataset.toolDecorated = normalized;

    const logo = createToolLogo(rawText);
    const label = document.createElement("span");
    label.className = "tool-pill-label";
    label.textContent = rawText;

    element.textContent = "";
    if (element.tagName === "LI") {
      const token = document.createElement("span");
      token.className = "tool-token";
      token.appendChild(logo);
      token.appendChild(label);
      element.appendChild(token);
      return;
    }

    element.classList.add("tool-with-logo");
    element.appendChild(logo);
    element.appendChild(label);
  }

  function decorateToolList(element) {
    if (element.querySelector(".tool-inline-chip")) return;

    const raw = (element.textContent || "").trim();
    if (!raw) return;

    const tools = raw
      .split(/[\u2022|,/;]+/g)
      .map((item) => item.trim())
      .filter(Boolean);

    if (!tools.length) return;

    element.classList.add("tools-inline-list");
    element.textContent = "";

    tools.forEach((tool) => {
      const chip = document.createElement("span");
      chip.className = "tool-inline-chip tool-with-logo";
      chip.appendChild(createToolLogo(tool));

      const label = document.createElement("span");
      label.className = "tool-pill-label";
      label.textContent = tool;
      chip.appendChild(label);

      element.appendChild(chip);
    });
  }

  function createToolLogo(toolName) {
    const normalized = normalizeToolName(toolName);
    const config = logosByTool[normalized] || null;

    const logo = document.createElement("span");
    logo.className = "tool-pill-logo";

    if (config?.type === "image") {
      const img = document.createElement("img");
      img.src = config.value;
      img.alt = "";
      img.decoding = "async";
      img.loading = "lazy";
      img.draggable = false;
      logo.appendChild(img);
      return logo;
    }

    if (config?.type === "icon") {
      const icon = document.createElement("i");
      icon.className = config.value;
      icon.setAttribute("aria-hidden", "true");
      logo.appendChild(icon);
      return logo;
    }

    if (config?.type === "fallback") {
      logo.textContent = String(config.value || "?");
      return logo;
    }

    logo.textContent = toolName[0] ? toolName[0].toUpperCase() : "?";
    return logo;
  }

  function normalizeToolName(value) {
    return value.toLowerCase().replace(/[^a-z0-9]/g, "");
  }
})();
