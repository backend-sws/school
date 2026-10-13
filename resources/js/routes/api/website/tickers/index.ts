import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::index
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:33
 * @route '/api/v1/website/tickers'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/website/tickers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::index
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:33
 * @route '/api/v1/website/tickers'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::index
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:33
 * @route '/api/v1/website/tickers'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::index
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:33
 * @route '/api/v1/website/tickers'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::index
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:33
 * @route '/api/v1/website/tickers'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::index
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:33
 * @route '/api/v1/website/tickers'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::index
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:33
 * @route '/api/v1/website/tickers'
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
* @see \App\Http\Controllers\Api\V1\Website\TickerController::store
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:61
 * @route '/api/v1/website/tickers'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/website/tickers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::store
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:61
 * @route '/api/v1/website/tickers'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::store
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:61
 * @route '/api/v1/website/tickers'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::store
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:61
 * @route '/api/v1/website/tickers'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::store
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:61
 * @route '/api/v1/website/tickers'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::show
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:88
 * @route '/api/v1/website/tickers/{ticker}'
 */
export const show = (args: { ticker: string | number | { id: string | number } } | [ticker: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/website/tickers/{ticker}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::show
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:88
 * @route '/api/v1/website/tickers/{ticker}'
 */
show.url = (args: { ticker: string | number | { id: string | number } } | [ticker: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticker: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ticker: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ticker: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticker: typeof args.ticker === 'object'
                ? args.ticker.id
                : args.ticker,
                }

    return show.definition.url
            .replace('{ticker}', parsedArgs.ticker.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::show
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:88
 * @route '/api/v1/website/tickers/{ticker}'
 */
show.get = (args: { ticker: string | number | { id: string | number } } | [ticker: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::show
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:88
 * @route '/api/v1/website/tickers/{ticker}'
 */
show.head = (args: { ticker: string | number | { id: string | number } } | [ticker: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::show
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:88
 * @route '/api/v1/website/tickers/{ticker}'
 */
    const showForm = (args: { ticker: string | number | { id: string | number } } | [ticker: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::show
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:88
 * @route '/api/v1/website/tickers/{ticker}'
 */
        showForm.get = (args: { ticker: string | number | { id: string | number } } | [ticker: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::show
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:88
 * @route '/api/v1/website/tickers/{ticker}'
 */
        showForm.head = (args: { ticker: string | number | { id: string | number } } | [ticker: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Website\TickerController::update
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:110
 * @route '/api/v1/website/tickers/{ticker}'
 */
export const update = (args: { ticker: string | number | { id: string | number } } | [ticker: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/website/tickers/{ticker}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::update
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:110
 * @route '/api/v1/website/tickers/{ticker}'
 */
update.url = (args: { ticker: string | number | { id: string | number } } | [ticker: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticker: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ticker: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ticker: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticker: typeof args.ticker === 'object'
                ? args.ticker.id
                : args.ticker,
                }

    return update.definition.url
            .replace('{ticker}', parsedArgs.ticker.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::update
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:110
 * @route '/api/v1/website/tickers/{ticker}'
 */
update.put = (args: { ticker: string | number | { id: string | number } } | [ticker: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::update
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:110
 * @route '/api/v1/website/tickers/{ticker}'
 */
update.patch = (args: { ticker: string | number | { id: string | number } } | [ticker: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::update
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:110
 * @route '/api/v1/website/tickers/{ticker}'
 */
    const updateForm = (args: { ticker: string | number | { id: string | number } } | [ticker: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::update
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:110
 * @route '/api/v1/website/tickers/{ticker}'
 */
        updateForm.put = (args: { ticker: string | number | { id: string | number } } | [ticker: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::update
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:110
 * @route '/api/v1/website/tickers/{ticker}'
 */
        updateForm.patch = (args: { ticker: string | number | { id: string | number } } | [ticker: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Website\TickerController::destroy
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:139
 * @route '/api/v1/website/tickers/{ticker}'
 */
export const destroy = (args: { ticker: string | number | { id: string | number } } | [ticker: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/website/tickers/{ticker}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::destroy
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:139
 * @route '/api/v1/website/tickers/{ticker}'
 */
destroy.url = (args: { ticker: string | number | { id: string | number } } | [ticker: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticker: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ticker: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ticker: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticker: typeof args.ticker === 'object'
                ? args.ticker.id
                : args.ticker,
                }

    return destroy.definition.url
            .replace('{ticker}', parsedArgs.ticker.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::destroy
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:139
 * @route '/api/v1/website/tickers/{ticker}'
 */
destroy.delete = (args: { ticker: string | number | { id: string | number } } | [ticker: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::destroy
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:139
 * @route '/api/v1/website/tickers/{ticker}'
 */
    const destroyForm = (args: { ticker: string | number | { id: string | number } } | [ticker: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\TickerController::destroy
 * @see app/Http/Controllers/Api/V1/Website/TickerController.php:139
 * @route '/api/v1/website/tickers/{ticker}'
 */
        destroyForm.delete = (args: { ticker: string | number | { id: string | number } } | [ticker: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const tickers = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default tickers