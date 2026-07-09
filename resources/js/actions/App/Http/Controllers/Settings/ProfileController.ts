import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\ProfileController::show
 * @see app/Http/Controllers/Settings/ProfileController.php:36
 * @route '/api/v1/settings/profile'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/settings/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\ProfileController::show
 * @see app/Http/Controllers/Settings/ProfileController.php:36
 * @route '/api/v1/settings/profile'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::show
 * @see app/Http/Controllers/Settings/ProfileController.php:36
 * @route '/api/v1/settings/profile'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\ProfileController::show
 * @see app/Http/Controllers/Settings/ProfileController.php:36
 * @route '/api/v1/settings/profile'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Settings\ProfileController::show
 * @see app/Http/Controllers/Settings/ProfileController.php:36
 * @route '/api/v1/settings/profile'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Settings\ProfileController::show
 * @see app/Http/Controllers/Settings/ProfileController.php:36
 * @route '/api/v1/settings/profile'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Settings\ProfileController::show
 * @see app/Http/Controllers/Settings/ProfileController.php:36
 * @route '/api/v1/settings/profile'
 */
        showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:49
 * @route '/api/v1/settings/profile'
 */
const updateae9c7fb79cbf4d5f9ffa3dce834eec71 = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateae9c7fb79cbf4d5f9ffa3dce834eec71.url(options),
    method: 'patch',
})

updateae9c7fb79cbf4d5f9ffa3dce834eec71.definition = {
    methods: ["patch"],
    url: '/api/v1/settings/profile',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:49
 * @route '/api/v1/settings/profile'
 */
updateae9c7fb79cbf4d5f9ffa3dce834eec71.url = (options?: RouteQueryOptions) => {
    return updateae9c7fb79cbf4d5f9ffa3dce834eec71.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:49
 * @route '/api/v1/settings/profile'
 */
updateae9c7fb79cbf4d5f9ffa3dce834eec71.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateae9c7fb79cbf4d5f9ffa3dce834eec71.url(options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:49
 * @route '/api/v1/settings/profile'
 */
    const updateae9c7fb79cbf4d5f9ffa3dce834eec71Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateae9c7fb79cbf4d5f9ffa3dce834eec71.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:49
 * @route '/api/v1/settings/profile'
 */
        updateae9c7fb79cbf4d5f9ffa3dce834eec71Form.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateae9c7fb79cbf4d5f9ffa3dce834eec71.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateae9c7fb79cbf4d5f9ffa3dce834eec71.form = updateae9c7fb79cbf4d5f9ffa3dce834eec71Form
    /**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:49
 * @route '/settings/profile'
 */
const updatefc6874003af373efc88e5e18eecd9c17 = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatefc6874003af373efc88e5e18eecd9c17.url(options),
    method: 'patch',
})

updatefc6874003af373efc88e5e18eecd9c17.definition = {
    methods: ["patch"],
    url: '/settings/profile',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:49
 * @route '/settings/profile'
 */
updatefc6874003af373efc88e5e18eecd9c17.url = (options?: RouteQueryOptions) => {
    return updatefc6874003af373efc88e5e18eecd9c17.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:49
 * @route '/settings/profile'
 */
updatefc6874003af373efc88e5e18eecd9c17.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatefc6874003af373efc88e5e18eecd9c17.url(options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:49
 * @route '/settings/profile'
 */
    const updatefc6874003af373efc88e5e18eecd9c17Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updatefc6874003af373efc88e5e18eecd9c17.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:49
 * @route '/settings/profile'
 */
        updatefc6874003af373efc88e5e18eecd9c17Form.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updatefc6874003af373efc88e5e18eecd9c17.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updatefc6874003af373efc88e5e18eecd9c17.form = updatefc6874003af373efc88e5e18eecd9c17Form

/**
* Multiple routes resolve to \App\Http\Controllers\Settings\ProfileController::update, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `update['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const update = {
    '/api/v1/settings/profile': updateae9c7fb79cbf4d5f9ffa3dce834eec71,
    '/settings/profile': updatefc6874003af373efc88e5e18eecd9c17,
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:23
 * @route '/settings/profile'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:23
 * @route '/settings/profile'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:23
 * @route '/settings/profile'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:23
 * @route '/settings/profile'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:23
 * @route '/settings/profile'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:23
 * @route '/settings/profile'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:23
 * @route '/settings/profile'
 */
        editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
 * @see app/Http/Controllers/Settings/ProfileController.php:91
 * @route '/settings/profile'
 */
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/profile',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
 * @see app/Http/Controllers/Settings/ProfileController.php:91
 * @route '/settings/profile'
 */
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
 * @see app/Http/Controllers/Settings/ProfileController.php:91
 * @route '/settings/profile'
 */
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
 * @see app/Http/Controllers/Settings/ProfileController.php:91
 * @route '/settings/profile'
 */
    const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
 * @see app/Http/Controllers/Settings/ProfileController.php:91
 * @route '/settings/profile'
 */
        destroyForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ProfileController = { show, update, edit, destroy }

export default ProfileController