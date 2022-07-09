export type LogHook = (message: string) => void

const hooks: LogHook[] = []
const fmt = (...args: any[]) => args.map(String).join(' ')
const applyHooks = (msg: string) => hooks.forEach(h => h(msg))

export function addLoggerHook (hook: LogHook) { 
  hooks.push(hook)
}

export const logger = {
  log (...args: any[]) { applyHooks(fmt(...args)); return console.log(...args) },
  warn (...args: any[]) { applyHooks(fmt(...args)); return console.warn(...args) },
  error (...args: any[]) { applyHooks(fmt(...args)); return console.error(...args) },
}
