import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import expenses from './expenses'
/**
 * @see routes/web.php:250
 * @route '/accounts/fee-hub'
 */
export const feeHub = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: feeHub.url(options),
    method: 'get',
})

feeHub.definition = {
    methods: ["get","head"],
    url: '/accounts/fee-hub',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:250
 * @route '/accounts/fee-hub'
 */
feeHub.url = (options?: RouteQueryOptions) => {
    return feeHub.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:250
 * @route '/accounts/fee-hub'
 */
feeHub.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: feeHub.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:250
 * @route '/accounts/fee-hub'
 */
feeHub.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: feeHub.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:250
 * @route '/accounts/fee-hub'
 */
    const feeHubForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: feeHub.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:250
 * @route '/accounts/fee-hub'
 */
        feeHubForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: feeHub.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:250
 * @route '/accounts/fee-hub'
 */
        feeHubForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: feeHub.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    feeHub.form = feeHubForm
const accounts = {
    feeHub: Object.assign(feeHub, feeHub),
expenses: Object.assign(expenses, expenses),
}

export default accounts