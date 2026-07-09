import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Organization\MainStreamController::toggleStatus
* @see app/Http/Controllers/Api/V1/Organization/MainStreamController.php:63
* @route '/api/v1/main-streams/{id}/toggle-status'
*/
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

toggleStatus.definition = {
    methods: ["patch"],
    url: '/api/v1/main-streams/{id}/toggle-status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\MainStreamController::toggleStatus
* @see app/Http/Controllers/Api/V1/Organization/MainStreamController.php:63
* @route '/api/v1/main-streams/{id}/toggle-status'
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
* @see \App\Http\Controllers\Api\V1\Organization\MainStreamController::toggleStatus
* @see app/Http/Controllers/Api/V1/Organization/MainStreamController.php:63
* @route '/api/v1/main-streams/{id}/toggle-status'
*/
toggleStatus.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\MainStreamController::index
* @see app/Http/Controllers/Api/V1/Organization/MainStreamController.php:12
* @route '/api/v1/main-streams'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/main-streams',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\MainStreamController::index
* @see app/Http/Controllers/Api/V1/Organization/MainStreamController.php:12
* @route '/api/v1/main-streams'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\MainStreamController::index
* @see app/Http/Controllers/Api/V1/Organization/MainStreamController.php:12
* @route '/api/v1/main-streams'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\MainStreamController::index
* @see app/Http/Controllers/Api/V1/Organization/MainStreamController.php:12
* @route '/api/v1/main-streams'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\MainStreamController::store
* @see app/Http/Controllers/Api/V1/Organization/MainStreamController.php:30
* @route '/api/v1/main-streams'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/main-streams',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\MainStreamController::store
* @see app/Http/Controllers/Api/V1/Organization/MainStreamController.php:30
* @route '/api/v1/main-streams'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\MainStreamController::store
* @see app/Http/Controllers/Api/V1/Organization/MainStreamController.php:30
* @route '/api/v1/main-streams'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\MainStreamController::show
* @see app/Http/Controllers/Api/V1/Organization/MainStreamController.php:41
* @route '/api/v1/main-streams/{main_stream}'
*/
export const show = (args: { main_stream: string | number } | [main_stream: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/main-streams/{main_stream}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\MainStreamController::show
* @see app/Http/Controllers/Api/V1/Organization/MainStreamController.php:41
* @route '/api/v1/main-streams/{main_stream}'
*/
show.url = (args: { main_stream: string | number } | [main_stream: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { main_stream: args }
    }

    if (Array.isArray(args)) {
        args = {
            main_stream: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        main_stream: args.main_stream,
    }

    return show.definition.url
            .replace('{main_stream}', parsedArgs.main_stream.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\MainStreamController::show
* @see app/Http/Controllers/Api/V1/Organization/MainStreamController.php:41
* @route '/api/v1/main-streams/{main_stream}'
*/
show.get = (args: { main_stream: string | number } | [main_stream: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\MainStreamController::show
* @see app/Http/Controllers/Api/V1/Organization/MainStreamController.php:41
* @route '/api/v1/main-streams/{main_stream}'
*/
show.head = (args: { main_stream: string | number } | [main_stream: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\MainStreamController::update
* @see app/Http/Controllers/Api/V1/Organization/MainStreamController.php:46
* @route '/api/v1/main-streams/{main_stream}'
*/
export const update = (args: { main_stream: string | number } | [main_stream: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/main-streams/{main_stream}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\MainStreamController::update
* @see app/Http/Controllers/Api/V1/Organization/MainStreamController.php:46
* @route '/api/v1/main-streams/{main_stream}'
*/
update.url = (args: { main_stream: string | number } | [main_stream: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { main_stream: args }
    }

    if (Array.isArray(args)) {
        args = {
            main_stream: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        main_stream: args.main_stream,
    }

    return update.definition.url
            .replace('{main_stream}', parsedArgs.main_stream.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\MainStreamController::update
* @see app/Http/Controllers/Api/V1/Organization/MainStreamController.php:46
* @route '/api/v1/main-streams/{main_stream}'
*/
update.put = (args: { main_stream: string | number } | [main_stream: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\MainStreamController::update
* @see app/Http/Controllers/Api/V1/Organization/MainStreamController.php:46
* @route '/api/v1/main-streams/{main_stream}'
*/
update.patch = (args: { main_stream: string | number } | [main_stream: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\MainStreamController::destroy
* @see app/Http/Controllers/Api/V1/Organization/MainStreamController.php:57
* @route '/api/v1/main-streams/{main_stream}'
*/
export const destroy = (args: { main_stream: string | number } | [main_stream: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/main-streams/{main_stream}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\MainStreamController::destroy
* @see app/Http/Controllers/Api/V1/Organization/MainStreamController.php:57
* @route '/api/v1/main-streams/{main_stream}'
*/
destroy.url = (args: { main_stream: string | number } | [main_stream: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { main_stream: args }
    }

    if (Array.isArray(args)) {
        args = {
            main_stream: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        main_stream: args.main_stream,
    }

    return destroy.definition.url
            .replace('{main_stream}', parsedArgs.main_stream.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\MainStreamController::destroy
* @see app/Http/Controllers/Api/V1/Organization/MainStreamController.php:57
* @route '/api/v1/main-streams/{main_stream}'
*/
destroy.delete = (args: { main_stream: string | number } | [main_stream: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const MainStreamController = { toggleStatus, index, store, show, update, destroy }

export default MainStreamController