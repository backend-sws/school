import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::index
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:20
 * @route '/api/v1/organizations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/organizations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::index
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:20
 * @route '/api/v1/organizations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::index
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:20
 * @route '/api/v1/organizations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::index
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:20
 * @route '/api/v1/organizations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::index
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:20
 * @route '/api/v1/organizations'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::index
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:20
 * @route '/api/v1/organizations'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::index
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:20
 * @route '/api/v1/organizations'
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
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::store
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:33
 * @route '/api/v1/organizations'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/organizations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::store
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:33
 * @route '/api/v1/organizations'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::store
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:33
 * @route '/api/v1/organizations'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::store
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:33
 * @route '/api/v1/organizations'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::store
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:33
 * @route '/api/v1/organizations'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::show
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:57
 * @route '/api/v1/organizations/{organization}'
 */
export const show = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/organizations/{organization}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::show
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:57
 * @route '/api/v1/organizations/{organization}'
 */
show.url = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { organization: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
                }

    return show.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::show
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:57
 * @route '/api/v1/organizations/{organization}'
 */
show.get = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::show
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:57
 * @route '/api/v1/organizations/{organization}'
 */
show.head = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::show
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:57
 * @route '/api/v1/organizations/{organization}'
 */
    const showForm = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::show
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:57
 * @route '/api/v1/organizations/{organization}'
 */
        showForm.get = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::show
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:57
 * @route '/api/v1/organizations/{organization}'
 */
        showForm.head = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::update
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:67
 * @route '/api/v1/organizations/{organization}'
 */
export const update = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/organizations/{organization}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::update
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:67
 * @route '/api/v1/organizations/{organization}'
 */
update.url = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { organization: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
                }

    return update.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::update
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:67
 * @route '/api/v1/organizations/{organization}'
 */
update.put = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::update
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:67
 * @route '/api/v1/organizations/{organization}'
 */
update.patch = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::update
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:67
 * @route '/api/v1/organizations/{organization}'
 */
    const updateForm = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::update
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:67
 * @route '/api/v1/organizations/{organization}'
 */
        updateForm.put = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::update
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:67
 * @route '/api/v1/organizations/{organization}'
 */
        updateForm.patch = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:90
 * @route '/api/v1/organizations/{organization}'
 */
export const destroy = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/organizations/{organization}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:90
 * @route '/api/v1/organizations/{organization}'
 */
destroy.url = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { organization: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
                }

    return destroy.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:90
 * @route '/api/v1/organizations/{organization}'
 */
destroy.delete = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:90
 * @route '/api/v1/organizations/{organization}'
 */
    const destroyForm = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\OrganizationController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/OrganizationController.php:90
 * @route '/api/v1/organizations/{organization}'
 */
        destroyForm.delete = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const organizations = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default organizations