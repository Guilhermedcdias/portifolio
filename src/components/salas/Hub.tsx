'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Environment, Lightformer, MeshReflectorMaterial, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { rooms, type Room } from './rooms'
import { doorLabelTexture } from './textures'
import { hubFloorTex, marbleTex, wainscotTex, wallpaperTex } from './shared'
import { Gold, GlowDecal, archShape, portalTexture } from './museum'

const WALL_R = 14
const WALL_H = 6.5
const EYE = 1.7
const STEP = (Math.PI * 2) / rooms.length
const STOP = WALL_R - 3.1 // distância final da câmera ao entrar

export const roomAngle = (index: number) => index * STEP

const DOOR_W = 2.3
const DOOR_H = 3.6

function Door({ room, hovered, onHover, onPick }: {
  room: Room; hovered: boolean; onHover: (id: string | null) => void; onPick: (r: Room) => void
}) {
  const a = roomAngle(room.index)
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  const label = useMemo(() => doorLabelTexture(room.index + 1, room.title), [room])
  const portal = useMemo(() => portalTexture(room.color), [room])
  useEffect(() => () => { label.dispose(); portal.dispose() }, [label, portal])

  const frameGeo = useMemo(() => new THREE.ExtrudeGeometry(archShape(DOOR_W + 0.55, DOOR_H + 0.28), { depth: 0.3, bevelEnabled: false }), [])
  const portalGeo = useMemo(() => {
    const g = new THREE.ShapeGeometry(archShape(DOOR_W, DOOR_H), 24)
    const uv = g.attributes.uv, pos = g.attributes.position
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (pos.getX(i) + DOOR_W / 2) / DOOR_W, pos.getY(i) / DOOR_H)
    return g
  }, [])
  useEffect(() => () => { frameGeo.dispose(); portalGeo.dispose() }, [frameGeo, portalGeo])

  useFrame((_, dt) => {
    if (!matRef.current) return
    const k = THREE.MathUtils.damp(matRef.current.color.r, hovered ? 1.35 : 0.8, 8, dt)
    matRef.current.color.setScalar(k)
  })

  return (
    <group position={[Math.sin(a) * (WALL_R - 0.15), 0, -Math.cos(a) * (WALL_R - 0.15)]} rotation={[0, -a, 0]}>
      <mesh geometry={frameGeo} position={[0, 0, -0.3]}><Gold /></mesh>
      <mesh
        geometry={portalGeo}
        position={[0, 0.02, 0.02]}
        onPointerOver={(e) => { e.stopPropagation(); onHover(room.id); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { onHover(null); document.body.style.cursor = '' }}
        onClick={(e: ThreeEvent<MouseEvent>) => { if (e.delta > 6) return; e.stopPropagation(); onPick(room) }}
      >
        <meshBasicMaterial ref={matRef} map={portal} toneMapped={false} />
      </mesh>
      {/* soleira */}
      <mesh position={[0, 0.04, 0.35]}><boxGeometry args={[DOOR_W + 0.9, 0.08, 0.9]} /><meshStandardMaterial map={marbleTex()} roughness={0.35} /></mesh>
      {/* placa */}
      <mesh position={[0, DOOR_H + 0.95, 0.02]}>
        <planeGeometry args={[2.5, 0.93]} />
        <meshBasicMaterial map={label} toneMapped={false} />
      </mesh>
      <mesh position={[0, DOOR_H + 0.95, -0.01]}><boxGeometry args={[2.58, 1.01, 0.04]} /><Gold /></mesh>
      {/* mancha de luz no piso */}
      <GlowDecal color={room.color} size={[4.6, 4]} position={[0, 0.03, 2.4]} rotation={[-Math.PI / 2, 0, 0]} opacity={hovered ? 0.7 : 0.32} />
    </group>
  )
}

