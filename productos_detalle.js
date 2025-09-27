document.addEventListener('DOMContentLoaded', () => {
    // La lógica de obtener el ID se mantiene igual
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (productId) {
        // Llamada inicial para cargar los detalles del producto
        loadProductDetails(productId);
    } else {
        console.error('ID de producto no proporcionado.');
        window.location.href = 'productos.html';
    }
});

// Nueva función principal para cargar los detalles del producto
function loadProductDetails(productId) {
    const PRODUCT_URL = PRODUCT_INFO_URL + productId + EXT_TYPE;

    fetch(PRODUCT_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar la información del producto.');
            }
            return response.json();
        })
        .then(productData => {
            // 1. Cargar la información textual
            document.getElementById('product-name').textContent = productData.name;
            document.getElementById('product-description').textContent = productData.description;
            document.getElementById('product-price').textContent = `Precio: ${productData.currency} ${productData.cost}`;
            document.getElementById('product-soldCount').textContent = `Vendidos: ${productData.soldCount}`;

            // 2. Cargar las imágenes
            loadProductImages(productData.images);

            // 3. Lógica de los botones (se mantiene igual)
            document.getElementById('add-to-cart-btn').addEventListener('click', () => {
                console.log(`Producto ${productData.name} (ID: ${productData.id}) agregado al carrito.`);
            });

            document.getElementById('buy-now-btn').addEventListener('click', () => {
                console.log(`Comprando el producto ${productData.name} (ID: ${productData.id}).`);
            });

            // 4. Mostrar los productos relacionados
            if (productData.relatedProducts && productData.relatedProducts.length > 0) {
                displayRelatedProducts(productData.relatedProducts);
            } else {
                document.getElementById('productos-relacionados').innerHTML = '<p>No hay productos relacionados disponibles.</p>';
            }
        })
        .catch(error => {
            console.error('Error al cargar los datos del producto:', error);
            window.location.href = 'productos.html';
        });
}

// La función para cargar las imágenes se mantiene igual
function loadProductImages(images) {
    const imagenPrincipal = document.getElementById('imagenPrincipal');
    const miniaturas = document.querySelectorAll('.miniaturas img');

    if (!images || images.length === 0) {
        console.error('No se encontraron imágenes para este producto.');
        return;
    }

    imagenPrincipal.src = images[0];
    imagenPrincipal.alt = 'Imagen principal del producto';

    miniaturas.forEach((miniatura, index) => {
        if (images[index]) {
            miniatura.src = images[index];
            miniatura.alt = `Miniatura ${index + 1}`;
            miniatura.style.display = 'block';
        } else {
            miniatura.style.display = 'none';
        }

        miniatura.addEventListener('click', () => {
            miniaturas.forEach(img => img.classList.remove('active'));
            miniatura.classList.add('active');
            imagenPrincipal.src = miniatura.src;
        });
    });

    const prevArrow = document.getElementById('prev-arrow');
    const nextArrow = document.getElementById('next-arrow');
    let currentIndex = 0;

    prevArrow.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateMainImage(currentIndex, images, miniaturas, imagenPrincipal);
    });

    nextArrow.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateMainImage(currentIndex, images, miniaturas, imagenPrincipal);
    });

    function updateMainImage(index, images, miniaturas, imagenPrincipal) {
        imagenPrincipal.src = images[index];
        miniaturas.forEach(img => img.classList.remove('active'));
        if (miniaturas[index]) {
            miniaturas[index].classList.add('active');
        }
    }

    if (miniaturas.length > 0) {
        miniaturas[0].classList.add('active');
    }
}

// Modifica la función para mostrar productos relacionados
function displayRelatedProducts(relatedProducts) {
    const relatedProductsContainer = document.getElementById('productos-relacionados');
    // Limpia el contenedor antes de agregar nuevos productos
    relatedProductsContainer.innerHTML = '';
    
    relatedProducts.forEach(related => {
        const relatedProductUrl = PRODUCT_INFO_URL + related.id + EXT_TYPE;
        fetch(relatedProductUrl)
            .then(response => response.json())
            .then(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('vehiculo');
                productDiv.dataset.id = product.id;
                
                productDiv.innerHTML = `
                    <img src="${product.images[0]}" alt="${product.name}">
                    <div class="info-vehiculo">
                        <h4>${product.name}</h4>
                    </div>
                `;

                // Aquí está el cambio clave:
                // En lugar de recargar la página, solo actualizamos el contenido
                productDiv.addEventListener('click', () => {
                    loadProductDetails(product.id);
                    // Opcional: Para actualizar la URL en la barra de direcciones sin recargar
                    window.history.pushState(null, '', `detalle_productos.html?id=${product.id}`);
                });
                
                relatedProductsContainer.appendChild(productDiv);
            })
            .catch(error => console.error('Error al cargar el producto relacionado:', error));
    });
}
