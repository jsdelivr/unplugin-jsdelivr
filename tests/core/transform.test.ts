/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as fs from 'node:fs';
import * as path from 'pathe';
import { describe, expect, it, vi } from 'vitest';

import { createContext } from '../../src/core/context';
import {
  generateImportStatement,
  generateImportTuple,
  transformImports,
} from '../../src/core/transform';
import { getVersion } from '../../src/core/version';
import { ImportTuple } from '../../src/types';

vi.mock('../../src/core/version.ts');

describe('Transform', () => {
  const code = fs.readFileSync(
    path.join(process.cwd(), 'tests/fixtures/basic.ts'),
    'utf8'
  );

  const expectedCode = `import map from 'https://cdn.jsdelivr.net/npm/lodash@2.0.0/map/+esm';
import LodashMerge from 'https://cdn.jsdelivr.net/npm/lodash@2.0.0/merge/+esm';
import colors from 'picocolors';
import Undermap from 'https://cdn.jsdelivr.net/npm/underscore@2.0.0/lib/map/+esm';

const testMap = map([1, 2, 3], x => x + 1);
const testMerge = LodashMerge({ a: 1 }, { b: 2 });
const testColors = colors.bold('test');
const testMap2 = Undermap([1, 2, 3], x => x + 1);

export { testColors, testMap, testMap2, testMerge };`;

  describe('Generate import tuples', () => {
    it('maps one to one', () => {
      const tuple = generateImportTuple('map');
      expect(tuple).toEqual(['map', 'map']);
    });

    it('splits as statement', () => {
      const tuple = generateImportTuple('merge as LodashMerge');
      expect(tuple).toEqual(['merge', 'LodashMerge']);
    });
  });

  const modules = [
    {
      module: 'lodash',
      transform: (moduleName: string, importName: string) =>
        `${moduleName}/${importName}`,
    },
    {
      module: 'underscore',
      transform: (moduleName: string, importName: string) =>
        `${moduleName}/lib/${importName}`,
    },
  ];
  const ctx = createContext({ modules, cwd: 'tests/fixtures' });
  vi.mocked(getVersion).mockResolvedValue('2.0.0');

  describe('Generating new import statements', () => {
    it('should generate import statements with one to one tuple', async () => {
      const tuple = ['map', 'map'] as ImportTuple;
      const imports = await generateImportStatement(
        'lodash',
        tuple,
        ctx.modules.get('lodash')!,
        ctx
      );
      expect(imports).toEqual(
        "import map from 'https://cdn.jsdelivr.net/npm/lodash@2.0.0/map/+esm'"
      );
    });

    it('should generate import statements with renamed import', async () => {
      const tuple = ['merge', 'LodashMerge'] as ImportTuple;
      const imports = await generateImportStatement(
        'lodash',
        tuple,
        ctx.modules.get('lodash')!,
        ctx
      );
      expect(imports).toEqual(
        "import LodashMerge from 'https://cdn.jsdelivr.net/npm/lodash@2.0.0/merge/+esm'"
      );
    });

    it('should generate import statements with different transform', async () => {
      const tuple = ['map', 'Undermap'] as ImportTuple;
      const imports = await generateImportStatement(
        'underscore',
        tuple,
        ctx.modules.get('underscore')!,
        ctx
      );
      expect(imports).toEqual(
        "import Undermap from 'https://cdn.jsdelivr.net/npm/underscore@2.0.0/lib/map/+esm'"
      );
    });
  });

  it('should transform imports', async () => {
    const result = await transformImports(code, ctx);
    expect(result).toEqual(expectedCode);
  });
});
