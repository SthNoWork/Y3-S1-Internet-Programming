import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PaginationBar from '../components/PaginationBar.vue'

describe('PaginationBar.vue', () => {
  it('emits change event when a page number button is clicked', async () => {
    const wrapper = mount(PaginationBar, {
      props: {
        page: 1,
        pageCount: 3,
      },
    })

    const buttons = wrapper.findAll('.number-btn')
    expect(buttons).toHaveLength(3)

    // Click page 2
    await buttons[1].trigger('click')
    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')?.[0]).toEqual([2])
  })
})
