const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const hoverTargets = "a, button, input, textarea, .service-card, .work-card, .profile-card";

toggle?.addEventListener("click", () => {
  nav.classList.toggle("open");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

const sections = [...document.querySelectorAll("main section[id], .profile-card[id]")];

const observer = new IntersectionObserver(
  (entries) => {
    if (window.scrollY <= 80) {
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === "#home");
      });
      return;
    }
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: [0.15, 0.35, 0.6] }
);

sections.forEach((section) => observer.observe(section));

const keepHomeActiveAtPageTop = () => {
  if (window.scrollY > 80) return;
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#home");
  });
};

window.addEventListener("scroll", keepHomeActiveAtPageTop, { passive: true });
window.addEventListener("pageshow", keepHomeActiveAtPageTop);
keepHomeActiveAtPageTop();

if (!document.body.classList.contains("performance-lite") && cursorDot && cursorRing && matchMedia("(pointer: fine)").matches) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  let cursorFrame = 0;
  let ringFrame = 0;

  const moveRing = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

    if (Math.abs(mouseX - ringX) > 0.1 || Math.abs(mouseY - ringY) > 0.1) {
      ringFrame = requestAnimationFrame(moveRing);
    } else {
      ringFrame = 0;
    }
  };

  const hideCustomCursor = () => {
    document.body.classList.remove("cursor-ready", "cursor-hover");
    if (cursorFrame) cancelAnimationFrame(cursorFrame);
    if (ringFrame) cancelAnimationFrame(ringFrame);
    cursorFrame = 0;
    ringFrame = 0;
  };

  window.addEventListener("pointermove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    document.body.classList.add("cursor-ready");

    if (!cursorFrame) {
      cursorFrame = requestAnimationFrame(() => {
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        cursorFrame = 0;
      });
    }

    if (!ringFrame) ringFrame = requestAnimationFrame(moveRing);
  }, { passive: true });

  window.addEventListener("pointerout", (event) => {
    if (!event.relatedTarget) hideCustomCursor();
  }, { passive: true });
  document.addEventListener("mouseleave", hideCustomCursor);
  window.addEventListener("blur", hideCustomCursor);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) hideCustomCursor();
  });

  document.querySelectorAll(hoverTargets).forEach((target) => {
    target.addEventListener("pointerenter", () => document.body.classList.add("cursor-hover"));
    target.addEventListener("pointerleave", () => document.body.classList.remove("cursor-hover"));
  });
}

document.querySelectorAll(".work-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (document.body.classList.contains("site-motion-settled")) return;
    const bounds = card.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 7;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -7;
    card.style.setProperty("--tilt-x", `${x}deg`);
    card.style.setProperty("--tilt-y", `${y}deg`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  });
});

document.querySelector("form")?.addEventListener("submit", (event) => {
  const button = event.currentTarget.querySelector("button");
  if (!button) return;
  button.textContent = "Sending...";
  button.dataset.sending = "true";
});
const loadingScreen = document.querySelector(".loading-screen");

if (loadingScreen) {

  const playIntroTitle = () => {
    const title = document.querySelector(".intro-title");
    const titleLines = document.querySelectorAll(".intro-title span");

    document.body.classList.remove("intro-ready");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.add("intro-ready");

        if (!title || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        title.animate(
          [
            {
              opacity: 0,
              transform: "translate3d(0, 26px, 0) scale(0.985)",
              filter: "blur(12px)",
              textShadow: "0 0 0 rgba(169, 76, 255, 0)"
            },
            {
              opacity: 1,
              transform: "translate3d(0, 0, 0) scale(1.012)",
              filter: "blur(0)",
              textShadow: "0 0 34px rgba(169, 76, 255, 0.5)"
            },
            {
              opacity: 1,
              transform: "translate3d(0, 0, 0) scale(1)",
              filter: "blur(0)",
              textShadow: "0 0 18px rgba(37, 183, 255, 0.28)"
            }
          ],
          {
            duration: 1350,
            delay: 100,
            easing: "cubic-bezier(0.16, 0.84, 0.22, 1)",
            fill: "both"
          }
        );

        titleLines.forEach((line, index) => {
          line.animate(
            [
              {
                opacity: 0,
                transform: "translate3d(0, 18px, 0)",
                clipPath: "inset(0 100% 0 0)",
                filter: "blur(10px)"
              },
              {
                opacity: 1,
                transform: "translate3d(0, 0, 0)",
                clipPath: "inset(0 0 0 0)",
                filter: "blur(0)"
              }
            ],
            {
              duration: index === 0 ? 1050 : 1200,
              delay: index === 0 ? 160 : 520,
              easing: "cubic-bezier(0.16, 0.84, 0.22, 1)",
              fill: "both"
            }
          );
        });
      });
    });
  };

  let loadingFinished = false;
  let welcomeSequenceStarted = false;

  const finishLoading = () => {
    if (loadingFinished) return;
    loadingFinished = true;
    document.body.classList.add("loader-done");
    document.body.classList.remove("is-loading");
    window.setTimeout(playIntroTitle, 80);
    window.setTimeout(() => loadingScreen.remove(), 440);

  };

  const playMultilingualWelcome = () => {
    if (welcomeSequenceStarted || loadingFinished) return;
    welcomeSequenceStarted = true;

    if (!window.location.hash) {
      try {
        history.scrollRestoration = "manual";
      } catch {
        // Some browsers do not expose scroll restoration controls.
      }
      window.scrollTo(0, 0);
    }

    loadingScreen.classList.add("welcome-ready");
    const greeting = loadingScreen.querySelector("[data-loading-greeting]");
    const handWrap = loadingScreen.querySelector(".loading-wave-wrap");
    const handImage = handWrap?.querySelector("img");

    const startWelcomeWave = () => {
      if (!handWrap) return;
      handWrap.classList.remove("is-waving");
      void handWrap.offsetWidth;
      handWrap.classList.add("is-waving");
      loadingScreen.classList.add("welcome-motion-live");

      if (!handImage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const startedAt = performance.now();
      const duration = 2250;
      const pivotX = 62;
      const pivotY = 84;

      handImage.style.setProperty("transform-origin", `${pivotX}% ${pivotY}%`, "important");
      handImage.style.setProperty("will-change", "transform, filter", "important");

      const animateHand = (now) => {
        const elapsed = now - startedAt;
        const progress = Math.min(1, elapsed / duration);
        const entrance = Math.min(1, progress / 0.18);
        const easedEntrance = 1 - Math.pow(1 - entrance, 3);
        const waveProgress = Math.max(0, progress - 0.08);
        const damping = 1 - progress * 0.34;
        const rotation = Math.sin(waveProgress * Math.PI * 9) * 18 * damping;
        const lift = -Math.abs(Math.sin(waveProgress * Math.PI * 4.5)) * 5;
        const sway = Math.sin(waveProgress * Math.PI * 9) * 4.5 * damping;
        const scale = 0.76 + easedEntrance * 0.24 + Math.sin(waveProgress * Math.PI * 9) * 0.012;
        const entryX = -22 * (1 - easedEntrance);
        const entryY = 22 * (1 - easedEntrance);

        handImage.style.setProperty(
          "transform",
          `translate3d(${(entryX + sway).toFixed(2)}px, ${(entryY + lift).toFixed(2)}px, 0) rotate(${rotation.toFixed(2)}deg) scale(${scale.toFixed(3)})`,
          "important"
        );

        if (progress < 1 && document.documentElement.contains(handImage)) {
          requestAnimationFrame(animateHand);
          return;
        }

        handImage.style.setProperty(
          "transform",
          "translate3d(0, 0, 0) rotate(0deg) scale(1)",
          "important"
        );
        handImage.style.removeProperty("will-change");
        handWrap.classList.add("wave-complete");
      };

      requestAnimationFrame(animateHand);
    };

    if (handImage?.complete) {
      requestAnimationFrame(() => requestAnimationFrame(startWelcomeWave));
    } else {
      handImage?.addEventListener("load", startWelcomeWave, { once: true });
    }
    if (!greeting) {
      window.setTimeout(finishLoading, 900);
      return;
    }

    const greetingCandidates = [
      { word: "مرحبًا", language: "ar", direction: "rtl", hold: 480 },
      { word: "Hello", language: "en", direction: "ltr", hold: 170 },
      { word: "Bonjour", language: "fr", direction: "ltr", hold: 180 },
      { word: "Hola", language: "es", direction: "ltr", hold: 160 },
      { word: "Hallo", language: "de", direction: "ltr", hold: 170 },
      { word: "Olá", language: "pt", direction: "ltr", hold: 170 },
      { word: "你好", language: "zh", direction: "ltr", hold: 180 },
      { word: "नमस्ते", language: "hi", direction: "ltr", hold: 200 }
    ];

    const seenLanguages = new Set();
    const seenWords = new Set();
    const greetings = greetingCandidates.filter(({ word, language }) => {
      const languageKey = language.trim().toLowerCase();
      const wordKey = word.trim().toLocaleLowerCase();

      if (seenLanguages.has(languageKey) || seenWords.has(wordKey)) return false;

      seenLanguages.add(languageKey);
      seenWords.add(wordKey);
      return true;
    });

    const firstGreeting = greetings[0];
    greeting.textContent = firstGreeting.word;
    greeting.lang = firstGreeting.language;
    greeting.dir = firstGreeting.direction;
    greeting.dataset.direction = firstGreeting.direction;

    let index = 1;

    const showGreeting = () => {
      const current = greetings[index];
      if (!current) {
        window.setTimeout(finishLoading, firstGreeting.hold);
        return;
      }

      greeting.classList.add("is-changing");

      window.setTimeout(() => {
        greeting.textContent = current.word;
        greeting.lang = current.language;
        greeting.dir = current.direction;
        greeting.dataset.direction = current.direction;
        greeting.classList.remove("is-changing");

        if (index < greetings.length - 1) {
          index += 1;
          window.setTimeout(showGreeting, current.hold);
        } else {
          window.setTimeout(finishLoading, current.hold);
        }
      }, 70);
    };

    window.setTimeout(showGreeting, firstGreeting.hold);
  };

  if (document.documentElement.classList.contains("welcome-seen")) {
    document.body.classList.add("loader-done");
    document.body.classList.remove("is-loading");
    loadingScreen.remove();
  } else {
    if (document.readyState === "complete") {
      playMultilingualWelcome();
    } else {
      window.addEventListener("load", playMultilingualWelcome, { once: true });
    }

    window.setTimeout(finishLoading, 3200);
  }
}

