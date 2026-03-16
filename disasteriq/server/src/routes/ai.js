const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const { generateTacticalAdvice } = require('../services/geminiService');

// GET /ai-risk/:region - AI risk predictions with Gemini insights
router.get('/:region', authenticate, async (req, res) => {
  try {
    const { region } = req.params;

    const prompt = `Act as a senior disaster mitigation AI. For the region "${region}", provide 3 brief bullet points (max 10 words each) predicting the most likely disaster scenario based on current satellite telemetry showing increased precipitation and structural stress. Output only the bullet points.`;
    
    const predictionText = await generateTacticalAdvice(prompt);

    // Mock AI risk prediction data with some dynamic text
    const riskData = {
      region,
      generatedAt: new Date().toISOString(),
      aiExecutiveSummary: predictionText,
      risks: [
        {
          type: 'flood',
          label: 'Flood Risk',
          score: 87,
          trend: 'increasing',
          prediction: 'High probability of flash flooding. Gemini Matrix suggests immediate reinforcement of sector barriers.',
          timeline: [
            { hour: 0, risk: 72 },
            { hour: 12, risk: 80 },
            { hour: 24, risk: 87 },
            { hour: 36, risk: 91 },
            { hour: 48, risk: 85 },
            { hour: 60, risk: 78 },
            { hour: 72, risk: 65 },
          ],
        },
        {
          type: 'fire',
          label: 'Fire Risk',
          score: 23,
          trend: 'stable',
          prediction: 'Low fire risk. Humidity levels sufficient to prevent wildfire spread.',
          timeline: [
            { hour: 0, risk: 20 },
            { hour: 12, risk: 22 },
            { hour: 24, risk: 23 },
            { hour: 36, risk: 25 },
            { hour: 48, risk: 24 },
            { hour: 60, risk: 22 },
            { hour: 72, risk: 20 },
          ],
        },
        {
          type: 'earthquake',
          label: 'Seismic Activity',
          score: 45,
          trend: 'stable',
          prediction: 'Moderate seismic activity detected. Minor tremors possible.',
          timeline: [
            { hour: 0, risk: 42 },
            { hour: 12, risk: 44 },
            { hour: 24, risk: 45 },
            { hour: 36, risk: 43 },
            { hour: 48, risk: 44 },
            { hour: 60, risk: 42 },
            { hour: 72, risk: 41 },
          ],
        },
        {
          type: 'storm',
          label: 'Storm Risk',
          score: 68,
          trend: 'increasing',
          prediction: 'Tropical depression forming. May intensify to category 1 storm within 48 hours.',
          timeline: [
            { hour: 0, risk: 55 },
            { hour: 12, risk: 60 },
            { hour: 24, risk: 68 },
            { hour: 36, risk: 75 },
            { hour: 48, risk: 72 },
            { hour: 60, risk: 65 },
            { hour: 72, risk: 58 },
          ],
        },
      ],
      satellite: {
        lastUpdate: new Date(Date.now() - 1800000).toISOString(),
        cloudCover: 78,
        surfaceTemp: 31,
        precipitation: 42,
        windSpeed: 45,
      },
    };

    res.json(riskData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate risk prediction' });
  }
});

// POST /ai/chat - Simple AI assistant chat
router.post('/chat', authenticate, async (req, res) => {
  try {
    const { message, context } = req.body;
    
    const prompt = `You are the DisasterIQ AI Assistant. A user is asking for help or information.
    Context: ${context || 'General emergency response'}
    User Message: ${message}
    Provide a helpful, tactical, and brief (max 50 words) response. Avoid generic statements; be specific to emergency preparedness or response.`;

    const response = await generateTacticalAdvice(prompt);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

module.exports = router;
