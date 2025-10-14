document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario")) || {};

  // Cargar datos en el formulario
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const profileImage = document.getElementById("profileImage");

  if (firstName) firstName.value = usuario.nombre || "";
  if (lastName) lastName.value = usuario.apellido || "";
  if (email) email.value = usuario.email || "";
  if (phone) phone.value = usuario.telefono || "";
  if (profileImage && usuario.fotoPerfil) profileImage.src = usuario.fotoPerfil;

  // Guardar perfil
  const profileForm = document.getElementById("profileForm");
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const usuarioActualizado = {
        nombre: firstName ? firstName.value : "",
        apellido: lastName ? lastName.value : "",
        email: email ? email.value : "",
        telefono: phone ? phone.value : "",
        fotoPerfil: profileImage ? profileImage.src : ""
      };
      localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
      alert("Datos guardados correctamente ✅");
    });
  }

  // Editar foto de perfil
  const editPhotoBtn = document.getElementById("editPhotoBtn");
  const imageInput = document.getElementById("imageInput");

  if (editPhotoBtn && imageInput && profileImage) {
    editPhotoBtn.addEventListener("click", () => {
      imageInput.value = ""; // Permite cargar la misma foto
      imageInput.click();
    });

    imageInput.addEventListener("change", () => {
      const file = imageInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          profileImage.src = e.target.result;
          // Guarda la foto en localStorage inmediatamente
          const usuarioActualizado = {
            nombre: firstName ? firstName.value : "",
            apellido: lastName ? lastName.value : "",
            email: email ? email.value : "",
            telefono: phone ? phone.value : "",
            fotoPerfil: e.target.result
          };
          localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Cerrar sesión
  const cerrarSesion = document.getElementById("cerrarSesion");
  if (cerrarSesion) {
    cerrarSesion.addEventListener("click", () => {
      localStorage.removeItem("usuario");
      window.location.href = "login.html";
    });
  }
});
