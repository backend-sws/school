import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::restoreDefaults
* @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:140
* @route '/api/v1/fee-types/restore-defaults'
*/
export const restoreDefaults = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restoreDefaults.url(options),
    method: 'post',
})

restoreDefaults.definition = {
    methods: ["post"],
    url: '/api/v1/fee-types/restore-defaults',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::restoreDefaults
* @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:140
* @route '/api/v1/fee-types/restore-defaults'
*/
restoreDefaults.url = (options?: RouteQueryOptions) => {
    return restoreDefaults.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::restoreDefaults
* @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:140
* @route '/api/v1/fee-types/restore-defaults'
*/
restoreDefaults.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restoreDefaults.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::index
* @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:21
* @route '/api/v1/fee-types'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/fee-types',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::index
* @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:21
* @route '/api/v1/fee-types'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::index
* @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:21
* @route '/api/v1/fee-types'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::index
* @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:21
* @route '/api/v1/fee-types'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::store
* @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:60
* @route '/api/v1/fee-types'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/fee-types',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::store
* @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:60
* @route '/api/v1/fee-types'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::store
* @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:60
* @route '/api/v1/fee-types'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::show
* @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:87
* @route '/api/v1/fee-types/{fee_type}'
*/
export const show = (args: { fee_type: number | { id: number } } | [fee_type: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/fee-types/{fee_type}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::show
* @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:87
* @route '/api/v1/fee-types/{fee_type}'
*/
show.url = (args: { fee_type: number | { id: number } } | [fee_type: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fee_type: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { fee_type: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            fee_type: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        fee_type: typeof args.fee_type === 'object'
        ? args.fee_type.id
        : args.fee_type,
    }

    return show.definition.url
            .replace('{fee_type}', parsedArgs.fee_type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::show
* @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:87
* @route '/api/v1/fee-types/{fee_type}'
*/
show.get = (args: { fee_type: number | { id: number } } | [fee_type: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::show
* @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:87
* @route '/api/v1/fee-types/{fee_type}'
*/
show.head = (args: { fee_type: number | { id: number } } | [fee_type: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::update
* @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:100
* @route '/api/v1/fee-types/{fee_type}'
*/
export const update = (args: { fee_type: number | { id: number } } | [fee_type: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/fee-types/{fee_type}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::update
* @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:100
* @route '/api/v1/fee-types/{fee_type}'
*/
update.url = (args: { fee_type: number | { id: number } } | [fee_type: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fee_type: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { fee_type: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            fee_type: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        fee_type: typeof args.fee_type === 'object'
        ? args.fee_type.id
        : args.fee_type,
    }

    return update.definition.url
            .replace('{fee_type}', parsedArgs.fee_type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::update
* @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:100
* @route '/api/v1/fee-types/{fee_type}'
*/
update.put = (args: { fee_type: number | { id: number } } | [fee_type: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::update
* @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:100
* @route '/api/v1/fee-types/{fee_type}'
*/
update.patch = (args: { fee_type: number | { id: number } } | [fee_type: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::destroy
* @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:124
* @route '/api/v1/fee-types/{fee_type}'
*/
export const destroy = (args: { fee_type: number | { id: number } } | [fee_type: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/fee-types/{fee_type}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::destroy
* @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:124
* @route '/api/v1/fee-types/{fee_type}'
*/
destroy.url = (args: { fee_type: number | { id: number } } | [fee_type: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fee_type: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { fee_type: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            fee_type: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        fee_type: typeof args.fee_type === 'object'
        ? args.fee_type.id
        : args.fee_type,
    }

    return destroy.definition.url
            .replace('{fee_type}', parsedArgs.fee_type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::destroy
* @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:124
* @route '/api/v1/fee-types/{fee_type}'
*/
destroy.delete = (args: { fee_type: number | { id: number } } | [fee_type: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const FeeTypeController = { restoreDefaults, index, store, show, update, destroy }

export default FeeTypeController