import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
 * @see routes/web.php:235
 * @route '/fee-payment/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/fee-payment/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:235
 * @route '/fee-payment/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:235
 * @route '/fee-payment/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:235
 * @route '/fee-payment/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:235
 * @route '/fee-payment/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:235
 * @route '/fee-payment/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:235
 * @route '/fee-payment/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
 * @see routes/web.php:236
 * @route '/fee-payment/manage-fee-head'
 */
export const manageFeeHead = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageFeeHead.url(options),
    method: 'get',
})

manageFeeHead.definition = {
    methods: ["get","head"],
    url: '/fee-payment/manage-fee-head',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:236
 * @route '/fee-payment/manage-fee-head'
 */
manageFeeHead.url = (options?: RouteQueryOptions) => {
    return manageFeeHead.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:236
 * @route '/fee-payment/manage-fee-head'
 */
manageFeeHead.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageFeeHead.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:236
 * @route '/fee-payment/manage-fee-head'
 */
manageFeeHead.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manageFeeHead.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:236
 * @route '/fee-payment/manage-fee-head'
 */
    const manageFeeHeadForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: manageFeeHead.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:236
 * @route '/fee-payment/manage-fee-head'
 */
        manageFeeHeadForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: manageFeeHead.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:236
 * @route '/fee-payment/manage-fee-head'
 */
        manageFeeHeadForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: manageFeeHead.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    manageFeeHead.form = manageFeeHeadForm
const feePayment = {
    dashboard: Object.assign(dashboard, dashboard),
manageFeeHead: Object.assign(manageFeeHead, manageFeeHead),
}

export default feePayment