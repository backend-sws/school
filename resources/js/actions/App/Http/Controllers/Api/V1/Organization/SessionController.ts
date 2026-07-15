import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::publicIndex
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:65
 * @route '/api/v1/public/sessions'
 */
export const publicIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: publicIndex.url(options),
    method: 'get',
})

publicIndex.definition = {
    methods: ["get","head"],
    url: '/api/v1/public/sessions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::publicIndex
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:65
 * @route '/api/v1/public/sessions'
 */
publicIndex.url = (options?: RouteQueryOptions) => {
    return publicIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::publicIndex
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:65
 * @route '/api/v1/public/sessions'
 */
publicIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: publicIndex.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::publicIndex
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:65
 * @route '/api/v1/public/sessions'
 */
publicIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: publicIndex.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::publicIndex
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:65
 * @route '/api/v1/public/sessions'
 */
    const publicIndexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: publicIndex.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::publicIndex
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:65
 * @route '/api/v1/public/sessions'
 */
        publicIndexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: publicIndex.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::publicIndex
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:65
 * @route '/api/v1/public/sessions'
 */
        publicIndexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: publicIndex.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    publicIndex.form = publicIndexForm
/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::current
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:74
 * @route '/api/v1/sessions/current'
 */
export const current = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: current.url(options),
    method: 'get',
})

current.definition = {
    methods: ["get","head"],
    url: '/api/v1/sessions/current',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::current
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:74
 * @route '/api/v1/sessions/current'
 */
current.url = (options?: RouteQueryOptions) => {
    return current.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::current
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:74
 * @route '/api/v1/sessions/current'
 */
current.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: current.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::current
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:74
 * @route '/api/v1/sessions/current'
 */
current.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: current.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::current
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:74
 * @route '/api/v1/sessions/current'
 */
    const currentForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: current.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::current
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:74
 * @route '/api/v1/sessions/current'
 */
        currentForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: current.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::current
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:74
 * @route '/api/v1/sessions/current'
 */
        currentForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: current.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    current.form = currentForm
/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::suggestedYears
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:92
 * @route '/api/v1/sessions/suggested-years'
 */
export const suggestedYears = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: suggestedYears.url(options),
    method: 'get',
})

suggestedYears.definition = {
    methods: ["get","head"],
    url: '/api/v1/sessions/suggested-years',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::suggestedYears
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:92
 * @route '/api/v1/sessions/suggested-years'
 */
suggestedYears.url = (options?: RouteQueryOptions) => {
    return suggestedYears.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::suggestedYears
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:92
 * @route '/api/v1/sessions/suggested-years'
 */
suggestedYears.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: suggestedYears.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::suggestedYears
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:92
 * @route '/api/v1/sessions/suggested-years'
 */
suggestedYears.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: suggestedYears.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::suggestedYears
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:92
 * @route '/api/v1/sessions/suggested-years'
 */
    const suggestedYearsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: suggestedYears.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::suggestedYears
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:92
 * @route '/api/v1/sessions/suggested-years'
 */
        suggestedYearsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: suggestedYears.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::suggestedYears
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:92
 * @route '/api/v1/sessions/suggested-years'
 */
        suggestedYearsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: suggestedYears.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    suggestedYears.form = suggestedYearsForm
/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::toggleStatus
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:291
 * @route '/api/v1/sessions/{id}/toggle-status'
 */
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

toggleStatus.definition = {
    methods: ["patch"],
    url: '/api/v1/sessions/{id}/toggle-status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::toggleStatus
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:291
 * @route '/api/v1/sessions/{id}/toggle-status'
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
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::toggleStatus
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:291
 * @route '/api/v1/sessions/{id}/toggle-status'
 */
toggleStatus.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::toggleStatus
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:291
 * @route '/api/v1/sessions/{id}/toggle-status'
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
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::toggleStatus
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:291
 * @route '/api/v1/sessions/{id}/toggle-status'
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
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::index
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:46
 * @route '/api/v1/sessions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/sessions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::index
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:46
 * @route '/api/v1/sessions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::index
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:46
 * @route '/api/v1/sessions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::index
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:46
 * @route '/api/v1/sessions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::index
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:46
 * @route '/api/v1/sessions'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::index
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:46
 * @route '/api/v1/sessions'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::index
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:46
 * @route '/api/v1/sessions'
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
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::store
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:124
 * @route '/api/v1/sessions'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/sessions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::store
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:124
 * @route '/api/v1/sessions'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::store
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:124
 * @route '/api/v1/sessions'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::store
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:124
 * @route '/api/v1/sessions'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::store
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:124
 * @route '/api/v1/sessions'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::show
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:174
 * @route '/api/v1/sessions/{session}'
 */
export const show = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/sessions/{session}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::show
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:174
 * @route '/api/v1/sessions/{session}'
 */
show.url = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { session: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { session: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    session: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        session: typeof args.session === 'object'
                ? args.session.id
                : args.session,
                }

    return show.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::show
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:174
 * @route '/api/v1/sessions/{session}'
 */
show.get = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::show
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:174
 * @route '/api/v1/sessions/{session}'
 */
show.head = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::show
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:174
 * @route '/api/v1/sessions/{session}'
 */
    const showForm = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::show
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:174
 * @route '/api/v1/sessions/{session}'
 */
        showForm.get = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::show
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:174
 * @route '/api/v1/sessions/{session}'
 */
        showForm.head = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::update
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:197
 * @route '/api/v1/sessions/{session}'
 */
export const update = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/sessions/{session}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::update
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:197
 * @route '/api/v1/sessions/{session}'
 */
update.url = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { session: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { session: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    session: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        session: typeof args.session === 'object'
                ? args.session.id
                : args.session,
                }

    return update.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::update
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:197
 * @route '/api/v1/sessions/{session}'
 */
update.put = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::update
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:197
 * @route '/api/v1/sessions/{session}'
 */
update.patch = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::update
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:197
 * @route '/api/v1/sessions/{session}'
 */
    const updateForm = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::update
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:197
 * @route '/api/v1/sessions/{session}'
 */
        updateForm.put = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::update
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:197
 * @route '/api/v1/sessions/{session}'
 */
        updateForm.patch = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:251
 * @route '/api/v1/sessions/{session}'
 */
export const destroy = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/sessions/{session}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:251
 * @route '/api/v1/sessions/{session}'
 */
destroy.url = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { session: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { session: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    session: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        session: typeof args.session === 'object'
                ? args.session.id
                : args.session,
                }

    return destroy.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:251
 * @route '/api/v1/sessions/{session}'
 */
destroy.delete = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:251
 * @route '/api/v1/sessions/{session}'
 */
    const destroyForm = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\SessionController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/SessionController.php:251
 * @route '/api/v1/sessions/{session}'
 */
        destroyForm.delete = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const SessionController = { publicIndex, current, suggestedYears, toggleStatus, index, store, show, update, destroy }

export default SessionController