export type TransformFunction = (importName?: string, matches?: string) => string;
export interface ModuleOpts {
  module: string,
  transform?: TransformFunction,
}
export interface Options {
  cwd?: string,
  enforce?: 'pre' | 'post',
  endpoint?: "npm" | "gh",

  transform?: boolean,
  modules?: ModuleOpts[],
  allExternal?: boolean,
}

