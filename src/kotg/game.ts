import { randomInt } from '@/utils/random'
import { Map } from './map'
import { Player } from './player'
import { System } from './system'
import { Game as PlayerInterface } from './types'

type GameParams = {
  numberOfPlayers: number
  turnLimit: number
}

type Action = any

export class Game {
  params: GameParams
  map: Map
  players: readonly Player[]
  turn: number

  constructor (params: GameParams) {
    this.params = params
    this.init(params)
  }

  get systems () { return this.map.systems }
  get turnLimit () { return this.params.turnLimit }

  run () {
    for (let turn=1; turn <= this.turnLimit; ++turn) {
      this.turn = turn
      const actions = this.getPlayerActions()
      // TODO
    }
  }

  private getPlayerInterface (player: Player, actionQueue: Action[]): PlayerInterface {
    return {}
  }

  private getPlayerActions (): Action[] {
    const actionQueue = []
    for (const player of this.players.filter(p => !p.disable)) {
      const playerInterface = this.getPlayerInterface(player, actionQueue)
      try {
        player.botScript(playerInterface)
      } catch (err) {
        console.error(`[${player.name}]`, err)
        player.disable = true
      }
    }
    return actionQueue
  }

  private init (params: GameParams) {
    this.map = Map.generate(params.numberOfPlayers)
    this.generatePlayers(params)
  }

  private setSystemController (system: System, player: Player) {
    if (system.controllerId !== null) {
      this.players[system.controllerId].controlledSystems.delete(system.id)
    }
    system.controllerId = player.id
    player.controlledSystems.add(system.id)
  }

  private generatePlayers (params: GameParams) {
    this.players = Object.freeze(Array(params.numberOfPlayers).map((_, i) => new Player(i)))
    const occupied = new Set<number>()
    for (const p of this.players) {
      let systemId = randomInt(this.systems.length)
      while (occupied.has(systemId)) { systemId = randomInt(this.systems.length) }
      occupied.add(systemId)
      this.setSystemController(this.systems[systemId], p)
    }
  }
}