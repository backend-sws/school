import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Grievance\GrievanceController::publicStore
* @see app/Http/Controllers/Api/V1/Grievance/GrievanceController.php:0
* @route '/api/v1/public/grievances'
*/
export const publicStore = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publicStore.url(options),
    method: 'post',
})

publicStore.definition = {
    methods: ["post"],
    url: '/api/v1/public/grievances',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Grievance\GrievanceController::publicStore
* @see app/Http/Controllers/Api/V1/Grievance/GrievanceController.php:0
* @route '/api/v1/public/grievances'
*/
publicStore.url = (options?: RouteQueryOptions) => {
    return publicStore.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Grievance\GrievanceController::publicStore
* @see app/Http/Controllers/Api/V1/Grievance/GrievanceController.php:0
* @route '/api/v1/public/grievances'
*/
publicStore.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publicStore.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Grievance\GrievanceController::index
* @see app/Http/Controllers/Api/V1/Grievance/GrievanceController.php:62
* @route '/api/v1/grievances'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/grievances',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Grievance\GrievanceController::index
* @see app/Http/Controllers/Api/V1/Grievance/GrievanceController.php:62
* @route '/api/v1/grievances'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Grievance\GrievanceController::index
* @see app/Http/Controllers/Api/V1/Grievance/GrievanceController.php:62
* @route '/api/v1/grievances'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Grievance\GrievanceController::index
* @see app/Http/Controllers/Api/V1/Grievance/GrievanceController.php:62
* @route '/api/v1/grievances'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Grievance\GrievanceController::store
* @see app/Http/Controllers/Api/V1/Grievance/GrievanceController.php:114
* @route '/api/v1/grievances'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/grievances',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Grievance\GrievanceController::store
* @see app/Http/Controllers/Api/V1/Grievance/GrievanceController.php:114
* @route '/api/v1/grievances'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Grievance\GrievanceController::store
* @see app/Http/Controllers/Api/V1/Grievance/GrievanceController.php:114
* @route '/api/v1/grievances'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Grievance\GrievanceController::show
* @see app/Http/Controllers/Api/V1/Grievance/GrievanceController.php:155
* @route '/api/v1/grievances/{grievance}'
*/
export const show = (args: { grievance: number | { id: number } } | [grievance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/grievances/{grievance}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Grievance\GrievanceController::show
* @see app/Http/Controllers/Api/V1/Grievance/GrievanceController.php:155
* @route '/api/v1/grievances/{grievance}'
*/
show.url = (args: { grievance: number | { id: number } } | [grievance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { grievance: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { grievance: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            grievance: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        grievance: typeof args.grievance === 'object'
        ? args.grievance.id
        : args.grievance,
    }

    return show.definition.url
            .replace('{grievance}', parsedArgs.grievance.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Grievance\GrievanceController::show
* @see app/Http/Controllers/Api/V1/Grievance/GrievanceController.php:155
* @route '/api/v1/grievances/{grievance}'
*/
show.get = (args: { grievance: number | { id: number } } | [grievance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Grievance\GrievanceController::show
* @see app/Http/Controllers/Api/V1/Grievance/GrievanceController.php:155
* @route '/api/v1/grievances/{grievance}'
*/
show.head = (args: { grievance: number | { id: number } } | [grievance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Grievance\GrievanceController::update
* @see app/Http/Controllers/Api/V1/Grievance/GrievanceController.php:171
* @route '/api/v1/grievances/{grievance}'
*/
export const update = (args: { grievance: number | { id: number } } | [grievance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/grievances/{grievance}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Grievance\GrievanceController::update
* @see app/Http/Controllers/Api/V1/Grievance/GrievanceController.php:171
* @route '/api/v1/grievances/{grievance}'
*/
update.url = (args: { grievance: number | { id: number } } | [grievance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { grievance: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { grievance: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            grievance: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        grievance: typeof args.grievance === 'object'
        ? args.grievance.id
        : args.grievance,
    }

    return update.definition.url
            .replace('{grievance}', parsedArgs.grievance.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Grievance\GrievanceController::update
* @see app/Http/Controllers/Api/V1/Grievance/GrievanceController.php:171
* @route '/api/v1/grievances/{grievance}'
*/
update.put = (args: { grievance: number | { id: number } } | [grievance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Grievance\GrievanceController::update
* @see app/Http/Controllers/Api/V1/Grievance/GrievanceController.php:171
* @route '/api/v1/grievances/{grievance}'
*/
update.patch = (args: { grievance: number | { id: number } } | [grievance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Grievance\GrievanceController::destroy
* @see app/Http/Controllers/Api/V1/Grievance/GrievanceController.php:225
* @route '/api/v1/grievances/{grievance}'
*/
export const destroy = (args: { grievance: number | { id: number } } | [grievance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/grievances/{grievance}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Grievance\GrievanceController::destroy
* @see app/Http/Controllers/Api/V1/Grievance/GrievanceController.php:225
* @route '/api/v1/grievances/{grievance}'
*/
destroy.url = (args: { grievance: number | { id: number } } | [grievance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { grievance: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { grievance: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            grievance: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        grievance: typeof args.grievance === 'object'
        ? args.grievance.id
        : args.grievance,
    }

    return destroy.definition.url
            .replace('{grievance}', parsedArgs.grievance.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Grievance\GrievanceController::destroy
* @see app/Http/Controllers/Api/V1/Grievance/GrievanceController.php:225
* @route '/api/v1/grievances/{grievance}'
*/
destroy.delete = (args: { grievance: number | { id: number } } | [grievance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\Grievance\GrievanceController::resolve
* @see app/Http/Controllers/Api/V1/Grievance/GrievanceController.php:199
* @route '/api/v1/grievances/{grievance}/resolve'
*/
export const resolve = (args: { grievance: number | { id: number } } | [grievance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolve.url(args, options),
    method: 'post',
})

resolve.definition = {
    methods: ["post"],
    url: '/api/v1/grievances/{grievance}/resolve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Grievance\GrievanceController::resolve
* @see app/Http/Controllers/Api/V1/Grievance/GrievanceController.php:199
* @route '/api/v1/grievances/{grievance}/resolve'
*/
resolve.url = (args: { grievance: number | { id: number } } | [grievance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { grievance: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { grievance: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            grievance: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        grievance: typeof args.grievance === 'object'
        ? args.grievance.id
        : args.grievance,
    }

    return resolve.definition.url
            .replace('{grievance}', parsedArgs.grievance.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Grievance\GrievanceController::resolve
* @see app/Http/Controllers/Api/V1/Grievance/GrievanceController.php:199
* @route '/api/v1/grievances/{grievance}/resolve'
*/
resolve.post = (args: { grievance: number | { id: number } } | [grievance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolve.url(args, options),
    method: 'post',
})

const GrievanceController = { publicStore, index, store, show, update, destroy, resolve }

export default GrievanceController