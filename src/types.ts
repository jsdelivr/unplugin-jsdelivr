export type TransformFunction = (moduleName: string, importName: string) => string;
export interface ModuleOpts {
  module: string,
  transform?: TransformFunction,
}

export type ModuleMap = Map<string, string | TransformFunction>
export interface Options {
  cwd?: string,
  enforce?: 'pre' | 'post',
  endpoint?: "npm" | "gh",

  modules?: ModuleOpts[],
}

