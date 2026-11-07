import type { Account } from '@/types/account'

export const ACCOUNTS: Record<number, Account> = {
  1: {
    name: 'Happy Paws Rescue',
    description:
      'A non-profit rescue committed to rehabilitating and rehoming stray dogs and cats.',
    profileImageUrl: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=200',
    coverImageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600',
    email: 'contact@happypaws.org',
    password: 'password123',
    phone: '(415) 555-0142',
    notes: 'Please text or call between 9:00 AM and 5:00 PM on weekdays.',
    latitude: 37.7749,
    longitude: -122.4194,
    banned: false,
  },
  2: {
    name: 'Bay Area Pet Haven',
    description:
      'Providing safe shelter, medical treatment, and loving homes for abandoned animals.',
    profileImageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200',
    coverImageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600',
    email: 'info@bayareapethaven.org',
    password: 'password123',
    phone: '(510) 555-0189',
    notes: 'Visits by appointment only. Email preferred.',
    latitude: 37.8044,
    longitude: -122.2712,
    banned: false,
  },
  3: {
    name: 'Sunset Critter Sanctuary',
    description: 'Focused on special-needs and senior pets who need gentle, patient homes.',
    profileImageUrl: 'https://images.unsplash.com/photo-1560743641-3914f4c4b88c?w=200',
    coverImageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600',
    email: 'adopt@sunsetcritters.org',
    password: 'password123',
    phone: '(415) 555-0177',
    notes: 'Send us an email with the animal name in the subject line.',
    latitude: 37.7599,
    longitude: -122.4842,
    banned: false,
  },
  4: {
    name: 'East Bay Feline Foundation',
    description: 'Dedicated to community cat welfare, foster placement, and kitten adoptions.',
    profileImageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=200',
    coverImageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600',
    email: 'help@eastbaycats.org',
    password: 'password123',
    phone: '(510) 555-0123',
    notes: 'Fill out an inquiry on our site or email directly.',
    latitude: 37.8715,
    longitude: -122.273,
    banned: false,
  },
  5: {
    name: 'Alex Rivera',
    description: 'Independent poster looking for a good home for an unexpected litter.',
    profileImageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    coverImageUrl: 'https://placehold.co/600x400?text=No+Cover+Image',
    email: 'alex.rivera@example.com',
    password: 'password123',
    phone: '(408) 555-0199',
    latitude: 37.3382,
    longitude: -121.8863,
    banned: false,
  },
}
const saved = localStorage.getItem('accounts')
if (saved) {
  Object.assign(ACCOUNTS, JSON.parse(saved))
}
