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

// Cal.com booking embed
(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", { origin: "https://cal.com" });
Cal("ui", {
  styles: { branding: { brandColor: "#1B211D" } },
  hideEventTypeDetails: false,
  layout: "month_view"
});
