// Comprobar si el usuario está logueado
if (!localStorage.getItem('usuario')) {
    window.location.href = 'index.html';
}

// Variables de paginación
let paginaActual = 1;
const porPagina = 5;
let productos = [];
let totalPaginas = 1;

function mostrarPagina(pagina) {
    const contenedor = document.getElementById('contenedor-productos');
    contenedor.innerHTML = '';

    const inicio = (pagina - 1) * porPagina;
    const fin = inicio + porPagina;
    const productosPagina = productos.slice(inicio, fin);

    // Crear galería de productos
    const galeria = document.createElement('div');
    galeria.className = 'galeria-vehiculos';

    productosPagina.forEach(producto => {
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

        galeria.appendChild(div);
    });

    contenedor.appendChild(galeria);

    document.getElementById('pagina-actual').textContent = `Página ${pagina} de ${totalPaginas}`;
}

document.getElementById('btn-anterior').addEventListener('click', () => {
    if (paginaActual > 1) {
        paginaActual--;
        mostrarPagina(paginaActual);
    }
});

document.getElementById('btn-siguiente').addEventListener('click', () => {
    if (paginaActual < totalPaginas) {
        paginaActual++
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

