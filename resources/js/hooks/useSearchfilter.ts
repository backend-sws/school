import { useState, useCallback, useMemo } from "react";
import { debounce } from "@/lib/helpers";

export interface FilterData {
  type?: string
  from?: string | null
  to?: string | null
  search?: string
  searchType?: string
  page?: number
  perPage?: number
  [key: string]: any
}

/**
 * Configuration for mapping filter keys to API param names
 * - `paramName`: The API parameter name to use
 * - `skipValues`: Values to skip (e.g., "all" means don't include in params)
 * - `transform`: Optional function to transform the value
 */
export interface FilterParamMapping {
  [filterKey: string]: {
    paramName: string
    skipValues?: (string | number | null | undefined)[]
    transform?: (value: any) => any
  }
}

const defaultData: FilterData = {
  type: 'day',
  from: null,
  to: null
}

/**
 * Build API params from filter state using a mapping configuration
 * 
 * @param filter - The current filter state
 * @param mapping - Configuration mapping filter keys to API params
 * @param options - Additional options for building params
 * @returns Record of API params
 */
export function buildFilterParams(
  filter: FilterData,
  mapping: FilterParamMapping = {},
  options: {
    /** Include page and per_page by default */
    includePagination?: boolean
    /** Key in filter that determines search param name (e.g., 'searchType') */
    searchTypeKey?: string
    /** Key in filter that holds the search value */
    searchValueKey?: string
    /** Default values to skip across all filters */
    defaultSkipValues?: (string | number | null | undefined)[]
  } = {}
): Record<string, any> {
  const {
    includePagination = true,
    searchTypeKey = 'search_by',
    searchValueKey = 'search_text',
    defaultSkipValues = ['all', '', null, undefined]
  } = options

  const params: Record<string, any> = {}

  // Handle pagination
  if (includePagination) {
    if (filter.page) params.page = Number(filter.page)
    if (filter.per_page || filter.perPage) params.per_page = Number(filter.per_page || filter.perPage)
  }

  // Handle dynamic search type mapping
  const searchBy = filter[searchTypeKey]
  const searchText = filter[searchValueKey]
  if (searchText && searchText !== '') {
    if (searchBy && searchBy !== 'all' && searchBy !== '') {
      params.search_by = searchBy
      params.search_text = searchText
    } else {
      // Default to search_text if search_by is not specified or 'all'
      params.search = searchText
    }
  }

  // Process mapped filters
  Object.entries(mapping).forEach(([filterKey, config]) => {
    // Skip if it's already handled as search or pagination
    if ([searchTypeKey, searchValueKey, 'page', 'per_page', 'perPage'].includes(filterKey)) return

    const value = filter[filterKey]
    
    // Check global skip values
    if (defaultSkipValues.includes(value)) return
    
    // Check config-specific skip values
    if (config.skipValues?.includes(value)) return
    
    // Final empty check
    if (value === null || value === undefined || value === '') return
    
    params[config.paramName] = config.transform ? config.transform(value) : value
  })

  return params
}


export default function useSearchFilter(initalData: FilterData = defaultData) {
  const [filter, setFilter] = useState<FilterData>(initalData)

  const handleFilter = useCallback((data?: Partial<FilterData>) => {
    if (!data) {
      setFilter({
        ...initalData
      })
    } else {
      setFilter(prev => ({
        ...prev,
        ...data
      }))
    }
  }, [initalData])

  const handleFilterBykey = useCallback((key: string, value: any) => {
    setFilter(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  // Memoized debounced handler
  const debouncedHandleFilterByKey = useMemo(
    () =>
      debounce((key: string, value: any) => {
        handleFilterBykey(key, value);
      }, 500),
    [handleFilterBykey]
  );

  const handleFilterDebounce = useCallback((value: any) => {
    debouncedHandleFilterByKey('search', value)
  }, [debouncedHandleFilterByKey])

  /**
   * Build API params using the current filter and a mapping configuration
   */
  const buildParams = useCallback((
    mapping: FilterParamMapping = {},
    options?: Parameters<typeof buildFilterParams>[2]
  ) => {
    return buildFilterParams(filter, mapping, options)
  }, [filter])

  return { filter, buildParams, handleFilterBykey, handleFilter, handleFilterDebounce }
}
