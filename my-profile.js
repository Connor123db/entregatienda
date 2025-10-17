document.addEventListener("DOMContentLoaded", () => {
    // OBTENER SESIÓN ACTUAL Y ELEMENTOS
    const usuarioSesion = JSON.parse(localStorage.getItem("usuario"));
    if (!usuarioSesion) {
        window.location.href = "index.html";
        return;
    }

    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const profileImage = document.getElementById("profileImage");
    const editPhotoBtn = document.getElementById("editPhotoBtn");
    const imageInput = document.getElementById("imageInput");
    const profileForm = document.getElementById("profileForm");

    // 2. Cargar datos desde cuentasUsuarios
    const cuentas = JSON.parse(localStorage.getItem("cuentasUsuarios")) || [];
    const usuarioIndex = cuentas.findIndex(c => c.usuario === usuarioSesion.usuario);
    let usuarioDatos = usuarioIndex !== -1 ? cuentas[usuarioIndex] : usuarioSesion;

    // Inicializar campos
    firstName.value = usuarioDatos.nombre || "";
    lastName.value = usuarioDatos.apellido || "";
    email.value = usuarioDatos.correo || usuarioDatos.email || "";
    phone.value = usuarioDatos.telefono || "";

    // Cargar la imagen Base64 si existe
    if (usuarioDatos.fotoPerfil) {
        profileImage.src = usuarioDatos.fotoPerfil;
    }

    // 3. EVENTO BASE64 (Editar Foto) 🖼️

    editPhotoBtn.addEventListener("click", () => {
        imageInput.value = "";
        imageInput.click(); // Abrir selección de archivo
    });

    imageInput.addEventListener("change", (e) => {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function(ev) {
                // ev.target.result es la cadena Base64 (Data URI)
                const base64ImageString = ev.target.result; 
                
                // Mostrar la imagen en el DOM
                profileImage.src = base64ImageString;

                // Temporalmente, actualizar el objeto de datos del usuario
                // para que se guarde cuando se envíe el formulario.
                usuarioDatos.fotoPerfil = base64ImageString;
            };

            // ¡Esta es la función clave que codifica a Base64!
            reader.readAsDataURL(file); 
        }
    });

    // GUARDAR DATOS DEL FORMULARIO (Incluyendo la imagen con Base64)
    profileForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // **NOTA IMPORTANTE:** 'usuarioDatos.fotoPerfil' ya fue actualizada
        // en el paso anterior si el usuario seleccionó una nueva foto.
        
        const usuarioActualizado = {
            ...usuarioDatos,
            nombre: firstName.value,
            apellido: lastName.value,
            correo: email.value,
            telefono: phone.value,
            // La fotoPerfil (cadena Base64) se toma del objeto usuarioDatos
            // o mantiene el valor anterior si no se cambió.
            fotoPerfil: usuarioDatos.fotoPerfil || profileImage.src 
        };

        // Actualizar en cuentasUsuarios (Base de datos simulada)
        if (usuarioIndex !== -1) {
            cuentas[usuarioIndex] = usuarioActualizado;
            localStorage.setItem("cuentasUsuarios", JSON.stringify(cuentas));
        }

        // Actualizar sesión actual
        localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));

        alert("Datos guardados correctamente ✅");
    });

    // CERRAR SESIÓN
    const cerrarSesionBtn = document.getElementById("cerrarSesion");
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener("click", () => {
            localStorage.removeItem("usuario");
            window.location.href = "index.html";
        });
    }
});
