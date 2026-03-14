const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, regionFilter } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /resources
router.get('/', authenticate, regionFilter, async (req, res) => {
  try {
    const resources = await prisma.resource.findMany({
      where: req.regionFilter,
      include: { pledges: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// POST /resources/:id/pledge
router.post('/:id/pledge', authenticate, async (req, res) => {
  try {
    const { quantity } = req.body;
    const resource = await prisma.resource.findUnique({ where: { id: req.params.id } });
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const pledge = await prisma.resourcePledge.create({
      data: {
        resourceId: req.params.id,
        userId: req.user.id,
        quantity: quantity || 1,
      },
    });

    // Update pledged count
    await prisma.resource.update({
      where: { id: req.params.id },
      data: { pledged: { increment: quantity || 1 } },
    });

    res.status(201).json(pledge);
  } catch (error) {
    res.status(500).json({ error: 'Failed to pledge resource' });
  }
});

module.exports = router;
