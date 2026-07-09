import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::index
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:12
 * @route '/api/v1/timetable/rooms'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/timetable/rooms',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::index
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:12
 * @route '/api/v1/timetable/rooms'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::index
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:12
 * @route '/api/v1/timetable/rooms'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::index
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:12
 * @route '/api/v1/timetable/rooms'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::index
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:12
 * @route '/api/v1/timetable/rooms'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::index
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:12
 * @route '/api/v1/timetable/rooms'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::index
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:12
 * @route '/api/v1/timetable/rooms'
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
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::store
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:17
 * @route '/api/v1/timetable/rooms'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/timetable/rooms',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::store
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:17
 * @route '/api/v1/timetable/rooms'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::store
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:17
 * @route '/api/v1/timetable/rooms'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::store
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:17
 * @route '/api/v1/timetable/rooms'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::store
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:17
 * @route '/api/v1/timetable/rooms'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::show
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:33
 * @route '/api/v1/timetable/rooms/{room}'
 */
export const show = (args: { room: string | number | { id: string | number } } | [room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/timetable/rooms/{room}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::show
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:33
 * @route '/api/v1/timetable/rooms/{room}'
 */
show.url = (args: { room: string | number | { id: string | number } } | [room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { room: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { room: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    room: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        room: typeof args.room === 'object'
                ? args.room.id
                : args.room,
                }

    return show.definition.url
            .replace('{room}', parsedArgs.room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::show
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:33
 * @route '/api/v1/timetable/rooms/{room}'
 */
show.get = (args: { room: string | number | { id: string | number } } | [room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::show
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:33
 * @route '/api/v1/timetable/rooms/{room}'
 */
show.head = (args: { room: string | number | { id: string | number } } | [room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::show
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:33
 * @route '/api/v1/timetable/rooms/{room}'
 */
    const showForm = (args: { room: string | number | { id: string | number } } | [room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::show
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:33
 * @route '/api/v1/timetable/rooms/{room}'
 */
        showForm.get = (args: { room: string | number | { id: string | number } } | [room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::show
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:33
 * @route '/api/v1/timetable/rooms/{room}'
 */
        showForm.head = (args: { room: string | number | { id: string | number } } | [room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::update
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:38
 * @route '/api/v1/timetable/rooms/{room}'
 */
export const update = (args: { room: string | number | { id: string | number } } | [room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/timetable/rooms/{room}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::update
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:38
 * @route '/api/v1/timetable/rooms/{room}'
 */
update.url = (args: { room: string | number | { id: string | number } } | [room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { room: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { room: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    room: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        room: typeof args.room === 'object'
                ? args.room.id
                : args.room,
                }

    return update.definition.url
            .replace('{room}', parsedArgs.room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::update
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:38
 * @route '/api/v1/timetable/rooms/{room}'
 */
update.put = (args: { room: string | number | { id: string | number } } | [room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::update
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:38
 * @route '/api/v1/timetable/rooms/{room}'
 */
update.patch = (args: { room: string | number | { id: string | number } } | [room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::update
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:38
 * @route '/api/v1/timetable/rooms/{room}'
 */
    const updateForm = (args: { room: string | number | { id: string | number } } | [room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::update
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:38
 * @route '/api/v1/timetable/rooms/{room}'
 */
        updateForm.put = (args: { room: string | number | { id: string | number } } | [room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::update
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:38
 * @route '/api/v1/timetable/rooms/{room}'
 */
        updateForm.patch = (args: { room: string | number | { id: string | number } } | [room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::destroy
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:54
 * @route '/api/v1/timetable/rooms/{room}'
 */
export const destroy = (args: { room: string | number | { id: string | number } } | [room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/timetable/rooms/{room}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::destroy
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:54
 * @route '/api/v1/timetable/rooms/{room}'
 */
destroy.url = (args: { room: string | number | { id: string | number } } | [room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { room: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { room: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    room: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        room: typeof args.room === 'object'
                ? args.room.id
                : args.room,
                }

    return destroy.definition.url
            .replace('{room}', parsedArgs.room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::destroy
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:54
 * @route '/api/v1/timetable/rooms/{room}'
 */
destroy.delete = (args: { room: string | number | { id: string | number } } | [room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::destroy
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:54
 * @route '/api/v1/timetable/rooms/{room}'
 */
    const destroyForm = (args: { room: string | number | { id: string | number } } | [room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Timetable\RoomController::destroy
 * @see app/Http/Controllers/Api/V1/Timetable/RoomController.php:54
 * @route '/api/v1/timetable/rooms/{room}'
 */
        destroyForm.delete = (args: { room: string | number | { id: string | number } } | [room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const RoomController = { index, store, show, update, destroy }

export default RoomController