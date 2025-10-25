// Archivo completo: reemplaza el contenido actual por este

document.addEventListener('DOMContentLoaded', () => {
  try {
    loadCartItems();
  } catch (err) {
    console.error('Error inicializando carrito:', err);
    const cont = document.getElementById('productos-container');
    if (cont) cont.innerHTML = '<p>Error cargando el carrito.</p>';
  }
});

function loadCartItems() {
  const productosContainer = document.getElementById('productos-container');
  if (!productosContainer) {
    console.error('No se encontró #productos-container');
    return;
  }

  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    productosContainer.innerHTML = '<p>No hay productos en el carrito.</p>';
    updateResumen();
    return;
  }

  let html = '';
  cart.forEach((item, idx) => {
    const prod = item.product || {};
    const id = String(item.id ?? prod.id ?? idx);
    const name = prod.name || item.name || 'Producto';
    const price = Number(prod.cost ?? prod.unitCost ?? item.unitCost ?? 0) || 0;
    const currency = prod.currency || item.currency || 'USD';
    const image = (prod.images && prod.images[0]) || item.image || '';
    const count = Number(item.count || 1);

    html += `
      <div class="producto-item" data-id="${escapeHtml(id)}">
        <img src="${escapeHtml(image)}" alt="${escapeHtml(name)}" style="width:120px;height:auto;object-fit:cover"/>
        <div class="producto-info">
          <h3>${escapeHtml(name)}</h3>
          <p>${escapeHtml(currency)} ${price.toFixed(2)}</p>
          <p>
            Cantidad:
            <input type="number" min="1" value="${count}" data-id="${escapeHtml(id)}" class="qty-input" style="width:70px"/>
            <button class="btn-remove" data-id="${escapeHtml(id)}" type="button">Eliminar</button>
          </p>
          <p>Subtotal: ${escapeHtml(currency)} ${(price * count).toFixed(2)}</p>
        </div>
      </div>
      <hr/>
    `;
  });

  productosContainer.innerHTML = html;

  // listeners para inputs de cantidad
  document.querySelectorAll('.qty-input').forEach(inp => {
    inp.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      const val = Math.max(1, parseInt(e.target.value) || 1);
      e.target.value = val;
      updateQuantity(id, val);
    });
  });

  // listeners para botones eliminar
  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      removeItem(id);
    });
  });

  updateResumen();
}

function updateQuantity(id, newCount) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const item = cart.find(it => String(it.id) === String(id) || (it.product && String(it.product.id) === String(id)));
  if (item) {
    item.count = Number(newCount) || 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
  }
}

function removeItem(id) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(it => !(String(it.id) === String(id) || (it.product && String(it.product.id) === String(id))));
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCartItems();
}

function updateResumen() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  let subtotal = 0;
  cart.forEach(item => {
    const prod = item.product || {};
    const price = Number(prod.cost ?? prod.unitCost ?? item.unitCost ?? 0) || 0;
    const count = Number(item.count || 1);
    subtotal += price * count;
  });

  const envio = 0; // ajustar si aplica
  const total = subtotal + envio;

  const prodElem = document.getElementById('resumen-producto-valor');
  const envioElem = document.getElementById('resumen-envio-valor');
  const totalElem = document.getElementById('resumen-total-valor');

  if (prodElem) prodElem.textContent = `$ ${subtotal.toFixed(2)}`;
  if (envioElem) envioElem.textContent = envio ? `$ ${envio.toFixed(2)}` : 'Gratis';
  if (totalElem) totalElem.textContent = `$ ${total.toFixed(2)}`;
}

// helper para escapar texto en HTML
function escapeHtml(str) {
  if (str === null || str === undefined) return ''; // Manejar null/undefined
  return String(str) // Convertir a cadena
    .replace(/&/g, '&amp;') // primero los ampersands
    .replace(/</g, '&lt;') // luego los signos de menor
    .replace(/>/g, '&gt;') // luego los signos de mayor
    .replace(/"/g, '&quot;') // luego las comillas dobles
    .replace(/'/g, '&#039;'); // luego las comillas simples
}