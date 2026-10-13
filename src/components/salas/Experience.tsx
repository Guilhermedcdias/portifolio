'use client'
import { useCallback, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AnimatePresence, motion } from 'framer-motion'
import { FiArrowLeft, FiArrowRight, FiExternalLink, FiX, FiHome } from 'react-icons/fi'
import { rooms, type Room } from './rooms'
import Hub, { roomAngle } from './Hub'
import RoomScene from './RoomScene'
import styles from './experience.module.scss'

const readUrl = (): string | null => {
  if (typeof window === 'undefined') return null
  const id = new URLSearchParams(window.location.search).get('sala')
  return rooms.some(r => r.id === id) ? id : null
}

export default function Experience() {
  const [roomId, setRoomId] = useState<string | null>(readUrl)
  const [entering, setEntering] = useState<string | null>(null)
  const [details, setDetails] = useState(false)
  const [lastYaw, setLastYaw] = useState(0)

  const room = rooms.find(r => r.id === roomId) ?? null

  useEffect(() => {
    const url = new URL(window.location.href)
    if (roomId) url.searchParams.set('sala', roomId); else url.searchParams.delete('sala')
    window.history.replaceState(null, '', url)
  }, [roomId])

  const goTo = useCallback((r: Room) => { setDetails(false); setRoomId(r.id); setEntering(null) }, [])
  const leave = useCallback(() => {
    if (room) setLastYaw(roomAngle(room.index))
    setDetails(false); setRoomId(null); setEntering(null)
  }, [room])
  const step = useCallback((dir: 1 | -1) => {
    if (!room) return
    goTo(rooms[(room.index + dir + rooms.length) % rooms.length])
  }, [room, goTo])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!room) return
      if (e.key === 'Escape') { details ? setDetails(false) : leave() }
      if (e.key === 'ArrowRight' && !details) step(1)
      if (e.key === 'ArrowLeft' && !details) step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [room, details, leave, step])

  return (
    <div className={styles.stage}>
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 65, near: 0.1, far: 80, position: [0, 1.7, 0] }}
        gl={{ antialias: true }}
      >
        {room
          ? <RoomScene room={room} onOpenDetails={() => setDetails(true)} />
          : <Hub initialYaw={lastYaw} enteringId={entering} onPick={(r) => setEntering(r.id)} onArrived={goTo} />}
      </Canvas>

      {/* transição entre cenas */}
      <motion.div
        key={room?.id ?? 'hub'}
        className={styles.fade}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />

      {!room && (
        <div className={styles.hubHud}>
          <span className={styles.eyebrow}>// modo explorar</span>
          <h1>Saguão do Portfólio</h1>
          <p>Cada porta é um projeto. Arraste (ou use ← →) para girar e clique numa porta para entrar.</p>
          <a href="/portifolio" className={styles.link}>Prefere a versão em lista? Ver projetos <FiArrowRight /></a>
        </div>
      )}

      {room && (
        <>
          <div className={styles.roomBar}>
            <button onClick={leave} className={styles.btn}><FiHome /> Saguão</button>
            <div className={styles.roomTitle}>
              <span style={{ color: room.color }}>sala {String(room.index + 1).padStart(2, '0')} / {rooms.length}</span>
              <strong>{room.title}</strong>
            </div>
            <div className={styles.nav}>
              <button onClick={() => step(-1)} className={styles.btn} aria-label="Sala anterior"><FiArrowLeft /></button>
              <button onClick={() => step(1)} className={styles.btn} aria-label="Próxima sala"><FiArrowRight /></button>
            </div>
          </div>
          <div className={styles.roomFoot}>
            <button onClick={() => setDetails(true)} className={styles.btnPrimary} style={{ background: room.color }}>Ler o mural completo</button>
            <a href={room.url} target="_blank" rel="noreferrer" className={styles.btn}>Ver repositório <FiExternalLink /></a>
            <span className={styles.hint}>arraste para olhar em volta</span>
          </div>
        </>
      )}

      <AnimatePresence>
        {room && details && (
          <motion.aside
            key="details"
            className={styles.panel}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ borderColor: room.color }}
          >
            <button className={styles.close} onClick={() => setDetails(false)} aria-label="Fechar"><FiX /></button>
            <span className={styles.eyebrow} style={{ color: room.color }}>// {room.tagline}</span>
            <h2>{room.title}</h2>
            <div className={styles.chips}>{room.stack.map(s => <span key={s}>{s}</span>)}</div>
            <h3>O projeto</h3>
            <p>{room.descricao}</p>
            <h3>Minha participação</h3>
            <p>{room.participacao}</p>
            <a href={room.url} target="_blank" rel="noreferrer" className={styles.btnPrimary} style={{ background: room.color }}>
              Abrir repositório <FiExternalLink />
            </a>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
