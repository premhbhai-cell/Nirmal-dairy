(function(){
'use strict';
function init(){
  if(document.querySelector('.nd-mobile-menu')) return;
  var header=document.querySelector('header');
  if(!header) return;
  var trigger=header.querySelector('button[aria-controls="mobile-navigation"]');
  if(!trigger) return;

  var menu=document.createElement('div');
  menu.className='nd-mobile-menu';
  menu.innerHTML='<div class="nd-mobile-backdrop" data-nd-close></div>'+
    '<aside class="nd-mobile-panel" id="mobile-navigation" aria-label="Mobile navigation">'+
      '<div class="nd-mobile-head">'+
        '<span class="nd-mobile-title">Nirmal Dairy</span>'+
        '<button class="nd-mobile-close" type="button" aria-label="Close menu">×</button>'+ 
      '</div>'+ 
      '<div class="nd-mobile-links"></div>'+ 
      '<div class="nd-mobile-actions">'+
        '<a class="nd-mobile-action" href="cart.html">🛒 <span>Cart</span></a>'+ 
        '<button class="nd-mobile-action nd-mobile-theme" type="button" aria-label="Toggle day and night mode">🌙 <span>Dark Mode</span></button>'+ 
      '</div>'+ 
      '<div class="nd-mobile-sub">Fresh milk &amp; products • Farm to family</div>'+ 
    '</aside>';
  document.body.appendChild(menu);

  var links=menu.querySelector('.nd-mobile-links');
  var desktopNav=header.querySelector('nav[aria-label="Primary"]');
  var seen={};
  var sourceLinks=desktopNav ? desktopNav.querySelectorAll('a[href]') : [];

  Array.prototype.forEach.call(sourceLinks,function(a){
    var href=a.getAttribute('href');
    var text=(a.textContent||'').replace(/\s+/g,' ').trim();
    if(!href||!text||seen[href]) return;
    seen[href]=true;
    addLink(href,text);
  });

  // The desktop navigation is hidden on mobile, so on some pages its mobile
  // nav source is empty. Always provide the complete mobile navigation.
  var fallback=[
    ['products.html','Shop'],
    ['about.html','About'],
    ['tools.html','Tools'],
    ['contact.html','Contact'],
    ['faqs.html','FAQs'],
    ['account.html','Account']
  ];
  fallback.forEach(function(item){
    if(!seen[item[0]]){
      seen[item[0]]=true;
      addLink(item[0],item[1]);
    }
  });

  function addLink(href,text){
    var item=document.createElement('a');
    item.className='nd-mobile-link';
    item.href=href;
    item.innerHTML='<span>'+text+'</span><span aria-hidden="true">›</span>';
    links.appendChild(item);
  }

  var closeBtn=menu.querySelector('.nd-mobile-close');
  var backdrop=menu.querySelector('.nd-mobile-backdrop');
  var themeBtn=menu.querySelector('.nd-mobile-theme');

  function syncThemeButton(){
    var dark=document.documentElement.classList.contains('dark');
    themeBtn.innerHTML=(dark?'☀️':'🌙')+' <span>'+(dark?'Light Mode':'Dark Mode')+'</span>';
    themeBtn.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');
  }
  function close(){
    menu.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    document.body.classList.remove('nd-menu-open');
    trigger.setAttribute('aria-expanded','false');
    trigger.setAttribute('aria-label','Open full navigation');
  }
  function open(){
    syncThemeButton();
    menu.classList.add('is-open');
    backdrop.classList.add('is-open');
    document.body.classList.add('nd-menu-open');
    trigger.setAttribute('aria-expanded','true');
    trigger.setAttribute('aria-label','Close full navigation');
  }

  trigger.addEventListener('click',function(e){
    e.preventDefault();
    e.stopPropagation();
    menu.classList.contains('is-open') ? close() : open();
  });
  closeBtn.addEventListener('click',close);
  backdrop.addEventListener('click',close);
  menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',close)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
  window.addEventListener('resize',function(){if(window.innerWidth>=1024)close()});

  themeBtn.addEventListener('click',function(e){
    e.preventDefault();
    var desktopTheme=Array.prototype.find.call(header.querySelectorAll('button'),function(x){
      var s=((x.getAttribute('aria-label')||'')+' '+(x.getAttribute('title')||'')).toLowerCase();
      return x!==trigger && (s.indexOf('dark mode')>-1 || s.indexOf('light mode')>-1);
    });
    if(desktopTheme) desktopTheme.click();
    else{
      var dark=document.documentElement.classList.contains('dark');
      localStorage.setItem('nirmalyTheme',dark?'light':'dark');
      document.documentElement.classList.toggle('dark',!dark);
    }
    setTimeout(syncThemeButton,50);
  });
  syncThemeButton();
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
window.addEventListener('load',init);
})();
