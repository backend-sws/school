import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see routes/web.php:257
* @route '/accounts/expenses'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/accounts/expenses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:257
* @route '/accounts/expenses'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see routes/web.php:257
* @route '/accounts/expenses'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see routes/web.php:257
* @route '/accounts/expenses'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see routes/web.php:258
* @route '/accounts/expenses/records'
*/
export const records = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: records.url(options),
    method: 'get',
})

records.definition = {
    methods: ["get","head"],
    url: '/accounts/expenses/records',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:258
* @route '/accounts/expenses/records'
*/
records.url = (options?: RouteQueryOptions) => {
    return records.definition.url + queryParams(options)
}

/**
* @see routes/web.php:258
* @route '/accounts/expenses/records'
*/
records.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: records.url(options),
    method: 'get',
})

/**
* @see routes/web.php:258
* @route '/accounts/expenses/records'
*/
records.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: records.url(options),
    method: 'head',
})

/**
* @see routes/web.php:259
* @route '/accounts/expenses/categories'
*/
export const categories = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: categories.url(options),
    method: 'get',
})

categories.definition = {
    methods: ["get","head"],
    url: '/accounts/expenses/categories',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:259
* @route '/accounts/expenses/categories'
*/
categories.url = (options?: RouteQueryOptions) => {
    return categories.definition.url + queryParams(options)
}

/**
* @see routes/web.php:259
* @route '/accounts/expenses/categories'
*/
categories.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: categories.url(options),
    method: 'get',
})

/**
* @see routes/web.php:259
* @route '/accounts/expenses/categories'
*/
categories.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: categories.url(options),
    method: 'head',
})

const expenses = {
    dashboard: Object.assign(dashboard, dashboard),
    records: Object.assign(records, records),
    categories: Object.assign(categories, categories),
}

export default expenses