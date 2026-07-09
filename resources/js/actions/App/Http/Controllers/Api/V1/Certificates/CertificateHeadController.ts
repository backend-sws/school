import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::toggleStatus
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:240
 * @route '/api/v1/certificate-heads/{id}/toggle-status'
 */
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

toggleStatus.definition = {
    methods: ["patch"],
    url: '/api/v1/certificate-heads/{id}/toggle-status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::toggleStatus
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:240
 * @route '/api/v1/certificate-heads/{id}/toggle-status'
 */
toggleStatus.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleStatus.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::toggleStatus
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:240
 * @route '/api/v1/certificate-heads/{id}/toggle-status'
 */
toggleStatus.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::toggleStatus
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:240
 * @route '/api/v1/certificate-heads/{id}/toggle-status'
 */
    const toggleStatusForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleStatus.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::toggleStatus
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:240
 * @route '/api/v1/certificate-heads/{id}/toggle-status'
 */
        toggleStatusForm.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::index
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:36
 * @route '/api/v1/certificate-heads'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/certificate-heads',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::index
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:36
 * @route '/api/v1/certificate-heads'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::index
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:36
 * @route '/api/v1/certificate-heads'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::index
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:36
 * @route '/api/v1/certificate-heads'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::index
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:36
 * @route '/api/v1/certificate-heads'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::index
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:36
 * @route '/api/v1/certificate-heads'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::index
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:36
 * @route '/api/v1/certificate-heads'
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
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::store
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:78
 * @route '/api/v1/certificate-heads'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/certificate-heads',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::store
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:78
 * @route '/api/v1/certificate-heads'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::store
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:78
 * @route '/api/v1/certificate-heads'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::store
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:78
 * @route '/api/v1/certificate-heads'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::store
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:78
 * @route '/api/v1/certificate-heads'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::show
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:141
 * @route '/api/v1/certificate-heads/{certificate_head}'
 */
export const show = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/certificate-heads/{certificate_head}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::show
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:141
 * @route '/api/v1/certificate-heads/{certificate_head}'
 */
show.url = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { certificate_head: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    certificate_head: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        certificate_head: args.certificate_head,
                }

    return show.definition.url
            .replace('{certificate_head}', parsedArgs.certificate_head.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::show
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:141
 * @route '/api/v1/certificate-heads/{certificate_head}'
 */
show.get = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::show
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:141
 * @route '/api/v1/certificate-heads/{certificate_head}'
 */
show.head = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::show
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:141
 * @route '/api/v1/certificate-heads/{certificate_head}'
 */
    const showForm = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::show
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:141
 * @route '/api/v1/certificate-heads/{certificate_head}'
 */
        showForm.get = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::show
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:141
 * @route '/api/v1/certificate-heads/{certificate_head}'
 */
        showForm.head = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::update
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:199
 * @route '/api/v1/certificate-heads/{certificate_head}'
 */
export const update = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/certificate-heads/{certificate_head}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::update
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:199
 * @route '/api/v1/certificate-heads/{certificate_head}'
 */
update.url = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { certificate_head: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    certificate_head: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        certificate_head: args.certificate_head,
                }

    return update.definition.url
            .replace('{certificate_head}', parsedArgs.certificate_head.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::update
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:199
 * @route '/api/v1/certificate-heads/{certificate_head}'
 */
update.put = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::update
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:199
 * @route '/api/v1/certificate-heads/{certificate_head}'
 */
update.patch = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::update
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:199
 * @route '/api/v1/certificate-heads/{certificate_head}'
 */
    const updateForm = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::update
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:199
 * @route '/api/v1/certificate-heads/{certificate_head}'
 */
        updateForm.put = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::update
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:199
 * @route '/api/v1/certificate-heads/{certificate_head}'
 */
        updateForm.patch = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::destroy
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:0
 * @route '/api/v1/certificate-heads/{certificate_head}'
 */
export const destroy = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/certificate-heads/{certificate_head}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::destroy
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:0
 * @route '/api/v1/certificate-heads/{certificate_head}'
 */
destroy.url = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { certificate_head: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    certificate_head: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        certificate_head: args.certificate_head,
                }

    return destroy.definition.url
            .replace('{certificate_head}', parsedArgs.certificate_head.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::destroy
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:0
 * @route '/api/v1/certificate-heads/{certificate_head}'
 */
destroy.delete = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::destroy
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:0
 * @route '/api/v1/certificate-heads/{certificate_head}'
 */
    const destroyForm = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::destroy
 * @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:0
 * @route '/api/v1/certificate-heads/{certificate_head}'
 */
        destroyForm.delete = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const CertificateHeadController = { toggleStatus, index, store, show, update, destroy }

export default CertificateHeadController