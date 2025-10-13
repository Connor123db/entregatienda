// Esperar a que cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    // Obtener el ID del producto desde la URL (?id=123)
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (productId) {
        // Guardar en localStorage (sirve para los comentarios y otros usos)
        localStorage.setItem("productID", productId);

        // Cargar la información del producto
        loadProductDetails(productId);

        // Cargar comentarios
        loadComments(productId);
    } else {
        console.error('ID de producto no proporcionado.');
        window.location.href = 'productos.html'; // Redirigir si no hay ID
    }
});

// --------------------
// Cargar detalles del producto
// --------------------
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
            // Mostrar información del producto
            document.getElementById('product-name').textContent = productData.name;
            document.getElementById('product-description').textContent = productData.description;
            document.getElementById('product-price').textContent = `Precio: ${productData.currency} ${productData.cost}`;
            document.getElementById('product-soldCount').textContent = `Vendidos: ${productData.soldCount}`;

            // Cargar imágenes
            loadProductImages(productData.images);

            // Botones
            document.getElementById('add-to-cart-btn').addEventListener('click', () => {
                console.log(`Producto ${productData.name} (ID: ${productData.id}) agregado al carrito.`);
            });

            document.getElementById('buy-now-btn').addEventListener('click', () => {
                console.log(`Comprando el producto ${productData.name} (ID: ${productData.id}).`);
            });

            // Productos relacionados
            if (productData.relatedProducts?.length > 0) {
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

// --------------------
// Cargar imágenes del producto
// --------------------
function loadProductImages(images) {
    const imagenPrincipal = document.getElementById('imagenPrincipal');
    const miniaturas = document.querySelectorAll('.miniaturas img');

    if (!images || images.length === 0) {
        console.error('No se encontraron imágenes para este producto.');
        return;
    }

    // Imagen principal
    imagenPrincipal.src = images[0];
    imagenPrincipal.alt = 'Imagen principal del producto';

    // Miniaturas
    miniaturas.forEach((miniatura, index) => {
        if (images[index]) {
            miniatura.src = images[index];
            miniatura.alt = `Miniatura ${index + 1}`;
            miniatura.style.display = 'block';
        } else {
            miniatura.style.display = 'none';
        }

        // Evento de click en miniatura
        miniatura.addEventListener('click', () => {
            miniaturas.forEach(img => img.classList.remove('active'));
            miniatura.classList.add('active');
            imagenPrincipal.src = miniatura.src;
        });
    });

    // Flechas de navegación
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

    // Seleccionar la primera miniatura
    if (miniaturas.length > 0) miniaturas[0].classList.add('active');
}

// Cambiar imagen principal
function updateMainImage(index, images, miniaturas, imagenPrincipal) {
    imagenPrincipal.src = images[index];
    miniaturas.forEach(img => img.classList.remove('active'));
    if (miniaturas[index]) miniaturas[index].classList.add('active');
}

// --------------------
// Mostrar productos relacionados
// --------------------
function displayRelatedProducts(relatedProducts) {
    const relatedProductsContainer = document.getElementById('productos-relacionados');
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

                // Click en producto relacionado
                productDiv.addEventListener('click', () => {
                    // Cambiar producto principal
                    loadProductDetails(product.id);
                    localStorage.setItem("productID", product.id);

                    // Actualizar comentarios
                    loadComments(product.id);

                    // Actualizar URL (sin recargar)
                    window.history.pushState(null, '', `detalle_productos.html?id=${product.id}`);
                });

                relatedProductsContainer.appendChild(productDiv);
            })
            .catch(error => console.error('Error al cargar el producto relacionado:', error));
    });
}

// --------------------
// Cargar comentarios desde API
// --------------------
function loadComments(productId) {
    const PRODUCT_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
    const URL_COMMENTS = `${PRODUCT_COMMENTS_URL}${productId}.json`;

    fetch(URL_COMMENTS)
        .then(res => res.json())
        .then(comments => showComments(comments))
        .catch(err => console.error("Error al cargar comentarios:", err));
}

// Mostrar comentarios en el contenedor
function showComments(comments) {
    const container = document.getElementById("comments-container");
    container.innerHTML = "";

    comments.forEach(c => {
        container.innerHTML += `
            <div class="list-group-item">
                <p><strong>${c.user}</strong> - <small>${c.dateTime}</small></p>
                <p>${getStars(c.score)}</p>
                <p>${c.description}</p>
            </div>
        `;
    });
}

// Dibujar estrellas
function getStars(score) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="fa fa-star" style="color:${i <= score ? "gold" : "lightgray"};"></span>`;
    }
    return stars;
}

// --------------------
// Agregar comentario local (sin API)
// --------------------
let calificacionSeleccionada = 1;

// Manejar selección de estrellas
document.querySelectorAll(".rating-stars .star").forEach(star => {
    star.addEventListener("click", () => {
        calificacionSeleccionada = parseInt(star.dataset.value);
        document.querySelector(".rating-text").textContent =
            calificacionSeleccionada + " de 5 estrellas";

        // Pintar estrellas seleccionadas
        document.querySelectorAll(".rating-stars .star").forEach(s => {
            s.style.color = s.dataset.value <= calificacionSeleccionada ? "gold" : "lightgray";
        });
    });
});

// Enviar nuevo comentario (local)
document.querySelector(".submit-comment-btn").addEventListener("click", () => {
    const comentario = document.getElementById("comentarioProducto").value.trim();

    if (!comentario) {
        alert("Por favor escribe un comentario antes de enviar.");
        return;
    }

    const nuevoComentario = {
        user: localStorage.getItem("usuario") || "Tú",
        dateTime: new Date().toISOString().replace("T", " ").split(".")[0],
        score: calificacionSeleccionada,
        description: comentario
    };

    const container = document.getElementById("comments-container");
    container.innerHTML += `
        <div class="list-group-item">
            <p><strong>${nuevoComentario.user}</strong> - <small>${nuevoComentario.dateTime}</small></p>
            <p>${getStars(nuevoComentario.score)}</p>
            <p>${nuevoComentario.description}</p>
        </div>
    `;

    // Resetear text
    document.getElementById("comentarioProducto").value = "";
});