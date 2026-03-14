const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize, regionFilter } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /help-requests
router.get('/', authenticate, regionFilter, async (req, res) => {
  try {
    const requests = await prisma.helpRequest.findMany({
      where: req.regionFilter,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, phone: true } } },
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch help requests' });
  }
});

// POST /help-requests
router.post('/', authenticate, [
  body('type').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('latitude').isFloat(),
  body('longitude').isFloat(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const helpRequest = await prisma.helpRequest.create({
      data: {
        ...req.body,
        requestedBy: req.user.id,
        region: req.user.region,
      },
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('helpRequest:new', helpRequest);
    }

    res.status(201).json(helpRequest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create help request' });
  }
});

// PATCH /help-requests/:id/assign
router.patch('/:id/assign', authenticate, authorize('ADMIN', 'AUTHORITY'), async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const helpRequest = await prisma.helpRequest.update({
      where: { id: req.params.id },
      data: { assignedTo, status: 'ASSIGNED' },
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('helpRequest:assigned', helpRequest);
    }

    res.json(helpRequest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign help request' });
  }
});

module.exports = router;
