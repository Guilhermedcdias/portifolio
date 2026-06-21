import styles from './page.module.scss';
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            {/* CTA Banner */}
            <div className={styles.cta}>
                <div className={styles.ctaInner}>
                    <div>
                        <h2 className={styles.ctaTitle}>Vamos trabalhar juntos?</h2>
                        <p className={styles.ctaSub}>Aberto a novas oportunidades e projetos freelance.</p>
                    </div>
                    <a href="/contato">
                        <button className={styles.ctaBtn}>Entrar em Contato →</button>
                    </a>
                </div>
            </div>

            {/* Bottom bar */}
            <div className={styles.bottom}>
                <div className={styles.bottomInner}>
                    <div className={styles.brand}>
                        <span className={styles.brandName}>G<span className={styles.dot}>.</span>Duarte</span>
                        <span className={styles.brandRole}>Full Stack Developer</span>
                    </div>

                    <nav className={styles.links}>
                        <a href="/curriculo">Currículo</a>
                        <a href="/portifolio">Projetos</a>
                        <a href="/contato">Contato</a>
                    </nav>

                    <div className={styles.socials}>
                        <a href="https://github.com/guilhermedcdias" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <FaGithub />
                        </a>
                        <a href="https://linkedin.com/in/guilhermedcdias" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <FaLinkedin />
                        </a>
                        <a href="https://wa.me/5512974077685" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                            <FaWhatsapp />
                        </a>
                    </div>
                </div>
                <p className={styles.copy}>© {new Date().getFullYear()} Guilherme Duarte. Todos os direitos reservados.</p>
            </div>
        </footer>
    )
}
