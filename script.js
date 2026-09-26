/* ============================
   LokWeb — Script principal
   ============================ */

// ---- Lucide Icons ----
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

// ---- Menu mobile ----
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('active', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Fermer le menu au clic sur un lien
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---- Animations d'apparition (Intersection Observer) ----
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
} else {
  // Si reduced-motion, tout est visible immédiatement
  document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
}

// ---- Galerie de restaurants du hero ----
const heroGallery = document.getElementById('hero-gallery');
if (heroGallery) {
  heroGallery.classList.add('is-enhanced');
  const examples = [
    { label: 'Pizzeria', image: 'pizzeria.jpg', alt: 'Pizzaiolo préparant une pizza dans son restaurant', headline: 'Des pizzas faites avec soin.', cta: 'Découvrir la carte' },
    { label: 'Snack', image: 'snack.jpg', alt: 'Restaurateur préparant un burger dans son snack', headline: 'La pause qui donne envie.', cta: 'Voir notre menu' },
    { label: 'Kebab', image: 'kebab.jpg', alt: 'Cuisinier préparant un kebab dans son restaurant', headline: 'Préparé devant vous.', cta: 'Voir les spécialités' },
    { label: 'Brasserie', image: 'brasserie.jpg', alt: 'Équipe dressant des plats dans une brasserie', headline: 'Une table à partager.', cta: 'Découvrir le restaurant' },
    { label: 'Cuisine ouest-africaine', image: 'africaine.jpg', alt: 'Chef dressant un plat de riz jollof dans son restaurant', headline: 'Des saveurs à découvrir.', cta: 'Explorer la carte' },
    { label: 'Cuisine chinoise', image: 'chinoise.jpg', alt: 'Chef préparant des raviolis dans son restaurant', headline: 'Le plaisir du fait maison.', cta: 'Découvrir nos plats' }
  ];
  const stage = document.getElementById('hero-gallery-stage');
  const photo = document.getElementById('hero-gallery-photo');
  const preview = document.getElementById('hero-gallery-preview');
  const kicker = document.getElementById('hero-gallery-kicker');
  const headline = document.getElementById('hero-gallery-headline');
  const cta = document.getElementById('hero-gallery-cta');
  const status = document.getElementById('hero-gallery-status');
  const toggle = document.getElementById('hero-motion-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let timer = null;
  let pausedByUser = reducedMotion.matches;
  let changeTimeout = null;
  examples.slice(1).forEach(example => {
    const preload = new Image();
    preload.src = `public/images/restaurants/${example.image}`;
  });

  function showExample(index) {
    current = (index + examples.length) % examples.length;
    const example = examples[current];
    stage.classList.add('is-changing');
    window.clearTimeout(changeTimeout);
    changeTimeout = window.setTimeout(() => {
      const path = `public/images/restaurants/${example.image}`;
      photo.src = path;
      photo.alt = example.alt;
      preview.src = path;
      kicker.textContent = example.label;
      headline.textContent = example.headline;
      cta.innerHTML = `${example.cta} <span aria-hidden="true">↗</span>`;
      status.textContent = `${example.label} · ${current + 1} sur ${examples.length}`;
      stage.classList.remove('is-changing');
    }, reducedMotion.matches ? 0 : 180);
  }

  function syncTimer() {
    window.clearInterval(timer);
    timer = null;
    if (!pausedByUser && !document.hidden && !reducedMotion.matches) {
      timer = window.setInterval(() => showExample(current + 1), 4500);
    }
    toggle.textContent = pausedByUser ? 'Défiler' : 'Pause';
    toggle.setAttribute('aria-label', pausedByUser ? 'Relancer le défilement' : 'Mettre en pause le défilement');
  }

  document.getElementById('hero-gallery-prev').addEventListener('click', () => { showExample(current - 1); syncTimer(); });
  document.getElementById('hero-gallery-next').addEventListener('click', () => { showExample(current + 1); syncTimer(); });
  toggle.addEventListener('click', () => { pausedByUser = !pausedByUser; syncTimer(); });
  document.addEventListener('visibilitychange', syncTimer);
  reducedMotion.addEventListener('change', syncTimer);
  syncTimer();
}

// ---- Mesure des intentions et transmissions (sans données du formulaire) ----
function trackContactEvent(name, parameters) {
  try {
    const consent = window.lokwebConsent;
    if (!consent || !consent.hasMarketingConsent() || typeof window.fbq !== 'function') return;
    window.fbq('trackCustom', name, parameters);
  } catch (error) {
    // Une erreur de mesure ne doit jamais interrompre un contact.
  }
}

// ---- Formulaire de contact ----
const contactForm = document.querySelector('.contact-form');
const contactSources = new Set(['contact_direct', 'header', 'hero', 'tarifs', 'a_propos', 'footer_cta']);
let selectedOffer = 'Général';
let selectedSource = 'contact_direct';

function syncContactContext() {
  if (!contactForm) return;
  const offer = contactForm.querySelector('[name="offer"]');
  const source = contactForm.querySelector('[name="source"]');
  const context = document.getElementById('contact-context');
  if (offer) offer.value = selectedOffer;
  if (source) source.value = selectedSource;
  if (context) {
    context.textContent = selectedOffer === 'Business Local'
      ? 'Votre échange concerne Business Local : 290 € HT de mise en service puis 99 € HT/mois.'
      : '';
    context.hidden = selectedOffer !== 'Business Local';
  }
}

if (contactForm) {
  let isSubmitting = false;
  let isSubmitted = false;
  syncContactContext();

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isSubmitting || isSubmitted || !contactForm.reportValidity()) return;

    const btn = contactForm.querySelector('button[type="submit"]');
    const status = document.getElementById('form-status');
    const originalText = btn.innerHTML;
    isSubmitting = true;
    btn.disabled = true;
    btn.textContent = 'Envoi en cours…';
    contactForm.setAttribute('aria-busy', 'true');
    if (status) {
      status.setAttribute('role', 'status');
      status.textContent = 'Envoi en cours…';
    }
    syncContactContext();

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (!res.ok) throw new Error('Envoi non accepté');

      // L'acceptation technique ne prouve ni réception finale ni qualification.
      isSubmitted = true;
      trackContactEvent('FormSubmission', { status: 'accepted' });
      if (status) {
        status.textContent = 'Votre demande a été transmise. Je vous réponds sous un jour ouvré.';
        status.setAttribute('tabindex', '-1');
        status.focus({ preventScroll: true });
      }
      btn.textContent = 'Demande transmise';
    } catch (error) {
      if (status) {
        status.setAttribute('role', 'alert');
        status.textContent = 'Votre demande n’a pas pu être transmise. Réessayez ou écrivez à info@lokweb.lu.';
        status.setAttribute('tabindex', '-1');
        status.focus({ preventScroll: true });
      }
    } finally {
      isSubmitting = false;
      contactForm.setAttribute('aria-busy', 'false');
      if (!isSubmitted) {
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
    }
  });
}

// ---- Contexte du contact et clics (la navigation du lien reste native) ----
document.addEventListener('click', (e) => {
  const link = e.target.closest && e.target.closest('a');
  if (!link) return;

  const href = link.getAttribute('href') || '';
  if (href === '#contact' && contactForm) {
    const source = contactSources.has(link.dataset.contactSource)
      ? link.dataset.contactSource : 'contact_direct';
    if (link.dataset.offer === 'business-local') {
      selectedOffer = 'Business Local';
      selectedSource = source;
    } else if (selectedOffer !== 'Business Local') {
      selectedSource = source;
    }
    syncContactContext();
  }

  let channel;
  if (/^mailto:/i.test(href)) channel = 'email';
  else if (/^tel:/i.test(href)) channel = 'phone';
  else {
    try {
      const url = new URL(href, window.location.href);
      if (url.protocol === 'https:' && url.hostname === 'wa.me') channel = 'whatsapp';
    } catch (error) { /* Un lien mal formé n'est pas un événement de contact. */ }
  }
  if (channel) trackContactEvent('ContactClick', { channel });
});
