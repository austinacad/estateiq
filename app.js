'use strict';
const modal=document.getElementById('pilotModal');
function openPilot(e){
  const selected=e?.currentTarget?.dataset?.trialPlan;
  const choice=modal?.querySelector('#trialPlan');
  if(choice && (selected==='agent' || selected==='brokerage')) choice.value=selected;
  modal?.classList.add('open');
  choice?.focus();
}
function closePilot(){modal?.classList.remove('open');}
document.querySelectorAll('[data-open-pilot]').forEach(b=>b.addEventListener('click',openPilot));
document.querySelectorAll('[data-close-pilot]').forEach(b=>b.addEventListener('click',closePilot));
modal?.addEventListener('click',e=>{if(e.target===modal)closePilot();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePilot();});
document.querySelectorAll('[data-demo]').forEach(b=>b.addEventListener('click',()=>{window.location.href='dashboard.html';}));
const form=document.getElementById('pilotForm');
form?.addEventListener('submit',e=>{
  // Netlify Forms processes the POST after publication. Local files have no form handler.
  if(location.protocol==='file:' || ['localhost','127.0.0.1'].includes(location.hostname) || location.hostname.endsWith('.vercel.app')){
    e.preventDefault();
    const note=document.getElementById('formNote');
    note.textContent='This form is not connected yet. Your request was not sent. Please wait for the pilot signup to open.';
    note.style.color='#eec99c';
  }
});

// Compact navigation for narrow screens.
const mobileToggle=document.getElementById('mobileNavToggle');
const mobileNav=document.getElementById('mobileNav');
function closeMobileNav(){mobileNav?.classList.remove('mobile-open');mobileToggle?.setAttribute('aria-expanded','false');}
mobileToggle?.addEventListener('click',()=>{const opened=mobileNav.classList.toggle('mobile-open');mobileToggle.setAttribute('aria-expanded',String(opened));mobileToggle.setAttribute('aria-label',opened?'Close site menu':'Open site menu');});
mobileNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMobileNav));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMobileNav();});
