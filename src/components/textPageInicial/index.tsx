'use client'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './page.module.scss'

interface TextPageInicialProps {
  time?: number
}

const roles = [
  'Full Stack Developer',
  'React Developer',
  'TypeScript Developer',
  'Back-End Developer',
  'Front-End Developer',
  'Mobile Developer',
  'Java Developer',
  'Node.js Developer',
]

export default function TextPageInicial({ time = 3500 }: TextPageInicialProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % roles.length), time)
    return () => clearInterval(id)
  }, [time])

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={index}
        className={styles.text}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {roles[index]}
      </motion.span>
    </AnimatePresence>
  )
}
