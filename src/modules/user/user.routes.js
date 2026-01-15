const express = require('express');
const router = express.Router();
const controller = require('./user.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.use(protect);

router.get('/profile', controller.getProfile);
router.put('/profile', controller.updateProfile);
router.put('/change-password', controller.changePassword);
router.put('/set-pin', controller.setSecretPin);
router.delete('/delete-account', controller.deleteAccount);

module.exports = router;