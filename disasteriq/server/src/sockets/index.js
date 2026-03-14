function setupSockets(io, prisma) {
  io.on('connection', (socket) => {
    console.log(`📡 Client connected: ${socket.id}`);

    // Join region room
    socket.on('join:region', (region) => {
      socket.join(`region:${region}`);
      console.log(`🌍 ${socket.id} joined region: ${region}`);
    });

    // Handle rescue count update
    socket.on('incident:rescue', async (data) => {
      try {
        const { incidentId, count } = data;
        const incident = await prisma.incident.update({
          where: { id: incidentId },
          data: { rescued: { increment: count || 1 } },
        });
        io.emit('incident:updated', incident);
      } catch (error) {
        console.error('Rescue update error:', error);
      }
    });

    // Handle volunteer status change
    socket.on('volunteer:status', async (data) => {
      try {
        const { volunteerId, status } = data;
        const volunteer = await prisma.volunteer.update({
          where: { id: volunteerId },
          data: { status },
        });
        io.emit('volunteer:updated', volunteer);
      } catch (error) {
        console.error('Volunteer status error:', error);
      }
    });

    // Alert broadcast
    socket.on('alert:broadcast', (alert) => {
      io.emit('alert:new', alert);
    });

    socket.on('disconnect', () => {
      console.log(`📡 Client disconnected: ${socket.id}`);
    });
  });
}

module.exports = { setupSockets };
