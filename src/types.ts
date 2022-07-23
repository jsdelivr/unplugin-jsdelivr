type TransformFunction = (importName?: string, matches?: string) => string;
export interface TransformOptions {
  module: string,
  transform: string | TransformFunction,
}
export interface Options {
  cwd: string,
  enforce: 'pre' | 'post' | undefined,
  endpoint: "npm" | "gh",

  transform: boolean,
  modules: TransformOptions[],
}

