import { measureFont } from './measureFont'

interface Token {
  content?: string
  color?: string
  offset?: number
}

interface RenderOptions {
  fontFamily?: string
  fontSize?: number
  backgroundColor?: string

}

const defaultRenderOptions: Required<RenderOptions> = {
  fontFamily: '"Lucida Console", Courier, monospace',
  fontSize: 20,
  backgroundColor: '#eee',
}

export async function renderToSVG<T extends Token>(
  tokenLines: T[][],
  options?: RenderOptions
): Promise<string> {

  const {
    fontFamily,
    fontSize,
    backgroundColor,
  } = Object.assign(defaultRenderOptions, options)

  const { width: fontWidth, height: fontHeight } = await measureFont(
    fontSize,
    fontFamily
  )
  const [svgWidth, svgHeight] = getAdaptiveWidthAndHeight(
    tokenLines,
    fontWidth,
    fontHeight
  )
  let svg = `<svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}" font-family='${fontFamily}' font-size="${fontSize}" style="background-color: ${backgroundColor};" xmlns="http://www.w3.org/2000/svg">`

  let x = Math.floor(fontWidth / 2)
  let y = Math.floor(fontHeight / 4) + fontHeight
  for (const line of tokenLines) {
    if (line.length === 0) {
      svg += `<text x="${x}" y="${y}"><tspan fill="#000">&nbsp;</tspan></text>`
    } else {
      svg += `<text x="${x}" y="${y}">`

      for (const token of line) {
        svg += `<tspan fill="${token.color}">${decodeContent(
          token.content!
        )}</tspan>`
      }

      svg += '</text>'
    }
    y += fontHeight
  }

  svg += '</svg>'

  return svg
}

const contentMap = new Map<string, string>([
  [' ', '&nbsp;'],
  ['<', '&lt;'],
  ['>', '&gt;'],
  ['&', '&amp;'],
  ['"', '&quot;'],
  ["'", '&#39;'],
])

function decodeContent(str: string) {
  let res: string = ''
  for (let i = 0; i < str.length; i++) {
    if (contentMap.has(str[i])) {
      res += contentMap.get(str[i])!
    } else {
      res += str[i]
    }
  }
  return res
}

function getAdaptiveWidthAndHeight<T extends Token>(
  tokenLines: T[][],
  fontWidth: number,
  fontHeight: number
) {
  const height = (tokenLines.length + 1) * fontHeight
  const maxCharNum = Math.max(
    ...tokenLines.map((line) =>
      line.reduce((acc, val) => acc + val.content!.length, 0)
    )
  )
  const width = (maxCharNum + 1) * fontWidth
  return [width, height]
}
