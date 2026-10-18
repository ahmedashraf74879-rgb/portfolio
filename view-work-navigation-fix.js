// Keep the About CTA focused on the design portfolio only.
(() => {
  const trigger = document.querySelector(
    '.about-section .actions .primary-btn[href="#portfolio"]'
  );
  const portfolio = document.querySelector('#portfolio');
  if (!trigger || !portfolio) return;

  const destination =
    portfolio.querySelector(':scope > .mini-title') || portfolio;
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const getDestinationY = () => {
    const topbar = document.querySelector('.topbar');
    const headerBottom = topbar
      ? Math.max(0, topbar.getBoundingClientRect().bottom)
      : 72;
    const safeOffset = Math.ceil(Math.max(80, headerBottom + 16));

    return Math.max(
      0,
      destination.getBoundingClientRect().top + window.scrollY - safeOffset
    );
  };

  const showPortfolio = () => {
    window.scrollTo({
      top: getDestinationY(),
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
    history.replaceState(history.state, '', '#portfolio');
  };

  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    trigger.blur();
    showPortfolio();
  });
})();