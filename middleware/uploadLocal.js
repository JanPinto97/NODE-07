// Multer és el middleware que utilitzem per gestionar pujades de fitxers (multipart/form-data)
const multer = require('multer');

// Path serveix per manipular rutes de fitxers de forma segura
const path = require('path');

// FileSystem per comprovar o crear carpetes
const fs = require('fs');

// Ruta absoluta de la carpeta on guardarem les imatges locals
const uploadDir = path.join(__dirname, '../uploads');

// Comprovem si la carpeta "uploads" existeix. Si no, la creem.
// Això evita errors quan Multer intenta escriure un fitxer en una carpeta inexistent.
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuració d'emmagatzematge local per Multer
// Aquí definim on es guardaran les imatges i quin nom tindran.
const storage = multer.diskStorage({

  // Indica en quina carpeta s'ha de guardar el fitxer
  destination: (req, file, cb) => cb(null, uploadDir),

  // Definim un nom únic per cada fitxer:
  // Date.now() evita col·lisions amb fitxers anteriors.
  // També substituïm espais per "_" per evitar problemes en URLs.
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  }
});

// Funció de filtre per acceptar NOMÉS imatges
function fileFilter(req, file, cb) {
  // Llista de tipus MIME acceptats
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  // Si el fitxer no és una imatge → error
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Només es permeten imatges.'), false);
  }

  // Si és una imatge → acceptem
  cb(null, true);
}

// Exportem la configuració final de Multer
// - storage: on es guarda i com s’anomena el fitxer
// - fileFilter: limita els tipus acceptats
// - limits: limita la mida màxima (5MB en aquest cas)
module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB màxim per fitxer
});
