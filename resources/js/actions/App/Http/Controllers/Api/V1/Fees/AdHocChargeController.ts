import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::index
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:129
 * @route '/api/v1/fees/ad-hoc-charges'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/fees/ad-hoc-charges',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::index
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:129
 * @route '/api/v1/fees/ad-hoc-charges'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::index
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:129
 * @route '/api/v1/fees/ad-hoc-charges'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::index
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:129
 * @route '/api/v1/fees/ad-hoc-charges'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::index
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:129
 * @route '/api/v1/fees/ad-hoc-charges'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::index
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:129
 * @route '/api/v1/fees/ad-hoc-charges'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::index
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:129
 * @route '/api/v1/fees/ad-hoc-charges'
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
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::batches
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:79
 * @route '/api/v1/fees/ad-hoc-charges/batches'
 */
export const batches = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: batches.url(options),
    method: 'get',
})

batches.definition = {
    methods: ["get","head"],
    url: '/api/v1/fees/ad-hoc-charges/batches',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::batches
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:79
 * @route '/api/v1/fees/ad-hoc-charges/batches'
 */
batches.url = (options?: RouteQueryOptions) => {
    return batches.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::batches
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:79
 * @route '/api/v1/fees/ad-hoc-charges/batches'
 */
batches.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: batches.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::batches
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:79
 * @route '/api/v1/fees/ad-hoc-charges/batches'
 */
batches.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: batches.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::batches
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:79
 * @route '/api/v1/fees/ad-hoc-charges/batches'
 */
    const batchesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: batches.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::batches
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:79
 * @route '/api/v1/fees/ad-hoc-charges/batches'
 */
        batchesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: batches.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::batches
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:79
 * @route '/api/v1/fees/ad-hoc-charges/batches'
 */
        batchesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: batches.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    batches.form = batchesForm
/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::store
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:16
 * @route '/api/v1/fees/ad-hoc-charges'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/fees/ad-hoc-charges',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::store
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:16
 * @route '/api/v1/fees/ad-hoc-charges'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::store
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:16
 * @route '/api/v1/fees/ad-hoc-charges'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::store
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:16
 * @route '/api/v1/fees/ad-hoc-charges'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::store
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:16
 * @route '/api/v1/fees/ad-hoc-charges'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::bulkDestroy
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:203
 * @route '/api/v1/fees/ad-hoc-charges/bulk-delete'
 */
export const bulkDestroy = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkDestroy.url(options),
    method: 'post',
})

bulkDestroy.definition = {
    methods: ["post"],
    url: '/api/v1/fees/ad-hoc-charges/bulk-delete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::bulkDestroy
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:203
 * @route '/api/v1/fees/ad-hoc-charges/bulk-delete'
 */
bulkDestroy.url = (options?: RouteQueryOptions) => {
    return bulkDestroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::bulkDestroy
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:203
 * @route '/api/v1/fees/ad-hoc-charges/bulk-delete'
 */
bulkDestroy.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkDestroy.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::bulkDestroy
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:203
 * @route '/api/v1/fees/ad-hoc-charges/bulk-delete'
 */
    const bulkDestroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulkDestroy.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::bulkDestroy
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:203
 * @route '/api/v1/fees/ad-hoc-charges/bulk-delete'
 */
        bulkDestroyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulkDestroy.url(options),
            method: 'post',
        })
    
    bulkDestroy.form = bulkDestroyForm
/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::destroy
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:186
 * @route '/api/v1/fees/ad-hoc-charges/{id}'
 */
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/fees/ad-hoc-charges/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::destroy
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:186
 * @route '/api/v1/fees/ad-hoc-charges/{id}'
 */
destroy.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return destroy.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::destroy
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:186
 * @route '/api/v1/fees/ad-hoc-charges/{id}'
 */
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::destroy
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:186
 * @route '/api/v1/fees/ad-hoc-charges/{id}'
 */
    const destroyForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::destroy
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:186
 * @route '/api/v1/fees/ad-hoc-charges/{id}'
 */
        destroyForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const AdHocChargeController = { index, batches, store, bulkDestroy, destroy }

export default AdHocChargeController