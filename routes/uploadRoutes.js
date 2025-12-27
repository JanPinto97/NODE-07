// Importem Express per crear un router independent
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');



// Importem els dos middlewares de Multer:
const uploadLocal = require('../middleware/uploadLocal');
const uploadCloud = require('../middleware/uploadCloud');

// Importem el controlador que conté la lògica final de pujada d'imatges
const uploadCtrl = require('../controllers/uploadController');

router.use(auth);

// Ruta per PUJAR IMATGES LOCALMENT
router.post('/local', uploadLocal.single('image'), uploadCtrl.uploadLocal);

// Ruta per PUJAR IMATGES A CLOUDINARY
router.post('/cloud', uploadCloud.single('image'), uploadCtrl.uploadCloud);

// Exportem aquest router perquè el server.js el pugui muntar a /api/upload
module.exports = router;
