'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import BaseLayout from '@/components/BaseLayout'
import Card from '@/components/card'
import ModalComponent from '@/components/modal'
import projetos from '@/data/projetos.json'
import styles from './page.module.scss'

interface CardModalProps {
  title: string
  Projeto: string
  Descricao: string
  Participacao: string
  url: string
}

const revealVars = {
  hidden: { y: 32 },
  visible: { y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

const cardContainerVars = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const cardVars = {
  hidden: { y: 24 },
  visible: { y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function Portifolio() {
  const [modal, setModal] = useState<CardModalProps | null>(null)

  return (
    <BaseLayout>
      <main>
        <div className={styles.orbsContainer} aria-hidden="true">
          <div className={styles.orb1} />
          <div className={styles.orb2} />
          <div className={styles.orb3} />
        </div>

        <section className={styles.pageHeader}>
          <div className={styles.pageHeaderInner}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className={styles.sectionEyebrow}>// projetos</span>
              <h1 className={styles.pageTitle}>Meus Projetos</h1>
              <p className={styles.pageSubtitle}>
                Uma seleção dos trabalhos que desenvolvi — de produtos internos a aplicações
                em produção com usuários reais.
              </p>
            </motion.div>
          </div>
        </section>

        <motion.section
          className={styles.projectsSection}
          variants={revealVars}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className={styles.projectsInner}>
            <motion.div
              className={styles.projectsGrid}
              variants={cardContainerVars}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              {Object.values(projetos).map((projeto, index) => (
                <motion.div key={index} variants={cardVars}>
                  <Card
                    index={index}
                    Descricao={projeto.Descricao}
                    Participacao={projeto.Participacao}
                    Projeto={projeto.Projeto}
                    title={projeto.title}
                    url={projeto.url}
                    handleShowModal={(props) => setModal(props)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      </main>

      <ModalComponent
        Descricao={modal?.Descricao ?? ''}
        Participação={modal?.Participacao ?? ''}
        Projeto={modal?.Projeto ?? ''}
        show={modal !== null}
        handleClose={() => setModal(null)}
        title={modal?.title ?? ''}
        url={modal?.url ?? ''}
      />
    </BaseLayout>
  )
}
