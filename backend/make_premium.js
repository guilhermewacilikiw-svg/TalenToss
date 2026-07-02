const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

async function makePremium() {
  const user = await prisma.user.findUnique({ where: { email: 'empresa@talentoss.com' } });
  if (user) {
    const company = await prisma.company.findUnique({ where: { userId: user.id } });
    if (company) {
      await prisma.company.update({
        where: { id: company.id },
        data: { plan: 'PREMIUM' }
      });
      console.log('Company upgraded to PREMIUM!');
    } else {
      // Create company profile if it doesn't exist yet
      await prisma.company.create({
        data: {
          userId: user.id,
          name: 'TalenToss RH',
          plan: 'PREMIUM'
        }
      });
      console.log('Company profile created and set to PREMIUM!');
    }
  } else {
    console.log('User not found!');
  }
}

makePremium()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
