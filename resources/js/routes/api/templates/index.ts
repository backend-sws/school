import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::index
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:12
 * @route '/api/v1/timetable/templates'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/timetable/templates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::index
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:12
 * @route '/api/v1/timetable/templates'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::index
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:12
 * @route '/api/v1/timetable/templates'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::index
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:12
 * @route '/api/v1/timetable/templates'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::index
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:12
 * @route '/api/v1/timetable/templates'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::index
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:12
 * @route '/api/v1/timetable/templates'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::index
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:12
 * @route '/api/v1/timetable/templates'
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
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::store
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:18
 * @route '/api/v1/timetable/templates'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/timetable/templates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::store
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:18
 * @route '/api/v1/timetable/templates'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::store
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:18
 * @route '/api/v1/timetable/templates'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::store
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:18
 * @route '/api/v1/timetable/templates'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::store
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:18
 * @route '/api/v1/timetable/templates'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::show
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:32
 * @route '/api/v1/timetable/templates/{template}'
 */
export const show = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/timetable/templates/{template}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::show
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:32
 * @route '/api/v1/timetable/templates/{template}'
 */
show.url = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { template: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { template: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        template: typeof args.template === 'object'
                ? args.template.id
                : args.template,
                }

    return show.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::show
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:32
 * @route '/api/v1/timetable/templates/{template}'
 */
show.get = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::show
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:32
 * @route '/api/v1/timetable/templates/{template}'
 */
show.head = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::show
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:32
 * @route '/api/v1/timetable/templates/{template}'
 */
    const showForm = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::show
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:32
 * @route '/api/v1/timetable/templates/{template}'
 */
        showForm.get = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::show
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:32
 * @route '/api/v1/timetable/templates/{template}'
 */
        showForm.head = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::update
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:37
 * @route '/api/v1/timetable/templates/{template}'
 */
export const update = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/timetable/templates/{template}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::update
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:37
 * @route '/api/v1/timetable/templates/{template}'
 */
update.url = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { template: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { template: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        template: typeof args.template === 'object'
                ? args.template.id
                : args.template,
                }

    return update.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::update
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:37
 * @route '/api/v1/timetable/templates/{template}'
 */
update.put = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::update
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:37
 * @route '/api/v1/timetable/templates/{template}'
 */
update.patch = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::update
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:37
 * @route '/api/v1/timetable/templates/{template}'
 */
    const updateForm = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::update
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:37
 * @route '/api/v1/timetable/templates/{template}'
 */
        updateForm.put = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::update
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:37
 * @route '/api/v1/timetable/templates/{template}'
 */
        updateForm.patch = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::destroy
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:51
 * @route '/api/v1/timetable/templates/{template}'
 */
export const destroy = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/timetable/templates/{template}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::destroy
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:51
 * @route '/api/v1/timetable/templates/{template}'
 */
destroy.url = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { template: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { template: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        template: typeof args.template === 'object'
                ? args.template.id
                : args.template,
                }

    return destroy.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::destroy
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:51
 * @route '/api/v1/timetable/templates/{template}'
 */
destroy.delete = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::destroy
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:51
 * @route '/api/v1/timetable/templates/{template}'
 */
    const destroyForm = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::destroy
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableTemplateController.php:51
 * @route '/api/v1/timetable/templates/{template}'
 */
        destroyForm.delete = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const templates = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default templates