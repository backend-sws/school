import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Examination\GradingScaleController::index
 * @see app/Http/Controllers/Examination/GradingScaleController.php:13
 * @route '/examination/grading-scales'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/examination/grading-scales',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::index
 * @see app/Http/Controllers/Examination/GradingScaleController.php:13
 * @route '/examination/grading-scales'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::index
 * @see app/Http/Controllers/Examination/GradingScaleController.php:13
 * @route '/examination/grading-scales'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Examination\GradingScaleController::index
 * @see app/Http/Controllers/Examination/GradingScaleController.php:13
 * @route '/examination/grading-scales'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Examination\GradingScaleController::index
 * @see app/Http/Controllers/Examination/GradingScaleController.php:13
 * @route '/examination/grading-scales'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Examination\GradingScaleController::index
 * @see app/Http/Controllers/Examination/GradingScaleController.php:13
 * @route '/examination/grading-scales'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Examination\GradingScaleController::index
 * @see app/Http/Controllers/Examination/GradingScaleController.php:13
 * @route '/examination/grading-scales'
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
* @see \App\Http\Controllers\Examination\GradingScaleController::create
 * @see app/Http/Controllers/Examination/GradingScaleController.php:22
 * @route '/examination/grading-scales/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/examination/grading-scales/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::create
 * @see app/Http/Controllers/Examination/GradingScaleController.php:22
 * @route '/examination/grading-scales/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::create
 * @see app/Http/Controllers/Examination/GradingScaleController.php:22
 * @route '/examination/grading-scales/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Examination\GradingScaleController::create
 * @see app/Http/Controllers/Examination/GradingScaleController.php:22
 * @route '/examination/grading-scales/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Examination\GradingScaleController::create
 * @see app/Http/Controllers/Examination/GradingScaleController.php:22
 * @route '/examination/grading-scales/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Examination\GradingScaleController::create
 * @see app/Http/Controllers/Examination/GradingScaleController.php:22
 * @route '/examination/grading-scales/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Examination\GradingScaleController::create
 * @see app/Http/Controllers/Examination/GradingScaleController.php:22
 * @route '/examination/grading-scales/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Examination\GradingScaleController::store
 * @see app/Http/Controllers/Examination/GradingScaleController.php:27
 * @route '/examination/grading-scales'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/examination/grading-scales',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::store
 * @see app/Http/Controllers/Examination/GradingScaleController.php:27
 * @route '/examination/grading-scales'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::store
 * @see app/Http/Controllers/Examination/GradingScaleController.php:27
 * @route '/examination/grading-scales'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Examination\GradingScaleController::store
 * @see app/Http/Controllers/Examination/GradingScaleController.php:27
 * @route '/examination/grading-scales'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Examination\GradingScaleController::store
 * @see app/Http/Controllers/Examination/GradingScaleController.php:27
 * @route '/examination/grading-scales'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Examination\GradingScaleController::edit
 * @see app/Http/Controllers/Examination/GradingScaleController.php:53
 * @route '/examination/grading-scales/{scale}/edit'
 */
