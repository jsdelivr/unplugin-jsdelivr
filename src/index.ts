/* eslint-disable unicorn/no-null */
import { createUnplugin } from 'unplugin';

import { createContext } from './core/context';
import { transformImports } from './core/transform';
import { getVersion } from './core/version';
import type { Options } from './types';


export default createUnplugin<Options>(options => {
  const ctx = createContext(options);

  return ({
    name: 'unplugin-jsdelivr',
    async resolveId(id) {
      if (ctx.modules.get(id) === id) {
        const version = await getVersion(id, ctx.cwd);
        const hostId = `${ctx.host}/${id}@${version}/+esm`;
        return {
          id: hostId,
          external: true,
        };
      }

      return null;
    },
    async transform(code) {
      return transformImports(code, ctx);
    }
  });
});
