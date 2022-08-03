/* eslint-disable no-await-in-loop */
import fg from 'fast-glob';
import * as fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { basename, dirname, resolve } from 'pathe';
import colors from 'picocolors';

const run = async () => {
  const files = await fg('*.js', {
    ignore: ['chunk-*'],
    absolute: true,
    cwd: resolve(dirname(fileURLToPath(import.meta.url)), '../dist'),
  });
  for (const file of files) {
    console.log(colors.bgCyan(' POSTBUILD '), `Fix ${basename(file)}`);
    // fix cjs exports
    let code = await fs.readFile(file, 'utf8');
    code +=
      'if (module.exports.default) module.exports = module.exports.default;';
    await fs.writeFile(file, code);
  }
};

run();
