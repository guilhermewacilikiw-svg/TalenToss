const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`ALTER TABLE "Candidate" ALTER COLUMN "profileVector" TYPE vector(768);`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "Job" ALTER COLUMN "jobVector" TYPE vector(768);`);
  console.log("Vector columns updated to 768 dimensions.");
}
main().catch(console.error).finally(() => prisma.$disconnect());
