import { describe, expect, it } from "vitest";

import { transformImports } from "../../src/core/transform";

describe.skip("Transform", () => {
  const code = `
  import { import1, import2 as import3 } from 'test-package';
  import { importNested } from 'test-package/nested';
  import defaultExport from 'default-package';
  import * as allExports from 'all-package';
  `

  const expectedCode = `
  import import1 from from 'test-package/import1';
  import import2 from from 'test-package/import2';
  import importNested from 'test-package/nested/importNested';
  import defaultExport from 'default-package'
  import * as allExports from 'all-package'
  `

  it("should transform imports", async () => {
    const result = await transformImports(code);
    expect(result).toEqual(expectedCode);
  })
})
