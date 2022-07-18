import { Position, PlayerInterface } from '@/kotg/types';

type SystemParams = {
  id: number
  pos: Position,
  minerals: number,
  gold: number,
  fuel: number
}

export class System {
  #params: SystemParams
  controllerId: number = null
  
  constructor (params: SystemParams) {
    this.#params = params
  }

  get playerSystem (): PlayerInterface.System {
    return null // FIXME
  }

  get id () { return this.#params.id }
  get pos () { return this.#params.pos }
  get minerals () { return this.#params.minerals }
  get gold () { return this.#params.gold }
  get fuel () { return this.#params.fuel }
}
