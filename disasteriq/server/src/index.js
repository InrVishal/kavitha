const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');

const authRoutes = require('./routes/auth');
const incidentRoutes = require('./routes/incidents');
const helpRequestRoutes = require('./routes/helpRequests');
const volunteerRoutes = require('./routes/volunteers');
const shelterRoutes = require('./routes/shelters');
const resourceRoutes = require('./routes/resources');
const damageRoutes = require('./routes/damage');
const familyRoutes = require('./routes/family');
const alertRoutes = require('./routes/alerts');
const weatherRoutes = require('./routes/weather');
const aiRoutes = require('./routes/ai');
const adminRoutes = require('./routes/admin');
const { setupSockets } = require('./sockets');

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? ['http://localhost:3000']
      : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  },
});

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('short'));
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['http://localhost:3000']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Make prisma and io available to routes
app.set('prisma', prisma);
app.set('io', io);

// Routes
const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.use('/auth', authRoutes);
apiRouter.use('/incidents', incidentRoutes);
apiRouter.use('/help-requests', helpRequestRoutes);
apiRouter.use('/volunteers', volunteerRoutes);
apiRouter.use('/shelters', shelterRoutes);
apiRouter.use('/resources', resourceRoutes);
apiRouter.use('/damage-reports', damageRoutes);
apiRouter.use('/family', familyRoutes);
apiRouter.use('/alerts', alertRoutes);
apiRouter.use('/weather', weatherRoutes);
apiRouter.use('/ai-risk', aiRoutes);
apiRouter.use('/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'operational', timestamp: new Date().toISOString() });
});

// Setup Socket.io
setupSockets(io, prisma);

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 DisasterIQ server running on port ${PORT}`);
  console.log(`📡 Socket.io ready`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
