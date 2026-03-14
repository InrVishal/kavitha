const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /family - Get family members for current user
router.get('/', authenticate, async (req, res) => {
  try {
    const members = await prisma.familyMember.findMany({
      where: { userId: req.user.id },
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch family members' });
  }
});

// GET /family/safety - Get safety statuses for family
router.get('/safety', authenticate, async (req, res) => {
  try {
    // Get statuses for the user and their family members
    const members = await prisma.familyMember.findMany({
      where: { userId: req.user.id },
      select: { id: true, name: true }
    });
    
    // For now, just return all statuses for simplicity or filter by relevant users
    // In a real app, we'd only want statuses of family members
    const statuses = await prisma.safetyStatus.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch safety data' });
  }
});

// POST /family/status - Update personal safety status
router.post('/status', authenticate, async (req, res) => {
  try {
    const { isSafe, message, latitude, longitude } = req.body;
    
    const status = await prisma.safetyStatus.upsert({
      where: { userId: req.user.id },
      update: {
        isSafe,
        message,
        latitude,
        longitude,
        updatedAt: new Date(),
      },
      create: {
        userId: req.user.id,
        isSafe,
        message,
        latitude,
        longitude,
      },
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('safety:update', { userId: req.user.id, status });
    }

    res.status(201).json(status);
  } catch (error) {
    console.error('Safety update error:', error);
    res.status(500).json({ error: 'Failed to update safety status' });
  }
});

module.exports = router;
