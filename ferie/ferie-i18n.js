/* =========================================================
   Shared i18n engine for the "ferie" (trade fair) sub-pages.
   Each page calls initFieraI18n({ en: {...}, es: {...} }) with
   only ITS OWN dictionary — Italian is captured automatically
   from the page's own HTML, so it never needs to be retyped.

   The active language is taken from the ?lang= URL parameter
   (set automatically when a visitor clicks through from the main
   site in EN/ES), defaulting to Italian. The "back to site" links
   carry the current language forward too, so going back keeps it.
   ========================================================= */
(function () {
  function initFieraI18n(dict) {
    var itCache = {};
    var currentLang = 'it';

    function applyBackLinks(lang) {
      document.querySelectorAll('a.fiera-back').forEach(function (a) {
        var href = a.getAttribute('href');
        var hash = '';
        var hashIdx = href.indexOf('#');
        if (hashIdx !== -1) { hash = href.slice(hashIdx); href = href.slice(0, hashIdx); }
        href = href.split('?')[0];
        a.setAttribute('href', href + (lang === 'it' ? '' : '?lang=' + lang) + hash);
      });
    }

    function setLang(lang) {
      if (!dict[lang]) lang = 'it';
      currentLang = lang;
      document.documentElement.setAttribute('lang', lang);
      var d = dict[lang] || {};
      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (!(key in itCache)) itCache[key] = el.innerHTML;
        el.innerHTML = (lang === 'it') ? itCache[key] : (d[key] != null ? d[key] : itCache[key]);
      });
      document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-alt');
        if (!el.hasAttribute('data-alt-it')) el.setAttribute('data-alt-it', el.getAttribute('alt') || '');
        var itVal = el.getAttribute('data-alt-it');
        el.setAttribute('alt', (lang === 'it') ? itVal : (d[key] != null ? d[key] : itVal));
      });
      document.querySelectorAll('[data-lang-btn]').forEach(function (b) {
        b.classList.toggle('is-active', b.getAttribute('data-lang-btn') === lang);
      });
      applyBackLinks(lang);
    }

    document.querySelectorAll('[data-lang-btn]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        setLang(b.getAttribute('data-lang-btn'));
      });
    });

    var params = new URLSearchParams(location.search);
    setLang(params.get('lang') || 'it');
  }
  window.initFieraI18n = initFieraI18n;
})();
