window.addEventListener('scroll', function() {
    // Verifica si el scroll vertical es mayor a 100 píxeles
    if (window.scrollY > 100) {
        // Si es así, añade la clase "fondo-blanco" al body
        document.body.classList.add('fondo-blanco');
    } else {
        // Si el scroll está por encima, quita la clase
        document.body.classList.remove('fondo-blanco');
    }
});
// productos_detalle.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener el ID del producto de la URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    // 2. Mapeo de IDs de productos a las rutas de las miniaturas locales
    const miniaturasPorProducto = {
        50921: [
            'img/prod50921_2.jpg',
            'img/prod50921_3.jpg',
            'img/prod50921_4.jpg',
            'img/prod50921_5.jpg'
        ],
        50922: [
            'img/prod50922_2.jpg',
            'img/prod50922_3.jpg',
            'img/prod50922_4.jpg'
        ],
        50923: [
            'img/prod50923_2.jpg',
            'img/prod50923_3.jpg',
            'img/prod50923_4.jpg'
        ],
        50924: [
            'img/prod50924_2.jpg',
            'img/prod50924_3.jpg',
            'img/prod50924_4.jpg',
            'img/prod50924_5.jpg'
        ],
        50925: [
            'img/prod50925_2.jpg',
            'img/prod50925_3.jpg',
            'img/prod50925_4.jpg',
            'img/prod50925_5.jpg'
        ],
        60801: [
            'img/prod60801_1.jpg',
            'img/prod60801_2.jpg',
            'img/prod60801_3.jpg',
            'img/prod60801_4.jpg'
        ],
        60802: [
            'img/prod60802_1.jpg',
            'img/prod60802_2.jpg',
            'img/prod60802_3.jpg',
            'img/prod60802_4.jpg'
        ],
        60803: [
            'img/prod60803_1.jpg',
            'img/prod60803_2.jpg',
            'img/prod60803_3.jpg',
            'img/prod60803_4.jpg'
        ],
        60804: [
            'img/prod60804_1.jpg',
            'img/prod60804_2.jpg',
            'img/prod60804_3.jpg',
            'img/prod60804_4.jpg'
        ],
        40281: [
            'img/prod40281_1.jpg',
            'img/prod40281_2.jpg',
            'img/prod40281_3.jpg',
            'img/prod40281_4.jpg'
        ],
        50741: [
            'img/prod50741_1.jpg',
            'img/prod50741_2.jpg',
            'img/prod50741_3.jpg',
            'img/prod50741_4.jpg'
        ],
        50742: [
            'img/prod50742_1.jpg',
            'img/prod50742_2.jpg',
            'img/prod50742_3.jpg',
            'img/prod50742_4.jpg'
        ],
        50743: [
            'img/prod50743_1.jpg',
            'img/prod50743_2.jpg',
            'img/prod50743_3.jpg',
            'img/prod50743_4.jpg'
        ],
        50744: [
            'img/prod50744_1.jpg',
            'img/prod50744_2.jpg',
            'img/prod50744_3.jpg',
            'img/prod50744_4.jpg'
        ]
    };

    if (productId) {
        const catID = localStorage.getItem("catID");
        const URL_CAT = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

        fetch(URL_CAT)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar la categoría');
                }
                return response.json();
            })
            .then(data => {
                const productData = data.products.find(producto => producto.id === parseInt(productId));

                if (productData) {
                    // 3. Obtener elementos de la galería de imágenes
                    const imagenPrincipal = document.getElementById('imagenPrincipal');
                    const miniaturas = document.querySelectorAll('.miniaturas img');
                    const prevArrow = document.getElementById('prev-arrow');
                    const nextArrow = document.getElementById('next-arrow');
                    let currentIndex = 0;

                    // 4. Cargar la imagen principal y miniaturas
                    const miniaturasLocales = miniaturasPorProducto[productId];
                    if (miniaturasLocales && miniaturasLocales.length > 0) {
                        // Cargar miniaturas desde el array local
                        for (let i = 0; i < miniaturas.length; i++) {
                            if (miniaturas[i] && miniaturasLocales.length > i) {
                                miniaturas[i].src = miniaturasLocales[i];
                                miniaturas[i].alt = `${productData.name} - Miniatura ${i + 1}`;
                            } else if (miniaturas[i]) {
                                // Ocultar miniaturas si no hay suficientes imágenes
                                miniaturas[i].style.display = 'none';
                            }
                        }
                    }
                    
                    // Asegurar que la primera imagen principal sea la de la API
                    if (productData.image) {
                        imagenPrincipal.src = productData.image;
                    } else if (miniaturas.length > 0) {
                        imagenPrincipal.src = miniaturas[0].src;
                    }
                    
                    // Asegurar que la primera miniatura también se muestre activa
                    if (miniaturas.length > 0) {
                        miniaturas[0].classList.add('active');
                    }

                    // 5. Lógica para la navegación de la galería de imágenes
                    function updateImage(newIndex) {
                        // Eliminar la clase 'active' de todas las miniaturas
                        miniaturas.forEach(img => img.classList.remove('active'));
                        
                        // Si el nuevo índice es válido, mostrar la imagen
                        if (miniaturas[newIndex]) {
                            imagenPrincipal.src = miniaturas[newIndex].src;
                            miniaturas[newIndex].classList.add('active');
                            currentIndex = newIndex;
                        }
                    }

                    // Evento de clic en las miniaturas
                    miniaturas.forEach((miniatura, index) => {
                        miniatura.addEventListener('click', () => {
                            updateImage(index);
                        });
                    });

                    // Evento de clic en la flecha "anterior"
                    prevArrow.addEventListener('click', () => {
                        const newIndex = (currentIndex - 1 + miniaturas.length) % miniaturas.length;
                        updateImage(newIndex);
                    });

                    // Evento de clic en la flecha "siguiente"
                    nextArrow.addEventListener('click', () => {
                        const newIndex = (currentIndex + 1) % miniaturas.length;
                        updateImage(newIndex);
                    });


                    // 6. Cargar la información textual (que ya funcionaba)
                    document.getElementById('product-name').textContent = productData.name;
                    document.getElementById('product-description').textContent = productData.description;
                    document.getElementById('product-price').textContent = `Precio: ${productData.currency} ${productData.cost}`;
                    document.getElementById('product-soldCount').textContent = `Vendidos: ${productData.soldCount}`;
                    
                    // 7. Lógica de los botones
                    document.getElementById('add-to-cart-btn').addEventListener('click', () => {
                        console.log(`Producto ${productData.name} (ID: ${productData.id}) agregado al carrito.`);
                    });

                    document.getElementById('buy-now-btn').addEventListener('click', () => {
                        console.log(`Comprando el producto ${productData.name} (ID: ${productData.id}).`);
                    });
                } else {
                    console.error('Producto no encontrado.');
                    window.location.href = 'productos.html';
                }
            })
            .catch(error => {
                console.error('Error al cargar los datos:', error);
                window.location.href = 'productos.html';
            });
    } else {
        console.error('No se proporcionó ID de producto.');
        window.location.href = 'productos.html';
    }
});