'use client'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Theme } from './rooms'

interface PropProps { color: string }

function Glow({ color, intensity = 0.6 }: { color: string; intensity?: number }) {
  return <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} roughness={0.35} metalness={0.2} />
}

function Matte({ color }: { color: string }) {
  return <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
}

/** Chamados (cartões) orbitando um check */
function Helpdesk({ color }: PropProps) {
  const group = useRef<THREE.Group>(null)
  useFrame((s) => { if (group.current) group.current.rotation.y = s.clock.elapsedTime * 0.5 })
  return (
    <group>
      <mesh position={[0, 0.2, 0]}><torusGeometry args={[0.5, 0.09, 16, 48]} /><Glow color={color} /></mesh>
      <mesh position={[-0.12, 0.12, 0]} rotation={[0, 0, -0.8]}><boxGeometry args={[0.1, 0.32, 0.1]} /><Glow color="#fff" /></mesh>
      <mesh position={[0.1, 0.22, 0]} rotation={[0, 0, 0.8]}><boxGeometry args={[0.1, 0.55, 0.1]} /><Glow color="#fff" /></mesh>
      <group ref={group} position={[0, 0.2, 0]}>
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2
          return (
            <group key={i} position={[Math.cos(a) * 1.5, Math.sin(i * 1.7) * 0.35, Math.sin(a) * 1.5]} rotation={[0, -a + Math.PI / 2, 0]}>
              <mesh><boxGeometry args={[0.7, 0.45, 0.05]} /><Matte color="#e6edf3" /></mesh>
              <mesh position={[-0.15, 0.1, 0.03]}><boxGeometry args={[0.3, 0.05, 0.02]} /><Glow color={color} /></mesh>
              <mesh position={[-0.05, -0.02, 0.03]}><boxGeometry args={[0.5, 0.04, 0.02]} /><Matte color="#8b949e" /></mesh>
              <mesh position={[-0.05, -0.12, 0.03]}><boxGeometry args={[0.4, 0.04, 0.02]} /><Matte color="#8b949e" /></mesh>
            </group>
          )
        })}
      </group>
    </group>
  )
}

/** Aranha-robô (crawler) com PDFs flutuando */
function Crawler({ color }: PropProps) {
  const legs = useRef<THREE.Group[]>([])
  const body = useRef<THREE.Group>(null)
  useFrame((s) => {
    const t = s.clock.elapsedTime
    legs.current.forEach((l, i) => { if (l) l.rotation.z = Math.sin(t * 5 + i * 1.3) * 0.25 })
    if (body.current) body.current.position.y = 0.55 + Math.sin(t * 5) * 0.03
  })
  return (
    <group>
      <group ref={body} position={[0, 0.55, 0]}>
        <mesh><sphereGeometry args={[0.45, 32, 24]} /><Matte color="#1b2230" /></mesh>
        <mesh position={[0, 0.1, 0.38]}><sphereGeometry args={[0.1, 16, 16]} /><Glow color={color} intensity={2} /></mesh>
        <mesh position={[0.22, 0.1, 0.34]}><sphereGeometry args={[0.07, 16, 16]} /><Glow color={color} intensity={2} /></mesh>
        <mesh position={[-0.22, 0.1, 0.34]}><sphereGeometry args={[0.07, 16, 16]} /><Glow color={color} intensity={2} /></mesh>
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2
          return (
            <group key={i} rotation={[0, a, 0]}>
              <group ref={(el) => { if (el) legs.current[i] = el }} position={[0.4, 0, 0]}>
                <mesh position={[0.45, -0.05, 0]} rotation={[0, 0, -0.9]}><cylinderGeometry args={[0.04, 0.04, 1.0, 8]} /><Glow color={color} intensity={0.4} /></mesh>
              </group>
            </group>
          )
        })}
      </group>
      {[[-1.6, 1.2, -0.6, 0.3], [1.5, 1.6, 0.4, -0.4], [0.2, 2.0, -1.5, 0.1]].map(([x, y, z, r], i) => (
        <FloatingSheet key={i} position={[x, y, z]} rot={r} color={color} offset={i} />
      ))}
    </group>
  )
}

