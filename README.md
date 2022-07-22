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
      /* options */
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
      /* options */
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
        /* options */
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
      /* options */
    }),
  ],
});
```

<br></details>

## How It Works

The plugin aims to resolve all the external modules into resolvable CDN URLs. It first transforms member style imports into default imports e.g.

```ts
import { map, merge as LodashMerge } from "lodash";
```

to

```ts
import map from "lodash/map";
import LodashMerge from "lodash/merge";
```

<sub>Reference: <code>[babel-plugin-transform-imports](https://www.npmjs.com/package/babel-plugin-transform-imports)</code></sub>

This creates more efficient development bundles as we're not loading the whole library. It also helps identify the exact files needed to be loaded from the CDN, producing the following code:

```ts
import map from "https://cdn.jsdelivr.net/npm/lodash@4.17.21/map.js/+esm";
import LodashMerge from "https://cdn.jsdelivr.net/npm/lodash@4.17.21/merge.js/+esm";
```

> TODO
> With the list of modules, we can use the jsDelivr Combine API to generate a CDN based vendor bundle of all external dependencies.
> **Currently blocked until ESM support is added to Combine API**
