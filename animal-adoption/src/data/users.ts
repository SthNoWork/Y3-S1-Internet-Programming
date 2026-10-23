import type { User } from '../types'

export const users: User[] = [
  {
    id: 1,
    name: 'Happy Paws Shelter',
    profilePictureUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=150',
    phone: '+66 81 234 5678',
    contactNote: 'Non-profit shelter open every weekend for visits and adoption meetings.',
    locationName: 'Riverside District',
    latitude: 13.7563,
    longitude: 100.5018,
    role: 'poster',
    banned: false,
  },
  {
    id: 2,
    name: 'Empty Nest Rescue',
    profilePictureUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    phone: '+66 82 345 6789',
    contactNote: 'Small foster network. Currently all rescued animals have found forever homes!',
    locationName: 'Sukhumvit Lane 42',
    latitude: 13.7191,
    longitude: 100.5843,
    role: 'poster',
    banned: false, // Has no available animals to test the empty case
  },
  {
    id: 3,
    name: 'Suspended Account',
    profilePictureUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    phone: '+66 83 999 0000',
    contactNote: 'Account suspended due to policy violations.',
    locationName: 'Northern District',
    latitude: 13.8245,
    longitude: 100.5621,
    role: 'poster',
    banned: true, // Banned user to test moderation and hidden cases
  },
]
