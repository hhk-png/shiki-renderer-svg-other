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
  borderRadius?: number,
  selectionbgColor?: string,
  cursor?: string,
  selectionFill?: string,
  opacity?: number
}

// lineheight
// remotefonturl
// svg \n
const defaultRenderOptions: Required<RenderOptions> = {
  fontFamily: '"Lucida Console", Courier, monospace',
  fontSize: 20,
  backgroundColor: '#eee',
  borderRadius: 0,
  selectionbgColor: '#b4d5ea',
  cursor: 'default',
  selectionFill: '',
  opacity: 1
}

export async function renderToSVG<T extends Token>(
  tokenLines: T[][],
  options?: RenderOptions
): Promise<string> {

  const {
    fontFamily,
    fontSize,
    backgroundColor,
    borderRadius,
    selectionbgColor,
    cursor,
    // selectionFill,
    opacity
  } = Object.assign(defaultRenderOptions, options)

  const svgId = "data-svg-" + getId()

  const { width: fontWidth, height: fontHeight } = await measureFont(
    fontSize,
    fontFamily
  )
  const [svgWidth, svgHeight] = getAdaptiveWidthAndHeight(
    tokenLines,
    fontWidth,
    fontHeight
  )
  // todo: fill is ""
  let svg = `<svg ${svgId} viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}" font-family='${fontFamily}' font-size="${fontSize}" style="background-color: ${backgroundColor};opacity:${opacity};" xmlns="http://www.w3.org/2000/svg">`
  svg += `<style>svg[${svgId}]{border-radius: ${borderRadius};cursor:${cursor};}svg[${svgId}] tspan::selection{background-color:${selectionbgColor};}</style>`
  
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

function getId() {
  return Math.random().toString(36).substring(2, 9)
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
