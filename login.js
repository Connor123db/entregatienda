document.getElementById("btnIngresar").addEventListener("click", () => {
    const usuario = document.getElementById("usuario").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();

    if (usuario === "" || contrasena === "") {
        alert("Por favor complete todos los campos");
        return;
    }

    // Guardar sesión ficticia
    localStorage.setItem("usuario", usuario);

    // Redirigir a la página de productos
    window.location.href = "productos.html";
});