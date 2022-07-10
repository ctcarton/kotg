import { Game, PlayerInterface } from './types'

export class Player {

  constructor (
    public id: number,
    public name: string,
    private game: Game,
    private botScript: (game: PlayerInterface.Game) => void  
  ) { }

  log: string[]
  controlledSystems = new Set<number>()
  disable = false

  getPlayerPlayer (): PlayerInterface.Player {
    const self = this
    return {
      get id () { return self.id },
      get controlledSystems () {
        return Object.freeze(
          [...self.controlledSystems.values()]
            .map(id => self.game.map)
        )
      },
    }
  }

}
