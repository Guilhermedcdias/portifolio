'use client'
import BaseLayout from "@/components/BaseLayout";
import SwiperCoverflow from "@/components/swiper";
import styles from './page.module.scss'
import { useEffect, useState } from "react";
import ModalComponent from "@/components/modal";
import projetos from '@/data/projetos.json';
import Card from "@/components/card";

interface cardProps {
    title: string;
    Projeto: string;
    Descricao: string;
    Participacao: string;
    url: string;
}

export default function Portifolio() {
    const [title, setTitle] = useState('');
    const [Projeto, setProjeto] = useState('');
    const [Descricao, setDescricao] = useState('');
    const [Participacao, setParticipacao] = useState('');
    const [url, setUrl] = useState('');
    const [show, setShow] = useState(false);

    const [slides, setSlides] = useState<React.ReactNode[]>([]);

    const handleShowModal = ({ title, Projeto, Descricao, Participacao, url }: cardProps) => {
        setTitle(title);
        setProjeto(Projeto);
        setDescricao(Descricao);
        setParticipacao(Participacao);
        setUrl(url);
        setShow(true);
    }

    const handleClose = () => setShow(false);

    useEffect(() => {
        const slidesArray = Object.values(projetos).map((projeto, index) => (
            <Card
                Descricao={projeto.Descricao}
                Participacao={projeto.Participacao}
                Projeto={projeto.Projeto}
                handleShowModal={handleShowModal}
                title={projeto.title}
                url={projeto.url}
                index={index}
                key={index}
            />
        ));
        setSlides(slidesArray);
    }, []);

    return (
        <BaseLayout>
            <div className={styles.main}>
                <div className={styles.carousel}>
                    <span className={styles.sectionEyebrow}>// projetos</span>
                    <h2 className={styles.sectionTitle}>Meus Projetos</h2>
                    <SwiperCoverflow slides={slides} />
                </div>
            </div>

            <ModalComponent Descricao={Descricao} Participação={Participacao} Projeto={Projeto} show={show} handleClose={handleClose} title={title} url={url} />
        </BaseLayout>
    )
}
