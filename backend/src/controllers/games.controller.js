const gamesService = require('../services/games.service');

// ─── GET /api/games ───────────────────────────────────────────────────────────
/**
 * Returns all available stress-relief games with metadata.
 */
async function getGames(req, res) {
  try {
    const games = gamesService.getAllGames();
    return res.status(200).json({
      success: true,
      message: 'Games fetched successfully',
      count: games.length,
      data: games,
    });
  } catch (error) {
    console.error('[getGames] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch games',
      error: error.message,
    });
  }
}

// ─── GET /api/games/word-challenge ────────────────────────────────────────────
/**
 * Returns a random scrambled word for the Word Puzzle game.
 * The real answer is never sent to the client — verification happens server-side.
 */
async function getWordChallenge(req, res) {
  try {
    const challenge = gamesService.getWordPuzzleChallenge();
    return res.status(200).json({
      success: true,
      message: 'Word challenge ready!',
      data: challenge, // { scrambled, length }
    });
  } catch (error) {
    console.error('[getWordChallenge] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate word challenge',
      error: error.message,
    });
  }
}

// ─── POST /api/games/verify-word ─────────────────────────────────────────────
/**
 * Verifies a player's word-puzzle answer server-side.
 * Body: { scrambled: string, attempt: string }
 */
async function verifyWord(req, res) {
  try {
    const { scrambled, attempt } = req.body;

    if (!scrambled || !attempt) {
      return res.status(400).json({
        success: false,
        message: 'Both "scrambled" and "attempt" fields are required.',
      });
    }

    const result = gamesService.checkWordPuzzleAnswer(scrambled, attempt.trim());
    return res.status(200).json({
      success: true,
      data: result, // { correct: bool, answer: string|null }
    });
  } catch (error) {
    console.error('[verifyWord] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Word verification failed',
      error: error.message,
    });
  }
}

// ─── POST /api/games/score  (JWT protected) ───────────────────────────────────
/**
 * Saves a user's game score.
 * Body: { gameName: string, score: number }
 * Requires: JWT middleware sets req.user = { id, ... }
 */
async function saveScore(req, res) {
  try {
    const { gameName, score, userId } = req.body;

    // ── Input validation ──
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: '"userId" is required in the request body.',
      });
    }

    if (!gameName || score === undefined || score === null) {
      return res.status(400).json({
        success: false,
        message: '"gameName" and "score" are required fields.',
      });
    }

    if (typeof score !== 'number') {
      return res.status(400).json({
        success: false,
        message: '"score" must be a number.',
      });
    }

    const saved = await gamesService.saveScore(userId, gameName, score);

    return res.status(201).json({
      success: true,
      message: '🎉 Score saved! Great job relieving that stress!',
      data: saved,
    });
  } catch (error) {
    console.error('[saveScore] Error:', error.message);

    // Friendly error for validation failures from the service layer
    if (error.message.startsWith('Unknown game') || error.message.startsWith('Score')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to save score. Please try again.',
      error: error.message,
    });
  }
}

// ─── GET /api/games/leaderboard ───────────────────────────────────────────────
/**
 * Returns top scores.
 * Query params:
 *   game  - (optional) filter by game id  e.g. ?game=memory-card
 *   limit - (optional) number of results  e.g. ?limit=20  (max 50)
 */
async function getLeaderboard(req, res) {
  try {
    const { game, limit } = req.query;

    const leaderboard = await gamesService.getLeaderboard(game || null, limit);

    return res.status(200).json({
      success: true,
      message: 'Leaderboard fetched successfully',
      filter: game || 'all games',
      count: leaderboard.length,
      data: leaderboard,
    });
  } catch (error) {
    console.error('[getLeaderboard] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard',
      error: error.message,
    });
  }
}

// ─── GET /api/games/my-scores  (JWT protected) ────────────────────────────────
/**
 * Returns the authenticated user's personal best scores per game.
 */
async function getMyScores(req, res) {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: '"userId" is required as a query param e.g. ?userId=abc123',
      });
    }

    const scores = await gamesService.getUserBestScores(userId);

    return res.status(200).json({
      success: true,
      message: 'Your scores fetched successfully',
      data: scores,
    });
  } catch (error) {
    console.error('[getMyScores] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch your scores',
      error: error.message,
    });
  }
}

module.exports = {
  getGames,
  getWordChallenge,
  verifyWord,
  saveScore,
  getLeaderboard,
  getMyScores,
};