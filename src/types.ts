export type TransformFunction = (moduleName: string, importName: string) => string;
export interface ModuleOpts {
  module: string,
  transform?: TransformFunction,
  version?: string,
}

export interface Options {
  cwd?: string,
  enforce?: 'pre' | 'post',
  endpoint?: 'npm' | 'gh',

  modules?: ModuleOpts[],
}

export type ModuleMapReturn = string | TransformFunction
export type ModuleMap = Map<string, ModuleMapReturn>

export interface Context {
  modules: ModuleMap,
  cwd: string,
  host: string,
}

export type ImportTuple = [OriginalImport: string, RenamedImport: string];

/**
 * Used to replace existing import statements using indexes with new statements
 * @example ['import { map, merge as LodashMerge } from "lodash"', 0, 30]
 */
export type ImportStatementTuple = [NewImportStatement: string, OrigStatementStart: number, OrigStatementEnd: number];
