require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./db/index');
const chatRoutes = require('./routes/chat.routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/chat', chatRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'StressGuard AI Backend is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});