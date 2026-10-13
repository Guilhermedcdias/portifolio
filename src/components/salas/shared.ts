import * as THREE from 'three'

/** PRNG determinístico (mulberry32): mesma sala => mesma arte, sempre. */
export function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const GOLD = '#c9a24b'
export const IVORY = '#efe8d8'
export const SERIF = 'Georgia, "Times New Roman", serif'

function canvas(w: number, h = w) {
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  return { c, ctx: c.getContext('2d')! }
}

function tex(c: HTMLCanvasElement, repeat = false, srgb = true) {
  const t = new THREE.CanvasTexture(c)
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping
  return t
}

/** Veios de mármore sobre uma base. */
function marbleInto(ctx: CanvasRenderingContext2D, size: number, seed: number, base: string, vein: string, strength = 1) {
  const r = rng(seed)
  ctx.fillStyle = base
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 14; i++) {
    const g = ctx.createRadialGradient(r() * size, r() * size, 0, r() * size, r() * size, size * (0.2 + r() * 0.4))
    g.addColorStop(0, `rgba(${vein},${0.05 * strength})`)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
  }
  for (let i = 0; i < 26; i++) {
    let x = r() * size, y = r() * size
    let ang = r() * Math.PI * 2
    ctx.beginPath(); ctx.moveTo(x, y)
    const len = 14 + r() * 28
    for (let s = 0; s < len; s++) {
      ang += (r() - 0.5) * 0.9
      x += Math.cos(ang) * (size / 60); y += Math.sin(ang) * (size / 60)
      ctx.lineTo(x, y)
    }
    ctx.strokeStyle = `rgba(${vein},${(0.08 + r() * 0.22) * strength})`
    ctx.lineWidth = 0.4 + r() * 2.2
    ctx.stroke()
  }
}

// ---- singletons compartilhados (nunca descartados) ----
const cache: Record<string, THREE.CanvasTexture> = {}
const once = (k: string, f: () => THREE.CanvasTexture) => (cache[k] ??= f())

export const marbleTex = () => once('marble', () => {
  const { c, ctx } = canvas(1024)
  marbleInto(ctx, 1024, 11, '#ece7dc', '70,72,84')
  return tex(c, true)
})

export const darkMarbleTex = () => once('darkMarble', () => {
  const { c, ctx } = canvas(1024)
  marbleInto(ctx, 1024, 23, '#1d1f24', '200,190,160', 0.9)
  return tex(c, true)
})

export const parquetTex = () => once('parquet', () => {
  const { c, ctx } = canvas(1024)
  const r = rng(5)
  ctx.fillStyle = '#5a3a22'; ctx.fillRect(0, 0, 1024, 1024)
  const pw = 64, pl = 256
  for (let row = 0; row < 1024 / pw; row++) {
    const off = (row % 2) * (pl / 2) + r() * 40
    for (let col = -1; col < 1024 / pl + 1; col++) {
      const x = col * pl + off, y = row * pw
      const l = 26 + r() * 10
      ctx.fillStyle = `hsl(${24 + r() * 6},${48 + r() * 10}%,${l}%)`
      ctx.fillRect(x + 1, y + 1, pl - 2, pw - 2)
      ctx.strokeStyle = `rgba(0,0,0,0.12)`
      ctx.lineWidth = 1
      for (let g = 0; g < 6; g++) {
        const gy = y + 6 + r() * (pw - 12)
        ctx.beginPath(); ctx.moveTo(x + 2, gy); ctx.bezierCurveTo(x + pl * 0.3, gy + (r() - 0.5) * 6, x + pl * 0.7, gy + (r() - 0.5) * 6, x + pl - 2, gy); ctx.stroke()
      }
    }
  }
  return tex(c, true)
})

/** Papel de parede de seda (cinza claro: a cor vem do material). */
export const wallpaperTex = () => once('wallpaper', () => {
  const { c, ctx } = canvas(512)
  ctx.fillStyle = '#e6e6e6'; ctx.fillRect(0, 0, 512, 512)
  for (let x = 0; x < 512; x += 64) {
    ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(x, 0, 28, 512)
  }
  ctx.strokeStyle = 'rgba(0,0,0,0.09)'; ctx.lineWidth = 2
  for (let y = 0; y < 512; y += 128) for (let x = 0; x < 512; x += 128) {
    ctx.beginPath()
    ctx.moveTo(x + 64, y + 14); ctx.lineTo(x + 114, y + 64); ctx.lineTo(x + 64, y + 114); ctx.lineTo(x + 14, y + 64); ctx.closePath()
    ctx.stroke()
    ctx.beginPath(); ctx.arc(x + 64, y + 64, 9, 0, Math.PI * 2); ctx.stroke()
  }
  return tex(c, true)
})

