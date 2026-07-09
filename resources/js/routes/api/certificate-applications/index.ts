import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::index
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:29
 * @route '/api/v1/certificate-applications'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/certificate-applications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::index
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:29
 * @route '/api/v1/certificate-applications'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::index
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:29
 * @route '/api/v1/certificate-applications'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::index
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:29
 * @route '/api/v1/certificate-applications'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::index
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:29
 * @route '/api/v1/certificate-applications'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::index
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:29
 * @route '/api/v1/certificate-applications'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::index
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:29
 * @route '/api/v1/certificate-applications'
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
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::store
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
 * @route '/api/v1/certificate-applications'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/certificate-applications',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::store
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
 * @route '/api/v1/certificate-applications'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::store
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
 * @route '/api/v1/certificate-applications'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::store
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
 * @route '/api/v1/certificate-applications'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::store
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
 * @route '/api/v1/certificate-applications'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::show
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
 * @route '/api/v1/certificate-applications/{certificate_application}'
 */
export const show = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/certificate-applications/{certificate_application}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::show
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
 * @route '/api/v1/certificate-applications/{certificate_application}'
 */
show.url = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { certificate_application: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    certificate_application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        certificate_application: args.certificate_application,
                }

    return show.definition.url
            .replace('{certificate_application}', parsedArgs.certificate_application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::show
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
 * @route '/api/v1/certificate-applications/{certificate_application}'
 */
show.get = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::show
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
 * @route '/api/v1/certificate-applications/{certificate_application}'
 */
show.head = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::show
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
 * @route '/api/v1/certificate-applications/{certificate_application}'
 */
    const showForm = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::show
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
 * @route '/api/v1/certificate-applications/{certificate_application}'
 */
        showForm.get = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::show
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
 * @route '/api/v1/certificate-applications/{certificate_application}'
 */
        showForm.head = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::update
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:192
 * @route '/api/v1/certificate-applications/{certificate_application}'
 */
export const update = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/certificate-applications/{certificate_application}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::update
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:192
 * @route '/api/v1/certificate-applications/{certificate_application}'
 */
update.url = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { certificate_application: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    certificate_application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        certificate_application: args.certificate_application,
                }

    return update.definition.url
            .replace('{certificate_application}', parsedArgs.certificate_application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::update
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:192
 * @route '/api/v1/certificate-applications/{certificate_application}'
 */
update.put = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::update
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:192
 * @route '/api/v1/certificate-applications/{certificate_application}'
 */
update.patch = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::update
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:192
 * @route '/api/v1/certificate-applications/{certificate_application}'
 */
    const updateForm = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::update
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:192
 * @route '/api/v1/certificate-applications/{certificate_application}'
 */
        updateForm.put = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::update
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:192
 * @route '/api/v1/certificate-applications/{certificate_application}'
 */
        updateForm.patch = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::destroy
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
 * @route '/api/v1/certificate-applications/{certificate_application}'
 */
export const destroy = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/certificate-applications/{certificate_application}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::destroy
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
 * @route '/api/v1/certificate-applications/{certificate_application}'
 */
destroy.url = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { certificate_application: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    certificate_application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        certificate_application: args.certificate_application,
                }

    return destroy.definition.url
            .replace('{certificate_application}', parsedArgs.certificate_application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::destroy
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
 * @route '/api/v1/certificate-applications/{certificate_application}'
 */
destroy.delete = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::destroy
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
 * @route '/api/v1/certificate-applications/{certificate_application}'
 */
    const destroyForm = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::destroy
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
 * @route '/api/v1/certificate-applications/{certificate_application}'
 */
        destroyForm.delete = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const certificateApplications = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default certificateApplications