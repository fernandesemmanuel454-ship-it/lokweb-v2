/* ============================================================
   LokWeb — Gestion du consentement cookies (RGPD)
   ------------------------------------------------------------
   - 3 catégories : necessary (toujours actif), analytics, marketing
   - Refus par défaut tant que l'utilisateur n'a pas agi
   - Choix persisté dans localStorage (clé : lokweb_cookie_consent)
   - Le Pixel Meta ne se charge QUE si "marketing" === true
   - Réversible : accepter/refuser recharge ou neutralise le pixel
   Aucune librairie tierce. JS vanilla.
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'lokweb_cookie_consent';
  var META_PIXEL_ID = '1725814988619634';

  /* -------- Persistance -------- */
  function readConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function saveConsent(consent) {
    consent.necessary = true;            // toujours actif
    consent.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch (e) { /* stockage indisponible : on continue sans persister */ }
  }

  /* -------- Pixel Meta (chargé uniquement sur consentement marketing) -------- */
  function loadMetaPixel() {
    if (window.fbq) {                    // déjà chargé : on (re)déclenche un PageView
      try { window.fbq('track', 'PageView'); } catch (e) {}
      return;
    }
    /* Snippet officiel Meta, exécuté seulement ici (après consentement) */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  /* Désactive le tracking pixel pour la session courante (après retrait du consentement). */
  function disableMetaPixel() {
    if (window.fbq) {
      try { window.fbq('consent', 'revoke'); } catch (e) {}
    }
  }

  /* Applique les conséquences techniques d'un consentement donné. */
  function applyConsent(consent) {
    if (consent && consent.marketing) {
      loadMetaPixel();
    } else {
      disableMetaPixel();
    }
    /* "analytics" : pas d'outil branché aujourd'hui. Hook prêt si GA4 ajouté plus tard. */
  }

  /* -------- Construction de l'UI -------- */
  function buildUI() {
    /* Bandeau */
    var banner = document.createElement('div');
    banner.className = 'cc-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Consentement aux cookies');
    banner.innerHTML =
      '<p class="cc-title">Nous respectons votre vie privée</p>' +
      '<p class="cc-text">Nous utilisons des cookies pour améliorer votre expérience et mesurer ' +
      'l’efficacité de nos publicités. Vous pouvez accepter, refuser ou personnaliser votre choix. ' +
      'Vos préférences sont enregistrées et modifiables à tout moment.</p>' +
      '<div class="cc-actions">' +
        '<button type="button" class="cc-btn cc-btn--refuse" data-cc="refuse">Tout refuser</button>' +
        '<button type="button" class="cc-btn cc-btn--custom" data-cc="customize">Personnaliser</button>' +
        '<button type="button" class="cc-btn cc-btn--accept" data-cc="accept">Tout accepter</button>' +
      '</div>' +
      '<a class="cc-link" href="politique-de-confidentialite.html">Voir notre politique de confidentialité</a>';

    /* Modale de personnalisation */
    var overlay = document.createElement('div');
    overlay.className = 'cc-overlay';
    overlay.innerHTML =
      '<div class="cc-modal" role="dialog" aria-modal="true" aria-labelledby="cc-modal-title">' +
        '<h2 class="cc-modal-title" id="cc-modal-title">Personnaliser vos cookies</h2>' +
        '<p class="cc-modal-intro">Choisissez les catégories que vous autorisez. ' +
        'Vous pouvez modifier ces réglages à tout moment via « Gérer mes cookies » en bas de page.</p>' +

        '<div class="cc-cat">' +
          '<div><p class="cc-cat-name">Strictement nécessaires</p>' +
          '<p class="cc-cat-desc">Indispensables au fonctionnement du site. Toujours actifs.</p></div>' +
          '<label class="cc-switch"><input type="checkbox" checked disabled aria-label="Cookies nécessaires (toujours actifs)"><span class="cc-slider"></span></label>' +
        '</div>' +

        '<div class="cc-cat">' +
          '<div><p class="cc-cat-name">Mesure d’audience</p>' +
          '<p class="cc-cat-desc">Nous aident à comprendre comment le site est utilisé, de façon anonyme.</p></div>' +
          '<label class="cc-switch"><input type="checkbox" data-cc-cat="analytics" aria-label="Cookies de mesure d’audience"><span class="cc-slider"></span></label>' +
        '</div>' +

        '<div class="cc-cat">' +
          '<div><p class="cc-cat-name">Marketing</p>' +
          '<p class="cc-cat-desc">Permettent de mesurer l’efficacité de nos publicités (Meta / Facebook).</p></div>' +
          '<label class="cc-switch"><input type="checkbox" data-cc-cat="marketing" aria-label="Cookies marketing"><span class="cc-slider"></span></label>' +
        '</div>' +

        '<div class="cc-modal-actions">' +
          '<button type="button" class="cc-btn cc-btn--refuse" data-cc="refuse">Tout refuser</button>' +
          '<button type="button" class="cc-btn cc-btn--save" data-cc="save">Enregistrer mes choix</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(banner);
    document.body.appendChild(overlay);
    return { banner: banner, overlay: overlay };
  }

  /* -------- Visibilité -------- */
  function show(el) { el.classList.add('cc-visible'); }
  function hide(el) { el.classList.remove('cc-visible'); }

  /* -------- Init -------- */
  function init() {
    var ui = buildUI();
    var banner = ui.banner;
    var overlay = ui.overlay;
    var analyticsInput = overlay.querySelector('[data-cc-cat="analytics"]');
    var marketingInput = overlay.querySelector('[data-cc-cat="marketing"]');

    var existing = readConsent();

    /* Au premier chargement : si pas de choix enregistré, on applique le refus
       par défaut et on montre le bandeau. Le pixel ne part donc PAS. */
    if (existing) {
      applyConsent(existing);
    } else {
      applyConsent({ necessary: true, analytics: false, marketing: false });
      show(banner);
    }

    function setAll(value) {
      var consent = { necessary: true, analytics: value, marketing: value };
      saveConsent(consent);
      applyConsent(consent);
      hide(banner);
      hide(overlay);
    }

    function openModal() {
      var c = readConsent() || { analytics: false, marketing: false };
      analyticsInput.checked = !!c.analytics;
      marketingInput.checked = !!c.marketing;
      hide(banner);
      show(overlay);
    }

    function saveCustom() {
      var consent = {
        necessary: true,
        analytics: analyticsInput.checked,
        marketing: marketingInput.checked
      };
      saveConsent(consent);
      applyConsent(consent);
      hide(overlay);
      hide(banner);
    }

    /* Délégation de clics sur bandeau + modale */
    [banner, overlay].forEach(function (root) {
      root.addEventListener('click', function (e) {
        var action = e.target.getAttribute && e.target.getAttribute('data-cc');
        if (!action) return;
        if (action === 'accept') setAll(true);
        else if (action === 'refuse') setAll(false);
        else if (action === 'customize') openModal();
        else if (action === 'save') saveCustom();
      });
    });

    /* Fermer la modale en cliquant hors de la boîte */
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        hide(overlay);
        if (!readConsent()) show(banner); // pas encore de choix : on remontre le bandeau
      }
    });

    /* Échap ferme la modale */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('cc-visible')) {
        hide(overlay);
        if (!readConsent()) show(banner);
      }
    });

    /* Bouton "Gérer mes cookies" (footer) — réouvre la modale à tout moment */
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-cc-open]');
      if (t) { e.preventDefault(); openModal(); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
