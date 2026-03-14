const express = require('express');
const { body } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate, regionFilter } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /volunteers
router.get('/', authenticate, regionFilter, async (req, res) => {
  try {
    const volunteers = await prisma.volunteer.findMany({
      where: req.regionFilter,
      include: { user: { select: { name: true, email: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    });
    // Parse JSON skills string back to array
    const parsed = volunteers.map(v => ({
      ...v,
      skills: (() => { try { return JSON.parse(v.skills); } catch { return []; } })(),
    }));
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch volunteers' });
  }
});

// POST /volunteers
router.post('/', authenticate, [
  body('skills').isArray(),
  body('region').trim().notEmpty(),
], async (req, res) => {
  try {
    const existing = await prisma.volunteer.findUnique({ where: { userId: req.user.id } });
    if (existing) {
      return res.status(409).json({ error: 'Already registered as volunteer' });
    }

    const volunteer = await prisma.volunteer.create({
      data: {
        userId: req.user.id,
        skills: JSON.stringify(req.body.skills || []),
        region: req.body.region || req.user.region,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      },
    });

    // Update user role
    await prisma.user.update({
      where: { id: req.user.id },
      data: { role: 'VOLUNTEER' },
    });

    res.status(201).json(volunteer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register volunteer' });
  }
});

module.exports = router;
