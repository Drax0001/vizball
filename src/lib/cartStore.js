// Simple cart store using localStorage + custom events
const CART_KEY = 'vizball_cart';

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
}

export function addToCart(product, size = null, qty = 1) {
  const cart = getCart();
  const key = size ? `${product.id}-${size}` : `${product.id}`;
  const existing = cart.find((i) => i.key === key);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ key, product, size, qty });
  }
  saveCart(cart);
}

export function updateQty(key, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.key === key);
  if (item) {
    if (qty <= 0) {
      removeFromCart(key);
      return;
    }
    item.qty = qty;
    saveCart(cart);
  }
}

export function removeFromCart(key) {
  saveCart(getCart().filter((i) => i.key !== key));
}

export function clearCart() {
  saveCart([]);
}

export function cartTotal(cart) {
  return cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
}

export function cartCount(cart) {
  return cart.reduce((sum, i) => sum + i.qty, 0);
}