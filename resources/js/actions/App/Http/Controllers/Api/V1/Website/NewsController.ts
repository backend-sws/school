import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::index
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:36
 * @route '/api/v1/public/news'
 */
const index46ead6ada632b2a64b4333692607f9f8 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index46ead6ada632b2a64b4333692607f9f8.url(options),
    method: 'get',
})

index46ead6ada632b2a64b4333692607f9f8.definition = {
    methods: ["get","head"],
    url: '/api/v1/public/news',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::index
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:36
 * @route '/api/v1/public/news'
 */
index46ead6ada632b2a64b4333692607f9f8.url = (options?: RouteQueryOptions) => {
    return index46ead6ada632b2a64b4333692607f9f8.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::index
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:36
 * @route '/api/v1/public/news'
 */
index46ead6ada632b2a64b4333692607f9f8.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index46ead6ada632b2a64b4333692607f9f8.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::index
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:36
 * @route '/api/v1/public/news'
 */
index46ead6ada632b2a64b4333692607f9f8.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index46ead6ada632b2a64b4333692607f9f8.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::index
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:36
 * @route '/api/v1/public/news'
 */
    const index46ead6ada632b2a64b4333692607f9f8Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index46ead6ada632b2a64b4333692607f9f8.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::index
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:36
 * @route '/api/v1/public/news'
 */
        index46ead6ada632b2a64b4333692607f9f8Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index46ead6ada632b2a64b4333692607f9f8.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::index
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:36
 * @route '/api/v1/public/news'
 */
        index46ead6ada632b2a64b4333692607f9f8Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index46ead6ada632b2a64b4333692607f9f8.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index46ead6ada632b2a64b4333692607f9f8.form = index46ead6ada632b2a64b4333692607f9f8Form
    /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::index
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:36
 * @route '/api/v1/website/news'
 */
const index6a7cd1e3b88f31ce12ec84bfda4c07ea = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index6a7cd1e3b88f31ce12ec84bfda4c07ea.url(options),
    method: 'get',
})

index6a7cd1e3b88f31ce12ec84bfda4c07ea.definition = {
    methods: ["get","head"],
    url: '/api/v1/website/news',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::index
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:36
 * @route '/api/v1/website/news'
 */
index6a7cd1e3b88f31ce12ec84bfda4c07ea.url = (options?: RouteQueryOptions) => {
    return index6a7cd1e3b88f31ce12ec84bfda4c07ea.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::index
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:36
 * @route '/api/v1/website/news'
 */
index6a7cd1e3b88f31ce12ec84bfda4c07ea.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index6a7cd1e3b88f31ce12ec84bfda4c07ea.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::index
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:36
 * @route '/api/v1/website/news'
 */
index6a7cd1e3b88f31ce12ec84bfda4c07ea.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index6a7cd1e3b88f31ce12ec84bfda4c07ea.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::index
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:36
 * @route '/api/v1/website/news'
 */
    const index6a7cd1e3b88f31ce12ec84bfda4c07eaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index6a7cd1e3b88f31ce12ec84bfda4c07ea.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::index
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:36
 * @route '/api/v1/website/news'
 */
        index6a7cd1e3b88f31ce12ec84bfda4c07eaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index6a7cd1e3b88f31ce12ec84bfda4c07ea.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::index
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:36
 * @route '/api/v1/website/news'
 */
        index6a7cd1e3b88f31ce12ec84bfda4c07eaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index6a7cd1e3b88f31ce12ec84bfda4c07ea.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index6a7cd1e3b88f31ce12ec84bfda4c07ea.form = index6a7cd1e3b88f31ce12ec84bfda4c07eaForm

export const index = {
    '/api/v1/public/news': index46ead6ada632b2a64b4333692607f9f8,
    '/api/v1/website/news': index6a7cd1e3b88f31ce12ec84bfda4c07ea,
}

/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::toggleStatus
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:183
 * @route '/api/v1/website/news/{news}/toggle-status'
 */
export const toggleStatus = (args: { news: string | number | { id: string | number } } | [news: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

toggleStatus.definition = {
    methods: ["patch"],
    url: '/api/v1/website/news/{news}/toggle-status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::toggleStatus
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:183
 * @route '/api/v1/website/news/{news}/toggle-status'
 */
toggleStatus.url = (args: { news: string | number | { id: string | number } } | [news: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return toggleStatus.definition.url
            .replace('{news}', parsedArgs.news.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::toggleStatus
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:183
 * @route '/api/v1/website/news/{news}/toggle-status'
 */
toggleStatus.patch = (args: { news: string | number | { id: string | number } } | [news: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::toggleStatus
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:183
 * @route '/api/v1/website/news/{news}/toggle-status'
 */
    const toggleStatusForm = (args: { news: string | number | { id: string | number } } | [news: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleStatus.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::toggleStatus
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:183
 * @route '/api/v1/website/news/{news}/toggle-status'
 */
        toggleStatusForm.patch = (args: { news: string | number | { id: string | number } } | [news: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleStatus.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleStatus.form = toggleStatusForm
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
export const show = (args: { news: string | number | { id: string | number } } | [news: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
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
show.url = (args: { news: string | number | { id: string | number } } | [news: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
show.get = (args: { news: string | number | { id: string | number } } | [news: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::show
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:105
 * @route '/api/v1/website/news/{news}'
 */
show.head = (args: { news: string | number | { id: string | number } } | [news: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::show
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:105
 * @route '/api/v1/website/news/{news}'
 */
    const showForm = (args: { news: string | number | { id: string | number } } | [news: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::show
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:105
 * @route '/api/v1/website/news/{news}'
 */
        showForm.get = (args: { news: string | number | { id: string | number } } | [news: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::show
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:105
 * @route '/api/v1/website/news/{news}'
 */
        showForm.head = (args: { news: string | number | { id: string | number } } | [news: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
export const update = (args: { news: string | number | { id: string | number } } | [news: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
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
update.url = (args: { news: string | number | { id: string | number } } | [news: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
update.put = (args: { news: string | number | { id: string | number } } | [news: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::update
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:122
 * @route '/api/v1/website/news/{news}'
 */
update.patch = (args: { news: string | number | { id: string | number } } | [news: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::update
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:122
 * @route '/api/v1/website/news/{news}'
 */
    const updateForm = (args: { news: string | number | { id: string | number } } | [news: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
        updateForm.put = (args: { news: string | number | { id: string | number } } | [news: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
        updateForm.patch = (args: { news: string | number | { id: string | number } } | [news: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
export const destroy = (args: { news: string | number | { id: string | number } } | [news: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
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
destroy.url = (args: { news: string | number | { id: string | number } } | [news: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
destroy.delete = (args: { news: string | number | { id: string | number } } | [news: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Website\NewsController::destroy
 * @see app/Http/Controllers/Api/V1/Website/NewsController.php:167
 * @route '/api/v1/website/news/{news}'
 */
    const destroyForm = (args: { news: string | number | { id: string | number } } | [news: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
        destroyForm.delete = (args: { news: string | number | { id: string | number } } | [news: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const NewsController = { index, toggleStatus, store, show, update, destroy }

export default NewsController