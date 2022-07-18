import { randomInt } from '@/utils/random'
import { Map } from './map'
import { Player } from './player'
import { System } from './system'
import { PlayerInterface, Action } from './types'

type GameParams = {
  numberOfPlayers: number
  turnLimit: number
}

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

  private getPlayerInterfaceGame (player: Player): {
    playerGame: PlayerInterface.Game,
    actions: Action[],
   } {
    const players: readonly PlayerInterface.Player[] = Object.freeze([])
    const systems: readonly PlayerInterface.System[] = Object.freeze([])
    const playerGame: PlayerInterface.Game = {
      get players () { return players },
      get systems () { return systems },
      buildFighters () { throw 'not implemented '},
      scrapFighters () { throw 'not implemented '},
      travel () { throw 'not implemented '},
      postOrder () { throw 'not implemented '},
      fillOrder () { throw 'not implemented '},   
    }
    return {
      playerGame,
      actions: [],
    }
  }

  private getPlayerActions (): Action[] {
    const actionQueue = []
    for (const player of this.players.filter(p => !p.disable)) {
      const { playerGame, actions } = this.getPlayerInterfaceGame(player)
      actions.forEach(a => actionQueue.push(a))
      try {
        player.botScript(playerGame)
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
    this.players = Object.freeze([...Array(params.numberOfPlayers)].map((_, i) => new Player(i)))
    const occupiedSystems = new Set<number>()
    for (const p of this.players) {
      let systemId = randomInt(this.systems.length)
      while (occupiedSystems.has(systemId)) { systemId = randomInt(this.systems.length) }
      occupiedSystems.add(systemId)
      this.setSystemController(this.systems[systemId], p)
    }
  }
}
