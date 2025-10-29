// === Botón flotante del carrito con badge ===

// Crear el botón flotante
const cartButton = document.createElement('a');
cartButton.href = "cart.html"; // Redirige al carrito
cartButton.id = "cart-float-btn";
cartButton.innerHTML = `
  <i class="fa fa-shopping-cart"></i>
  <span id="cart-count-badge">0</span>
`;
document.body.appendChild(cartButton);

// Actualizar cantidad del carrito
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((acc, item) => acc + (item.count || 1), 0);
  document.getElementById('cart-count-badge').textContent = total;
}

// Ejecutar al cargar
updateCartBadge();

// Exportar función si se necesita
window.updateCartBadge = updateCartBadge;