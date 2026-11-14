(function () {
  'use strict';

  var STORAGE_KEY = 'cookie_consent';
  var TIMESTAMP_KEY = 'cookie_consent_timestamp';
  var EXPIRY_DAYS = 365;
  var PRIVACY_URL = '/privacidade';
  var GTM_ID = 'GTM-K7LNFJB6';
  var gtmCarregado = false;

  function hasValidConsent() {
    try {
      var value = localStorage.getItem(STORAGE_KEY);
      var ts = localStorage.getItem(TIMESTAMP_KEY);
      if (!value || !ts) return false;
      var savedAt = parseInt(ts, 10);
      if (isNaN(savedAt)) return false;
      var elapsed = Date.now() - savedAt;
      var maxAge = EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      return elapsed < maxAge;
    } catch (e) {
      return false;
    }
  }

  function getConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  // Carrega o Google Tag Manager (Analytics e Meta Pixel) só depois do aceite
  function loadGTM() {
    if (gtmCarregado) return;
    gtmCarregado = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(script);
  }

  function saveConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
      localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
    } catch (e) {
      // localStorage indisponível (modo privado, cookies bloqueados): ignora
    }
  }

  function injectStyles() {
    if (document.getElementById('cookie-banner-styles')) return;
    var style = document.createElement('style');
    style.id = 'cookie-banner-styles';
    style.textContent = [
      "#cookie-banner {",
      "  position: fixed;",
      "  left: 50%;",
      "  bottom: 24px;",
      "  transform: translateX(-50%) translateY(20px);",
      "  z-index: 9999;",
      "  max-width: 1100px;",
      "  width: calc(100% - 32px);",
      "  background: #0A1628;",
      "  color: #FFFFFF;",
      "  border: 1px solid rgba(201, 168, 76, 0.25);",
      "  border-radius: 14px;",
      "  padding: 20px 24px;",
      "  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);",
      "  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;",
      "  font-size: 14px;",
      "  line-height: 1.55;",
      "  display: flex;",
      "  gap: 24px;",
      "  align-items: center;",
      "  opacity: 0;",
      "  transition: opacity 0.35s ease, transform 0.35s ease;",
      "}",
      "#cookie-banner.cb-visible {",
      "  opacity: 1;",
      "  transform: translateX(-50%) translateY(0);",
      "}",
      "#cookie-banner.cb-hiding {",
      "  opacity: 0;",
      "  transform: translateX(-50%) translateY(20px);",
      "  pointer-events: none;",
      "}",
      "#cookie-banner .cb-text {",
      "  flex: 1;",
      "  min-width: 0;",
      "  color: #FFFFFF;",
      "}",
      "#cookie-banner .cb-text a {",
      "  color: #C9A84C;",
      "  text-decoration: underline;",
      "  text-decoration-thickness: 1px;",
      "  text-underline-offset: 2px;",
      "  font-weight: 500;",
      "  transition: color 0.2s ease;",
      "}",
      "#cookie-banner .cb-text a:hover {",
      "  color: #E8C56A;",
      "}",
      // Os 2 botões têm o mesmo tamanho: cada coluna fica com a largura do maior
      "#cookie-banner .cb-actions {",
      "  display: grid;",
      "  grid-template-columns: repeat(2, minmax(0, 1fr));",
      "  gap: 12px;",
      "  flex-shrink: 0;",
      "}",
      "#cookie-banner .cb-btn {",
      "  font-family: inherit;",
      "  font-size: 14px;",
      "  font-weight: 600;",
      "  padding: 10px 22px;",
      "  border-radius: 50px;",
      "  cursor: pointer;",
      "  white-space: nowrap;",
      "  letter-spacing: 0.01em;",
      "  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease, color 0.2s ease;",
      // Mesmo estilo nos 2 botões: aceitar e recusar com o mesmo destaque
      "  background: #C9A84C;",
      "  border: 1px solid #C9A84C;",
      "  color: #0A1628;",
      "  box-shadow: 0 4px 16px rgba(201, 168, 76, 0.25);",
      "}",
      "#cookie-banner .cb-btn:focus-visible {",
      "  outline: 2px solid #C9A84C;",
      "  outline-offset: 2px;",
      "}",
      "#cookie-banner .cb-btn:hover {",
      "  background: #E8C56A;",
      "  border-color: #E8C56A;",
      "  transform: translateY(-1px);",
      "  box-shadow: 0 6px 20px rgba(201, 168, 76, 0.45);",
      "}",
      "@media (max-width: 720px) {",
      "  #cookie-banner {",
      "    flex-direction: column;",
      "    align-items: stretch;",
      "    gap: 16px;",
      "    padding: 18px 20px;",
      "    bottom: 12px;",
      "    width: calc(100% - 24px);",
      "    border-radius: 12px;",
      "  }",
      "  #cookie-banner .cb-text {",
      "    font-size: 13px;",
      "  }",
      "  #cookie-banner .cb-actions {",
      "    width: 100%;",
      "    gap: 8px;",
      "  }",
      "  #cookie-banner .cb-btn {",
      "    white-space: normal;",
      "    font-size: 13px;",
      "    padding: 11px 8px;",
      "  }",
      "}",
      // Enquanto o aviso está aberto, o fim da página e o botão do WhatsApp ficam acima dele
      "body.cb-aberto .wa-float {",
      "  bottom: calc(var(--cb-altura, 0px) + 24px);",
      "}",
      "@media (prefers-reduced-motion: reduce) {",
      "  #cookie-banner { transition: opacity 0.01ms ease; }",
      "}"
    ].join('\n');
    document.head.appendChild(style);
  }

  function buildBanner() {
    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Aviso de cookies');

    var text = document.createElement('div');
    text.className = 'cb-text';
    text.innerHTML =
      'Usamos cookies de medição (Google Analytics e Meta Pixel) só se você aceitar. Saiba mais na ' +
      '<a href="' + PRIVACY_URL + '">Política de Privacidade</a>.';

    var actions = document.createElement('div');
    actions.className = 'cb-actions';

    var btnEssential = document.createElement('button');
    btnEssential.type = 'button';
    btnEssential.className = 'cb-btn';
    btnEssential.textContent = 'Apenas essenciais';
    btnEssential.setAttribute('data-consent', 'essential');

    var btnAll = document.createElement('button');
    btnAll.type = 'button';
    btnAll.className = 'cb-btn';
    btnAll.textContent = 'Aceitar todos';
    btnAll.setAttribute('data-consent', 'all');

    actions.appendChild(btnEssential);
    actions.appendChild(btnAll);

    banner.appendChild(text);
    banner.appendChild(actions);

    function handleClick(consent) {
      saveConsent(consent);
      if (consent === 'all') loadGTM();
      hideBanner(banner);
      // Quem tinha aceitado e mudou para essenciais: recarrega para parar a medição
      if (consent === 'essential' && gtmCarregado) setTimeout(function () { location.reload(); }, 600);
    }

    btnEssential.addEventListener('click', function () { handleClick('essential'); });
    btnAll.addEventListener('click', function () { handleClick('all'); });

    return banner;
  }

  // Reserva espaço no fim da página do tamanho do aviso
  function reserveSpace(banner) {
    var altura = banner.offsetHeight + 24;
    document.documentElement.style.setProperty('--cb-altura', altura + 'px');
    document.body.style.paddingBottom = altura + 'px';
  }

  function releaseSpace() {
    document.body.classList.remove('cb-aberto');
    document.body.style.paddingBottom = '';
    window.removeEventListener('resize', onResize);
  }

  function onResize() {
    var banner = document.getElementById('cookie-banner');
    if (banner) reserveSpace(banner);
  }

  function showBanner(banner) {
    document.body.appendChild(banner);
    document.body.classList.add('cb-aberto');
    reserveSpace(banner);
    window.addEventListener('resize', onResize);
    // Dois rAFs garantem que o estado inicial seja pintado antes da transição
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.classList.add('cb-visible');
      });
    });
  }

  function hideBanner(banner) {
    releaseSpace();
    banner.classList.remove('cb-visible');
    banner.classList.add('cb-hiding');

    var removed = false;
    function remove() {
      if (removed) return;
      removed = true;
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    }

    banner.addEventListener('transitionend', remove, { once: true });
    // Fallback caso o evento não dispare (ex.: prefers-reduced-motion)
    setTimeout(remove, 600);
  }

  function openBanner() {
    if (document.getElementById('cookie-banner')) return;
    injectStyles();
    var banner = buildBanner();
    showBanner(banner);
  }

  // Links com data-cookie-preferencias reabrem o aviso para mudar a escolha
  function bindPreferenceLinks() {
    var links = document.querySelectorAll('[data-cookie-preferencias]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (e) {
        e.preventDefault();
        openBanner();
      });
    }
  }

  function init() {
    bindPreferenceLinks();
    if (hasValidConsent()) {
      if (getConsent() === 'all') loadGTM();
      return;
    }
    openBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
