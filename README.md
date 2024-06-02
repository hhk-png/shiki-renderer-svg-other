shiki-renderer-svg-other

## Using

```ts
import { codeToTokens } from 'shiki'
import { getSVGRenderer } from 'shiki-renderer-svg-other'
import { writeFileSync } from 'node:fs'

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
 
const { renderToSVG } = await getSVGRenderer({
   lineHeightRatio: 1.5,
})
const res = renderToSVG(tokens)

writeFileSync(new URL('./svg.svg', import.meta.url), res)
```



## The renderer result

![renderResult](./images/test.svg)

## Developing

- clone this repository
- run `pnpm install`
- run `pnpm exec playwright install`
- Run tests with `pnpm run test` 

- Build with `pnpm run build`