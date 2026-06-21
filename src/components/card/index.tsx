import styles from './page.module.scss';

interface Props {
    title: string;
    Projeto: string;
    Descricao: string;
    Participacao: string;
    url: string;
}

interface CardProps extends Props {
    index?: number;
    handleShowModal: (props: Props) => void;
}

export default function Card({ handleShowModal, title, Projeto, Descricao, Participacao, url, index }: CardProps) {
    const techList = Projeto.split(',').map(t => t.trim()).slice(0, 4);
    const num = String((index ?? 0) + 1).padStart(2, '0');

    return (
        <div className={styles.card}>
            <div className={styles.cardNumber}>{num}</div>
            <div className={styles.cardBody}>
                <h2 className={styles.cardTitle}>{title}</h2>
                <p className={styles.cardDesc}>{Descricao.slice(0, 110)}...</p>
                <div className={styles.techChips}>
                    {techList.map(tech => (
                        <span key={tech} className={styles.chip}>{tech}</span>
                    ))}
                </div>
            </div>
            <div className={styles.cardFooter}>
                <button
                    className={styles.btn}
                    onClick={() => handleShowModal({ title, Projeto, Descricao, Participacao, url })}
                >
                    Ver Projeto →
                </button>
            </div>
        </div>
    )
}
