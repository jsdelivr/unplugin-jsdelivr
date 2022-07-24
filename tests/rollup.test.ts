import * as path from "pathe"
import { rollup } from "rollup"
import { describe, expect, it } from "vitest"

import jsDelivr from '../src/rollup'

describe('Rollup build', () => {

  it('should rewrite imports for lodash', async () => {
    const bundle = await rollup({
      input: "./tests/fixtures/lodash.ts",
      plugins: [jsDelivr({ cwd: path.join(process.cwd(), 'tests/fixtures'), modules: [{ module: 'lodash' }] })]
    })
    const { output } = await bundle.generate({ format: 'esm' })
    expect(output[0].imports).toEqual(['https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm'])
  })

  it('should skip rewrite imports for lodash', async () => {
    const bundle = await rollup({
      input: './tests/fixtures/lodash.ts',
      plugins: [jsDelivr({ cwd: path.join(process.cwd(), 'tests/fixtures'), modules: [] })]
    })
    const { output } = await bundle.generate({ format: 'esm' })
    expect(output[0].imports).toEqual(['lodash'])
  })
})
