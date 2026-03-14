const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /admin/dashboard
router.get('/dashboard', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const [
      activeIncidents,
      totalHelpRequests,
      pendingHelpRequests,
      totalVolunteers,
      availableVolunteers,
      totalResources,
      totalShelters,
      totalDamageReports,
      recentHelpRequests,
    ] = await Promise.all([
      prisma.incident.count({ where: { status: 'active' } }),
      prisma.helpRequest.count(),
      prisma.helpRequest.count({ where: { status: 'PENDING' } }),
      prisma.volunteer.count(),
      prisma.volunteer.count({ where: { status: 'AVAILABLE' } }),
      prisma.resource.count(),
      prisma.shelter.count(),
      prisma.damageReport.count(),
      prisma.helpRequest.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { user: { select: { name: true } } },
      }),
    ]);

    res.json({
      metrics: {
        activeIncidents,
        totalHelpRequests,
        pendingHelpRequests,
        totalVolunteers,
        availableVolunteers,
        totalResources,
        totalShelters,
        totalDamageReports,
      },
      recentHelpRequests,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin dashboard' });
  }
});

module.exports = router;