function FloatingSheet({ position, rot, color, offset }: { position: number[]; rot: number; color: string; offset: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((s) => {
    if (!ref.current) return
    ref.current.position.y = position[1] + Math.sin(s.clock.elapsedTime + offset * 2) * 0.12
    ref.current.rotation.y = rot + s.clock.elapsedTime * 0.3
  })
  return (
    <group ref={ref} position={[position[0], position[1], position[2]]}>
      <mesh><boxGeometry args={[0.6, 0.8, 0.03]} /><Matte color="#e6edf3" /></mesh>
      <mesh position={[0, 0.25, 0.02]}><boxGeometry args={[0.4, 0.06, 0.01]} /><Glow color={color} /></mesh>
      {[0.05, -0.08, -0.21, -0.34].map((y) => (
        <mesh key={y} position={[0, y, 0.02]}><boxGeometry args={[0.44, 0.03, 0.01]} /><Matte color="#8b949e" /></mesh>
      ))}
    </group>
  )
}

/** Volante giratório */
function Wheel({ color }: PropProps) {
  const ref = useRef<THREE.Group>(null)
  useFrame((s) => { if (ref.current) ref.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.8) * 0.9 })
  return (
    <group position={[0, 1.0, 0]} rotation={[-0.25, 0, 0]}>
      <group ref={ref}>
        <mesh><torusGeometry args={[0.9, 0.1, 20, 64]} /><Matte color="#1b2230" /></mesh>
        <mesh><sphereGeometry args={[0.22, 24, 24]} /><Glow color={color} /></mesh>
        {[0, 2.1, 4.2].map((a) => (
          <mesh key={a} rotation={[0, 0, a]} position={[Math.sin(-a) * 0.45, Math.cos(a) * 0.45, 0]}>
            <boxGeometry args={[0.1, 0.9, 0.08]} /><Matte color="#30363d" />
          </mesh>
        ))}
        <mesh position={[0, 0.9, 0.08]}><boxGeometry args={[0.1, 0.18, 0.1]} /><Glow color={color} intensity={1.5} /></mesh>
      </group>
      <mesh position={[0, -1.15, -0.2]}><cylinderGeometry args={[0.08, 0.1, 0.8, 12]} /><Matte color="#30363d" /></mesh>
    </group>
  )
}

/** Placa com chip e LEDs piscando */
function Board({ color }: PropProps) {
  const leds = useRef<THREE.MeshStandardMaterial[]>([])
  useFrame((s) => {
    leds.current.forEach((m, i) => {
      if (m) m.emissiveIntensity = Math.sin(s.clock.elapsedTime * 4 + i * 1.2) > 0.2 ? 3 : 0.1
    })
  })
  return (
    <group position={[0, 0.6, 0]} rotation={[-0.35, 0.5, 0]}>
      <mesh><boxGeometry args={[2.2, 0.08, 1.5]} /><meshStandardMaterial color="#0f5132" roughness={0.6} /></mesh>
      <mesh position={[0, 0.12, 0]}><boxGeometry args={[0.7, 0.16, 0.7]} /><Matte color="#111" /></mesh>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[-0.8 + i * 0.4, 0.07, 0.6]}>
          <boxGeometry args={[0.14, 0.06, 0.14]} />
          <meshStandardMaterial ref={(el) => { if (el) leds.current[i] = el }} color={color} emissive={color} emissiveIntensity={1} />
        </mesh>
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[-0.9 + i * 0.26, 0.05, -0.65]}><boxGeometry args={[0.08, 0.1, 0.12]} /><meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.3} /></mesh>
      ))}
      <mesh position={[0.8, 0.12, -0.2]}><boxGeometry args={[0.4, 0.2, 0.5]} /><meshStandardMaterial color="#9aa4b2" metalness={0.8} roughness={0.3} /></mesh>
    </group>
  )
}