window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;
  document.documentElement.classList.add("welcome-seen");
  document.body.classList.add("loader-done");
  document.body.classList.remove("is-loading");
  document.querySelector(".loading-screen")?.remove();
});

// Make reel cards open their video links from any click area and replay the intro headline motion.
(() => {
  const openReelFromCard = (card) => {
    const link = card.querySelector(".watch-link");
    if (!link?.href) return;
    window.location.assign(link.href);
  };

  document.querySelectorAll(".reel-preview").forEach((card) => {
    card.classList.add("reel-card-clickable");
    card.setAttribute("role", "link");
    card.setAttribute("tabindex", "0");

    card.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      openReelFromCard(card);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openReelFromCard(card);
    });
  });

  const replayIntroHeadline = () => {
    const title = document.querySelector(".intro-title");
    if (!title || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.body.classList.remove("intro-force-animate");
    void title.offsetWidth;
    document.body.classList.add("intro-force-animate");
  };

  window.addEventListener("load", () => {
    window.setTimeout(replayIntroHeadline, 420);
    window.setTimeout(replayIntroHeadline, 2450);
  });
})();

// First reel opens its local detail page from the whole card.
(() => {
  const firstReel = document.querySelector(".reel-grid .reel-preview:first-child");
  if (!firstReel) return;

  const openLocalReel = (event) => {
    if (event.target.closest("a")) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign("./reel-01.html");
  };

  firstReel.addEventListener("click", openLocalReel, true);
  firstReel.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign("./reel-01.html");
  }, true);
})();


// Keep local reel cards in the same tab.
(() => {
  const thirdReel = document.querySelector(".reel-grid .reel-preview:nth-child(3)");
  if (!thirdReel) return;

  const openLocalReel = (event) => {
    if (event.target.closest("a")) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign("./reel-03.html");
  };

  thirdReel.addEventListener("click", openLocalReel, true);
  thirdReel.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign("./reel-03.html");
  }, true);
})();
// Open the second reel in the current tab, like the rest of the portfolio.
(() => {
  const secondReel = document.querySelector(".reel-grid .reel-preview:nth-child(2)");
  if (!secondReel) return;

  const openLocalReel = (event) => {
    if (event.target.closest("a")) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign("./reel-02.html");
  };

  secondReel.addEventListener("click", openLocalReel, true);
  secondReel.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign("./reel-02.html");
  }, true);
})();









// Smooth hero background parallax for the opening section.
(() => {
  const hero = document.querySelector('.intro-screen');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let raf = 0;
  let targetX = 0;
  let targetY = 0;

  const render = () => {
    hero.style.setProperty('--hero-mouse-x', `${targetX}px`);
    hero.style.setProperty('--hero-mouse-y', `${targetY}px`);
    raf = 0;
  };

  hero.addEventListener('pointermove', (event) => {
    if (document.body.classList.contains('site-motion-settled')) return;
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    targetX = Math.max(-1, Math.min(1, x * 2)) * 14;
    targetY = Math.max(-1, Math.min(1, y * 2)) * 10;
    if (!raf) raf = requestAnimationFrame(render);
  }, { passive: true });

  hero.addEventListener('pointerleave', () => {
    targetX = 0;
    targetY = 0;
    if (!raf) raf = requestAnimationFrame(render);
  }, { passive: true });
})();

// Hero entrance is handled once by the lightweight cleanHeroEnter controller.
// Coordinated hero intro: welcome hand -> three-line headline reveal -> CTA arrow loop.
(() => {
  const hero = document.querySelector(".intro-screen");
  const title = document.querySelector(".intro-title");
  const label = document.querySelector(".intro-label");
  const subtitle = document.querySelector(".intro-subtitle");
  const cta = document.querySelector('.intro-inner > a[href="#about"]');
  if (!hero || !title || !cta) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const set = (el, prop, value) => el?.style.setProperty(prop, value, "important");

  const ensureThreeLines = () => {
    const desired = ["Motion Graphics", "That Make People", "Stop Scrolling"];
    const current = [...title.querySelectorAll("span")].map((span) => span.textContent.trim());
    if (current.length === 3 && desired.every((text, index) => current[index] === text)) return;
    title.innerHTML = desired.map((text) => `<span>${text}</span>`).join("");
  };

  const hideBeforeHand = () => {
    document.body.classList.remove("hero-intro-sequence-done", "hero-cta-arrow-live");
    ensureThreeLines();
    [label, title, subtitle, cta, ...title.querySelectorAll("span")].forEach((el) => {
      set(el, "opacity", "0");
      set(el, "visibility", "hidden");
      set(el, "transform", "translate3d(0, 18px, 0) scale(0.985)");
      set(el, "filter", "blur(10px)");
      set(el, "transition", "none");
    });
  };

  const reveal = () => {
    ensureThreeLines();
    const lines = [...title.querySelectorAll("span")];
    document.body.classList.add("hero-intro-sequence-done");

    [label, title, subtitle, cta, ...lines].forEach((el) => {
      if (!el) return;
      el.style.removeProperty("transition");
      set(el, "visibility", "visible");
    });

    if (reduced) {
      [label, title, subtitle, cta, ...lines].forEach((el) => {
        set(el, "opacity", "1");
        set(el, "transform", "none");
        set(el, "filter", "none");
      });
      return;
    }

    label?.animate(
      [
        { opacity: 0, transform: "translate3d(0, 12px, 0) scale(.98)", filter: "blur(8px)" },
        { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)", filter: "blur(0) drop-shadow(0 0 16px rgba(169,76,255,.28))" }
      ],
      { duration: 560, delay: 80, easing: "cubic-bezier(0.16, 0.84, 0.22, 1)", fill: "both" }
    );

    set(title, "opacity", "1");
    set(title, "visibility", "visible");
    set(title, "filter", "none");
    set(title, "transform", "none");

    lines.forEach((line, index) => {
      line.animate(
        [
          { opacity: 0, transform: "translate3d(0, 24px, 0) scale(.965)", filter: "blur(14px) drop-shadow(0 0 0 rgba(169,76,255,0))", clipPath: "inset(100% 0 0 0)", backgroundPosition: "0% 50%" },
          { opacity: 1, transform: "translate3d(0, -3px, 0) scale(1.012)", filter: "blur(0) drop-shadow(0 0 34px rgba(169,76,255,.42)) drop-shadow(0 0 22px rgba(37,183,255,.2))", clipPath: "inset(0 0 0 0)", backgroundPosition: "100% 50%" },
          { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)", filter: "blur(0) drop-shadow(0 0 18px rgba(37,183,255,.28))", clipPath: "inset(0 0 0 0)", backgroundPosition: "62% 50%" }
        ],
        { duration: 820, delay: 260 + index * 310, easing: "cubic-bezier(0.16, 0.84, 0.22, 1)", fill: "both" }
      );
    });

    subtitle?.animate(
      [
        { opacity: 0, transform: "translate3d(0, 14px, 0)", filter: "blur(8px)" },
        { opacity: .92, transform: "translate3d(0, 0, 0)", filter: "blur(0)" }
      ],
      { duration: 680, delay: 1320, easing: "cubic-bezier(0.16, 0.84, 0.22, 1)", fill: "both" }
    );

    const ctaEntrance = cta.animate(
      [
        { opacity: 0, transform: "translate3d(0, 30px, 0) scale(.84)", filter: "blur(12px) brightness(.78)", boxShadow: "0 0 0 rgba(169,76,255,0)" },
        { opacity: 1, transform: "translate3d(0, -9px, 0) scale(1.09)", filter: "blur(0) brightness(1.12)", boxShadow: "0 0 42px rgba(169,76,255,.58), 0 0 34px rgba(37,183,255,.4), inset 0 0 24px rgba(255,255,255,.12)" },
        { opacity: 1, transform: "translate3d(0, 4px, 0) scale(.98)", filter: "blur(0) brightness(1.02)", boxShadow: "0 0 26px rgba(169,76,255,.36), 0 0 22px rgba(37,183,255,.2), inset 0 0 18px rgba(37,183,255,.12)" },
        { opacity: 1, transform: "translate3d(0, -2px, 0) scale(1.025)", filter: "blur(0) brightness(1.06)", boxShadow: "0 0 34px rgba(169,76,255,.46), 0 0 28px rgba(37,183,255,.3), inset 0 0 20px rgba(255,255,255,.08)" },
        { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)", filter: "blur(0) brightness(1)", boxShadow: "0 0 24px rgba(169,76,255,.34), 0 0 20px rgba(37,183,255,.16), inset 0 0 18px rgba(37,183,255,.12)" }
      ],
      { duration: 1050, delay: 1600, easing: "cubic-bezier(0.16, 0.84, 0.22, 1)", fill: "both" }
    );

    ctaEntrance.finished.then(() => {
      ctaEntrance.cancel();
      cta.classList.add("hero-cta-attention-ready");
    }).catch(() => {});

    window.setTimeout(() => document.body.classList.add("hero-cta-arrow-live"), 2650);
  };

  hideBeforeHand();

  window.addEventListener("load", () => {
    const started = performance.now();
    const wait = () => {
      const handDone = document.body.classList.contains("loader-done") || !document.querySelector(".loading-screen") || performance.now() - started > 4300;
      if (handDone) {
        window.setTimeout(reveal, 320);
        return;
      }
      window.setTimeout(wait, 70);
    };
    wait();
  });
})();

