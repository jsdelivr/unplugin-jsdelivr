/* eslint-disable unicorn/no-null */
import { createUnplugin } from 'unplugin';

import { createContext } from './core/context';
import { transformImports } from './core/transform';
import type { Options } from './types';

export default createUnplugin<Options>((options) => {
  const ctx = createContext(options);

  return {
    name: 'unplugin-jsdelivr',
    async transform(code) {
      return transformImports(code, ctx);
    },
  };
});
