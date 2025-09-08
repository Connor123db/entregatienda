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
// Comprobar si el usuario está logueado
if (!localStorage.getItem('usuario')) {
    window.location.href = 'index.html';
}

// Variables de paginación
let paginaActual = 1;
const porPagina = 5;
let productos = [];
let totalPaginas = 1;

// productos.js
// ... (código existente)

function mostrarPagina(pagina) {
    const contenedor = document.getElementById('contenedor-productos');
    contenedor.innerHTML = '';

    const inicio = (pagina - 1) * porPagina;
    const fin = inicio + porPagina;
    const productosPagina = productos.slice(inicio, fin);

    const galeria = document.createElement('div');
    galeria.className = 'galeria-vehiculos';

    productosPagina.forEach(producto => {
        // Envolver el div del producto en un enlace
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

        // Agrega el div del producto dentro del enlace
        enlaceProducto.appendChild(div);

        // Agrega el enlace a la galería
        galeria.appendChild(enlaceProducto);
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

