import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryCopyController::index
* @see app/Http/Controllers/Api/V1/Library/LibraryCopyController.php:12
* @route '/api/v1/library/copies'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/library/copies',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryCopyController::index
* @see app/Http/Controllers/Api/V1/Library/LibraryCopyController.php:12
* @route '/api/v1/library/copies'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryCopyController::index
* @see app/Http/Controllers/Api/V1/Library/LibraryCopyController.php:12
* @route '/api/v1/library/copies'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryCopyController::index
* @see app/Http/Controllers/Api/V1/Library/LibraryCopyController.php:12
* @route '/api/v1/library/copies'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryCopyController::store
* @see app/Http/Controllers/Api/V1/Library/LibraryCopyController.php:42
* @route '/api/v1/library/copies'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/library/copies',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryCopyController::store
* @see app/Http/Controllers/Api/V1/Library/LibraryCopyController.php:42
* @route '/api/v1/library/copies'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryCopyController::store
* @see app/Http/Controllers/Api/V1/Library/LibraryCopyController.php:42
* @route '/api/v1/library/copies'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryCopyController::show
* @see app/Http/Controllers/Api/V1/Library/LibraryCopyController.php:62
* @route '/api/v1/library/copies/{library_copy}'
*/
export const show = (args: { library_copy: number | { id: number } } | [library_copy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/library/copies/{library_copy}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryCopyController::show
* @see app/Http/Controllers/Api/V1/Library/LibraryCopyController.php:62
* @route '/api/v1/library/copies/{library_copy}'
*/
show.url = (args: { library_copy: number | { id: number } } | [library_copy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { library_copy: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { library_copy: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            library_copy: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        library_copy: typeof args.library_copy === 'object'
        ? args.library_copy.id
        : args.library_copy,
    }

    return show.definition.url
            .replace('{library_copy}', parsedArgs.library_copy.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryCopyController::show
* @see app/Http/Controllers/Api/V1/Library/LibraryCopyController.php:62
* @route '/api/v1/library/copies/{library_copy}'
*/
show.get = (args: { library_copy: number | { id: number } } | [library_copy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryCopyController::show
* @see app/Http/Controllers/Api/V1/Library/LibraryCopyController.php:62
* @route '/api/v1/library/copies/{library_copy}'
*/
show.head = (args: { library_copy: number | { id: number } } | [library_copy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryCopyController::update
* @see app/Http/Controllers/Api/V1/Library/LibraryCopyController.php:71
* @route '/api/v1/library/copies/{library_copy}'
*/
export const update = (args: { library_copy: number | { id: number } } | [library_copy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/library/copies/{library_copy}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryCopyController::update
* @see app/Http/Controllers/Api/V1/Library/LibraryCopyController.php:71
* @route '/api/v1/library/copies/{library_copy}'
*/
update.url = (args: { library_copy: number | { id: number } } | [library_copy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { library_copy: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { library_copy: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            library_copy: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        library_copy: typeof args.library_copy === 'object'
        ? args.library_copy.id
        : args.library_copy,
    }

    return update.definition.url
            .replace('{library_copy}', parsedArgs.library_copy.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryCopyController::update
* @see app/Http/Controllers/Api/V1/Library/LibraryCopyController.php:71
* @route '/api/v1/library/copies/{library_copy}'
*/
update.put = (args: { library_copy: number | { id: number } } | [library_copy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryCopyController::update
* @see app/Http/Controllers/Api/V1/Library/LibraryCopyController.php:71
* @route '/api/v1/library/copies/{library_copy}'
*/
update.patch = (args: { library_copy: number | { id: number } } | [library_copy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryCopyController::destroy
* @see app/Http/Controllers/Api/V1/Library/LibraryCopyController.php:88
* @route '/api/v1/library/copies/{library_copy}'
*/
export const destroy = (args: { library_copy: number | { id: number } } | [library_copy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/library/copies/{library_copy}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryCopyController::destroy
* @see app/Http/Controllers/Api/V1/Library/LibraryCopyController.php:88
* @route '/api/v1/library/copies/{library_copy}'
*/
destroy.url = (args: { library_copy: number | { id: number } } | [library_copy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { library_copy: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { library_copy: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            library_copy: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        library_copy: typeof args.library_copy === 'object'
        ? args.library_copy.id
        : args.library_copy,
    }

    return destroy.definition.url
            .replace('{library_copy}', parsedArgs.library_copy.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryCopyController::destroy
* @see app/Http/Controllers/Api/V1/Library/LibraryCopyController.php:88
* @route '/api/v1/library/copies/{library_copy}'
*/
destroy.delete = (args: { library_copy: number | { id: number } } | [library_copy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const LibraryCopyController = { index, store, show, update, destroy }

export default LibraryCopyController