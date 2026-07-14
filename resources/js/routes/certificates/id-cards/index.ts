import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import templates from './templates'
/**
 * @see routes/web.php:361
 * @route '/certificates/id-cards'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/certificates/id-cards',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:361
 * @route '/certificates/id-cards'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:361
 * @route '/certificates/id-cards'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:361
 * @route '/certificates/id-cards'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:361
 * @route '/certificates/id-cards'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:361
 * @route '/certificates/id-cards'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:361
 * @route '/certificates/id-cards'
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
 * @see routes/web.php:365
 * @route '/certificates/id-cards/generate'
 */
export const generate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generate.url(options),
    method: 'get',
})

generate.definition = {
    methods: ["get","head"],
    url: '/certificates/id-cards/generate',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:365
 * @route '/certificates/id-cards/generate'
 */
generate.url = (options?: RouteQueryOptions) => {
    return generate.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:365
 * @route '/certificates/id-cards/generate'
 */
generate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generate.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:365
 * @route '/certificates/id-cards/generate'
 */
generate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: generate.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:365
 * @route '/certificates/id-cards/generate'
 */
    const generateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: generate.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:365
 * @route '/certificates/id-cards/generate'
 */
        generateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generate.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:365
 * @route '/certificates/id-cards/generate'
 */
        generateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generate.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    generate.form = generateForm
/**
 * @see routes/web.php:366
 * @route '/certificates/id-cards/{id}'
 */
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/certificates/id-cards/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:366
 * @route '/certificates/id-cards/{id}'
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
 * @see routes/web.php:366
 * @route '/certificates/id-cards/{id}'
 */
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
 * @see routes/web.php:366
 * @route '/certificates/id-cards/{id}'
 */
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
 * @see routes/web.php:366
 * @route '/certificates/id-cards/{id}'
 */
    const showForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
 * @see routes/web.php:366
 * @route '/certificates/id-cards/{id}'
 */
        showForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
 * @see routes/web.php:366
 * @route '/certificates/id-cards/{id}'
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
const idCards = {
    index: Object.assign(index, index),
templates: Object.assign(templates, templates),
generate: Object.assign(generate, generate),
show: Object.assign(show, show),
}

export default idCards