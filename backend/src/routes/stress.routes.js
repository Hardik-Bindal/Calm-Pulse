const express = require('express');
const router = express.Router();
const { analyzeStress } = require('../controllers/stress.controller');

// AI-based stress analysis endpoint
router.post('/analyze', analyzeStress);

module.exports = router;

