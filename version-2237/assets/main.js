(function () {
  const navButton = document.querySelector('[data-nav-toggle]');
  const navMenu = document.querySelector('[data-nav-menu]');

  if (navButton && navMenu) {
    navButton.addEventListener('click', function () {
      navMenu.classList.toggle('is-open');
    });
  }

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  let currentSlide = 0;
  let heroTimer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === currentSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === currentSlide);
    });
  }

  function startHeroTimer() {
    if (heroTimer || slides.length <= 1) {
      return;
    }

    heroTimer = window.setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5200);
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      const index = Number(dot.getAttribute('data-hero-dot')) || 0;
      showSlide(index);
      window.clearInterval(heroTimer);
      heroTimer = null;
      startHeroTimer();
    });
  });

  showSlide(0);
  startHeroTimer();

  const searchInput = document.querySelector('[data-search-input]');
  const typeFilter = document.querySelector('[data-type-filter]');
  const cards = Array.from(document.querySelectorAll('.searchable-card'));

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyFilters() {
    const keyword = normalize(searchInput ? searchInput.value : '');
    const selectedType = normalize(typeFilter ? typeFilter.value : '');

    cards.forEach(function (card) {
      const haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-tags'),
        card.getAttribute('data-year'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type')
      ].join(' '));
      const type = normalize(card.getAttribute('data-type'));
      const matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      const matchedType = !selectedType || type === selectedType;

      card.classList.toggle('is-hidden-by-filter', !(matchedKeyword && matchedType));
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  if (typeFilter) {
    typeFilter.addEventListener('change', applyFilters);
  }
})();
