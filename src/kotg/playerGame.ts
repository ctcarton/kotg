import { PlayerInterface, Action } from './types'
import { Game } from './game'

export class PlayerGame implements PlayerInterface.Game {
  #game: Game
  #playerId: number

  get players () {
    return Object.freeze(this.#game.players.filter(p => p.id !== this.#playerId))
  }

  
}