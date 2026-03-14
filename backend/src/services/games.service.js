const mongoose = require('mongoose');

// ─── Game Score Schema ────────────────────────────────────────────────────────

const gameScoreSchema = new mongoose.Schema(
  {
    user_id: {
    type: String,
    required: true,
    },
    game_name: {
      type: String,
      required: true,
      enum: ['memory-card', 'breathing-exercise', 'word-puzzle'],
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

// Indexes for fast leaderboard queries
gameScoreSchema.index({ game_name: 1, score: -1 });
gameScoreSchema.index({ user_id: 1 });

const GameScore = mongoose.model('GameScore', gameScoreSchema);

// ─── Game Definitions ─────────────────────────────────────────────────────────

const GAMES = [
  {
    id: 'memory-card',
    name: 'Memory Card Game',
    description:
      'Flip cards and match pairs to train your focus. A great way to distract your mind from stress!',
    icon: '🃏',
    category: 'focus',
    difficulty: 'medium',
    instructions: [
      'Click a card to flip it over.',
      'Flip a second card to find its match.',
      'Match all pairs as fast as you can.',
      'Fewer moves = higher score!',
    ],
    scoring: {
      base: 1000,
      timePenaltyPerSecond: 5,
      mismatchPenalty: 10,
    },
  },
  {
    id: 'breathing-exercise',
    name: 'Breathing Exercise',
    description:
      'Follow the animated guide to breathe in, hold, and breathe out. Scientifically proven to reduce cortisol levels.',
    icon: '🫧',
    category: 'relaxation',
    difficulty: 'easy',
    instructions: [
      'Watch the circle expand — breathe IN for 4 seconds.',
      'Hold your breath for 4 seconds.',
      'Watch the circle shrink — breathe OUT for 4 seconds.',
      'Complete as many cycles as you can!',
    ],
    scoring: {
      pointsPerCycle: 100,
      bonusAt5Cycles: 200,
      bonusAt10Cycles: 500,
    },
  },
  {
    id: 'word-puzzle',
    name: 'Word Puzzle',
    description:
      'Unscramble calming words against the clock. Keeps your brain sharp while melting away stress.',
    icon: '🔤',
    category: 'cognitive',
    difficulty: 'hard',
    instructions: [
      'A scrambled word will appear on screen.',
      'Type the correct word before time runs out.',
      'Faster answers earn bonus points.',
      'Streak bonuses multiply your score!',
    ],
    scoring: {
      pointsPerWord: 150,
      timeBonusMax: 50,
      streakMultiplier: 0.1,
    },
  },
];

// ─── Calm Word Bank for Word Puzzle ──────────────────────────────────────────

const WORD_BANK = [
  'calm', 'peace', 'relax', 'breathe', 'serene', 'gentle', 'tranquil',
  'mindful', 'balance', 'restore', 'refresh', 'unwind', 'soothe', 'ease',
  'quiet', 'still', 'harmony', 'comfort', 'healing', 'wellness',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scrambleWord(word) {
  const arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const scrambled = arr.join('');
  return scrambled === word ? scrambleWord(word) : scrambled;
}

function validateScore(gameName, score) {
  const game = GAMES.find((g) => g.id === gameName);
  if (!game) return { valid: false, message: `Unknown game: ${gameName}` };

  if (typeof score !== 'number' || score < 0 || !Number.isFinite(score)) {
    return { valid: false, message: 'Score must be a non-negative number.' };
  }

  const MAX_SCORES = {
    'memory-card': 10000,
    'breathing-exercise': 15000,
    'word-puzzle': 20000,
  };
  if (score > MAX_SCORES[gameName]) {
    return { valid: false, message: `Score exceeds maximum allowed for ${game.name}.` };
  }

  return { valid: true, score: Math.round(score) };
}

// ─── Service Functions ────────────────────────────────────────────────────────

function getAllGames() {
  return GAMES;
}

function getWordPuzzleChallenge() {
  const word = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
  return { scrambled: scrambleWord(word), length: word.length };
}

function checkWordPuzzleAnswer(scrambled, attempt) {
  const match = WORD_BANK.find(
    (w) =>
      w.toLowerCase() === attempt.toLowerCase() &&
      w.split('').sort().join('') === scrambled.split('').sort().join(''),
  );
  return { correct: !!match, answer: match || null };
}

async function saveScore(userId, gameName, score) {
  const validation = validateScore(gameName, score);
  if (!validation.valid) throw new Error(validation.message);

  const newScore = await GameScore.create({
    user_id: userId,
    game_name: gameName,
    score: validation.score,
  });

  return newScore;
}

async function getLeaderboard(gameName = null, limit = 10) {
  const safeLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 50);
  const filter = gameName ? { game_name: gameName } : {};

  const results = await GameScore.find(filter)
    .sort({ score: -1, createdAt: 1 })
    .limit(safeLimit)
    .select('user_id game_name score createdAt')
    .lean();

  return results;
}

async function getUserBestScores(userId) {
  const results = await GameScore.aggregate([
    { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$game_name',
        best_score: { $max: '$score' },
        total_plays: { $sum: 1 },
        last_played: { $max: '$createdAt' },
      },
    },
    { $sort: { best_score: -1 } },
    {
      $project: {
        _id: 0,
        game_name: '$_id',
        best_score: 1,
        total_plays: 1,
        last_played: 1,
      },
    },
  ]);

  return results;
}

module.exports = {
  GameScore,
  getAllGames,
  getWordPuzzleChallenge,
  checkWordPuzzleAnswer,
  saveScore,
  getLeaderboard,
  getUserBestScores,
};