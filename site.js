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

if(localStorage.getItem('cc_consent') === 'accepted'){
  loadCalWidget();
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
  bar.innerHTML = 'This site doesn\'t set cookies of its own. Clicking "Book a call" loads our scheduling tool, Cal.com, which may set its own cookies to run the calendar. See our <a href="privacy-policy">Privacy Policy</a>.<div class="cookie-banner-btns"><button class="btn btn-ghost btn-sm" type="button" data-choice="rejected">Necessary only</button><button class="btn btn-primary btn-sm" type="button" data-choice="accepted">Accept</button></div>';
  document.body.appendChild(bar);
  bar.querySelectorAll('button').forEach(function(btn){
    btn.addEventListener('click', function(){
      const choice = btn.getAttribute('data-choice');
      localStorage.setItem('cc_consent', choice);
      if(choice === 'accepted'){ loadCalWidget(); }
      bar.remove();
    });
  });
})();
