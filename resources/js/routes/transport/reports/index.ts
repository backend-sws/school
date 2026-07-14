import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
 * @see routes/web.php:419
 * @route '/transport/reports/manifest'
 */
export const manifest = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manifest.url(options),
    method: 'get',
})

manifest.definition = {
    methods: ["get","head"],
    url: '/transport/reports/manifest',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:419
 * @route '/transport/reports/manifest'
 */
manifest.url = (options?: RouteQueryOptions) => {
    return manifest.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:419
 * @route '/transport/reports/manifest'
 */
manifest.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manifest.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:419
 * @route '/transport/reports/manifest'
 */
manifest.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manifest.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:419
 * @route '/transport/reports/manifest'
 */
    const manifestForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: manifest.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:419
 * @route '/transport/reports/manifest'
 */
        manifestForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: manifest.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:419
 * @route '/transport/reports/manifest'
 */
        manifestForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: manifest.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    manifest.form = manifestForm
/**
 * @see routes/web.php:420
 * @route '/transport/reports/occupancy'
 */
export const occupancy = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: occupancy.url(options),
    method: 'get',
})

occupancy.definition = {
    methods: ["get","head"],
    url: '/transport/reports/occupancy',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:420
 * @route '/transport/reports/occupancy'
 */
occupancy.url = (options?: RouteQueryOptions) => {
    return occupancy.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:420
 * @route '/transport/reports/occupancy'
 */
occupancy.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: occupancy.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:420
 * @route '/transport/reports/occupancy'
 */
occupancy.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: occupancy.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:420
 * @route '/transport/reports/occupancy'
 */
    const occupancyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: occupancy.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:420
 * @route '/transport/reports/occupancy'
 */
        occupancyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: occupancy.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:420
 * @route '/transport/reports/occupancy'
 */
        occupancyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: occupancy.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    occupancy.form = occupancyForm
const reports = {
    manifest: Object.assign(manifest, manifest),
occupancy: Object.assign(occupancy, occupancy),
}

export default reports