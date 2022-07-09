export function * take <T> (count: number, gen: Generator<T>) {
  let i = 0;
  for (const v of gen) {
    yield v
    if (++i === count) { return }
  }
}

export function * repeat (v: string, count: number) {
  for (let i=0; i<count; ++i) { yield v }
}
