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

    const secondButton = buttons[1]
    expect(secondButton).toBeDefined()
    if (secondButton) {
      await secondButton.trigger('click')
    }

    const emitted = wrapper.emitted('change')
    expect(emitted).toBeDefined()
    if (emitted && emitted[0]) {
      expect(emitted[0]).toEqual([2])
    }
  })
})
