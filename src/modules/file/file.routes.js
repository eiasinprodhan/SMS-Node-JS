const express = require('express');
const router = express.Router();
const controller = require('./file.controller');
const { protect, verifyPin } = require('../../middlewares/auth.middleware');
const upload = require('../../middlewares/upload.middleware');

router.use(protect);

router.post('/upload', upload.single('file'), controller.uploadFile);
router.get('/', controller.getFiles);
router.get('/secret', verifyPin, controller.getSecretFiles);
router.get('/calendar', controller.getFilesByDate);
router.get('/download/:id', controller.downloadFile);
router.patch('/:id/favorite', controller.toggleFavorite);
router.delete('/:id', controller.deleteFile);

module.exports = router;