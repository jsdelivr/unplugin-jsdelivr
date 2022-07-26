import { map, merge as LodashMerge } from 'lodash';
import colors from 'picocolors';
import { map as Undermap } from 'underscore';

const testMap = map([1, 2, 3], x => x + 1);
const testMerge = LodashMerge({ a: 1 }, { b: 2 });
const testColors = colors.bold('test');
const testMap2 = Undermap([1, 2, 3], x => x + 1);

export { testColors, testMap, testMap2, testMerge };