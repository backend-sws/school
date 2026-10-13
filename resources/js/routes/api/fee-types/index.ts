import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
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
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::index
 * @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:21
 * @route '/api/v1/fee-types'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::index
 * @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:21
 * @route '/api/v1/fee-types'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::index
 * @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:21
 * @route '/api/v1/fee-types'
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
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::store
 * @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:60
 * @route '/api/v1/fee-types'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::store
 * @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:60
 * @route '/api/v1/fee-types'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::show
 * @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:87
 * @route '/api/v1/fee-types/{fee_type}'
 */
export const show = (args: { fee_type: string | number | { id: string | number } } | [fee_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
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
show.url = (args: { fee_type: string | number | { id: string | number } } | [fee_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
show.get = (args: { fee_type: string | number | { id: string | number } } | [fee_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::show
 * @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:87
 * @route '/api/v1/fee-types/{fee_type}'
 */
show.head = (args: { fee_type: string | number | { id: string | number } } | [fee_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::show
 * @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:87
 * @route '/api/v1/fee-types/{fee_type}'
 */
    const showForm = (args: { fee_type: string | number | { id: string | number } } | [fee_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::show
 * @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:87
 * @route '/api/v1/fee-types/{fee_type}'
 */
        showForm.get = (args: { fee_type: string | number | { id: string | number } } | [fee_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::show
 * @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:87
 * @route '/api/v1/fee-types/{fee_type}'
 */
        showForm.head = (args: { fee_type: string | number | { id: string | number } } | [fee_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::update
 * @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:100
 * @route '/api/v1/fee-types/{fee_type}'
 */
export const update = (args: { fee_type: string | number | { id: string | number } } | [fee_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
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
update.url = (args: { fee_type: string | number | { id: string | number } } | [fee_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
update.put = (args: { fee_type: string | number | { id: string | number } } | [fee_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::update
 * @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:100
 * @route '/api/v1/fee-types/{fee_type}'
 */
update.patch = (args: { fee_type: string | number | { id: string | number } } | [fee_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::update
 * @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:100
 * @route '/api/v1/fee-types/{fee_type}'
 */
    const updateForm = (args: { fee_type: string | number | { id: string | number } } | [fee_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::update
 * @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:100
 * @route '/api/v1/fee-types/{fee_type}'
 */
        updateForm.put = (args: { fee_type: string | number | { id: string | number } } | [fee_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::update
 * @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:100
 * @route '/api/v1/fee-types/{fee_type}'
 */
        updateForm.patch = (args: { fee_type: string | number | { id: string | number } } | [fee_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::destroy
 * @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:124
 * @route '/api/v1/fee-types/{fee_type}'
 */
export const destroy = (args: { fee_type: string | number | { id: string | number } } | [fee_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
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
destroy.url = (args: { fee_type: string | number | { id: string | number } } | [fee_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
destroy.delete = (args: { fee_type: string | number | { id: string | number } } | [fee_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::destroy
 * @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:124
 * @route '/api/v1/fee-types/{fee_type}'
 */
    const destroyForm = (args: { fee_type: string | number | { id: string | number } } | [fee_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\FeeTypeController::destroy
 * @see app/Http/Controllers/Api/V1/Fees/FeeTypeController.php:124
 * @route '/api/v1/fee-types/{fee_type}'
 */
        destroyForm.delete = (args: { fee_type: string | number | { id: string | number } } | [fee_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const feeTypes = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default feeTypes