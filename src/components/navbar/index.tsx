'use client'
import React, { useState } from "react";
import styles from './page.module.scss';
import { BsList } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";

const navLinks = [
  { href: '/curriculo', label: 'Currículo' },
  { href: '/portifolio', label: 'Projetos' },
  { href: '/contato', label: 'Contato' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <a href="/" className={styles.logo}>
          <span className={styles.logoFirst}>G</span>
          <span className={styles.logoAccent}>.</span>
          <span className={styles.logoLast}>Duarte</span>
        </a>

        <nav className={styles.links}>
          {navLinks.map(({ href, label }) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <AiOutlineClose /> : <BsList />}
        </button>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map(({ href, label }) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
        </div>
      )}
    </header>
  );
}
