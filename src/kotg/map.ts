import { fromPairs } from 'lodash'
import { memoize } from '@/utils/decorators'
import { randomRange, randomInt } from '@/utils/random'
import { System } from './system'

export class Map {
  systems: readonly System[]

  @memoize()
  get systemById () {
    return fromPairs(this.systems.map((v,i) => [i,v]))
  }

  constructor (systems: System[]) {
    this.systems = Object.freeze(systems)
  }

  static generate (botCount: number): Map {
    const systemCount = randomRange([3, 5]) * botCount
    const MX = 1280 // FIXME need to calculate map size. Maybe use simple hill climbing to optimize density.
    const MY = 960
    const fuelR = [10, 50] as const
    const goldR = [10, 50] as const
    const mineralR = [10, 50] as const

    const systems = [...Array(systemCount)]
      .map((_, i) => new System({
        id: i,
        pos: {
          x: randomInt(MX),
          y: randomInt(MY),
        },
        fuel: randomRange(fuelR),
        gold: randomRange(goldR),
        minerals: randomRange(mineralR)
    }))

    return new Map(systems)
  }
}
