'use client'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Environment, Lightformer, MeshReflectorMaterial, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import type { Room } from './rooms'
import { muralTexture, placardTexture } from './textures'
import { paintArt } from './art'
import { RoomProp } from './props'
import { buildLayout, D, H, HOME, SCULPTURE_Z, W, type Artwork } from './layout'
import { artPalette, IVORY, marbleTex, parquetTex, wainscotTex, wallTint, wallpaperTex } from './shared'
import { Bench, FrameBox, Gold, GlowDecal, PictureLight, Stanchions, archShape, portalTexture } from './museum'

/* ---------- câmera: olhar em volta + "chegar perto" de uma obra ---------- */
function Rig({ focus }: { focus: Artwork | null }) {
  const { camera, gl } = useThree()
  const yaw = useRef(0)
  const pitch = useRef(0.04)
  const drag = useRef<{ x: number; y: number } | null>(null)
  const tmp = useMemo(() => ({ m: new THREE.Matrix4(), q: new THREE.Quaternion(), e: new THREE.Euler(0, 0, 0, 'YXZ'), p: new THREE.Vector3() }), [])
  const focusRef = useRef(focus)
  focusRef.current = focus

  useLayoutEffect(() => {
    camera.position.set(...HOME)
    camera.quaternion.setFromEuler(tmp.e.set(pitch.current, yaw.current, 0))
  }, [camera, tmp])

  useEffect(() => {
    const el = gl.domElement
    const down = (e: PointerEvent) => { drag.current = { x: e.clientX, y: e.clientY } }
    const move = (e: PointerEvent) => {
      if (!drag.current || focusRef.current) return
      yaw.current += (e.clientX - drag.current.x) * 0.0045
      pitch.current = THREE.MathUtils.clamp(pitch.current + (e.clientY - drag.current.y) * 0.003, -0.55, 0.55)
      drag.current = { x: e.clientX, y: e.clientY }
    }
    const up = () => { drag.current = null }
    const wheel = (e: WheelEvent) => { if (!focusRef.current) yaw.current += e.deltaX * 0.002 }
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    el.addEventListener('wheel', wheel, { passive: true })
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      el.removeEventListener('wheel', wheel)
    }
  }, [gl])

  useFrame((_, dt) => {
    const f = focusRef.current
    const k = 1 - Math.exp(-dt * 4.5)
    if (f) {
      // afasta o suficiente para a obra caber na largura/altura da tela (retrato incluso)
      const cam = camera as THREE.PerspectiveCamera
      const vf = THREE.MathUtils.degToRad(cam.fov)
      const hf = 2 * Math.atan(Math.tan(vf / 2) * cam.aspect)
      const need = Math.max((f.w / 2 * 1.35) / Math.tan(hf / 2), (f.h / 2 * 1.9) / Math.tan(vf / 2))
      const look = new THREE.Vector3(...f.view.look)
      tmp.p.set(...f.view.pos)
      const dir = tmp.p.clone().sub(look)
      const base = Math.hypot(dir.x, dir.z)
      tmp.p.x = look.x + (dir.x / base) * Math.max(base, need)
      tmp.p.z = look.z + (dir.z / base) * Math.max(base, need)
      tmp.m.lookAt(tmp.p, look, camera.up)
      tmp.q.setFromRotationMatrix(tmp.m)
    } else {
      tmp.p.set(...HOME)
      tmp.q.setFromEuler(tmp.e.set(pitch.current, yaw.current, 0))
    }
    camera.position.lerp(tmp.p, k)
    camera.quaternion.slerp(tmp.q, k)
  })
  return null
}

