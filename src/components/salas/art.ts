import * as THREE from 'three'
import { rng } from './shared'

export const ART_STYLES = [
  'mondrian', 'rothko', 'kandinsky', 'flow', 'riley', 'nebula', 'bauhaus', 'seurat', 'pixel', 'topo',
] as const
export type ArtStyle = typeof ART_STYLES[number]

const TITLES: Record<ArtStyle, string[]> = {
  mondrian: ['Cidade em Grade', 'Mapa do Bairro Antigo', 'Janelas de Domingo', 'Planta Baixa de um Sonho', 'Quarteirão Azul', 'Persianas ao Meio-dia'],
  rothko: ['Hora Dourada', 'Silêncio em Duas Cores', 'Maré Baixa', 'Porta para o Entardecer', 'Meditação nº 3', 'Horizonte de Âmbar'],
  kandinsky: ['Ressonância', 'Órbitas de Verão', 'Música para os Olhos', 'Sino Distante', 'Confete Cósmico', 'Eco em Círculos'],
  flow: ['Correnteza', 'Ventos de Outubro', 'Cabelos do Rio', 'Mapa dos Ventos', 'Seda em Movimento', 'Maré de Fios'],
  riley: ['Vibração', 'Onda Contínua', 'Miragem', 'Corda Bamba', 'Zebra ao Entardecer', 'Febre Ótica'],
  nebula: ['Berço das Estrelas', 'Jardim Interestelar', 'Noite em Saturno', 'Poeira de Cometa', 'Fronteira Lunar', 'Sonho de Astrônomo'],
  bauhaus: ['Arcos e Quadrantes', 'Ateliê de Domingo', 'Oficina de Formas', 'Jogo de Blocos', 'Alfabeto Geométrico', 'Arquitetura Alegre'],
  seurat: ['Tarde na Ilha', 'Piquenique ao Sol', 'Campos de Março', 'Verão em Pontos', 'Praia Pontilhada', 'Lago ao Meio-dia'],
  pixel: ['Jardim de Azulejos', 'Vitral de Bolso', 'Ladrilhos de Inverno', 'Colcha de Retalhos', 'Tapete de Lisboa', 'Mosaico da Memória'],
  topo: ['Relevo Íntimo', 'Cartografia de um Domingo', 'Colina Imaginária', 'Ilha dos Ventos', 'Curvas do Vale', 'Carta de Navegação'],
}

const TECHNIQUES: Record<ArtStyle, string> = {
  mondrian: 'Acrílica sobre tela',
  rothko: 'Óleo sobre linho',
  kandinsky: 'Guache sobre papel',
  flow: 'Nanquim sobre papel',
  riley: 'Tinta acrílica sobre tela',
  nebula: 'Óleo sobre tela',
  bauhaus: 'Colagem sobre madeira',
  seurat: 'Óleo sobre tela',
  pixel: 'Esmalte sobre painel',
  topo: 'Nanquim e aquarela',
}

export const artTitle = (style: ArtStyle, seed: number) => TITLES[style][seed % TITLES[style].length]
export const artMeta = (style: ArtStyle, seed: number) => `${TECHNIQUES[style]}, ${1962 + (seed * 7) % 58}`

type Ctx = CanvasRenderingContext2D
type R = () => number
const pick = <T,>(r: R, a: T[]) => a[Math.floor(r() * a.length)]

function mondrian(ctx: Ctx, w: number, h: number, p: string[], r: R) {
  ctx.fillStyle = p[4]; ctx.fillRect(0, 0, w, h)
  const lw = Math.max(8, w * 0.014)
  const fills = [p[0], p[1], p[2], p[3], p[4], p[4], p[4]]
  const rects: [number, number, number, number][] = []
  const split = (x: number, y: number, ww: number, hh: number, d: number) => {
    if (d <= 0 || ww < w * 0.18 || hh < h * 0.18 || (d < 3 && r() < 0.15)) { rects.push([x, y, ww, hh]); return }
    if (ww / w > hh / h ? true : r() < 0.25) { const s = ww * (0.3 + r() * 0.4); split(x, y, s, hh, d - 1); split(x + s, y, ww - s, hh, d - 1) }
    else { const s = hh * (0.3 + r() * 0.4); split(x, y, ww, s, d - 1); split(x, y + s, ww, hh - s, d - 1) }
  }
  split(0, 0, w, h, 4)
  rects.forEach(([x, y, ww, hh]) => { ctx.fillStyle = pick(r, fills); ctx.fillRect(x, y, ww, hh) })
  ctx.strokeStyle = p[5]; ctx.lineWidth = lw
  rects.forEach(([x, y, ww, hh]) => ctx.strokeRect(x, y, ww, hh))
}

function rothko(ctx: Ctx, w: number, h: number, p: string[], r: R) {
  ctx.fillStyle = p[2]; ctx.fillRect(0, 0, w, h)
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, p[5] + '55'); g.addColorStop(1, 'transparent')
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)
  const blocks: [string, number, number][] = [[p[0], 0.1, 0.4], [p[1], 0.52, 0.38]]
  if (r() > 0.5) blocks.push([p[3], 0.0, 0.0])
  blocks.forEach(([c, y0, hh]) => {
    if (!hh) return
    ctx.save()
    ctx.shadowColor = c; ctx.shadowBlur = w * 0.06
    ctx.fillStyle = c
    ctx.fillRect(w * 0.1, h * y0, w * 0.8, h * hh)
    ctx.restore()
  })
}

