import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to get date string in YYYY-MM-DD format
function getDateString(daysOffset: number = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
}

// Helper to convert date string to Date object for Prisma
function toDateOnly(dateString: string): Date {
  return new Date(dateString + 'T00:00:00.000Z'); // Force UTC midnight
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.court.deleteMany();
  await prisma.turf.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create a user
  const user = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      phone: '+1234567890',
    },
  });

  console.log('✅ Created user:', user.name);

  // Create a turf
  const turf = await prisma.turf.create({
    data: {
      name: 'City Sports Arena',
      address: '123 Main Street, Downtown',
      description: 'Premium sports facility with multiple courts',
    },
  });

  console.log('✅ Created turf:', turf.name);

  // Create courts
  const cricketCourt = await prisma.court.create({
    data: {
      turfId: turf.id,
      name: 'Cricket Court 1',
      sportType: 'cricket',
      pricePerHour: 1500,
    },
  });

  const footballCourt = await prisma.court.create({
    data: {
      turfId: turf.id,
      name: 'Football Court 1',
      sportType: 'football',
      pricePerHour: 2000,
    },
  });

  const badmintonCourt = await prisma.court.create({
    data: {
      turfId: turf.id,
      name: 'Badminton Court 1',
      sportType: 'badminton',
      pricePerHour: 800,
    },
  });

  console.log('✅ Created courts');
  console.log('   Cricket Court ID:', cricketCourt.id);
  console.log('   Football Court ID:', footballCourt.id);
  console.log('   Badminton Court ID:', badmintonCourt.id);

  // Get date strings for today and next 6 days
  const dateStrings = Array.from({ length: 7 }, (_, i) => getDateString(i));

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

  let slotCount = 0;
  for (const court of [cricketCourt, footballCourt, badmintonCourt]) {
    for (const dateString of dateStrings) {
      for (const slot of timeSlots) {
        await prisma.slot.create({
          data: {
            courtId: court.id,
            date: toDateOnly(dateString),
            startTime: slot.start,
            endTime: slot.end,
            isBooked: false,
          },
        });
        slotCount++;
      }
    }
  }

  console.log(`✅ Created ${slotCount} slots for 7 days`);
  console.log(`   From: ${dateStrings[0]}`);
  console.log(`   To: ${dateStrings[6]}`);
  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📝 Test the API with:');
  console.log(`   Court IDs to use:`);
  console.log(`   - Cricket: ${cricketCourt.id}`);
  console.log(`   - Football: ${footballCourt.id}`);
  console.log(`   - Badminton: ${badmintonCourt.id}`);
  console.log(`\n   Available dates: ${dateStrings.join(', ')}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });