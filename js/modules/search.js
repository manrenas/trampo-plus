import { buscarProdutos, produtos } from '../data/produtos.js';

function normalize(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9\s]/g, '');
}

function inferProductId(card) {
  const title = card.querySelector('h3')?.textContent?.trim() || '';
  if (!title) {
    return '';
  }

  const directMatch = produtos.find((produto) => normalize(produto.nome) === normalize(title));
  if (directMatch) {
    return directMatch.id;
  }

  return produtos.find((produto) => normalize(produto.nome).includes(normalize(title)) || normalize(title).includes(normalize(produto.nome)))?.id || '';
}

export function iniciarPesquisa() {
  const searchWrapper = document.querySelector('[data-search]');
  const searchForm = document.querySelector('[data-search-form]');
  const searchInput = document.querySelector('[data-search-input]');
  const searchSuggestions = document.querySelector('[data-search-suggestions]');
  const searchToggle = document.querySelector('[data-search-toggle]');

  if (!searchWrapper || !searchForm || !searchInput || !searchSuggestions || !searchToggle) {
    return;
  }

  const renderSuggestions = (value = '') => {
    const matches = buscarProdutos(value);

    if (!value.trim() && matches.length === 0) {
      searchSuggestions.innerHTML = '';
      searchSuggestions.classList.remove('is-visible');
      return;
    }

    searchSuggestions.innerHTML = matches
      .map((produto) => `
        <li>
          <button class="search-suggestion" type="button" data-search-result="${produto.nome}">
            <span>${produto.nome}</span>
            <small>${produto.categoria}</small>
          </button>
        </li>
      `)
      .join('');

    searchSuggestions.classList.toggle('is-visible', matches.length > 0);
  };

  const openSearch = () => {
    searchWrapper.classList.add('is-open');
    searchToggle.setAttribute('aria-expanded', 'true');
    searchInput.focus();
    renderSuggestions(searchInput.value);
  };

  const closeSearch = () => {
    searchWrapper.classList.remove('is-open');
    searchToggle.setAttribute('aria-expanded', 'false');
    searchSuggestions.classList.remove('is-visible');
    searchSuggestions.innerHTML = '';
  };

  searchToggle.addEventListener('click', (event) => {
    event.preventDefault();
    const isOpen = searchWrapper.classList.contains('is-open');

    if (isOpen) {
      closeSearch();
      return;
    }

    openSearch();
  });

  searchInput.addEventListener('input', () => {
    renderSuggestions(searchInput.value);
  });

  searchInput.addEventListener('focus', () => {
    renderSuggestions(searchInput.value);
  });

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();

    if (!query) {
      window.location.href = '../html/produtos.html';
      return;
    }

    window.location.href = `../html/produtos.html?q=${encodeURIComponent(query)}`;
  });

  searchSuggestions.addEventListener('click', (event) => {
    const button = event.target.closest('[data-search-result]');

    if (!button) {
      return;
    }

    searchInput.value = button.dataset.searchResult;
    searchForm.requestSubmit();
  });

  document.addEventListener('click', (event) => {
    if (!searchWrapper.contains(event.target)) {
      closeSearch();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSearch();
    }
  });

  const params = new URLSearchParams(window.location.search);
  const queryParam = params.get('q');

  if (window.location.pathname.includes('../html/produtos.html') && queryParam) {
    searchInput.value = queryParam;
    highlightMatches(queryParam);
  }
}

function highlightMatches(query) {
  const cards = Array.from(document.querySelectorAll('.produto-card'));
  if (!cards.length) {
    return;
  }

  cards.forEach((card) => {
    if (!card.dataset.productId) {
      const inferredId = inferProductId(card);
      if (inferredId) {
        card.dataset.productId = inferredId;
      }
    }
  });

  const normalizedQuery = normalize(query);
  const matches = new Set(
    buscarProdutos(query)
      .map((produto) => produto.id)
  );

  cards.forEach((card) => {
    const isMatch = matches.has(card.dataset.productId);
    card.classList.toggle('is-highlighted', isMatch);
    card.classList.toggle('is-muted', !isMatch && normalizedQuery);
  });

  const firstMatch = cards.find((card) => matches.has(card.dataset.productId));
  if (firstMatch) {
    firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