function kandinsky(ctx: Ctx, w: number, h: number, p: string[], r: R) {
  ctx.fillStyle = r() > 0.5 ? p[4] : p[5]; ctx.fillRect(0, 0, w, h)
  for (let i = 0; i < 9; i++) {
    const x = r() * w, y = r() * h, R0 = w * (0.06 + r() * 0.18)
    for (let k = 5; k > 0; k--) {
      ctx.beginPath(); ctx.arc(x, y, (R0 * k) / 5, 0, Math.PI * 2)
      ctx.fillStyle = k % 2 ? pick(r, p.slice(0, 4)) : pick(r, [p[4], p[5]]); ctx.fill()
    }
  }
  ctx.strokeStyle = p[5]; ctx.lineWidth = w * 0.004
  for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.moveTo(r() * w, r() * h); ctx.lineTo(r() * w, r() * h); ctx.stroke() }
  for (let i = 0; i < 5; i++) {
    const x = r() * w, y = r() * h, s = w * (0.05 + r() * 0.08)
    ctx.fillStyle = pick(r, p.slice(0, 4)); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + s, y + s * 0.4); ctx.lineTo(x + s * 0.3, y - s); ctx.closePath(); ctx.fill()
  }
}

function flow(ctx: Ctx, w: number, h: number, p: string[], r: R) {
  ctx.fillStyle = p[5]; ctx.fillRect(0, 0, w, h)
  const f1 = 2 + r() * 3, f2 = 2 + r() * 3, ph = r() * 6
  const ang = (x: number, y: number) => Math.sin((x / w) * f1 * Math.PI + ph) * 2 + Math.cos((y / h) * f2 * Math.PI) * 2
  ctx.lineWidth = Math.max(1, w * 0.0018)
  for (let i = 0; i < 1100; i++) {
    let x = r() * w, y = r() * h
    ctx.strokeStyle = pick(r, [p[0], p[1], p[3], p[4], p[0]]) + '99'
    ctx.beginPath(); ctx.moveTo(x, y)
    for (let s = 0; s < 70; s++) { const a = ang(x, y); x += Math.cos(a) * (w / 220); y += Math.sin(a) * (w / 220); ctx.lineTo(x, y) }
    ctx.stroke()
  }
}

function riley(ctx: Ctx, w: number, h: number, p: string[], r: R) {
  ctx.fillStyle = p[4]; ctx.fillRect(0, 0, w, h)
  const n = 26, A = h * (0.025 + r() * 0.025), f = 3 + r() * 3, g = 2 + r() * 2
  const wave = (x: number, i: number) => (i / n) * h + A * Math.sin((x / w) * f * Math.PI * 2 + (i / n) * g * Math.PI) * (0.4 + (x / w))
  for (let i = -1; i < n; i += 2) {
    ctx.beginPath()
    for (let x = 0; x <= w; x += 6) { const y = wave(x, i); x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y) }
    for (let x = w; x >= 0; x -= 6) ctx.lineTo(x, wave(x, i + 1))
    ctx.closePath()
    ctx.fillStyle = i % 8 === 5 ? p[0] : p[5]; ctx.fill()
  }
}

