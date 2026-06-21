import './globals.css'
import type { Metadata } from 'next'
import { Inter, Syne, JetBrains_Mono } from 'next/font/google'
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const syne = Syne({ subsets: ['latin'], variable: '--font-syne', weight: ['400', '600', '700', '800'] })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono-var', weight: ['400', '500'] })

export const metadata: Metadata = {
  title: 'Guilherme Duarte — Desenvolvedor Full Stack',
  description: 'Portfólio de Guilherme Duarte, desenvolvedor full stack com experiência em React, TypeScript, Node.js, Java e mais.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className={`${inter.variable} ${syne.variable} ${mono.variable}`}>
        {children}
      </body>
    </html>
  )
}
