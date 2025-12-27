const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const adminCtrl = require('../controllers/adminController');

// Totes les rutes d'admin requereixen auth + rol admin
router.use(auth);
router.use(roleCheck(['admin']));

router.get('/users', adminCtrl.getAllUsers);
router.get('/tasks', adminCtrl.getAllTasks);
router.delete('/users/:id', adminCtrl.deleteUser);
router.put('/users/:id/role', adminCtrl.changeUserRole);

module.exports = router;