function Pilaster({ angle }: { angle: number }) {
  const mat = useMemo(() => marbleTex(), [])
  return (
    <group position={[Math.sin(angle) * (WALL_R - 0.35), 0, -Math.cos(angle) * (WALL_R - 0.35)]} rotation={[0, -angle, 0]}>
      <mesh position={[0, 0.25, 0]}><boxGeometry args={[0.7, 0.5, 0.5]} /><meshStandardMaterial map={mat} roughness={0.35} /></mesh>
      <mesh position={[0, 2.9, 0]}><cylinderGeometry args={[0.2, 0.24, 4.8, 24]} /><meshStandardMaterial map={mat} roughness={0.35} /></mesh>
      <mesh position={[0, 5.45, 0]}><boxGeometry args={[0.62, 0.24, 0.5]} /><Gold /></mesh>
      <mesh position={[0, 5.62, 0]}><boxGeometry args={[0.78, 0.12, 0.6]} /><meshStandardMaterial map={mat} roughness={0.35} /></mesh>
      <GlowDecal color="#ffd9a0" size={[1.8, 5]} position={[0, 3, -0.06]} opacity={0.18} />
    </group>
  )
}

/** Escultura cinética pendurada sobre a câmera */
function Armillary() {
  const r1 = useRef<THREE.Mesh>(null), r2 = useRef<THREE.Mesh>(null), r3 = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (r1.current) r1.current.rotation.y += dt * 0.5
    if (r2.current) r2.current.rotation.x += dt * 0.35
    if (r3.current) r3.current.rotation.z -= dt * 0.25
  })
  return (
    <group position={[0, 5.0, 0]}>
      <mesh position={[0, 4, 0]}><cylinderGeometry args={[0.02, 0.02, 8, 6]} /><Gold /></mesh>
      <mesh ref={r1}><torusGeometry args={[1.2, 0.04, 12, 64]} /><Gold /></mesh>
      <mesh ref={r2} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.0, 0.035, 12, 64]} /><Gold /></mesh>
      <mesh ref={r3} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.8, 0.03, 12, 64]} /><Gold /></mesh>
      <mesh><sphereGeometry args={[0.28, 32, 32]} /><meshBasicMaterial color="#ffe7b0" toneMapped={false} /></mesh>
    </group>
  )
}

