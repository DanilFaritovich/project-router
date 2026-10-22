import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UiAction from '../../src/components/UiAction.vue'

describe('UiAction link destinations', () => {
  it.each([
    'https://github.com/example/project',
    'https://github.com/example/project/releases/latest',
    'https://demo.example.com/',
    'http://demo.example.com/',
    '//demo.example.com/',
  ])('opens external destination %s securely in a new tab', (href) => {
    const wrapper = mount(UiAction, { props: { href } })
    expect(wrapper.get('a').attributes()).toMatchObject({
      href,
      target: '_blank',
      rel: 'noopener noreferrer',
    })
    wrapper.unmount()
  })

  it.each(['#projects', '/en/#resume', '/ru/', 'projects'])(
    'keeps internal destination %s in the current tab',
    (href) => {
      const wrapper = mount(UiAction, { props: { href } })
      expect(wrapper.get('a').attributes('target')).toBeUndefined()
      expect(wrapper.get('a').attributes('rel')).toBeUndefined()
      wrapper.unmount()
    },
  )
})
