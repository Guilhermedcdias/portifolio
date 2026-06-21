'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiDocument } from 'react-icons/hi'
import { BsWhatsapp } from 'react-icons/bs'
import styles from './page.module.scss'
import projetos from '@/data/projetos.json'
import BaseLayout from '@/components/BaseLayout'
import SwiperCoverflow from '@/components/swiper'
import FadeImageSlider from '@/components/swiperFadeEffect'
import TextPageInicial from '@/components/textPageInicial'
import Card from '@/components/card'
import ModalComponent from '@/components/modal'

interface CardModalProps {
  title: string
  Projeto: string
  Descricao: string
  Participacao: string
  url: string
}

// Hero entrance – stagger children
const heroTextVars = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}
const heroItemVars = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}
const heroPhotoVars = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] as const } },
}

// Scroll-triggered reveal
const revealVars = {
  hidden: { opacity: 0, y: 44 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

// Tech chip stagger
const chipContainerVars = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
}
const chipVars = {
  hidden: { opacity: 0, scale: 0.82 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
}

const techs = [
  'React', 'TypeScript', 'Node.js', 'Java',
  'Next.js', 'React Native', 'MySQL', 'MongoDB',
  'Python', 'PHP', 'Vue.js', 'AWS Serverless',
  'Spring Boot', 'Docker',
]

export default function Home() {
  const [modal, setModal] = useState<CardModalProps | null>(null)

  const slides = Object.values(projetos).map((projeto, index) => (
    <Card
      key={index}
      index={index}
      Descricao={projeto.Descricao}
      Participacao={projeto.Participacao}
      Projeto={projeto.Projeto}
      title={projeto.title}
      url={projeto.url}
      handleShowModal={(props) => setModal(props)}
    />
  ))

  return (
    <BaseLayout>
      <main>
        {/* Ambient floating orbs */}
        <div className={styles.orbsContainer} aria-hidden="true">
          <div className={styles.orb1} />
          <div className={styles.orb2} />
          <div className={styles.orb3} />
        </div>

        {/* ── HERO ── */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            {/* LEFT: Text content */}
            <motion.div
              className={styles.heroText}
              variants={heroTextVars}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={heroItemVars} className={styles.heroBadge}>
                <span className={styles.badgeDot} />
                <span>Disponível para oportunidades</span>
              </motion.div>

              <motion.h1 variants={heroItemVars} className={styles.heroName}>
                Guilherme<br />
                <span className={styles.nameAccent}>Duarte</span>
              </motion.h1>

              <motion.div variants={heroItemVars} className={styles.heroRole}>
                <span className={styles.roleTag}>&lt;</span>
                <TextPageInicial time={3500} />
                <span className={styles.roleTag}>&nbsp;/&gt;</span>
              </motion.div>

              <motion.div variants={heroItemVars} className={styles.heroStats}>
                <div className={styles.stat}>
                  <span className={styles.statNum}>3+</span>
                  <span className={styles.statLabel}>Anos de<br />Experiência</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.stat}>
                  <span className={styles.statNum}>10+</span>
                  <span className={styles.statLabel}>Projetos<br />Entregues</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.stat}>
                  <span className={styles.statNum}>12+</span>
                  <span className={styles.statLabel}>Tecnologias<br />Dominadas</span>
                </div>
              </motion.div>

              <motion.div variants={heroItemVars} className={styles.heroCta}>
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
              </motion.div>
            </motion.div>

            {/* RIGHT: Photo */}
            <motion.div
              className={styles.heroPhotoWrap}
              variants={heroPhotoVars}
              initial="hidden"
              animate="visible"
            >
              <div className={styles.heroPhoto}>
                <FadeImageSlider />
              </div>
              <div className={styles.photoGlow} aria-hidden="true" />
            </motion.div>
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
            <SwiperCoverflow slides={slides} />
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
