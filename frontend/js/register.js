const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

registerForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    limpiarErrores(registerForm);
    registerMessage.textContent = "";
    registerMessage.className = "success-text text-center";

    const full_name = document.getElementById("full_name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const birth_date = document.getElementById("birth_date").value;
    const password = document.getElementById("password").value;
    const confirm_password = document.getElementById("confirm_password").value;

    let valido = true;

    if (!full_name) {
        mostrarError("full_name", "El nombre completo es obligatorio");
        valido = false;
    } else if (full_name.length < 3) {
        mostrarError("full_name", "El nombre debe tener al menos 3 caracteres");
        valido = false;
    }

    if (!email) {
        mostrarError("email", "El correo es obligatorio");
        valido = false;
    } else if (!validarEmail(email)) {
        mostrarError("email", "El correo no tiene un formato válido");
        valido = false;
    }

    if (!password) {
        mostrarError("password", "La contraseña es obligatoria");
        valido = false;
    } else if (!validarPassword(password)) {
        mostrarError("password", "La contraseña debe tener mínimo 8 caracteres");
        valido = false;
    }

    if (!confirm_password) {
        mostrarError("confirm_password", "Debe confirmar la contraseña");
        valido = false;
    } else if (password !== confirm_password) {
        mostrarError("confirm_password", "Las contraseñas no coinciden");
        valido = false;
    }

    if (!valido) {
        return;
    }

    try {
        await apiRequest("/auth/register", "POST", {
            full_name: full_name,
            email: email,
            password: password,
            birth_date: birth_date,
            metadata: {
                sport: "",
                interests: ""
            }
        });

        registerMessage.textContent = "Usuario registrado correctamente. Ahora puedes iniciar sesión.";

        setTimeout(function() {
            window.location.href = "login.html";
        }, 1500);

    } catch (error) {
        registerMessage.className = "error-text text-center mt-3";
        registerMessage.textContent = error.message || "No se pudo registrar el usuario";
    }
});