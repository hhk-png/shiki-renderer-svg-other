import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { codeToTokens } from 'shiki'
import { getSVGRenderer } from '../src/index'

// @ts-ignore
globalThis.__BROWSER__ = false

describe('renderToSVG', async () => {
  const str = `const show = console.log
//  注释注释
async function fact(n) {
  return n === 0 ? 1 : n * (await fact (n - 1))
}
fact(6).then(show)
const str = "12"
const str2 = '12'
fact(4).then(show)
fact(5).then(show)
fact(2).then(show)
fact(3).then(show)
fact(1).then(show)`

  const { tokens } = await codeToTokens(str, {
    lang: 'javascript',
    theme: 'github-light',
  })

  it('renderToSVG', async () => {
    const { renderToSVG } = getSVGRenderer({
      lineHeightRatio: 1.5,
    })
    const res = renderToSVG(tokens)
    expect(res).toContain('</text>')
    expect(res).toContain('</tspan>')
    expect(res).toContain('<svg')
    expect(res).toContain('::selection')
    expect(res).toContain('rect')
    expect(res).toContain('font-family')
    expect(res).not.toContain('border-radius')
    expect(res).not.toContain('opacity')
    expect(res).contain('font-size="20px"')
    // for ui test
    writeFile(res)
  })

  it('optional options', async () => {
    const { renderToSVG } = getSVGRenderer({ 
      backgroundColor: 'blue',
      borderRadius: 10,
      opacity: 0.5,
      cursor: 'text',
      selectionColor: 'red',
      selectionbgColor: 'yellow'
    })
    const res = renderToSVG(tokens)
    expect(res).toContain('fill="blue"')
    expect(res).toContain('border-radius:10')
    expect(res).toContain('opacity:0.5')
    expect(res).toContain('cursor:text')
    expect(res).toContain('fill:red')
    expect(res).toContain('background-color:yellow')
  })
})

function writeFile(svgStr: string) {
  const htmlfile = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  ${svgStr}
</body>
</html>
`
  // create uiviewer folder
  if (!existsSync(new URL('./uiviewer', import.meta.url)))
    mkdirSync(new URL('./uiviewer', import.meta.url))

  writeFileSync(new URL('./uiviewer/test.html', import.meta.url), htmlfile)
  writeFileSync(new URL('./uiviewer/test.svg', import.meta.url), svgStr)
}
