/**
 * Object helpers built on lodash.
 * Use for pick, omit, get, mapValues etc. to keep mapping logic out of components.
 */
import get from "lodash/get";
import pick from "lodash/pick";
import omit from "lodash/omit";
import pickBy from "lodash/pickBy";
import omitBy from "lodash/omitBy";
import mapValues from "lodash/mapValues";
import keys from "lodash/keys";

/** Get nested value by path (e.g. 'a.b.c'). */
export function getPath<T = unknown>(
  object: object | null | undefined,
  path: string | string[],
  defaultValue?: T
): T {
  return get(object, path, defaultValue) as T;
}

/** Pick only the given keys from object. */
export function pickKeys<T extends object, K extends keyof T>(
  object: T | null | undefined,
  keysToPick: K[] | readonly K[]
): Pick<T, K> {
  return pick(object, keysToPick as string[]) as Pick<T, K>;
}

/** Omit the given keys from object. */
export function omitKeys<T extends object, K extends keyof T>(
  object: T | null | undefined,
  keysToOmit: K[] | readonly K[]
): Omit<T, K> {
  return omit(object, keysToOmit as string[]) as Omit<T, K>;
}

/** Pick key-value pairs that pass the predicate. */
export function pickWhere<T extends object>(
  object: T | null | undefined,
  predicate: (value: unknown, key: string) => boolean
): Partial<T> {
  return pickBy(object, predicate) as Partial<T>;
}

/** Omit key-value pairs that pass the predicate. */
export function omitWhere<T extends object>(
  object: T | null | undefined,
  predicate: (value: unknown, key: string) => boolean
): Partial<T> {
  return omitBy(object, predicate) as Partial<T>;
}

/** Re-export for omitting keys by value (e.g. undefined). */
export { omitBy };


/** Map over object values. */
export function mapObjectValues<T extends object, U>(
  object: T | null | undefined,
  iteratee: (value: T[keyof T], key: string) => U
): Record<keyof T & string, U> {
  return mapValues(object, iteratee) as Record<keyof T & string, U>;
}

/** Get own keys of object. */
export function objectKeys<T extends object>(object: T | null | undefined): (keyof T)[] {
  return keys(object) as (keyof T)[];
}

/** Keys to exclude when copying address objects (e.g. correspondence → permanent). */
export const ADDRESS_COPY_OMIT_KEYS = [
  "id",
  "student_profile_id",
  "created_at",
  "updated_at",
  "address_type",
] as const;
