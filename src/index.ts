import { measureFont } from './measureFont'

interface RenderOptions {
  /**
   * The rendered font family.
   *
   * @default '"Lucida Console", Courier, monospace'
   */
  fontFamily?: string

  /**
   * The rendered font size.
   *
   * @default 20
   */
  fontSize?: number

  /**
   * The fontHeight measured by playwright is different from browser environment.
   * You could use this option to make fontHeight same.
   * The lineHeightRatio is the ratio of line height to font size.
   * 
   * @default -1
   */
  lineHeightRatio?: number

  /**
   * The svg background color.
   *
   * @default '#eee'
   */
  backgroundColor?: string

  /**
   * The svg border-radius.
   *
   * @default 0
   */
  borderRadius?: number

  /**
   * The text background color when you select text.
   *
   * @default '#b4d5ea'
   */
  selectionbgColor?: string

  /**
   * The font color when you select text.
   *
   * @default ''
   */
  selectionColor?: string

  /**
   * The cursor style when the mouse is placed on the svg text.
   *
   * @default 'default'
   */
  cursor?: string

  /**
   * Svg opacity.
   *
   * @default 1
   */
  opacity?: number
}

type RequiredRenderOptions = Required<RenderOptions>
const defaultRenderOptions: RequiredRenderOptions = {
  fontFamily: 'Lucida Console, Courier, monospace',
  fontSize: 20,
  lineHeightRatio: -1,
  backgroundColor: '#eee',
  borderRadius: 0,
  opacity: 1,
  cursor: 'default',
  selectionColor: '',
  selectionbgColor: '#b4d5ea',
}

type Token = {
  content?: string
  color?: string
}
interface IToken extends Token {}

export function getSVGRenderer(renderOptions?: RenderOptions) {
  const options = { ...defaultRenderOptions, ...renderOptions }

  // svg file didn't support attribute selector
  const svgClassId = 'svg' + Math.random().toString(36).substring(2, 9)
  const styleStr = generateStyle(svgClassId, options)
  const {
    fontSize,
    fontFamily,
    lineHeightRatio,
    backgroundColor
  } = options

  let { width: fontWidth, height: fontHeight } = measureFont(
    fontSize,
    fontFamily,
  )
  if (lineHeightRatio !== -1) {
    fontHeight = lineHeightRatio * fontSize
  }

  return {
    renderToSVG(tokenLines: IToken[][]) {
      const [svgWidth, svgHeight] = getAdaptiveWidthAndHeight(
        tokenLines,
        fontWidth,
        fontHeight,
      )

      let svg = `<svg class="${svgClassId}" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}px" `
        + `height="${svgHeight}px" font-size="${fontSize}px" xmlns="http://www.w3.org/2000/svg">`
      svg += styleStr

      svg += `<rect width="${svgWidth}px" height="${svgHeight}px" fill="${backgroundColor}" pointer-events="none"/>`
      const x = Math.floor(fontWidth / 2)
      let y = Math.floor(fontHeight / 4) + fontHeight
      for (const line of tokenLines) {
        if (line.length === 0) {
          svg += `<text x="${x}" y="${y}"><tspan fill="#000">&nbsp;</tspan></text>`
        }
        else {
          svg += `<text x="${x}" y="${y}">`

          for (const token of line) {
            svg += `<tspan fill="${token.color}">${decodeContent(
              token.content!,
            )}</tspan>`
          }

          svg += '</text>'
        }
        y += fontHeight
      }

      svg += '</svg>'

      return svg
    },
  }
}

function generateStyle(svgId: string, options: RequiredRenderOptions) {
  const {
    fontFamily,
    borderRadius,
    cursor,
    opacity,
    selectionbgColor,
    selectionColor,
  } = options

  // svg css
  let svgStyle = `.${svgId}`
  svgStyle += '{'
  svgStyle += (`font-family:${fontFamily};cursor:${cursor};`)
  if (opacity < 1 && opacity >= 0)
    svgStyle += `opacity:${opacity};`

  if (borderRadius > 0)
    svgStyle += `border-radius:${borderRadius}px;`

  svgStyle += `}`

  // selection css
  let svgStyleSelection = `.${svgId} tspan::selection`
  svgStyleSelection += '{'
  svgStyleSelection += `background-color:${selectionbgColor};`
  if (selectionColor.length > 0)
    svgStyleSelection += `fill:${selectionColor};`

  svgStyleSelection += `}`

  return `<style>${svgStyle + svgStyleSelection}</style>`
}

const contentMap = new Map<string, string>([
  // space will not be rendered in the beginning of the text
  [' ', '&#xA0;'],
  ['<', '&lt;'],
  ['>', '&gt;'],
  ['&', '&amp;'],
  ['"', '&quot;'],
  ['\'', '&#39;'],
])

function decodeContent(str: string) {
  let res: string = ''
  for (let i = 0; i < str.length; i++) {
    if (contentMap.has(str[i]))
      res += contentMap.get(str[i])!
    else
      res += str[i]
  }
  return res
}

function getAdaptiveWidthAndHeight(
  tokenLines: IToken[][],
  fontWidth: number,
  fontHeight: number,
) {
  const height = (tokenLines.length + 1) * fontHeight
  const maxCharNum = Math.max(
    ...tokenLines.map(line =>
      line.reduce((acc, val) => acc + val.content!.length, 0),
    ),
  )
  const width = (maxCharNum + 1) * fontWidth
  return [Math.floor(width), Math.floor(height)]
}