/** Plantas crescendo + sol */
function Plants({ color }: PropProps) {
  const refs = useRef<THREE.Group[]>([])
  useFrame((s) => {
    refs.current.forEach((g, i) => {
      if (!g) return
      const k = 0.75 + 0.25 * Math.sin(s.clock.elapsedTime * 0.9 + i * 0.9)
      g.scale.set(1, k, 1)
      g.rotation.z = Math.sin(s.clock.elapsedTime + i) * 0.05
    })
  })
  const pos: [number, number][] = [[-0.8, 0.3], [0, -0.2], [0.8, 0.25], [-0.35, 0.65], [0.45, -0.55], [-0.6, -0.5]]
  return (
    <group>
      <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[1.4, 1.5, 0.3, 32]} /><Matte color="#4a3322" /></mesh>
      {pos.map(([x, z], i) => (
        <group key={i} position={[x, 0.25, z]} ref={(el) => { if (el) refs.current[i] = el }}>
          <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.04, 0.06, 0.8, 8]} /><Matte color="#3f8f3a" /></mesh>
          <mesh position={[0, 0.9, 0]}><coneGeometry args={[0.28, 0.5, 8]} /><Glow color={color} intensity={0.5} /></mesh>
          <mesh position={[0.15, 0.55, 0]} rotation={[0, 0, -1]}><sphereGeometry args={[0.16, 12, 8]} /><Matte color="#4fae43" /></mesh>
        </group>
      ))}
      <mesh position={[1.8, 2.6, -1]}><sphereGeometry args={[0.45, 24, 24]} /><Glow color="#fde047" intensity={2} /></mesh>
    </group>
  )
}

/** Balões de conversa */
function Chat({ color }: PropProps) {
  const refs = useRef<THREE.Group[]>([])
  useFrame((s) => {
    refs.current.forEach((g, i) => { if (g) g.position.y = 0.5 + i * 0.6 + Math.sin(s.clock.elapsedTime * 1.4 + i) * 0.1 })
  })
  const bubbles = [
    { x: -0.5, w: 1.5, c: '#1f2937' },
    { x: 0.5, w: 1.2, c: color },
    { x: -0.4, w: 1.7, c: '#1f2937' },
    { x: 0.6, w: 0.9, c: color },
  ]
  return (
    <group>
      {bubbles.map((b, i) => (
        <group key={i} ref={(el) => { if (el) refs.current[i] = el }} position={[b.x, 0.5 + i * 0.6, 0]}>
          <mesh><boxGeometry args={[b.w, 0.42, 0.18]} /><Matte color={b.c} /></mesh>
          <mesh position={[b.x > 0 ? b.w / 2 - 0.1 : -b.w / 2 + 0.1, -0.26, 0]} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[0.18, 0.18, 0.18]} /><Matte color={b.c} /></mesh>
          {[-0.12, 0, 0.12].map((dx) => (
            <mesh key={dx} position={[dx * (b.w / 1.2), 0, 0.1]}><sphereGeometry args={[0.04, 8, 8]} /><Glow color="#fff" /></mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

/** Engrenagem + chave inglesa */
function Gear({ color }: PropProps) {
  const big = useRef<THREE.Group>(null)
  const small = useRef<THREE.Group>(null)
  useFrame((s, dt) => {
    if (big.current) big.current.rotation.z += dt * 0.6
    if (small.current) small.current.rotation.z -= dt * 1.1
  })
  const teeth = (n: number, r: number, size: number) =>
    Array.from({ length: n }).map((_, i) => {
      const a = (i / n) * Math.PI * 2
      return <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r, 0]} rotation={[0, 0, a]}><boxGeometry args={[size, size * 0.8, 0.4]} /><Matte color={color} /></mesh>
    })
  return (
    <group position={[0, 1.1, 0]}>
      <group ref={big}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.85, 0.85, 0.4, 32]} /><Matte color={color} /></mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.01]}><cylinderGeometry args={[0.3, 0.3, 0.45, 24]} /><Matte color="#0d1117" /></mesh>
        {teeth(12, 0.95, 0.3)}
      </group>
      <group ref={small} position={[1.45, -0.55, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.5, 0.5, 0.4, 24]} /><Matte color="#9aa4b2" /></mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.18, 0.18, 0.45, 16]} /><Matte color="#0d1117" /></mesh>
        {teeth(8, 0.57, 0.22).map((t) => t)}
      </group>
      <mesh position={[-1.4, -0.7, 0.4]} rotation={[0, 0, 0.9]}><boxGeometry args={[0.16, 1.5, 0.1]} /><meshStandardMaterial color="#c9d1d9" metalness={0.9} roughness={0.25} /></mesh>
    </group>
  )
}

