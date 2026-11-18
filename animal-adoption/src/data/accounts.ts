import type { Account } from '@/types/account'

export const ACCOUNTS: Record<number, Account> = {
  1: {
    id: 1,
    name: 'Happy Paws Rescue',
    description:
      'A non-profit rescue committed to rehabilitating and rehoming stray dogs and cats.',
    profileImageUrl: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=200',
    coverImageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600',
    email: 'contact@happypaws.org',
    password: 'password123',
    phone: '(415) 555-0142',
    notes: 'Please text or call between 9:00 AM and 5:00 PM on weekdays.',
    latitude: 11.5761,
    longitude: 104.9230,
    banned: false,
  },
  2: {
    id: 2,
    name: 'Bay Area Pet Haven',
    description:
      'Providing safe shelter, medical treatment, and loving homes for abandoned animals.',
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
  3: {
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
  4: {
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
  5: {
    id: 5,
    name: 'Alex Rivera',
    description: 'Independent poster looking for a good home for an unexpected litter.',
    profileImageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    coverImageUrl: 'https://placehold.co/600x400?text=No+Cover+Image',
    email: 'alex.rivera@example.com',
    password: 'password123',
    phone: '(408) 555-0199',
    latitude: 11.5721,
    longitude: 104.8987,
    banned: false,
  },
}
const saved = localStorage.getItem('accounts')
if (saved) {
  const parsed = JSON.parse(saved)
  for (const [k, v] of Object.entries(parsed)) {
    const acc = v as Account
    if (acc.latitude && acc.latitude > 30 && ACCOUNTS[Number(k)]) {
      acc.latitude = ACCOUNTS[Number(k)]?.latitude
      acc.longitude = ACCOUNTS[Number(k)]?.longitude
    }
  }
  Object.assign(ACCOUNTS, parsed)
}
