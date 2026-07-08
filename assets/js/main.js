(function () {
  'use strict';

  const tabButtons = document.querySelectorAll('.nav-tabs button[data-tab]');
  const tabLinks = document.querySelectorAll('[data-tab-link]');
  const sections = document.querySelectorAll('.page-section');
  const navTabs = document.getElementById('navTabs');
  const navToggle = document.getElementById('navToggle');
  const siteHeader = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');

  function headerOffset() {
    return siteHeader.offsetHeight + 12;
  }

  function scrollToSection(id, updateHash = true) {
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset();
    window.scrollTo({ top, behavior: 'smooth' });
    if (updateHash) {
      history.replaceState(null, '', '#' + id);
    }
    navTabs.classList.remove('open');
  }

  function setActiveNav(id) {
    tabButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === id);
    });
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => scrollToSection(btn.dataset.tab));
  });

  tabLinks.forEach((el) => {
    if (el.matches('button[data-tab]')) return;
    el.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToSection(el.dataset.tabLink);
    });
  });

  navToggle.addEventListener('click', () => {
    navTabs.classList.toggle('open');
  });

  const initialTab = window.location.hash.replace('#', '');
  if (initialTab && document.getElementById(initialTab)) {
    window.addEventListener('load', () => scrollToSection(initialTab, false));
  }

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.id);
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach((section) => spyObserver.observe(section));

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 40;
    siteHeader.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('visible', window.scrollY > 500);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const filterButtons = document.querySelectorAll('.filter-btn');
  const packageCards = document.querySelectorAll('.package-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      packageCards.forEach((card) => {
        const match = filter === 'all' || card.dataset.cat === filter;
        card.classList.toggle('show', match);
      });
    });
  });

  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach((other) => {
        other.classList.remove('open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const galleryItems = Array.from(document.querySelectorAll('#galleryGrid .gallery-item'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let lightboxIndex = 0;

  function openLightbox(index) {
    lightboxIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[lightboxIndex];
    const img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = item.dataset.caption || '';
    lightbox.classList.add('open');
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => openLightbox(lightboxIndex - 1));
  lightboxNext.addEventListener('click', () => openLightbox(lightboxIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(lightboxIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(lightboxIndex + 1);
  });

  const WHATSAPP_NUMBER = '923117888373';
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = contactForm.fullName.value.trim();
      const phone = contactForm.phone.value.trim();
      const email = contactForm.email.value.trim();
      const destination = contactForm.destination.value;
      const message = contactForm.message.value.trim();

      const lines = [
        'New Inquiry — JD\'s Tourism Wazirabad',
        `Name: ${fullName}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        destination ? `Destination: ${destination}` : null,
        `Message: ${message}`,
      ].filter(Boolean);

      const waText = encodeURIComponent(lines.join('\n'));
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

      formStatus.style.display = 'block';
      window.open(waUrl, '_blank', 'noopener');
      contactForm.reset();
      setTimeout(() => {
        formStatus.style.display = 'none';
      }, 6000);
    });
  }
})();
