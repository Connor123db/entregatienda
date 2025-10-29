document.getElementById("btnIngresar").addEventListener("click", () => {
  const usuarioIngresado = document.getElementById("usuario").value.trim();
  const contrasenaIngresada = document.getElementById("contrasena").value.trim();

  if (!usuarioIngresado || !contrasenaIngresada) {
    alert("Por favor complete todos los campos");
    return;
  }

  // Cuenta especial de administrador
  if (usuarioIngresado === "admin" && contrasenaIngresada === "admin123") {
    localStorage.setItem("usuario", "admin");
    alert("Bienvenido Administrador");
    window.location.href = "admin.html";
    return;
  }

  // Obtener cuentas guardadas
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
    // Guardar todos los datos del usuario en localStorage
    const usuarioObj = {
      usuario: cuentaValida.usuario,
      nombre: cuentaValida.nombre || "",    // si no tiene nombre, vacío
      apellido: cuentaValida.apellido || "",
      email: cuentaValida.correo,
      telefono: cuentaValida.telefono || "",
      fotoPerfil: cuentaValida.fotoPerfil || ""
    };
    localStorage.setItem("usuario", JSON.stringify(usuarioObj));
    alert(`Bienvenido, ${cuentaValida.usuario}`);
    window.location.href = "productos.html";
  } else {
    alert("Usuario o contraseña incorrectos");
  }
});
