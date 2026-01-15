const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('./auth.controller');

router.post('/register', controller.register);
router.post('/verify-email', controller.verifyEmail);
router.post('/login', controller.login);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), controller.googleCallback);

module.exports = router;