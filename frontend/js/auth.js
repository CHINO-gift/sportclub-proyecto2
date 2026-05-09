function guardarSesion(token, user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
}

function obtenerToken() {
    return localStorage.getItem("token");
}

function obtenerUsuario() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

function protegerPagina() {
    const token = obtenerToken();

    if (!token) {
        window.location.href = "login.html";
    }
}

function redireccionarPorRol(role) {
    if (role === "admin") {
        window.location.href = "admin.html";
    } else if (role === "coach") {
        window.location.href = "coach.html";
    } else {
        window.location.href = "user.html";
    }
}