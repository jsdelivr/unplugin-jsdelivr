import { createFilter } from '@rollup/pluginutils'

import type { Options } from '../types'

const CDN_HOST = 'https://cdn.jsdelivr.net'

const createContext = (options?: Options) => {
  const modulesMap = new Map<string, string>();
  if (options?.modules) {
    for (const { module, transform } of options.modules) {
      if (typeof transform === 'string') {
        modulesMap.set(module, transform)
      } else {
        modulesMap.set(module, transform(module))
      }
    }
  }

  return {
    // Should it use transformers
    transform: options?.transform ?? false,
    // The modules that are being processed.
    modules: modulesMap,
    // The current working directory.
    cwd: options?.cwd ?? process.cwd(),
    // The endpoint that is being used.
    host: options?.endpoint ?? 'npm',
  }
}

export { CDN_HOST, createContext }
