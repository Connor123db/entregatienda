document.getElementById("btnCrearCuenta").addEventListener("click", () => {
  const correo = document.getElementById("correo").value.trim();
  const usuario = document.getElementById("usuario").value.trim();
  const contrasena = document.getElementById("contrasena").value.trim();
  const confirmar = document.getElementById("confirmarContrasena").value.trim();

  if (!correo || !usuario || !contrasena || !confirmar) {
    alert("Por favor completa todos los campos");
    return;
  }

  if (contrasena !== confirmar) {
    alert("Las contraseñas no coinciden");
    return;
  }

  // Obtener cuentas existentes o crear un array vacío
  const cuentasGuardadas = JSON.parse(localStorage.getItem("cuentasUsuarios")) || [];

  // Verificar si el usuario o correo ya existen
  const existe = cuentasGuardadas.some(
    (cuenta) => cuenta.usuario === usuario || cuenta.correo === correo
  );

  if (existe) {
    alert("Ese usuario o correo ya está registrado");
    return;
  }

  // Crear nueva cuenta
  const nuevaCuenta = {
    correo: correo,
    usuario: usuario,
    contrasena: contrasena
  };

  // Guardar la nueva cuenta en el array
  cuentasGuardadas.push(nuevaCuenta);
  localStorage.setItem("cuentasUsuarios", JSON.stringify(cuentasGuardadas));

  alert("Cuenta creada con éxito. Ahora puedes iniciar sesión.");
  window.location.href = "index.html";
});