/* ---------- arquitetura ---------- */
function Wall({ len, position, rotY, tint, rep }: { len: number; position: [number, number, number]; rotY: number; tint: string; rep: [number, number] }) {
  const paper = useMemo(() => { const t = wallpaperTex().clone(); t.repeat.set((len / 2.4), 3); t.needsUpdate = true; return t }, [len])
  const wain = useMemo(() => { const t = wainscotTex().clone(); t.repeat.set(len / 1.3, 1); t.needsUpdate = true; return t }, [len])
  useEffect(() => () => { paper.dispose(); wain.dispose() }, [paper, wain])
  void rep
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <mesh position={[0, H / 2, 0]}><planeGeometry args={[len, H]} /><meshStandardMaterial map={paper} color={tint} roughness={0.85} /></mesh>
      <mesh position={[0, 0.65, 0.012]}><planeGeometry args={[len, 1.3]} /><meshStandardMaterial map={wain} roughness={0.6} /></mesh>
      <mesh position={[0, 1.32, 0.04]}><boxGeometry args={[len, 0.07, 0.09]} /><Gold /></mesh>
      <mesh position={[0, 0.13, 0.04]}><boxGeometry args={[len, 0.26, 0.07]} /><meshStandardMaterial color="#1d140f" roughness={0.5} /></mesh>
      <mesh position={[0, H - 0.17, 0.1]}><boxGeometry args={[len, 0.34, 0.2]} /><meshStandardMaterial color={IVORY} roughness={0.7} /></mesh>
      <mesh position={[0, H - 0.4, 0.14]}><boxGeometry args={[len, 0.05, 0.14]} /><Gold /></mesh>
    </group>
  )
}

function Pedestal({ children }: { children: React.ReactNode }) {
  const marble = useMemo(() => marbleTex(), [])
  return (
    <group position={[0, 0, SCULPTURE_Z]}>
      <mesh position={[0, 0.17, 0]} receiveShadow castShadow><cylinderGeometry args={[1.95, 2.05, 0.34, 56]} /><meshStandardMaterial map={marble} color="#bdb7ab" roughness={0.3} /></mesh>
      <mesh position={[0, 0.43, 0]} receiveShadow castShadow><cylinderGeometry args={[1.55, 1.65, 0.2, 56]} /><meshStandardMaterial map={marble} color="#bdb7ab" roughness={0.3} /></mesh>
      <mesh position={[0, 0.34, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.97, 0.03, 8, 80]} /><Gold /></mesh>
      <group position={[0, 0.53, 0]} scale={0.85}>{children}</group>
    </group>
  )
}

