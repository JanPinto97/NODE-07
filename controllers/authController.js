const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// POST /api/auth/register
exports.register = (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email: (email || '').toLowerCase() })
    .then((existing) => {
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'Aquest email ja està registrat'
        });
      }

      const user = new User({
        name: name || '',
        email: (email || '').toLowerCase(),
        password,
        role: 'user'
      });

      return user.save().then((saved) => {
        const token = generateToken(saved);

        res.status(201).json({
          success: true,
          message: 'Usuari registrat correctament',
          data: {
            token,
            user: saved.toJSON()
          }
        });
      });
    })
    .catch((err) => {
      // Possible duplicate key (email únic)
      if (err && err.code === 11000) {
        return res.status(400).json({
          success: false,
          error: 'Aquest email ja està registrat'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Error intern del servidor'
      });
    });
};

// POST /api/auth/login
exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: (email || '').toLowerCase() })
    .select('+password')
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Credencials incorrectes'
        });
      }

      return user.comparePassword(password).then((isMatch) => {
        if (!isMatch) {
          return res.status(401).json({
            success: false,
            error: 'Credencials incorrectes'
          });
        }

        const token = generateToken(user);

        res.json({
          success: true,
          message: 'Sessió iniciada correctament',
          data: {
            token,
            user: user.toJSON()
          }
        });
      });
    })
    .catch(() => {
      res.status(500).json({
        success: false,
        error: 'Error intern del servidor'
      });
    });
};

// GET /api/auth/me
exports.getMe = (req, res) => {
  res.json({
    success: true,
    data: req.user // ve del middleware auth
  });
};

// PUT /api/auth/profile  (protegit)
exports.updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, email } = req.body || {};

  // Només permetem actualitzar name i email
  const updateData = {};
  if (typeof name === 'string') updateData.name = name;
  if (typeof email === 'string') updateData.email = email.toLowerCase();

  // Si no ve res per actualitzar
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No hi ha dades per actualitzar'
    });
  }

  // Si vol canviar email: comprovar que no estigui en ús per un altre usuari
  const emailCheckPromise = updateData.email
    ? User.findOne({ email: updateData.email, _id: { $ne: userId } })
    : Promise.resolve(null);

  emailCheckPromise
    .then((existing) => {
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'Aquest email ja està en ús'
        });
      }

      return User.findByIdAndUpdate(userId, updateData, { new: true })
        .select('-password')
        .then((updated) => {
          if (!updated) {
            return res.status(404).json({
              success: false,
              error: 'Usuari no trobat'
            });
          }

          res.json({
            success: true,
            message: 'Perfil actualitzat correctament',
            data: updated
          });
        });
    })
    .catch((error) => {
      console.error('updateProfile error:', error);
      // Duplicat per index unique (per seguretat)
      if (error && error.code === 11000) {
        return res.status(400).json({
          success: false,
          error: 'Aquest email ja està en ús'
        });
      }
      res.status(500).json({
        success: false,
        error: 'Error intern del servidor'
      });
    });
};

// PUT /api/auth/change-password (protegit)
exports.changePassword = (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body || {};

  // Per canviar password, necessitem recuperar password (select: false al model)
  User.findById(userId).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuari no trobat'
        });
      }

      return user.comparePassword(currentPassword).then((isMatch) => {
        if (!isMatch) {
          return res.status(401).json({
            success: false,
            error: 'La contrasenya actual és incorrecta'
          });
        }

        // Assignem la nova password: el pre-save hook del model la xifrarà
        user.password = newPassword;

        return user.save().then(() => {
          res.json({
            success: true,
            message: 'Contrasenya actualitzada correctament'
          });
        });
      });
    })
    .catch((error) => {
      console.error('changePassword error:', error);
      res.status(500).json({
        success: false,
        error: 'Error intern del servidor'
      });
    });
};
