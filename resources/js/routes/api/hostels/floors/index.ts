import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:13
 * @route '/api/v1/hostel/hostels/{hostel}/floors'
 */
export const index = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/hostel/hostels/{hostel}/floors',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:13
 * @route '/api/v1/hostel/hostels/{hostel}/floors'
 */
index.url = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hostel: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { hostel: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    hostel: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hostel: typeof args.hostel === 'object'
                ? args.hostel.id
                : args.hostel,
                }

    return index.definition.url
            .replace('{hostel}', parsedArgs.hostel.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:13
 * @route '/api/v1/hostel/hostels/{hostel}/floors'
 */
index.get = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:13
 * @route '/api/v1/hostel/hostels/{hostel}/floors'
 */
index.head = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:13
 * @route '/api/v1/hostel/hostels/{hostel}/floors'
 */
    const indexForm = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:13
 * @route '/api/v1/hostel/hostels/{hostel}/floors'
 */
        indexForm.get = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:13
 * @route '/api/v1/hostel/hostels/{hostel}/floors'
 */
        indexForm.head = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:24
 * @route '/api/v1/hostel/hostels/{hostel}/floors'
 */
export const store = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/hostel/hostels/{hostel}/floors',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:24
 * @route '/api/v1/hostel/hostels/{hostel}/floors'
 */
store.url = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hostel: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { hostel: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    hostel: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hostel: typeof args.hostel === 'object'
                ? args.hostel.id
                : args.hostel,
                }

    return store.definition.url
            .replace('{hostel}', parsedArgs.hostel.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:24
 * @route '/api/v1/hostel/hostels/{hostel}/floors'
 */
store.post = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:24
 * @route '/api/v1/hostel/hostels/{hostel}/floors'
 */
    const storeForm = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:24
 * @route '/api/v1/hostel/hostels/{hostel}/floors'
 */
        storeForm.post = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const floors = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
}

export default floors