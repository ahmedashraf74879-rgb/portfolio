(() => {
 const hero=document.querySelector('#home');if(!hero)return;
 const subtitle=hero.querySelector('.intro-subtitle');
 if(subtitle)subtitle.style.setProperty('font-size',parseFloat(getComputedStyle(subtitle).fontSize)*1.12+'px','important');

})();