/** Nós de nuvem conectados, com um "olho" central */
function Cloud({ color }: PropProps) {
  const group = useRef<THREE.Group>(null)
  const pulse = useRef<THREE.Mesh>(null)
  const nodes = useMemo(() => Array.from({ length: 7 }).map((_, i) => {
    const a = (i / 7) * Math.PI * 2
    return new THREE.Vector3(Math.cos(a) * 1.5, Math.sin(i * 2.3) * 0.5, Math.sin(a) * 1.5)
  }), [])
  const lines = useMemo(() => nodes.map((n) => {
    const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), n])
    return new THREE.Line(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.6 }))
  }), [nodes, color])
  useFrame((s) => {
    if (group.current) group.current.rotation.y = s.clock.elapsedTime * 0.3
    if (pulse.current) {
      const k = 1 + ((s.clock.elapsedTime * 0.8) % 1) * 1.6
      pulse.current.scale.setScalar(k)
      ;(pulse.current.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - (k - 1) / 1.6)
    }
  })
  return (
    <group position={[0, 1.2, 0]}>
      <mesh><sphereGeometry args={[0.45, 32, 32]} /><Matte color="#0d1117" /></mesh>
      <mesh position={[0, 0, 0.3]}><sphereGeometry args={[0.2, 24, 24]} /><Glow color={color} intensity={2} /></mesh>
      <mesh ref={pulse}><sphereGeometry args={[0.45, 24, 24]} /><meshBasicMaterial color={color} transparent opacity={0.4} wireframe /></mesh>
      <group ref={group}>
        {nodes.map((n, i) => (
          <group key={i}>
            <primitive object={lines[i]} />
            <mesh position={n}><boxGeometry args={[0.38, 0.38, 0.38]} /><Glow color={i % 2 ? color : '#a78bfa'} intensity={0.8} /></mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

/** Balança da justiça */
function Scales({ color }: PropProps) {
  const beam = useRef<THREE.Group>(null)
  useFrame((s) => { if (beam.current) beam.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.9) * 0.12 })
  return (
    <group>
      <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.6, 0.75, 0.2, 24]} /><Matte color="#30363d" /></mesh>
      <mesh position={[0, 1.2, 0]}><cylinderGeometry args={[0.07, 0.1, 2.2, 12]} /><Glow color={color} intensity={0.5} /></mesh>
      <group ref={beam} position={[0, 2.3, 0]}>
        <mesh><boxGeometry args={[2.6, 0.08, 0.08]} /><Glow color={color} intensity={0.5} /></mesh>
        {[-1.2, 1.2].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            <mesh position={[0, -0.5, 0]}><cylinderGeometry args={[0.01, 0.01, 1, 6]} /><Matte color="#c9d1d9" /></mesh>
            <mesh position={[0, -1.05, 0]}><cylinderGeometry args={[0.5, 0.15, 0.12, 24]} /><Glow color={color} intensity={0.6} /></mesh>
          </group>
        ))}
      </group>
      <mesh position={[0, 2.5, 0]}><sphereGeometry args={[0.14, 16, 16]} /><Glow color="#fff" intensity={1} /></mesh>
    </group>
  )
}

