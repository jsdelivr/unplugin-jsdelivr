import { init, parse } from 'es-module-lexer'
import MagicString from 'magic-string';

import { ModuleMap, TransformFunction } from '../types';

type ImportTuple = [OriginalImport: string, RenamedImport: string];

const generateImportTuple = (importElem: string): ImportTuple[] => {
  const tuple: ImportTuple[] = [];

  const importRename = importElem.split(' as ').map(e => e.trim());
  if (importRename.length === 1)
    tuple.push([importRename[0], importRename[0]]); // 'map' into ['map', 'map']
  else
    tuple.push([importRename[0], importRename[1]]); // 'merge as LodashMerge' into ['merge', 'LodashMerge']

  return tuple
}

const generateImportStatements = (importModule: string, importTuples: ImportTuple[], transform: TransformFunction | string): string => {
  const importStatements = importTuples.map(importTuple => {
    const [originalImport, renamedImport] = importTuple;
    const newModulePath = typeof transform === 'string' ? transform : transform(importModule, originalImport);
    return `import ${renamedImport} from '${newModulePath}'`;
  }).join('\n');
  return importStatements;
}



const transformImports = async (code: string, modules: ModuleMap) => {
  await init;

  const [imports] = parse(code);
  const magicCode = new MagicString(code);
  for (const importSpecifier of imports) {
    const importModule = importSpecifier.n; // e.g. 'lodash'
    if (importModule === undefined)
      throw new Error(`Bad import specifier: ${importSpecifier}`);

    // If module isn't included, skip to next importSpecifier
    const transformFunction = modules.get(importModule);
    if (transformFunction !== undefined) {
      // e.g. import { map, merge as LodashMerge } from "lodash"
      const importStatement = code.slice(importSpecifier.ss, importSpecifier.se);
      // Returns an array of import consts e.g. ['map', 'merge as LodashMerge']
      const importElems = importStatement.slice(importStatement.indexOf('{') + 1, importStatement.indexOf('}')).split(',');

      // Setup import tuple
      for (const importElem of importElems) {
        const importTuples = generateImportTuple(importElem);

        // Generate rewritten import statements
        const newImportStatements = generateImportStatements(importModule, importTuples, transformFunction);
        console.log(newImportStatements)
        magicCode.overwrite(importSpecifier.ss, importSpecifier.se, newImportStatements);

        console.log(magicCode.toString())
      }
    }
  }
  return code;
}

export { generateImportTuple, transformImports }
