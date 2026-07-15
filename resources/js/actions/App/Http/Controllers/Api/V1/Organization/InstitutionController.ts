import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::index
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:42
 * @route '/api/v1/institutions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/institutions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::index
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:42
 * @route '/api/v1/institutions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::index
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:42
 * @route '/api/v1/institutions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::index
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:42
 * @route '/api/v1/institutions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::index
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:42
 * @route '/api/v1/institutions'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::index
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:42
 * @route '/api/v1/institutions'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::index
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:42
 * @route '/api/v1/institutions'
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
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::store
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:70
 * @route '/api/v1/institutions'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/institutions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::store
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:70
 * @route '/api/v1/institutions'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::store
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:70
 * @route '/api/v1/institutions'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::store
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:70
 * @route '/api/v1/institutions'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::store
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:70
 * @route '/api/v1/institutions'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::show
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:104
 * @route '/api/v1/institutions/{institution}'
 */
export const show = (args: { institution: string | number | { id: string | number } } | [institution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/institutions/{institution}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::show
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:104
 * @route '/api/v1/institutions/{institution}'
 */
show.url = (args: { institution: string | number | { id: string | number } } | [institution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { institution: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { institution: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    institution: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        institution: typeof args.institution === 'object'
                ? args.institution.id
                : args.institution,
                }

    return show.definition.url
            .replace('{institution}', parsedArgs.institution.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::show
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:104
 * @route '/api/v1/institutions/{institution}'
 */
show.get = (args: { institution: string | number | { id: string | number } } | [institution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::show
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:104
 * @route '/api/v1/institutions/{institution}'
 */
show.head = (args: { institution: string | number | { id: string | number } } | [institution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::show
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:104
 * @route '/api/v1/institutions/{institution}'
 */
    const showForm = (args: { institution: string | number | { id: string | number } } | [institution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::show
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:104
 * @route '/api/v1/institutions/{institution}'
 */
        showForm.get = (args: { institution: string | number | { id: string | number } } | [institution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::show
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:104
 * @route '/api/v1/institutions/{institution}'
 */
        showForm.head = (args: { institution: string | number | { id: string | number } } | [institution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::update
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:120
 * @route '/api/v1/institutions/{institution}'
 */
export const update = (args: { institution: string | number | { id: string | number } } | [institution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/institutions/{institution}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::update
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:120
 * @route '/api/v1/institutions/{institution}'
 */
update.url = (args: { institution: string | number | { id: string | number } } | [institution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { institution: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { institution: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    institution: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        institution: typeof args.institution === 'object'
                ? args.institution.id
                : args.institution,
                }

    return update.definition.url
            .replace('{institution}', parsedArgs.institution.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::update
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:120
 * @route '/api/v1/institutions/{institution}'
 */
update.put = (args: { institution: string | number | { id: string | number } } | [institution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::update
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:120
 * @route '/api/v1/institutions/{institution}'
 */
update.patch = (args: { institution: string | number | { id: string | number } } | [institution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::update
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:120
 * @route '/api/v1/institutions/{institution}'
 */
    const updateForm = (args: { institution: string | number | { id: string | number } } | [institution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::update
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:120
 * @route '/api/v1/institutions/{institution}'
 */
        updateForm.put = (args: { institution: string | number | { id: string | number } } | [institution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::update
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:120
 * @route '/api/v1/institutions/{institution}'
 */
        updateForm.patch = (args: { institution: string | number | { id: string | number } } | [institution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:152
 * @route '/api/v1/institutions/{institution}'
 */
export const destroy = (args: { institution: string | number | { id: string | number } } | [institution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/institutions/{institution}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:152
 * @route '/api/v1/institutions/{institution}'
 */
destroy.url = (args: { institution: string | number | { id: string | number } } | [institution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { institution: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { institution: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    institution: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        institution: typeof args.institution === 'object'
                ? args.institution.id
                : args.institution,
                }

    return destroy.definition.url
            .replace('{institution}', parsedArgs.institution.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:152
 * @route '/api/v1/institutions/{institution}'
 */
destroy.delete = (args: { institution: string | number | { id: string | number } } | [institution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:152
 * @route '/api/v1/institutions/{institution}'
 */
    const destroyForm = (args: { institution: string | number | { id: string | number } } | [institution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\InstitutionController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/InstitutionController.php:152
 * @route '/api/v1/institutions/{institution}'
 */
        destroyForm.delete = (args: { institution: string | number | { id: string | number } } | [institution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const InstitutionController = { index, store, show, update, destroy }

export default InstitutionController