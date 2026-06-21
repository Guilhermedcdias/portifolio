'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import BaseLayout from '@/components/BaseLayout'
import styles from './page.module.scss'
import { toast } from 'react-toastify'
import axios from 'axios'
import { FaEnvelope, FaLinkedin, FaGithub, FaWhatsapp } from 'react-icons/fa'

const contactLinks = [
  {
    icon: <FaWhatsapp />,
    label: 'WhatsApp',
    value: '(12) 97407-7685',
    href: 'https://wa.me/5512974077685',
  },
  {
    icon: <FaEnvelope />,
    label: 'E-mail',
    value: 'guilhermedcdias.2023@gmail.com',
    href: 'mailto:guilhermedcdias.2023@gmail.com',
  },
  {
    icon: <FaLinkedin />,
    label: 'LinkedIn',
    value: 'linkedin.com/in/guilhermedcdias',
    href: 'https://www.linkedin.com/in/guilhermedcdias/',
  },
  {
    icon: <FaGithub />,
    label: 'GitHub',
    value: 'github.com/Guilhermedcdias',
    href: 'https://github.com/Guilhermedcdias',
  },
]

const revealVars = {
  hidden: { y: 28 },
  visible: { y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function Contato() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [assunto, setAssunto] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(false)

  const enviar = async () => {
    if (!nome || !email || !telefone || !assunto || !mensagem) {
      toast.error('Preencha todos os campos!')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(
        'https://portifolio.guilhermedcdias.vercel.app/api/sendemail',
        { nome, email, telefone, assunto, mensagem }
      )
      toast.success(response.data.message)
      setNome('')
      setEmail('')
      setTelefone('')
      setAssunto('')
      setMensagem('')
    } catch {
      toast.error('Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <BaseLayout>
      <div className={styles.orbsContainer} aria-hidden="true">
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
      </div>

      <main className={styles.main}>
        <div className={styles.inner}>

          {/* ── Header ── */}
          <motion.div
            className={styles.pageHeader}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={styles.eyebrow}>// contato</span>
            <h1 className={styles.pageTitle}>Fale Comigo</h1>
            <p className={styles.subtitle}>
              Tem um projeto em mente, uma oportunidade ou só quer trocar uma ideia?
              Me manda uma mensagem — respondo rápido.
            </p>
          </motion.div>

          {/* ── Two-column layout ── */}
          <div className={styles.layout}>

            {/* Form */}
            <motion.div
              className={styles.formCard}
              variants={revealVars}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              <div className={styles.row}>
                <div className={styles.campo}>
                  <label>Nome</label>
                  <input
                    type="text"
                    placeholder="Seu nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>
                <div className={styles.campo}>
                  <label>E-mail</label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.campo}>
                  <label>Telefone</label>
                  <input
                    type="text"
                    placeholder="(00) 00000-0000"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                  />
                </div>
                <div className={styles.campo}>
                  <label>Assunto</label>
                  <input
                    type="text"
                    placeholder="Ex: Oportunidade, Freelance..."
                    value={assunto}
                    onChange={(e) => setAssunto(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.campo}>
                <label>Mensagem</label>
                <textarea
                  placeholder="Descreva o que você precisa..."
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                />
              </div>

              <button
                className={styles.btnSend}
                onClick={enviar}
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </motion.div>

            {/* Contact info */}
            <motion.div
              className={styles.contactInfo}
              variants={revealVars}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              <p className={styles.infoText}>
                Prefere contato direto? Me encontre pelas plataformas abaixo.
              </p>
              <div className={styles.contactList}>
                {contactLinks.map(({ icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactItem}
                  >
                    <span className={styles.contactIcon}>{icon}</span>
                    <div>
                      <span className={styles.contactLabel}>{label}</span>
                      <span className={styles.contactValue}>{value}</span>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </main>
    </BaseLayout>
  )
}
