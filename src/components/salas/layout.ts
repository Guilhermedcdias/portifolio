import type { Room } from './rooms'
import { ART_STYLES, artMeta, artTitle, type ArtStyle } from './art'

export const W = 13
export const D = 12
export const H = 6.6
export const HOME: [number, number, number] = [0, 1.65, 4.3]
export const SCULPTURE_Z = -0.6

export interface Artwork {
  id: string
  kind: 'art' | 'mural'
  pos: [number, number, number]   // centro da obra na parede
  rotY: number                    // rotação para encarar o interior
  w: number
  h: number
  style?: ArtStyle
  seed: number
  title: string
  meta: string
  /** lado (no eixo local) em que a etiqueta é fixada */
  plateSide: 1 | -1
  /** onde a câmera para ao "chegar perto" */
  view: { pos: [number, number, number]; look: [number, number, number] }
}

const normal = (rotY: number): [number, number] => [Math.sin(rotY), Math.cos(rotY)]

function make(room: Room, id: string, kind: Artwork['kind'], x: number, y: number, z: number, rotY: number, w: number, h: number, style?: ArtStyle, n = 0, plateSide: 1 | -1 = 1): Artwork {
  const [nx, nz] = normal(rotY)
  const dist = kind === 'mural' ? 4.6 : Math.max(2.6, Math.max(w, h) * 1.45)
  const seed = (room.index + 1) * 101 + n * 17
  return {
    id, kind, pos: [x, y, z], rotY, w, h, style, seed, plateSide,
    title: kind === 'mural' ? room.title : artTitle(style!, seed),
    meta: kind === 'mural' ? room.tagline : artMeta(style!, seed),
    view: {
      pos: [x + nx * dist, Math.min(y, 2.1), z + nz * dist],
      look: [x, y, z],
    },
  }
}

/** Cada sala recebe 6 quadros + o mural; o estilo varia com o índice da sala. */
export function buildLayout(room: Room): Artwork[] {
  const S = (k: number) => ART_STYLES[(room.index + k) % ART_STYLES.length]
  return [
    make(room, 'mural', 'mural', 0, 3.4, -D / 2, 0, 6.4, 3.6),
    make(room, 'a0', 'art', -4.5, 1.75, -D / 2, 0, 1.1, 1.6, S(5), 0, -1),
    make(room, 'a1', 'art', 4.5, 1.75, -D / 2, 0, 1.1, 1.6, S(7), 1, 1),
    make(room, 'a2', 'art', -W / 2, 1.7, -2.8, Math.PI / 2, 2.1, 1.45, S(0), 2),
    make(room, 'a3', 'art', -W / 2, 1.7, 2.0, Math.PI / 2, 2.1, 1.45, S(3), 3),
    make(room, 'a4', 'art', W / 2, 1.7, -2.8, -Math.PI / 2, 2.1, 1.45, S(1), 4),
    make(room, 'a5', 'art', W / 2, 1.7, 2.0, -Math.PI / 2, 2.1, 1.45, S(8), 5),
    make(room, 'a6', 'art', -3.9, 1.75, D / 2, Math.PI, 1.8, 1.3, S(2), 6),
    make(room, 'a7', 'art', 3.9, 1.75, D / 2, Math.PI, 1.8, 1.3, S(9), 7),
  ]
}
