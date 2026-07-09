import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
 * @see routes/web.php:475
 * @route '/lms/classes/{id}/rooms/{roomId}'
 */
export const show = (args: { id: string | number, roomId: string | number } | [id: string | number, roomId: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/lms/classes/{id}/rooms/{roomId}',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:475
 * @route '/lms/classes/{id}/rooms/{roomId}'
 */
show.url = (args: { id: string | number, roomId: string | number } | [id: string | number, roomId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                    roomId: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                                roomId: args.roomId,
                }

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace('{roomId}', parsedArgs.roomId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see routes/web.php:475
 * @route '/lms/classes/{id}/rooms/{roomId}'
 */
show.get = (args: { id: string | number, roomId: string | number } | [id: string | number, roomId: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
 * @see routes/web.php:475
 * @route '/lms/classes/{id}/rooms/{roomId}'
 */
show.head = (args: { id: string | number, roomId: string | number } | [id: string | number, roomId: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
 * @see routes/web.php:475
 * @route '/lms/classes/{id}/rooms/{roomId}'
 */
    const showForm = (args: { id: string | number, roomId: string | number } | [id: string | number, roomId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
 * @see routes/web.php:475
 * @route '/lms/classes/{id}/rooms/{roomId}'
 */
        showForm.get = (args: { id: string | number, roomId: string | number } | [id: string | number, roomId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
 * @see routes/web.php:475
 * @route '/lms/classes/{id}/rooms/{roomId}'
 */
        showForm.head = (args: { id: string | number, roomId: string | number } | [id: string | number, roomId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const rooms = {
    show: Object.assign(show, show),
}

export default rooms