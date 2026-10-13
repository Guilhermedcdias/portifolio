'use client'
import { useMemo } from 'react'
import * as THREE from 'three'
import { GOLD, glowTex } from './shared'

/** Latão/ouro: precisa do <Environment/> para não ficar preto */
export const Gold = ({ intensity = 1 }: { intensity?: number }) => (
  <meshStandardMaterial color={GOLD} metalness={1} roughness={0.32} envMapIntensity={intensity} />
)

/** Mancha de luz aditiva (barata): no chão, na parede, ao redor de luminárias */
export function GlowDecal({ color, size, position, rotation, opacity = 0.4 }: {
  color: string; size: [number, number]; position: [number, number, number]; rotation?: [number, number, number]; opacity?: number
}) {
  return (
    <mesh position={position} rotation={rotation} renderOrder={2}>
      <planeGeometry args={size} />
      <meshBasicMaterial map={glowTex()} color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

/** Moldura dourada ornamentada + passe-partout. Largura/altura = área da tela. */
export function FrameBox({ w, h, mat = 0.12 }: { w: number; h: number; mat?: number }) {
  const t = 0.14
  const parts = useMemo(() => ([
    { p: [0, h / 2 + mat + t / 2, 0], s: [w + 2 * (mat + t), t, 0.12] },
    { p: [0, -h / 2 - mat - t / 2, 0], s: [w + 2 * (mat + t), t, 0.12] },
    { p: [-w / 2 - mat - t / 2, 0, 0], s: [t, h + 2 * mat, 0.12] },
    { p: [w / 2 + mat + t / 2, 0, 0], s: [t, h + 2 * mat, 0.12] },
  ] as { p: [number, number, number]; s: [number, number, number] }[]), [w, h, mat])
  return (
    <group>
      {parts.map((q, i) => (
        <mesh key={i} position={q.p}><boxGeometry args={q.s} /><Gold /></mesh>
      ))}
      {/* friso interno */}
      {[[0, h / 2 + mat - 0.02, w + 2 * mat, 0.04], [0, -h / 2 - mat + 0.02, w + 2 * mat, 0.04]].map(([x, y, ww, hh], i) => (
        <mesh key={'i' + i} position={[x, y, 0.07]}><boxGeometry args={[ww, hh, 0.03]} /><Gold /></mesh>
      ))}
      <mesh position={[0, 0, -0.01]}><boxGeometry args={[w + 2 * mat, h + 2 * mat, 0.05]} /><meshStandardMaterial color="#f3ecdc" roughness={0.95} /></mesh>
    </group>
  )
}

/** Luminária de quadro + cone de luz no quadro (decalque aditivo) */
export function PictureLight({ w, h }: { w: number; h: number }) {
  return (
    <group position={[0, h / 2 + 0.42, 0]}>
      <mesh position={[0, 0, 0.12]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.035, 0.035, Math.min(w * 0.6, 1.1), 12]} /><Gold /></mesh>
      <mesh position={[0, -0.05, 0.05]}><boxGeometry args={[0.03, 0.03, 0.14]} /><Gold /></mesh>
      <mesh position={[0, 0.02, 0.2]}><boxGeometry args={[Math.min(w * 0.5, 0.9), 0.012, 0.012]} /><meshBasicMaterial color="#fff2cf" toneMapped={false} /></mesh>
      <GlowDecal color="#ffe2a8" size={[w * 1.9, h * 1.5]} position={[0, -h / 2 - 0.1, -0.02]} opacity={0.22} />
    </group>
  )
}

/** Poste com corda de veludo; usado em anel ao redor da escultura */
export function Stanchions({ radius, count, color = '#7a1022' }: { radius: number; count: number; color?: string }) {
  const posts = useMemo(() => Array.from({ length: count }).map((_, i) => {
    const a = (i / count) * Math.PI * 2
    return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius)
  }), [radius, count])
  const ropes = useMemo(() => posts.map((p, i) => {
    const q = posts[(i + 1) % count]
    const a = p.clone().setY(0.82), b = q.clone().setY(0.82)
    const m = a.clone().add(b).multiplyScalar(0.5).setY(0.66)
    return new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, m, b), 16, 0.028, 8)
  }), [posts, count])
  return (
    <group>
      {posts.map((p, i) => (
        <group key={i} position={p}>
          <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.15, 0.17, 0.06, 20]} /><Gold /></mesh>
          <mesh position={[0, 0.45, 0]}><cylinderGeometry args={[0.025, 0.03, 0.85, 12]} /><Gold /></mesh>
          <mesh position={[0, 0.88, 0]}><sphereGeometry args={[0.06, 16, 16]} /><Gold /></mesh>
          <mesh geometry={ropes[i]} position={[-p.x, 0, -p.z]}><meshStandardMaterial color={color} roughness={0.8} /></mesh>
        </group>
      ))}
    </group>
  )
}

/** Banco de couro para contemplação */
export function Bench({ position, length = 2.6 }: { position: [number, number, number]; length?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.42, 0]}><boxGeometry args={[length, 0.16, 0.7]} /><meshStandardMaterial color="#2a1b14" roughness={0.55} /></mesh>
      <mesh position={[0, 0.34, 0]}><boxGeometry args={[length - 0.1, 0.06, 0.62]} /><Gold /></mesh>
      {[-length / 2 + 0.2, length / 2 - 0.2].map((x) => (
        <mesh key={x} position={[x, 0.17, 0]}><boxGeometry args={[0.1, 0.34, 0.55]} /><Gold /></mesh>
      ))}
    </group>
  )
}

export function archShape(w: number, h: number) {
  const s = new THREE.Shape()
  s.moveTo(-w / 2, 0)
  s.lineTo(-w / 2, h - w / 2)
  s.absarc(0, h - w / 2, w / 2, Math.PI, 0, true)
  s.lineTo(w / 2, 0)
  s.closePath()
  return s
}

export function portalTexture(color: string) {
  const c = document.createElement('canvas')
  c.width = 256; c.height = 512
  const ctx = c.getContext('2d')!
  const g = ctx.createLinearGradient(0, 0, 0, 512)
  g.addColorStop(0, '#0b0e14'); g.addColorStop(1, '#1b2130')
  ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 512)
  const r = ctx.createRadialGradient(128, 400, 10, 128, 380, 330)
  r.addColorStop(0, color + 'ee'); r.addColorStop(0.5, color + '55'); r.addColorStop(1, 'transparent')
  ctx.fillStyle = r; ctx.fillRect(0, 0, 256, 512)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

