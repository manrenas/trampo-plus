import { formatarKwanza, formatarPrecoProduto, produtoPorId } from '../data/produtos.js';
import {
    CART_UPDATED_EVENT,
    clearCart,
    readCart,
    removeCartItem,
    setCartItemQuantity,
    updateCartCount,
    writeCart
} from './cart.js';

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function iniciarCheckout() {
    const form = document.querySelector('#checkout-form');
    const itemsContainer = document.querySelector('#checkout-items');
    const totalContainer = document.querySelector('#checkout-total');
    const message = document.querySelector('#checkout-message');

    if (!form || !itemsContainer || !totalContainer) {
        return;
    }

    const getValidCart = () => {
        const cart = readCart();
        const validCart = cart.filter((item) => produtoPorId(item.id));

        if (validCart.length !== cart.length) {
            writeCart(validCart);
        }

        return validCart;
    };

    const render = () => {
        const cart = getValidCart();
        itemsContainer.innerHTML = '';

        if (!cart.length) {
            itemsContainer.innerHTML = '<p>O carrinho está vazio.</p>';
            totalContainer.textContent = formatarKwanza(0);
            updateCartCount();
            return;
        }

        const itemMarkup = cart.map((item) => {
            const produto = produtoPorId(item.id);
            const subtotal = produto.preco * item.quantity;

            return `
                <div class="checkout-item" data-checkout-item="${escapeHtml(item.id)}">
                    <div>
                        <strong>${escapeHtml(produto.nome)}</strong>
                        <p>${escapeHtml(formatarPrecoProduto(produto))}</p>
                    </div>
                    <div class="checkout-item-actions">
                        <span>${escapeHtml(formatarKwanza(subtotal))}</span>
                        <div class="quantity-control" aria-label="Quantidade de ${escapeHtml(produto.nome)}">
                            <button type="button" data-quantity-action="decrease" data-product-id="${escapeHtml(item.id)}" aria-label="Diminuir quantidade">-</button>
                            <input type="number" min="1" value="${item.quantity}" data-quantity-input data-product-id="${escapeHtml(item.id)}" aria-label="Quantidade">
                            <button type="button" data-quantity-action="increase" data-product-id="${escapeHtml(item.id)}" aria-label="Aumentar quantidade">+</button>
                        </div>
                        <button class="remove-cart-item" type="button" data-remove-item="${escapeHtml(item.id)}">Remover</button>
                    </div>
                </div>
            `;
        }).join('');

        itemsContainer.innerHTML = itemMarkup;
        totalContainer.textContent = formatarKwanza(
            cart.reduce((sum, item) => {
                const produto = produtoPorId(item.id);
                return sum + (produto ? produto.preco * item.quantity : 0);
            }, 0)
        );
        updateCartCount();
    };

    itemsContainer.addEventListener('click', (event) => {
        const removeButton = event.target.closest('[data-remove-item]');
        const quantityButton = event.target.closest('[data-quantity-action]');

        if (removeButton) {
            removeCartItem(removeButton.dataset.removeItem);
            render();
            return;
        }

        if (!quantityButton) {
            return;
        }

        const productId = quantityButton.dataset.productId;
        const currentItem = readCart().find((item) => item.id === productId);
        const currentQuantity = currentItem?.quantity || 1;
        const nextQuantity = quantityButton.dataset.quantityAction === 'increase'
            ? currentQuantity + 1
            : currentQuantity - 1;

        setCartItemQuantity(productId, nextQuantity);
        render();
    });

    itemsContainer.addEventListener('change', (event) => {
        const input = event.target.closest('[data-quantity-input]');

        if (!input) {
            return;
        }

        setCartItemQuantity(input.dataset.productId, input.value);
        render();
    });

    form.addEventListener('submit', (event) => {
    event.preventDefault();

    const cart = getValidCart();

    if (!cart.length) {
        if (message) {
            message.textContent = 'O carrinho está vazio.';
            message.classList.remove('visually-hidden');
        }
        return;
    }

    const nome = form.querySelector('#nome').value;
    const telefone = form.querySelector('#telefone').value;
    const whatsapp = form.querySelector('#whatsapp').value;
    const endereco = form.querySelector('#endereco').value;
    const data = form.querySelector('#data').value;
    const hora = form.querySelector('#hora').value;
    const observacoes = form.querySelector('#observacoes').value;


    let mensagem = `🍰 *Nova encomenda - Sonhos da Tarde*\n\n`;

    mensagem += `👤 *Cliente:* ${nome}\n`;
    mensagem += `📞 *Telefone:* ${telefone}\n`;
    mensagem += `📱 *WhatsApp:* ${whatsapp}\n`;
    mensagem += `📍 *Endereço:* ${endereco}\n`;
    mensagem += `📅 *Data pretendida:* ${data}\n`;
    mensagem += `⏰ *Hora pretendida:* ${hora}\n\n`;

    mensagem += `🧁 *Produtos:*\n`;

    let total = 0;

    cart.forEach((item) => {
        const produto = produtoPorId(item.id);

        if (produto) {
            const subtotal = produto.preco * item.quantity;
            total += subtotal;

            mensagem += `• ${produto.nome} x${item.quantity} - ${formatarKwanza(subtotal)}\n`;
        }
    });

    mensagem += `\n💰 *Total:* ${formatarKwanza(total)}\n`;

    if (observacoes.trim()) {
        mensagem += `\n📝 *Observações:* ${observacoes}`;
    }


    const numeroEmpresa = '244926907474';

    const urlWhatsApp =
        `https://wa.me/${numeroEmpresa}?text=${encodeURIComponent(mensagem)}`;


    window.open(urlWhatsApp, '_blank');


    clearCart();
    form.reset();

    if (message) {
        message.textContent =
            'Pedido preparado. A confirmação será feita pelo WhatsApp.';
        message.classList.remove('visually-hidden');
    }

    render();
});

    window.addEventListener(CART_UPDATED_EVENT, render);
    render();
}
