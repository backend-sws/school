import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::index
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:21
 * @route '/api/v1/fee-regulation-profiles'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/fee-regulation-profiles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::index
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:21
 * @route '/api/v1/fee-regulation-profiles'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::index
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:21
 * @route '/api/v1/fee-regulation-profiles'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::index
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:21
 * @route '/api/v1/fee-regulation-profiles'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::index
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:21
 * @route '/api/v1/fee-regulation-profiles'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::index
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:21
 * @route '/api/v1/fee-regulation-profiles'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::index
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:21
 * @route '/api/v1/fee-regulation-profiles'
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
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::store
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:62
 * @route '/api/v1/fee-regulation-profiles'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/fee-regulation-profiles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::store
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:62
 * @route '/api/v1/fee-regulation-profiles'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::store
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:62
 * @route '/api/v1/fee-regulation-profiles'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::store
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:62
 * @route '/api/v1/fee-regulation-profiles'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::store
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:62
 * @route '/api/v1/fee-regulation-profiles'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::show
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:132
 * @route '/api/v1/fee-regulation-profiles/{fee_regulation_profile}'
 */
export const show = (args: { fee_regulation_profile: string | number } | [fee_regulation_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/fee-regulation-profiles/{fee_regulation_profile}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::show
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:132
 * @route '/api/v1/fee-regulation-profiles/{fee_regulation_profile}'
 */
show.url = (args: { fee_regulation_profile: string | number } | [fee_regulation_profile: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fee_regulation_profile: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    fee_regulation_profile: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        fee_regulation_profile: args.fee_regulation_profile,
                }

    return show.definition.url
            .replace('{fee_regulation_profile}', parsedArgs.fee_regulation_profile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::show
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:132
 * @route '/api/v1/fee-regulation-profiles/{fee_regulation_profile}'
 */
show.get = (args: { fee_regulation_profile: string | number } | [fee_regulation_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::show
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:132
 * @route '/api/v1/fee-regulation-profiles/{fee_regulation_profile}'
 */
show.head = (args: { fee_regulation_profile: string | number } | [fee_regulation_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::show
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:132
 * @route '/api/v1/fee-regulation-profiles/{fee_regulation_profile}'
 */
    const showForm = (args: { fee_regulation_profile: string | number } | [fee_regulation_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::show
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:132
 * @route '/api/v1/fee-regulation-profiles/{fee_regulation_profile}'
 */
        showForm.get = (args: { fee_regulation_profile: string | number } | [fee_regulation_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::show
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:132
 * @route '/api/v1/fee-regulation-profiles/{fee_regulation_profile}'
 */
        showForm.head = (args: { fee_regulation_profile: string | number } | [fee_regulation_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::update
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:167
 * @route '/api/v1/fee-regulation-profiles/{fee_regulation_profile}'
 */
export const update = (args: { fee_regulation_profile: string | number } | [fee_regulation_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/fee-regulation-profiles/{fee_regulation_profile}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::update
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:167
 * @route '/api/v1/fee-regulation-profiles/{fee_regulation_profile}'
 */
update.url = (args: { fee_regulation_profile: string | number } | [fee_regulation_profile: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fee_regulation_profile: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    fee_regulation_profile: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        fee_regulation_profile: args.fee_regulation_profile,
                }

    return update.definition.url
            .replace('{fee_regulation_profile}', parsedArgs.fee_regulation_profile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::update
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:167
 * @route '/api/v1/fee-regulation-profiles/{fee_regulation_profile}'
 */
update.put = (args: { fee_regulation_profile: string | number } | [fee_regulation_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::update
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:167
 * @route '/api/v1/fee-regulation-profiles/{fee_regulation_profile}'
 */
update.patch = (args: { fee_regulation_profile: string | number } | [fee_regulation_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::update
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:167
 * @route '/api/v1/fee-regulation-profiles/{fee_regulation_profile}'
 */
    const updateForm = (args: { fee_regulation_profile: string | number } | [fee_regulation_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::update
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:167
 * @route '/api/v1/fee-regulation-profiles/{fee_regulation_profile}'
 */
        updateForm.put = (args: { fee_regulation_profile: string | number } | [fee_regulation_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::update
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:167
 * @route '/api/v1/fee-regulation-profiles/{fee_regulation_profile}'
 */
        updateForm.patch = (args: { fee_regulation_profile: string | number } | [fee_regulation_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::destroy
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:245
 * @route '/api/v1/fee-regulation-profiles/{fee_regulation_profile}'
 */
export const destroy = (args: { fee_regulation_profile: string | number } | [fee_regulation_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/fee-regulation-profiles/{fee_regulation_profile}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::destroy
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:245
 * @route '/api/v1/fee-regulation-profiles/{fee_regulation_profile}'
 */
destroy.url = (args: { fee_regulation_profile: string | number } | [fee_regulation_profile: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fee_regulation_profile: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    fee_regulation_profile: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        fee_regulation_profile: args.fee_regulation_profile,
                }

    return destroy.definition.url
            .replace('{fee_regulation_profile}', parsedArgs.fee_regulation_profile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::destroy
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:245
 * @route '/api/v1/fee-regulation-profiles/{fee_regulation_profile}'
 */
destroy.delete = (args: { fee_regulation_profile: string | number } | [fee_regulation_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::destroy
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:245
 * @route '/api/v1/fee-regulation-profiles/{fee_regulation_profile}'
 */
    const destroyForm = (args: { fee_regulation_profile: string | number } | [fee_regulation_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::destroy
 * @see app/Http/Controllers/Api/V1/Fees/FeeRegulationProfileController.php:245
 * @route '/api/v1/fee-regulation-profiles/{fee_regulation_profile}'
 */
        destroyForm.delete = (args: { fee_regulation_profile: string | number } | [fee_regulation_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const feeRegulationProfiles = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default feeRegulationProfiles