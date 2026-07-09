import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:0
 * @route '/api/v1/hostel/floors/{floor}'
 */
export const show = (args: { floor: string | number } | [floor: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/hostel/floors/{floor}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:0
 * @route '/api/v1/hostel/floors/{floor}'
 */
show.url = (args: { floor: string | number } | [floor: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { floor: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    floor: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        floor: args.floor,
                }

    return show.definition.url
            .replace('{floor}', parsedArgs.floor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:0
 * @route '/api/v1/hostel/floors/{floor}'
 */
show.get = (args: { floor: string | number } | [floor: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:0
 * @route '/api/v1/hostel/floors/{floor}'
 */
show.head = (args: { floor: string | number } | [floor: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:0
 * @route '/api/v1/hostel/floors/{floor}'
 */
    const showForm = (args: { floor: string | number } | [floor: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:0
 * @route '/api/v1/hostel/floors/{floor}'
 */
        showForm.get = (args: { floor: string | number } | [floor: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:0
 * @route '/api/v1/hostel/floors/{floor}'
 */
        showForm.head = (args: { floor: string | number } | [floor: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:43
 * @route '/api/v1/hostel/floors/{floor}'
 */
export const update = (args: { floor: string | number | { id: string | number } } | [floor: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/hostel/floors/{floor}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:43
 * @route '/api/v1/hostel/floors/{floor}'
 */
update.url = (args: { floor: string | number | { id: string | number } } | [floor: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { floor: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { floor: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    floor: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        floor: typeof args.floor === 'object'
                ? args.floor.id
                : args.floor,
                }

    return update.definition.url
            .replace('{floor}', parsedArgs.floor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:43
 * @route '/api/v1/hostel/floors/{floor}'
 */
update.put = (args: { floor: string | number | { id: string | number } } | [floor: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:43
 * @route '/api/v1/hostel/floors/{floor}'
 */
update.patch = (args: { floor: string | number | { id: string | number } } | [floor: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:43
 * @route '/api/v1/hostel/floors/{floor}'
 */
    const updateForm = (args: { floor: string | number | { id: string | number } } | [floor: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:43
 * @route '/api/v1/hostel/floors/{floor}'
 */
        updateForm.put = (args: { floor: string | number | { id: string | number } } | [floor: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:43
 * @route '/api/v1/hostel/floors/{floor}'
 */
        updateForm.patch = (args: { floor: string | number | { id: string | number } } | [floor: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:60
 * @route '/api/v1/hostel/floors/{floor}'
 */
export const destroy = (args: { floor: string | number | { id: string | number } } | [floor: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/hostel/floors/{floor}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:60
 * @route '/api/v1/hostel/floors/{floor}'
 */
destroy.url = (args: { floor: string | number | { id: string | number } } | [floor: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { floor: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { floor: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    floor: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        floor: typeof args.floor === 'object'
                ? args.floor.id
                : args.floor,
                }

    return destroy.definition.url
            .replace('{floor}', parsedArgs.floor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:60
 * @route '/api/v1/hostel/floors/{floor}'
 */
destroy.delete = (args: { floor: string | number | { id: string | number } } | [floor: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:60
 * @route '/api/v1/hostel/floors/{floor}'
 */
    const destroyForm = (args: { floor: string | number | { id: string | number } } | [floor: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelFloorController.php:60
 * @route '/api/v1/hostel/floors/{floor}'
 */
        destroyForm.delete = (args: { floor: string | number | { id: string | number } } | [floor: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const floors = {
    show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default floors