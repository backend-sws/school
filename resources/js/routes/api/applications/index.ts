import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::invoice
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1205
 * @route '/api/v1/applications/{application}/invoice'
 */
export const invoice = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoice.url(args, options),
    method: 'get',
})

invoice.definition = {
    methods: ["get","head"],
    url: '/api/v1/applications/{application}/invoice',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::invoice
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1205
 * @route '/api/v1/applications/{application}/invoice'
 */
invoice.url = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { application: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        application: typeof args.application === 'object'
                ? args.application.id
                : args.application,
                }

    return invoice.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::invoice
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1205
 * @route '/api/v1/applications/{application}/invoice'
 */
invoice.get = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoice.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::invoice
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1205
 * @route '/api/v1/applications/{application}/invoice'
 */
invoice.head = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: invoice.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::invoice
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1205
 * @route '/api/v1/applications/{application}/invoice'
 */
    const invoiceForm = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: invoice.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::invoice
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1205
 * @route '/api/v1/applications/{application}/invoice'
 */
        invoiceForm.get = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: invoice.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::invoice
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1205
 * @route '/api/v1/applications/{application}/invoice'
 */
        invoiceForm.head = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: invoice.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    invoice.form = invoiceForm
/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::index
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:80
 * @route '/api/v1/applications'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/applications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::index
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:80
 * @route '/api/v1/applications'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::index
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:80
 * @route '/api/v1/applications'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::index
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:80
 * @route '/api/v1/applications'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::index
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:80
 * @route '/api/v1/applications'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::index
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:80
 * @route '/api/v1/applications'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::index
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:80
 * @route '/api/v1/applications'
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
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::store
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:296
 * @route '/api/v1/applications'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/applications',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::store
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:296
 * @route '/api/v1/applications'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::store
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:296
 * @route '/api/v1/applications'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::store
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:296
 * @route '/api/v1/applications'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::store
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:296
 * @route '/api/v1/applications'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::show
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1239
 * @route '/api/v1/applications/{application}'
 */
export const show = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/applications/{application}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::show
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1239
 * @route '/api/v1/applications/{application}'
 */
show.url = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { application: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        application: typeof args.application === 'object'
                ? args.application.id
                : args.application,
                }

    return show.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::show
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1239
 * @route '/api/v1/applications/{application}'
 */
show.get = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::show
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1239
 * @route '/api/v1/applications/{application}'
 */
show.head = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::show
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1239
 * @route '/api/v1/applications/{application}'
 */
    const showForm = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::show
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1239
 * @route '/api/v1/applications/{application}'
 */
        showForm.get = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::show
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1239
 * @route '/api/v1/applications/{application}'
 */
        showForm.head = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::update
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:747
 * @route '/api/v1/applications/{application}'
 */
export const update = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/applications/{application}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::update
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:747
 * @route '/api/v1/applications/{application}'
 */
update.url = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        application: args.application,
                }

    return update.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::update
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:747
 * @route '/api/v1/applications/{application}'
 */
update.put = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::update
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:747
 * @route '/api/v1/applications/{application}'
 */
update.patch = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::update
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:747
 * @route '/api/v1/applications/{application}'
 */
    const updateForm = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::update
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:747
 * @route '/api/v1/applications/{application}'
 */
        updateForm.put = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::update
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:747
 * @route '/api/v1/applications/{application}'
 */
        updateForm.patch = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::destroy
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1406
 * @route '/api/v1/applications/{application}'
 */
export const destroy = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/applications/{application}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::destroy
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1406
 * @route '/api/v1/applications/{application}'
 */
destroy.url = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { application: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        application: typeof args.application === 'object'
                ? args.application.id
                : args.application,
                }

    return destroy.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::destroy
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1406
 * @route '/api/v1/applications/{application}'
 */
destroy.delete = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::destroy
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1406
 * @route '/api/v1/applications/{application}'
 */
    const destroyForm = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::destroy
 * @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1406
 * @route '/api/v1/applications/{application}'
 */
        destroyForm.delete = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const applications = {
    invoice: Object.assign(invoice, invoice),
index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default applications