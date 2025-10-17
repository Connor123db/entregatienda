// Cambiar fondo al hacer scroll
window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
        document.body.classList.add('fondo-blanco');
    } else {
        document.body.classList.remove('fondo-blanco');
    }
});

// Redirigir al login si no hay usuario
const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));
if (!usuarioGuardado) {
    window.location.href = 'index.html';
}

// Variables de paginación y productos
let paginaActual = 1;
const porPagina = 5;
let productos = [];
let productosFiltrados = [];
let totalPaginas = 1;

// Referencias a elementos HTML
const contenedor = document.getElementById('contenedor-productos');
const filtroBusqueda = document.getElementById('filtro-busqueda');

// Mostrar usuario logueado
document.addEventListener("DOMContentLoaded", () => {
    const usuarioLogueado = document.getElementById("usuario-logueado");
    if (usuarioLogueado && usuarioGuardado) {
        usuarioLogueado.innerHTML = `Bienvenido, <strong>${usuarioGuardado.usuario}</strong>`;
    }

    // Botón cerrar sesión
    const btnCerrar = document.getElementById("cerrar-sesion");
    if (btnCerrar) {
        btnCerrar.addEventListener("click", () => {
            localStorage.removeItem("usuario");
            window.location.href = "index.html";
        });
    }
});

// Función que muestra los productos
function mostrarPagina(pagina) {
    if (!contenedor) return;
    contenedor.innerHTML = '';
    const lista = productosFiltrados.length > 0 ? productosFiltrados : productos;
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

// Paginación
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

// Función para redirigir por categoría
function redirigirCategoria(catID) {
    localStorage.setItem("catID", catID);
    window.location.href = "productos.html";
}

// Cargar productos desde API
let catID = localStorage.getItem("catID") || 101;
const URL = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

fetch(URL)
    .then(response => response.json())
    .then(data => {
        productos = data.products;
        totalPaginas = Math.ceil(productos.length / porPagina);
        paginaActual = 1;
        mostrarPagina(paginaActual);
    })
    .catch(err => console.error("Error cargando productos:", err));

// Aplicar filtros
function aplicarFiltros() {
    const textoBusqueda = filtroBusqueda.value.toLowerCase();
    const min = parseFloat(document.getElementById("precio-min").value) || 0;
    const max = parseFloat(document.getElementById("precio-max").value) || Infinity;

    productosFiltrados = productos.filter(producto => {
        const titulo = producto.name.toLowerCase();
        const descripcion = producto.description.toLowerCase();
        const coincideBusqueda = titulo.includes(textoBusqueda) || descripcion.includes(textoBusqueda);
        const coincidePrecio = producto.cost >= min && producto.cost <= max;
        return coincideBusqueda && coincidePrecio;
    });

    totalPaginas = Math.ceil(productosFiltrados.length / porPagina) || 1;
    paginaActual = 1;
    mostrarPagina(paginaActual);
}

// Eventos de filtros
filtroBusqueda.addEventListener('input', aplicarFiltros);
document.getElementById("btn-filtrar").addEventListener("click", aplicarFiltros);

// Limpiar filtros
document.getElementById("btn-limpiar").addEventListener("click", () => {
    document.getElementById("precio-min").value = "";
    document.getElementById("precio-max").value = "";
    filtroBusqueda.value = "";
    productosFiltrados = [];
    totalPaginas = Math.ceil(productos.length / porPagina);
    paginaActual = 1;
    mostrarPagina(paginaActual);
});

// Ordenamiento
document.getElementById("ordenar").addEventListener("change", (e) => {
    let lista = productosFiltrados.length > 0 ? productosFiltrados.slice() : productos.slice();

    if (e.target.value === "precio-asc") lista.sort((a,b)=>a.cost-b.cost);
    else if (e.target.value === "precio-desc") lista.sort((a,b)=>b.cost-a.cost);
    else if (e.target.value === "relevancia") lista.sort((a,b)=>b.soldCount-a.soldCount);

    productosFiltrados = lista;
    totalPaginas = Math.ceil(productosFiltrados.length / porPagina);
    paginaActual = 1;
    mostrarPagina(paginaActual);
});
