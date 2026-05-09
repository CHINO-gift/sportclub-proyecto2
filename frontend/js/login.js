const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    limpiarErrores(loginForm);
    loginMessage.textContent = "";

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();

    let valido = true;

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
    }

    if (!valido) {
        return;
    }

    try {
        const result = await apiRequest("/auth/login", "POST", {
            email: email,
            password: password
        });

        guardarSesion(result.data.token, result.data.user);
        redireccionarPorRol(result.data.user.role);

    } catch (error) {
        loginMessage.textContent = error.message || "Correo o contraseña incorrectos";
    }
});