/** Patinha pulsando */
function Paw({ color }: PropProps) {
  const ref = useRef<THREE.Group>(null)
  useFrame((s) => {
    if (!ref.current) return
    const k = 1 + Math.sin(s.clock.elapsedTime * 3) * 0.05
    ref.current.scale.setScalar(k)
    ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.6) * 0.5
  })
  return (
    <group ref={ref} position={[0, 1.2, 0]}>
      <mesh position={[0, -0.25, 0]} scale={[1.2, 0.95, 0.6]}><sphereGeometry args={[0.65, 32, 24]} /><Glow color={color} intensity={0.5} /></mesh>
      {[[-0.75, 0.35, 0.3], [-0.28, 0.75, 0.15], [0.28, 0.75, -0.15], [0.75, 0.35, -0.3]].map(([x, y, r], i) => (
        <mesh key={i} position={[x, y, 0]} rotation={[0, 0, r]} scale={[0.8, 1, 0.6]}><sphereGeometry args={[0.28, 24, 20]} /><Glow color={color} intensity={0.5} /></mesh>
      ))}
    </group>
  )
}

/** Ondas de esferas */
function Waves({ color }: PropProps) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const N = 14
  const dummy = useMemo(() => new THREE.Object3D(), [])
  useFrame((s) => {
    if (!mesh.current) return
    let i = 0
    for (let x = 0; x < N; x++) for (let z = 0; z < N; z++) {
      const px = (x - N / 2) * 0.28, pz = (z - N / 2) * 0.28
      dummy.position.set(px, 0.5 + Math.sin(s.clock.elapsedTime * 2 + px * 2.2 + pz * 1.6) * 0.22, pz)
      dummy.scale.setScalar(0.85 + Math.sin(s.clock.elapsedTime * 2 + px * 2) * 0.15)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i++, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })
  return (
    <group position={[0, 0.6, 0]}>
      <instancedMesh ref={mesh} args={[undefined, undefined, N * N]}>
        <sphereGeometry args={[0.13, 12, 12]} />
        <Glow color={color} intensity={0.7} />
      </instancedMesh>
      <mesh position={[0, 1.4, 0]}><torusGeometry args={[0.45, 0.14, 12, 32]} /><Glow color="#f43f5e" intensity={0.6} /></mesh>
    </group>
  )
}

/** Robô de caixas */
function Robot({ color }: PropProps) {
  const head = useRef<THREE.Group>(null)
  const arm = useRef<THREE.Group>(null)
  useFrame((s) => {
    if (head.current) head.current.rotation.y = Math.sin(s.clock.elapsedTime) * 0.6
    if (arm.current) arm.current.rotation.z = -2.2 + Math.sin(s.clock.elapsedTime * 4) * 0.3
  })
  return (
    <group position={[0, 0.2, 0]}>
      <mesh position={[-0.28, 0.45, 0]}><boxGeometry args={[0.3, 0.9, 0.3]} /><Matte color="#1b2230" /></mesh>
      <mesh position={[0.28, 0.45, 0]}><boxGeometry args={[0.3, 0.9, 0.3]} /><Matte color="#1b2230" /></mesh>
      <mesh position={[0, 1.4, 0]}><boxGeometry args={[1.0, 1.1, 0.6]} /><Matte color={color} /></mesh>
      <mesh position={[0, 1.45, 0.31]}><boxGeometry args={[0.4, 0.4, 0.02]} /><Glow color="#fff" intensity={1.2} /></mesh>
      <mesh position={[-0.7, 1.4, 0]}><boxGeometry args={[0.28, 0.9, 0.3]} /><Matte color="#1b2230" /></mesh>
      <group ref={arm} position={[0.6, 1.8, 0]}>
        <mesh position={[0, -0.4, 0]}><boxGeometry args={[0.28, 0.9, 0.3]} /><Matte color="#1b2230" /></mesh>
      </group>
      <group ref={head} position={[0, 2.25, 0]}>
        <mesh><boxGeometry args={[0.6, 0.5, 0.5]} /><Matte color="#c9d1d9" /></mesh>
        <mesh position={[-0.14, 0.04, 0.26]}><boxGeometry args={[0.12, 0.1, 0.02]} /><Glow color={color} intensity={3} /></mesh>
        <mesh position={[0.14, 0.04, 0.26]}><boxGeometry args={[0.12, 0.1, 0.02]} /><Glow color={color} intensity={3} /></mesh>
        <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.02, 0.02, 0.3, 6]} /><Matte color="#c9d1d9" /></mesh>
        <mesh position={[0, 0.58, 0]}><sphereGeometry args={[0.07, 12, 12]} /><Glow color={color} intensity={2} /></mesh>
      </group>
    </group>
  )
}

