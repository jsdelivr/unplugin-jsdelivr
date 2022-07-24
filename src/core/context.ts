import type { Options } from '../types'
import { ModuleOpts } from '../types';

const CDN_HOST = 'https://cdn.jsdelivr.net'

const createContext = (options?: Options) => {

  const modulesMap = new Map<string, string>();

  const addModule = (id: string, modOpts: ModuleOpts) => {
    if (modOpts.transform) {
      modulesMap.set(id, modOpts.transform(id))
    } else {
      modulesMap.set(id, `${modOpts.module}/${id}`)
    }
  }

  if (options?.modules) {
    for (const { module, transform } of options.modules) {
      if (typeof transform === 'string') {
        modulesMap.set(module, transform)
      } else if (typeof transform === 'function') {
        modulesMap.set(module, transform(module))
      } else {
        addModule(module, { module })
      }
    }
  }

  const endpoint = options?.endpoint ?? 'npm'

  return {
    // Should it use transformers
    transform: options?.transform ?? false,
    // The modules that are being processed. Set all to external if options.modules === true
    modules: modulesMap,
    addModule,
    allExternal: options?.allExternal ?? false,
    // The current working directory.
    cwd: options?.cwd ?? process.cwd(),
    // The endpoint that is being used.
    host: `${CDN_HOST}/${endpoint}`,
  }
}

export { CDN_HOST, createContext }
