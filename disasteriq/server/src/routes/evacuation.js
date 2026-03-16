const express = require('express');
const router = express.Router();
const { generateTacticalAdvice } = require('../services/geminiService');

// Mock evacuation route generation with Gemini reasoning
router.post('/generate-route', async (req, res) => {
  const { start, end, avoidZones, state, colony } = req.body;
  
  const prompt = `You are a disaster response AI. Current situation: Potential flood emergency in ${colony || 'Sector 4'}, ${state || 'local region'}.
  We are generating an evacuation route from ${start} to ${end}, avoiding ${avoidZones?.join(', ') || 'hazard zones'}.
  Provide a professional, tactical, 1-sentence reasoning (under 20 words) for choosing an elevated route that specifically accounts for the terrain in ${colony}.
  Format: One sentence only. No introduction.`;

  const reasoning = await generateTacticalAdvice(prompt);
  
  const startCoords = start || [28.6139, 77.2090];
  const lat = startCoords[0];
  const lng = startCoords[1];

  const routes = [
    {
      id: 'route-alpha',
      name: 'Neural Safe Vector',
      distance: '3.4 km',
      estimatedTime: '12 min',
      blockedRoadsAvoided: 2,
      path: [
        [lat, lng],
        [lat + 0.005, lng + 0.005],
        [lat + 0.012, lng + 0.015],
        [lat + 0.021, lng + 0.028]
      ],
      safetyScore: 98,
      reasoning: reasoning || `Utilizing elevated corridor Alpha to bypass active flood vectors in ${colony || 'the sector'}.`
    }
  ];

  res.json({
    status: 'OPTIMIZED',
    analysis: 'Synthesizing satellite telemetry via Gemini-1.5 Matrix...',
    routes
  });
});

module.exports = router;
