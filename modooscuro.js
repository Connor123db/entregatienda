// =================== MODO OSCURO GLOBAL ===================

// Crear el botón automáticamente si no existe
window.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("modoOscuroBtn")) {
    const boton = document.createElement("button");
    boton.id = "modoOscuroBtn";
    boton.className = "modo-oscuro-btn";
    boton.innerHTML = '<i class="fa-solid fa-sun"></i>';
    document.body.appendChild(boton);
  }

  const btnModo = document.getElementById("modoOscuroBtn");
  const icono = btnModo.querySelector("i");

  // Cargar estado guardado
  if (localStorage.getItem("modoOscuro") === "true") {
    document.body.classList.add("dark-mode");
    icono.classList.remove("fa-sun");
    icono.classList.add("fa-moon");
  }

  // Al hacer clic, alternar modo
  btnModo.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const activo = document.body.classList.contains("dark-mode");

    icono.classList.toggle("fa-sun", !activo);
    icono.classList.toggle("fa-moon", activo);

    // Guardar preferencia
    localStorage.setItem("modoOscuro", activo);
  });
});