const { getChatResponse } = require('../services/gemini.service');
const ChatHistory = require('../models/ChatHistory');

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    console.log('Received message:', message);

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get AI response
    const response = await getChatResponse(message);
    console.log('Got AI response:', response?.substring(0, 50));

    // Save to MongoDB only if connected
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      const chat = new ChatHistory({ message, response });
      const saved = await chat.save();
      console.log('Saved to MongoDB:', saved._id);
    } else {
      console.log('MongoDB not connected, skipping chat save.');
    }

    res.status(200).json({ response });

  } catch (error) {
    console.error('Chat controller error:', error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = { sendMessage };