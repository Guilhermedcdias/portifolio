import * as THREE from 'three'
import { GOLD, IVORY, SERIF } from './shared'

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w } else line = test
  }
  if (line) lines.push(line)
  return lines
}

function toTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

function placardBase(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const ctx = c.getContext('2d')!
  ctx.fillStyle = IVORY; ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = GOLD; ctx.lineWidth = 6; ctx.strokeRect(8, 8, w - 16, h - 16)
  ctx.strokeStyle = 'rgba(201,162,75,0.5)'; ctx.lineWidth = 2; ctx.strokeRect(20, 20, w - 40, h - 40)
  return { c, ctx }
}

/** Placa de latão acima de cada portal do saguão */
export function doorLabelTexture(num: number, title: string): THREE.CanvasTexture {
  const { c, ctx } = placardBase(512, 190)
  ctx.fillStyle = '#8a6a22'
  ctx.font = `600 22px ${SERIF}`
  ctx.textAlign = 'center'
  ctx.fillText(`S A L A   ${String(num).padStart(2, '0')}`, 256, 62)
  ctx.fillStyle = '#1b1712'
  ctx.font = `700 32px ${SERIF}`
  wrap(ctx, title, 430).slice(0, 2).forEach((l, i, a) => ctx.fillText(l, 256, (a.length > 1 ? 104 : 120) + i * 38))
  return toTexture(c)
}

/** Etiqueta de obra (ao lado de cada quadro / escultura) */
export function placardTexture(opts: { title: string; meta: string; body?: string; w?: number; h?: number }): THREE.CanvasTexture {
  const w = opts.w ?? 512, h = opts.h ?? 320
  const { c, ctx } = placardBase(w, h)
  ctx.fillStyle = '#1b1712'
  const size = opts.title.length > 34 ? 30 : 38
  ctx.font = `700 ${size}px ${SERIF}`
  const tl = wrap(ctx, opts.title, w - 80).slice(0, 3)
  tl.forEach((l, i) => ctx.fillText(l, 40, 70 + i * (size + 6)))
  let y = 70 + tl.length * (size + 6) - 16
  ctx.fillStyle = '#6b5a36'
  ctx.font = `italic 400 25px ${SERIF}`
  wrap(ctx, opts.meta, w - 80).slice(0, 2).forEach((l, i) => ctx.fillText(l, 40, y + 34 + i * 30))
  if (opts.body) {
    ctx.fillStyle = '#3b352a'
    ctx.font = `400 22px ${SERIF}`
    wrap(ctx, opts.body, w - 80).slice(0, 4).forEach((l, i) => ctx.fillText(l, 40, y + 110 + i * 28))
  }
  return toTexture(c)
}

/** Painel principal da sala (parede do fundo) */
export function muralTexture(opts: {
  num: number; title: string; tagline: string; stack: string[]; descricao: string; color: string
}): THREE.CanvasTexture {
  const { num, title, tagline, stack, descricao, color } = opts
  const c = document.createElement('canvas')
  c.width = 1536; c.height = 864
  const ctx = c.getContext('2d')!

  ctx.fillStyle = '#0f1218'
  ctx.fillRect(0, 0, c.width, c.height)
  const g = ctx.createLinearGradient(0, 0, c.width, c.height)
  g.addColorStop(0, color + '40'); g.addColorStop(1, 'transparent')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, c.width, c.height)
  ctx.strokeStyle = GOLD; ctx.lineWidth = 3
  ctx.strokeRect(40, 40, c.width - 80, c.height - 80)

  ctx.fillStyle = GOLD
  ctx.font = `500 30px ${SERIF}`
  ctx.fillText(`SALA ${String(num).padStart(2, '0')}  ·  COLEÇÃO PERMANENTE`, 90, 110)

  ctx.fillStyle = '#f1e9d6'
  ctx.font = `700 78px ${SERIF}`
  const tl = wrap(ctx, title, c.width - 180).slice(0, 2)
  tl.forEach((l, i) => ctx.fillText(l, 90, 210 + i * 90))

  let y = 210 + tl.length * 90
  ctx.fillStyle = color
  ctx.font = `italic 400 40px ${SERIF}`
  ctx.fillText(tagline, 90, y)

  y += 64
  ctx.fillStyle = '#a9a496'
  ctx.font = `400 32px ${SERIF}`
  const short = descricao.length > 200 ? descricao.slice(0, 197).trimEnd() + '…' : descricao
  wrap(ctx, short, c.width - 180).slice(0, 4).forEach((l, i) => ctx.fillText(l, 90, y + i * 44))

  let x = 90; let cy = c.height - 120
  ctx.font = '500 26px monospace'
  for (const s of stack.slice(0, 9)) {
    const w = ctx.measureText(s).width + 32
    if (x + w > c.width - 90) { x = 90; cy += 52 }
    if (cy > c.height - 66) break
    ctx.strokeStyle = GOLD + 'aa'; ctx.lineWidth = 2
    ctx.strokeRect(x, cy - 32, w, 44)
    ctx.fillStyle = '#f1e9d6'
    ctx.fillText(s, x + 16, cy)
    x += w + 14
  }
  return toTexture(c)
}
