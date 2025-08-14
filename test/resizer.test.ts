
import { it, expect, describe } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { Resizer } from '#components'

describe('Resizer', () => {
  it('should render resizer with default width', async () => {
    const component = await mountSuspended(Resizer)
    expect(component.attributes()).toEqual({ width: '500', height: '500' })
  })

  it('should return undefined when geImageResized with no area selection', async () => {
    const component = await mountSuspended(Resizer)
    expect(component.vm.getImageResized()).toBeUndefined()
  })
})
