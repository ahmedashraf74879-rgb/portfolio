(() => {
  // One navigation handler prevents competing legacy scrolls.
  window.addEventListener('click', event => {
    const link = event.target.closest?.('a[href^="#"]');
    if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const hash = link.id === 'work-navigation-button' ? '#reels' : link.getAttribute('href');
    if (!hash || hash === '#') return;
    let target;
    try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return; }
    if (!target) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    target = target.closest('section') || target;
    document.querySelector('.nav')?.classList.remove('open');
    const header = document.querySelector('.topbar');
    const fixed = header && ['fixed','sticky'].includes(getComputedStyle(header).position);
    const offset = fixed ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
    target.style.contentVisibility = 'visible';
    if(link.id === 'work-navigation-button') {
      target.style.setProperty('padding-top', Math.max(80, offset + 20) + 'px', 'important');
    }
    const y = Math.max(0, target.getBoundingClientRect().top + window.scrollY - (link.id === 'work-navigation-button' ? 0 : offset));
    window.scrollTo({top:y, behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    history.replaceState(history.state,'',hash);
  }, true);
})();
