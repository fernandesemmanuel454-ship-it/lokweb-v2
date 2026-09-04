(function () {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  const langButtons = document.querySelectorAll('[data-lang]');
  const translatedNodes = document.querySelectorAll('[data-fr][data-pt]');
  const todayHours = document.querySelector('[data-today-hours]');
  const orderDrawer = document.querySelector('[data-order-drawer]');
  const openOrderButtons = document.querySelectorAll('[data-open-order]');
  const demoOrderButtons = document.querySelectorAll('[data-demo-order]');
  const closeOrderButtons = document.querySelectorAll('[data-close-order]');
  const orderSelection = document.querySelector('[data-order-selection]');
  const upsellDemo = document.querySelector('[data-upsell-demo]');
  const upsellOptions = document.querySelectorAll('[data-upsell-option]');
  const drawerTitle = document.querySelector('#drawer-title');
  let lastFocusedElement = null;
  let currentLanguage = 'fr';
  let selectedItem = null;

  const schedules = {
    mon: '11:30–15:00 · 18:45–22:00',
    tue: '11:30–15:00 · 18:45–22:00',
    wed: '11:30–15:00 · 18:45–22:00',
    thu: '11:30–15:00 · 18:45–22:00',
    fri: '11:30–15:00 · 18:45–23:00',
    sat: '11:30–15:00 · 18:45–23:00',
    sun: '11:30–15:00 · 18:45–23:00'
  };

  const whatsappMessages = {
    fr: 'Bonjour Le Diplomate, je souhaite réserver une table.',
    pt: 'Olá Le Diplomate, gostaria de reservar uma mesa.'
  };

  const rodizioMessages = {
    fr: 'Bonjour Le Diplomate, je souhaite des informations sur le rodízio.',
    pt: 'Olá Le Diplomate, gostaria de receber informações sobre o rodízio.'
  };

  function setLanguage(language) {
    currentLanguage = language;
    document.documentElement.lang = language;
    translatedNodes.forEach((node) => {
      node.textContent = node.dataset[language];
    });

    langButtons.forEach((button) => {
      const isActive = button.dataset.lang === language;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    document.querySelectorAll('[data-whatsapp-link]').forEach((link) => {
      link.href = `https://wa.me/352691103489?text=${encodeURIComponent(whatsappMessages[language])}`;
    });

    const rodizioLink = document.querySelector('[data-rodizio-link]');
    if (rodizioLink) {
      rodizioLink.href = `https://wa.me/352691103489?text=${encodeURIComponent(rodizioMessages[language])}`;
    }

    nav?.setAttribute('aria-label', language === 'fr' ? 'Navigation principale' : 'Navegação principal');
    document.querySelectorAll('.language-switch').forEach((switcher) => {
      switcher.setAttribute('aria-label', language === 'fr' ? 'Choisir la langue' : 'Escolher o idioma');
    });
    updateOrderDrawerCopy();
    localStorage.setItem('diplomate-language', language);
  }

  function updateOrderDrawerCopy() {
    if (!drawerTitle || !orderSelection || !upsellDemo) return;
    if (!selectedItem) {
      drawerTitle.textContent = currentLanguage === 'fr' ? 'Choisissez une plateforme' : 'Escolha uma plataforma';
      orderSelection.hidden = true;
      upsellDemo.hidden = true;
      return;
    }

    const itemName = selectedItem[currentLanguage];
    drawerTitle.textContent = currentLanguage === 'fr' ? 'Complétez votre commande' : 'Complete o seu pedido';
    orderSelection.textContent = currentLanguage === 'fr' ? `${itemName} ajouté au panier` : `${itemName} adicionado ao carrinho`;
    orderSelection.hidden = false;
    upsellDemo.hidden = false;
  }

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  function openOrderDrawer(event, itemButton) {
    event.preventDefault();
    if (!orderDrawer) return;
    lastFocusedElement = event.currentTarget;
    selectedItem = itemButton ? {
      fr: itemButton.dataset.itemFr,
      pt: itemButton.dataset.itemPt
    } : null;
    upsellOptions.forEach((option) => {
      option.classList.remove('is-selected');
      option.setAttribute('aria-pressed', 'false');
    });
    updateOrderDrawerCopy();
    orderDrawer.hidden = false;
    document.body.classList.add('is-locked');
    orderDrawer.querySelector('.order-drawer__close')?.focus();
  }

  function closeOrderDrawer() {
    if (!orderDrawer) return;
    orderDrawer.hidden = true;
    document.body.classList.remove('is-locked');
    lastFocusedElement?.focus();
  }

  navToggle?.addEventListener('click', () => {
    const willOpen = navToggle.getAttribute('aria-expanded') !== 'true';
    nav?.classList.toggle('is-open', willOpen);
    navToggle.setAttribute('aria-expanded', String(willOpen));
  });

  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
  langButtons.forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
  openOrderButtons.forEach((button) => button.addEventListener('click', openOrderDrawer));
  demoOrderButtons.forEach((button) => button.addEventListener('click', (event) => openOrderDrawer(event, button)));
  closeOrderButtons.forEach((button) => button.addEventListener('click', closeOrderDrawer));
  upsellOptions.forEach((option) => option.addEventListener('click', () => {
    const isSelected = option.classList.toggle('is-selected');
    option.setAttribute('aria-pressed', String(isSelected));
  }));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeNav();
      if (orderDrawer && !orderDrawer.hidden) closeOrderDrawer();
    }
  });

  if (todayHours) {
    const weekday = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      timeZone: 'Europe/Luxembourg'
    }).format(new Date()).toLowerCase();
    todayHours.textContent = schedules[weekday] || schedules.mon;
  }

  const savedLanguage = localStorage.getItem('diplomate-language');
  setLanguage(savedLanguage === 'pt' ? 'pt' : 'fr');
})();
