import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::exportMethod
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:109
 * @route '/api/v1/hostel/rooms/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/api/v1/hostel/rooms/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::exportMethod
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:109
 * @route '/api/v1/hostel/rooms/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::exportMethod
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:109
 * @route '/api/v1/hostel/rooms/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::exportMethod
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:109
 * @route '/api/v1/hostel/rooms/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::exportMethod
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:109
 * @route '/api/v1/hostel/rooms/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::exportMethod
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:109
 * @route '/api/v1/hostel/rooms/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::exportMethod
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:109
 * @route '/api/v1/hostel/rooms/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:12
 * @route '/api/v1/hostel/rooms'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/hostel/rooms',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:12
 * @route '/api/v1/hostel/rooms'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:12
 * @route '/api/v1/hostel/rooms'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:12
 * @route '/api/v1/hostel/rooms'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:12
 * @route '/api/v1/hostel/rooms'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:12
 * @route '/api/v1/hostel/rooms'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:12
 * @route '/api/v1/hostel/rooms'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:126
 * @route '/api/v1/hostel/rooms'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/hostel/rooms',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:126
 * @route '/api/v1/hostel/rooms'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:126
 * @route '/api/v1/hostel/rooms'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:126
 * @route '/api/v1/hostel/rooms'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:126
 * @route '/api/v1/hostel/rooms'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:168
 * @route '/api/v1/hostel/rooms/{hostel_room}'
 */
export const show = (args: { hostel_room: number | { id: number } } | [hostel_room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/hostel/rooms/{hostel_room}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:168
 * @route '/api/v1/hostel/rooms/{hostel_room}'
 */
show.url = (args: { hostel_room: number | { id: number } } | [hostel_room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hostel_room: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { hostel_room: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    hostel_room: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hostel_room: typeof args.hostel_room === 'object'
                ? args.hostel_room.id
                : args.hostel_room,
                }

    return show.definition.url
            .replace('{hostel_room}', parsedArgs.hostel_room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:168
 * @route '/api/v1/hostel/rooms/{hostel_room}'
 */
show.get = (args: { hostel_room: number | { id: number } } | [hostel_room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:168
 * @route '/api/v1/hostel/rooms/{hostel_room}'
 */
show.head = (args: { hostel_room: number | { id: number } } | [hostel_room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:168
 * @route '/api/v1/hostel/rooms/{hostel_room}'
 */
    const showForm = (args: { hostel_room: number | { id: number } } | [hostel_room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:168
 * @route '/api/v1/hostel/rooms/{hostel_room}'
 */
        showForm.get = (args: { hostel_room: number | { id: number } } | [hostel_room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:168
 * @route '/api/v1/hostel/rooms/{hostel_room}'
 */
        showForm.head = (args: { hostel_room: number | { id: number } } | [hostel_room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:182
 * @route '/api/v1/hostel/rooms/{hostel_room}'
 */
export const update = (args: { hostel_room: number | { id: number } } | [hostel_room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/hostel/rooms/{hostel_room}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:182
 * @route '/api/v1/hostel/rooms/{hostel_room}'
 */
update.url = (args: { hostel_room: number | { id: number } } | [hostel_room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hostel_room: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { hostel_room: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    hostel_room: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hostel_room: typeof args.hostel_room === 'object'
                ? args.hostel_room.id
                : args.hostel_room,
                }

    return update.definition.url
            .replace('{hostel_room}', parsedArgs.hostel_room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:182
 * @route '/api/v1/hostel/rooms/{hostel_room}'
 */
update.put = (args: { hostel_room: number | { id: number } } | [hostel_room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:182
 * @route '/api/v1/hostel/rooms/{hostel_room}'
 */
update.patch = (args: { hostel_room: number | { id: number } } | [hostel_room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:182
 * @route '/api/v1/hostel/rooms/{hostel_room}'
 */
    const updateForm = (args: { hostel_room: number | { id: number } } | [hostel_room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:182
 * @route '/api/v1/hostel/rooms/{hostel_room}'
 */
        updateForm.put = (args: { hostel_room: number | { id: number } } | [hostel_room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:182
 * @route '/api/v1/hostel/rooms/{hostel_room}'
 */
        updateForm.patch = (args: { hostel_room: number | { id: number } } | [hostel_room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:231
 * @route '/api/v1/hostel/rooms/{hostel_room}'
 */
export const destroy = (args: { hostel_room: number | { id: number } } | [hostel_room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/hostel/rooms/{hostel_room}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:231
 * @route '/api/v1/hostel/rooms/{hostel_room}'
 */
destroy.url = (args: { hostel_room: number | { id: number } } | [hostel_room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hostel_room: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { hostel_room: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    hostel_room: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hostel_room: typeof args.hostel_room === 'object'
                ? args.hostel_room.id
                : args.hostel_room,
                }

    return destroy.definition.url
            .replace('{hostel_room}', parsedArgs.hostel_room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:231
 * @route '/api/v1/hostel/rooms/{hostel_room}'
 */
destroy.delete = (args: { hostel_room: number | { id: number } } | [hostel_room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:231
 * @route '/api/v1/hostel/rooms/{hostel_room}'
 */
    const destroyForm = (args: { hostel_room: number | { id: number } } | [hostel_room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelRoomController.php:231
 * @route '/api/v1/hostel/rooms/{hostel_room}'
 */
        destroyForm.delete = (args: { hostel_room: number | { id: number } } | [hostel_room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const HostelRoomController = { exportMethod, index, store, show, update, destroy, export: exportMethod }

export default HostelRoomController