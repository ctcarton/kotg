import type { System } from './system'

export * as PlayerInterface from '@/kotg/player/types'

export enum ActionType {
  BUILD_FIGHTER,
  SCRAP_FIGHTER,
  TRAVEL,
  POST_ORDER,
  FILL_ORDER,
}

export type BuildAction = {
  type: ActionType.BUILD_FIGHTER,
  system: System
  count: number
}

export type ScrapAction = {
  type: ActionType.SCRAP_FIGHTER,
  system: System
  count: number
}

export type TravelAction = {
  type: ActionType.TRAVEL,
  source: System,
  destination: System,
  count: number
}

export type PostOrder = {
  type: ActionType.POST_ORDER
}

export type FillOrder = {
  type: ActionType.FILL_ORDER
}

export type Action = 
  | BuildAction
  | ScrapAction
  | TravelAction
  | PostOrder
  | FillOrder
