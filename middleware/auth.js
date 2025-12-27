const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'No autoritzat. Token no proporcionat'
    });
  }

  const token = header.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || !decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        error: 'Token invàlid o expirat'
      });
    }

    User.findById(decoded.userId)
      .select('-password')
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            success: false,
            error: 'Usuari no trobat'
          });
        }

        req.user = user; // 👈 aquí queda disponible a controladors/rutes
        next();
      })
      .catch(() => {
        res.status(500).json({
          success: false,
          error: 'Error intern del servidor'
        });
      });
  });
};
