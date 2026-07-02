const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeAllPremium() {
  await prisma.company.updateMany({
    data: { plan: 'PREMIUM' }
  });
  console.log('All companies upgraded to PREMIUM!');
}

makeAllPremium()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
