const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, regionFilter } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /alerts
router.get('/', authenticate, regionFilter, async (req, res) => {
  try {
    const alerts = await prisma.alert.findMany({
      where: { ...req.regionFilter, active: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

module.exports = router;
