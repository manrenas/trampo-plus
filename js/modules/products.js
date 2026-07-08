import {
    formatarPrecoProduto,
    produtoPorId,
    produtosEmDestaque,
    produtosPorCategoria
} from '../data/produtos.js';
import { addCartItem, updateCartCount } from './cart.js';

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function productCard(produto, { catalogo = false, fade = false } = {}) {
    const classes = [
        'produto-card',
        catalogo ? 'catalogo-card' : '',
        produto.etiqueta ? 'destaque' : '',
        fade ? 'fade-in' : ''
    ].filter(Boolean).join(' ');

    const etiqueta = produto.etiqueta
        ? `<span class="produto-etiqueta">${escapeHtml(produto.etiqueta)}</span>`
        : '';

    return `
        <article class="${classes}" data-product-id="${escapeHtml(produto.id)}">
            <img src="${escapeHtml(produto.imagem)}" alt="${escapeHtml(produto.alt || produto.nome)}" width="420" height="300" loading="lazy" decoding="async">
            <div class="produto-info">
                ${etiqueta}
                <h3>${escapeHtml(produto.nome)}</h3>
                <p>${escapeHtml(produto.descricao)}</p>
                <span>${escapeHtml(formatarPrecoProduto(produto))}</span>
                <button class="btn btn-primary" type="button" data-add-cart="${escapeHtml(produto.id)}">Adicionar ao Carrinho</button>
            </div>
        </article>
    `;
}

function renderFeaturedProducts() {
    const containers = document.querySelectorAll('[data-featured-products]');

    containers.forEach((container) => {
        const requestedIds = container.dataset.featuredProducts
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean);
        const featuredProducts = produtosEmDestaque();
        const products = requestedIds.length
            ? requestedIds.map(produtoPorId).filter(Boolean)
            : featuredProducts;

        container.innerHTML = products.map((produto) => productCard(produto, { fade: true })).join('');
    });
}

function renderCategoryProducts() {
    const containers = document.querySelectorAll('[data-products-category]');

    containers.forEach((container) => {
        const category = container.dataset.productsCategory;
        const products = produtosPorCategoria(category);

        container.innerHTML = products.map((produto) => productCard(produto, { catalogo: true })).join('');
    });
}

function bindCartActions() {
    document.addEventListener('click', (event) => {
        const button = event.target.closest('[data-add-cart]');

        if (!button) {
            return;
        }

        const productId = button.dataset.addCart;

        if (!productId) {
            return;
        }

        addCartItem(productId);

        const previousLabel = button.textContent;
        button.textContent = 'Adicionado';
        button.setAttribute('aria-label', 'Produto adicionado ao carrinho');

        window.setTimeout(() => {
            button.textContent = previousLabel;
            button.removeAttribute('aria-label');
        }, 1000);
    });
}

export function iniciarProdutos() {
    renderFeaturedProducts();
    renderCategoryProducts();
    bindCartActions();
    updateCartCount();
}
