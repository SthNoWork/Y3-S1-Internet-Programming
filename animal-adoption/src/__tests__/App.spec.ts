import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import router from '../router'

describe('App', () => {
  it('mounts renders properly with navigation brand and links', async () => {
    router.push('/animals')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })
    expect(wrapper.text()).toContain('Paw Finder')
    expect(wrapper.text()).toContain('Browse Animals')
    expect(wrapper.text()).toContain('Shelter Map')
  })
})
