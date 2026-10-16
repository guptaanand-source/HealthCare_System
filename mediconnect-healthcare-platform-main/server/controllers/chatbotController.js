const { matchIntent } = require('../services/chatbotService');

// POST /api/chatbot/message
const sendMessage = async (req, res, next) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Message cannot be empty' });
  }

  const { intentId, response } = matchIntent(message.trim());

  res.json({
    success: true,
    message: {
      role: 'bot',
      text: response,
      intentId,
      timestamp: new Date().toISOString(),
    },
  });
};

module.exports = { sendMessage };
