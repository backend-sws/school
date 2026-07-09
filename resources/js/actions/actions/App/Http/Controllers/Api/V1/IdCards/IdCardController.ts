import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::generate
* @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:34
* @route '/api/v1/id-cards/generate'
*/
export const generate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generate.url(options),
    method: 'post',
})

generate.definition = {
    methods: ["post"],
    url: '/api/v1/id-cards/generate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::generate
* @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:34
* @route '/api/v1/id-cards/generate'
*/
generate.url = (options?: RouteQueryOptions) => {
    return generate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::generate
* @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:34
* @route '/api/v1/id-cards/generate'
*/
generate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::bulkDownload
* @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:118
* @route '/api/v1/id-cards/bulk-download'
*/
export const bulkDownload = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulkDownload.url(options),
    method: 'get',
})

bulkDownload.definition = {
    methods: ["get","head"],
    url: '/api/v1/id-cards/bulk-download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::bulkDownload
* @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:118
* @route '/api/v1/id-cards/bulk-download'
*/
bulkDownload.url = (options?: RouteQueryOptions) => {
    return bulkDownload.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::bulkDownload
* @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:118
* @route '/api/v1/id-cards/bulk-download'
*/
bulkDownload.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulkDownload.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::bulkDownload
* @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:118
* @route '/api/v1/id-cards/bulk-download'
*/
bulkDownload.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bulkDownload.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::regenerate
* @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:81
* @route '/api/v1/id-cards/{id}/regenerate'
*/
export const regenerate = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: regenerate.url(args, options),
    method: 'post',
})

regenerate.definition = {
    methods: ["post"],
    url: '/api/v1/id-cards/{id}/regenerate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::regenerate
* @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:81
* @route '/api/v1/id-cards/{id}/regenerate'
*/
regenerate.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return regenerate.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::regenerate
* @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:81
* @route '/api/v1/id-cards/{id}/regenerate'
*/
regenerate.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: regenerate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::revoke
* @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:90
* @route '/api/v1/id-cards/{id}/revoke'
*/
export const revoke = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: revoke.url(args, options),
    method: 'patch',
})

revoke.definition = {
    methods: ["patch"],
    url: '/api/v1/id-cards/{id}/revoke',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::revoke
* @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:90
* @route '/api/v1/id-cards/{id}/revoke'
*/
revoke.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return revoke.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::revoke
* @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:90
* @route '/api/v1/id-cards/{id}/revoke'
*/
revoke.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: revoke.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::download
* @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:99
* @route '/api/v1/id-cards/{id}/download'
*/
export const download = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/api/v1/id-cards/{id}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::download
* @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:99
* @route '/api/v1/id-cards/{id}/download'
*/
download.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return download.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::download
* @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:99
* @route '/api/v1/id-cards/{id}/download'
*/
download.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardController::download
* @see app/Http/Controllers/Api/V1/IdCards/IdCardController.php:99
* @route '/api/v1/id-cards/{id}/download'
*/
download.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

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

const IdCardController = { generate, bulkDownload, regenerate, revoke, download, index, show }

export default IdCardController