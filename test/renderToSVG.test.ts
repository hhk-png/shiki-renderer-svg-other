import { describe, expect, it } from 'vitest'
import { codeToTokens } from 'shiki'
import { getSVGRenderer } from '../src/renderToSVG.ts'
import { writeFileSync } from 'fs'

describe("renderToSVG", () => {
  
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
    expect(res).toContain('<text>')
    
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
