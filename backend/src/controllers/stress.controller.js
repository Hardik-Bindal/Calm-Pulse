const { getStressAnalysis } = require('../services/stress.service');

/**
 * POST /api/stress/analyze
 * Body: { facialEmotion, voicePitch, speechText, stressScore }
 *
 * No raw audio or video is ever stored or processed here – only aggregated metrics.
 */
const analyzeStress = async (req, res) => {
  try {
    const { facialEmotion, voicePitch, speechText, stressScore } = req.body || {};

    if (typeof stressScore !== 'number') {
      return res.status(400).json({ error: 'stressScore (number 0–100) is required' });
    }

    const result = await getStressAnalysis({
      facialEmotion,
      voicePitch,
      speechText,
      stressScore,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Stress controller error:', error.message);
    return res.status(500).json({ error: 'Failed to analyze stress' });
  }
};

module.exports = { analyzeStress };

