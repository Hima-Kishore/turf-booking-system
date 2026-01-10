import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a user
  const user = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      phone: '+1234567890',
    },
  });

  console.log('✅ Created user:', user.name);

  // Create a turf
  const turf = await prisma.turf.upsert({
    where: { id: 'turf-1' },
    update: {},
    create: {
      id: 'turf-1',
      name: 'City Sports Arena',
      address: '123 Main Street, Downtown',
      description: 'Premium sports facility with multiple courts',
    },
  });

  console.log('✅ Created turf:', turf.name);

  // Create courts
  const cricketCourt = await prisma.court.upsert({
    where: { id: 'court-cricket-1' },
    update: {},
    create: {
      id: 'court-cricket-1',
      turfId: turf.id,
      name: 'Cricket Court 1',
      sportType: 'cricket',
      pricePerHour: 1500,
    },
  });

  const footballCourt = await prisma.court.upsert({
    where: { id: 'court-football-1' },
    update: {},
    create: {
      id: 'court-football-1',
      turfId: turf.id,
      name: 'Football Court 1',
      sportType: 'football',
      pricePerHour: 2000,
    },
  });

  console.log('✅ Created courts:', cricketCourt.name, footballCourt.name);

  // Create slots for tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const timeSlots = [
    { start: '06:00', end: '07:00' },
    { start: '07:00', end: '08:00' },
    { start: '08:00', end: '09:00' },
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' },
    { start: '12:00', end: '13:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
    { start: '16:00', end: '17:00' },
    { start: '17:00', end: '18:00' },
    { start: '18:00', end: '19:00' },
    { start: '19:00', end: '20:00' },
    { start: '20:00', end: '21:00' },
  ];

  for (const court of [cricketCourt, footballCourt]) {
    for (const slot of timeSlots) {
      await prisma.slot.upsert({
        where: {
          courtId_date_startTime: {
            courtId: court.id,
            date: tomorrow,
            startTime: slot.start,
          },
        },
        update: {},
        create: {
          courtId: court.id,
          date: tomorrow,
          startTime: slot.start,
          endTime: slot.end,
          isBooked: false,
        },
      });
    }
  }

  console.log('✅ Created slots for tomorrow');
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });