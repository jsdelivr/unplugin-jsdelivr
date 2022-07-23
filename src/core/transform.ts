import { init, parse } from 'es-module-lexer'

const transformImports = async (code: string) => {
  await init;

  const [imports] = parse(code);
  console.log(imports)
}

export { transformImports }