// Creative Toolbox: lightweight stats animation and local parallax
(() => {
  const section = document.querySelector('.creative-toolbox');
  if (!section) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const counters = [...section.querySelectorAll('.toolbox-stats b[data-count]')];

  const setFinalValues = () => {
    counters.forEach((counter) => {
      counter.textContent = counter.dataset.count || '0';
    });
  };

  if (reduceMotion) {
    setFinalValues();
  } else if ('IntersectionObserver' in window && counters.length) {
    let played = false;
    const animateCounters = () => {
      if (played) return;
      played = true;
      const duration = 1100;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        counters.forEach((counter) => {
          const target = Number(counter.dataset.count || 0);
          counter.textContent = String(Math.round(target * eased));
        });

        if (progress < 1) requestAnimationFrame(tick);
        else setFinalValues();
      };

      requestAnimationFrame(tick);
    };

    const statObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          animateCounters();
          statObserver.disconnect();
        }
      },
      { threshold: 0.32 }
    );

    statObserver.observe(section);
  } else {
    setFinalValues();
  }

  if (!reduceMotion) {
    section.addEventListener('pointermove', (event) => {
      if (document.body.classList.contains('site-motion-settled')) return;
      const rect = section.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 18;
      section.style.setProperty('--tool-parallax-x', `${x.toFixed(2)}px`);
      section.style.setProperty('--tool-parallax-y', `${y.toFixed(2)}px`);
    });

    section.addEventListener('pointerleave', () => {
      section.style.setProperty('--tool-parallax-x', '0px');
      section.style.setProperty('--tool-parallax-y', '0px');
    });
  }
})();

// Services cards: lightweight pointer-based 3D tilt
(() => {
  const cards = [...document.querySelectorAll('.services-panel .service-card')];
  if (!cards.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  cards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (document.body.classList.contains('site-motion-settled')) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 9;
      const rotateX = (0.5 - y) * 7;

      card.style.setProperty('--service-tilt-x', `${rotateX.toFixed(2)}deg`);
      card.style.setProperty('--service-tilt-y', `${rotateY.toFixed(2)}deg`);
      card.style.setProperty('--service-glow-x', `${(x * 100).toFixed(1)}%`);
      card.style.setProperty('--service-glow-y', `${(y * 100).toFixed(1)}%`);
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--service-tilt-x', '0deg');
      card.style.setProperty('--service-tilt-y', '0deg');
      card.style.setProperty('--service-glow-x', '50%');
      card.style.setProperty('--service-glow-y', '50%');
    });
  });
})();

// Visual Identity gallery tabs
(() => {
  const galleries = document.querySelectorAll('[data-identity-gallery]');
  if (!galleries.length) return;

  galleries.forEach((gallery) => {
    const tabs = Array.from(gallery.querySelectorAll('[data-gallery-tab]'));
    const panels = Array.from(gallery.querySelectorAll('[data-gallery-panel]'));

    const activate = (key) => {
      tabs.forEach((tab) => {
        const active = tab.dataset.galleryTab === key;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      panels.forEach((panel) => {
        panel.classList.toggle('is-active', panel.dataset.galleryPanel === key);
      });
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab.dataset.galleryTab));
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();

        let nextIndex = index;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabs.length - 1;

        tabs[nextIndex].focus();
        activate(tabs[nextIndex].dataset.galleryTab);
      });
    });
  });
})();


// Play AI videos inside their cards on hover while keeping the initial page load light.
(() => {
  const cards = [...document.querySelectorAll(".ai-video-list .ai-video-card")];
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  // Portfolio previews stay poster-only; the full video loads after opening the project.
  const allowHeavyHoverPreviews = false;
  if (!allowHeavyHoverPreviews) return;
  let activeVideo = null;

  const stopPreview = (card, reset = true) => {
    const video = card.querySelector("video.ai-hover-preview");
    if (!video) return;

    video.pause();
    if (reset) {
      try {
        video.currentTime = 0;
      } catch (_) {
        // The source may still be loading; pausing is enough in that case.
      }
    }
    card.classList.remove("is-previewing");
    if (activeVideo === video) activeVideo = null;
  };

  const startPreview = async (card) => {
    if (!canHover.matches || document.hidden) return;
    const video = card.querySelector("video.ai-hover-preview");
    if (!video) return;

    if (activeVideo && activeVideo !== video) {
      const activeCard = activeVideo.closest(".ai-video-card");
      if (activeCard) stopPreview(activeCard);
    }

    if (!video.src) {
      video.src = video.dataset.previewSrc || "";
      if (!video.src) return;
      video.load();
    }

    activeVideo = video;
    try {
      await video.play();
      if (!card.matches(":hover") && !card.contains(document.activeElement)) {
        stopPreview(card);
        return;
      }
      card.classList.add("is-previewing");
    } catch (_) {
      card.classList.remove("is-previewing");
    }
  };

  cards.forEach((card) => {
    card.addEventListener("pointerenter", () => startPreview(card), { passive: true });
    card.addEventListener("pointerleave", () => stopPreview(card), { passive: true });
    card.addEventListener("focusin", () => startPreview(card));
    card.addEventListener("focusout", () => stopPreview(card));
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden || !activeVideo) return;
    const activeCard = activeVideo.closest(".ai-video-card");
    if (activeCard) stopPreview(activeCard, false);
  });
})();

