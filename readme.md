# SportClub - FrontEnd con API

Proyecto desarrollado para la evaluación de Programación Front End.

## Descripción

SportClub es una aplicación web para la gestión de un club deportivo. El sistema permite iniciar sesión, registrar usuarios, redirigir según rol, administrar usuarios, revisar paneles personalizados, editar perfil y cambiar contraseña.

El proyecto cuenta con tres tipos de usuarios:

- Administrador
- Coach
- Usuario

Cada rol tiene acceso a vistas y funcionalidades diferentes dentro del sistema.

## Tecnologías utilizadas

- HTML5
- CSS3
- Bootstrap 5.3.3
- JavaScript
- Fetch API
- LocalStorage
- Node.js
- Express
- SQLite
- Git y GitHub

## Estructura del proyecto

Sportclub_Proyecto/
├── backend/
├── frontend/
│   ├── index.html
│   ├── assets/
│   │   ├── admin.png
│   │   ├── coach.png
│   │   ├── logo.png
│   │   ├── perfil.png
│   │   └── usuario.png
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── admin.js
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── config.js
│   │   ├── login.js
│   │   ├── perfil.js
│   │   ├── register.js
│   │   └── validators.js
│   └── vistas/
│       ├── admin.html
│       ├── admin-configuracion.html
│       ├── admin-reportes.html
│       ├── coach.html
│       ├── coach-alumnos.html
│       ├── coach-clases.html
│       ├── login.html
│       ├── perfil.html
│       ├── register.html
│       ├── user.html
│       ├── usuario-clases.html
│       └── usuario-reservas.html
└── README.md