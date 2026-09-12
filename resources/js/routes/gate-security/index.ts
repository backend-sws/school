import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
 * @see routes/web.php:448
 * @route '/gate-security'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/gate-security',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:448
 * @route '/gate-security'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:448
 * @route '/gate-security'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:448
 * @route '/gate-security'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:448
 * @route '/gate-security'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:448
 * @route '/gate-security'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:448
 * @route '/gate-security'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
 * @see routes/web.php:449
 * @route '/gate-security/visitors'
 */
export const visitors = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: visitors.url(options),
    method: 'get',
})

visitors.definition = {
    methods: ["get","head"],
    url: '/gate-security/visitors',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:449
 * @route '/gate-security/visitors'
 */
visitors.url = (options?: RouteQueryOptions) => {
    return visitors.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:449
 * @route '/gate-security/visitors'
 */
visitors.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: visitors.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:449
 * @route '/gate-security/visitors'
 */
visitors.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: visitors.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:449
 * @route '/gate-security/visitors'
 */
    const visitorsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: visitors.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:449
 * @route '/gate-security/visitors'
 */
        visitorsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: visitors.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:449
 * @route '/gate-security/visitors'
 */
        visitorsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: visitors.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    visitors.form = visitorsForm
const gateSecurity = {
    index: Object.assign(index, index),
visitors: Object.assign(visitors, visitors),
}

export default gateSecurity