export const edit = (args: { scale: string | number | { id: string | number } } | [scale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/examination/grading-scales/{scale}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::edit
 * @see app/Http/Controllers/Examination/GradingScaleController.php:53
 * @route '/examination/grading-scales/{scale}/edit'
 */
edit.url = (args: { scale: string | number | { id: string | number } } | [scale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { scale: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { scale: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    scale: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        scale: typeof args.scale === 'object'
                ? args.scale.id
                : args.scale,
                }

    return edit.definition.url
            .replace('{scale}', parsedArgs.scale.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::edit
 * @see app/Http/Controllers/Examination/GradingScaleController.php:53
 * @route '/examination/grading-scales/{scale}/edit'
 */
edit.get = (args: { scale: string | number | { id: string | number } } | [scale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Examination\GradingScaleController::edit
 * @see app/Http/Controllers/Examination/GradingScaleController.php:53
 * @route '/examination/grading-scales/{scale}/edit'
 */
edit.head = (args: { scale: string | number | { id: string | number } } | [scale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Examination\GradingScaleController::edit
 * @see app/Http/Controllers/Examination/GradingScaleController.php:53
 * @route '/examination/grading-scales/{scale}/edit'
 */
    const editForm = (args: { scale: string | number | { id: string | number } } | [scale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Examination\GradingScaleController::edit
 * @see app/Http/Controllers/Examination/GradingScaleController.php:53
 * @route '/examination/grading-scales/{scale}/edit'
 */
        editForm.get = (args: { scale: string | number | { id: string | number } } | [scale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Examination\GradingScaleController::edit
 * @see app/Http/Controllers/Examination/GradingScaleController.php:53
 * @route '/examination/grading-scales/{scale}/edit'
 */
        editForm.head = (args: { scale: string | number | { id: string | number } } | [scale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Examination\GradingScaleController::update
 * @see app/Http/Controllers/Examination/GradingScaleController.php:59
 * @route '/examination/grading-scales/{scale}'
 */
export const update = (args: { scale: string | number | { id: string | number } } | [scale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/examination/grading-scales/{scale}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::update
 * @see app/Http/Controllers/Examination/GradingScaleController.php:59
 * @route '/examination/grading-scales/{scale}'
 */
update.url = (args: { scale: string | number | { id: string | number } } | [scale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { scale: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { scale: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    scale: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        scale: typeof args.scale === 'object'
                ? args.scale.id
                : args.scale,
                }

    return update.definition.url
            .replace('{scale}', parsedArgs.scale.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::update
 * @see app/Http/Controllers/Examination/GradingScaleController.php:59
 * @route '/examination/grading-scales/{scale}'
 */
update.put = (args: { scale: string | number | { id: string | number } } | [scale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Examination\GradingScaleController::update
 * @see app/Http/Controllers/Examination/GradingScaleController.php:59
 * @route '/examination/grading-scales/{scale}'
 */
    const updateForm = (args: { scale: string | number | { id: string | number } } | [scale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Examination\GradingScaleController::update
 * @see app/Http/Controllers/Examination/GradingScaleController.php:59
 * @route '/examination/grading-scales/{scale}'
 */
        updateForm.put = (args: { scale: string | number | { id: string | number } } | [scale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Examination\GradingScaleController::destroy
 * @see app/Http/Controllers/Examination/GradingScaleController.php:96
 * @route '/examination/grading-scales/{scale}'
 */
export const destroy = (args: { scale: string | number | { id: string | number } } | [scale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/examination/grading-scales/{scale}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::destroy
 * @see app/Http/Controllers/Examination/GradingScaleController.php:96
 * @route '/examination/grading-scales/{scale}'
 */
destroy.url = (args: { scale: string | number | { id: string | number } } | [scale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { scale: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { scale: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    scale: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        scale: typeof args.scale === 'object'
                ? args.scale.id
                : args.scale,
                }

    return destroy.definition.url
            .replace('{scale}', parsedArgs.scale.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::destroy
 * @see app/Http/Controllers/Examination/GradingScaleController.php:96
 * @route '/examination/grading-scales/{scale}'
 */
destroy.delete = (args: { scale: string | number | { id: string | number } } | [scale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Examination\GradingScaleController::destroy
 * @see app/Http/Controllers/Examination/GradingScaleController.php:96
 * @route '/examination/grading-scales/{scale}'
 */
    const destroyForm = (args: { scale: string | number | { id: string | number } } | [scale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Examination\GradingScaleController::destroy
 * @see app/Http/Controllers/Examination/GradingScaleController.php:96
 * @route '/examination/grading-scales/{scale}'
 */
        destroyForm.delete = (args: { scale: string | number | { id: string | number } } | [scale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const GradingScaleController = { index, create, store, edit, update, destroy }

export default GradingScaleController