/** Lambril de madeira com almofadas (tile quadrado). */
export const wainscotTex = () => once('wainscot', () => {
  const { c, ctx } = canvas(512)
  ctx.fillStyle = '#2d2018'; ctx.fillRect(0, 0, 512, 512)
  const r = rng(9)
  for (let i = 0; i < 90; i++) {
    ctx.strokeStyle = `rgba(255,220,170,${0.02 + r() * 0.04})`
    ctx.beginPath(); const y = r() * 512; ctx.moveTo(0, y); ctx.lineTo(512, y + (r() - 0.5) * 20); ctx.stroke()
  }
  const p = 40
  ctx.fillStyle = 'rgba(255,230,190,0.18)'; ctx.fillRect(p, p, 512 - p * 2, 6); ctx.fillRect(p, p, 6, 512 - p * 2)
  ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(p, 512 - p - 6, 512 - p * 2, 6); ctx.fillRect(512 - p - 6, p, 6, 512 - p * 2)
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(p + 6, p + 6, 512 - p * 2 - 12, 512 - p * 2 - 12)
  return tex(c, true)
})

/** Mosaico polar do saguão: anéis, setores alternados e estrela dourada. */
export const hubFloorTex = (sectors: number) => once('hubFloor', () => {
  const S = 2048, R = S / 2
  const { c, ctx } = canvas(S)
  marbleInto(ctx, S, 31, '#ece7dc', '70,72,84')
  const dark = canvas(S)
  marbleInto(dark.ctx, S, 47, '#1d1f24', '200,190,160', 0.9)
  const bands = [0.18, 0.4, 0.62, 0.8, 0.93, 1]
  let inner = 0
  bands.forEach((outer, bi) => {
    const n = sectors * 2
    for (let s = 0; s < n; s++) {
      if ((s + bi) % 2) continue
      const a0 = (s / n) * Math.PI * 2 - Math.PI / 2 - Math.PI / sectors / 1
      const a1 = a0 + (Math.PI * 2) / n
      ctx.save()
      ctx.beginPath()
      ctx.arc(R, R, outer * R, a0, a1); ctx.arc(R, R, inner * R, a1, a0, true); ctx.closePath()
      ctx.clip()
      ctx.drawImage(dark.c, 0, 0)
      ctx.restore()
    }
    inner = outer
  })
  ctx.strokeStyle = GOLD; ctx.lineWidth = 6
  bands.forEach((b) => { ctx.beginPath(); ctx.arc(R, R, b * R - 3, 0, Math.PI * 2); ctx.stroke() })
  ctx.lineWidth = 3
  for (let s = 0; s < sectors; s++) {
    const a = (s / sectors) * Math.PI * 2 - Math.PI / 2
    ctx.beginPath(); ctx.moveTo(R + Math.cos(a) * R * 0.18, R + Math.sin(a) * R * 0.18); ctx.lineTo(R + Math.cos(a) * R * 0.93, R + Math.sin(a) * R * 0.93); ctx.stroke()
  }
  // rosa dos ventos central
  ctx.fillStyle = GOLD
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2, len = k % 2 ? 0.1 : 0.17, w = 0.025
    ctx.beginPath()
    ctx.moveTo(R + Math.cos(a) * R * len, R + Math.sin(a) * R * len)
    ctx.lineTo(R + Math.cos(a + 1.57) * R * w, R + Math.sin(a + 1.57) * R * w)
    ctx.lineTo(R + Math.cos(a - 1.57) * R * w, R + Math.sin(a - 1.57) * R * w)
    ctx.closePath(); ctx.fill()
  }
  return tex(c)
})

/** Gradiente radial branco -> transparente (decalques de luz, tinta pelo material). */
export const glowTex = () => once('glow', () => {
  const { c, ctx } = canvas(256)
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.4, 'rgba(255,255,255,0.35)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256)
  return tex(c)
})

/** Cor da parede de uma sala: a cor do projeto, escurecida e dessaturada. */
export function wallTint(color: string): string {
  const c = new THREE.Color(color)
  const hsl = { h: 0, s: 0, l: 0 }
  c.getHSL(hsl)
  return '#' + new THREE.Color().setHSL(hsl.h, 0.45, 0.2).getHexString()
}

/** Paleta de arte derivada da cor do projeto. */
export function artPalette(color: string): string[] {
  const hsl = { h: 0, s: 0, l: 0 }
  new THREE.Color(color).getHSL(hsl)
  const mk = (dh: number, s: number, l: number) => '#' + new THREE.Color().setHSL((hsl.h + dh + 1) % 1, s, l).getHexString()
  return [mk(0, 0.75, 0.55), mk(0.08, 0.7, 0.6), mk(-0.08, 0.65, 0.35), mk(0.5, 0.6, 0.5), '#f1e9d6', '#14161c']
}
