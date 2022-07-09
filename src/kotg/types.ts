export enum ResourceType {
  Gold,
  Minerals,
  Fuel,
}

export interface Position {
  x: number
  y: number
}

export interface Game {}

export interface Logger {
  log (...args: any[]): void
  warn (...args: any[]): void
  error (...args: any[]): void
}
