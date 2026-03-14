const express = require('express');
const { body } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate, regionFilter } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /damage-reports
router.get('/', authenticate, regionFilter, async (req, res) => {
  try {
    const reports = await prisma.damageReport.findMany({
      where: req.regionFilter,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch damage reports' });
  }
});

// POST /damage-reports
router.post('/', authenticate, [
  body('type').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('latitude').isFloat(),
  body('longitude').isFloat(),
], async (req, res) => {
  try {
    const report = await prisma.damageReport.create({
      data: {
        ...req.body,
        reportedBy: req.user.id,
        region: req.user.region,
      },
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create damage report' });
  }
});

module.exports = router;
