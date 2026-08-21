// Mobile menu toggle
function toggleMenu(){
  const nav = document.getElementById('navLinks');
  if(nav){ nav.classList.toggle('open'); }
}
document.addEventListener('click', function(e){
  const nav = document.getElementById('navLinks');
  const toggle = document.querySelector('.menu-toggle');
  if(!nav || !toggle) return;
  if(nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)){
    nav.classList.remove('open');
  }
});

// Services dropdown: opens on a real mouseenter event rather than CSS :hover, and
// closes on mouseleave or when a menu link is clicked. Using :hover alone left the
// menu stuck open after clicking a link, since the cursor lands on the same screen
// position on the new page (sticky header) without the browser ever registering a
// "mouse left" moment, so :hover matched immediately on load and stayed matched through scroll.
(function(){
  const dropdown = document.querySelector('.dropdown');
  if(!dropdown) return;
  let closeTimer;
  dropdown.addEventListener('mouseenter', function(){
    clearTimeout(closeTimer);
    dropdown.classList.add('open');
  });
  dropdown.addEventListener('mouseleave', function(){
    closeTimer = setTimeout(function(){ dropdown.classList.remove('open'); }, 150);
  });
  dropdown.querySelectorAll('.dropdown-menu a').forEach(function(a){
    a.addEventListener('click', function(){ dropdown.classList.remove('open'); });
  });
})();

// Decorative 64-cell dot grid (only present on the homepage hero)
const dotgrid = document.querySelector('.dotgrid');
if(dotgrid){
  for(let i=0;i<64;i++){
    const s = document.createElement('span');
    dotgrid.appendChild(s);
  }
}

// Cal.com booking embed (snippet only defines Cal() — no network request or cookies until loadCalWidget() runs)
(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");

function loadCalWidget(){
  if(window.calWidgetLoaded) return;
  window.calWidgetLoaded = true;
  Cal("init", { origin: "https://cal.com" });
  Cal("ui", {
    styles: { branding: { brandColor: "#1B211D" } },
    hideEventTypeDetails: false,
    layout: "month_view"
  });
}

// Google Tag Manager — only ever loads if the visitor explicitly accepts. Never lazy-loads
// on interaction like Cal.com, since analytics is passive tracking, not a requested feature.
// GTM manages GA4 (and any future tags) from here on, so there's no separate gtag.js load.
function loadGTM(){
  if(window.gtmLoaded) return;
  window.gtmLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-TKFSMDZR';
  document.head.appendChild(s);
}

// Microsoft Clarity — same rule as GA4: only loads on explicit accept, never by default.
function loadClarity(){
  if(window.clarityLoaded) return;
  window.clarityLoaded = true;
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "y4mhmanwqf");
}

if(localStorage.getItem('cc_consent') === 'accepted'){
  loadCalWidget();
  loadGTM();
  loadClarity();
}

// First click on any "Book a call" button loads the widget on demand, then replays the click
// so Cal's own listener (attached once its script loads) opens the calendar as normal.
document.addEventListener('click', function(e){
  const trigger = e.target.closest('[data-cal-link]');
  if(!trigger || window.calWidgetLoaded) return;
  e.preventDefault();
  loadCalWidget();
  const script = document.querySelector('script[src="https://app.cal.com/embed/embed.js"]');
  if(script){
    script.addEventListener('load', function(){ trigger.click(); }, { once: true });
  }
}, true);

// Cookie notice
(function(){
  if(localStorage.getItem('cc_consent')) return;
  const bar = document.createElement('div');
  bar.className = 'cookie-banner';
  bar.innerHTML = 'This site keeps cookies to a minimum. Accepting also enables site analytics (Google Analytics and Microsoft Clarity) to help us understand traffic and improve the site. Clicking "Book a call" loads our scheduling tool, Cal.com, either way, since that\'s a feature you\'re actively requesting. See our <a href="privacy-policy">Privacy Policy</a>.<div class="cookie-banner-btns"><button class="btn btn-ghost btn-sm" type="button" data-choice="rejected">Necessary only</button><button class="btn btn-primary btn-sm" type="button" data-choice="accepted">Accept</button></div>';
  document.body.appendChild(bar);
  bar.querySelectorAll('button').forEach(function(btn){
    btn.addEventListener('click', function(){
      const choice = btn.getAttribute('data-choice');
      localStorage.setItem('cc_consent', choice);
      if(choice === 'accepted'){ loadCalWidget(); loadGTM(); loadClarity(); }
      bar.remove();
    });
  });
})();
