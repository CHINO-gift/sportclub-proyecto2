protegerPagina();

const token = obtenerToken();

const profileMessage = document.getElementById("profileMessage");
const profileForm = document.getElementById("profileForm");
const passwordForm = document.getElementById("passwordForm");

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileBirthDate = document.getElementById("profileBirthDate");
const profileRole = document.getElementById("profileRole");
const profileRoleCard = document.getElementById("profileRoleCard");
const linkInicio = document.getElementById("linkInicio");

document.addEventListener("DOMContentLoaded", function() {
    configurarLinkInicio();
    cargarPerfil();
});

profileForm.addEventListener("submit", function(e) {
    e.preventDefault();
    actualizarPerfil();
});

passwordForm.addEventListener("submit", function(e) {
    e.preventDefault();
    cambiarPassword();
});

function configurarLinkInicio() {
    const user = obtenerUsuario();

    if (!user) {
        linkInicio.href = "login.html";
        return;
    }

    if (user.role === "admin") {
        linkInicio.href = "admin.html";
    } else if (user.role === "coach") {
        linkInicio.href = "coach.html";
    } else {
        linkInicio.href = "user.html";
    }
}

async function cargarPerfil() {
    try {
        const result = await apiRequest("/auth/me", "GET", null, token);
        const user = result.data;

        document.getElementById("full_name").value = user.full_name || "";
        document.getElementById("email").value = String(user.email || "").toLowerCase();
        document.getElementById("birth_date").value = formatearFechaInput(user.birth_date);
        document.getElementById("metadata").value = obtenerMetadataTexto(user.metadata);

        profileName.textContent = capitalizar(user.full_name);
        profileEmail.textContent = String(user.email || "").toLowerCase();
        profileBirthDate.textContent = formatearFecha(user.birth_date);

        profileRole.textContent = user.role;
        profileRole.className = `role-badge role-${user.role}`;

        profileRoleCard.textContent = user.role;
        profileRoleCard.className = `role-badge role-${user.role}`;

    } catch (error) {
        mostrarMensaje("danger", error.message || "No se pudo cargar el perfil");
    }
}

async function actualizarPerfil() {
    limpiarErrores(profileForm);
    profileMessage.textContent = "";

    const full_name = document.getElementById("full_name").value.trim();
    const birth_date = document.getElementById("birth_date").value;
    const metadataTexto = document.getElementById("metadata").value.trim();

    let valido = true;

    if (!full_name) {
        mostrarError("full_name", "El nombre es obligatorio");
        valido = false;
    } else if (full_name.length < 3) {
        mostrarError("full_name", "El nombre debe tener al menos 3 caracteres");
        valido = false;
    }

    if (!valido) {
        return;
    }

    const data = {
        full_name: full_name,
        birth_date: birth_date || null,
        metadata: {
            descripcion: metadataTexto
        }
    };

    try {
        const result = await apiRequest("/auth/me", "PUT", data, token);

        mostrarMensaje("success", "Perfil actualizado correctamente");

        if (result.data) {
            const user = obtenerUsuario();

            if (user) {
                user.full_name = result.data.full_name || full_name;
                localStorage.setItem("user", JSON.stringify(user));
            }
        }

        cargarPerfil();

    } catch (error) {
        mostrarErroresBackend(error);
    }
}

async function cambiarPassword() {
    limpiarErrores(passwordForm);
    profileMessage.textContent = "";

    const current_password = document.getElementById("current_password").value;
    const new_password = document.getElementById("new_password").value;
    const confirm_password = document.getElementById("confirm_password").value;

    let valido = true;

    if (!current_password) {
        mostrarError("current_password", "La contraseña actual es obligatoria");
        valido = false;
    }

    if (!new_password) {
        mostrarError("new_password", "La nueva contraseña es obligatoria");
        valido = false;
    } else if (!validarPassword(new_password)) {
        mostrarError("new_password", "La nueva contraseña debe tener mínimo 8 caracteres");
        valido = false;
    }

    if (!confirm_password) {
        mostrarError("confirm_password", "Debe confirmar la nueva contraseña");
        valido = false;
    } else if (new_password !== confirm_password) {
        mostrarError("confirm_password", "Las contraseñas no coinciden");
        valido = false;
    }

    if (!valido) {
        return;
    }

    try {
        await apiRequest("/auth/me/password", "PUT", {
            current_password: current_password,
            new_password: new_password,
            confirm_password: confirm_password
        }, token);

        mostrarMensaje("success", "Contraseña actualizada correctamente");
        passwordForm.reset();

    } catch (error) {
        mostrarErroresBackend(error);
    }
}

function mostrarMensaje(tipo, mensaje) {
    profileMessage.className = `alert alert-${tipo}`;
    profileMessage.textContent = mensaje;

    setTimeout(function() {
        profileMessage.className = "";
        profileMessage.textContent = "";
    }, 3500);
}

function mostrarErroresBackend(error) {
    if (error.errors) {
        Object.keys(error.errors).forEach(function(campo) {
            const mensaje = Array.isArray(error.errors[campo])
                ? error.errors[campo].join(" ")
                : error.errors[campo];

            mostrarError(campo, mensaje);
        });
    }

    mostrarMensaje("danger", error.message || "Revisa los datos ingresados");
}

function formatearFecha(fecha) {
    if (!fecha) {
        return "-";
    }

    const date = new Date(fecha);

    if (isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString("es-CL");
}

function formatearFechaInput(fecha) {
    if (!fecha) {
        return "";
    }

    const date = new Date(fecha);

    if (isNaN(date.getTime())) {
        return "";
    }

    return date.toISOString().split("T")[0];
}

function obtenerMetadataTexto(metadata) {
    if (!metadata) {
        return "";
    }

    if (typeof metadata === "string") {
        return metadata;
    }

    if (metadata.descripcion) {
        return metadata.descripcion;
    }

    if (metadata.interests) {
        return metadata.interests;
    }

    if (metadata.sport) {
        return metadata.sport;
    }

    return "";
}

function capitalizar(texto) {
    if (!texto) {
        return "-";
    }

    return texto
        .toLowerCase()
        .split(" ")
        .map(function(palabra) {
            return palabra.charAt(0).toUpperCase() + palabra.slice(1);
        })
        .join(" ");
}