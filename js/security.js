(() => {
  if (window.__siteSecurityInitialized) return;
  window.__siteSecurityInitialized = true;

  const imageHrefPattern = /\.(avif|bmp|gif|ico|jpe?g|png|svg|tiff?|webp)(\?.*)?$/i;

  document.addEventListener(
    "contextmenu",
    (event) => {
      if (isImageRelatedTarget(event.target)) {
        event.preventDefault();
      }
    },
    { capture: true }
  );

  document.addEventListener(
    "dragstart",
    (event) => {
      if (isImageElement(event.target)) {
        event.preventDefault();
      }
    },
    { capture: true }
  );

  document.addEventListener(
    "auxclick",
    (event) => {
      if (event.button !== 2) return;
      if (isImageRelatedTarget(event.target)) {
        event.preventDefault();
      }
    },
    { capture: true }
  );

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => hardenDocument());
  } else {
    hardenDocument();
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        hardenSubtree(node);
      });
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  function hardenDocument() {
    hardenSubtree(document);
  }

  function hardenSubtree(root) {
    const images = root instanceof Element && root.matches("img")
      ? [root]
      : Array.from(root.querySelectorAll("img"));

    images.forEach((img) => {
      if (!img.hasAttribute("draggable")) img.setAttribute("draggable", "false");
      if (!img.hasAttribute("referrerpolicy")) img.setAttribute("referrerpolicy", "no-referrer");
    });

    const links = root instanceof Element && root.matches("a[href]")
      ? [root]
      : Array.from(root.querySelectorAll("a[href]"));

    links.forEach((anchor) => {
      const href = (anchor.getAttribute("href") || "").trim();
      const lowerHref = href.toLowerCase();

      if (lowerHref.startsWith("javascript:")) {
        anchor.removeAttribute("href");
        anchor.setAttribute("aria-disabled", "true");
        anchor.tabIndex = -1;
      }

      if (anchor.target === "_blank") {
        const relParts = new Set(
          (anchor.getAttribute("rel") || "")
            .split(/\s+/)
            .map((part) => part.trim())
            .filter(Boolean)
        );
        relParts.add("noopener");
        relParts.add("noreferrer");
        anchor.setAttribute("rel", Array.from(relParts).join(" "));
      }
    });
  }

  function isImageRelatedTarget(target) {
    if (!(target instanceof Element)) return false;
    if (isImageElement(target)) return true;
    const imageAnchor = target.closest("a[href]");
    if (!imageAnchor) return false;
    const href = (imageAnchor.getAttribute("href") || "").trim();
    return imageHrefPattern.test(href);
  }

  function isImageElement(target) {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest("img, picture, svg, canvas"));
  }
})();
