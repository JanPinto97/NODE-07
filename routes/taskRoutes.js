const express = require('express');
const router = express.Router();
const taskCtrl = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.use(auth);

// 📊 Estadístiques (ABANS del :id)
router.get('/stats', taskCtrl.getTaskStats);

// ➕ Crear una nova tasca
router.post('/', taskCtrl.createTask);

// 🔍 Obtenir totes les tasques
router.get('/', taskCtrl.getAllTasks);

// 🔎 Obtenir una tasca específica pel seu ID
router.get('/:id', taskCtrl.getTaskById);

// ✏️ Actualitzar una tasca pel seu ID
router.put('/:id', taskCtrl.updateTask);

// 🖼️ Actualitzar només la imatge d'una tasca
router.put('/:id/image', taskCtrl.updateTaskImage);

// 🔁 Reset imatge a per defecte
router.put('/:id/image/reset', taskCtrl.resetTaskImageToDefault);

// 🗑️ Eliminar una tasca pel seu ID
router.delete('/:id', taskCtrl.deleteTask);

module.exports = router;


