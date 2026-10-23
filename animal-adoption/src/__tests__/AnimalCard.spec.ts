import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AnimalCard from '../components/AnimalCard.vue'
import type { Animal, User } from '../types'
import router from '../router'

describe('AnimalCard.vue', () => {
  const sampleAnimal: Animal = {
    id: 1,
    userId: 1,
    name: 'Luna',
    species: 'dog',
    details: 'Golden retriever mix.',
    requirements: 'Fenced yard.',
    imageUrl: 'https://example.com/luna.jpg',
    status: 'available',
    tagIds: [1],
    createdAt: '2026-10-15T09:00:00Z',
  }

  const sampleOwner: User = {
    id: 1,
    name: 'Happy Paws Shelter',
    profilePictureUrl: '',
    phone: '12345678',
    contactNote: 'Friendly shelter.',
    locationName: 'Riverside',
    latitude: 13.7,
    longitude: 100.5,
    role: 'poster',
    banned: false,
  }

  it('renders animal name, species, and owner info via props', () => {
    const wrapper = mount(AnimalCard, {
      props: {
        animal: sampleAnimal,
        owner: sampleOwner,
      },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Luna')
    expect(wrapper.text()).toContain('dog')
    expect(wrapper.text()).toContain('AVAILABLE')
    expect(wrapper.text()).toContain('Happy Paws Shelter')
  })
})
