(() => {
  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const layers = Array.from(document.querySelectorAll(".particles"));
  if (!layers.length) return;

  const createParticles = () => {
    layers.forEach((layer) => {
      const rawCount = layer.getAttribute("data-count");
      const countAttr = rawCount === null ? Number.NaN : Number(rawCount);
      const count = Number.isFinite(countAttr)
        ? countAttr
        : prefersReducedMotion
          ? 0
          : 26;

      layer.innerHTML = "";
      if (count <= 0) return;

      const fragment = document.createDocumentFragment();
      for (let index = 0; index < count; index += 1) {
        const particle = document.createElement("span");
        particle.className = "bg-particle";

        const size = rand(2, 5);
        particle.style.setProperty("--size", `${size}px`);
        particle.style.left = `${rand(2, 98)}%`;
        particle.style.top = `${rand(2, 98)}%`;

        particle.style.setProperty("--dx", `${rand(-26, 26)}px`);
        particle.style.setProperty("--dy", `${rand(-34, 22)}px`);
        particle.style.setProperty("--dur", `${rand(7, 16)}s`);
        particle.style.setProperty("--delay", `${rand(-16, 0)}s`);
        particle.style.setProperty("--alpha", `${rand(0.28, 0.78)}`);

        fragment.appendChild(particle);
      }

      layer.appendChild(fragment);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createParticles, { once: true });
  } else {
    createParticles();
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }
})();
