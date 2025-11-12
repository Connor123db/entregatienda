document.addEventListener('DOMContentLoaded', () => {
  try {
    loadCartItems();

    // Listener robusto al botón finalizar (busca por id o por clase)
    const finalizarBtn = document.getElementById('btn-finalizar') || document.querySelector('.boton-finalizar');
    if (finalizarBtn) finalizarBtn.addEventListener('click', openCheckoutModal);
  } catch (err) {
    console.error('Error inicializando carrito:', err);
    const cont = document.getElementById('productos-container');
    if (cont) cont.innerHTML = '<p>Error cargando el carrito.</p>';
  }
});

// ===============================
// Configuración de tasa de cambio USD → UYU
// ===============================
const USD_TO_UYU = 40;

// ===============================
// Estado global para envío seleccionado
// ===============================
let selectedShippingRate = 0; // 0.15, 0.07, 0.05 o 0
let selectedShippingLabel = null;

// ===============================
// TU CÓDIGO ORIGINAL (casi intacto)
// ===============================
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
    const priceOriginal = Number(prod.cost ?? prod.unitCost ?? item.unitCost ?? 0) || 0;
    const currency = prod.currency || item.currency || 'USD';
    const image = (prod.images && prod.images[0]) || item.image || '';
    const count = Number(item.count || 1);

    // Conversión automática de USD a UYU 
    const priceUYU = currency === 'USD' ? priceOriginal * USD_TO_UYU : priceOriginal;
    const displayCurrency = 'UYU';

    html += `
      <div class="producto-item" data-id="${escapeHtml(id)}">
        <img src="${escapeHtml(image)}" alt="${escapeHtml(name)}" style="width:120px;height:auto;object-fit:cover"/>
        <div class="producto-info">
          <h3>${escapeHtml(name)}</h3>
          <p>Precio unitario: ${displayCurrency} ${priceUYU.toFixed(2)}</p>
          <p>
            Cantidad:
            <input type="number" min="1" value="${count}" data-id="${escapeHtml(id)}" class="qty-input" style="width:70px"/>
            <button class="btn-remove" data-id="${escapeHtml(id)}" type="button">Eliminar</button>
          </p>
          <p class="subtotal">Subtotal: ${displayCurrency} ${(priceUYU * count).toFixed(2)}</p>
        </div>
      </div>
      <hr/>
    `;
  });

  productosContainer.innerHTML = html;

  // listeners para inputs de cantidad
  document.querySelectorAll('.qty-input').forEach(inp => {
    inp.addEventListener('input', (e) => {
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

// Actualiza la cantidad y el subtotal en tiempo real 
function updateQuantity(id, newCount) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const item = cart.find(it => String(it.id) === String(id) || (it.product && String(it.product.id) === String(id)));
  if (item) {
    item.count = Number(newCount) || 1;
    localStorage.setItem('cart', JSON.stringify(cart));

    // Actualizar subtotal visualmente sin recargar toda la lista
    const productoItem = document.querySelector(`.producto-item[data-id="${CSS.escape(id)}"]`);
    if (productoItem) {
      // El primer <p> contiene "Precio unitario: UYU 400.00"
      const priceText = productoItem.querySelector('p').textContent || '';
      // extraer primer número con regex (aseguro decimal)
      const m = priceText.match(/([\d,.]+(\.\d+)?)/);
      const price = m ? parseFloat(m[1].replace(/,/g, '')) : 0;
      const nuevoSubtotal = price * item.count;
      const subtotalElem = productoItem.querySelector('.subtotal');
      if (subtotalElem) subtotalElem.textContent = `Subtotal: UYU ${nuevoSubtotal.toFixed(2)}`;
    }

    // Actualiza el resumen general
    updateResumen();
  }
}

// Eliminar un producto del carrito
function removeItem(id) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(it => !(String(it.id) === String(id) || (it.product && String(it.product.id) === String(id))));
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCartItems();
}

// ===============================
// updateResumen MODIFICADA (usa selectedShippingRate)
// ===============================
function updateResumen() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  let subtotal = 0;

  cart.forEach(item => {
    const prod = item.product || {};
    const priceOriginal = Number(prod.cost ?? prod.unitCost ?? item.unitCost ?? 0) || 0;
    const currency = prod.currency || item.currency || 'USD';
    const priceUYU = currency === 'USD' ? priceOriginal * USD_TO_UYU : priceOriginal;
    const count = Number(item.count || 1);
    subtotal += priceUYU * count;
  });

  // Calculamos envío con la tasa seleccionada (si no hay selección, envío = 0)
  const envio = subtotal * (selectedShippingRate || 0);
  const total = subtotal + envio;
  const totalUSD = total / USD_TO_UYU;

  const prodElem = document.getElementById('resumen-producto-valor');
  const envioElem = document.getElementById('resumen-envio-valor');
  const totalElem = document.getElementById('resumen-total-valor');

  if (prodElem) prodElem.textContent = `UYU ${subtotal.toFixed(2)}`;
  if (envioElem) {
    // Si no hay selección mostrar indicación coherente
    envioElem.textContent = selectedShippingRate
      ? `UYU ${envio.toFixed(2)} (${(selectedShippingRate * 100).toFixed(0)}%)`
      : 'Sin seleccionar';
  }
  if (totalElem) totalElem.textContent = `UYU ${total.toFixed(2)} (≈ USD ${totalUSD.toFixed(2)})`;
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

// ===============================
// FUNCIONES DEL CHECKOUT (MODAL) - crea modal y pasos
// ===============================
function openCheckoutModal() {
  // Evitar abrir si no existe el contenedor/productos
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (!document.getElementById('productos-container')) return;

  // Crear overlay (fondo) y modal (contenido)
  const overlay = document.createElement('div');
  overlay.className = 'checkout-overlay';
  // seteo base para blur y aparición (por si el CSS no ha cargado aún)
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(0,0,0,0.35)';
  overlay.style.backdropFilter = 'blur(6px)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '9999';
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 300ms ease';

  const modal = document.createElement('div');
  modal.className = 'checkout-modal';
  modal.style.background = '#fef3e2';
  modal.style.borderRadius = '12px';
  modal.style.width = '92%';
  modal.style.maxWidth = '780px';
  modal.style.padding = '24px';
  modal.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
  modal.style.transform = 'translateY(30px)';
  modal.style.opacity = '0';
  modal.style.transition = 'all 320ms cubic-bezier(.2,.9,.2,1)';

  // Estructura de pasos (1: envio / 2: direccion / 3: pago / 4: costos)
  modal.innerHTML = `
    <div class="checkout-steps">
      <div class="step step-active" data-step="1">
        <h2>Seleccionar tipo de envío</h2>
        <div>
          <label><input type="radio" name="checkout-envio" value="0.15"> Premium 2 a 5 días (15%)</label><br>
          <label><input type="radio" name="checkout-envio" value="0.07"> Express 5 a 8 días (7%)</label><br>
          <label><input type="radio" name="checkout-envio" value="0.05"> Standard 12 a 15 días (5%)</label>
        </div>
        <div style="margin-top:18px; text-align:right;">
          <button class="btn-checkout-next">Siguiente</button>
        </div>
      </div>

      <div class="step" data-step="2" style="display:none;">
        <h2>Dirección de envío</h2>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px;">
          <input id="ch-departamento" placeholder="Departamento" />
          <input id="ch-localidad" placeholder="Localidad" />
          <input id="ch-calle" placeholder="Calle" />
          <input id="ch-numero" placeholder="Número" />
          <input id="ch-esquina" placeholder="Esquina (opcional)" />
        </div>
        <div style="margin-top:18px; display:flex; justify-content:space-between;">
          <button class="btn-checkout-prev">Anterior</button>
          <button class="btn-checkout-next">Siguiente</button>
        </div>
      </div>

      <div class="step" data-step="3" style="display:none;">
        <h2>Forma de pago</h2>
        <div style="margin-top:8px;">
          <label><input type="radio" name="checkout-pago" value="tarjeta"> Tarjeta de crédito</label><br>
          <label><input type="radio" name="checkout-pago" value="transferencia"> Transferencia bancaria</label>
        </div>
        <div style="margin-top:18px; display:flex; justify-content:space-between;">
          <button class="btn-checkout-prev">Anterior</button>
          <button class="btn-checkout-next">Siguiente</button>
        </div>
      </div>

      <div class="step" data-step="4" style="display:none;">
        <h2>Resumen de costos</h2>
        <div style="background:#fff9f0;border-radius:8px;padding:12px;margin-top:8px;">
          <p>Subtotal: <strong id="ch-subtotal">UYU 0.00</strong></p>
          <p>Costo de envío: <strong id="ch-envio">UYU 0.00</strong></p>
          <p><strong>Total: <span id="ch-total">UYU 0.00</span></strong></p>
        </div>
        <div style="margin-top:18px; display:flex; justify-content:space-between;">
          <button class="btn-checkout-prev">Anterior</button>
          <button class="btn-checkout-finish">Finalizar compra</button>
        </div>
      </div>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // forzar entrada suave
  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    modal.style.transform = 'translateY(0)';
    modal.style.opacity = '1';
  });

  // ---- manejadores de pasos ----
  const steps = modal.querySelectorAll('.step');
  let currentStepIndex = 0;

  function showStep(index) {
    steps.forEach((s, i) => {
      if (i === index) {
        s.style.display = '';
      } else {
        s.style.display = 'none';
      }
    });
    currentStepIndex = index;
    // actualizar el resumen del modal por si cambió el envío
    updateModalCosts();
  }

  // next/prev botones (delegación)
  modal.addEventListener('click', (ev) => {
    if (ev.target.classList.contains('btn-checkout-next')) {
      // si estamos en paso 0 (selección de envío) y no hay radio seleccionado, no avanzar
      if (currentStepIndex === 0) {
        const sel = modal.querySelector('input[name="checkout-envio"]:checked');
        if (!sel) {
          alert('Por favor selecciona un tipo de envío.');
          return;
        }
        // aplicar selección en tiempo real
        selectedShippingRate = parseFloat(sel.value);
        // label
        selectedShippingLabel = sel.parentElement.textContent.trim();
        // actualizar resumen principal
        updateResumen();
      }
      if (currentStepIndex < steps.length - 1) showStep(currentStepIndex + 1);
    }

    if (ev.target.classList.contains('btn-checkout-prev')) {
      if (currentStepIndex > 0) showStep(currentStepIndex - 1);
    }

    if (ev.target.classList.contains('btn-checkout-finish')) {
      // aquí podrías validar dirección y forma de pago si querés
      // por ahora: cerrar y mostrar mensaje
      closeOverlay();
      alert('✅ Compra finalizada.');
    }
  });

  // Permitir cerrar con Escape o clic fuera del modal
  function onKey(e) {
    if (e.key === 'Escape') closeOverlay();
  }
  function onClickOutside(e) {
    if (e.target === overlay) closeOverlay();
  }
  document.addEventListener('keydown', onKey);
  overlay.addEventListener('click', onClickOutside);

  function closeOverlay() {
    // limpiar listeners
    document.removeEventListener('keydown', onKey);
    overlay.removeEventListener('click', onClickOutside);
    // animación de salida
    overlay.style.opacity = '0';
    modal.style.transform = 'translateY(20px)';
    modal.style.opacity = '0';
    setTimeout(() => {
      overlay.remove();
      // reset selección para futuras aperturas si querés
      // selectedShippingRate = 0;
      // selectedShippingLabel = null;
      updateResumen();
    }, 280);
  }

  // Actualiza valores que se muestran en la pestaña "Costos" del modal
  function updateModalCosts() {
    const subtotal = obtenerSubtotal();
    const envio = subtotal * (selectedShippingRate || 0);
    const total = subtotal + envio;
    const chSubtotal = modal.querySelector('#ch-subtotal');
    const chEnvio = modal.querySelector('#ch-envio');
    const chTotal = modal.querySelector('#ch-total');
    if (chSubtotal) chSubtotal.textContent = `UYU ${subtotal.toFixed(2)}`;
    if (chEnvio) chEnvio.textContent = `UYU ${envio.toFixed(2)}${selectedShippingRate ? ` (${(selectedShippingRate*100).toFixed(0)}%)` : ''}`;
    if (chTotal) chTotal.textContent = `UYU ${total.toFixed(2)} (≈ USD ${(total / USD_TO_UYU).toFixed(2)})`;
  }

  // cada vez que cambie la selección de envío en el paso 1, actualizamos en tiempo real
  modal.addEventListener('change', (ev) => {
    if (ev.target.name === 'checkout-envio') {
      selectedShippingRate = parseFloat(ev.target.value);
      selectedShippingLabel = ev.target.parentElement ? ev.target.parentElement.textContent.trim() : null;
      updateResumen();        // actualiza resumen principal en la UI
      updateModalCosts();     // actualiza valores dentro del modal
    }
  });

  // mostrar primer paso
  showStep(0);
}

// ===============================
// obtenerSubtotal (misma lógica que updateResumen usa)
// ===============================
function obtenerSubtotal() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  let subtotal = 0;

  cart.forEach(item => {
    const prod = item.product || {};
    const priceOriginal = Number(prod.cost ?? prod.unitCost ?? item.unitCost ?? 0) || 0;
    const currency = prod.currency || item.currency || 'USD';
    const priceUYU = currency === 'USD' ? priceOriginal * USD_TO_UYU : priceOriginal;
    const count = Number(item.count || 1);
    subtotal += priceUYU * count;
  });

  return subtotal;
}
