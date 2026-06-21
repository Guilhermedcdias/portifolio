import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';


export async function GET() {
  // Rodar o CORS antes de prosseguir

  return new Response('Hello')
}

export async function POST(req: Request) {
  const { nome, email, telefone, assunto, mensagem } = await req.json();



  // Configuração do servidor SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "guilhermedcdias.2022@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: 'guilhermedcdias.2023@gmail.com',
      to: 'guilhermedcdias.2022@gmail.com',
      subject: assunto,
      text: `Nome: ${nome}\nE-mail: ${email}\nTelefone: ${telefone}\nMensagem: ${mensagem}`,
    });

    return NextResponse.json({messagem: 'Email enviado com sucesso'})
  } catch (error) {
    return NextResponse.json({messagem: 'Email não enviado'})

  }
}
