import * as THREE from 'three'

function fontFamily(): string {
  try {
    const v = getComputedStyle(document.body).getPropertyValue('--font-syne').trim()
    if (v) return `${v}, system-ui, sans-serif`
  } catch { /* ignora */ }
  return 'system-ui, sans-serif'
}

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

/** Placa acima de cada porta do saguão */
export function doorLabelTexture(num: number, title: string, color: string): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 512; c.height = 160
  const ctx = c.getContext('2d')!
  ctx.fillStyle = 'rgba(8,11,16,0.92)'
  ctx.fillRect(0, 0, c.width, c.height)
  ctx.strokeStyle = color; ctx.lineWidth = 4
  ctx.strokeRect(2, 2, c.width - 4, c.height - 4)
  ctx.fillStyle = color
  ctx.font = '600 26px monospace'
  ctx.fillText(`SALA ${String(num).padStart(2, '0')}`, 24, 44)
  ctx.fillStyle = '#e6edf3'
  ctx.font = `700 32px ${fontFamily()}`
  wrap(ctx, title, c.width - 48).slice(0, 2).forEach((l, i) => ctx.fillText(l, 24, 88 + i * 38))
  return toTexture(c)
}

/** Mural da parede de fundo de cada sala */
export function muralTexture(opts: {
  num: number; title: string; tagline: string; stack: string[]; descricao: string; color: string
}): THREE.CanvasTexture {
  const { num, title, tagline, stack, descricao, color } = opts
  const c = document.createElement('canvas')
  c.width = 1536; c.height = 864
  const ctx = c.getContext('2d')!
  const fam = fontFamily()

  ctx.fillStyle = '#0d1117'
  ctx.fillRect(0, 0, c.width, c.height)
  const g = ctx.createLinearGradient(0, 0, c.width, c.height)
  g.addColorStop(0, color + '33'); g.addColorStop(1, 'transparent')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, c.width, c.height)
  ctx.strokeStyle = color; ctx.lineWidth = 6
  ctx.strokeRect(24, 24, c.width - 48, c.height - 48)

  ctx.fillStyle = color
  ctx.font = '600 34px monospace'
  ctx.fillText(`// sala ${String(num).padStart(2, '0')}`, 80, 100)

  ctx.fillStyle = '#e6edf3'
  ctx.font = `800 82px ${fam}`
  const tl = wrap(ctx, title, c.width - 160).slice(0, 2)
  tl.forEach((l, i) => ctx.fillText(l, 80, 200 + i * 94))

  let y = 200 + tl.length * 94 + 10
  ctx.fillStyle = color
  ctx.font = `italic 500 40px ${fam}`
  ctx.fillText(tagline, 80, y)

  y += 70
  ctx.fillStyle = '#8b949e'
  ctx.font = '400 34px system-ui, sans-serif'
  const short = descricao.length > 190 ? descricao.slice(0, 187).trimEnd() + '…' : descricao
  wrap(ctx, short, c.width - 160).slice(0, 4).forEach((l, i) => ctx.fillText(l, 80, y + i * 46))

  // chips de tecnologia
  let x = 80; let cy = c.height - 130
  ctx.font = '500 28px monospace'
  for (const s of stack.slice(0, 9)) {
    const w = ctx.measureText(s).width + 36
    if (x + w > c.width - 80) { x = 80; cy += 56 }
    if (cy > c.height - 70) break
    ctx.fillStyle = color + '22'
    ctx.fillRect(x, cy - 34, w, 46)
    ctx.strokeStyle = color + '88'; ctx.lineWidth = 2
    ctx.strokeRect(x, cy - 34, w, 46)
    ctx.fillStyle = '#e6edf3'
    ctx.fillText(s, x + 18, cy)
    x += w + 14
  }
  return toTexture(c)
}
