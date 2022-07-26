# unplugin-jsdelivr

Generate a bundle using the [jsDelivr CDN](https://www.jsdelivr.com/) to host the external dependencies.

## Install

```shell
npm i -D unplugin-jsdelivr
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import jsDelivr from "unplugin-jsdelivr/vite";

export default defineConfig({
  plugins: [
    jsDelivr({
      /* options */
    }),
  ],
});
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import jsDelivr from "unplugin-jsdelivr/rollup";

export default {
  plugins: [
    jsDelivr({
      modules: [{ module: "lodash" }],
      // See below for more options
    }),
    // other plugins
  ],
};
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require("unplugin-jsdelivr/webpack")({
      modules: [{ module: "lodash" }],
      // See below for more options
    }),
  ],
};
```

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require("unplugin-jsDelivr/webpack")({
        modules: [{ module: "lodash" }],
        // See below for more options
      }),
    ],
  },
};
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from "esbuild";

build({
  /* ... */
  plugins: [
    require("unplugin-jsDelivr/esbuild")({
      modules: [{ module: "lodash" }],
      // See below for more options
    }),
  ],
});
```

<br></details>

## Options

```ts
{
  // Required
  modules: [...] // See Modules

  // Options
  cwd: process.cwd();
  endpoint: "npm" // or "gh"
  enforce: undefined // "pre" | "post" - only applicable to Vite and Webpack
}
```

### Modules

```ts
// Options
{
  modules: [{ module: "lodash" }];

  // Changes
  import { map, merge as LodashMerge } from "lodash";
  // to
  import {
    map,
    merge as LodashMerge,
  } from "https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm";
}
```

```ts
{
  modules: [
    {
      module: "lodash",
      transform: (moduleName, importName) => `${moduleName}/${importName}`,
    },
  ];

  // Changes
  import { map, merge as LodashMerge } from "lodash";
  // to
  import map from "https://cdn.jsdelivr.net/npm/lodash@4.17.21/map/+esm";
  import LodashMerge from "https://cdn.jsdelivr.net/npm/lodash@4.17.21/merge/+esm";
}
```

## How It Works

The plugin aims to resolve all the external modules into resolvable CDN URLs.

If only `lodash` is included with no transform function passed through, it only resolves the package to the ESM bundle online. The version is resolved from your `package.json`.

```ts
import { map, merge as LodashMerge } from "lodash";
```

```ts
import {
  map,
  merge as LodashMerge,
} from "https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm";
```

Alternatively, if a transform function is passed through to the config, it will first transform the imports before resolving to the ESM bundles online.

```ts
transform: (moduleName, importName) => `${moduleName}/${importName}`

`moduleName` -> `lodash`
`importName` -> `map` and `merge`
```

```ts
import map from "lodash/map";
import LodashMerge from "lodash/merge";
```

<sub>Reference: <code>[babel-plugin-transform-imports](https://www.npmjs.com/package/babel-plugin-transform-imports)</code></sub>

This creates more efficient development bundles as we're not loading the whole library. It also helps identify the exact files needed to be loaded from the CDN, producing the following code:

```ts
import map from "https://cdn.jsdelivr.net/npm/lodash@4.17.21/map/+esm";
import LodashMerge from "https://cdn.jsdelivr.net/npm/lodash@4.17.21/merge/+esm";
```

> TODO
> With the list of modules, we can use the jsDelivr Combine API to generate a CDN based vendor bundle of all external dependencies.
> **Currently blocked until ESM support is added to Combine API**
