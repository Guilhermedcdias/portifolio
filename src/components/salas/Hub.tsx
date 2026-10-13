'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { rooms, type Room } from './rooms'
import { doorLabelTexture } from './textures'

const RADIUS = 13
const EYE = 1.7
const STEP = (Math.PI * 2) / rooms.length

export const roomAngle = (index: number) => index * STEP

function Door({ room, hovered, onHover, onPick }: {
  room: Room; hovered: boolean; onHover: (id: string | null) => void; onPick: (r: Room) => void
}) {
  const a = roomAngle(room.index)
  const glow = useRef<THREE.MeshStandardMaterial>(null)
  const label = useMemo(() => doorLabelTexture(room.index + 1, room.title, room.color), [room])
  useEffect(() => () => label.dispose(), [label])

  useFrame((_, dt) => {
    if (!glow.current) return
    glow.current.emissiveIntensity = THREE.MathUtils.damp(glow.current.emissiveIntensity, hovered ? 0.9 : 0.22, 8, dt)
  })

  return (
    <group position={[Math.sin(a) * RADIUS, 0, -Math.cos(a) * RADIUS]} rotation={[0, -a, 0]}>
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[2.9, 4.2, 0.3]} />
        <meshStandardMaterial color="#2a3441" roughness={0.6} />
      </mesh>
      <mesh
        position={[0, 1.85, 0.17]}
        onPointerOver={(e) => { e.stopPropagation(); onHover(room.id); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { onHover(null); document.body.style.cursor = '' }}
        onClick={(e: ThreeEvent<MouseEvent>) => { if (e.delta > 6) return; e.stopPropagation(); onPick(room) }}
      >
        <boxGeometry args={[2.3, 3.7, 0.08]} />
        <meshStandardMaterial ref={glow} color={room.color} emissive={room.color} emissiveIntensity={0.22} roughness={0.4} />
      </mesh>
      <mesh position={[0.75, 1.8, 0.24]}><sphereGeometry args={[0.07, 12, 12]} /><meshStandardMaterial color="#e6edf3" metalness={0.9} roughness={0.2} /></mesh>
      <mesh position={[0, 4.55, 0.1]}>
        <planeGeometry args={[2.8, 0.875]} />
        <meshBasicMaterial map={label} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 2, 1.2]} color={room.color} intensity={hovered ? 60 : 25} distance={9} />
    </group>
  )
}

export default function Hub({ initialYaw, enteringId, onPick, onArrived }: {
  initialYaw: number
  enteringId: string | null
  onPick: (r: Room) => void
  onArrived: (r: Room) => void
}) {
  const { camera, gl } = useThree()
  const yaw = useRef(initialYaw)
  const vel = useRef(0)
  const dist = useRef(0)
  const idle = useRef(0)
  const keys = useRef({ l: false, r: false })
  const drag = useRef<{ x: number } | null>(null)
  const arrived = useRef(false)
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => { arrived.current = false; dist.current = 0 }, [enteringId])

  useEffect(() => {
    const el = gl.domElement
    const down = (e: PointerEvent) => { drag.current = { x: e.clientX }; idle.current = 0 }
    const move = (e: PointerEvent) => {
      if (!drag.current) return
      const dx = e.clientX - drag.current.x
      drag.current.x = e.clientX
      vel.current = -dx * 0.004 * 60
      yaw.current -= dx * 0.004
    }
    const up = () => { drag.current = null }
    const wheel = (e: WheelEvent) => { yaw.current += e.deltaY * 0.0015; idle.current = 0 }
    const kd = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keys.current.l = true
      if (e.key === 'ArrowRight' || e.key === 'd') keys.current.r = true
    }
    const ku = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keys.current.l = false
      if (e.key === 'ArrowRight' || e.key === 'd') keys.current.r = false
    }
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    el.addEventListener('wheel', wheel, { passive: true })
    window.addEventListener('keydown', kd)
    window.addEventListener('keyup', ku)
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      el.removeEventListener('wheel', wheel)
      window.removeEventListener('keydown', kd)
      window.removeEventListener('keyup', ku)
      document.body.style.cursor = ''
    }
  }, [gl])

  useFrame((_, dt) => {
    const target = enteringId ? rooms.find(r => r.id === enteringId) : null
    if (target) {
      // gira até a porta escolhida e caminha até ela
      const ta = roomAngle(target.index)
      let diff = ((ta - yaw.current + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI
      yaw.current += diff * Math.min(1, dt * 6)
      if (Math.abs(diff) < 0.12) dist.current = Math.min(RADIUS - 2.2, dist.current + dt * 14)
      if (!arrived.current && dist.current >= RADIUS - 2.3) { arrived.current = true; onArrived(target) }
    } else {
      idle.current += dt
      if (keys.current.l) yaw.current -= dt * 1.4
      if (keys.current.r) yaw.current += dt * 1.4
      if (!drag.current) {
        yaw.current += vel.current * dt
        vel.current *= 0.92
        if (idle.current > 4) yaw.current += dt * 0.08
      }
      dist.current = Math.max(0, dist.current - dt * 10)
    }
    const d = dist.current
    camera.position.set(Math.sin(yaw.current) * d, EYE + Math.sin(performance.now() / 900) * 0.015, -Math.cos(yaw.current) * d)
    camera.lookAt(camera.position.x + Math.sin(yaw.current), EYE - 0.1, camera.position.z - Math.cos(yaw.current))
  })

  return (
    <>
      <color attach="background" args={['#080B10']} />
      <fog attach="fog" args={['#080B10', 20, 45]} />
      <ambientLight intensity={1.6} />
      <hemisphereLight args={['#5b8bb5', '#1a2230', 1.8]} />
      <pointLight position={[0, 5, 0]} intensity={200} distance={40} decay={1.5} color="#9fdcff" />

      {/* piso */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[RADIUS + 1, 64]} />
        <meshStandardMaterial color="#151c27" roughness={0.55} metalness={0.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[2.4, 2.5, 64]} />
        <meshBasicMaterial color="#00C2FF" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[RADIUS - 0.6, RADIUS - 0.5, 96]} />
        <meshBasicMaterial color="#7C3AED" />
      </mesh>
      {/* parede curva + teto */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[RADIUS + 1, RADIUS + 1, 6.5, 96, 1, true]} />
        <meshStandardMaterial color="#1c2634" side={THREE.BackSide} roughness={0.9} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6.2, 0]}>
        <circleGeometry args={[RADIUS + 1, 64]} />
        <meshStandardMaterial color="#080B10" side={THREE.DoubleSide} />
      </mesh>

      <Sparkles count={90} scale={[RADIUS * 1.6, 5, RADIUS * 1.6]} position={[0, 3, 0]} size={2.5} speed={0.3} color="#00C2FF" />

      {rooms.map(r => (
        <Door key={r.id} room={r} hovered={hovered === r.id} onHover={setHovered} onPick={onPick} />
      ))}
    </>
  )
}
