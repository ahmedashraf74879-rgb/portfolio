(() => {
  const skills = document.querySelector('#skills');
  const button = document.querySelector('#work-navigation-button');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add(entry.target === skills ? 'skills-entered' : 'work-invite');
        observer.unobserve(entry.target);
      });
    }, { threshold: .15 });
    if (skills) observer.observe(skills);
    if (button) observer.observe(button);
  }
})();

(() => {
 if(matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window))return;
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   entry.target.animate([{opacity:.35,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:550,easing:'cubic-bezier(.16,1,.3,1)'});
   observer.unobserve(entry.target);
  });
 },{threshold:.15});
 document.querySelectorAll('main .section-impact-title').forEach(title=>observer.observe(title));
})();
