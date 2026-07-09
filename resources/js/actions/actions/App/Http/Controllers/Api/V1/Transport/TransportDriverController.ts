import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::index
* @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:13
* @route '/api/v1/transport/drivers'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/drivers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::index
* @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:13
* @route '/api/v1/transport/drivers'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::index
* @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:13
* @route '/api/v1/transport/drivers'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::index
* @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:13
* @route '/api/v1/transport/drivers'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::store
* @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:41
* @route '/api/v1/transport/drivers'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/transport/drivers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::store
* @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:41
* @route '/api/v1/transport/drivers'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::store
* @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:41
* @route '/api/v1/transport/drivers'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::show
* @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:67
* @route '/api/v1/transport/drivers/{transport_driver}'
*/
export const show = (args: { transport_driver: number | { id: number } } | [transport_driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/drivers/{transport_driver}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::show
* @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:67
* @route '/api/v1/transport/drivers/{transport_driver}'
*/
show.url = (args: { transport_driver: number | { id: number } } | [transport_driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transport_driver: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { transport_driver: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            transport_driver: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        transport_driver: typeof args.transport_driver === 'object'
        ? args.transport_driver.id
        : args.transport_driver,
    }

    return show.definition.url
            .replace('{transport_driver}', parsedArgs.transport_driver.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::show
* @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:67
* @route '/api/v1/transport/drivers/{transport_driver}'
*/
show.get = (args: { transport_driver: number | { id: number } } | [transport_driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::show
* @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:67
* @route '/api/v1/transport/drivers/{transport_driver}'
*/
show.head = (args: { transport_driver: number | { id: number } } | [transport_driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::update
* @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:78
* @route '/api/v1/transport/drivers/{transport_driver}'
*/
export const update = (args: { transport_driver: number | { id: number } } | [transport_driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/transport/drivers/{transport_driver}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::update
* @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:78
* @route '/api/v1/transport/drivers/{transport_driver}'
*/
update.url = (args: { transport_driver: number | { id: number } } | [transport_driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transport_driver: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { transport_driver: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            transport_driver: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        transport_driver: typeof args.transport_driver === 'object'
        ? args.transport_driver.id
        : args.transport_driver,
    }

    return update.definition.url
            .replace('{transport_driver}', parsedArgs.transport_driver.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::update
* @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:78
* @route '/api/v1/transport/drivers/{transport_driver}'
*/
update.put = (args: { transport_driver: number | { id: number } } | [transport_driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::update
* @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:78
* @route '/api/v1/transport/drivers/{transport_driver}'
*/
update.patch = (args: { transport_driver: number | { id: number } } | [transport_driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::destroy
* @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:99
* @route '/api/v1/transport/drivers/{transport_driver}'
*/
export const destroy = (args: { transport_driver: number | { id: number } } | [transport_driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/transport/drivers/{transport_driver}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::destroy
* @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:99
* @route '/api/v1/transport/drivers/{transport_driver}'
*/
destroy.url = (args: { transport_driver: number | { id: number } } | [transport_driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transport_driver: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { transport_driver: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            transport_driver: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        transport_driver: typeof args.transport_driver === 'object'
        ? args.transport_driver.id
        : args.transport_driver,
    }

    return destroy.definition.url
            .replace('{transport_driver}', parsedArgs.transport_driver.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::destroy
* @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:99
* @route '/api/v1/transport/drivers/{transport_driver}'
*/
destroy.delete = (args: { transport_driver: number | { id: number } } | [transport_driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const TransportDriverController = { index, store, show, update, destroy }

export default TransportDriverController