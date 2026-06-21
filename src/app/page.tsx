'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { HiDocument } from 'react-icons/hi'
import { BsWhatsapp } from 'react-icons/bs'
import styles from './page.module.scss'
import projetos from '@/data/projetos.json'
import BaseLayout from '@/components/BaseLayout'
import Card from '@/components/card'
import ModalComponent from '@/components/modal'

const TextPageInicial = dynamic(() => import('@/components/textPageInicial'), {
  ssr: false,
  loading: () => <span>Full Stack Developer</span>,
})

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

const chipContainerVars = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
}
const chipVars = {
  hidden: { scale: 0.88, y: 6 },
  visible: { scale: 1, y: 0, transition: { duration: 0.3 } },
}

const techs = [
  'React', 'TypeScript', 'Node.js', 'Java',
  'Next.js', 'React Native', 'MySQL', 'MongoDB',
  'Python', 'PHP', 'Vue.js', 'AWS Serverless',
  'Spring Boot', 'Docker',
]

export default function Home() {
  const [modal, setModal] = useState<CardModalProps | null>(null)

  return (
    <BaseLayout>
      <main>
        <div className={styles.orbsContainer} aria-hidden="true">
          <div className={styles.orb1} />
          <div className={styles.orb2} />
          <div className={styles.orb3} />
        </div>

        {/* ── HERO ── */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroBadge}>
              <span className={styles.badgeDot} />
              <span>Disponível para oportunidades</span>
            </div>

            <h1 className={styles.heroName}>
              Guilherme<br />
              <span className={styles.nameAccent}>Duarte</span>
            </h1>

            <div className={styles.heroRole}>
              <span className={styles.roleTag}>&lt;</span>
              <TextPageInicial time={3500} />
              <span className={styles.roleTag}>&nbsp;/&gt;</span>
            </div>

            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>3+</span>
                <span className={styles.statLabel}>Anos de experiência</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNum}>10+</span>
                <span className={styles.statLabel}>Projetos entregues</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNum}>12+</span>
                <span className={styles.statLabel}>Tecnologias dominadas</span>
              </div>
            </div>

            <div className={styles.heroCta}>
              <a href="/curriculo">
                <button className={styles.btnOutline}>
                  <HiDocument /> Currículo
                </button>
              </a>
              <a href="/contato">
                <button className={styles.btnFill}>
                  <BsWhatsapp /> Entrar em Contato
                </button>
              </a>
            </div>
          </div>

          <div className={styles.scrollIndicator}>
            <span>scroll</span>
            <div className={styles.scrollLine} />
          </div>
        </section>

        {/* ── ABOUT + TECH STACK ── */}
        <motion.section
          className={styles.about}
          variants={revealVars}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className={styles.aboutInner}>
            <div className={styles.aboutGrid}>
              <div className={styles.aboutLeft}>
                <span className={styles.sectionEyebrow}>// sobre</span>
                <h2 className={styles.sectionTitle}>Sobre mim</h2>
                <p className={styles.aboutText}>
                  Desenvolvedor Full Stack com mais de 3 anos de experiência construindo
                  aplicações web e mobile de ponta a ponta. Trabalho com React, TypeScript,
                  Node.js e Java no dia a dia — sempre buscando código limpo, escalável e
                  com boa performance.
                </p>
                <p className={styles.aboutText}>
                  Atualmente atuando na VirtualMarket como Full Stack Developer, participando
                  de projetos com stack moderno incluindo Next.js, serverless e bancos de dados
                  relacionais e não relacionais.
                </p>
              </div>

              <div className={styles.aboutRight}>
                <span className={styles.sectionEyebrow}>// stack</span>
                <h2 className={styles.sectionTitle}>Tecnologias</h2>
                <motion.div
                  className={styles.techGrid}
                  variants={chipContainerVars}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                >
                  {techs.map(tech => (
                    <motion.span
                      key={tech}
                      className={styles.techChip}
                      variants={chipVars}
                      whileHover={{ scale: 1.07, y: -2 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── PROJECTS ── */}
        <motion.section
          className={styles.projects}
          variants={revealVars}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className={styles.projectsInner}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>// projetos</span>
              <h2 className={styles.sectionTitle}>Últimos Projetos</h2>
            </div>

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
