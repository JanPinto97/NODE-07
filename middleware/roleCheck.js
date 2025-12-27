module.exports = function roleCheck(allowedRoles = []) {
  return (req, res, next) => {
    // Aquest middleware s'ha d'usar DESPRÉS de auth, així req.user existeix
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'No autoritzat'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'No tens permisos per accedir a aquest recurs'
      });
    }

    next();
  };
};
