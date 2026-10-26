import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AnimalFilters from '../components/AnimalFilters.vue'
import { species } from '../data/species'
import { tags } from '../data/tags'

describe('AnimalFilters.vue', () => {
  it('renders species options populated from species.ts and emits update:species on change', async () => {
    const wrapper = mount(AnimalFilters, {
      props: {
        tags,
        search: '',
        species: '',
        selectedTagId: null,
        sort: 'newest',
      },
    })

    const speciesSelect = wrapper.find('#filter-species')
    expect(speciesSelect.exists()).toBe(true)

    const options = speciesSelect.findAll('option')
    // 1 default "All Species" + number of species from species.ts
    expect(options).toHaveLength(species.length + 1)
    expect(options[0]?.text()).toBe('All Species')

    species.forEach((item, index) => {
      expect(options[index + 1]?.text()).toBe(item.name)
      expect(options[index + 1]?.attributes('value')).toBe(item.id)
    })

    await speciesSelect.setValue('cat')
    const emitted = wrapper.emitted('update:species')
    expect(emitted).toBeDefined()
    expect(emitted?.[0]).toEqual(['cat'])
  })

  it('supports passing custom speciesList via prop', async () => {
    const customSpecies = [{ id: 'dog' as const, name: 'Canines' }]

    const wrapper = mount(AnimalFilters, {
      props: {
        tags,
        search: '',
        species: '',
        selectedTagId: null,
        sort: 'newest',
        speciesList: customSpecies,
      },
    })

    const options = wrapper.find('#filter-species').findAll('option')
    expect(options).toHaveLength(2)
    expect(options[1]?.text()).toBe('Canines')
  })
})
