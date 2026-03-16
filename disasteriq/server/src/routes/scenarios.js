const express = require('express');
const router = express.Router();

router.get('/flood-scenario', (req, res) => {
  res.json({
    title: 'Scenario: Flood Emergency Alpha-9',
    steps: [
      {
        id: 1,
        title: 'Satellite Detection',
        description: 'Multispectral sensors detect abnormal hydration surge in Sector 7.',
        timestamp: 'T-minus 45m',
        status: 'Triggered'
      },
      {
        id: 2,
        title: 'IoT Sensor Breach',
        description: 'Rising water level confirmed by ground-nodes at Sector 7 Flood-Wall.',
        timestamp: 'T-minus 30m',
        status: 'Critical'
      },
      {
        id: 3,
        title: 'Crowd Intel Pulse',
        description: 'Active distress signals: "People trapped in building 42B - structural integrity failing".',
        timestamp: 'T-minus 12m',
        status: 'Priority'
      },
      {
        id: 4,
        title: 'AI Tactical Response',
        description: 'Neural engine generated risk heatmap and optimized evacuation vectors.',
        timestamp: 'Now',
        status: 'Active'
      }
    ],
    outputs: {
      riskHeatmap: 'Sector 7 High Intensity',
      rescuePriority: 'Zones Alpha, Delta-4',
      primaryEvac: 'Hospital → North Haven'
    }
  });
});

module.exports = router;
