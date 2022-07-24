import { map, merge as LodashMerge } from "lodash";

const testMap = map([1, 2, 3], x => x + 1);
const testMerge = LodashMerge({ a: 1 }, { b: 2 });

export { testMap, testMerge };
