const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const authCtrl = require('../controllers/authController');

const {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation
} = require('../middleware/validators/authValidators');

router.post('/register', registerValidation, authCtrl.register);
router.post('/login', loginValidation, authCtrl.login);

router.get('/me', auth, authCtrl.getMe);
router.put('/profile', auth, updateProfileValidation, authCtrl.updateProfile);
router.put('/change-password', auth, changePasswordValidation, authCtrl.changePassword);

module.exports = router;
