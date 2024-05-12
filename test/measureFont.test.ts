import { describe, expect, it } from 'vitest'
import {measureFont} from '../src/measureFont.ts'

describe("measureFont", () => {
  it("measureFont width fontSize", async () => {
    const measurement = await measureFont(20, '"Lucida Console", Courier, monospace', "")
    expect(measurement.width).toBeGreaterThan(0)
    expect(measurement.height).toBeGreaterThan(0)
    const measurement2 = await measureFont(-1, '"Lucida Console", Courier, monospace', "")
    expect(measurement2.width).toBeGreaterThan(0)
    expect(measurement2.height).toBeGreaterThan(0)
  })
})

