import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::index
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:36
 * @route '/api/v1/website/news'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/website/news',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::index
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:36
 * @route '/api/v1/website/news'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::index
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:36
 * @route '/api/v1/website/news'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::index
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:36
 * @route '/api/v1/website/news'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::index
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:36
 * @route '/api/v1/website/news'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::index
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:36
 * @route '/api/v1/website/news'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::index
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:36
 * @route '/api/v1/website/news'
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
* @see \App\Http\Controllers\Api\V1\Website\NewsController::store
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:68
 * @route '/api/v1/website/news'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/website/news',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::store
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:68
 * @route '/api/v1/website/news'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::store
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:68
 * @route '/api/v1/website/news'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::store
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:68
 * @route '/api/v1/website/news'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::store
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:68
 * @route '/api/v1/website/news'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::show
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:105
 * @route '/api/v1/website/news/{news}'
 */
export const show = (args: { news: number | { id: number } } | [news: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/website/news/{news}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::show
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:105
 * @route '/api/v1/website/news/{news}'
 */
show.url = (args: { news: number | { id: number } } | [news: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { news: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { news: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    news: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        news: typeof args.news === 'object'
                ? args.news.id
                : args.news,
                }

    return show.definition.url
            .replace('{news}', parsedArgs.news.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::show
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:105
 * @route '/api/v1/website/news/{news}'
 */
show.get = (args: { news: number | { id: number } } | [news: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::show
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:105
 * @route '/api/v1/website/news/{news}'
 */
show.head = (args: { news: number | { id: number } } | [news: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::show
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:105
 * @route '/api/v1/website/news/{news}'
 */
    const showForm = (args: { news: number | { id: number } } | [news: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::show
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:105
 * @route '/api/v1/website/news/{news}'
 */
        showForm.get = (args: { news: number | { id: number } } | [news: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::show
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:105
 * @route '/api/v1/website/news/{news}'
 */
        showForm.head = (args: { news: number | { id: number } } | [news: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Website\NewsController::update
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:122
 * @route '/api/v1/website/news/{news}'
 */
export const update = (args: { news: number | { id: number } } | [news: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/website/news/{news}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::update
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:122
 * @route '/api/v1/website/news/{news}'
 */
update.url = (args: { news: number | { id: number } } | [news: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { news: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { news: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    news: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        news: typeof args.news === 'object'
                ? args.news.id
                : args.news,
                }

    return update.definition.url
            .replace('{news}', parsedArgs.news.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::update
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:122
 * @route '/api/v1/website/news/{news}'
 */
update.put = (args: { news: number | { id: number } } | [news: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::update
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:122
 * @route '/api/v1/website/news/{news}'
 */
update.patch = (args: { news: number | { id: number } } | [news: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::update
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:122
 * @route '/api/v1/website/news/{news}'
 */
    const updateForm = (args: { news: number | { id: number } } | [news: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::update
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:122
 * @route '/api/v1/website/news/{news}'
 */
        updateForm.put = (args: { news: number | { id: number } } | [news: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::update
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:122
 * @route '/api/v1/website/news/{news}'
 */
        updateForm.patch = (args: { news: number | { id: number } } | [news: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Website\NewsController::destroy
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:167
 * @route '/api/v1/website/news/{news}'
 */
export const destroy = (args: { news: number | { id: number } } | [news: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/website/news/{news}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::destroy
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:167
 * @route '/api/v1/website/news/{news}'
 */
destroy.url = (args: { news: number | { id: number } } | [news: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { news: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { news: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    news: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        news: typeof args.news === 'object'
                ? args.news.id
                : args.news,
                }

    return destroy.definition.url
            .replace('{news}', parsedArgs.news.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::destroy
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:167
 * @route '/api/v1/website/news/{news}'
 */
destroy.delete = (args: { news: number | { id: number } } | [news: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::destroy
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:167
 * @route '/api/v1/website/news/{news}'
 */
    const destroyForm = (args: { news: number | { id: number } } | [news: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::destroy
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:167
 * @route '/api/v1/website/news/{news}'
 */
        destroyForm.delete = (args: { news: number | { id: number } } | [news: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const news = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default news