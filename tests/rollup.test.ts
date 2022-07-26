import * as path from 'pathe';
import { rollup } from 'rollup';
import { describe, expect, it } from 'vitest';

import jsDelivr from '../src/rollup';

const outputToSnapshot = (output: any) => {
  const obj = output[0];
  return {
    exports: obj.exports,
    code: obj.code,
    fileName: obj.fileName,
    importedBindings: obj.importedBindings,
    imports: obj.imports,
  };
};

describe('Rollup build', () => {
  describe('No transform', () => {
    it('should rewrite imports for basic', async () => {
      const bundle = await rollup({
        input: './tests/fixtures/basic.ts',
        plugins: [
          jsDelivr({
            cwd: path.join(process.cwd(), 'tests/fixtures'),
            modules: [{ module: 'lodash' }, { module: 'underscore' }],
          }),
        ],
      });
      const { output } = await bundle.generate({ format: 'esm' });
      expect(output[0].imports).toEqual([
        'https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm',
        'picocolors',
        'https://cdn.jsdelivr.net/npm/underscore@1.13.4/+esm',
      ]);
      expect(outputToSnapshot(output)).toMatchSnapshot();
    });

    it('should skip rewrite imports for basic', async () => {
      const bundle = await rollup({
        input: './tests/fixtures/basic.ts',
        plugins: [
          jsDelivr({ cwd: path.join(process.cwd(), 'tests/fixtures') }),
        ],
      });
      const { output } = await bundle.generate({ format: 'esm' });
      expect(output[0].imports).toEqual(['lodash', 'picocolors', 'underscore']);
      expect(outputToSnapshot(output)).toMatchSnapshot();
    });
  });

  describe('With transform', () => {
    it('should split imports and rewrite for basic', async () => {
      const bundle = await rollup({
        input: './tests/fixtures/basic.ts',
        plugins: [
          jsDelivr({
            cwd: path.join(process.cwd(), 'tests/fixtures'),
            modules: [
              {
                module: 'lodash',
                transform: (moduleName, importName) =>
                  `${moduleName}/${importName}`,
              },
            ],
          }),
        ],
      });
      const { output } = await bundle.generate({ format: 'esm' });
      expect(output[0].imports).toEqual([
        'https://cdn.jsdelivr.net/npm/lodash@4.17.21/map/+esm',
        'https://cdn.jsdelivr.net/npm/lodash@4.17.21/merge/+esm',
        'picocolors',
        'underscore',
      ]);
      expect(outputToSnapshot(output)).toMatchSnapshot();
    });

    it('should split multiple imports and rewrite for basic', async () => {
      const bundle = await rollup({
        input: './tests/fixtures/basic.ts',
        plugins: [
          jsDelivr({
            cwd: path.join(process.cwd(), 'tests/fixtures'),
            modules: [
              {
                module: 'lodash',
                transform: (moduleName, importName) =>
                  `${moduleName}/${importName}`,
              },
              {
                module: 'underscore',
                transform: (moduleName, importName) =>
                  `${moduleName}/lib/${importName}`,
              },
            ],
          }),
        ],
      });
      const { output } = await bundle.generate({ format: 'esm' });
      expect(output[0].imports).toEqual([
        'https://cdn.jsdelivr.net/npm/lodash@4.17.21/map/+esm',
        'https://cdn.jsdelivr.net/npm/lodash@4.17.21/merge/+esm',
        'picocolors',
        'https://cdn.jsdelivr.net/npm/underscore@1.13.4/lib/map/+esm',
      ]);
      expect(outputToSnapshot(output)).toMatchSnapshot();
    });
  });
});
