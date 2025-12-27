const User = require('../models/User');
const Task = require('../models/Task');

// GET /api/admin/users  (admin)
exports.getAllUsers = (req, res) => {
  User.find()
    .select('-password')
    .sort({ createdAt: -1 })
    .then((users) => {
      res.json({
        success: true,
        count: users.length,
        data: users
      });
    })
    .catch((error) => {
      console.error('getAllUsers error:', error);
      res.status(500).json({ success: false, error: 'Error intern del servidor' });
    });
};

// GET /api/admin/tasks (admin) -> retorna totes les tasques amb info del propietari
exports.getAllTasks = (req, res) => {
  Task.find()
    .populate('user', 'name email role createdAt') // només aquests camps del user
    .sort({ createdAt: -1 })
    .then((tasks) => {
      res.json({
        success: true,
        count: tasks.length,
        data: tasks
      });
    })
    .catch((error) => {
      console.error('getAllTasks admin error:', error);
      res.status(500).json({ success: false, error: 'Error intern del servidor' });
    });
};

// DELETE /api/admin/users/:id (admin) -> elimina usuari i les seves tasques
// No es pot eliminar a si mateix
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  if (req.user && req.user._id && req.user._id.toString() === id) {
    return res.status(400).json({
      success: false,
      error: 'No et pots eliminar a tu mateix'
    });
  }

  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ success: false, error: 'Usuari no trobat' });
      }

      // 1) eliminar tasques del user
      return Task.deleteMany({ user: user._id }).then(() => user.deleteOne());
    })
    .then(() => {
      res.json({
        success: true,
        message: 'Usuari i tasques eliminats correctament'
      });
    })
    .catch((error) => {
      console.error('deleteUser error:', error);
      if (error.name === 'CastError') {
        return res.status(400).json({ success: false, error: 'ID d’usuari invàlid' });
      }
      res.status(500).json({ success: false, error: 'Error intern del servidor' });
    });
};

// PUT /api/admin/users/:id/role (admin) -> canvia rol user <-> admin
// No permetre que un admin es canviï el rol a si mateix
exports.changeUserRole = (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (req.user && req.user._id && req.user._id.toString() === id) {
    return res.status(400).json({
      success: false,
      error: 'No pots canviar-te el rol a tu mateix'
    });
  }

  if (!role || !['user', 'admin'].includes(role)) {
    return res.status(400).json({
      success: false,
      error: 'Rol invàlid. Ha de ser "user" o "admin"'
    });
  }

  User.findByIdAndUpdate(id, { role }, { new: true })
    .select('-password')
    .then((user) => {
      if (!user) {
        return res.status(404).json({ success: false, error: 'Usuari no trobat' });
      }

      res.json({
        success: true,
        message: 'Rol actualitzat correctament',
        data: user
      });
    })
    .catch((error) => {
      console.error('changeUserRole error:', error);
      if (error.name === 'CastError') {
        return res.status(400).json({ success: false, error: 'ID d’usuari invàlid' });
      }
      res.status(500).json({ success: false, error: 'Error intern del servidor' });
    });
};
