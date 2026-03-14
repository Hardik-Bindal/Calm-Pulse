const express = require('express');
const router = express.Router();

const gamesController = require('../controllers/games.controller');

// ─────────────────────────────────────────────────────────────────────────────
//  ALL ROUTES PUBLIC  (authentication not added yet)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/games
 * List all available stress-relief games.
 */
router.get('/', gamesController.getGames);

/**
 * GET /api/games/leaderboard
 * Top scores. Optionally filter: ?game=memory-card&limit=10
 */
router.get('/leaderboard', gamesController.getLeaderboard);

/**
 * GET /api/games/word-challenge
 * Get a random scrambled word for the Word Puzzle game.
 */
router.get('/word-challenge', gamesController.getWordChallenge);

/**
 * POST /api/games/verify-word
 * Verify a Word Puzzle answer server-side.
 * Body: { scrambled: string, attempt: string }
 */
router.post('/verify-word', gamesController.verifyWord);

/**
 * POST /api/games/score
 * Save a game score.
 * Body: { gameName: string, score: number, userId: string }
 */
router.post('/score', gamesController.saveScore);

/**
 * GET /api/games/my-scores?userId=<id>
 * Get a user's personal best scores per game.
 */
router.get('/my-scores', gamesController.getMyScores);

module.exports = router;