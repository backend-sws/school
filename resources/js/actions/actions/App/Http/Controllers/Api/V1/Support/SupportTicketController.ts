import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Support\SupportTicketController::index
* @see app/Http/Controllers/Api/V1/Support/SupportTicketController.php:29
* @route '/api/v1/support/tickets'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/support/tickets',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Support\SupportTicketController::index
* @see app/Http/Controllers/Api/V1/Support/SupportTicketController.php:29
* @route '/api/v1/support/tickets'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Support\SupportTicketController::index
* @see app/Http/Controllers/Api/V1/Support/SupportTicketController.php:29
* @route '/api/v1/support/tickets'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Support\SupportTicketController::index
* @see app/Http/Controllers/Api/V1/Support/SupportTicketController.php:29
* @route '/api/v1/support/tickets'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Support\SupportTicketController::store
* @see app/Http/Controllers/Api/V1/Support/SupportTicketController.php:96
* @route '/api/v1/support/tickets/create'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/support/tickets/create',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Support\SupportTicketController::store
* @see app/Http/Controllers/Api/V1/Support/SupportTicketController.php:96
* @route '/api/v1/support/tickets/create'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Support\SupportTicketController::store
* @see app/Http/Controllers/Api/V1/Support/SupportTicketController.php:96
* @route '/api/v1/support/tickets/create'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Support\SupportTicketController::show
* @see app/Http/Controllers/Api/V1/Support/SupportTicketController.php:139
* @route '/api/v1/support/tickets/{id}'
*/
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/support/tickets/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Support\SupportTicketController::show
* @see app/Http/Controllers/Api/V1/Support/SupportTicketController.php:139
* @route '/api/v1/support/tickets/{id}'
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
* @see \App\Http\Controllers\Api\V1\Support\SupportTicketController::show
* @see app/Http/Controllers/Api/V1/Support/SupportTicketController.php:139
* @route '/api/v1/support/tickets/{id}'
*/
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Support\SupportTicketController::show
* @see app/Http/Controllers/Api/V1/Support/SupportTicketController.php:139
* @route '/api/v1/support/tickets/{id}'
*/
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Support\SupportTicketController::postReply
* @see app/Http/Controllers/Api/V1/Support/SupportTicketController.php:162
* @route '/api/v1/support/tickets/{id}/reply'
*/
export const postReply = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: postReply.url(args, options),
    method: 'post',
})

postReply.definition = {
    methods: ["post"],
    url: '/api/v1/support/tickets/{id}/reply',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Support\SupportTicketController::postReply
* @see app/Http/Controllers/Api/V1/Support/SupportTicketController.php:162
* @route '/api/v1/support/tickets/{id}/reply'
*/
postReply.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return postReply.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Support\SupportTicketController::postReply
* @see app/Http/Controllers/Api/V1/Support/SupportTicketController.php:162
* @route '/api/v1/support/tickets/{id}/reply'
*/
postReply.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: postReply.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Support\SupportTicketController::close
* @see app/Http/Controllers/Api/V1/Support/SupportTicketController.php:227
* @route '/api/v1/support/tickets/{id}/close'
*/
export const close = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(args, options),
    method: 'post',
})

close.definition = {
    methods: ["post"],
    url: '/api/v1/support/tickets/{id}/close',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Support\SupportTicketController::close
* @see app/Http/Controllers/Api/V1/Support/SupportTicketController.php:227
* @route '/api/v1/support/tickets/{id}/close'
*/
close.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return close.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Support\SupportTicketController::close
* @see app/Http/Controllers/Api/V1/Support/SupportTicketController.php:227
* @route '/api/v1/support/tickets/{id}/close'
*/
close.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Support\SupportTicketController::updatePriority
* @see app/Http/Controllers/Api/V1/Support/SupportTicketController.php:204
* @route '/api/v1/support/tickets/{id}/priority'
*/
export const updatePriority = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatePriority.url(args, options),
    method: 'patch',
})

updatePriority.definition = {
    methods: ["patch"],
    url: '/api/v1/support/tickets/{id}/priority',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Support\SupportTicketController::updatePriority
* @see app/Http/Controllers/Api/V1/Support/SupportTicketController.php:204
* @route '/api/v1/support/tickets/{id}/priority'
*/
updatePriority.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updatePriority.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Support\SupportTicketController::updatePriority
* @see app/Http/Controllers/Api/V1/Support/SupportTicketController.php:204
* @route '/api/v1/support/tickets/{id}/priority'
*/
updatePriority.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatePriority.url(args, options),
    method: 'patch',
})

const SupportTicketController = { index, store, show, postReply, close, updatePriority }

export default SupportTicketController