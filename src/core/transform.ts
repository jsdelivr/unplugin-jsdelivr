import { init, parse } from 'es-module-lexer';
import MagicString from 'magic-string';

import { Context, ImportStatementTuple, ImportTuple, ModuleMapReturn } from '../types';
import { getVersion } from './version';

const generateImportTuple = (importElem: string): ImportTuple => {
  const importRename = importElem.split(' as ').map(e => e.trim());
  if (importRename.length === 1)
    return [importRename[0], importRename[0]]; // 'map' into ['map', 'map']

  return [importRename[0], importRename[1]]; // 'merge as LodashMerge' into ['merge', 'LodashMerge']
};

const generateImportStatement = async (importModule: string, importTuple: ImportTuple, transform: ModuleMapReturn, ctx: Context): Promise<string> => {
  const version = await getVersion(importModule, ctx.cwd);
  const [originalImport, renamedImport] = importTuple;
  const transformedModule = typeof transform === 'string' ? transform : transform(`${importModule}@${version}`, originalImport);
  const newModulePath = `${ctx.host}/${transformedModule}/+esm`;
  return `import ${renamedImport} from '${newModulePath}'`;
};

const updateCode = (code: string, importStatements: ImportStatementTuple[]) => {
  const magicCode = new MagicString(code);
  for (const importStatementTuple of importStatements) {
    const [importStatement, statementStart, statementEnd] = importStatementTuple;
    magicCode.remove(statementStart, statementEnd);
    magicCode.appendLeft(statementStart, importStatement);
  }
  return magicCode.toString();
};

const transformImports = async (code: string, ctx: Context) => {
  await init;

  const [imports] = parse(code);
  const importStatements: ImportStatementTuple[] = [];

  for (const importSpecifier of imports) {
    const importModule = importSpecifier.n; // e.g. 'lodash'
    if (importModule === undefined)
      throw new Error(`Bad import specifier: ${importSpecifier}`);

    // If module isn't included, skip to next importSpecifier
    const transformFunction = ctx.modules.get(importModule);
    if (transformFunction !== undefined) {
      // e.g. import { map, merge as LodashMerge } from "lodash"
      const importStatement = code.slice(importSpecifier.ss, importSpecifier.se);
      // Returns an array of import consts e.g. ['map', 'merge as LodashMerge']
      const importElems = importStatement.slice(importStatement.indexOf('{') + 1, importStatement.indexOf('}')).split(',');

      // Setup import tuple
      const newImportStatements: string[] = [];
      for (const importElem of importElems) {
        const importTuple = generateImportTuple(importElem);
        // Generate rewritten import statements
        // eslint-disable-next-line no-await-in-loop
        newImportStatements.push(await generateImportStatement(importModule, importTuple, transformFunction, ctx));
      }
      importStatements.push([newImportStatements.join(';\n'), importSpecifier.ss, importSpecifier.se]);
    }
  }
  return updateCode(code, importStatements);
};

export { generateImportStatement, generateImportTuple, transformImports, updateCode };