/* ---------- uma obra na parede ---------- */
function Painting({ art, tex, plate, focused, onFocus }: {
  art: Artwork; tex: THREE.Texture; plate: THREE.Texture | null; focused: boolean; onFocus: (id: string) => void
}) {
  const [x, y, z] = art.pos
  const n: [number, number] = [Math.sin(art.rotY), Math.cos(art.rotY)]
  return (
    <group position={[x + n[0] * 0.07, y, z + n[1] * 0.07]} rotation={[0, art.rotY, 0]}>
      <FrameBox w={art.w} h={art.h} mat={art.kind === 'mural' ? 0.2 : 0.12} />
      <mesh
        position={[0, 0, 0.035]}
        onClick={(e: ThreeEvent<MouseEvent>) => { if (e.delta > 6) return; e.stopPropagation(); onFocus(art.id) }}
        onPointerOver={() => { if (!focused) document.body.style.cursor = 'zoom-in' }}
        onPointerOut={() => { document.body.style.cursor = '' }}
      >
        <planeGeometry args={[art.w, art.h]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <PictureLight w={art.w} h={art.h} />
      {plate && (
        <mesh position={[art.w / 2 + 0.75, -0.12, 0.01]}>
          <planeGeometry args={[0.6, 0.375]} />
          <meshBasicMaterial map={plate} toneMapped={false} />
        </mesh>
      )}
    </group>
  )
}

export default function RoomScene({ room, focusId, onFocus, onOpenDetails, onLeave }: {
  room: Room
  focusId: string | null
  onFocus: (id: string | null) => void
  onOpenDetails: () => void
  onLeave: () => void
}) {
  const lite = useThree((st) => st.size.width < 700)
  const layout = useMemo(() => buildLayout(room), [room])
  const palette = useMemo(() => artPalette(room.color), [room])
  const tint = useMemo(() => wallTint(room.color), [room])

  // texturas desta sala (descartadas ao sair); as compartilhadas ficam em shared.ts
  const textures = useMemo(() => {
    const art = new Map<string, THREE.Texture>()
    const plate = new Map<string, THREE.Texture>()
    layout.forEach((a) => {
      if (a.kind === 'mural') {
        art.set(a.id, muralTexture({ num: room.index + 1, title: room.title, tagline: room.tagline, stack: room.stack, descricao: room.descricao, color: room.color }))
      } else {
        art.set(a.id, paintArt(a.style!, a.seed, palette, a.w / a.h))
        plate.set(a.id, placardTexture({ title: a.title, meta: a.meta, w: 480, h: 300 }))
      }
    })
    const sculpture = placardTexture({ title: room.title, meta: `Instalação cinética · ${room.stack.slice(0, 3).join(', ')}`, body: room.tagline, w: 560, h: 380 })
    const exit = placardTexture({ title: 'Voltar ao saguão', meta: 'Clique na porta', w: 520, h: 190 })
    return { art, plate, sculpture, exit }
  }, [layout, palette, room])
  useEffect(() => () => {
    textures.art.forEach(t => t.dispose()); textures.plate.forEach(t => t.dispose())
    textures.sculpture.dispose(); textures.exit.dispose()
  }, [textures])

  const floorMap = useMemo(() => { const t = parquetTex().clone(); t.repeat.set(W / 4, D / 4); t.needsUpdate = true; return t }, [])
  useEffect(() => () => floorMap.dispose(), [floorMap])

  const exitPortal = useMemo(() => portalTexture('#ffd9a0'), [])
  const exitFrame = useMemo(() => new THREE.ExtrudeGeometry(archShape(2.95, 3.55), { depth: 0.3, bevelEnabled: false }), [])
  const exitShape = useMemo(() => {
    const g = new THREE.ShapeGeometry(archShape(2.4, 3.3), 24)
    const uv = g.attributes.uv, pos = g.attributes.position
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (pos.getX(i) + 1.2) / 2.4, pos.getY(i) / 3.3)
    return g
  }, [])
  useEffect(() => () => { exitPortal.dispose(); exitFrame.dispose(); exitShape.dispose() }, [exitPortal, exitFrame, exitShape])

  const sculpt = useRef<THREE.Group>(null)
  useEffect(() => {
    sculpt.current?.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.castShadow = true })
  }, [room])

  const focus = layout.find(a => a.id === focusId) ?? null

  return (
    <>
      <color attach="background" args={['#0a0b0f']} />
      <fog attach="fog" args={['#0a0b0f', 18, 34]} />
      <ambientLight intensity={0.28} />
      <hemisphereLight args={['#fff1d6', '#2a2218', 0.5]} />
      <pointLight position={[0, 5.8, SCULPTURE_Z]} intensity={90} distance={16} decay={1.6} color="#ffe2b0" />
      <pointLight position={[0, 5.5, 3]} intensity={45} distance={14} decay={1.6} color="#fff3dc" />
      <spotLight
        position={[2.2, 6.2, 1.2]} target-position={[0, 0.6, SCULPTURE_Z]}
        angle={0.55} penumbra={0.9} intensity={120} distance={14} decay={1.5} color="#fff1d6"
        castShadow={!lite} shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004}
      />

      <Environment resolution={256} frames={1} environmentIntensity={0.8}>
        <Lightformer form="rect" intensity={4} color="#fff1d6" position={[0, H, -1]} rotation-x={Math.PI / 2} scale={[5, 2.4, 1]} />
        <Lightformer form="rect" intensity={1.8} color="#ffd9a0" position={[-6, 3, 0]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1.8} color="#ffd9a0" position={[6, 3, 0]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#cfe6ff" position={[0, 3, 7]} rotation-y={Math.PI} scale={[8, 3, 1]} />
      </Environment>

      <Rig focus={focus} />

      {/* paredes */}
      <Wall len={W} position={[0, 0, -D / 2]} rotY={0} tint={tint} rep={[1, 1]} />
      <Wall len={W} position={[0, 0, D / 2]} rotY={Math.PI} tint={tint} rep={[1, 1]} />
      <Wall len={D} position={[-W / 2, 0, 0]} rotY={Math.PI / 2} tint={tint} rep={[1, 1]} />
      <Wall len={D} position={[W / 2, 0, 0]} rotY={-Math.PI / 2} tint={tint} rep={[1, 1]} />

      {/* piso em parquet com leve reflexo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        {lite
          ? <meshStandardMaterial map={floorMap} color="#b79c84" roughness={0.5} />
          : (<MeshReflectorMaterial map={floorMap} resolution={512} blur={[250, 80]} mixBlur={1} mixStrength={1.6} mirror={0.25} roughness={0.55} metalness={0.05} color="#a38a74" />)}
      </mesh>

      {/* teto: gesso, vigas e claraboia */}
      <mesh position={[0, H, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[W, D]} /><meshStandardMaterial color="#e9e2d3" roughness={0.9} side={THREE.DoubleSide} /></mesh>
      {[-4, 0, 4].map((z) => (
        <mesh key={z} position={[0, H - 0.14, z]}><boxGeometry args={[W, 0.28, 0.3]} /><meshStandardMaterial color={IVORY} roughness={0.7} /></mesh>
      ))}
      <mesh position={[0, H - 0.02, -1]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[5, 2.4]} /><meshBasicMaterial color="#fff6e0" toneMapped={false} side={THREE.DoubleSide} /></mesh>
      {[[0, -1 - 1.25, 5.3, 0.14], [0, -1 + 1.25, 5.3, 0.14]].map(([x, z, w, d], i) => (
        <mesh key={i} position={[x, H - 0.03, z]}><boxGeometry args={[w, 0.06, d]} /><Gold /></mesh>
      ))}

      {/* escultura em pedestal, cordas de veludo e etiqueta */}
      <Pedestal>
        <group ref={sculpt}><RoomProp theme={room.theme} color={room.color} /></group>
      </Pedestal>
      <group position={[0, 0, SCULPTURE_Z]}><Stanchions radius={2.75} count={8} /></group>
      <group position={[3.1, 0, 0.9]}>
        <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.025, 0.04, 1.0, 10]} /><Gold /></mesh>
        <mesh position={[0, 1.02, 0]} rotation={[-0.55, 0, 0]}>
          <boxGeometry args={[0.9, 0.62, 0.04]} />
          <Gold />
        </mesh>
        <mesh
          position={[0, 1.02, 0.025]} rotation={[-0.55, 0, 0]}
          onClick={(e: ThreeEvent<MouseEvent>) => { if (e.delta > 6) return; e.stopPropagation(); onOpenDetails() }}
          onPointerOver={() => { document.body.style.cursor = 'pointer' }}
          onPointerOut={() => { document.body.style.cursor = '' }}
        >
          <planeGeometry args={[0.84, 0.57]} />
          <meshBasicMaterial map={textures.sculpture} toneMapped={false} />
        </mesh>
      </group>
      <Bench position={[0, 0, 3.3]} />
      <GlowDecal color="#ffe2b0" size={[7, 6]} position={[0, 0.02, SCULPTURE_Z]} rotation={[-Math.PI / 2, 0, 0]} opacity={0.22} />

      {/* quadros */}
      {layout.map((a) => (
        <Painting
          key={a.id}
          art={a}
          tex={textures.art.get(a.id)!}
          plate={textures.plate.get(a.id) ?? null}
          focused={focusId === a.id}
          onFocus={(id) => onFocus(id)}
        />
      ))}

      {/* saída para o saguão */}
      <group position={[0, 0, D / 2 - 0.02]} rotation={[0, Math.PI, 0]}>
        <mesh geometry={exitFrame} position={[0, 0, -0.3]}><Gold /></mesh>
        <mesh
          geometry={exitShape} position={[0, 0.02, 0.02]}
          onClick={(e: ThreeEvent<MouseEvent>) => { if (e.delta > 6) return; e.stopPropagation(); onLeave() }}
          onPointerOver={() => { document.body.style.cursor = 'pointer' }}
          onPointerOut={() => { document.body.style.cursor = '' }}
        >
          <meshBasicMaterial map={exitPortal} toneMapped={false} />
        </mesh>
        <mesh position={[0, 4.35, 0.02]}><planeGeometry args={[2.2, 0.8]} /><meshBasicMaterial map={textures.exit} toneMapped={false} /></mesh>
        <mesh position={[0, 4.35, -0.01]}><boxGeometry args={[2.28, 0.88, 0.04]} /><Gold /></mesh>
      </group>

      <Sparkles count={40} scale={[W - 2, H - 1, D - 2]} position={[0, H / 2, 0]} size={1.6} speed={0.12} color="#ffe9bf" opacity={0.5} />
    </>
  )
}
