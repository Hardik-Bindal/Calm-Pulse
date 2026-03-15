const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const mockResponses = [
  "I hear you. Stress can feel overwhelming, but try taking 5 deep breaths right now. Inhale for 4 seconds, hold for 4, exhale for 4. You've got this! 💙",
  "It's okay to feel this way. Try the 5-4-3-2-1 grounding technique — name 5 things you see, 4 you can touch, 3 you hear. This brings you back to the present moment. 🌿",
  "You're not alone in feeling stressed. Take a short 5 minute walk, even indoors. Movement helps release tension from your body and clears your mind. 🚶",
  "Remember to be kind to yourself today. Stress is your body's signal that you care. Write down 3 things you're grateful for right now. 📝",
  "Take a moment to pause. Place your hand on your heart and take 3 slow deep breaths. You are safe, you are capable, and this feeling will pass. 💪",
  "When stress feels too much, try progressive muscle relaxation. Tense each muscle group for 5 seconds then release. Start from your toes and work your way up. 🧘",
  "Sometimes stress comes from trying to control everything. Focus only on what you can control right now — your breath, your thoughts, your next small action. 🌸",
  "You've survived every difficult day so far — that's a 100% track record! Take it one hour at a time. You don't have to solve everything today. ⭐",
  "Try the box breathing technique — inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 4 times. It calms your nervous system instantly. 📦",
  "Drink a glass of water slowly right now. Dehydration increases stress hormones. Then stretch your arms above your head and take one big deep breath. 💧"
];

const getChatResponse = async (userMessage) => {
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a calming mental wellness assistant for Calm Pulse. Help users manage stress with empathy and practical advice. Keep responses warm, helpful and under 100 words.'
        },
        {
          role: 'user',
          content: userMessage
        }
      ]
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error('Groq API error:', error.message);

    // Fallback to mock response if API fails
    console.log('Using mock response as fallback...');
    const randomIndex = Math.floor(Math.random() * mockResponses.length);
    return mockResponses[randomIndex];
  }
};

module.exports = { getChatResponse };