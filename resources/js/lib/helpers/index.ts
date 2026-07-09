/**
 * Common helpers (lodash-based) for arrays and objects.
 * Import from here to keep pages/components clean with less inline mapping logic.
 */
export {
  pluck,
  filterBy,
  findWhere,
  keyByProp,
  groupByProp,
  uniqByProp,
  sortByProp,
  flatMapBy,
  includesValue,
  toOptions,
} from "./array";

export {
  getPath,
  pickKeys,
  omitKeys,
  pickWhere,
  omitWhere,
  mapObjectValues,
  objectKeys,
  omitBy,
  ADDRESS_COPY_OMIT_KEYS,
} from "./object";

// Re-export lodash for direct use (pick, pickBy, map, etc.)
export { default as debounce } from "lodash/debounce";
export { default as get } from "lodash/get";
export { default as pick } from "lodash/pick";
export { default as pickBy } from "lodash/pickBy";
export { default as map } from "lodash/map";
export { default as mapValues } from "lodash/mapValues";
