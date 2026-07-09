import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
 * @see routes/web.php:474
 * @route '/lms/classes/{id}/subjects/{allocationId}'
 */
export const show = (args: { id: string | number, allocationId: string | number } | [id: string | number, allocationId: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/lms/classes/{id}/subjects/{allocationId}',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:474
 * @route '/lms/classes/{id}/subjects/{allocationId}'
 */
show.url = (args: { id: string | number, allocationId: string | number } | [id: string | number, allocationId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                    allocationId: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                                allocationId: args.allocationId,
                }

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace('{allocationId}', parsedArgs.allocationId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see routes/web.php:474
 * @route '/lms/classes/{id}/subjects/{allocationId}'
 */
show.get = (args: { id: string | number, allocationId: string | number } | [id: string | number, allocationId: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
 * @see routes/web.php:474
 * @route '/lms/classes/{id}/subjects/{allocationId}'
 */
show.head = (args: { id: string | number, allocationId: string | number } | [id: string | number, allocationId: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
 * @see routes/web.php:474
 * @route '/lms/classes/{id}/subjects/{allocationId}'
 */
    const showForm = (args: { id: string | number, allocationId: string | number } | [id: string | number, allocationId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
 * @see routes/web.php:474
 * @route '/lms/classes/{id}/subjects/{allocationId}'
 */
        showForm.get = (args: { id: string | number, allocationId: string | number } | [id: string | number, allocationId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
 * @see routes/web.php:474
 * @route '/lms/classes/{id}/subjects/{allocationId}'
 */
        showForm.head = (args: { id: string | number, allocationId: string | number } | [id: string | number, allocationId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const subjects = {
    show: Object.assign(show, show),
}

export default subjects