// Verificar si el usuario es admin
const usuarioActual = localStorage.getItem("usuario");

if (usuarioActual !== "admin") {
  alert("Acceso denegado. Solo el administrador puede entrar aquí.");
  window.location.href = "index.html";
}

// Obtener usuarios
const tabla = document.getElementById("tablaUsuarios").querySelector("tbody");

function cargarUsuarios() {
  tabla.innerHTML = "";
  const cuentas = JSON.parse(localStorage.getItem("cuentasUsuarios")) || [];

  if (cuentas.length === 0) {
    tabla.innerHTML = `<tr><td colspan="4" style="text-align:center;">No hay usuarios registrados</td></tr>`;
    return;
  }

  cuentas.forEach((cuenta, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${cuenta.correo}</td>
      <td>${cuenta.usuario}</td>
      <td>${cuenta.contrasena}</td>
      <td><button class="btnBorrar" data-index="${index}">Borrar</button></td>
    `;
    tabla.appendChild(fila);
  });

  // Botones borrar
  document.querySelectorAll(".btnBorrar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const i = e.target.dataset.index;
      borrarUsuario(i);
    });
  });
}

function borrarUsuario(index) {
  const cuentas = JSON.parse(localStorage.getItem("cuentasUsuarios")) || [];
  if (confirm(`¿Seguro que deseas borrar el usuario "${cuentas[index].usuario}"?`)) {
    cuentas.splice(index, 1);
    localStorage.setItem("cuentasUsuarios", JSON.stringify(cuentas));
    cargarUsuarios();
  }
}

// Cerrar sesión
document.getElementById("btnCerrarSesion").addEventListener("click", () => {
  localStorage.removeItem("usuario");
  window.location.href = "index.html";
});

cargarUsuarios();