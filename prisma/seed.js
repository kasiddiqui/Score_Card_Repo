const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany({});
  await prisma.opportunity.deleteMany({});
  await prisma.approvalLog.deleteMany({});

  const users = [
    { name: 'John Submitter', role: 'Submitter', sbu: 'Cardiology' },
    { name: 'Alice Manager', role: 'SBU_Manager', sbu: 'Cardiology' },
    { name: 'Bob PMO', role: 'PMO', sbu: 'All' },
    { name: 'CEO Boss', role: 'Top_Management', sbu: 'All' }
  ];

  for (const u of users) {
    await prisma.user.create({ data: u });
  }

  console.log('Database seeded with mock users.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
