import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
 * @see routes/web.php:460
 * @route '/library/reports/overdue'
 */
export const overdue = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overdue.url(options),
    method: 'get',
})

overdue.definition = {
    methods: ["get","head"],
    url: '/library/reports/overdue',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:460
 * @route '/library/reports/overdue'
 */
overdue.url = (options?: RouteQueryOptions) => {
    return overdue.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:460
 * @route '/library/reports/overdue'
 */
overdue.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overdue.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:460
 * @route '/library/reports/overdue'
 */
overdue.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: overdue.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:460
 * @route '/library/reports/overdue'
 */
    const overdueForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: overdue.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:460
 * @route '/library/reports/overdue'
 */
        overdueForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: overdue.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:460
 * @route '/library/reports/overdue'
 */
        overdueForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: overdue.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    overdue.form = overdueForm
const reports = {
    overdue: Object.assign(overdue, overdue),
}

export default reports