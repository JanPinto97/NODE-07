📋 Task Manager API – Node.js

API REST per a la gestió de tasques amb autenticació JWT, autorització per rols i pujada d’imatges (local i Cloudinary).

🚀 Tecnologies utilitzades

Node.js

Express

MongoDB + Mongoose

JWT (jsonwebtoken)

bcrypt

express-validator

Multer

Cloudinary

📦 Instal·lació
1️⃣ Clonar el repositori
git clone https://github.com/EL_TEU_USUARI/task-manager-api.git
cd task-manager-api

2️⃣ Instal·lar dependències
npm install

3️⃣ Configurar variables d’entorn

Crea un fitxer .env a partir de .env.example:

cp .env.example .env


Edita .env amb les teves dades reals.

4️⃣ Arrencar el servidor
npm run dev


Servidor disponible a:

http://localhost:3000

🔐 Variables d’entorn necessàries

Exemple de .env.example:

# MongoDB
MONGO_URI=mongodb://localhost:27017/taskmanager

# JWT
JWT_SECRET=clau_secreta_llarga_i_segura
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=el_teu_cloud_name
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=clau_ficticia


⚠️ El fitxer .env NO s’ha de pujar al repositori.

🔐 Sistema d’autenticació i autorització
🔑 Autenticació (JWT)

Els usuaris es registren i inicien sessió amb email i contrasenya

La contrasenya es xifra amb bcrypt

En fer login o register es retorna un JWT

El token s’envia a les rutes protegides mitjançant el header:

Authorization: Bearer <TOKEN>

🛡️ Autorització

Cada tasca està associada a un usuari (user)

Un usuari només pot veure/modificar/eliminar les seves tasques

Existeixen dos rols:

user

admin

👑 Rol admin

Un usuari amb rol admin pot:

Veure tots els usuaris

Veure totes les tasques

Eliminar usuaris (i les seves tasques)

Canviar el rol d’altres usuaris

📡 Endpoints disponibles
🔐 Autenticació (/api/auth)
Mètode	Ruta	Descripció
POST	/register	Registrar usuari
POST	/login	Iniciar sessió
GET	/me	Perfil de l’usuari autenticat
PUT	/profile	Actualitzar perfil
PUT	/change-password	Canviar contrasenya
📋 Tasques (/api/tasks) – Protegides
Mètode	Ruta	Descripció
POST	/	Crear tasca
GET	/	Obtenir tasques de l’usuari
GET	/:id	Obtenir tasca per ID
PUT	/:id	Actualitzar tasca
DELETE	/:id	Eliminar tasca
GET	/stats	Estadístiques de l’usuari
PUT	/:id/image	Actualitzar imatge
PUT	/:id/image/reset	Reset imatge
📤 Upload d’imatges (/api/upload) – Protegides
Mètode	Ruta	Descripció
POST	/local	Pujar imatge local
POST	/cloud	Pujar imatge a Cloudinary
👑 Administració (/api/admin) – Només admin
Mètode	Ruta	Descripció
GET	/users	Llistar usuaris
GET	/tasks	Llistar totes les tasques
DELETE	/users/:id	Eliminar usuari
PUT	/users/:id/role	Canviar rol
🧪 Exemples d’ús (Postman)
📝 Registrar usuari
POST /api/auth/register

{
  "name": "Joan Garcia",
  "email": "joan@example.com",
  "password": "contrasenya123"
}

🔑 Login
POST /api/auth/login

{
  "email": "joan@example.com",
  "password": "contrasenya123"
}

➕ Crear tasca (autenticada)
POST /api/tasks
Authorization: Bearer <TOKEN>

{
  "title": "Dissenyar logo",
  "cost": 300,
  "hours_estimated": 8
}

❌ Error sense token
GET /api/tasks


Resposta:

{
  "success": false,
  "error": "No autoritzat. Token no proporcionat"
}
