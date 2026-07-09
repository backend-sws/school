/**
 * Array helpers built on lodash.
 * Use these instead of inline .map/.filter/.find to keep components clean.
 */
import map from "lodash/map";
import filter from "lodash/filter";
import find from "lodash/find";
import keyBy from "lodash/keyBy";
import groupBy from "lodash/groupBy";
import uniqBy from "lodash/uniqBy";
import sortBy from "lodash/sortBy";
import flatMap from "lodash/flatMap";
import includes from "lodash/includes";

/** Pluck a property from each item in an array. */
export function pluck<T, K extends keyof T>(collection: T[] | null | undefined, key: K): T[K][] {
  return map(collection, key) as T[K][];
}

/** Filter array by predicate. */
export function filterBy<T>(
  collection: T[] | null | undefined,
  predicate: (item: T) => boolean
): T[] {
  return filter(collection, predicate);
}

/** Find first item matching predicate. */
export function findWhere<T>(
  collection: T[] | null | undefined,
  predicate: (item: T) => boolean
): T | undefined {
  return find(collection, predicate);
}

/** Index array by a key (e.g. id). */
export function keyByProp<T>(collection: T[] | null | undefined, key: keyof T): Record<string, T> {
  return keyBy(collection, key) as Record<string, T>;
}

/** Group array by key or iteratee. */
export function groupByProp<T>(
  collection: T[] | null | undefined,
  iteratee: keyof T | ((item: T) => string)
): Record<string, T[]> {
  return groupBy(collection, iteratee);
}

/** Unique by key or iteratee. */
export function uniqByProp<T>(collection: T[] | null | undefined, iteratee: keyof T | string): T[] {
  return uniqBy(collection, iteratee);
}

/** Sort by key(s) or iteratee. */
export function sortByProp<T>(
  collection: T[] | null | undefined,
  iteratee: keyof T | (keyof T)[] | ((item: T) => unknown)
): T[] {
  return sortBy(collection, iteratee);
}

/** Flatten and map in one pass. */
export function flatMapBy<T, U>(
  collection: T[] | null | undefined,
  iteratee: (item: T) => U | U[]
): U[] {
  return flatMap(collection, iteratee);
}

/** Check if array includes value (supports primitives and refs). */
export function includesValue<T>(collection: T[] | null | undefined, value: T): boolean {
  return includes(collection, value);
}

/** Build option list from array: [{ value, label }]. */
export function toOptions<T extends Record<string, unknown>>(
  collection: T[] | null | undefined,
  valueKey: keyof T | ((item: T) => string),
  labelKey: keyof T | ((item: T) => string)
): { value: string; label: string }[] {
  if (!collection?.length) return [];
  const getVal = typeof valueKey === "function" ? valueKey : (item: T) => String(item[valueKey] ?? "");
  const getLab = typeof labelKey === "function" ? labelKey : (item: T) => String(item[labelKey] ?? "");
  return map(collection, (item) => ({ value: getVal(item), label: getLab(item) }));
}
