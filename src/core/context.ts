import type { Context, ModuleMap, Options } from '../types';

const CDN_HOST = 'https://cdn.jsdelivr.net';

const createContext = (options?: Options): Context => {
  const modulesMap: ModuleMap = new Map();
  const cwd = options?.cwd ?? process.cwd();

  if (options?.modules) {
    for (const { module, transform } of options.modules) {
      // If no transform given, use full ESM lib
      if (typeof transform === 'function') {
        modulesMap.set(module, transform);
      } else {
        modulesMap.set(module, module);
      }
    }
  }

  const endpoint = options?.endpoint ?? 'npm';

  return {
    // The modules that are being processed. Set all to external if options.modules === true
    modules: modulesMap,
    // The current working directory.
    cwd,
    // The endpoint that is being used.
    host: `${CDN_HOST}/${endpoint}`,
  };
};

export { CDN_HOST, createContext };
