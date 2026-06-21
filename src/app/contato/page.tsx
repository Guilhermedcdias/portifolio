'use client'
import { useState } from "react";
import BaseLayout from "@/components/BaseLayout";
import styles from './page.module.scss';
import { toast } from 'react-toastify';
import axios from "axios";

export default function Contato() {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [telefone, setTelefone] = useState('')
    const [assunto, setAssunto] = useState('')
    const [mensagem, setMensagem] = useState('')

    const enviarEmail = async (nome: string, email: string, telefone: string, assunto: string, mensagem: string) => {
        const response = await axios.post('https://portifolio.guilhermedcdias.vercel.app/api/sendemail', {
            nome: nome,
            email: email,
            telefone: telefone,
            assunto: assunto,
            mensagem: mensagem
        });

        const data = response.data;

        if (response.status === 200) {
            toast.success(data.message);
        } else {
            toast.error(data.message);
        }

        return data.status === 200 ? true : false;
    }

    const verifica = () => {
        if (nome !== '' && email !== '' && telefone !== '' && assunto !== '' && mensagem !== '') {
            console.log('enviar email')
            const data = enviarEmail(nome, email, telefone, assunto, mensagem)
            if (!data) {
                toast.error('Erro ao enviar email!')
            } else {
                setNome('')
                setEmail('')
                setTelefone('')
                setAssunto('')
                setMensagem('')
            }
        } else {
            toast.error('Preencha todos os campos!')
        }
        console.log('verifica')
    };


    return (
        <BaseLayout>
            <div className={styles.main}>
                <div className={styles.divPrincipal}>
                    <div className={styles.div}>
                        <span className={styles.eyebrow}>// contato</span>
                        <h1 className={styles.textCenter}>Fale Comigo</h1>
                        <p className={styles.subtitle}>Preencha o formulário abaixo ou me chame no WhatsApp.</p>
                    </div>
                    <div className={styles.div}>
                        {/* formulario com nome, email, telefone, assunto e mensagem */}

                        <div className={styles.formulario}>
                            <div className={styles.row}>
                                <div className={styles.campo}>
                                    <label className={styles.dark}>Nome</label>
                                    <input type="text" value={nome} onChange={(e) => {
                                        e.preventDefault()
                                        setNome(e.target.value)
                                    }} />
                                </div>
                                <div className={styles.campo}>

                                    <label className={styles.dark}>Email</label>
                                    <input type="email" value={email} onChange={(e) => {
                                        e.preventDefault()
                                        setEmail(e.target.value)
                                    }} />
                                </div>

                            </div>
                            <div className={styles.row}>
                                <div className={styles.campo}>

                                    <label className={styles.dark}>Telefone</label>
                                    <input type="text" value={telefone} onChange={(e) => {
                                        e.preventDefault()
                                        setTelefone(e.target.value)
                                    }} />
                                </div>

                                <div className={styles.campo}>

                                    <label className={styles.dark}>Assunto</label>
                                    <input type="text" value={assunto} onChange={(e) => {
                                        e.preventDefault()
                                        setAssunto(e.target.value)
                                    }} />
                                </div>

                            </div>
                            <div className={styles.row}>
                                <div className={styles.campo}>

                                    <label className={styles.dark}>Mensagem</label>
                                    <textarea value={mensagem} onChange={(e) => {
                                        e.preventDefault()
                                        setMensagem(e.target.value)
                                    }}></textarea>
                                </div>


                            </div>

                            <div className={styles.row}>
                                <button onClick={verifica}>Enviar</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </BaseLayout>
    )

}