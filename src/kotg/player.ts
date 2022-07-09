import { Game as PlayerInterface } from './types'

export class Player {
  id: number
  name: string
  botScript: (game: PlayerInterface) => void

  controlledSystems = new Set<number>()
  disable = false

  constructor (id: number) {
    Object.defineProperty(this, 'id', {
      get () { return id }
    })
  }
}