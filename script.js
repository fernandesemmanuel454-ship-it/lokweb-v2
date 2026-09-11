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

// ---- Carrousel hero ----
(function initHeroCarousel() {
  const carousel = document.getElementById('hero-carousel');
  const urlEl = document.getElementById('mockup-url');
  if (!carousel || !urlEl) return;

  const slides = carousel.querySelectorAll('.carousel-slide');
  if (slides.length < 2) return;

  const setActive = (i) => {
    slides.forEach((s, idx) => s.classList.toggle('is-active', idx === i));
    const url = slides[i].dataset.url;
    if (url) urlEl.textContent = url;
  };

  setActive(0);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;

  let index = 0;
  setInterval(() => {
    index = (index + 1) % slides.length;
    setActive(index);
  }, 4000);
})();

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
