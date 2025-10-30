document.addEventListener('DOMContentLoaded', () => {
    // Obtener el ID del producto desde la URL (?id=123)
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (productId) {
        // Guardar en localStorage (sirve para los comentarios y otros usos)
        localStorage.setItem("productID", productId);

        // Cargar la información del producto
        loadProductDetails(productId);

        // Cargar comentarios del servidor y locales
        loadComments(productId);
        loadLocalComments(productId);
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

            // --------------------
            // Botón "Añadir al carrito"
            // --------------------
            const addBtn = document.getElementById('add-to-cart-btn');
            if (addBtn) {
                addBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    try {
                        const cart = JSON.parse(localStorage.getItem('cart')) || [];

                        const cartItem = {
                            id: productData.id,
                            name: productData.name,
                            unitCost: productData.cost,
                            currency: productData.currency,
                            count: 1,
                            image: productData.images[0]
                        };

                        const existing = cart.find(item => String(item.id) === String(productData.id));
                        if (existing) {
                            existing.count++;
                        } else {
                            cart.push(cartItem);
                        }

                        localStorage.setItem('cart', JSON.stringify(cart));

                        // ✅ Mensaje de confirmación
                        alert(`${productData.name} se agregó al carrito 🛒`);

                    } catch (error) {
                        console.error('Error al agregar al carrito:', error);
                    }
                });
            }

            // --------------------
            // Botón "Comprar ahora"
            // --------------------
            const buyBtn = document.getElementById('buy-now-btn');
            if (buyBtn) {
                buyBtn.addEventListener('click', (e) => {
                    e.preventDefault();

                    try {
                        const productToBuy = {
                            id: productData.id,
                            name: productData.name,
                            unitCost: productData.cost,
                            currency: productData.currency,
                            count: 1,
                            image: productData.images[0]
                        };

                        // ✅ Recuperar carrito existente sin borrar
                        const cart = JSON.parse(localStorage.getItem('cart')) || [];

                        const existing = cart.find(item => String(item.id) === String(productData.id));
                        if (existing) {
                            existing.count++;
                        } else {
                            cart.push(productToBuy);
                        }

                        // Guardar carrito actualizado
                        localStorage.setItem('cart', JSON.stringify(cart));

                        // Guardar producto seleccionado
                        localStorage.setItem('productToBuy', JSON.stringify(productToBuy));

                        // Redirigir al carrito
                        window.location.href = './cart.html';

                    } catch (error) {
                        console.error('Error al procesar la compra:', error);
                    }
                });
            }

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

    if (prevArrow && nextArrow) {
        prevArrow.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateMainImage(currentIndex, images, miniaturas, imagenPrincipal);
        });

        nextArrow.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateMainImage(currentIndex, images, miniaturas, imagenPrincipal);
        });
    }

    if (miniaturas.length > 0) miniaturas[0].classList.add('active');
}

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

                productDiv.addEventListener('click', () => {
                    loadProductDetails(product.id);
                    localStorage.setItem("productID", product.id);
                    loadComments(product.id);
                    loadLocalComments(product.id);
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

function showComments(comments) {
    const container = document.getElementById("comments-container");
    if (container) {
        container.innerHTML = "";
        comments.forEach(c => {
            appendComment(c);
        });
    }
}

function getStars(score) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="fa fa-star" style="color:${i <= score ? "gold" : "lightgray"};"></span>`;
    }
    return stars;
}

let calificacionSeleccionada = 0;
const stars = document.querySelectorAll(".rating-stars .star");
const ratingText = document.querySelector(".rating-text");
const commentBtn = document.querySelector(".submit-comment-btn");
const commentsContainer = document.getElementById("comments-container");

if (stars.length > 0) {
    stars.forEach(star => {
        star.addEventListener("mouseover", () => {
            stars.forEach(s => {
                s.style.color = s.dataset.value <= star.dataset.value ? "gold" : "lightgray";
            });
        });

        star.addEventListener("mouseout", () => {
            stars.forEach(s => {
                s.style.color = s.dataset.value <= calificacionSeleccionada ? "gold" : "lightgray";
            });
        });

        star.addEventListener("click", () => {
            calificacionSeleccionada = parseInt(star.dataset.value);
            if (ratingText) {
                ratingText.textContent = `${calificacionSeleccionada} de 5 estrellas`;
            }
        });
    });
}

function loadLocalComments(productId) {
    const stored = JSON.parse(localStorage.getItem(`comments_${productId}`)) || [];
    stored.forEach(c => appendComment(c));
}

function getUsuarioDisplayName() {
    const raw = localStorage.getItem("usuario");
    if (!raw) return "Tú";
    try {
        const obj = JSON.parse(raw);
        return obj.usuario || obj.nombre || obj.name || "Tú";
    } catch {
        return raw;
    }
}

if (commentBtn) {
    commentBtn.addEventListener("click", () => {
        const comentario = document.getElementById("comentarioProducto")?.value.trim();
        const productId = localStorage.getItem("productID");
        const usuario = getUsuarioDisplayName();

        if (!comentario) {
            alert("Por favor escribe un comentario antes de enviar.");
            return;
        }

        if (calificacionSeleccionada === 0) {
            alert("Por favor selecciona una cantidad de estrellas.");
            return;
        }

        const nuevoComentario = {
            user: usuario,
            dateTime: new Date().toISOString().replace("T", " ").split(".")[0],
            score: calificacionSeleccionada,
            description: comentario
        };

        appendComment(nuevoComentario);

        const existing = JSON.parse(localStorage.getItem(`comments_${productId}`)) || [];
        existing.push(nuevoComentario);
        localStorage.setItem(`comments_${productId}`, JSON.stringify(existing));

        if (document.getElementById("comentarioProducto")) {
            document.getElementById("comentarioProducto").value = "";
        }
        calificacionSeleccionada = 0;
        if (ratingText) {
            ratingText.textContent = "1 de 5 estrellas";
        }
        if (stars.length > 0) {
            stars.forEach(s => (s.style.color = "lightgray"));
        }
    });
}

function appendComment(c) {
    if (commentsContainer) {
        const div = document.createElement("div");
        div.classList.add("list-group-item");
        div.innerHTML = `
            <p><strong>${c.user}</strong> - <small>${c.dateTime}</small></p>
            <p>${getStars(c.score)}</p>
            <p>${c.description}</p>
        `;
        commentsContainer.appendChild(div);
    }
}