/** Bolas de loteria quicando */
function Balls({ color }: PropProps) {
  const refs = useRef<THREE.Mesh[]>([])
  const palette = [color, '#38bdf8', '#fbbf24', '#f472b6', '#4ade80', '#fb7185', '#e6edf3']
  useFrame((s) => {
    refs.current.forEach((m, i) => {
      if (!m) return
      const t = s.clock.elapsedTime * 1.6 + i * 1.1
      m.position.y = 0.4 + Math.abs(Math.sin(t)) * 1.5
      m.rotation.y = t
    })
  })
  return (
    <group>
      {palette.map((c, i) => {
        const a = (i / palette.length) * Math.PI * 2
        return (
          <mesh key={i} ref={(el) => { if (el) refs.current[i] = el }} position={[Math.cos(a) * 1.2, 0.4, Math.sin(a) * 1.2]}>
            <sphereGeometry args={[0.38, 24, 24]} />
            <Glow color={c} intensity={0.35} />
          </mesh>
        )
      })}
    </group>
  )
}

/** Cubos A e B alternando destaque */
function AB({ color }: PropProps) {
  const a = useRef<THREE.Mesh>(null)
  const b = useRef<THREE.Mesh>(null)
  useFrame((s) => {
    const t = s.clock.elapsedTime
    const w = (Math.sin(t * 1.2) + 1) / 2
    if (a.current) { a.current.rotation.y = t * 0.6; a.current.scale.setScalar(0.85 + w * 0.35) }
    if (b.current) { b.current.rotation.y = -t * 0.6; b.current.scale.setScalar(0.85 + (1 - w) * 0.35) }
  })
  return (
    <group position={[0, 1.1, 0]}>
      <mesh ref={a} position={[-1.1, 0, 0]}><boxGeometry args={[1, 1, 1]} /><Glow color="#00C2FF" intensity={0.7} /></mesh>
      <mesh ref={b} position={[1.1, 0, 0]}><boxGeometry args={[1, 1, 1]} /><Glow color={color} intensity={0.7} /></mesh>
      <mesh position={[0, -0.8, 0]}><boxGeometry args={[3.4, 0.05, 0.05]} /><Matte color="#30363d" /></mesh>
    </group>
  )
}

