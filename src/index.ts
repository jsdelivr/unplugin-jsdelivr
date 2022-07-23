/* eslint-disable unicorn/no-null */
import { createUnplugin } from 'unplugin'

import { createContext } from './core/context';
import { getVersion } from './core/version'
import type { Options } from './types'


export default createUnplugin<Options>(options => {
  const ctx = createContext(options);

  return ({
    name: 'unplugin-jsdelivr',
    async resolveId(id) {
      if (ctx.modules.includes(id)) {
        const version = await getVersion(id);
        return {
          id: `${ctx.host}/${id}@${version}`,
          external: true,
        }
      }
      return null;
    },
    transformInclude(id) {
      return id.endsWith('main.ts')
    },
    transform(code) {
      return code.replace('__UNPLUGIN__', `Hello Unplugin! ${options}`)
    },
  })
})
