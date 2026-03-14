const express = require('express');
const { body } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate, regionFilter } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /shelters
router.get('/', authenticate, regionFilter, async (req, res) => {
  try {
    const { type } = req.query;
    const where = { ...req.regionFilter };
    if (type && type !== 'all') {
      where.type = type;
    }

    const shelters = await prisma.shelter.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    const parsed = shelters.map(s => ({
      ...s,
      amenities: (() => { try { return JSON.parse(s.amenities); } catch { return []; } })(),
    }));
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shelters' });
  }
});

// POST /shelters
router.post('/', authenticate, [
  body('name').trim().notEmpty(),
  body('address').trim().notEmpty(),
  body('latitude').isFloat(),
  body('longitude').isFloat(),
], async (req, res) => {
  try {
    const shelter = await prisma.shelter.create({
      data: {
        ...req.body,
        region: req.user.region,
      },
    });
    res.status(201).json(shelter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create shelter' });
  }
});

module.exports = router;
