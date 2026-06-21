'use client'
import { motion } from 'framer-motion'
import BaseLayout from '@/components/BaseLayout'
import styles from './page.module.scss'
import { FaBuilding, FaCalendarAlt, FaLinkedin, FaGithub, FaEnvelope, FaPhone, FaGraduationCap } from 'react-icons/fa'
import { PiOfficeChairFill } from 'react-icons/pi'

const revealVars = {
  hidden: { y: 28 },
  visible: { y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

const skills = {
  left: [
    { name: 'JavaScript',  level: 'Alto',   pct: 98,  cls: 'js'         },
    { name: 'TypeScript',  level: 'Alto',   pct: 95,  cls: 'ts'         },
    { name: 'Java',        level: 'Médio',  pct: 55,  cls: 'java'       },
    { name: 'PHP',         level: 'Médio',  pct: 65,  cls: 'php'        },
    { name: 'MySQL',       level: 'Alto',   pct: 89,  cls: 'mysql'      },
    { name: 'PostgreSQL',  level: 'Médio',  pct: 72,  cls: 'postgresql' },
    { name: 'OracleDB',    level: 'Básico', pct: 33,  cls: 'oracle'     },
    { name: 'NestJS',      level: 'Alto',   pct: 85,  cls: 'nestjs'     },
  ],
  right: [
    { name: 'React',         level: 'Alto',   pct: 92,  cls: 'react'       },
    { name: 'React Native',  level: 'Médio',  pct: 60,  cls: 'reactnative' },
    { name: 'Vue.js',        level: 'Médio',  pct: 70,  cls: 'vue'         },
    { name: 'Python',        level: 'Alto',   pct: 80,  cls: 'py'          },
    { name: 'MongoDB',       level: 'Médio',  pct: 73,  cls: 'mongo'       },
    { name: 'DynamoDB',      level: 'Alto',   pct: 78,  cls: 'dynamo'      },
    { name: 'Docker',        level: 'Alto',   pct: 83,  cls: 'docker'      },
    { name: 'AWS Serverless',level: 'Alto',   pct: 80,  cls: 'aws'         },
  ],
}

const softSkills = ['Liderança técnica', 'Comunicação efetiva', 'Resolução de conflitos', 'Trabalho em equipe', 'Proatividade', 'Criatividade']

export default function Curriculo() {
  return (
    <BaseLayout>
      <div className={styles.orbsContainer} aria-hidden="true">
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
      </div>

      <section className={styles.main}>
        <div className={styles.inner}>

          {/* ── Header ── */}
          <motion.div
            className={styles.header}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.headerText}>
              <h1 className={styles.name}>
                Guilherme Duarte<br />
                <span className={styles.nameAccent}>Cenzi Dias</span>
              </h1>
              <p className={styles.role}>
                <span className={styles.roleTag}>&lt;</span>
                Tech Lead &amp; Full Stack Developer
                <span className={styles.roleTag}>&nbsp;/&gt;</span>
              </p>
            </div>

            <div className={styles.contacts}>
              <a href="mailto:guilhermedcdias.2023@gmail.com" className={styles.contactLink}>
                <FaEnvelope /> guilhermedcdias.2023@gmail.com
              </a>
              <a href="tel:+5512974077685" className={styles.contactLink}>
                <FaPhone /> (12) 97407-7685
              </a>
              <a href="https://www.linkedin.com/in/guilhermedcdias/" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                <FaLinkedin /> linkedin.com/in/guilhermedcdias
              </a>
              <a href="https://github.com/Guilhermedcdias" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                <FaGithub /> github.com/Guilhermedcdias
              </a>
            </div>
          </motion.div>

          {/* ── Summary ── */}
          <motion.div
            className={styles.section}
            variants={revealVars}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <span className={styles.eyebrow}>// sobre</span>
            <h2 className={styles.sectionTitle}>Resumo Profissional</h2>
            <div className={styles.summaryText}>
              <p>
                Tech Lead e Full Stack Developer com mais de 3 anos de experiência profissional, construindo aplicações web e mobile de ponta a ponta. Atualmente lidero tecnicamente times na VirtualMarket, onde percorri a trajetória de Desenvolvedor Full Stack Pleno até Tech Lead, acumulando também responsabilidades de DevOps com Docker, pipelines CI/CD e infraestrutura em cloud.
              </p>
              <p>
                Formado em Desenvolvimento de Software Multiplataforma pela Fatec SJC e pós-graduado em Arquitetura de Software pela FIAP, onde aprofundei conhecimentos em Arquitetura Hexagonal, Domain-Driven Design (DDD), CQRS e microsserviços. Participei do Hackathon FIAP desenvolvendo o ArchLens — plataforma serverless com AWS Lambda, EventBridge, Claude Vision e algoritmos de grafo para análise automática de diagramas de arquitetura.
              </p>
              <p>
                Meu dia a dia envolve React, Next.js, TypeScript, Node.js, NestJS e serviços AWS, com foco em código limpo, performance e escalabilidade. Tenho experiência com práticas ágeis (Scrum) atuando como Product Owner, Scrum Master e agora como líder técnico.
              </p>
            </div>
          </motion.div>

          {/* ── Experience ── */}
          <motion.div
            className={styles.section}
            variants={revealVars}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <span className={styles.eyebrow}>// experiência</span>
            <h2 className={styles.sectionTitle}>Experiência Profissional</h2>

            <div className={styles.timeline}>
              <div className={styles.expCard}>
                <div className={styles.expHeader}>
                  <div>
                    <span className={styles.expCompany}><FaBuilding /> VirtualMarket — Food Solutions</span>
                    <span className={styles.expRole}><PiOfficeChairFill /> Tech Lead &amp; DevOps</span>
                    <span className={styles.expPeriod}><FaCalendarAlt /> Março 2023 — Atualmente</span>
                  </div>
                  <span className={styles.expBadge}>Atual</span>
                </div>
                <p className={styles.expDesc}>
                  Trajetória de Desenvolvedor Full Stack Pleno → Sênior → Tech Lead com atuação adicional em DevOps. Responsável pela liderança técnica de times, decisões de arquitetura e qualidade de código. Trabalho com React, React Native, Vue.js, Next.js, Node.js, NestJS, Express, Laravel, Serverless, DynamoDB, MongoDB, MySQL e OracleDB. No lado de DevOps, atuo com Docker, pipelines CI/CD e infraestrutura em cloud AWS.
                </p>
              </div>

              <div className={styles.expCard}>
                <div className={styles.expHeader}>
                  <div>
                    <span className={styles.expCompany}><FaBuilding /> Performa Comunicação</span>
                    <span className={styles.expRole}><PiOfficeChairFill /> Desenvolvedor Full Stack</span>
                    <span className={styles.expPeriod}><FaCalendarAlt /> Julho 2022 — Março 2023</span>
                  </div>
                </div>
                <p className={styles.expDesc}>
                  Desenvolvimento de aplicações web com Bootstrap, HTML, CSS e JavaScript. Primeiro contato profissional com desenvolvimento frontend e integração de sistemas.
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Education ── */}
          <motion.div
            className={styles.section}
            variants={revealVars}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <span className={styles.eyebrow}>// educação</span>
            <h2 className={styles.sectionTitle}>Formação Acadêmica</h2>

            <div className={styles.timeline}>
              <div className={styles.expCard}>
                <div className={styles.expHeader}>
                  <div>
                    <span className={styles.expCompany}><FaGraduationCap /> FIAP — São Paulo, SP</span>
                    <span className={styles.expRole}>Pós-Graduação em Arquitetura de Software</span>
                    <span className={styles.expPeriod}><FaCalendarAlt /> 2024 — 2025 · Concluído</span>
                  </div>
                  <span className={styles.expBadge}>Concluído</span>
                </div>
              </div>

              <div className={styles.expCard}>
                <div className={styles.expHeader}>
                  <div>
                    <span className={styles.expCompany}><FaGraduationCap /> Fatec SJC — São José dos Campos, SP</span>
                    <span className={styles.expRole}>Tecnólogo em Desenvolvimento de Software Multiplataforma</span>
                    <span className={styles.expPeriod}><FaCalendarAlt /> 2021 — 2024 · Concluído</span>
                  </div>
                  <span className={styles.expBadge}>Concluído</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Hard Skills ── */}
          <motion.div
            className={styles.section}
            variants={revealVars}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <span className={styles.eyebrow}>// hard-skills</span>
            <h2 className={styles.sectionTitle}>Hard Skills</h2>

            <div className={styles.skillsGrid}>
              {[skills.left, skills.right].map((col, ci) => (
                <div key={ci} className={styles.skillsCol}>
                  {col.map(({ name, level, pct, cls }) => (
                    <div key={name} className={styles.skillItem}>
                      <div className={styles.skillMeta}>
                        <span className={styles.skillName}>{name}</span>
                        <span className={styles.skillLevel}>{level}</span>
                      </div>
                      <div className={styles.barTrack}>
                        <motion.div
                          className={`${styles.barFill} ${styles[cls]}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Soft Skills + Languages ── */}
          <motion.div
            className={`${styles.section} ${styles.bottomRow}`}
            variants={revealVars}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <div className={styles.softBlock}>
              <span className={styles.eyebrow}>// soft-skills</span>
              <h2 className={styles.sectionTitle}>Soft Skills</h2>
              <div className={styles.chips}>
                {softSkills.map(s => (
                  <span key={s} className={styles.chip}>{s}</span>
                ))}
              </div>
            </div>

            <div className={styles.softBlock}>
              <span className={styles.eyebrow}>// idiomas</span>
              <h2 className={styles.sectionTitle}>Idiomas</h2>
              <div className={styles.chips}>
                <span className={styles.chip}>Português — Nativo</span>
                <span className={styles.chip}>Inglês — Básico / Leitura técnica</span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    </BaseLayout>
  )
}
