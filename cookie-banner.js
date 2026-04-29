(function () {
  'use strict';

  var STORAGE_KEY = 'cookie_consent';
  var TIMESTAMP_KEY = 'cookie_consent_timestamp';
  var EXPIRY_DAYS = 365;
  var PRIVACY_URL = '/privacidade';

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
      "#cookie-banner .cb-actions {",
      "  display: flex;",
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
      "}",
      "#cookie-banner .cb-btn:focus-visible {",
      "  outline: 2px solid #C9A84C;",
      "  outline-offset: 2px;",
      "}",
      "#cookie-banner .cb-btn-secondary {",
      "  background: transparent;",
      "  border: 1px solid rgba(255, 255, 255, 0.5);",
      "  color: #FFFFFF;",
      "}",
      "#cookie-banner .cb-btn-secondary:hover {",
      "  background: rgba(255, 255, 255, 0.08);",
      "  border-color: #FFFFFF;",
      "}",
      "#cookie-banner .cb-btn-primary {",
      "  background: #C9A84C;",
      "  border: 1px solid #C9A84C;",
      "  color: #0A1628;",
      "  box-shadow: 0 4px 16px rgba(201, 168, 76, 0.25);",
      "}",
      "#cookie-banner .cb-btn-primary:hover {",
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
      "  #cookie-banner .cb-actions {",
      "    flex-direction: column-reverse;",
      "    width: 100%;",
      "  }",
      "  #cookie-banner .cb-btn {",
      "    width: 100%;",
      "    padding: 12px 20px;",
      "  }",
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
      'Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa ' +
      '<a href="' + PRIVACY_URL + '">Política de Privacidade</a>.';

    var actions = document.createElement('div');
    actions.className = 'cb-actions';

    var btnEssential = document.createElement('button');
    btnEssential.type = 'button';
    btnEssential.className = 'cb-btn cb-btn-secondary';
    btnEssential.textContent = 'Apenas essenciais';
    btnEssential.setAttribute('data-consent', 'essential');

    var btnAll = document.createElement('button');
    btnAll.type = 'button';
    btnAll.className = 'cb-btn cb-btn-primary';
    btnAll.textContent = 'Aceitar todos';
    btnAll.setAttribute('data-consent', 'all');

    actions.appendChild(btnEssential);
    actions.appendChild(btnAll);

    banner.appendChild(text);
    banner.appendChild(actions);

    function handleClick(consent) {
      saveConsent(consent);
      hideBanner(banner);
    }

    btnEssential.addEventListener('click', function () { handleClick('essential'); });
    btnAll.addEventListener('click', function () { handleClick('all'); });

    return banner;
  }

  function showBanner(banner) {
    document.body.appendChild(banner);
    // Dois rAFs garantem que o estado inicial seja pintado antes da transição
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.classList.add('cb-visible');
      });
    });
  }

  function hideBanner(banner) {
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

  function init() {
    if (hasValidConsent()) return;
    if (document.getElementById('cookie-banner')) return;
    injectStyles();
    var banner = buildBanner();
    showBanner(banner);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
