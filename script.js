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

// ---- Formulaire de contact ----
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = 'Envoi en cours\u2026';

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        contactForm.innerHTML =
          '<div style="text-align:center;padding:40px 0;">' +
          '<p style="font-size:1.1rem;font-weight:600;color:var(--text-dark);margin-bottom:8px;">Message envoyé avec succès.</p>' +
          '<p style="font-size:.9rem;color:var(--text-muted);">On vous répond sous 24\u00A0h.</p>' +
          '</div>';
      } else {
        throw new Error('Erreur serveur');
      }
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = originalText;
      alert('Impossible d\u2019envoyer le message. Réessayez ou écrivez à contact@lokweb.lu.');
    }
  });
}
