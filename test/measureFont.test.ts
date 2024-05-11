import { describe, expect, it } from 'vitest'
import {measureFont} from '../src/measureFont.ts'
import { codeToTokens } from 'shiki'
import { getSVGRenderer } from '../src/renderToSVG.ts'
import { writeFileSync } from 'fs'

describe("measureFont", () => {

  it("measureFont width fontSize", async () => {
    const measurement = await measureFont(20, '"Lucida Console", Courier, monospace', "")
    expect(measurement.width).toBeGreaterThan(0)
    expect(measurement.height).toBeGreaterThan(0)
    const measurement2 = await measureFont(-1, '"Lucida Console", Courier, monospace', "")
    expect(measurement2.width).toBeGreaterThan(0)
    expect(measurement2.height).toBeGreaterThan(0)
  })
  
  it("renderToSVG", async () => {
    const str = `const show = console.log
//  注释注释
async function fact(n) {
  return n === 0 ? 1 : n * (await fact (n - 1))
}
fact(6).then(show)
const str = "12"

fact(4).then(show)
fact(5).then(show)
fact(2).then(show)
fact(3).then(show)
fact(1).then(show)`
    const { tokens } = await codeToTokens(str.trim(), {
      lang: 'javascript',
      theme: 'github-light'
    })

    const render = getSVGRenderer()
    const res = await render.renderToSVG(tokens)
    const htmlfile = `
    <!DOCTYPE html>
    <html>
    <head>
    </head>
    <body>
    ${res}
    </body>
    </html>
    `
    writeFileSync('test.html', htmlfile)
  })
})

