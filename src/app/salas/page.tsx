'use client'
import dynamic from 'next/dynamic'
import Navbar from '@/components/navbar'
import styles from './page.module.scss'

// three.js só roda no browser
const Experience = dynamic(() => import('@/components/salas/Experience'), {
  ssr: false,
  loading: () => <div className={styles.loading}>Carregando o saguão…</div>,
})

export default function Salas() {
  return (
    <div className={styles.page}>
      <Navbar />
      <Experience />
    </div>
  )
}
