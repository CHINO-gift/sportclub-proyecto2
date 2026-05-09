protegerPagina();

const token = obtenerToken();
const usersTableBody = document.getElementById("usersTableBody");
const adminMessage = document.getElementById("adminMessage");
const userFormCard = document.getElementById("userFormCard");
const userForm = document.getElementById("userForm");
const formTitle = document.getElementById("formTitle");

const btnNuevoUsuario = document.getElementById("btnNuevoUsuario");
const btnCancelar = document.getElementById("btnCancelar");
const btnLimpiar = document.getElementById("btnLimpiar");

document.addEventListener("DOMContentLoaded", function() {
    cargarUsuarios();
});

btnNuevoUsuario.addEventListener("click", function() {
    abrirFormularioNuevo();
});

btnCancelar.addEventListener("click", function() {
    cerrarFormulario();
});

btnLimpiar.addEventListener("click", function() {
    limpiarFormulario();
});

userForm.addEventListener("submit", function(e) {
    e.preventDefault();
    guardarUsuario();
});

async function cargarUsuarios() {
    try {
        usersTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">Cargando usuarios...</td>
            </tr>
        `;

        const result = await apiRequest("/users", "GET", null, token);
        renderUsuarios(result.data);

    } catch (error) {
        mostrarMensaje("danger", error.message || "No se pudieron cargar los usuarios");
    }
}

function renderUsuarios(users) {
    usersTableBody.textContent = "";

    if (!users || users.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 6;
        cell.className = "text-center";
        cell.textContent = "No hay usuarios registrados";

        row.appendChild(cell);
        usersTableBody.appendChild(row);
        return;
    }

    users.forEach(function(user) {
        const row = document.createElement("tr");

        row.appendChild(crearCelda(user.id));
        row.appendChild(crearCelda(capitalizar(user.full_name)));
        row.appendChild(crearCelda(String(user.email || "").toLowerCase()));

        const roleCell = document.createElement("td");
        const badge = document.createElement("span");

        badge.className = `role-badge role-${user.role}`;
        badge.textContent = user.role;

        roleCell.appendChild(badge);
        row.appendChild(roleCell);

        row.appendChild(crearCelda(formatearFecha(user.createdAt || user.created_at || user.fecha_registro || user.createdAtFormatted)));

        const accionesCell = document.createElement("td");

        const btnEditar = document.createElement("button");
        btnEditar.className = "btn btn-sm btn-warning me-2";
        btnEditar.textContent = "Editar";
        btnEditar.addEventListener("click", function() {
            cargarUsuarioParaEditar(user.id);
        });

        const btnEliminar = document.createElement("button");
        btnEliminar.className = "btn btn-sm btn-danger";
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener("click", function() {
            eliminarUsuario(user.id);
        });

        accionesCell.appendChild(btnEditar);
        accionesCell.appendChild(btnEliminar);

        row.appendChild(accionesCell);
        usersTableBody.appendChild(row);
    });
}

function crearCelda(texto) {
    const cell = document.createElement("td");
    cell.textContent = texto || "-";
    return cell;
}

function abrirFormularioNuevo() {
    limpiarFormulario();
    formTitle.textContent = "Nuevo Usuario";
    document.getElementById("password").disabled = false;
    userFormCard.classList.remove("d-none");
}

function cerrarFormulario() {
    limpiarFormulario();
    userFormCard.classList.add("d-none");
}

function limpiarFormulario() {
    userForm.reset();
    document.getElementById("userId").value = "";
    document.getElementById("password").disabled = false;
    limpiarErrores(userForm);
}

async function cargarUsuarioParaEditar(id) {
    try {
        const result = await apiRequest(`/users/${id}`, "GET", null, token);
        const user = result.data;

        document.getElementById("userId").value = user.id;
        document.getElementById("full_name").value = user.full_name || "";
        document.getElementById("email").value = user.email || "";
        document.getElementById("role").value = user.role || "user";
        document.getElementById("birth_date").value = formatearFechaInput(user.birth_date);
        document.getElementById("password").value = "";
        document.getElementById("password").disabled = true;

        formTitle.textContent = "Editar Usuario";
        userFormCard.classList.remove("d-none");

        window.scrollTo({
            top: userFormCard.offsetTop,
            behavior: "smooth"
        });

    } catch (error) {
        mostrarMensaje("danger", error.message || "No se pudo cargar el usuario");
    }
}

async function guardarUsuario() {
    limpiarErrores(userForm);
    adminMessage.textContent = "";

    const id = document.getElementById("userId").value;
    const full_name = document.getElementById("full_name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const role = document.getElementById("role").value;
    const birth_date = document.getElementById("birth_date").value;
    const password = document.getElementById("password").value;

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

    if (!role) {
        mostrarError("role", "El rol es obligatorio");
        valido = false;
    }

    if (!id) {
        if (!password) {
            mostrarError("password", "La contraseña es obligatoria");
            valido = false;
        } else if (!validarPassword(password)) {
            mostrarError("password", "La contraseña debe tener mínimo 8 caracteres");
            valido = false;
        }
    }

    if (!valido) {
        return;
    }

    const data = {
        full_name: full_name,
        email: email,
        role: role,
        birth_date: birth_date || null,
        metadata: {
            sports: []
        }
    };

    if (!id) {
        data.password = password;
    }

    try {
        if (id) {
            await apiRequest(`/users/${id}`, "PUT", data, token);
            mostrarMensaje("success", "Usuario actualizado correctamente");
        } else {
            await apiRequest("/users", "POST", data, token);
            mostrarMensaje("success", "Usuario creado correctamente");
        }

        cerrarFormulario();
        cargarUsuarios();

    } catch (error) {
        mostrarErroresBackend(error);
    }
}

async function eliminarUsuario(id) {
    const confirmar = confirm("¿Seguro que deseas eliminar este usuario?");

    if (!confirmar) {
        return;
    }

    try {
        await apiRequest(`/users/${id}`, "DELETE", null, token);
        mostrarMensaje("success", "Usuario eliminado correctamente");
        cargarUsuarios();

    } catch (error) {
        mostrarMensaje("danger", error.message || "No se pudo eliminar el usuario");
    }
}

function mostrarMensaje(tipo, mensaje) {
    adminMessage.className = `alert alert-${tipo}`;
    adminMessage.textContent = mensaje;

    setTimeout(function() {
        adminMessage.className = "";
        adminMessage.textContent = "";
    }, 3000);
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