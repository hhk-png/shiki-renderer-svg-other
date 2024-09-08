import { describe, it, expect } from "vitest"
import { measureFont } from "../src/measureFont"

// @ts-ignore
globalThis.__BROWSER__ = false

describe('measureWithSkiaCanvas', () => {
  it('should return the same result', () => {
    expect(measureFont(20, 'Lucida Console, Courier, monospace'))
      .toEqual(measureFont(20, 'Lucida Console, Courier, monospace'))
  })
})
