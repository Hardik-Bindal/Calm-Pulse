const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/chat.controller');

router.post('/message', sendMessage);

module.exports = router;