// Importa la llibreria de Cloudinary (versió v2, la més utilitzada)
const cloudinary = require('cloudinary').v2;

// Carrega les variables d'entorn del fitxer .env
require('dotenv').config();

// Configura Cloudinary amb les credencials del .env
// Aquestes variables SÓN OBLIGATÒRIES per poder pujar imatges al núvol
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,   // Nom del teu compte Cloudinary
  api_key: process.env.CLOUDINARY_API_KEY,         // API key pública
  api_secret: process.env.CLOUDINARY_API_SECRET    // API secret privada
});

// Exporta la configuració perquè la pugui utilitzar qualsevol fitxer del projecte
module.exports = cloudinary;

