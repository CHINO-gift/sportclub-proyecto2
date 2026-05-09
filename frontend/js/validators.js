function limpiarErrores(form) {
    const errores = form.querySelectorAll(".error-text");
    const inputs = form.querySelectorAll(".form-control, .form-select");

    errores.forEach(error => {
        error.textContent = "";
    });

    inputs.forEach(input => {
        input.classList.remove("is-invalid");
    });
}

function mostrarError(inputId, mensaje) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(`${inputId}Error`);

    if (input) {
        input.classList.add("is-invalid");
    }

    if (error) {
        error.textContent = mensaje;
    }
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarPassword(password) {
    return password.length >= 8;
}