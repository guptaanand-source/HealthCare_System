const express = require('express');
const router  = express.Router();
const { sendMessage } = require('../controllers/chatbotController');
const protect = require('../middleware/protect');

router.post('/message', protect, sendMessage);

module.exports = router;
