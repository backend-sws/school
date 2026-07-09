import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleController::index
* @see app/Http/Controllers/Api/V1/Transport/TransportVehicleController.php:12
* @route '/api/v1/transport/vehicles'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/vehicles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleController::index
* @see app/Http/Controllers/Api/V1/Transport/TransportVehicleController.php:12
* @route '/api/v1/transport/vehicles'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleController::index
* @see app/Http/Controllers/Api/V1/Transport/TransportVehicleController.php:12
* @route '/api/v1/transport/vehicles'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleController::index
* @see app/Http/Controllers/Api/V1/Transport/TransportVehicleController.php:12
* @route '/api/v1/transport/vehicles'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleController::store
* @see app/Http/Controllers/Api/V1/Transport/TransportVehicleController.php:39
* @route '/api/v1/transport/vehicles'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/transport/vehicles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleController::store
* @see app/Http/Controllers/Api/V1/Transport/TransportVehicleController.php:39
* @route '/api/v1/transport/vehicles'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleController::store
* @see app/Http/Controllers/Api/V1/Transport/TransportVehicleController.php:39
* @route '/api/v1/transport/vehicles'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleController::show
* @see app/Http/Controllers/Api/V1/Transport/TransportVehicleController.php:63
* @route '/api/v1/transport/vehicles/{transport_vehicle}'
*/
export const show = (args: { transport_vehicle: number | { id: number } } | [transport_vehicle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/vehicles/{transport_vehicle}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleController::show
* @see app/Http/Controllers/Api/V1/Transport/TransportVehicleController.php:63
* @route '/api/v1/transport/vehicles/{transport_vehicle}'
*/
show.url = (args: { transport_vehicle: number | { id: number } } | [transport_vehicle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transport_vehicle: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { transport_vehicle: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            transport_vehicle: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        transport_vehicle: typeof args.transport_vehicle === 'object'
        ? args.transport_vehicle.id
        : args.transport_vehicle,
    }

    return show.definition.url
            .replace('{transport_vehicle}', parsedArgs.transport_vehicle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleController::show
* @see app/Http/Controllers/Api/V1/Transport/TransportVehicleController.php:63
* @route '/api/v1/transport/vehicles/{transport_vehicle}'
*/
show.get = (args: { transport_vehicle: number | { id: number } } | [transport_vehicle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleController::show
* @see app/Http/Controllers/Api/V1/Transport/TransportVehicleController.php:63
* @route '/api/v1/transport/vehicles/{transport_vehicle}'
*/
show.head = (args: { transport_vehicle: number | { id: number } } | [transport_vehicle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleController::update
* @see app/Http/Controllers/Api/V1/Transport/TransportVehicleController.php:74
* @route '/api/v1/transport/vehicles/{transport_vehicle}'
*/
export const update = (args: { transport_vehicle: number | { id: number } } | [transport_vehicle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/transport/vehicles/{transport_vehicle}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleController::update
* @see app/Http/Controllers/Api/V1/Transport/TransportVehicleController.php:74
* @route '/api/v1/transport/vehicles/{transport_vehicle}'
*/
update.url = (args: { transport_vehicle: number | { id: number } } | [transport_vehicle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transport_vehicle: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { transport_vehicle: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            transport_vehicle: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        transport_vehicle: typeof args.transport_vehicle === 'object'
        ? args.transport_vehicle.id
        : args.transport_vehicle,
    }

    return update.definition.url
            .replace('{transport_vehicle}', parsedArgs.transport_vehicle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleController::update
* @see app/Http/Controllers/Api/V1/Transport/TransportVehicleController.php:74
* @route '/api/v1/transport/vehicles/{transport_vehicle}'
*/
update.put = (args: { transport_vehicle: number | { id: number } } | [transport_vehicle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleController::update
* @see app/Http/Controllers/Api/V1/Transport/TransportVehicleController.php:74
* @route '/api/v1/transport/vehicles/{transport_vehicle}'
*/
update.patch = (args: { transport_vehicle: number | { id: number } } | [transport_vehicle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleController::destroy
* @see app/Http/Controllers/Api/V1/Transport/TransportVehicleController.php:95
* @route '/api/v1/transport/vehicles/{transport_vehicle}'
*/
export const destroy = (args: { transport_vehicle: number | { id: number } } | [transport_vehicle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/transport/vehicles/{transport_vehicle}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleController::destroy
* @see app/Http/Controllers/Api/V1/Transport/TransportVehicleController.php:95
* @route '/api/v1/transport/vehicles/{transport_vehicle}'
*/
destroy.url = (args: { transport_vehicle: number | { id: number } } | [transport_vehicle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transport_vehicle: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { transport_vehicle: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            transport_vehicle: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        transport_vehicle: typeof args.transport_vehicle === 'object'
        ? args.transport_vehicle.id
        : args.transport_vehicle,
    }

    return destroy.definition.url
            .replace('{transport_vehicle}', parsedArgs.transport_vehicle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleController::destroy
* @see app/Http/Controllers/Api/V1/Transport/TransportVehicleController.php:95
* @route '/api/v1/transport/vehicles/{transport_vehicle}'
*/
destroy.delete = (args: { transport_vehicle: number | { id: number } } | [transport_vehicle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const TransportVehicleController = { index, store, show, update, destroy }

export default TransportVehicleController