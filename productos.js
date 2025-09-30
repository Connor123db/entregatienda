window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
        document.body.classList.add('fondo-blanco');
    } else {
        document.body.classList.remove('fondo-blanco');
    }
});

if (!localStorage.getItem('usuario')) {
    window.location.href = 'index.html';
}

// Variables de paginación y productos
let paginaActual = 1;
const porPagina = 5;
let productos = []; // Lista original de todos los productos
let productosFiltrados = []; // Lista para filtros de precio y búsqueda
let totalPaginas = 1;

// Referencia al campo de búsqueda del HTML
const filtroBusqueda = document.getElementById('filtro-busqueda');

// Función que muestra los productos en la página actual
function mostrarPagina(pagina) {
    const contenedor = document.getElementById('contenedor-productos');
    contenedor.innerHTML = '';

    // Usa la lista filtrada/ordenada si existe
    const lista = getListaActual();
    const inicio = (pagina - 1) * porPagina;
    const fin = inicio + porPagina;
    const productosPagina = lista.slice(inicio, fin);

    const galeria = document.createElement('div');
    galeria.className = 'galeria-vehiculos';

    productosPagina.forEach(producto => {
        const enlaceProducto = document.createElement('a');
        enlaceProducto.href = `detalle_productos.html?id=${producto.id}`;
        enlaceProducto.classList.add('enlace-producto');

        const div = document.createElement('div');
        div.classList.add('vehiculo');

        const img = document.createElement('img');
        img.src = producto.image;
        img.alt = producto.name;
        div.appendChild(img);

        const info = document.createElement('div');
        info.className = 'info-vehiculo';
        info.innerHTML = `
            <strong>${producto.name}</strong><br>
            Precio: ${producto.currency} ${producto.cost}<br>
            Vendidos: ${producto.soldCount}<br>
            ${producto.description}
        `;
        div.appendChild(info);

        enlaceProducto.appendChild(div);
        galeria.appendChild(enlaceProducto);
    });

    contenedor.appendChild(galeria);
    document.getElementById('pagina-actual').textContent = `Página ${pagina} de ${totalPaginas}`;
}

// Eventos de paginación
document.getElementById('btn-anterior').addEventListener('click', () => {
    if (paginaActual > 1) {
        paginaActual--;
        mostrarPagina(paginaActual);
    }
});

document.getElementById('btn-siguiente').addEventListener('click', () => {
    if (paginaActual < totalPaginas) {
        paginaActual++;
        mostrarPagina(paginaActual);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const usuario = localStorage.getItem("usuario");
    const usuarioLogueado = document.getElementById("usuario-logueado");
    if (usuarioLogueado && usuario) {
        usuarioLogueado.innerHTML = `Bienvenido, <strong>${usuario}</strong>`;
    }
});

function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "productos.html";
};

let catID = localStorage.getItem("catID");
const URL = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

fetch(URL)
    .then(response => response.json())
    .then(data => {
        productos = data.products;
        totalPaginas = Math.ceil(productos.length / porPagina);
        paginaActual = 1;
        mostrarPagina(paginaActual);
    });

function redirigirCategoria(catID) {
    localStorage.setItem("catID", catID);
    window.location.href = "productos.html";
}

// Función auxiliar: obtiene la lista actual según filtros y ordenamiento
function getListaActual() {
    return productosFiltrados.length > 0 ? productosFiltrados : productos;
}

// Función que aplica todos los filtros (precio y búsqueda)
function aplicarFiltros() {
    const textoBusqueda = filtroBusqueda.value.toLowerCase();
    const min = parseFloat(document.getElementById("precio-min").value) || 0;
    const max = parseFloat(document.getElementById("precio-max").value) || Infinity;

    // Filtra los productos que coinciden con la búsqueda y el rango de precio
    productosFiltrados = productos.filter(producto => {
        const titulo = producto.name.toLowerCase();
        const descripcion = producto.description.toLowerCase();
        
        const coincideBusqueda = titulo.includes(textoBusqueda) || descripcion.includes(textoBusqueda);
        const coincidePrecio = producto.cost >= min && producto.cost <= max;

        return coincideBusqueda && coincidePrecio;
    });

    // Recalcula la paginación y muestra la primera página de los resultados
    totalPaginas = Math.ceil(productosFiltrados.length / porPagina) || 1;
    paginaActual = 1;
    mostrarPagina(paginaActual);
}

// Eventos para los filtros
filtroBusqueda.addEventListener('input', aplicarFiltros);
document.getElementById("btn-filtrar").addEventListener("click", aplicarFiltros);

// LIMPIAR filtros
document.getElementById("btn-limpiar").addEventListener("click", () => {
    document.getElementById("precio-min").value = "";
    document.getElementById("precio-max").value = "";
    filtroBusqueda.value = ""; // Limpia el campo de búsqueda
    productosFiltrados = [];

    totalPaginas = Math.ceil(productos.length / porPagina);
    paginaActual = 1;
    mostrarPagina(paginaActual);
});

// ORDENAMIENTO
document.getElementById("ordenar").addEventListener("change", (e) => {
    let lista = getListaActual().slice();

    if (e.target.value === "precio-asc") {
        lista.sort((a, b) => a.cost - b.cost);
    } else if (e.target.value === "precio-desc") {
        lista.sort((a, b) => b.cost - a.cost);
    } else if (e.target.value === "relevancia") {
        lista.sort((a, b) => b.soldCount - a.soldCount);
    }

    productosFiltrados = lista;
    totalPaginas = Math.ceil(productosFiltrados.length / porPagina);
    paginaActual = 1;
    mostrarPagina(paginaActual);
});

function setProductID(id) {
    localStorage.setItem("productID", id);  // guardamos el ID
    window.location = "productos-info.html"; // redirigimos a la página de detalles
}
productos.forEach(producto => {
    const card = document.createElement("div");
    card.classList.add("list-group-item");
    card.innerHTML = `
        <h4>${producto.name}</h4>
        <p>${producto.description}</p>
        <small>${producto.currency} ${producto.cost}</small>
    `;

    // Al hacer click en la card, guardamos el ID y vamos a la página de detalles
    card.addEventListener("click", () => setProductID(producto.id));

    container.appendChild(card);
});
