const express = require('express');
const router = express.Router();
const controller = require('./folder.controller');
const { protect, verifyPin } = require('../../middlewares/auth.middleware');

router.use(protect);

router.post('/', controller.createFolder);
router.get('/', controller.getFolders);
router.get('/secret', verifyPin, controller.getSecretFolders);
router.put('/:id', controller.updateFolder);
router.delete('/:id', controller.deleteFolder);

module.exports = router;