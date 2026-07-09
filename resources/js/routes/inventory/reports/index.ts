import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
 * @see routes/web.php:370
 * @route '/inventory/reports/low-stock'
 */
export const lowStock = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lowStock.url(options),
    method: 'get',
})

lowStock.definition = {
    methods: ["get","head"],
    url: '/inventory/reports/low-stock',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:370
 * @route '/inventory/reports/low-stock'
 */
lowStock.url = (options?: RouteQueryOptions) => {
    return lowStock.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:370
 * @route '/inventory/reports/low-stock'
 */
lowStock.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lowStock.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:370
 * @route '/inventory/reports/low-stock'
 */
lowStock.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: lowStock.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:370
 * @route '/inventory/reports/low-stock'
 */
    const lowStockForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: lowStock.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:370
 * @route '/inventory/reports/low-stock'
 */
        lowStockForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: lowStock.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:370
 * @route '/inventory/reports/low-stock'
 */
        lowStockForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: lowStock.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    lowStock.form = lowStockForm
const reports = {
    lowStock: Object.assign(lowStock, lowStock),
}

export default reports