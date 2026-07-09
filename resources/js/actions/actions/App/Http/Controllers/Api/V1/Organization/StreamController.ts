import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::toggleStatus
* @see app/Http/Controllers/Api/V1/Organization/StreamController.php:81
* @route '/api/v1/streams/{id}/toggle-status'
*/
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

toggleStatus.definition = {
    methods: ["patch"],
    url: '/api/v1/streams/{id}/toggle-status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::toggleStatus
* @see app/Http/Controllers/Api/V1/Organization/StreamController.php:81
* @route '/api/v1/streams/{id}/toggle-status'
*/
toggleStatus.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleStatus.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::toggleStatus
* @see app/Http/Controllers/Api/V1/Organization/StreamController.php:81
* @route '/api/v1/streams/{id}/toggle-status'
*/
toggleStatus.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::index
* @see app/Http/Controllers/Api/V1/Organization/StreamController.php:12
* @route '/api/v1/streams'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/streams',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::index
* @see app/Http/Controllers/Api/V1/Organization/StreamController.php:12
* @route '/api/v1/streams'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::index
* @see app/Http/Controllers/Api/V1/Organization/StreamController.php:12
* @route '/api/v1/streams'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::index
* @see app/Http/Controllers/Api/V1/Organization/StreamController.php:12
* @route '/api/v1/streams'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::store
* @see app/Http/Controllers/Api/V1/Organization/StreamController.php:34
* @route '/api/v1/streams'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/streams',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::store
* @see app/Http/Controllers/Api/V1/Organization/StreamController.php:34
* @route '/api/v1/streams'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::store
* @see app/Http/Controllers/Api/V1/Organization/StreamController.php:34
* @route '/api/v1/streams'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::show
* @see app/Http/Controllers/Api/V1/Organization/StreamController.php:55
* @route '/api/v1/streams/{stream}'
*/
export const show = (args: { stream: string | number } | [stream: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/streams/{stream}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::show
* @see app/Http/Controllers/Api/V1/Organization/StreamController.php:55
* @route '/api/v1/streams/{stream}'
*/
show.url = (args: { stream: string | number } | [stream: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { stream: args }
    }

    if (Array.isArray(args)) {
        args = {
            stream: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        stream: args.stream,
    }

    return show.definition.url
            .replace('{stream}', parsedArgs.stream.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::show
* @see app/Http/Controllers/Api/V1/Organization/StreamController.php:55
* @route '/api/v1/streams/{stream}'
*/
show.get = (args: { stream: string | number } | [stream: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::show
* @see app/Http/Controllers/Api/V1/Organization/StreamController.php:55
* @route '/api/v1/streams/{stream}'
*/
show.head = (args: { stream: string | number } | [stream: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::update
* @see app/Http/Controllers/Api/V1/Organization/StreamController.php:61
* @route '/api/v1/streams/{stream}'
*/
export const update = (args: { stream: number | { id: number } } | [stream: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/streams/{stream}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::update
* @see app/Http/Controllers/Api/V1/Organization/StreamController.php:61
* @route '/api/v1/streams/{stream}'
*/
update.url = (args: { stream: number | { id: number } } | [stream: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { stream: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { stream: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            stream: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        stream: typeof args.stream === 'object'
        ? args.stream.id
        : args.stream,
    }

    return update.definition.url
            .replace('{stream}', parsedArgs.stream.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::update
* @see app/Http/Controllers/Api/V1/Organization/StreamController.php:61
* @route '/api/v1/streams/{stream}'
*/
update.put = (args: { stream: number | { id: number } } | [stream: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::update
* @see app/Http/Controllers/Api/V1/Organization/StreamController.php:61
* @route '/api/v1/streams/{stream}'
*/
update.patch = (args: { stream: number | { id: number } } | [stream: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::destroy
* @see app/Http/Controllers/Api/V1/Organization/StreamController.php:75
* @route '/api/v1/streams/{stream}'
*/
export const destroy = (args: { stream: number | { id: number } } | [stream: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/streams/{stream}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::destroy
* @see app/Http/Controllers/Api/V1/Organization/StreamController.php:75
* @route '/api/v1/streams/{stream}'
*/
destroy.url = (args: { stream: number | { id: number } } | [stream: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { stream: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { stream: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            stream: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        stream: typeof args.stream === 'object'
        ? args.stream.id
        : args.stream,
    }

    return destroy.definition.url
            .replace('{stream}', parsedArgs.stream.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::destroy
* @see app/Http/Controllers/Api/V1/Organization/StreamController.php:75
* @route '/api/v1/streams/{stream}'
*/
destroy.delete = (args: { stream: number | { id: number } } | [stream: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const StreamController = { toggleStatus, index, store, show, update, destroy }

export default StreamController