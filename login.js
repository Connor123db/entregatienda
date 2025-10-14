document.getElementById("btnIngresar").addEventListener("click", () => {
  const usuarioIngresado = document.getElementById("usuario").value.trim();
  const contrasenaIngresada = document.getElementById("contrasena").value.trim();

  if (usuarioIngresado === "" || contrasenaIngresada === "") {
    alert("Por favor complete todos los campos");
    return;
  }

  // Guardar sesión como objeto, email vacío para que lo complete en el perfil
    const usuarioObj = {
        nombre: usuario,
        apellido: "",
        email: "",
        telefono: "",
        fotoPerfil: ""
    };
    localStorage.setItem("usuario", JSON.stringify(usuarioObj));
  
  // Redirigir a la página de productos
    window.location.href = "productos.html";
  
  // ✅ Cuenta especial de administrador (no editable desde crearcuenta)
  if (usuarioIngresado === "admin" && contrasenaIngresada === "admin123") {
    localStorage.setItem("usuario", "admin");
    alert("Bienvenido Administrador");
    window.location.href = "admin.html";
    return;
  }

  // 🔍 Obtener todas las cuentas guardadas
  const cuentasGuardadas = JSON.parse(localStorage.getItem("cuentasUsuarios")) || [];

  if (cuentasGuardadas.length === 0) {
    alert("No hay ninguna cuenta registrada. Crea una primero.");
    window.location.href = "crearcuenta.html";
    return;
  }

  // Buscar cuenta válida
  const cuentaValida = cuentasGuardadas.find(
    (cuenta) =>
      (cuenta.usuario === usuarioIngresado || cuenta.correo === usuarioIngresado) &&
      cuenta.contrasena === contrasenaIngresada
  );

  if (cuentaValida) {
    localStorage.setItem("usuario", cuentaValida.usuario);
    alert(`Bienvenido, ${cuentaValida.usuario}`);
    window.location.href = "productos.html";
  } else {
    alert("Usuario o contraseña incorrectos");
  }
});
