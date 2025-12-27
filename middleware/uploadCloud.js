// Importem Multer, el middleware per gestionar pujades d'arxius
const multer = require('multer');

const storage = multer.memoryStorage();

// Funció per validar que només acceptem IMATGES
function fileFilter(req, file, cb) {
  // Tipus MIME permesos
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  // Si no coincideix amb cap dels tipus permesos dona error
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Només es permeten imatges.'), false);
  }

  // Si arriba aquí, tot correcte acceptem el fitxer
  cb(null, true);
}

// Exportem la configuració final de Multer que s'utilitzarà a "uploadCloud.js"
module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});
