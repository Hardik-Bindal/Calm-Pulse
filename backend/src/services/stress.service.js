const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Analyze stress level and generate structured, safe suggestions.
 * Only high-level metrics are sent here, never raw audio/video.
 */
const getStressAnalysis = async ({ facialEmotion, voicePitch, speechText, stressScore }) => {
  const systemPrompt = `
You are a compassionate stress coach for Calm Pulse.
You receive approximate indicators of a user's stress (facial emotion label, rough voice tone,
and a numeric stress score from 0 to 100).

Your job:
- Classify overall stress as "low", "medium", or "high".
- Provide 3–5 short, practical suggestions (breathing, micro-breaks, gentle movement,
  grounding, journaling, talking to someone they trust).
- Avoid diagnoses, medication, or alarming language.
- Always promote self-care and safety.

Respond ONLY as strict JSON:
{
  "stressLevel": "low" | "medium" | "high",
  "suggestions": string[],
  "explanation": string
}
`;

  const userContent = `
Facial emotion (label): ${facialEmotion || 'unknown'}
Approximate voice pitch proxy: ${voicePitch ?? 'unknown'}
Numeric stress score (0–100): ${stressScore}
User speech (may be empty): ${speechText || '(none provided)'}
`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      temperature: 0.6,
    });

    const raw = completion.choices?.[0]?.message?.content || '{}';

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : {};
    }

    const level =
      parsed.stressLevel ||
      (stressScore > 66 ? 'high' : stressScore > 33 ? 'medium' : 'low');

    const suggestions =
      Array.isArray(parsed.suggestions) && parsed.suggestions.length
        ? parsed.suggestions
        : [
            'Take 5 slow, deep breaths: inhale for 4 seconds, hold, then exhale for 4.',
            'Stand, stretch your shoulders and neck gently, and walk for 2–3 minutes if you can.',
            'Try a quick grounding exercise: name 5 things you see, 4 you can touch, 3 you hear.',
          ];

    const explanation =
      parsed.explanation ||
      'This estimate is based on your overall tone, facial emotion label, and numeric stress score. Use it as a gentle check-in, not a diagnosis.';

    return {
      stressLevel: level,
      suggestions,
      explanation,
    };
  } catch (error) {
    console.error('Groq stress analysis error:', error.message);

    // Fallback: derive a simple rule-based result
    const level = stressScore > 66 ? 'high' : stressScore > 33 ? 'medium' : 'low';
    return {
      stressLevel: level,
      suggestions: [
        'Pause for a moment and take 3 slow, deep breaths, in through your nose and out through your mouth.',
        'If possible, step away from your screen for 3–5 minutes and stretch your body.',
        'Write down what is stressing you and circle just one small thing you can do next.',
      ],
      explanation:
        'This is a fallback suggestion based on your numeric stress score alone because the AI service was temporarily unavailable.',
    };
  }
};

module.exports = { getStressAnalysis };

