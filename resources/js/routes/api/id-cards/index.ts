import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::index
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:19
 * @route '/api/v1/id-cards'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/id-cards',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::index
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:19
 * @route '/api/v1/id-cards'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::index
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:19
 * @route '/api/v1/id-cards'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::index
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:19
 * @route '/api/v1/id-cards'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::index
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:19
 * @route '/api/v1/id-cards'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::index
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:19
 * @route '/api/v1/id-cards'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::index
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:19
 * @route '/api/v1/id-cards'
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
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::show
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:25
 * @route '/api/v1/id-cards/{id_card}'
 */
export const show = (args: { id_card: string | number } | [id_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/id-cards/{id_card}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::show
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:25
 * @route '/api/v1/id-cards/{id_card}'
 */
show.url = (args: { id_card: string | number } | [id_card: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id_card: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id_card: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id_card: args.id_card,
                }

    return show.definition.url
            .replace('{id_card}', parsedArgs.id_card.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::show
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:25
 * @route '/api/v1/id-cards/{id_card}'
 */
show.get = (args: { id_card: string | number } | [id_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::show
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:25
 * @route '/api/v1/id-cards/{id_card}'
 */
show.head = (args: { id_card: string | number } | [id_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::show
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:25
 * @route '/api/v1/id-cards/{id_card}'
 */
    const showForm = (args: { id_card: string | number } | [id_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::show
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:25
 * @route '/api/v1/id-cards/{id_card}'
 */
        showForm.get = (args: { id_card: string | number } | [id_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::show
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:25
 * @route '/api/v1/id-cards/{id_card}'
 */
        showForm.head = (args: { id_card: string | number } | [id_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
show: Object.assign(show, show),
}

export default idCards