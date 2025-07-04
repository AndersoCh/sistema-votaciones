# 🗳️ Sistema de Votaciones API

Una API RESTful construida con **Node.js**, **Express**, y **MySQL** para gestionar un sistema de votación que incluye registro y autenticación de votantes, gestión de candidatos, y registro de votos de manera segura con autenticación mediante JWT.

---

## 🚀 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Endpoints](#endpoints)
- [Autenticación](#🔐-autenticación-jwt)
- [Ejemplos con Postman](#📬-ejemplos-con-postman)
- [To-do / Mejoras futuras](#🔧-to-do--mejoras)

---

## 📌 Características

- Registro seguro de votantes
- Registro de candidatos (sin duplicar votantes)
- Login de votantes con JWT
- Evita que un usuario vote más de una vez
- Votación protegida con token
- Validaciones de datos y manejo de errores
- Paginación y filtrado de listas
- Código modular y organizado

---

## 🧰 Tecnologías

- Node.js
- Express
- MySQL
- JWT (jsonwebtoken)
- dotenv
- body-parser
- mysql2

---

## ⚙️ Instalación

1. Clona el repositorio

```bash
git clone  https://github.com/AndersoCh/sistema-votaciones
cd sistema-votaciones



bash
Copiar
Editar

## ⚙️ Instalación dependencias

npm install


## 🔐 Variables de Entorno
PORT=3000
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña
DB_NAME=votaciones_db
JWT_SECRET=supersecreto123
JWT_EXPIRES_IN=1h

📁 Estructura de Carpetas

├── controllers/
│   ├──  candidateController.js
│   ├── voteController.js
│   └── voterController.js
├── routes/
│   ├──  candidateRoutes.js
│   ├──  voteRoutes.js
│   └──  voterRoutes.js
├── middleware/
│   └── verifyToken.js
├── db.js
├── index.js
├── .env
├── query db.sql
├── package.json
└── README.md

📡 Endpoints
 
 🔐 Autenticación

POST /login
Autentica un votante con email y dni.

{
  "email": "prueba@example.com", 
  "dni": "12345678"
}

retorna token 

👤 Votantes

| Método | Ruta          | Descripción                | 
| ------ | ------------- | -------------------------- | 
| POST   | `/voters`     | Crear votante              | 
| GET    | `/voters`     | Listar votantes (paginado) | 
| GET    | `/voters/:id` | Obtener votante por ID     | 
| DELETE | `/voters/:id` | Eliminar votante           | 


🧑‍💼 Candidatos

| Método | Ruta              | Descripción                  | 
| ------ | ----------------- | ---------------------------- | 
| GET    | `/candidates`     | Listar candidatos (paginado) | 
| GET    | `/candidates/:id` | Obtener candidato por ID     | 
| DELETE | `/candidates/:id` | Eliminar candidato           | 


🗳️ Votos
| Método | Ruta                | Descripción                  | Protegida |
| ------ | ------------------- | ---------------------------- | --------- |
| POST   | `/votes`            | Emitir voto                  | ✅         |
| GET    | `/votes`            | Obtener todos los votos      | ✅         |
| GET    | `/votes/statistics` | Ver estadísticas de votación | ✅         |


🔐 Autenticación (JWT)
Los endpoints protegidos requieren un token JWT válido en el encabezado:

Authorization: Bearer TU_TOKEN


📬 Ejemplos con Postman

Registra un votante:

 POST http://localhost:3000/voters
    Body (JSON):
      {
      "name": "Anderson Chavarría",
      "email": "anderson@example.com",
      "dni": "12345678"
      }

    Obtener votantes filtrados por nombre y paginados
      GET /voters?search=anderson&page=1&limit=5
    Ejemplo:  GET http://localhost:3000/voters?search=anderson&page=1&limit=5

 
Login:
   POST http://localhost:3000/login
    {
    "email": "anderson@example.com",
    "dni": "12345678"
    }

Crear candidato (requiere token):
   POST http://localhost:3000/candidates
    Headers: Authorization: Bearer <token>
    {
    "name": "Laura Ríos",
    "party": "Partido Verde",
    "dni": "88889999"
    }   

   Obtener candidatos filtrados por partido
     GET /candidates?search=verde
   Ejemplo:
    GET http://localhost:3000/candidates?search=verde&page=2&limit=3

     
 Votar:
   POST http://localhost:3000/votes
    Headers: Authorization: Bearer <token>
    {
    "candidateId": 2,
    "voter_id": 1
    }


 🔧 To-do / Mejoras

    - [ ] Agregar actualización de datos (PUT)
    - [ ] Agregar pruebas unitarias
    - [ ] Mejorar manejo de errores con un middleware global
    - [ ] Validar estructura del email con regex o express-validator
    - [ ] Validación más estricta con OWASP Top 10 en mente (inyección SQL, XSS, exposición de datos, etc.).
    - [ ] Bloqueo automático de cuentas tras varios intentos fallidos (por ejemplo, 3 intentos → bloqueo).
    - [ ] Uso de tokens seguros como UUID en lugar de IDs autoincrementales para mayor protección en URLs.
    - [ ] Implementación de roles y permisos (por ejemplo: admin, votante) para aplicar el principio de mínimo privilegio.
    - [ ] CI/CD con GitHub Actions o GitLab CI para pruebas automáticas y despliegue a producción tras cada commit en main
    - [ ] Separación de entornos (desarrollo, pruebas y producción).
    - [ ] Migrar de solo access tokens a un sistema con refresh tokens para sesiones más seguras y persistentes.


MIT © 2025 - Desarrollado por Anderson Chavarría

