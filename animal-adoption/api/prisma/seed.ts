import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const posterRole = await prisma.role.upsert({
    where: { name: 'poster' },
    update: {},
    create: { name: 'poster' },
  });
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });

  await prisma.animalStatus.createMany({
    data: [{ name: 'available' }, { name: 'adopted' }],
    skipDuplicates: true,
  });
  await prisma.reportStatus.createMany({
    data: [{ name: 'open' }, { name: 'reviewed' }],
    skipDuplicates: true,
  });
  await prisma.species.createMany({
    data: [{ name: 'Dog' }, { name: 'Cat' }, { name: 'Bird' }],
    skipDuplicates: true,
  });

  const passwordHash = await bcrypt.hash('Admin123!', 12);
  await prisma.user.upsert({
    where: { email: 'admin@pawfinder.local' },
    update: { roleId: adminRole.id, passwordHash },
    create: {
      name: 'Paw Finder Admin',
      email: 'admin@pawfinder.local',
      passwordHash,
      roleId: adminRole.id,
    },
  });

  const posterPasswordHash = await bcrypt.hash('Poster123!', 12);
  const poster = await prisma.user.upsert({
    where: { email: 'poster@pawfinder.local' },
    update: { roleId: posterRole.id, passwordHash: posterPasswordHash, banned: false },
    create: {
      name: 'Demo Animal Poster',
      email: 'poster@pawfinder.local',
      passwordHash: posterPasswordHash,
      roleId: posterRole.id,
    },
  });
  const availableStatus = await prisma.animalStatus.findUniqueOrThrow({ where: { name: 'available' } });
  const species = await prisma.species.findMany({ orderBy: { id: 'asc' }, take: 3 });
  const demoAnimals = [
    ['Buddy', 'A friendly dog who loves walks.', 'Fenced yard preferred.'],
    ['Luna', 'A gentle cat who enjoys quiet homes.', 'Indoor home required.'],
    ['Max', 'A playful dog looking for an active family.', 'Daily exercise required.'],
    ['Cleo', 'A curious cat who loves attention.', 'No known requirements.'],
    ['Sunny', 'A cheerful bird who enjoys company.', 'Large cage and daily interaction required.'],
  ];
  for (let index = 0; index < demoAnimals.length; index += 1) {
    const [name, details, requirements] = demoAnimals[index];
    await prisma.animal.upsert({
      where: { id: index + 1 },
      update: { name, details, requirements, userId: poster.id, speciesId: species[index % species.length].id, statusId: availableStatus.id },
      create: { name, details, requirements, userId: poster.id, speciesId: species[index % species.length].id, statusId: availableStatus.id },
    });
  }

  console.log(`Seeded roles: ${posterRole.name}, ${adminRole.name}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
