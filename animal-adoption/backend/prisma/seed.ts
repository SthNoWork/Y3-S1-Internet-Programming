// backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting full database seed from frontend mock datasets...')

  // Clean existing tables in reverse relational order to guarantee a fresh, consistent seed
  await prisma.animal.deleteMany({})
  await prisma.account.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.species.deleteMany({})
  console.log('✓ Cleaned existing records.')

  // 1. Seed All Species (from src/data/species.ts)
  const speciesList = [
    { id: 1, name: 'Dog' },
    { id: 2, name: 'Cat' },
    { id: 3, name: 'Rabbit' },
    { id: 4, name: 'Bird' },
  ]

  for (const s of speciesList) {
    await prisma.species.create({
      data: s,
    })
  }
  console.log(`✓ Seeded ${speciesList.length} species.`)

  // 2. Seed All Categories / Tags (from src/data/categories.ts)
  const categoryList = [
    { id: 1, name: 'Active' },
    { id: 2, name: 'House-trained' },
    { id: 3, name: 'Calm' },
    { id: 4, name: 'Good with Kids' },
    { id: 5, name: 'Hypoallergenic' },
    { id: 6, name: 'Needs Yard' },
    { id: 7, name: 'Indoor Only' },
    { id: 8, name: 'Special Diet' },
  ]

  for (const c of categoryList) {
    await prisma.category.create({
      data: c,
    })
  }
  console.log(`✓ Seeded ${categoryList.length} categories.`)

  // 3. Seed All Accounts (from src/data/accounts.ts)
  const accounts = [
    {
      id: 1,
      name: 'Happy Paws Rescue',
      description: 'A non-profit rescue committed to rehabilitating and rehoming stray dogs and cats.',
      profileImageUrl: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=200',
      coverImageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600',
      email: 'contact@happypaws.org',
      password: 'password123',
      phone: '(415) 555-0142',
      notes: 'Please text or call between 9:00 AM and 5:00 PM on weekdays.',
      latitude: 11.5761,
      longitude: 104.923,
      banned: false,
    },
    {
      id: 2,
      name: 'Bay Area Pet Haven',
      description: 'Providing safe shelter, medical treatment, and loving homes for abandoned animals.',
      profileImageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200',
      coverImageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600',
      email: 'info@bayareapethaven.org',
      password: 'password123',
      phone: '(510) 555-0189',
      notes: 'Visits by appointment only. Email preferred.',
      latitude: 11.5508,
      longitude: 104.9282,
      banned: false,
    },
    {
      id: 3,
      name: 'Sunset Critter Sanctuary',
      description: 'Focused on special-needs and senior pets who need gentle, patient homes.',
      profileImageUrl: 'https://images.unsplash.com/photo-1560743641-3914f4c4b88c?w=200',
      coverImageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600',
      email: 'adopt@sunsetcritters.org',
      password: 'password123',
      phone: '(415) 555-0177',
      notes: 'Send us an email with the animal name in the subject line.',
      latitude: 11.5406,
      longitude: 104.9147,
      banned: false,
    },
    {
      id: 4,
      name: 'East Bay Feline Foundation',
      description: 'Dedicated to community cat welfare, foster placement, and kitten adoptions.',
      profileImageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=200',
      coverImageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600',
      email: 'help@eastbaycats.org',
      password: 'password123',
      phone: '(510) 555-0123',
      notes: 'Fill out an inquiry on our site or email directly.',
      latitude: 11.5683,
      longitude: 104.9328,
      banned: false,
    },
    {
      id: 5,
      name: 'Alex Rivera',
      description: 'Independent poster looking for a good home for an unexpected litter.',
      profileImageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      coverImageUrl: 'https://placehold.co/600x400?text=No+Cover+Image',
      email: 'alex.rivera@example.com',
      password: 'password123',
      phone: '(408) 555-0199',
      notes: null,
      latitude: 11.5721,
      longitude: 104.8987,
      banned: false,
    },
  ]

  for (const acc of accounts) {
    await prisma.account.create({
      data: acc,
    })
  }
  console.log(`✓ Seeded ${accounts.length} shelter accounts.`)

  // 4. Seed All 10 Animals (from src/data/animals.ts)
  const animals = [
    {
      id: 1,
      accountId: 1,
      name: 'Bella',
      birthDate: new Date('2023-08-15'),
      gender: 'female',
      speciesId: 1,
      status: 'available',
      description: 'A cheerful Golden Retriever mix who loves fetch and belly rubs.',
      requirement: 'Thrives in a home with a fenced yard and daily outdoor exercise.',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80',
      imageUrls: [
        'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1000&auto=format&fit=crop&q=80',
      ],
      categoryIds: [1, 2, 4, 6],
      isVaccinated: true,
      isNeutered: true,
    },
    {
      id: 2,
      accountId: 2,
      name: 'Milo',
      birthDate: new Date('2026-06-10'),
      gender: 'male',
      speciesId: 2,
      status: 'available',
      description: 'Curious ginger tabby kitten who enjoys sunbeams and feather wands.',
      requirement: 'Best suited as an indoor cat; loves gentle handling.',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
      imageUrls: [
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1000&auto=format&fit=crop&q=80',
      ],
      categoryIds: [1, 4, 7],
      isVaccinated: true,
      isNeutered: false,
    },
    {
      id: 3,
      accountId: 1,
      name: 'Luna',
      birthDate: new Date('2021-04-20'),
      gender: 'female',
      speciesId: 1,
      status: 'pending',
      description: 'Gentle German Shepherd who is exceptionally loyal and well-mannered.',
      requirement: 'Experienced dog owner preferred; enjoys quiet, predictable environments.',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600&auto=format&fit=crop&q=80',
      imageUrls: [
        'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=1000&auto=format&fit=crop&q=80',
      ],
      categoryIds: [2, 3],
      isVaccinated: true,
      isNeutered: true,
    },
    {
      id: 4,
      accountId: 3,
      name: 'Barnaby',
      birthDate: new Date('2024-09-05'),
      gender: 'male',
      speciesId: 3,
      status: 'available',
      description: 'A calm Holland Lop rabbit with soft fur and an affectionate temperament.',
      requirement: 'Requires a spacious indoor pen and unlimited timothy hay.',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&auto=format&fit=crop&q=80',
      imageUrls: [
        'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=1000&auto=format&fit=crop&q=80',
      ],
      categoryIds: [3, 7, 8],
      isVaccinated: true,
      isNeutered: true,
    },
    {
      id: 5,
      accountId: 2,
      name: 'Oliver',
      birthDate: new Date('2022-11-12'),
      gender: 'male',
      speciesId: 2,
      status: 'available',
      description: 'Polite British Shorthair with a plush gray coat and independent vibe.',
      requirement: 'Prefers calm adults; great companion for people working from home.',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&auto=format&fit=crop&q=80',
      imageUrls: [
        'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=1000&auto=format&fit=crop&q=80',
      ],
      categoryIds: [2, 3, 7],
      isVaccinated: true,
      isNeutered: true,
    },
    {
      id: 6,
      accountId: 1,
      name: 'Daisy',
      birthDate: new Date('2024-03-22'),
      gender: 'female',
      speciesId: 1,
      status: 'available',
      description: 'Playful Beagle mix with an outstanding nose and an appetite for adventure.',
      requirement: 'Needs secure fencing because she loves to follow scent trails.',
      thumbnailUrl:
        'https://images.unsplash.com/photo-153715125747-768eb6cf92b2?w=600&auto=format&fit=crop&q=80',
      imageUrls: [
        'https://images.unsplash.com/photo-153715125747-768eb6cf92b2?w=1000&auto=format&fit=crop&q=80',
      ],
      categoryIds: [1, 4, 6],
      isVaccinated: true,
      isNeutered: true,
    },
    {
      id: 7,
      accountId: 4,
      name: 'Shadow',
      birthDate: new Date('2020-05-30'),
      gender: 'male',
      speciesId: 2,
      status: 'adopted',
      description: 'Sleek black cat who loves perching on top of tall cat trees.',
      requirement: 'Requires a sensitive-stomach food formula.',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600&auto=format&fit=crop&q=80',
      imageUrls: [
        'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1000&auto=format&fit=crop&q=80',
      ],
      categoryIds: [2, 3, 7, 8],
      isVaccinated: true,
      isNeutered: true,
    },
    {
      id: 8,
      accountId: 3,
      name: 'Kiwi',
      birthDate: new Date('2026-10-15'),
      gender: 'female',
      speciesId: 4,
      status: 'available',
      description: 'Vibrant green parakeet who whistles cheerful tunes in the morning.',
      requirement: 'Cage kept away from kitchen fumes; daily out-of-cage flight time.',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&auto=format&fit=crop&q=80',
      imageUrls: [
        'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=1000&auto=format&fit=crop&q=80',
      ],
      categoryIds: [1, 7],
      isVaccinated: false,
      isNeutered: false,
    },
    {
      id: 9,
      accountId: 4,
      name: 'Rocky',
      birthDate: new Date('2022-07-04'),
      gender: 'male',
      speciesId: 1,
      status: 'available',
      description: 'Athletic Boxer mix with boundless energy and a heart of gold.',
      requirement: 'Best in an active household; loves hiking and running buddies.',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
      imageUrls: [
        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1000&auto=format&fit=crop&q=80',
      ],
      categoryIds: [1, 2, 6],
      isVaccinated: true,
      isNeutered: true,
    },
    {
      id: 10,
      accountId: 5,
      name: 'Chloe',
      birthDate: new Date('2019-02-14'),
      gender: 'female',
      speciesId: 2,
      status: 'available',
      description: 'Affectionate senior Persian mix who wants nothing more than a warm lap.',
      requirement: 'Daily brushing needed to keep her long coat tangle-free.',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&auto=format&fit=crop&q=80',
      imageUrls: [
        'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=1000&auto=format&fit=crop&q=80',
      ],
      categoryIds: [2, 3, 7],
      isVaccinated: true,
      isNeutered: true,
    },
  ]

  for (const pet of animals) {
    const { categoryIds, ...animalData } = pet
    await prisma.animal.create({
      data: {
        ...animalData,
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        },
      },
    })
  }

  console.log(`✓ Seeded ${animals.length} animals with their categories and relations.`)
  console.log('🎉 Full dataset seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
