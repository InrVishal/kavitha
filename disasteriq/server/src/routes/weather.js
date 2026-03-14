const express = require('express');
const axios = require('axios');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /weather/:lat/:lon
router.get('/:lat/:lon', authenticate, async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey || apiKey === 'your_openweathermap_api_key') {
      // Return mock weather data if no API key
      return res.json({
        temp: 28,
        humidity: 78,
        wind: 15,
        description: 'Scattered thunderstorms',
        icon: '11d',
        feels_like: 32,
        pressure: 1008,
        visibility: 8000,
        alerts: [
          {
            event: 'Flood Warning',
            description: 'Flash flood warning in effect until 6:00 PM',
          },
        ],
      });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    const data = response.data;
    res.json({
      temp: Math.round(data.main.temp),
      humidity: data.main.humidity,
      wind: Math.round(data.wind.speed * 3.6),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      feels_like: Math.round(data.main.feels_like),
      pressure: data.main.pressure,
      visibility: data.visibility,
    });
  } catch (error) {
    console.error('Weather API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

module.exports = router;
