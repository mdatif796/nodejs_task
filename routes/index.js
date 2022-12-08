const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeControllers');

router.post('/api/sign-up', homeController.signUp);
router.get('/api/log-in', homeController.logIn);
router.post('/api/password-reset-link', homeController.passwordResetLink);
router.post('/api/password-reset/:userId/:token', homeController.passwordReset);


module.exports = router;