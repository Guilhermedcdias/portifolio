'use client'
import { useEffect, useLayoutEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { Sparkles, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { Room } from './rooms'
import { muralTexture } from './textures'
import { RoomProp } from './props'

const W = 13, H = 6.4, D = 12

export default function RoomScene({ room, onOpenDetails }: { room: Room; onOpenDetails: () => void }) {
  const mural = useMemo(() => muralTexture({
    num: room.index + 1, title: room.title, tagline: room.tagline,
    stack: room.stack, descricao: room.descricao, color: room.color,
  }), [room])
  useEffect(() => () => mural.dispose(), [mural])

  const camera = useThree((s) => s.camera)
  useLayoutEffect(() => {
    camera.position.set(0, 1.9, 5.6)
    camera.lookAt(0, 1.7, -2.2)
  }, [camera])

  return (
    <>
      <color attach="background" args={['#080B10']} />
      <fog attach="fog" args={['#080B10', 12, 26]} />
      <ambientLight intensity={1.4} />
      <hemisphereLight args={['#5b8bb5', '#1a2230', 1.5]} />
      <pointLight position={[0, 4.8, 0]} intensity={160} distance={18} decay={1.5} color={room.color} />
      <pointLight position={[0, 3, 5]} intensity={70} distance={16} color="#ffffff" />
      <spotLight position={[0, 5.8, -3.8]} target-position={[0, 3, -D / 2]} angle={0.9} penumbra={0.8} intensity={60} distance={12} color="#ffffff" />

      {/* casca da sala */}
      <mesh position={[0, H / 2, 0]}>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#1c2634" side={THREE.BackSide} roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#0b0f16" roughness={0.45} metalness={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -0.4]}>
        <ringGeometry args={[2.2, 2.3, 64]} />
        <meshBasicMaterial color={room.color} />
      </mesh>

      {/* rodapé luminoso */}
      {[-D / 2 + 0.05, D / 2 - 0.05].map((z) => (
        <mesh key={z} position={[0, 0.08, z]}><boxGeometry args={[W, 0.08, 0.06]} /><meshBasicMaterial color={room.color} /></mesh>
      ))}

      {/* pedestal + objeto */}
      <group position={[0, 0, -0.4]}>
        <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[1.9, 2, 0.12, 48]} /><meshStandardMaterial color="#161b22" roughness={0.5} metalness={0.4} /></mesh>
        <group position={[0, 0.12, 0]}><RoomProp theme={room.theme} color={room.color} /></group>
      </group>

      {/* mural */}
      <group position={[0, 3.9, -D / 2 + 0.06]} scale={[1.2, 1.2, 1]}>
        <mesh position={[0, 0, -0.03]}><boxGeometry args={[7.2, 4.15, 0.1]} /><meshStandardMaterial color="#161b22" metalness={0.5} roughness={0.4} /></mesh>
        <mesh
          position={[0, 0, 0.04]}
          onClick={(e) => { if (e.delta > 6) return; e.stopPropagation(); onOpenDetails() }}
          onPointerOver={() => { document.body.style.cursor = 'pointer' }}
          onPointerOut={() => { document.body.style.cursor = '' }}
        >
          <planeGeometry args={[6.9, 3.88]} />
          <meshBasicMaterial map={mural} toneMapped={false} />
        </mesh>
      </group>

      <Sparkles count={50} scale={[W - 1, H - 1, D - 1]} position={[0, H / 2, 0]} size={2.2} speed={0.25} color={room.color} />

      <OrbitControls
        target={[0, 1.7, -2.2]}
        enablePan={false}
        enableDamping
        minDistance={3}
        maxDistance={8.5}
        minPolarAngle={Math.PI / 2.9}
        maxPolarAngle={Math.PI / 1.9}
        minAzimuthAngle={-0.9}
        maxAzimuthAngle={0.9}
      />
    </>
  )
}
