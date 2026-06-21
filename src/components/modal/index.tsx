'use client'
import { useEffect } from 'react';
import styles from './page.module.scss';
import { AiOutlineClose } from 'react-icons/ai';
import { FaGithub } from 'react-icons/fa';

interface IModalProps {
    title: string;
    Projeto: string;
    Descricao: string;
    Participação: string;
    url: string;
    show: boolean;
    handleClose: () => void;
}

export default function ModalComponent({ title, Projeto, Descricao, Participação, url, show, handleClose }: IModalProps) {
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        if (show) document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [show, handleClose]);

    if (!show) return null;

    return (
        <div className={styles.backdrop} onClick={handleClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <button className={styles.close} onClick={handleClose} aria-label="Fechar">
                        <AiOutlineClose />
                    </button>
                </div>

                <div className={styles.body}>
                    <div className={styles.techRow}>
                        <span className={styles.techLabel}>Tecnologias</span>
                        <p className={styles.techList}>{Projeto}</p>
                    </div>

                    <div className={styles.section}>
                        <span className={styles.sectionLabel}>Descrição</span>
                        <p>{Descricao}</p>
                    </div>

                    {Participação && (
                        <div className={styles.section}>
                            <span className={styles.sectionLabel}>Minha Participação</span>
                            <p>{Participação}</p>
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <button className={styles.btnSecondary} onClick={handleClose}>Fechar</button>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        <button className={styles.btnPrimary}>
                            <FaGithub /> Ver no GitHub
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
}