export default function Hub({ initialYaw, enteringId, onPick, onArrived }: {
  initialYaw: number
  enteringId: string | null
  onPick: (r: Room) => void
  onArrived: (r: Room) => void
}) {
  const { camera, gl, size } = useThree()
  const yaw = useRef(initialYaw)
  const pitch = useRef(size.width / size.height < 1 ? -0.08 : 0)
  const vel = useRef(0)
  const dist = useRef(0)
  const idle = useRef(0)
  const keys = useRef({ l: false, r: false })
  const drag = useRef<{ x: number; y: number } | null>(null)
  const arrived = useRef(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const lite = size.width < 700 // celular: sem reflexo em tempo real

  useEffect(() => { arrived.current = false; dist.current = 0 }, [enteringId])

  useEffect(() => {
    const el = gl.domElement
    const down = (e: PointerEvent) => { drag.current = { x: e.clientX, y: e.clientY }; idle.current = 0 }
    const move = (e: PointerEvent) => {
      if (!drag.current) return
      const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y
      drag.current.x = e.clientX; drag.current.y = e.clientY
      vel.current = -dx * 0.004 * 60
      yaw.current -= dx * 0.004
      pitch.current = THREE.MathUtils.clamp(pitch.current + dy * 0.003, -0.3, 0.7)
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
      const ta = roomAngle(target.index)
      const diff = ((ta - yaw.current + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI
      yaw.current += diff * Math.min(1, dt * 6)
      pitch.current *= 1 - Math.min(1, dt * 5) // endireita o olhar ao caminhar
      if (Math.abs(diff) < 0.12) dist.current = Math.min(STOP, dist.current + dt * 14)
      if (!arrived.current && dist.current >= STOP - 0.1) { arrived.current = true; onArrived(target) }
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
    const y = yaw.current, p = pitch.current
    camera.position.set(Math.sin(y) * d, EYE, -Math.cos(y) * d)
    camera.lookAt(
      camera.position.x + Math.sin(y) * Math.cos(p),
      EYE - 0.05 + Math.sin(p) * 1.5,
      camera.position.z - Math.cos(y) * Math.cos(p),
    )
  })

  const wall = useMemo(() => { const t = wallpaperTex().clone(); t.repeat.set(26, 3); t.needsUpdate = true; return t }, [])
  const wain = useMemo(() => { const t = wainscotTex().clone(); t.repeat.set(66, 1); t.needsUpdate = true; return t }, [])
  useEffect(() => () => { wall.dispose(); wain.dispose() }, [wall, wain])

  return (
    <>
      <color attach="background" args={['#0a0b0f']} />
      <fog attach="fog" args={['#0a0b0f', 26, 52]} />
      <ambientLight intensity={0.2} />
      <hemisphereLight args={['#fff1d6', '#2a2218', 0.55]} />
      <pointLight position={[0, 11, 0]} intensity={380} distance={45} decay={1.6} color="#ffe6bd" />
      <pointLight position={[0, 3.2, 0]} intensity={40} distance={26} decay={1.5} color="#fff6e6" />

      <Environment resolution={256} frames={1} environmentIntensity={0.9}>
        <Lightformer form="circle" intensity={5} color="#fff1d6" position={[0, 12, 0]} rotation-x={Math.PI / 2} scale={7} />
        <Lightformer form="rect" intensity={2} color="#ffd9a0" position={[-9, 4, 0]} rotation-y={Math.PI / 2} scale={[8, 5, 1]} />
        <Lightformer form="rect" intensity={2} color="#ffd9a0" position={[9, 4, 0]} rotation-y={-Math.PI / 2} scale={[8, 5, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#cfe6ff" position={[0, 4, -9]} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#cfe6ff" position={[0, 4, 9]} rotation-y={Math.PI} scale={[10, 4, 1]} />
      </Environment>

      {/* piso de mármore espelhado */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[WALL_R + 0.2, 96]} />
        {lite
          ? <meshStandardMaterial map={hubFloorTex(rooms.length)} color="#c9c5ba" roughness={0.45} metalness={0.1} />
          : (<MeshReflectorMaterial
          map={hubFloorTex(rooms.length)}
          resolution={512}
          blur={[200, 80]}
          mixBlur={1}
          mixStrength={3}
          mirror={0.4}
          roughness={0.55}
          metalness={0.1}
          color="#a8a49a"
        />)}
      </mesh>

      {/* parede em seda + lambril + cornija */}
      <mesh position={[0, WALL_H / 2, 0]}>
        <cylinderGeometry args={[WALL_R, WALL_R, WALL_H, 96, 1, true]} />
        <meshStandardMaterial map={wall} color="#2b3a52" side={THREE.BackSide} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[WALL_R - 0.02, WALL_R - 0.02, 1.4, 96, 1, true]} />
        <meshStandardMaterial map={wain} side={THREE.BackSide} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.42, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[WALL_R - 0.04, 0.05, 8, 128]} /><Gold /></mesh>
      <mesh position={[0, WALL_H - 0.3, 0]}>
        <cylinderGeometry args={[WALL_R - 0.03, WALL_R - 0.03, 0.6, 96, 1, true]} />
        <meshStandardMaterial color="#e9e2d3" side={THREE.BackSide} roughness={0.7} />
      </mesh>
      <mesh position={[0, WALL_H - 0.62, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[WALL_R - 0.06, 0.07, 8, 128]} /><Gold /></mesh>

      {/* cúpula com óculo */}
      <group position={[0, WALL_H, 0]} scale={[1, 0.5, 1]}>
        <mesh>
          <sphereGeometry args={[WALL_R, 64, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#e9e2d3" side={THREE.BackSide} roughness={0.85} />
        </mesh>
      </group>
      {[22, 40, 58, 76].map((deg) => {
        const phi = (deg * Math.PI) / 180
        return (
          <mesh key={deg} position={[0, WALL_H + Math.cos(phi) * WALL_R * 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[Math.sin(phi) * WALL_R - 0.05, 0.06, 8, 96]} /><Gold />
          </mesh>
        )
      })}
      <mesh position={[0, WALL_H + Math.cos(0.17) * WALL_R * 0.5 - 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[Math.sin(0.17) * WALL_R, 48]} />
        <meshBasicMaterial color="#fff6e0" toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      <Armillary />
      <Sparkles count={60} scale={[WALL_R * 1.5, 6, WALL_R * 1.5]} position={[0, 4, 0]} size={2} speed={0.15} color="#ffe9bf" opacity={0.6} />

      {rooms.map(r => (
        <Door key={r.id} room={r} hovered={hovered === r.id} onHover={setHovered} onPick={onPick} />
      ))}
      {rooms.map(r => <Pilaster key={'p' + r.id} angle={roomAngle(r.index) + STEP / 2} />)}
    </>
  )
}
