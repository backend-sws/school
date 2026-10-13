import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::toggleStatus
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:146
 * @route '/api/v1/departments/{id}/toggle-status'
 */
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

toggleStatus.definition = {
    methods: ["patch"],
    url: '/api/v1/departments/{id}/toggle-status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::toggleStatus
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:146
 * @route '/api/v1/departments/{id}/toggle-status'
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
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::toggleStatus
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:146
 * @route '/api/v1/departments/{id}/toggle-status'
 */
toggleStatus.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::toggleStatus
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:146
 * @route '/api/v1/departments/{id}/toggle-status'
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
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::toggleStatus
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:146
 * @route '/api/v1/departments/{id}/toggle-status'
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
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::index
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:32
 * @route '/api/v1/departments'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/departments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::index
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:32
 * @route '/api/v1/departments'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::index
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:32
 * @route '/api/v1/departments'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::index
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:32
 * @route '/api/v1/departments'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::index
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:32
 * @route '/api/v1/departments'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::index
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:32
 * @route '/api/v1/departments'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::index
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:32
 * @route '/api/v1/departments'
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
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::store
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:64
 * @route '/api/v1/departments'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/departments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::store
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:64
 * @route '/api/v1/departments'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::store
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:64
 * @route '/api/v1/departments'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::store
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:64
 * @route '/api/v1/departments'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::store
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:64
 * @route '/api/v1/departments'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::show
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:85
 * @route '/api/v1/departments/{department}'
 */
export const show = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/departments/{department}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::show
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:85
 * @route '/api/v1/departments/{department}'
 */
show.url = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { department: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { department: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    department: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        department: typeof args.department === 'object'
                ? args.department.id
                : args.department,
                }

    return show.definition.url
            .replace('{department}', parsedArgs.department.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::show
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:85
 * @route '/api/v1/departments/{department}'
 */
show.get = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::show
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:85
 * @route '/api/v1/departments/{department}'
 */
show.head = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::show
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:85
 * @route '/api/v1/departments/{department}'
 */
    const showForm = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::show
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:85
 * @route '/api/v1/departments/{department}'
 */
        showForm.get = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::show
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:85
 * @route '/api/v1/departments/{department}'
 */
        showForm.head = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::update
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:101
 * @route '/api/v1/departments/{department}'
 */
export const update = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/departments/{department}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::update
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:101
 * @route '/api/v1/departments/{department}'
 */
update.url = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { department: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { department: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    department: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        department: typeof args.department === 'object'
                ? args.department.id
                : args.department,
                }

    return update.definition.url
            .replace('{department}', parsedArgs.department.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::update
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:101
 * @route '/api/v1/departments/{department}'
 */
update.put = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::update
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:101
 * @route '/api/v1/departments/{department}'
 */
update.patch = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::update
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:101
 * @route '/api/v1/departments/{department}'
 */
    const updateForm = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::update
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:101
 * @route '/api/v1/departments/{department}'
 */
        updateForm.put = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::update
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:101
 * @route '/api/v1/departments/{department}'
 */
        updateForm.patch = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:122
 * @route '/api/v1/departments/{department}'
 */
export const destroy = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/departments/{department}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:122
 * @route '/api/v1/departments/{department}'
 */
destroy.url = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { department: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { department: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    department: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        department: typeof args.department === 'object'
                ? args.department.id
                : args.department,
                }

    return destroy.definition.url
            .replace('{department}', parsedArgs.department.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:122
 * @route '/api/v1/departments/{department}'
 */
destroy.delete = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:122
 * @route '/api/v1/departments/{department}'
 */
    const destroyForm = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\DepartmentController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/DepartmentController.php:122
 * @route '/api/v1/departments/{department}'
 */
        destroyForm.delete = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const DepartmentController = { toggleStatus, index, store, show, update, destroy }

export default DepartmentController