import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import subjects from './subjects'
import rooms from './rooms'
/**
 * @see routes/web.php:472
 * @route '/lms/classes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/lms/classes',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:472
 * @route '/lms/classes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:472
 * @route '/lms/classes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:472
 * @route '/lms/classes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:472
 * @route '/lms/classes'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:472
 * @route '/lms/classes'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:472
 * @route '/lms/classes'
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
 * @see routes/web.php:473
 * @route '/lms/classes/stream/{streamId}'
 */
export const stream = (args: { streamId: string | number } | [streamId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stream.url(args, options),
    method: 'get',
})

stream.definition = {
    methods: ["get","head"],
    url: '/lms/classes/stream/{streamId}',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:473
 * @route '/lms/classes/stream/{streamId}'
 */
stream.url = (args: { streamId: string | number } | [streamId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { streamId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    streamId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        streamId: args.streamId,
                }

    return stream.definition.url
            .replace('{streamId}', parsedArgs.streamId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see routes/web.php:473
 * @route '/lms/classes/stream/{streamId}'
 */
stream.get = (args: { streamId: string | number } | [streamId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stream.url(args, options),
    method: 'get',
})
/**
 * @see routes/web.php:473
 * @route '/lms/classes/stream/{streamId}'
 */
stream.head = (args: { streamId: string | number } | [streamId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stream.url(args, options),
    method: 'head',
})

    /**
 * @see routes/web.php:473
 * @route '/lms/classes/stream/{streamId}'
 */
    const streamForm = (args: { streamId: string | number } | [streamId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stream.url(args, options),
        method: 'get',
    })

            /**
 * @see routes/web.php:473
 * @route '/lms/classes/stream/{streamId}'
 */
        streamForm.get = (args: { streamId: string | number } | [streamId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stream.url(args, options),
            method: 'get',
        })
            /**
 * @see routes/web.php:473
 * @route '/lms/classes/stream/{streamId}'
 */
        streamForm.head = (args: { streamId: string | number } | [streamId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stream.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stream.form = streamForm
/**
 * @see routes/web.php:474
 * @route '/lms/classes/{id}'
 */
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/lms/classes/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:474
 * @route '/lms/classes/{id}'
 */
show.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see routes/web.php:474
 * @route '/lms/classes/{id}'
 */
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
 * @see routes/web.php:474
 * @route '/lms/classes/{id}'
 */
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
 * @see routes/web.php:474
 * @route '/lms/classes/{id}'
 */
    const showForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
 * @see routes/web.php:474
 * @route '/lms/classes/{id}'
 */
        showForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
 * @see routes/web.php:474
 * @route '/lms/classes/{id}'
 */
        showForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const classes = {
    index: Object.assign(index, index),
stream: Object.assign(stream, stream),
show: Object.assign(show, show),
subjects: Object.assign(subjects, subjects),
rooms: Object.assign(rooms, rooms),
}

export default classes