/** Cubo alternando vermelho -> verde */
function TDD({ color }: PropProps) {
  const mat = useRef<THREE.MeshStandardMaterial>(null)
  const mesh = useRef<THREE.Mesh>(null)
  const c1 = useMemo(() => new THREE.Color('#ef4444'), [])
  const c2 = useMemo(() => new THREE.Color(color), [color])
  useFrame((s) => {
    const k = (Math.sin(s.clock.elapsedTime * 1.1) + 1) / 2
    if (mat.current) { mat.current.color.copy(c1).lerp(c2, k); mat.current.emissive.copy(c1).lerp(c2, k) }
    if (mesh.current) mesh.current.rotation.set(s.clock.elapsedTime * 0.4, s.clock.elapsedTime * 0.6, 0)
  })
  return (
    <group position={[0, 1.2, 0]}>
      <mesh ref={mesh}><boxGeometry args={[1.1, 1.1, 1.1]} /><meshStandardMaterial ref={mat} emissiveIntensity={0.7} roughness={0.3} /></mesh>
      {[['#ef4444', -1.5], ['#facc15', 0], [color, 1.5]].map(([c, x]) => (
        <mesh key={String(x)} position={[Number(x), -1, 0]}><sphereGeometry args={[0.18, 16, 16]} /><Glow color={String(c)} intensity={1.2} /></mesh>
      ))}
    </group>
  )
}

/** Tokens de texto em órbita */
function Tokens({ color }: PropProps) {
  const group = useRef<THREE.Group>(null)
  const tiles = useMemo(() => Array.from({ length: 22 }).map((_, i) => ({
    w: 0.35 + ((i * 37) % 10) / 12,
    r: 1.0 + ((i * 13) % 10) / 9,
    y: ((i * 29) % 10) / 6 - 0.2,
    a: i * 2.4,
    hot: i % 5 === 0,
  })), [])
  useFrame((s) => { if (group.current) group.current.rotation.y = s.clock.elapsedTime * 0.25 })
  return (
    <group position={[0, 1.2, 0]}>
      <mesh><icosahedronGeometry args={[0.4, 1]} /><Glow color={color} intensity={1} /></mesh>
      <group ref={group}>
        {tiles.map((t, i) => (
          <mesh key={i} position={[Math.cos(t.a) * t.r, t.y - 0.5, Math.sin(t.a) * t.r]} rotation={[0, -t.a + Math.PI / 2, 0]}>
            <boxGeometry args={[t.w, 0.14, 0.04]} />
            {t.hot ? <Glow color={color} intensity={1} /> : <Matte color="#8b949e" />}
          </mesh>
        ))}
      </group>
    </group>
  )
}

/** Pilha de discos = banco de dados */
function Database({ color }: PropProps) {
  const refs = useRef<THREE.Group[]>([])
  useFrame((s) => {
    refs.current.forEach((g, i) => { if (g) g.position.y = 0.3 + i * 0.55 + Math.sin(s.clock.elapsedTime * 1.5 + i) * 0.05 + (Math.sin(s.clock.elapsedTime * 0.7) + 1) * 0.08 * i })
  })
  return (
    <group>
      {[0, 1, 2, 3].map((i) => (
        <group key={i} ref={(el) => { if (el) refs.current[i] = el }} position={[0, 0.3 + i * 0.55, 0]}>
          <mesh><cylinderGeometry args={[0.95, 0.95, 0.4, 40]} /><Matte color="#1b2230" /></mesh>
          <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.96, 0.96, 0.05, 40]} /><Glow color={color} intensity={0.9} /></mesh>
          <mesh position={[0.6, 0.0, 0.76]}><sphereGeometry args={[0.05, 8, 8]} /><Glow color="#4ade80" intensity={3} /></mesh>
        </group>
      ))}
    </group>
  )
}

const registry: Record<Theme, (p: PropProps) => React.ReactElement> = {
  helpdesk: Helpdesk, crawler: Crawler, wheel: Wheel, board: Board, plants: Plants, chat: Chat,
  gear: Gear, cloud: Cloud, scales: Scales, paw: Paw, waves: Waves, robot: Robot,
  balls: Balls, ab: AB, tdd: TDD, tokens: Tokens, database: Database,
}

export function RoomProp({ theme, color }: { theme: Theme; color: string }) {
  const C = registry[theme]
  return <C color={color} />
}
