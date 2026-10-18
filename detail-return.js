(() => {
  const returnLinks = document.querySelectorAll(
    'a.detail-back[href*="index.html"], a.secondary-btn[href*="index.html"]'
  );
  if (!returnLinks.length) return;

  let isReturning = false;
  const homePath = new URL("./index.html", location.href).pathname;

  const canReturnThroughHistory = () => {
    if (history.length <= 1 || !document.referrer) return false;

    try {
      const previousPage = new URL(document.referrer);
      return previousPage.origin === location.origin && previousPage.pathname === homePath;
    } catch {
      return false;
    }
  };

  returnLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        isReturning
      ) {
        return;
      }

      event.preventDefault();
      isReturning = true;

      const finishReturn = () => {
        if (canReturnThroughHistory()) {
          const targetHref = link.href;
          window.setTimeout(() => {
            if (document.visibilityState === "visible") location.assign(targetHref);
          }, 450);
          history.back();
          return;
        }
        location.assign(link.href);
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        finishReturn();
        return;
      }

      document.body.classList.add("is-returning-home");
      window.setTimeout(finishReturn, 170);
    });
  });

  window.addEventListener("pageshow", () => {
    isReturning = false;
    document.body.classList.remove("is-returning-home");
  });
})();
// Lightweight title interaction for every project/detail page.
(() => {
  const titles = document.querySelectorAll(".detail-shell h1, .detail-shell h2, .detail-shell h3");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const precisePointer = window.matchMedia("(pointer: fine)").matches;

  titles.forEach((title) => {
    title.classList.add("interactive-page-title", "is-title-visible");
    if (
      title.matches(
        "h1, .reel-comparison-heading h2, .edit-breakdown-heading h2, .detail-section-heading h2"
      )
    ) {
      title.classList.add("is-major-site-title");
    }

    if (reduced || !precisePointer) return;

    title.addEventListener("pointermove", (event) => {
      const rect = title.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      title.style.setProperty("--title-pointer-x", `${(x - 0.5) * 4}deg`);
      title.style.setProperty("--title-pointer-y", `${(0.5 - y) * 3}deg`);
      title.style.setProperty("--title-shine-x", `${x * 100}%`);
    });

    title.addEventListener("pointerleave", () => {
      title.style.setProperty("--title-pointer-x", "0deg");
      title.style.setProperty("--title-pointer-y", "0deg");
      title.style.setProperty("--title-shine-x", "50%");
    });
  });
})();