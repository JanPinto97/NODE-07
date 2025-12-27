const { body, validationResult } = require('express-validator');

// Helper per retornar errors en format consistent
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(e => ({
        field: e.path,
        message: e.msg
      }))
    });
  }
  next();
}

exports.updateProfileValidation = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email no vàlid')
    .normalizeEmail(),
  body('name')
    .optional()
    .isLength({ min: 2 })
    .withMessage('El nom ha de tenir mínim 2 caràcters'),
  handleValidation
];

exports.changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contrasenya actual és obligatòria'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('La nova contrasenya ha de tenir mínim 6 caràcters'),
  handleValidation
];

exports.registerValidation = [
  body('email').isEmail().withMessage('Email no vàlid').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contrasenya ha de tenir mínim 6 caràcters'),
  body('name')
    .optional()
    .isLength({ min: 2 })
    .withMessage('El nom ha de tenir mínim 2 caràcters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(e => ({
          field: e.path,
          message: e.msg
        }))
      });
    }
    next();
  }
];

exports.loginValidation = [
  body('email').isEmail().withMessage('Email no vàlid').normalizeEmail(),
  body('password').notEmpty().withMessage('La contrasenya és obligatòria'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(e => ({
          field: e.path,
          message: e.msg
        }))
      });
    }
    next();
  }
];