// Reviews carousel: edit all review content here.
(() => {
  const carousel = document.querySelector("[data-reviews-carousel]");
  const track = document.querySelector("[data-reviews-track]");
  if (!carousel || !track) return;

  // Reel/video reviews use the original Testat artwork supplied for this portfolio.
  const companyLogo = "./assets/images/review-testat-original.png";
  const ar = (hex) => hex.split(" ").map((part) => String.fromCodePoint(parseInt(part, 16))).join("");

  const reviews = [
    {
      type: "reel",
      name: ar("062a 0633 062a 0627 062a"),
      role: ar("0641 0631 064a 0642 0020 062a 0633 062a 0627 062a"),
      company: ar("062a 0633 062a 0627 062a"),
      logo: companyLogo,
      logoStyle: "testat",
      logoInitials: ar("062a"),
      rating: 5,
      badge: ar("0645 0648 0646 062a 0627 062c 0020 0631 064a 0644 0632"),
      thumbnail: "./assets/reel-before-after.png",
      rtl: true,
      text: ar("0645 0648 0646 062a 0627 062c 0020 0645 0645 062a 0627 0632 0020 0648 0633 0631 064a 0639 060c 0020 0648 0627 0644 0646 0635 0648 0635 0020 0648 0627 0636 062d 0629 060c 0020 0648 0627 0644 062a 0633 0644 064a 0645 0020 0641 064a 0020 0627 0644 0645 0639 0627 062f 0020 0628 062c 0648 062f 0629 0020 0639 0627 0644 064a 0629 002e")
    },
    {
      type: "reel",
      name: ar("062a 0633 062a 0627 062a"),
      role: ar("0641 0631 064a 0642 0020 062a 0633 062a 0627 062a"),
      company: ar("062a 0633 062a 0627 062a"),
      logo: companyLogo,
      logoStyle: "testat",
      logoInitials: ar("062a"),
      rating: 5,
      badge: ar("062a 062d 0631 064a 0631 0020 0641 064a 062f 064a 0648"),
      thumbnail: "./assets/reel-morstan.jpeg",
      rtl: true,
      text: ar("0627 0644 0641 064a 062f 064a 0648 0647 0627 062a 0020 0627 0644 0646 0647 0627 0626 064a 0629 0020 0643 0627 0646 062a 0020 0645 0631 062a 0628 0629 0020 0648 0645 0646 0627 0633 0628 0629 0020 0644 0644 0645 0646 0635 0629 002e")
    },
    {
      type: "reel",
      name: ar("062a 0633 062a 0627 062a"),
      role: ar("0641 0631 064a 0642 0020 062a 0633 062a 0627 062a"),
      company: ar("062a 0633 062a 0627 062a"),
      logo: companyLogo,
      logoStyle: "testat",
      logoInitials: ar("062a"),
      rating: 5,
      badge: ar("0631 064a 0644 0632 0020 062a 0639 0644 064a 0645 064a 0629"),
      thumbnail: "./assets/ai-listening-reading-thumb.png",
      rtl: true,
      text: ar("0627 0644 0643 0627 0628 0634 0646 0020 0648 0627 0636 062d 0020 0648 0627 0644 062d 0631 0643 0629 0020 0645 0631 064a 062d 0629 0020 0648 0627 0644 0634 063a 0644 0020 0627 062d 062a 0631 0627 0641 064a 002e")
    },
    {
      type: "reel",
      name: ar("062a 0633 062a 0627 062a"),
      role: ar("0641 0631 064a 0642 0020 062a 0633 062a 0627 062a"),
      company: ar("062a 0633 062a 0627 062a"),
      logo: companyLogo,
      logoStyle: "testat",
      logoInitials: ar("062a"),
      rating: 5,
      badge: ar("0635 0646 0627 0639 0629 0020 0645 062d 062a 0648 0649"),
      thumbnail: "./assets/reel-badr.png",
      rtl: true,
      text: ar("0627 0644 0641 0643 0631 0629 0020 0637 0644 0639 062a 0020 0628 0634 0643 0644 0020 062c 0630 0627 0628 0020 0648 0633 0644 0633 0020 064a 062e 062f 0645 0020 0627 0644 0645 062d 062a 0648 0649 0020 0627 0644 062a 0639 0644 064a 0645 064a 002e")
    },
    {
      type: "ai",
      name: ar("062a 0642 064a 064a 0645 0020 0645 0633 062a 0642 0644"),
      role: ar("0631 0633 0627 0644 0629 0020 0627 0644 0639 0645 064a 0644"),
      company: ar("0641 064a 062f 064a 0648 0020 0041 0049 0020 002d 0020 0628 0646 0643 0020 0627 0644 0631 064a 0627 0636"),
      logo: "./assets/review-mostaql-logo.png",
      logoStyle: "mostaql",
      logoInitials: ar("0645"),
      tone: "cyan",
      rating: 5,
      badge: ar("062a 0642 064a 064a 0645 0020 0645 0633 062a 0642 0644"),
      thumbnail: "./assets/ai-riyad-bank-thumb-final.png",
      rtl: true,
      text: ar("062a 0645 0020 062a 0646 0641 064a 0630 0020 0627 0644 0645 0634 0631 0648 0639 0020 0628 0646 062c 0627 062d 061b 0020 0634 063a 0644 0020 0645 0645 062a 0627 0632 0020 0648 062a 0639 0627 0648 0646 0020 0648 062c 0648 062f 0629 0020 0628 0627 0644 0639 0645 0644 002e")
    },
    {
      type: "post",
      name: "Omar Khaled",
      role: "Marketing Specialist",
      company: "Pixel House",
      avatarInitials: "OK",
      tone: "cyan",
      rating: 5,
      badge: "SOCIAL MEDIA DESIGN",
      thumbnail: "./assets/orovex-portfolio-card.png",
      text: "The post designs were consistent, modern, and perfectly matched our brand identity."
    },
    {
      type: "post",
      name: "Sara Adel",
      role: "Content Manager",
      company: "Creative Hub",
      avatarInitials: "SA",
      tone: "violet",
      rating: 5,
      badge: "POST DESIGN",
      thumbnail: "./assets/dental-post.jpg",
      text: "Every design was clear, visually strong, and ready to publish without extra revisions."
    },
    {
      type: "post",
      name: "Youssef Nabil",
      role: "Brand Coordinator",
      company: "Orovex Studio",
      avatarInitials: "YN",
      tone: "blue",
      rating: 5,
      badge: "CREATIVE DESIGN",
      thumbnail: "./assets/orovex-main-ad.jpg",
      text: "The visuals balanced product clarity with a bold creative look, making the campaign feel more premium."
    },
    {
      type: "post",
      name: "Mona Tarek",
      role: "Social Media Lead",
      company: "Infinity Care",
      avatarInitials: "MT",
      tone: "pink",
      rating: 5,
      badge: "POST DESIGN",
      thumbnail: "./assets/infinity-hydration-ad.png",
      text: "The posts had clean hierarchy, strong color choices, and a style that immediately improved our feed."
    },
    {
      type: "post",
      name: "Kareem Hassan",
      role: "Growth Marketer",
      company: "Urban Pixel",
      avatarInitials: "KH",
      tone: "indigo",
      rating: 5,
      badge: "SOCIAL MEDIA DESIGN",
      thumbnail: "./assets/jacket-post.jpeg",
      text: "Ahmed delivered creative layouts that felt polished, easy to read, and aligned with the campaign goals."
    }
  ];

  const escapeHtml = (value) => String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));

  const buildIdentity = (review) => {
    if (review.logo) {
      const logoStyle = review.logoStyle ? ` review-logo-frame-${escapeHtml(review.logoStyle)}` : "";
      return `
        <div class="review-avatar review-logo-frame${logoStyle}">
          <img src="${escapeHtml(review.logo)}" alt="${escapeHtml(review.company)} logo" loading="lazy" />
          <span>${escapeHtml(review.logoInitials || review.name.slice(0, 2))}</span>
        </div>`;
    }

    return `<div class="review-avatar review-initials" data-tone="${escapeHtml(review.tone || "violet")}" aria-hidden="true">${escapeHtml(review.avatarInitials)}</div>`;
  };

  const buildCard = (review, index, duplicate = false) => {
    const card = document.createElement("article");
    card.className = `review-card review-card-${review.type}${review.rtl ? " review-card-rtl" : ""}`;
    card.setAttribute("role", "listitem");
    if (duplicate) {
      card.setAttribute("aria-hidden", "true");
      card.tabIndex = -1;
    } else {
      card.tabIndex = 0;
      card.setAttribute("aria-label", `${review.name} review, ${review.rating} stars`);
      if (review.rtl) card.dir = "rtl";
    }

    card.innerHTML = `
      <div class="review-quote" aria-hidden="true">“</div>
      <div class="review-head">
        ${buildIdentity(review)}
        <div class="review-person">
          <h3>${escapeHtml(review.name)}</h3>
          <p>${escapeHtml(review.role)}</p>
          <span>${escapeHtml(review.company)}</span>
        </div>
        ${review.thumbnail ? `<img class="review-thumb" src="${escapeHtml(review.thumbnail)}" alt="${escapeHtml(review.badge)} project thumbnail" loading="lazy" />` : ""}
      </div>
      <div class="review-rating" aria-label="${review.rating} out of 5 stars"><span aria-hidden="true">★★★★★</span><b>${Number(review.rating).toFixed(1)}</b></div>
      <p class="review-text">${escapeHtml(review.text)}</p>
      <span class="review-badge">${escapeHtml(review.badge)}</span>
    `;

    card.querySelectorAll(".review-logo-frame img").forEach((img) => {
      img.addEventListener("error", () => {
        img.hidden = true;
        img.parentElement?.classList.add("is-fallback");
      }, { once: true });
    });

    card.style.setProperty("--review-index", index);
    return card;
  };

  const renderReviews = () => {
    const fragment = document.createDocumentFragment();
    reviews.forEach((review, index) => fragment.appendChild(buildCard(review, index, false)));
    reviews.forEach((review, index) => fragment.appendChild(buildCard(review, index, true)));
    track.replaceChildren(fragment);
  };

  renderReviews();


  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let offset = 0;
  let halfWidth = 0;
  let lastTime = performance.now();
  let paused = false;
  let dragging = false;
  let startX = 0;
  let startOffset = 0;
  let lastX = 0;
  let lastMoveTime = 0;
  let momentum = 0;
  let carouselVisible = false;
  let carouselFrame = 0;
  const speed = window.matchMedia("(max-width: 640px)").matches ? 34 : 52;
  let cardSlide = null;

  const measure = () => {
    const cards = track.querySelectorAll(".review-card");
    halfWidth = cards.length > 1 ? cards[cards.length / 2].offsetLeft - cards[0].offsetLeft : 0;
    normalizeOffset();
  };

  const normalizeOffset = () => {
    if (!halfWidth) return;
    while (offset <= -halfWidth) offset += halfWidth;
    while (offset > 0) offset -= halfWidth;
  };

  const applyTransform = () => {
    track.style.setProperty("transform", `translate3d(${offset}px, 0, 0)`, "important");
  };

  const animate = (time) => {
    carouselFrame = 0;
    if (!carouselVisible || document.hidden) return;

    const delta = Math.min(40, time - lastTime);
    lastTime = time;

    if (!cardSlide && !reduceMotion && !paused && !dragging) {
      offset -= (speed * delta) / 1000;
    }

    if (cardSlide) {
      const progress = Math.min(1, (time - cardSlide.start) / 360);
      const eased = 1 - Math.pow(1 - progress, 3);
      offset = cardSlide.from + cardSlide.distance * eased;
      if (progress === 1) cardSlide = null;
    }
    if (!cardSlide && !dragging && Math.abs(momentum) > 0.02) {
      offset += momentum * delta;
      momentum *= Math.pow(0.9, delta / 16.67);
    }

    normalizeOffset();
    applyTransform();
    if (cardSlide || dragging || Math.abs(momentum) > 0.02 || (!reduceMotion && !paused)) carouselFrame = requestAnimationFrame(animate);
  };

  const startCarousel = () => {
    if (!carouselVisible || document.hidden || carouselFrame) return;
    lastTime = performance.now();
    carouselFrame = requestAnimationFrame(animate);
  };

  measure();
  applyTransform();
  if ("IntersectionObserver" in window) {
    const carouselObserver = new IntersectionObserver((entries) => {
      carouselVisible = entries.some((entry) => entry.isIntersecting);
      if (!carouselVisible && carouselFrame) {
        cancelAnimationFrame(carouselFrame);
        carouselFrame = 0;
      }
      startCarousel();
    }, { rootMargin: "120px 0px" });
    carouselObserver.observe(carousel);
  } else {
    carouselVisible = true;
    startCarousel();
  }

  document.addEventListener("visibilitychange", startCarousel);
  window.addEventListener("resize", measure, { passive: true });

  carousel.addEventListener("pointerenter", () => { paused = true; });
  carousel.addEventListener("pointerleave", () => { if (!dragging) paused = false; startCarousel(); });
  carousel.addEventListener("focusin", () => { paused = true; });
  carousel.addEventListener("focusout", () => { paused = false; startCarousel(); });

  carousel.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    cardSlide = null;
    dragging = true;
    paused = true;
    startX = event.clientX;
    lastX = event.clientX;
    lastMoveTime = performance.now();
    startOffset = offset;
    momentum = 0;
    startCarousel();
    carousel.classList.add("is-dragging");
    carousel.setPointerCapture?.(event.pointerId);
  });

  carousel.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const now = performance.now();
    const deltaX = event.clientX - lastX;
    const deltaTime = Math.max(8, now - lastMoveTime);
    momentum = deltaX / deltaTime;
    offset = startOffset + (event.clientX - startX);
    lastX = event.clientX;
    lastMoveTime = now;
    normalizeOffset();
    applyTransform();
  });

  const endDrag = (event) => {
    if (!dragging) return;
    dragging = false;
    paused = false;
    momentum = Math.max(-1.2, Math.min(1.2, momentum));
    carousel.classList.remove("is-dragging");
    carousel.releasePointerCapture?.(event.pointerId);
  };

  carousel.addEventListener("pointerup", endDrag);
  carousel.addEventListener("pointercancel", endDrag);

  const slideByCard = (direction) => {
    const firstCard = track.querySelector(".review-card");
    if (!firstCard) return;
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
    const distance = -direction * (firstCard.getBoundingClientRect().width + gap);
    if (!reduceMotion) {
      cardSlide = {from:offset, distance, start:performance.now()};
      momentum = 0;
      startCarousel();
      return;
    }
    offset += distance;
    momentum = 0;
    normalizeOffset();
    applyTransform();
  };

  carousel.querySelector("[data-review-prev]")?.addEventListener("click", () => slideByCard(-1));
  carousel.querySelector("[data-review-next]")?.addEventListener("click", () => slideByCard(1));

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") slideByCard(-1);
    if (event.key === "ArrowRight") slideByCard(1);
  });
})();

