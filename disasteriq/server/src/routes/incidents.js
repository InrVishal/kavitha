const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate, regionFilter } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /incidents
router.get('/', authenticate, regionFilter, async (req, res) => {
  try {
    const incidents = await prisma.incident.findMany({
      where: req.regionFilter,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    });
    res.json(incidents);
  } catch (error) {
    console.error('Get incidents error:', error);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

// POST /incidents
router.post('/', authenticate, [
  body('title').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('type').trim().notEmpty(),
  body('latitude').isFloat(),
  body('longitude').isFloat(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const incident = await prisma.incident.create({
      data: {
        ...req.body,
        reportedBy: req.user.id,
        region: req.user.region,
      },
    });

    // Emit via socket
    const io = req.app.get('io');
    if (io) {
      io.emit('incident:new', incident);
    }

    res.status(201).json(incident);
  } catch (error) {
    console.error('Create incident error:', error);
    res.status(500).json({ error: 'Failed to create incident' });
  }
});

module.exports = router;
