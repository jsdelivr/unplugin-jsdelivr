import type { Options } from '../types'

const CDN_HOST = 'https://cdn.jsdelivr.net'

const createContext = (options?: Options) => ({
  // The modules that are being processed.
  modules: options?.modules ?? [],
  // The current working directory.
  cwd: options?.cwd ?? process.cwd(),
  // The endpoint that is being used.
  host: options?.endpoint ?? 'npm',
})

export { CDN_HOST, createContext }
