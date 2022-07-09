export function randomInt (max: number) {
  return Math.floor(Math.random() * max)
}

export function randomRange (range: readonly [number, number]) {
  return range[0] + randomInt(range[1] - range[0])
}
