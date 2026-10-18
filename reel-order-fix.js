(() => {
  if (window.__reelSequenceFixLoaded) return;
  window.__reelSequenceFixLoaded = true;

  const mathVideo = "assets/reel-math-equations.mp4";

  function replaceExactText(root, from, to) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeValue.trim() === from) {
        node.nodeValue = node.nodeValue.replace(from, to);
      }
    }
  }

  function setMathVideo(video) {
    if (!video) return;

    video.removeAttribute("poster");
    const sources = video.querySelectorAll("source");

    if (sources.length) {
      sources.forEach((source) => {
        source.src = mathVideo;
      });
    } else {
      video.src = mathVideo;
    }

    video.preload = "metadata";
    video.load();
  }

  function applyReelFix() {
    if (/reel-05\.html$/i.test(window.location.pathname)) {
      replaceExactText(document.body, "REEL 05", "REEL 04");
      replaceExactText(document.body, "05", "04");
      document.querySelectorAll("video").forEach(setMathVideo);
      return;
    }

    const mathLink = document.querySelector('a[href*="reel-05"]');
    const candidates = document.querySelectorAll(
      ".reel-card, .media-card, .portfolio-card, .work-card, article"
    );
    const card =
      mathLink?.closest(
        ".reel-card, .media-card, .portfolio-card, .work-card, article"
      ) || [...candidates].find((item) => item.textContent.includes("رياضيات"));

    if (!card) return;

    replaceExactText(card, "05", "04");
    card.querySelectorAll("video").forEach(setMathVideo);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyReelFix, { once: true });
  } else {
    applyReelFix();
  }
})();
