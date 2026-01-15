const express = require('express');
const router = express.Router();
const controller = require('./storage.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.use(protect);

router.get('/stats', controller.getStorageStats);
router.get('/calendar', controller.getCalendarData);

module.exports = router;