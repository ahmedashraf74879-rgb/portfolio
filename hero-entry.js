(() => {
 const root=document.documentElement, hero=document.querySelector('#home .intro-inner');
 if(!hero)return root.classList.remove('hero-entry-pending');
 let played=false,observer;
 const reveal=()=>{
  if(played)return;played=true;observer?.disconnect();clearTimeout(fallback);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animation=!reduced && hero.animate ? hero.animate([
   {opacity:0,translate:'0 18px'},{opacity:1,translate:'0 0'}
  ],{duration:650,easing:'cubic-bezier(.16,1,.3,1)'}) : null;
  root.classList.remove('hero-entry-pending');
  animation?.finished.then(()=>{
   if(document.hidden)return;
   const welcome=hero.querySelector('.intro-welcome');
   if(welcome)welcome.animate([{scale:'1'},{scale:'1.018',offset:.45},{scale:'1'}],{duration:1000,easing:'ease-in-out',iterations:1});
   document.querySelectorAll('#home .welcome-accents > span').forEach((item,index)=>{
    item.animate([{transform:'translateY(0)'},{transform:'translateY(-10px)',offset:.5},{transform:'translateY(0)'}],{duration:1800+index*120,easing:'ease-in-out',iterations:2});
   });
  }).catch(()=>{});
 };
 const fallback=setTimeout(reveal,5500);
 if(document.body.classList.contains('loader-done')||!document.querySelector('.loading-screen'))reveal();
 else {observer=new MutationObserver(()=>{if(document.body.classList.contains('loader-done'))reveal();});observer.observe(document.body,{attributes:true,attributeFilter:['class']});}
 addEventListener('pageshow',event=>{if(event.persisted){played=true;observer?.disconnect();clearTimeout(fallback);root.classList.remove('hero-entry-pending');}});
})();