import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
 * @see routes/web.php:295
 * @route '/admission/analytics/promotions'
 */
export const promotions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: promotions.url(options),
    method: 'get',
})

promotions.definition = {
    methods: ["get","head"],
    url: '/admission/analytics/promotions',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:295
 * @route '/admission/analytics/promotions'
 */
promotions.url = (options?: RouteQueryOptions) => {
    return promotions.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:295
 * @route '/admission/analytics/promotions'
 */
promotions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: promotions.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:295
 * @route '/admission/analytics/promotions'
 */
promotions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: promotions.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:295
 * @route '/admission/analytics/promotions'
 */
    const promotionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: promotions.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:295
 * @route '/admission/analytics/promotions'
 */
        promotionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: promotions.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:295
 * @route '/admission/analytics/promotions'
 */
        promotionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: promotions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    promotions.form = promotionsForm
/**
 * @see routes/web.php:296
 * @route '/admission/analytics/readmissions'
 */
export const readmissions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: readmissions.url(options),
    method: 'get',
})

readmissions.definition = {
    methods: ["get","head"],
    url: '/admission/analytics/readmissions',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:296
 * @route '/admission/analytics/readmissions'
 */
readmissions.url = (options?: RouteQueryOptions) => {
    return readmissions.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:296
 * @route '/admission/analytics/readmissions'
 */
readmissions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: readmissions.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:296
 * @route '/admission/analytics/readmissions'
 */
readmissions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: readmissions.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:296
 * @route '/admission/analytics/readmissions'
 */
    const readmissionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: readmissions.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:296
 * @route '/admission/analytics/readmissions'
 */
        readmissionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: readmissions.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:296
 * @route '/admission/analytics/readmissions'
 */
        readmissionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: readmissions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    readmissions.form = readmissionsForm
const analytics = {
    promotions: Object.assign(promotions, promotions),
readmissions: Object.assign(readmissions, readmissions),
}

export default analytics