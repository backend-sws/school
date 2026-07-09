import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::toggleStatus
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:79
 * @route '/api/v1/id-card-templates/{id}/toggle-status'
 */
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

toggleStatus.definition = {
    methods: ["patch"],
    url: '/api/v1/id-card-templates/{id}/toggle-status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::toggleStatus
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:79
 * @route '/api/v1/id-card-templates/{id}/toggle-status'
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
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::toggleStatus
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:79
 * @route '/api/v1/id-card-templates/{id}/toggle-status'
 */
toggleStatus.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::toggleStatus
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:79
 * @route '/api/v1/id-card-templates/{id}/toggle-status'
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
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::toggleStatus
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:79
 * @route '/api/v1/id-card-templates/{id}/toggle-status'
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
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::index
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:19
 * @route '/api/v1/id-card-templates'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/id-card-templates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::index
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:19
 * @route '/api/v1/id-card-templates'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::index
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:19
 * @route '/api/v1/id-card-templates'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::index
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:19
 * @route '/api/v1/id-card-templates'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::index
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:19
 * @route '/api/v1/id-card-templates'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::index
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:19
 * @route '/api/v1/id-card-templates'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::index
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:19
 * @route '/api/v1/id-card-templates'
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
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::store
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:25
 * @route '/api/v1/id-card-templates'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/id-card-templates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::store
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:25
 * @route '/api/v1/id-card-templates'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::store
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:25
 * @route '/api/v1/id-card-templates'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::store
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:25
 * @route '/api/v1/id-card-templates'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::store
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:25
 * @route '/api/v1/id-card-templates'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::show
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:44
 * @route '/api/v1/id-card-templates/{id_card_template}'
 */
export const show = (args: { id_card_template: string | number } | [id_card_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/id-card-templates/{id_card_template}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::show
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:44
 * @route '/api/v1/id-card-templates/{id_card_template}'
 */
show.url = (args: { id_card_template: string | number } | [id_card_template: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id_card_template: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id_card_template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id_card_template: args.id_card_template,
                }

    return show.definition.url
            .replace('{id_card_template}', parsedArgs.id_card_template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::show
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:44
 * @route '/api/v1/id-card-templates/{id_card_template}'
 */
show.get = (args: { id_card_template: string | number } | [id_card_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::show
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:44
 * @route '/api/v1/id-card-templates/{id_card_template}'
 */
show.head = (args: { id_card_template: string | number } | [id_card_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::show
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:44
 * @route '/api/v1/id-card-templates/{id_card_template}'
 */
    const showForm = (args: { id_card_template: string | number } | [id_card_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::show
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:44
 * @route '/api/v1/id-card-templates/{id_card_template}'
 */
        showForm.get = (args: { id_card_template: string | number } | [id_card_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::show
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:44
 * @route '/api/v1/id-card-templates/{id_card_template}'
 */
        showForm.head = (args: { id_card_template: string | number } | [id_card_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::update
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:50
 * @route '/api/v1/id-card-templates/{id_card_template}'
 */
export const update = (args: { id_card_template: string | number } | [id_card_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/id-card-templates/{id_card_template}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::update
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:50
 * @route '/api/v1/id-card-templates/{id_card_template}'
 */
update.url = (args: { id_card_template: string | number } | [id_card_template: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id_card_template: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id_card_template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id_card_template: args.id_card_template,
                }

    return update.definition.url
            .replace('{id_card_template}', parsedArgs.id_card_template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::update
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:50
 * @route '/api/v1/id-card-templates/{id_card_template}'
 */
update.put = (args: { id_card_template: string | number } | [id_card_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::update
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:50
 * @route '/api/v1/id-card-templates/{id_card_template}'
 */
update.patch = (args: { id_card_template: string | number } | [id_card_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::update
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:50
 * @route '/api/v1/id-card-templates/{id_card_template}'
 */
    const updateForm = (args: { id_card_template: string | number } | [id_card_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::update
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:50
 * @route '/api/v1/id-card-templates/{id_card_template}'
 */
        updateForm.put = (args: { id_card_template: string | number } | [id_card_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::update
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:50
 * @route '/api/v1/id-card-templates/{id_card_template}'
 */
        updateForm.patch = (args: { id_card_template: string | number } | [id_card_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::destroy
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:69
 * @route '/api/v1/id-card-templates/{id_card_template}'
 */
export const destroy = (args: { id_card_template: string | number } | [id_card_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/id-card-templates/{id_card_template}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::destroy
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:69
 * @route '/api/v1/id-card-templates/{id_card_template}'
 */
destroy.url = (args: { id_card_template: string | number } | [id_card_template: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id_card_template: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id_card_template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id_card_template: args.id_card_template,
                }

    return destroy.definition.url
            .replace('{id_card_template}', parsedArgs.id_card_template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::destroy
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:69
 * @route '/api/v1/id-card-templates/{id_card_template}'
 */
destroy.delete = (args: { id_card_template: string | number } | [id_card_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::destroy
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:69
 * @route '/api/v1/id-card-templates/{id_card_template}'
 */
    const destroyForm = (args: { id_card_template: string | number } | [id_card_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::destroy
 * @see app/Http/Controllers/Api/V1/IdCards/IdCardTemplateController.php:69
 * @route '/api/v1/id-card-templates/{id_card_template}'
 */
        destroyForm.delete = (args: { id_card_template: string | number } | [id_card_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const IdCardTemplateController = { toggleStatus, index, store, show, update, destroy }

export default IdCardTemplateController