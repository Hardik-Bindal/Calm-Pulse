require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// const connectDB = require('./db/index');
const chatRoutes = require('./routes/chat.routes');
const gamesRouter = require('./routes/games.routes');
const stressRouter = require('./routes/stress.routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Connect to MongoDB (disabled for local demo; only AI endpoints are required)
// connectDB();

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/games', gamesRouter);
app.use('/api/stress', stressRouter);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Calm Pulse backend is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});