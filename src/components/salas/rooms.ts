import projetos from '@/data/projetos.json'

export type Theme =
  | 'helpdesk' | 'crawler' | 'wheel' | 'board' | 'plants' | 'chat'
  | 'gear' | 'cloud' | 'scales' | 'paw' | 'waves' | 'robot'
  | 'balls' | 'ab' | 'tdd' | 'tokens' | 'database'

interface Visual { theme: Theme; color: string; tagline: string }

// Cada projeto de projetos.json ganha uma identidade visual para a sala dele.
const visuals: Record<string, Visual> = {
  '1':  { theme: 'helpdesk', color: '#00C2FF', tagline: 'Chamados voando para quem resolve' },
  '2':  { theme: 'crawler',  color: '#A78BFA', tagline: 'Um robô que lê PDFs por você' },
  '3':  { theme: 'wheel',    color: '#F59E0B', tagline: 'Na direção do projeto' },
  '4':  { theme: 'board',    color: '#22C55E', tagline: 'Hardware, dados e muitos LEDs' },
  '5':  { theme: 'plants',   color: '#84CC16', tagline: 'Tecnologia crescendo no campo' },
  '6':  { theme: 'chat',     color: '#25D366', tagline: 'Conversas que viram produto' },
  '7':  { theme: 'gear',     color: '#F97316', tagline: 'Oficina bem engrenada' },
  '8':  { theme: 'cloud',    color: '#38BDF8', tagline: 'Arquitetura que se explica sozinha' },
  '9':  { theme: 'scales',   color: '#EAB308', tagline: 'Presença digital com peso' },
  '10': { theme: 'paw',      color: '#EC4899', tagline: 'Tudo pelo pet' },
  '11': { theme: 'waves',    color: '#06B6D4', tagline: 'Mergulho no parque aquático' },
  '12': { theme: 'robot',    color: '#EF4444', tagline: 'Microsserviços, transformar e rolar' },
  '13': { theme: 'balls',    color: '#C084FC', tagline: 'Os números da sorte' },
  '14': { theme: 'ab',       color: '#F472B6', tagline: 'A ou B? Os dados decidem' },
  '15': { theme: 'tdd',      color: '#4ADE80', tagline: 'Vermelho, verde, refatora' },
  '16': { theme: 'tokens',   color: '#7DD3FC', tagline: 'Máquinas lendo texto' },
  '17': { theme: 'database', color: '#8B5CF6', tagline: 'Create, Read, Update, Delete' },
}

export interface Room {
  id: string
  index: number
  title: string
  stack: string[]
  descricao: string
  participacao: string
  url: string
  theme: Theme
  color: string
  tagline: string
}

export const rooms: Room[] = Object.entries(projetos as Record<string, {
  title: string; Projeto: string; Descricao: string; Participacao: string; url: string
}>).map(([id, p], index) => ({
  id,
  index,
  title: p.title,
  stack: p.Projeto.replace(/\.$/, '').split(',').map(s => s.trim()).filter(Boolean),
  descricao: p.Descricao,
  participacao: p.Participacao,
  url: p.url,
  ...(visuals[id] ?? { theme: 'database' as Theme, color: '#00C2FF', tagline: '' }),
}))
