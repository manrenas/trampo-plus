export const CART_STORAGE_KEY = 'sonhos-cart';
export const CART_UPDATED_EVENT = 'sonhos-cart-updated';

function sanitizeItem(item) {
    const quantity = Number(item?.quantity);

    if (!item?.id || !Number.isFinite(quantity) || quantity <= 0) {
        return null;
    }

    return {
        id: String(item.id),
        quantity: Math.floor(quantity)
    };
}

export function readCart() {
    try {
        const storedItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
        return Array.isArray(storedItems) ? storedItems.map(sanitizeItem).filter(Boolean) : [];
    } catch {
        return [];
    }
}

export function writeCart(items) {
    const sanitizedItems = Array.isArray(items) ? items.map(sanitizeItem).filter(Boolean) : [];
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(sanitizedItems));
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: sanitizedItems }));
    return sanitizedItems;
}

export function addCartItem(productId, quantity = 1) {
    const cart = readCart();
    const increment = Math.max(1, Math.floor(Number(quantity) || 1));
    const existing = cart.find((item) => item.id === productId);

    if (existing) {
        existing.quantity += increment;
    } else {
        cart.push({ id: productId, quantity: increment });
    }

    return writeCart(cart);
}

export function setCartItemQuantity(productId, quantity) {
    const nextQuantity = Math.floor(Number(quantity) || 0);
    const cart = readCart();

    if (nextQuantity <= 0) {
        return writeCart(cart.filter((item) => item.id !== productId));
    }

    const existing = cart.find((item) => item.id === productId);

    if (existing) {
        existing.quantity = nextQuantity;
    } else {
        cart.push({ id: productId, quantity: nextQuantity });
    }

    return writeCart(cart);
}

export function removeCartItem(productId) {
    return writeCart(readCart().filter((item) => item.id !== productId));
}

export function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: [] }));
}

export function getCartCount() {
    return readCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function updateCartCount() {
    const cartCount = document.querySelector('[data-cart-count]');

    if (!cartCount) {
        return;
    }

    const count = getCartCount();
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'inline-grid' : 'none';
}

export function iniciarCart() {
    updateCartCount();
    window.addEventListener(CART_UPDATED_EVENT, updateCartCount);
}
