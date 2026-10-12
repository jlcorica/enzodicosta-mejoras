/* =========================================================
   Click-to-load for third-party embeds (Google Maps, YouTube,
   Instagram, Facebook). Nothing from those services is loaded
   until the visitor clicks, so the site sets no third-party
   cookies on its own and needs no cookie banner.

   Markup:
     <div class="edc-consent" data-consent-service="YouTube">
       <iframe data-consent-src="https://..."></iframe>
     </div>
   or, for script-based embeds (Instagram blockquotes):
     <div class="edc-consent" data-consent-service="Instagram"
          data-consent-script="https://www.instagram.com/embed.js"> ... </div>

   The notice follows <html lang>, so it switches together with
   the page's own language selector.
   ========================================================= */
(function () {
  var TEXT = {
    it: { msg: 'Contenuto di {s}. Caricandolo, {s} potrebbe installare cookie e ricevere dati di navigazione.', btn: 'Carica contenuto', more: 'Informativa cookie' },
    en: { msg: 'Content from {s}. If you load it, {s} may set cookies and receive browsing data.', btn: 'Load content', more: 'Cookie policy' },
    es: { msg: 'Contenido de {s}. Al cargarlo, {s} puede instalar cookies y recibir datos de navegación.', btn: 'Cargar contenido', more: 'Política de cookies' },
    de: { msg: 'Inhalt von {s}. Beim Laden kann {s} Cookies setzen und Nutzungsdaten erhalten.', btn: 'Inhalt laden', more: 'Cookie-Hinweis' },
    pt: { msg: 'Conteúdo de {s}. Ao carregá-lo, {s} pode instalar cookies e receber dados de navegação.', btn: 'Carregar conteúdo', more: 'Política de cookies' }
  };
  var legalBase = new URL('legal.html', document.currentScript.src).href;

  var style = document.createElement('style');
  style.textContent =
    '.edc-consent{position:relative}' +
    '.edc-consent:not(.is-loaded){min-height:240px}' +
    '.edc-consent:not(.is-loaded) iframe{display:none}' +
    '.edc-consent:not(.is-loaded)>*:not(.edc-consent__ph):not(.edc-consent__keep){visibility:hidden}' +
    '.edc-consent__ph{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.9rem;padding:1.4rem;text-align:center;' +
      'background:var(--edc-bg-card,#f8f1e2);border:1px solid var(--edc-line,#d8c5a0);color:var(--edc-ink-soft,#4a3a2c);font-family:var(--edc-f-sans,sans-serif);font-size:.9rem;line-height:1.5}' +
    '.edc-consent__ph p{margin:0;max-width:34ch}' +
    '.edc-consent__btn{cursor:pointer;border:1px solid var(--edc-accent,#b25a2c);background:var(--edc-accent,#b25a2c);color:#fff;border-radius:999px;padding:.6rem 1.1rem;' +
      'font-family:var(--edc-f-mono,monospace);font-size:.68rem;letter-spacing:.1em;text-transform:uppercase}' +
    '.edc-consent__btn:hover{background:var(--edc-ink,#1a120c);border-color:var(--edc-ink,#1a120c)}' +
    '.edc-consent__more{font-size:.78rem;color:var(--edc-ink-mute,#7a6a59)}';
  document.head.appendChild(style);

  function lang() {
    var l = (document.documentElement.getAttribute('lang') || 'it').slice(0, 2);
    return TEXT[l] ? l : 'it';
  }

  function render(ph, service) {
    var l = lang(), t = TEXT[l];
    ph.querySelector('p').textContent = t.msg.replace(/\{s\}/g, service);
    ph.querySelector('.edc-consent__btn').textContent = t.btn;
    var more = ph.querySelector('.edc-consent__more');
    more.textContent = t.more;
    more.href = legalBase + (l === 'it' ? '' : '?lang=' + l) + '#cookies';
  }

  var loadedScripts = {};
  function load(box) {
    box.querySelectorAll('iframe[data-consent-src]').forEach(function (f) {
      f.src = f.getAttribute('data-consent-src');
    });
    var src = box.getAttribute('data-consent-script');
    if (src) {
      if (loadedScripts[src]) {
        if (window.instgrm) window.instgrm.Embeds.process();
      } else {
        loadedScripts[src] = true;
        var s = document.createElement('script');
        s.async = true;
        s.src = src;
        document.body.appendChild(s);
      }
    }
    box.classList.add('is-loaded');
    var ph = box.querySelector('.edc-consent__ph');
    if (ph) ph.remove();
  }

  var boxes = [];
  document.querySelectorAll('.edc-consent').forEach(function (box) {
    var service = box.getAttribute('data-consent-service') || '';
    var ph = document.createElement('div');
    ph.className = 'edc-consent__ph';
    ph.innerHTML = '<p></p><button type="button" class="edc-consent__btn"></button><a class="edc-consent__more"></a>';
    ph.querySelector('button').addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      load(box);
    });
    box.appendChild(ph);
    render(ph, service);
    boxes.push([ph, service]);
  });

  new MutationObserver(function () {
    boxes.forEach(function (b) { if (b[0].isConnected) render(b[0], b[1]); });
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
