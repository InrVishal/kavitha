const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding DisasterIQ database...');

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 12);
  const userPassword = await bcrypt.hash('user123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@disasteriq.gov' },
    update: {},
    create: {
      email: 'admin@disasteriq.gov',
      password: adminPassword,
      name: 'Commander Sarah Chen',
      role: 'ADMIN',
      region: 'metro',
      phone: '+1-555-0100',
    },
  });

  const authority = await prisma.user.upsert({
    where: { email: 'authority@disasteriq.gov' },
    update: {},
    create: {
      email: 'authority@disasteriq.gov',
      password: userPassword,
      name: 'Director James Wu',
      role: 'AUTHORITY',
      region: 'metro',
      phone: '+1-555-0101',
    },
  });

  const volunteer1 = await prisma.user.upsert({
    where: { email: 'volunteer@disasteriq.org' },
    update: {},
    create: {
      email: 'volunteer@disasteriq.org',
      password: userPassword,
      name: 'Alex Rivera',
      role: 'VOLUNTEER',
      region: 'metro',
      phone: '+1-555-0102',
    },
  });

  const citizen = await prisma.user.upsert({
    where: { email: 'citizen@example.com' },
    update: {},
    create: {
      email: 'citizen@example.com',
      password: userPassword,
      name: 'Maria Santos',
      role: 'CITIZEN',
      region: 'metro',
      phone: '+1-555-0103',
    },
  });

  // Create volunteers (skills stored as JSON string for SQLite)
  await prisma.volunteer.upsert({
    where: { userId: volunteer1.id },
    update: {},
    create: {
      userId: volunteer1.id,
      skills: JSON.stringify(['First Aid', 'Search & Rescue', 'Communications']),
      status: 'AVAILABLE',
      latitude: 28.6139,
      longitude: 77.2090,
      region: 'metro',
    },
  });

  // Create incidents
  const incidents = [
    {
      title: 'Flash Flood - River District',
      description: 'Severe flooding in the River District area. Multiple roads submerged. Water level rising rapidly.',
      type: 'flood',
      severity: 'CRITICAL',
      latitude: 28.6280,
      longitude: 77.2190,
      region: 'metro',
      status: 'active',
      affected: 1250,
      rescued: 340,
      reportedBy: admin.id,
    },
    {
      title: 'Building Collapse - Sector 14',
      description: 'Partial building collapse due to structural failure. Emergency crews on scene.',
      type: 'structural',
      severity: 'HIGH',
      latitude: 28.5900,
      longitude: 77.2300,
      region: 'metro',
      status: 'active',
      affected: 85,
      rescued: 42,
      reportedBy: authority.id,
    },
    {
      title: 'Chemical Spill - Industrial Zone',
      description: 'Hazardous chemical spill at the industrial zone. Evacuation in progress.',
      type: 'hazmat',
      severity: 'HIGH',
      latitude: 28.6350,
      longitude: 77.2050,
      region: 'metro',
      status: 'active',
      affected: 300,
      rescued: 150,
      reportedBy: admin.id,
    },
    {
      title: 'Power Grid Failure - East Sector',
      description: 'Major power grid failure affecting east sector. Hospitals on backup generators.',
      type: 'infrastructure',
      severity: 'MEDIUM',
      latitude: 28.6100,
      longitude: 77.2400,
      region: 'metro',
      status: 'active',
      affected: 5000,
      rescued: 0,
      reportedBy: authority.id,
    },
  ];

  for (const incident of incidents) {
    await prisma.incident.create({ data: incident });
  }

  // Create help requests
  const helpRequests = [
    {
      type: 'medical',
      description: 'Elderly person needs medical evacuation. Diabetic, running low on insulin.',
      urgency: 'critical',
      latitude: 28.6200,
      longitude: 77.2150,
      region: 'metro',
      peopleCount: 1,
      contact: '+1-555-0201',
      landmark: 'Near Central Park Gate 3',
      status: 'PENDING',
      requestedBy: citizen.id,
    },
    {
      type: 'rescue',
      description: 'Family trapped on second floor. Water level at 4 feet and rising.',
      urgency: 'critical',
      latitude: 28.6250,
      longitude: 77.2180,
      region: 'metro',
      peopleCount: 5,
      contact: '+1-555-0202',
      landmark: 'Blue apartment building, Block C',
      status: 'PENDING',
      requestedBy: citizen.id,
    },
    {
      type: 'supplies',
      description: 'Community shelter running low on drinking water and baby formula.',
      urgency: 'high',
      latitude: 28.6150,
      longitude: 77.2250,
      region: 'metro',
      peopleCount: 120,
      contact: '+1-555-0203',
      landmark: 'Community Center, Main Road',
      status: 'ASSIGNED',
      assignedTo: volunteer1.id,
      requestedBy: citizen.id,
    },
  ];

  for (const hr of helpRequests) {
    await prisma.helpRequest.create({ data: hr });
  }

  // Create shelters (amenities stored as JSON string for SQLite)
  const shelters = [
    {
      name: 'Metro Convention Center',
      address: '100 Convention Blvd, Metro District',
      type: 'shelter',
      latitude: 28.6300,
      longitude: 77.2100,
      region: 'metro',
      capacity: 500,
      occupancy: 342,
      amenities: JSON.stringify(['Water', 'Food', 'Medical', 'Bedding', 'WiFi']),
      contact: '+1-555-0300',
      status: 'open',
    },
    {
      name: 'City General Hospital',
      address: '200 Health Ave, Central',
      type: 'hospital',
      latitude: 28.6180,
      longitude: 77.2220,
      region: 'metro',
      capacity: 200,
      occupancy: 178,
      amenities: JSON.stringify(['Emergency Care', 'Surgery', 'ICU', 'Pharmacy']),
      contact: '+1-555-0301',
      status: 'open',
    },
    {
      name: 'District Food Bank',
      address: '50 Relief Road, West Sector',
      type: 'food',
      latitude: 28.6100,
      longitude: 77.2000,
      region: 'metro',
      capacity: 1000,
      occupancy: 600,
      amenities: JSON.stringify(['Meals', 'Water', 'Baby Food', 'Special Diet']),
      contact: '+1-555-0302',
      status: 'open',
    },
    {
      name: 'South District Shelter',
      address: '75 Safe Haven Lane, South',
      type: 'shelter',
      latitude: 28.5950,
      longitude: 77.2150,
      region: 'metro',
      capacity: 300,
      occupancy: 210,
      amenities: JSON.stringify(['Water', 'Food', 'Bedding', 'Childcare']),
      contact: '+1-555-0303',
      status: 'open',
    },
  ];

  for (const shelter of shelters) {
    await prisma.shelter.create({ data: shelter });
  }

  // Create resources
  const resources = [
    {
      name: 'Drinking Water (Liters)',
      category: 'water',
      icon: '💧',
      needed: 10000,
      pledged: 3200,
      region: 'metro',
      postedBy: 'Emergency Management',
    },
    {
      name: 'Medical Kits',
      category: 'medical',
      icon: '🏥',
      needed: 500,
      pledged: 280,
      region: 'metro',
      postedBy: 'Health Department',
    },
    {
      name: 'Blankets',
      category: 'supplies',
      icon: '🛏️',
      needed: 2000,
      pledged: 450,
      region: 'metro',
      postedBy: 'Relief Coordination',
    },
    {
      name: 'Emergency Food Packs',
      category: 'food',
      icon: '🍱',
      needed: 5000,
      pledged: 1800,
      region: 'metro',
      postedBy: 'Food Relief Network',
    },
    {
      name: 'Portable Generators',
      category: 'equipment',
      icon: '⚡',
      needed: 50,
      pledged: 12,
      region: 'metro',
      postedBy: 'Infrastructure Dept',
    },
  ];

  for (const resource of resources) {
    await prisma.resource.create({ data: resource });
  }

  // Create alerts
  const alerts = [
    {
      title: 'FLASH FLOOD WARNING',
      message: 'National Weather Service has issued a Flash Flood Warning for Metro District. Seek higher ground immediately.',
      type: 'weather',
      severity: 'critical',
      region: 'metro',
      active: true,
    },
    {
      title: 'EVACUATION ORDER - River District',
      message: 'Mandatory evacuation order for River District zones A through D. Report to nearest shelter.',
      type: 'evacuation',
      severity: 'critical',
      region: 'metro',
      active: true,
    },
    {
      title: 'Road Closure Alert',
      message: 'Highway 101 between exits 14-22 closed due to flooding. Use alternate routes.',
      type: 'infrastructure',
      severity: 'warning',
      region: 'metro',
      active: true,
    },
    {
      title: 'Shelter Capacity Update',
      message: 'Metro Convention Center shelter at 68% capacity. South District Shelter accepting new arrivals.',
      type: 'shelter',
      severity: 'info',
      region: 'metro',
      active: true,
    },
    {
      title: 'Water Safety Advisory',
      message: 'Boil water advisory in effect for East Sector. Do not consume tap water without boiling.',
      type: 'health',
      severity: 'warning',
      region: 'metro',
      active: true,
    },
  ];

  for (const alert of alerts) {
    await prisma.alert.create({ data: alert });
  }

  // Create family members
  await prisma.familyMember.create({
    data: {
      userId: citizen.id,
      name: 'Carlos Santos',
      phone: '+1-555-0401',
      relation: 'spouse',
    },
  });

  await prisma.familyMember.create({
    data: {
      userId: citizen.id,
      name: 'Sofia Santos',
      phone: '+1-555-0402',
      relation: 'daughter',
    },
  });

  // Create safety statuses
  await prisma.safetyStatus.create({
    data: {
      userId: citizen.id,
      isSafe: true,
      latitude: 28.6200,
      longitude: 77.2150,
      message: 'At Metro Convention Center shelter. All safe.',
    },
  });

  console.log('✅ Seed complete!');
  console.log('📧 Admin: admin@disasteriq.gov / admin123');
  console.log('📧 Authority: authority@disasteriq.gov / user123');
  console.log('📧 Volunteer: volunteer@disasteriq.org / user123');
  console.log('📧 Citizen: citizen@example.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