// Subtle section depth parallax for decorative empty-space details.
(() => {
  if (document.body.classList.contains("performance-lite")) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let frame = null;

  const update = () => {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    document.body.style.setProperty("--decor-parallax-x", `${currentX.toFixed(2)}px`);
    document.body.style.setProperty("--decor-parallax-y", `${currentY.toFixed(2)}px`);

    if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
      frame = requestAnimationFrame(update);
    } else {
      frame = null;
    }
  };

  window.addEventListener("pointermove", (event) => {
    if (document.body.classList.contains("site-motion-settled")) return;
    targetX = ((event.clientX / window.innerWidth) - 0.5) * 26;
    targetY = ((event.clientY / window.innerHeight) - 0.5) * 22;
    if (!frame) frame = requestAnimationFrame(update);
  }, { passive: true });
})();




// Hero CTA magnetic premium interaction
(() => {
  const cta = document.querySelector('.intro-screen .intro-inner > a[href="#about"]');
  if (!cta || cta.dataset.magneticCtaReady === 'true') return;
  cta.dataset.magneticCtaReady = 'true';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const strength = 0.16;
  const resetMagnet = () => {
    cta.classList.remove('is-magnetic-hover');
    cta.style.setProperty('--hero-cta-magnetic-x', '0px');
    cta.style.setProperty('--hero-cta-magnetic-y', '0px');
  };

  cta.addEventListener('pointermove', (event) => {
    const rect = cta.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * strength;
    const y = (event.clientY - rect.top - rect.height / 2) * strength;
    cta.classList.add('is-magnetic-hover');
    cta.style.setProperty('--hero-cta-magnetic-x', `${x.toFixed(2)}px`);
    cta.style.setProperty('--hero-cta-magnetic-y', `${y.toFixed(2)}px`);
  }, { passive: true });

  cta.addEventListener('pointerleave', resetMagnet, { passive: true });
  cta.addEventListener('blur', resetMagnet);

  cta.addEventListener('click', (event) => {
    const rect = cta.getBoundingClientRect();
    const hasPointerPosition = event.clientX !== 0 || event.clientY !== 0;
    const rippleX = hasPointerPosition ? event.clientX - rect.left : rect.width / 2;
    const rippleY = hasPointerPosition ? event.clientY - rect.top : rect.height / 2;
    const ripple = document.createElement('span');
    ripple.className = 'hero-cta-ripple';
    ripple.style.setProperty('--ripple-x', `${rippleX}px`);
    ripple.style.setProperty('--ripple-y', `${rippleY}px`);
    cta.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 760);
  });
})();
// Open social profiles in their installed mobile apps, with a web fallback.
(() => {
  const appLinks = document.querySelectorAll("a[data-app-link]");
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!isMobile || !appLinks.length) return;

  appLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const webUrl = link.href;
      const appUrl = isIOS && link.dataset.iosAppLink ? link.dataset.iosAppLink : link.dataset.appLink;
      if (!appUrl) {
        window.location.assign(webUrl);
        return;
      }

      let appOpened = false;
      const detectAppOpen = () => {
        if (document.hidden) appOpened = true;
      };

      document.addEventListener("visibilitychange", detectAppOpen);
      window.location.href = appUrl;
      window.setTimeout(() => {
        document.removeEventListener("visibilitychange", detectAppOpen);
        if (!appOpened) window.location.assign(webUrl);
      }, 1200);
    });
  });
})();
// Keep the primary hero CTA visible as soon as the opening screen clears.
// Older headline sequences may write temporary inline hiding styles; release
// only those properties so the final CSS hover, glow and magnetic motion stay active.
(() => {
  const cta = document.querySelector(
    'section#home.intro-screen .intro-inner > a.explore-portfolio-btn[href="#about"]'
  );
  if (!cta) return;

  const controlledProperties = [
    'opacity',
    'visibility',
    'transform',
    'filter',
    'transition',
    'pointer-events',
    'box-shadow'
  ];

  let releasing = false;
  const releaseCta = () => {
    if (releasing) return;
    releasing = true;

    controlledProperties.forEach((property) => {
      if (cta.style.getPropertyValue(property)) {
        cta.style.removeProperty(property);
      }
    });

    releasing = false;
  };

  releaseCta();

  const inlineStyleGuard = new MutationObserver(releaseCta);
  inlineStyleGuard.observe(cta, {
    attributes: true,
    attributeFilter: ['style']
  });

  window.addEventListener('load', releaseCta, { once: true });
  window.setTimeout(releaseCta, 0);
  window.setTimeout(releaseCta, 900);
  window.setTimeout(releaseCta, 2100);
  window.setTimeout(() => {
    releaseCta();
    inlineStyleGuard.disconnect();
  }, 4500);
})();
// Direct, header-safe scroll from both portfolio CTAs to the Reels section.
(() => {
  const triggers = [
    ...document.querySelectorAll(
      '.hero .actions .primary-btn[href="#reels"], section#home.intro-screen .intro-portfolio-cta[href="#reels"]'
    )
  ];
  const reels = document.querySelector('#reels');
  if (!triggers.length || !reels) return;

  const getDestinationY = () => {
    const topbar = document.querySelector('.topbar');
    const headerBottom = topbar
      ? Math.max(0, topbar.getBoundingClientRect().bottom)
      : 72;
    const safeOffset = Math.ceil(Math.max(96, headerBottom + 24));

    return Math.max(
      0,
      reels.getBoundingClientRect().top + window.scrollY - safeOffset
    );
  };

  const finishScroll = () => {
    const destinationY = getDestinationY();
    window.scrollTo({ top: destinationY, behavior: 'auto' });
    history.replaceState(history.state, '', '#reels');
    reels.classList.add('is-work-arrival');

    try {
      sessionStorage.setItem(
        `ahmedPortfolioScroll:${location.pathname}`,
        String(Math.round(destinationY))
      );
    } catch {
      // Storage can be unavailable in restricted browser modes.
    }

    window.setTimeout(() => reels.classList.remove('is-work-arrival'), 420);
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      finishScroll();

      // Correct after layout/paint so the section always clears the fixed header.
      window.requestAnimationFrame(() => window.requestAnimationFrame(finishScroll));
    });
  });
})();
// Pointer depth interaction for the profile image and biography card.
(() => {
  const card = document.querySelector('.hero .profile-card');
  if (!card || !window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const updateProfileDepth = (event) => {
    if (document.body.classList.contains("site-motion-settled")) return;
    const rect = card.getBoundingClientRect();
    const normalizedX = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const normalizedY = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    const rotateY = (normalizedX - 0.5) * 5.5;
    const rotateX = (0.5 - normalizedY) * 4.5;

    card.style.setProperty('--profile-pointer-x', `${(normalizedX * 100).toFixed(1)}%`);
    card.style.setProperty('--profile-pointer-y', `${(normalizedY * 100).toFixed(1)}%`);
    card.style.setProperty('--profile-tilt-x', `${rotateX.toFixed(2)}deg`);
    card.style.setProperty('--profile-tilt-y', `${rotateY.toFixed(2)}deg`);
    card.classList.add('is-profile-active');
  };

  const resetProfileDepth = () => {
    card.style.setProperty('--profile-pointer-x', '72%');
    card.style.setProperty('--profile-pointer-y', '28%');
    card.style.setProperty('--profile-tilt-x', '0deg');
    card.style.setProperty('--profile-tilt-y', '0deg');
    card.classList.remove('is-profile-active');
  };

  card.addEventListener('pointermove', updateProfileDepth, { passive: true });
  card.addEventListener('pointerleave', resetProfileDepth, { passive: true });
})();
// Interactive section titles: staggered reveal and subtle pointer response.
(() => {
  const selector = [
    "main h1",
    "main h2",
    "main h3",
    "main .identity-copy > h2",
    "main .ai-showcase-content > h2",
    "main .toolbox-copy > h2",
    "main .reviews-heading > h2",
    "main .contact-copy > h2",
    ".site-footer h2"
  ].join(",");

  const titles = [...new Set(document.querySelectorAll(selector))];
  if (!titles.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const titleRevealPrefix = `ahmedPortfolioTitleReveal:${location.pathname}`;
  const wasTitleRevealed = (key) => {
    try {
      return sessionStorage.getItem(key) === "1";
    } catch {
      return false;
    }
  };
  const rememberTitleReveal = (key) => {
    try {
      sessionStorage.setItem(key, "1");
    } catch {
      // Keep the in-page one-time reveal behavior when storage is unavailable.
    }
  };

  titles.forEach((title, index) => {
    const revealKey = `${titleRevealPrefix}:${index}`;
    title.dataset.titleRevealKey = revealKey;
    title.classList.add("interactive-page-title");
    if (title.matches("h1, h2")) title.classList.add("is-major-site-title");
    title.style.setProperty("--title-reveal-delay", `${(index % 3) * 70}ms`);
    if (wasTitleRevealed(revealKey)) title.classList.add("is-title-visible");

    title.addEventListener("pointermove", (event) => {
      if (document.body.classList.contains("site-motion-settled")) return;
      const rect = title.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      title.style.setProperty("--title-pointer-x", `${(x - 0.5) * 5}deg`);
      title.style.setProperty("--title-pointer-y", `${(0.5 - y) * 4}deg`);
      title.style.setProperty("--title-shine-x", `${x * 100}%`);
    });

    title.addEventListener("pointerleave", () => {
      title.style.setProperty("--title-pointer-x", "0deg");
      title.style.setProperty("--title-pointer-y", "0deg");
      title.style.setProperty("--title-shine-x", "50%");
    });
  });

  if (reducedMotion || !("IntersectionObserver" in window)) {
    titles.forEach((title) => title.classList.add("is-title-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-title-visible");
        rememberTitleReveal(entry.target.dataset.titleRevealKey || "");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
  );

  titles.forEach((title) => {
    if (!title.classList.contains("is-title-visible")) observer.observe(title);
  });
})();
// Reels thumbnails: preserve every source ratio with a matching blurred backdrop.
(() => {
  document.querySelectorAll(".reels.section#reels .reel-preview").forEach((card) => {
    const image = card.querySelector(":scope > img:not(.reel-thumb-backdrop)");
    if (!image || card.querySelector(":scope > .reel-thumb-backdrop")) return;

    const backdrop = image.cloneNode(false);
    backdrop.className = "reel-thumb-backdrop";
    backdrop.alt = "";
    backdrop.setAttribute("aria-hidden", "true");
    backdrop.removeAttribute("loading");
    card.insertBefore(backdrop, image);
  });
})();
// Final guaranteed first-visit welcome-hand wave.
(() => {
  const loader = document.querySelector(".loading-screen");
  const handWrap = loader?.querySelector(".loading-wave-wrap");
  const handImage = handWrap?.querySelector("img");

  if (!loader || !handWrap || !handImage || document.documentElement.classList.contains("welcome-seen")) return;

  let started = false;
  let observer;

  const playWelcomeWave = () => {
    if (started || !loader.classList.contains("welcome-ready") || !handImage.complete) return;
    started = true;
    observer?.disconnect();

    handWrap.style.setProperty("animation", "none", "important");
    handImage.style.setProperty("animation", "none", "important");
    handImage.style.setProperty("transform-origin", "62% 84%", "important");
    handImage.style.setProperty("will-change", "transform", "important");

    requestAnimationFrame(() => {
      handWrap.animate(
        [
          { opacity: 0, transform: "translate3d(-22px, 24px, 0) scale(.72) rotate(-14deg)", filter: "blur(10px)" },
          { opacity: 1, transform: "translate3d(4px, -3px, 0) scale(1.07) rotate(3deg)", filter: "blur(0)" },
          { opacity: 1, transform: "translate3d(0, 0, 0) scale(1) rotate(0deg)", filter: "blur(0)" }
        ],
        { duration: 720, easing: "cubic-bezier(.16,.84,.22,1)", fill: "both" }
      );

      handImage.animate(
        [
          { transform: "rotate(0deg) translate3d(0,0,0) scale(1)" },
          { transform: "rotate(20deg) translate3d(7px,-6px,0) scale(1.05)", offset: .18 },
          { transform: "rotate(-15deg) translate3d(-5px,2px,0) scale(1.02)", offset: .38 },
          { transform: "rotate(18deg) translate3d(6px,-4px,0) scale(1.045)", offset: .58 },
          { transform: "rotate(-11deg) translate3d(-3px,1px,0) scale(1.018)", offset: .78 },
          { transform: "rotate(6deg) translate3d(2px,-1px,0) scale(1.025)", offset: .9 },
          { transform: "rotate(0deg) translate3d(0,0,0) scale(1)" }
        ],
        { duration: 610, iterations: 4, delay: 130, easing: "cubic-bezier(.34,0,.22,1)", fill: "both" }
      );
    });
  };

  const startWhenReady = () => {
    if (!loader.classList.contains("welcome-ready")) return;
    if (handImage.complete) playWelcomeWave();
    else handImage.addEventListener("load", playWelcomeWave, { once: true });
  };

  observer = new MutationObserver(startWhenReady);
  observer.observe(loader, { attributes: true, attributeFilter: ["class"] });
  startWhenReady();
})();
// Full-site staggered content reveal for cards, media, icons, controls, and data blocks.
(() => {
  if (!("IntersectionObserver" in window)) return;

  const selectors = [
    "main .hero.section .hero-copy > *",
    "main .hero.section .profile-card",
    "main .services-panel .service-card",
    "main .portfolio .work-card",
    "main .reels .reel-preview",
    "main .identity .identity-split-copy > *",
    "main .identity .identity-split-preview",
    "main .ai-videos .ai-video-card",
    "main .creative-toolbox .toolbox-left",
    "main .creative-toolbox .tool-card",
    "main .creative-toolbox .toolbox-stats > *",
    "main .case-studies .case-study-card",
    "main .reviews .reviews-carousel",
    "main .contact .contact-copy > *",
    "main .contact .contact-links > *",
    ".site-footer .footer-social-kicker",
    ".site-footer .footer-social-link",
    ".site-footer .footer-quick-links > *",
    ".site-footer .footer-signature"
  ].join(",");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const historyReturnPending = document.documentElement.classList.contains("history-return-pending");
  const contentRevealPrefix = `ahmedPortfolioContentReveal:${location.pathname}`;
  const wasContentRevealed = (key) => {
    try {
      return sessionStorage.getItem(key) === "1";
    } catch {
      return false;
    }
  };
  const rememberContentReveal = (key) => {
    try {
      sessionStorage.setItem(key, "1");
    } catch {
      // The observer still guarantees one reveal during the current page lifetime.
    }
  };
  const items = [...new Set(document.querySelectorAll(selectors))].filter((item) => {
    if (item.closest(".loading-screen, #home")) return false;
    if (item.getAttribute("aria-hidden") === "true") return false;
    return getComputedStyle(item).display !== "none";
  });

  if (!items.length) return;

  const controlled = ["opacity", "translate", "scale", "transition", "will-change"];
  const originalStyles = new WeakMap();
  const sectionCounts = new WeakMap();

  const remember = (item) => {
    const state = {};
    controlled.forEach((property) => {
      state[property] = {
        value: item.style.getPropertyValue(property),
        priority: item.style.getPropertyPriority(property)
      };
    });
    originalStyles.set(item, state);
  };

  const restore = (item) => {
    const state = originalStyles.get(item);
    if (!state) return;
    controlled.forEach((property) => {
      const saved = state[property];
      if (saved.value) item.style.setProperty(property, saved.value, saved.priority);
      else item.style.removeProperty(property);
    });
    item.classList.add("is-site-content-visible");
  };

  items.forEach((item, itemIndex) => {
    const section = item.closest("section, footer") || document.body;
    const position = sectionCounts.get(section) || 0;
    const revealKey = `${contentRevealPrefix}:${itemIndex}`;
    sectionCounts.set(section, position + 1);
    item.dataset.siteRevealDelay = String(Math.min(position * 85, 425));
    item.dataset.siteRevealKey = revealKey;
    remember(item);

    if (reducedMotion || historyReturnPending || wasContentRevealed(revealKey)) {
      item.classList.add("is-site-content-visible");
      return;
    }

    const direction = position % 3 === 0 ? "-18px" : position % 3 === 2 ? "18px" : "0px";
    item.style.setProperty("opacity", "0", "important");
    item.style.setProperty("translate", `${direction} 26px`, "important");
    item.style.setProperty("scale", ".975", "important");
    item.style.setProperty("transition", "none", "important");
    item.style.setProperty("will-change", "opacity, translate, scale", "important");
  });

  if (reducedMotion || historyReturnPending) return;

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const item = entry.target;
        revealObserver.unobserve(item);
        rememberContentReveal(item.dataset.siteRevealKey || "");
        const delay = Number(item.dataset.siteRevealDelay || 0);

        window.setTimeout(() => {
          item.style.setProperty(
            "transition",
            "opacity 680ms cubic-bezier(.16,.84,.22,1), translate 760ms cubic-bezier(.16,.84,.22,1), scale 760ms cubic-bezier(.16,.84,.22,1)",
            "important"
          );

          requestAnimationFrame(() => {
            item.style.setProperty("opacity", "1", "important");
            item.style.setProperty("translate", "0 0", "important");
            item.style.setProperty("scale", "1", "important");
          });

          window.setTimeout(() => restore(item), 820);
        }, delay);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
  );

  items.forEach((item, itemIndex) => {
    if (!item.classList.contains("is-site-content-visible")) revealObserver.observe(item);
  });
})();
// Preserve the exact home-page scroll position across project-page navigation.
(() => {
  const scrollKey = `ahmedPortfolioScroll:${location.pathname}`;
  const pendingKey = `ahmedPortfolioRestorePending:${location.pathname}`;

  try {
    history.scrollRestoration = "manual";
  } catch {
    // The browser will fall back to its native restoration behavior.
  }

  const savePosition = (markForReturn = false) => {
    const y = Math.max(0, Math.round(window.scrollY));
    try {
      sessionStorage.setItem(scrollKey, String(y));
      if (markForReturn) sessionStorage.setItem(pendingKey, "1");
      const currentState = history.state && typeof history.state === "object" ? history.state : {};
      history.replaceState({ ...currentState, ahmedPortfolioScrollY: y }, "", location.href);
    } catch {
      // Storage can be unavailable in restricted browser modes.
    }
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || link.hasAttribute("download") || link.target === "_blank") return;

    let destination;
    try {
      destination = new URL(link.href, location.href);
    } catch {
      return;
    }

    const leavesCurrentDocument =
      destination.origin === location.origin &&
      destination.pathname !== location.pathname;

    if (leavesCurrentDocument) savePosition(true);
  }, true);

  window.addEventListener("pagehide", () => savePosition(false));

  window.addEventListener("pageshow", (event) => {
    const navigation = performance.getEntriesByType("navigation")[0];
    let pending = false;
    try {
      pending = sessionStorage.getItem(pendingKey) === "1";
    } catch {
      // Ignore unavailable session storage.
    }

    const isHistoryReturn = event.persisted || navigation?.type === "back_forward" || pending;
    if (!isHistoryReturn) return;

    document.documentElement.classList.add("welcome-seen");
    document.body.classList.add("loader-done");
    document.body.classList.remove("is-loading");
    document.querySelector(".loading-screen")?.remove();

    let savedY = Number(history.state?.ahmedPortfolioScrollY);
    if (!Number.isFinite(savedY)) {
      try {
        savedY = Number(sessionStorage.getItem(scrollKey));
      } catch {
        savedY = NaN;
      }
    }
    if (!Number.isFinite(savedY)) return;

    try {
      sessionStorage.removeItem(pendingKey);
    } catch {
      // Ignore unavailable session storage.
    }

    // Restore the exact section while the page is still hidden, then reveal it.
    // This avoids animating the entire document and keeps history returns light.
    document.documentElement.classList.add("is-restoring-scroll");
    window.scrollTo(0, savedY);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("is-restoring-scroll", "history-return-pending");
      });
    });
  });
})();
// Give history returns a polished entrance even when the browser restores the
// saved scroll position instantly from its back/forward cache.
(() => {
  window.addEventListener("pageshow", (event) => {
    const navigation = performance.getEntriesByType("navigation")[0];
    const isHistoryReturn = event.persisted || navigation?.type === "back_forward";
    if (!isHistoryReturn) return;

    const root = document.documentElement;
    root.classList.remove("is-return-revealing");
    root.classList.add("is-returning-from-detail");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.add("is-return-revealing");
      });
    });

    window.setTimeout(() => {
      root.classList.remove("is-returning-from-detail", "is-return-revealing");
    }, 340);
  });
})();
// Show the primary Explore Portfolio CTA with one lightweight entrance per tab session.
(() => {
  const cta = document.querySelector(
    'section#home.intro-screen .intro-inner > a.explore-portfolio-btn[href="#about"]'
  );
  if (!cta) return;

  const storageKey = 'ahmedPortfolioExploreCtaSeen:v2';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let seen = false;

  try {
    seen = sessionStorage.getItem(storageKey) === '1';
  } catch {
    // Continue with the entrance when session storage is unavailable.
  }

  if (reduced || seen) {
    cta.classList.add('hero-cta-entry-complete', 'hero-cta-attention-ready');
    return;
  }

  cta.classList.remove('hero-cta-attention-ready');
  cta.classList.add('hero-cta-entry-pending');

  const revealCta = () => {
    if (!cta.classList.contains('hero-cta-entry-pending')) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        cta.classList.remove('hero-cta-entry-pending');
        cta.classList.add('hero-cta-entry-complete');

        try {
          sessionStorage.setItem(storageKey, '1');
        } catch {
          // Ignore unavailable session storage.
        }

        window.setTimeout(() => cta.classList.add('hero-cta-attention-ready'), 920);
      });
    });
  };

  const startedAt = performance.now();
  const waitForOpening = () => {
    const openingFinished =
      document.body.classList.contains('loader-done') ||
      !document.querySelector('.loading-screen') ||
      performance.now() - startedAt > 4300;

    if (openingFinished) {
      window.setTimeout(revealCta, 260);
      return;
    }

    window.setTimeout(waitForOpening, 70);
  };

  if (document.readyState === 'complete') {
    waitForOpening();
  } else {
    window.addEventListener('load', waitForOpening, { once: true });
  }
})();
// Runtime performance manager: pauses work that cannot currently be seen.
(() => {
  const root = document.documentElement;
  const sections = [...document.querySelectorAll("main > section, .site-footer")];

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-performance-offscreen", !entry.isIntersecting);
      });
    }, { rootMargin: "180px 0px" });
    sections.forEach((section) => sectionObserver.observe(section));

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && !entry.target.paused) entry.target.pause();
      });
    }, { rootMargin: "100px 0px" });
    document.querySelectorAll("video").forEach((video) => videoObserver.observe(video));
  }

  let scrollTimer = 0;
  let scrollFrame = 0;
  const markScrolling = () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      root.classList.add("is-site-scrolling");
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => root.classList.remove("is-site-scrolling"), 140);
      scrollFrame = 0;
    });
  };
  window.addEventListener("scroll", markScrolling, { passive: true });

  const updateVisibility = () => {
    root.classList.toggle("is-page-hidden", document.hidden);
  };
  document.addEventListener("visibilitychange", updateVisibility);
  updateVisibility();
})();
// Keep only the most useful ambient motion after the opening sequence settles.
(() => {
  const settle = () => {
    window.setTimeout(() => {
      document.body.classList.add("site-motion-settled");
    }, 1800);
  };

  if (document.readyState === "complete") settle();
  else window.addEventListener("load", settle, { once: true });
})();
// Lightweight loading policy: defer offscreen media without changing its appearance.
(() => {
  document.body.classList.add("performance-lite");

  document.querySelectorAll("main img").forEach((image) => {
    if (image.closest("#home, .intro-screen")) return;
    image.loading = "lazy";
    image.decoding = "async";
    image.fetchPriority = "low";
  });

  document.querySelectorAll("video").forEach((video) => {
    video.preload = "none";
    video.playsInline = true;
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) return;
    document.body.classList.add("site-motion-settled");
    document.querySelectorAll("video").forEach((video) => video.pause());
  });
})();
// Final hero choreography v5: a single lightweight reveal for copy, CTA, and its icon.
(() => {
  const hero = document.querySelector("section#home.intro-screen");
  const label = hero?.querySelector(".intro-label");
  const title = hero?.querySelector(".intro-title");
  const lines = title ? [...title.querySelectorAll(":scope > span")] : [];
  const subtitle = hero?.querySelector(".intro-subtitle");
  const cta = hero?.querySelector('.explore-portfolio-btn[href="#about"]');
  const arrow = cta?.querySelector(".arrow");
  if (!hero || !title || !lines.length || !cta) return;

  const body = document.body;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const storageKey = "ahmedPortfolioHeroEntrySeen:v5";
  const animatedElements = [label, ...lines, subtitle, cta, arrow].filter(Boolean);
  let played = false;
  let seen = false;

  try {
    seen = sessionStorage.getItem(storageKey) === "1";
  } catch {
    // Keep the one-run behavior for this page when storage is unavailable.
  }

  const cancelLegacyMotion = () => {
    animatedElements.forEach((element) => element.getAnimations().forEach((animation) => animation.cancel()));
    body.classList.remove(
      "hero-premium-run",
      "hero-sentence-entry-prep",
      "hero-sentence-entry-running",
      "hero-cta-entry-pending",
      "intro-force-animate",
      "intro-ready"
    );
    cta.classList.remove("hero-cta-entry-pending", "hero-cta-attention-ready");
    cta.classList.add("hero-cta-entry-complete");
  };

  const settle = () => {
    animatedElements.forEach((element) => {
      element.getAnimations().forEach((animation) => animation.cancel());
      ["opacity", "visibility", "transform", "filter", "clip-path", "letter-spacing", "will-change", "box-shadow"]
        .forEach((property) => element.style.removeProperty(property));
    });
    cancelLegacyMotion();
    body.classList.remove("hero-entry-v5-prep", "hero-entry-v5-running");
    body.classList.add("hero-entry-v5", "hero-entry-v5-settled");
  };

  body.classList.add("hero-entry-v5");

  if (reduced || seen) {
    settle();
    return;
  }

  body.classList.add("hero-entry-v5-prep");

  const play = () => {
    if (played) return;
    played = true;
    cancelLegacyMotion();
    body.classList.remove("hero-entry-v5-prep");
    body.classList.add("hero-entry-v5-running");

    const animations = [];
    const easing = "cubic-bezier(.16,.84,.22,1)";

    if (label) {
      animations.push(label.animate([
        { opacity: 0, transform: "translate3d(0,14px,0) scale(.94)", filter: "blur(7px)", letterSpacing: ".3em" },
        { opacity: 1, transform: "translate3d(0,0,0) scale(1)", filter: "blur(0) drop-shadow(0 0 13px rgba(156,82,255,.38))", letterSpacing: ".2em" }
      ], { duration: 500, delay: 30, easing, fill: "both" }));
    }

    lines.forEach((line, index) => {
      const fromX = index === 0 ? -46 : index === 1 ? 46 : 0;
      const fromY = index === 2 ? 34 : 20;
      animations.push(line.animate([
        { opacity: 0, clipPath: "inset(0 100% 0 0)", transform: `translate3d(${fromX}px,${fromY}px,0) scale(.965)`, filter: "blur(8px) brightness(.78)" },
        { opacity: 1, clipPath: "inset(0 0 0 0)", transform: "translate3d(0,-3px,0) scale(1.012)", filter: "blur(0) brightness(1.12) drop-shadow(0 0 26px rgba(151,79,255,.38))", offset: .78 },
        { opacity: 1, clipPath: "inset(0 0 0 0)", transform: "translate3d(0,0,0) scale(1)", filter: "blur(0) brightness(1)" }
      ], { duration: 760, delay: 130 + index * 150, easing, fill: "both" }));
    });

    if (subtitle) {
      animations.push(subtitle.animate([
        { opacity: 0, transform: "translate3d(0,16px,0)", filter: "blur(6px)" },
        { opacity: 1, transform: "translate3d(0,0,0)", filter: "blur(0)" }
      ], { duration: 560, delay: 660, easing, fill: "both" }));
    }

    animations.push(cta.animate([
      { opacity: 0, transform: "translate3d(0,24px,0) scale(.9)", filter: "blur(8px) brightness(.8)" },
      { opacity: 1, transform: "translate3d(0,-3px,0) scale(1.025)", filter: "blur(0) brightness(1.12)", offset: .78 },
      { opacity: 1, transform: "translate3d(0,0,0) scale(1)", filter: "blur(0) brightness(1)" }
    ], { duration: 680, delay: 820, easing, fill: "both" }));

    if (arrow) {
      animations.push(arrow.animate([
        { opacity: 0, transform: "translate3d(14px,0,0) rotate(-26deg) scale(.52)" },
        { opacity: 1, transform: "translate3d(-2px,0,0) rotate(5deg) scale(1.13)", offset: .72 },
        { opacity: 1, transform: "translate3d(0,0,0) rotate(0) scale(1)" }
      ], { duration: 620, delay: 960, easing, fill: "both" }));
    }

    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      // Ignore unavailable session storage.
    }

    Promise.allSettled(animations.map((animation) => animation.finished)).then(settle);
    window.setTimeout(() => cta.classList.remove("hero-cta-attention-ready"), 2600);
  };

  const startedAt = performance.now();
  const waitForOpening = () => {
    const openingFinished = body.classList.contains("loader-done") ||
      !document.querySelector(".loading-screen") ||
      performance.now() - startedAt > 4300;
    if (openingFinished) {
      window.setTimeout(play, 520);
      return;
    }
    window.setTimeout(waitForOpening, 70);
  };

  if (document.readyState === "complete") waitForOpening();
  else window.addEventListener("load", waitForOpening, { once: true });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) settle();
  }, { once: true });
})();
/* Final isolated Hero controller v2 — August 2026 */
(() => {
  const hero = document.querySelector("section#home.intro-screen");
  if (!hero) return;

  const welcome = hero.querySelector(".intro-welcome");
  const graphics = hero.querySelector(".intro-graphics");
  const label = hero.querySelector(".intro-label");
  const lines = [...hero.querySelectorAll(".intro-title > span")];
  const subtitle = hero.querySelector(".intro-subtitle");
  const actions = hero.querySelector(".intro-actions");
  const trust = hero.querySelector(".intro-trust");
  const workButton = hero.querySelector('.intro-cta-primary[href="#reels"]');
  const showreelButton = hero.querySelector("[data-showreel-trigger]");
  const modal = hero.querySelector("#hero-showreel-modal");
  const closeButton = modal?.querySelector("[data-showreel-close]");
  const video = modal?.querySelector(".hero-showreel-video");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animatedElements = [graphics, welcome, label, ...lines, subtitle, actions, trust].filter(Boolean);

  const settleHero = () => {
    animatedElements.forEach((element) => {
      element.getAnimations().forEach((animation) => animation.cancel());
      ["opacity", "transform", "filter", "visibility", "clip-path", "will-change"]
        .forEach((property) => element.style.removeProperty(property));
    });
  };

  workButton?.addEventListener("click", (event) => {
    const target = document.querySelector("#reels");
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    if (history.replaceState) history.replaceState(null, "", "#reels");
  });

  const closeShowreel = () => {
    if (!modal) return;
    if (typeof modal.close === "function" && modal.open) modal.close();
    else modal.removeAttribute("open");
  };

  showreelButton?.addEventListener("click", () => {
    if (!modal || !video) return;
    const source = showreelButton.dataset.showreelSrc;
    if (source && video.getAttribute("src") !== source) {
      video.setAttribute("src", source);
      video.load();
    }
    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");
    video.play().catch(() => {});
  });

  closeButton?.addEventListener("click", closeShowreel);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) closeShowreel();
  });
  modal?.addEventListener("close", () => {
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    video.removeAttribute("src");
    video.load();
  });

  const navigationType = performance.getEntriesByType?.("navigation")?.[0]?.type;
  const isHistoryReturn = navigationType === "back_forward";

  if (document.body.classList.contains("performance-lite") || reducedMotion || isHistoryReturn || typeof Element.prototype.animate !== "function") {
    settleHero();
    return;
  }

  animatedElements.forEach((element) => {
    element.style.setProperty("opacity", "0", "important");
    element.style.setProperty("visibility", "hidden", "important");
  });

  const playEntrance = () => {
    settleHero();
    const easing = "cubic-bezier(.2,.75,.25,1)";
    const animations = [];

    if (graphics) {
      animations.push(graphics.animate([
        { opacity: 0, transform: "scale(1.075)", filter: "blur(8px) brightness(.72)" },
        { opacity: .82, transform: "scale(1)", filter: "blur(0) brightness(1)" }
      ], { duration: 1050, delay: 0, easing, fill: "both" }));
    }

    if (welcome) {
      animations.push(welcome.animate([
        { opacity: 0, transform: "translate3d(0,-24px,0) scale(.86)", filter: "blur(13px) brightness(.72)" },
        { opacity: 1, transform: "translate3d(0,3px,0) scale(1.035)", filter: "blur(0) brightness(1.18) drop-shadow(0 0 28px rgba(56,198,255,.42))", offset: .76 },
        { opacity: 1, transform: "translate3d(0,0,0) scale(1)", filter: "blur(0) brightness(1)" }
      ], { duration: 720, delay: 80, easing: "cubic-bezier(.16,.84,.22,1)", fill: "both" }));
    }

    if (label) {
      animations.push(label.animate([
        { opacity: 0, transform: "translate3d(0,18px,0) scale(.92)", filter: "blur(9px)", letterSpacing: ".32em" },
        { opacity: 1, transform: "translate3d(0,-2px,0) scale(1.015)", filter: "blur(0) drop-shadow(0 0 18px rgba(157,82,255,.44))", letterSpacing: ".2em", offset: .78 },
        { opacity: 1, transform: "translate3d(0,0,0) scale(1)", filter: "blur(0)", letterSpacing: ".2em" }
      ], { duration: 560, delay: 350, easing: "cubic-bezier(.16,.84,.22,1)", fill: "both" }));
    }

    lines.forEach((line, index) => {
      animations.push(line.animate([
        { opacity: 0, clipPath: "inset(105% 0 -8% 0)", transform: "perspective(900px) translate3d(0,52px,-72px) rotateX(-15deg) scale(.94)", filter: "blur(14px) brightness(.72)" },
        { opacity: 1, clipPath: "inset(-10% 0 -10% 0)", transform: "perspective(900px) translate3d(0,-5px,0) rotateX(1deg) scale(1.018)", filter: "blur(0) brightness(1.14) drop-shadow(0 0 32px rgba(151,79,255,.42)) drop-shadow(0 0 20px rgba(37,183,255,.24))", offset: .76 },
        { opacity: 1, clipPath: "inset(-10% 0 -10% 0)", transform: "perspective(900px) translate3d(0,0,0) rotateX(0) scale(1)", filter: "blur(0) brightness(1)" }
      ], { duration: 820, delay: 480 + index * 150, easing: "cubic-bezier(.16,.84,.22,1)", fill: "both" }));
    });

    if (subtitle) {
      animations.push(subtitle.animate([
        { opacity: 0, transform: "translate3d(0,22px,0)", filter: "blur(8px)" },
        { opacity: 1, transform: "translate3d(0,0,0)", filter: "blur(0)" }
      ], { duration: 620, delay: 1060, easing: "cubic-bezier(.16,.84,.22,1)", fill: "both" }));
    }

    if (actions) {
      animations.push(actions.animate([
        { opacity: 0, transform: "translate3d(0,28px,0) scale(.92)", filter: "blur(8px) brightness(.82)" },
        { opacity: 1, transform: "translate3d(0,-3px,0) scale(1.018)", filter: "blur(0) brightness(1.1)", offset: .78 },
        { opacity: 1, transform: "translate3d(0,0,0) scale(1)", filter: "blur(0) brightness(1)" }
      ], { duration: 700, delay: 1210, easing: "cubic-bezier(.16,.84,.22,1)", fill: "both" }));
    }

    if (trust) {
      animations.push(trust.animate([
        { opacity: 0, transform: "translate3d(0,14px,0)", filter: "blur(5px)" },
        { opacity: 1, transform: "translate3d(0,0,0)", filter: "blur(0)" }
      ], { duration: 440, delay: 1400, easing: "cubic-bezier(.16,.84,.22,1)", fill: "both" }));
    }


    Promise.allSettled(animations.map((animation) => animation.finished)).then(settleHero);
  };

  const waitForIntro = () => {
    const loader = document.querySelector(".loading-screen");
    if (!loader || document.body.classList.contains("loader-done")) {
      window.setTimeout(playEntrance, 150);
      return;
    }
    window.setTimeout(waitForIntro, 80);
  };

  if (document.readyState === "complete") waitForIntro();
  else window.addEventListener("load", waitForIntro, { once: true });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) settleHero();
  }, { once: true });
})();
// Explore CTA: reveal the complete About section without clipping its left column.
(() => {
  const trigger = document.querySelector('section#home .intro-portfolio-cta[href="#about"]');
  const aboutCard = document.querySelector('#about.profile-card');
  const aboutSection = aboutCard?.closest('.about-section');
  if (!trigger || !aboutSection) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealAbout = (behavior = reducedMotion ? 'auto' : 'smooth') => {
    aboutSection.scrollIntoView({ behavior, block: 'start', inline: 'nearest' });
  };

  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    revealAbout();
    if (history.replaceState) history.replaceState(null, '', '#about');
  });

  const correctAboutHash = () => {
    if (window.location.hash !== '#about') return;
    window.requestAnimationFrame(() => revealAbout('auto'));
  };

  window.addEventListener('hashchange', correctAboutHash);
  correctAboutHash();
})();