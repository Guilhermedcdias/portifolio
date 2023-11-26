'use client'
import { useState } from "react";
import BaseLayout from "../components/BaseLayout";
import styles from './page.module.scss';
import { toast } from 'react-toastify';

export default function Contato() {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [telefone, setTelefone] = useState('')
    const [assunto, setAssunto] = useState('')
    const [mensagem, setMensagem] = useState('')

    const enviarEmail = async (nome: string, email: string, telefone: string, assunto: string, mensagem: string) => {
        const ambiente = window.location
        // verificando se ambiente é localhost ou um ip
        if (ambiente.hostname === 'localhost' || ambiente.hostname.includes('192.168') || ambiente.hostname.includes('10.0') || ambiente.hostname.includes('127.0') || ambiente.hostname.includes('0.0') || ambiente.hostname.includes('::1')) {

            const response = await fetch('http://localhost:3000/api/sendemail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: nome,
                    email: email,
                    telefone: telefone,
                    assunto: assunto,
                    mensagem: mensagem
                }),
            });
            const data = await response.json();

            if (response.status === 200) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }

            return data.status === 200 ? true : false;
        } else {
            const response = await fetch('https://portifolio.guilhermedcdias.vercel.app/api/sendemail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: nome,
                    email: email,
                    telefone: telefone,
                    assunto: assunto,
                    mensagem: mensagem
                }),
            });
            const data = await response.json();

            if (response.status === 200) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }

            return data.status === 200 ? true : false;
        }

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
                        <h1 className={styles.textCenter}>Fale Comigo</h1>
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