import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { measureFont } from "../src/measureFont"

// @ts-ignore
globalThis.__BROWSER__ = false

describe('measureWithSkiaCanvas', () => {
  it('should return the same result', () => {
    expect(measureFont(20, 'Lucida Console, Courier, monospace'))
      .toEqual(measureFont(20, 'Lucida Console, Courier, monospace'))
  })
})

describe('simulate measureFont in browser', () => {
  beforeAll(() => {
    // @ts-expect-error __BROWSER__ is defined in rollup options
    globalThis.__BROWSER__ = true
    globalThis.document = {
      // @ts-expect-error simulate browser env
      createElement: () => {
        return {
          textContent: 'a',
          style: {},
          appendChild() { },
          removeChild() { },
        }
      },
      body: {
        // @ts-expect-error simulate browser env
        appendChild() { },
        // @ts-expect-error simulate browser env
        removeChild() { },
      },
    }
    globalThis.window = {
      // @ts-expect-error simulate browser env
      getComputedStyle() {
        return {
          width: '12',
          height: '20',
        }
      },
    }
  })

  it('measureFont in browser env', () => {
    const { width, height } = measureFont(20, 'Lucida Console, Courier, monospace')
    // font width and height are different in different os
    expect(width).toBeGreaterThanOrEqual(12)
    expect(height).toBeGreaterThanOrEqual(20)
  })

  it('fontsize <= 0', () => {
    const { width, height } = measureFont(0, 'Lucida Console, Courier, monospace')
    expect(width).toBeGreaterThanOrEqual(12)
    expect(height).toBeGreaterThanOrEqual(20)
  })

  afterAll(() => {
    // @ts-expect-error simulate
    globalThis.document = undefined
    // @ts-expect-error simulate
    globalThis.window = undefined
  })
})
