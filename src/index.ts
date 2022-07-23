/* eslint-disable unicorn/no-null */
import { createUnplugin } from 'unplugin'

import { createContext } from './core/context';
import { getVersion } from './core/version'
import type { Options } from './types'


export default createUnplugin<Options>(options => {
  const ctx = createContext(options);

  if (ctx.transform)
    return ({
      name: 'unplugin-jsdelivr',
      async transform(code, id) {
        const version = await getVersion(id);
        const hostId = `${ctx.host}/${id}@${version}/`;

        return code.replace('__UNPLUGIN__', `Hello Unplugin! ${options}`)
      }
    })

  // If no transform, return full ESM bundles
  return ({
    name: 'unplugin-jsdelivr',
    async resolveId(id) {
      if (ctx.modules.has(id)) {
        const version = await getVersion(id);
        const hostId = `${ctx.host}/${id}@${version}`;
        return {
          id: hostId,
          external: true,
        }
      }
      return null;
    },

  })
})