function nebula(ctx: Ctx, w: number, h: number, p: string[], r: R) {
  ctx.fillStyle = '#05060b'; ctx.fillRect(0, 0, w, h)
  ctx.globalCompositeOperation = 'lighter'
  for (let i = 0; i < 9; i++) {
    const x = r() * w, y = r() * h, rad = w * (0.25 + r() * 0.35)
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad)
    g.addColorStop(0, pick(r, p.slice(0, 4)) + '66'); g.addColorStop(1, 'transparent')
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)
  }
  ctx.globalCompositeOperation = 'source-over'
  for (let i = 0; i < 380; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.2 + r() * 0.8})`
    ctx.beginPath(); ctx.arc(r() * w, r() * h, r() * 1.8 + 0.3, 0, Math.PI * 2); ctx.fill()
  }
  const px = w * (0.3 + r() * 0.4), py = h * (0.3 + r() * 0.4), pr = w * 0.09
  const pg = ctx.createRadialGradient(px - pr * 0.4, py - pr * 0.4, pr * 0.1, px, py, pr)
  pg.addColorStop(0, p[4]); pg.addColorStop(1, p[2])
  ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = p[4] + 'bb'; ctx.lineWidth = pr * 0.12
  ctx.beginPath(); ctx.ellipse(px, py, pr * 1.9, pr * 0.45, -0.4, 0, Math.PI * 2); ctx.stroke()
}

function bauhaus(ctx: Ctx, w: number, h: number, p: string[], r: R) {
  const cols = 4, rows = Math.max(3, Math.round((h / w) * cols))
  const tw = w / cols, th = h / rows
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    const x = i * tw, y = j * th
    ctx.fillStyle = pick(r, [p[4], p[5], p[2]]); ctx.fillRect(x, y, tw, th)
    ctx.fillStyle = pick(r, p.slice(0, 4))
    const t = Math.floor(r() * 4), rot = Math.floor(r() * 4)
    ctx.save(); ctx.translate(x + tw / 2, y + th / 2); ctx.rotate((rot * Math.PI) / 2)
    ctx.beginPath()
    if (t === 0) ctx.arc(-tw / 2, -th / 2, tw, 0, Math.PI / 2)
    else if (t === 1) ctx.arc(0, 0, tw * 0.4, 0, Math.PI * 2)
    else if (t === 2) ctx.rect(-tw / 2, -th / 2, tw / 2, th)
    else ctx.arc(0, th / 2, tw / 2, Math.PI, 0)
    if (t === 0) ctx.lineTo(-tw / 2, -th / 2)
    ctx.fill(); ctx.restore()
  }
}

function seurat(ctx: Ctx, w: number, h: number, p: string[], r: R) {
  ctx.fillStyle = p[4]; ctx.fillRect(0, 0, w, h)
  const horizon = h * 0.58, sx = w * (0.25 + r() * 0.5), sy = h * 0.3
  const hill = (x: number) => horizon + Math.sin((x / w) * 5 + 1) * h * 0.03
  for (let i = 0; i < 16000; i++) {
    const x = r() * w, y = r() * h
    let c: string
    const ds = Math.hypot(x - sx, y - sy)
    if (ds < w * 0.07) c = p[1]
    else if (y < hill(x)) c = r() < 0.5 + (1 - y / horizon) * 0.4 ? p[3] : p[4]
    else c = r() < 0.5 ? p[2] : p[0]
    ctx.fillStyle = c + (ds < w * 0.18 && y < hill(x) ? 'ff' : 'dd')
    ctx.beginPath(); ctx.arc(x, y, w * (0.0035 + r() * 0.003), 0, Math.PI * 2); ctx.fill()
  }
}

function pixel(ctx: Ctx, w: number, h: number, p: string[], r: R) {
  const n = 28, cs = w / n, rows = Math.ceil(h / cs)
  const ph1 = r() * 6, ph2 = r() * 6
  const ramp = [p[5], p[2], p[0], p[1], p[3], p[4]]
  for (let i = 0; i < n; i++) for (let j = 0; j < rows; j++) {
    const v = (Math.sin(i * 0.35 + ph1) + Math.cos(j * 0.4 + ph2) + Math.sin((i + j) * 0.2) + 3) / 6
    const idx = Math.min(ramp.length - 1, Math.floor((v + (r() - 0.5) * 0.12) * ramp.length))
    ctx.fillStyle = ramp[Math.max(0, idx)]
    ctx.fillRect(Math.floor(i * cs), Math.floor(j * cs), Math.ceil(cs), Math.ceil(cs))
  }
  const cx = Math.floor(n * (0.3 + r() * 0.4)), cy = Math.floor(rows * 0.35)
  ctx.fillStyle = p[4]
  for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) if (i * i + j * j <= 9) ctx.fillRect(Math.floor((cx + i) * cs), Math.floor((cy + j) * cs), Math.ceil(cs), Math.ceil(cs))
}

function topo(ctx: Ctx, w: number, h: number, p: string[], r: R) {
  ctx.fillStyle = p[4]; ctx.fillRect(0, 0, w, h)
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, p[0] + '55'); g.addColorStop(1, p[3] + '55')
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)
  for (let c = 0; c < 2; c++) {
    const cx = w * (0.25 + r() * 0.5), cy = h * (0.25 + r() * 0.5)
    const a1 = r() * 6, a2 = r() * 6, a3 = r() * 6
    for (let k = 1; k <= 22; k++) {
      const base = (w * k) / 26
      ctx.beginPath()
      for (let t = 0; t <= 120; t++) {
        const th = (t / 120) * Math.PI * 2
        const rad = base * (1 + 0.22 * Math.sin(3 * th + a1 + k * 0.08) + 0.12 * Math.sin(5 * th + a2) + 0.06 * Math.sin(9 * th + a3))
        const x = cx + Math.cos(th) * rad, y = cy + Math.sin(th) * rad * 0.8
        t === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.strokeStyle = p[5] + (k % 4 === 0 ? 'cc' : '55'); ctx.lineWidth = k % 4 === 0 ? w * 0.004 : w * 0.0018
      ctx.stroke()
    }
  }
}

const painters: Record<ArtStyle, (ctx: Ctx, w: number, h: number, p: string[], r: R) => void> = {
  mondrian, rothko, kandinsky, flow, riley, nebula, bauhaus, seurat, pixel, topo,
}

export function paintArt(style: ArtStyle, seed: number, palette: string[], aspect: number, base = 900): THREE.CanvasTexture {
  const w = aspect >= 1 ? base : Math.round(base * aspect)
  const h = aspect >= 1 ? Math.round(base / aspect) : base
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  painters[style](c.getContext('2d')!, w, h, palette, rng(seed * 7919 + 13))
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}
