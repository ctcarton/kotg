export enum ResourceType {
  GOLD,
  MINERALS,
  FUEL,
}

export interface Position {
  x: number
  y: number
}

export interface Player {
  id: number
  controlledSystems: System[]
}

export interface System {
  id: number
  position: Position
  gold: number
  minerals: number
  fuel: number
  controller: Player
}

export interface Game {
  players: readonly Player[]
  systems: readonly System[]

  buildFighters (system: System, count: number): void
  scrapFighters (system: System, count: number): void
  travel (source: System, destination: System, count: number): void
  postOrder (): void
  fillOrder (): void
}
