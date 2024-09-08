/// <reference path="./global.d.ts" />
import { Canvas } from "skia-canvas"

interface Measurement {
  /**
   * The width and height of the measured text
   */
  width: number
  height: number
}

interface MeasureOptions {
  fontSize: number
  fontFamily: string
}

function measureStr(options: MeasureOptions): Measurement {
  let { fontSize, fontFamily } = options
  if (fontSize <= 0)
    fontSize = 12

  const span = document.createElement('span')
  span.style.visibility = 'hidden'
  span.style.fontSize = `${fontSize}px`
  span.style.fontFamily = fontFamily
  span.style.display = 'inline-block'
  span.textContent = 'a'
  document.body.appendChild(span)
  const { width, height } = window.getComputedStyle(span)
  document.body.removeChild(span)
  return {
    width: Number.parseFloat(width),
    height: Number.parseFloat(height),
  }
}
function measureWithSkiaCanvas(options: MeasureOptions): Measurement {
  const canvas = new Canvas(200, 200)
  const ctx = canvas.getContext('2d')

  ctx.font = options.fontSize + 'px ' + options.fontFamily
  const metrics = ctx.measureText('a')

  return {
    width: metrics.width,
    height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
  }
}

/**
 * measure the width and height of char 'a' based on fontSize and fontFamily
 */
export function measureFont(
  fontSize: number,
  fontFamily: string,
) {
  const options = { fontSize, fontFamily }
  if (__BROWSER__) {
    return measureStr(options)
  }
  else {
    return measureWithSkiaCanvas(options)
  }
}
