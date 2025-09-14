document.addEventListener('DOMContentLoaded', () => { 
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (productId) {  
        // Primera llamada: a la API del producto individual
        // Usamos PRODUCT_INFO_URL y el ID del producto
        const PRODUCT_URL = PRODUCT_INFO_URL + productId + EXT_TYPE; // URL completa del producto

        fetch(PRODUCT_URL) // Primera llamada a la API del producto
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar la información del producto.');
                }
                return response.json();
                console.log(response);
            })
            .then(productData => {
                // Aquí ya tenemos la información completa del producto, incluyendo las imágenes.

                // 1. Cargar la información textual
                document.getElementById('product-name').textContent = productData.name;
                document.getElementById('product-description').textContent = productData.description;
                document.getElementById('product-price').textContent = `Precio: ${productData.currency} ${productData.cost}`;
                document.getElementById('product-soldCount').textContent = `Vendidos: ${productData.soldCount}`;

                // 2. Cargar las imágenes
                // Ahora usamos el array 'images' que viene en esta respuesta de la API.
                loadProductImages(productData.images);

                // 3. Lógica de los botones
                document.getElementById('add-to-cart-btn').addEventListener('click', () => {
                    console.log(`Producto ${productData.name} (ID: ${productData.id}) agregado al carrito.`); 
                });

                document.getElementById('buy-now-btn').addEventListener('click', () => {
                    console.log(`Comprando el producto ${productData.name} (ID: ${productData.id}).`);
                }); 

            })
            .catch(error => {
                console.error('Error al cargar los datos del producto:', error);
                window.location.href = 'productos.html';
            });
    } else {
        console.error('ID de producto no proporcionado.');
        window.location.href = 'productos.html';
    }
});

// Función para cargar las imágenes (esta función se mantiene igual)
function loadProductImages(images) { // images es un array de URLs de imágenes
    const imagenPrincipal = document.getElementById('imagenPrincipal'); // Imagen principal
    const miniaturas = document.querySelectorAll('.miniaturas img'); // Miniaturas

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
