import { measureFont } from './measureFont'

interface Token {
  content?: string
  color?: string
  offset?: number
}

export function getSVGRenderer() {
  return {
    async renderToSVG<T extends Token>(tokenLines: T[][]): Promise<string> {
      const fontFamily = '"Lucida Console", Courier, monospace'
      const fontSize = 20
      const backgroundColor = '#eee'
      const { width: fontWidth, height: fontHeight } = await measureFont(
        fontSize,
        fontFamily,
      )
      console.log(fontWidth, fontHeight)
      const [svgWidth, svgHeight] = getAdaptiveWidthAndHeight(
        tokenLines,
        fontWidth,
        fontHeight
      )
      let svg = `<svg width="${svgWidth}" height="${svgHeight}" font-family='${fontFamily}' font-size="${fontSize}" style="background-color: ${backgroundColor};" xmlns="http://www.w3.org/2000/svg">`

      let x = Math.floor(fontWidth / 2)
      let y = Math.floor(fontHeight / 4) + fontHeight
      for (const line of tokenLines) {
        if (line.length === 0) {
          svg += `<text x="${x}" y="${y}"><tspan fill="#000">&nbsp;</tspan></text>`
        } else {
          svg += `<text x="${x}" y="${y}">`

          for (const token of line) {
            svg += `<tspan fill="${token.color}">${decodeContent(token.content!)}</tspan>`
          }

          svg += "</text>"
        }
        y += fontHeight
      }

      svg += "</svg>"

      return svg
    },
  }
}

const contentMap = new Map<string, string>([
  [' ', '&nbsp;'],
  ['<', '&lt;'],
  ['>', '&gt;'],
  ['&', '&amp;'],
  ['"', '&quot;'],
  ["'", '&#39;']
])

function decodeContent(str: string) {
  const res: string[] = []
  for (let i = 0; i < str.length; i++) {
    if (contentMap.has(str[i])) {
      res.push(contentMap.get(str[i])!)
    } else {
      res.push(str[i])
    }
  }
  return res.join('')
}

function getAdaptiveWidthAndHeight<T extends Token>(
  tokenLines: T[][],
  fontWidth: number,
  fontHeight: number
) {
  const height = (tokenLines.length + 1) * fontHeight
  const maxCharNum = Math.max(...tokenLines.map(line => line.reduce((acc, val) => acc + val.content!.length, 0)))
  const width = (maxCharNum + 1) * fontWidth
  return [width, height]
}
