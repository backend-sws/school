import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::index
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:60
 * @route '/api/v1/settings'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::index
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:60
 * @route '/api/v1/settings'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::index
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:60
 * @route '/api/v1/settings'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::index
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:60
 * @route '/api/v1/settings'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::index
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:60
 * @route '/api/v1/settings'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::index
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:60
 * @route '/api/v1/settings'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::index
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:60
 * @route '/api/v1/settings'
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
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::getByGroup
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:157
 * @route '/api/v1/settings/group/{group}'
 */
export const getByGroup = (args: { group: string | number } | [group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getByGroup.url(args, options),
    method: 'get',
})

getByGroup.definition = {
    methods: ["get","head"],
    url: '/api/v1/settings/group/{group}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::getByGroup
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:157
 * @route '/api/v1/settings/group/{group}'
 */
getByGroup.url = (args: { group: string | number } | [group: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { group: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    group: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        group: args.group,
                }

    return getByGroup.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::getByGroup
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:157
 * @route '/api/v1/settings/group/{group}'
 */
getByGroup.get = (args: { group: string | number } | [group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getByGroup.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::getByGroup
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:157
 * @route '/api/v1/settings/group/{group}'
 */
getByGroup.head = (args: { group: string | number } | [group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getByGroup.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::getByGroup
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:157
 * @route '/api/v1/settings/group/{group}'
 */
    const getByGroupForm = (args: { group: string | number } | [group: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getByGroup.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::getByGroup
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:157
 * @route '/api/v1/settings/group/{group}'
 */
        getByGroupForm.get = (args: { group: string | number } | [group: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getByGroup.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::getByGroup
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:157
 * @route '/api/v1/settings/group/{group}'
 */
        getByGroupForm.head = (args: { group: string | number } | [group: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getByGroup.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getByGroup.form = getByGroupForm
/**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::updateByGroup
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:218
 * @route '/api/v1/settings/group/{group}'
 */
export const updateByGroup = (args: { group: string | number } | [group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateByGroup.url(args, options),
    method: 'post',
})

updateByGroup.definition = {
    methods: ["post"],
    url: '/api/v1/settings/group/{group}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::updateByGroup
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:218
 * @route '/api/v1/settings/group/{group}'
 */
updateByGroup.url = (args: { group: string | number } | [group: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { group: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    group: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        group: args.group,
                }

    return updateByGroup.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::updateByGroup
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:218
 * @route '/api/v1/settings/group/{group}'
 */
updateByGroup.post = (args: { group: string | number } | [group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateByGroup.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::updateByGroup
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:218
 * @route '/api/v1/settings/group/{group}'
 */
    const updateByGroupForm = (args: { group: string | number } | [group: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateByGroup.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::updateByGroup
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:218
 * @route '/api/v1/settings/group/{group}'
 */
        updateByGroupForm.post = (args: { group: string | number } | [group: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateByGroup.url(args, options),
            method: 'post',
        })
    
    updateByGroup.form = updateByGroupForm
/**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::store
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:92
 * @route '/api/v1/settings'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/settings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::store
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:92
 * @route '/api/v1/settings'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::store
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:92
 * @route '/api/v1/settings'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::store
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:92
 * @route '/api/v1/settings'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::store
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:92
 * @route '/api/v1/settings'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::update
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:320
 * @route '/api/v1/settings'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/v1/settings',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::update
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:320
 * @route '/api/v1/settings'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::update
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:320
 * @route '/api/v1/settings'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::update
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:320
 * @route '/api/v1/settings'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::update
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:320
 * @route '/api/v1/settings'
 */
        updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::show
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:118
 * @route '/api/v1/settings/{key}'
 */
export const show = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/settings/{key}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::show
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:118
 * @route '/api/v1/settings/{key}'
 */
show.url = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { key: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    key: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        key: args.key,
                }

    return show.definition.url
            .replace('{key}', parsedArgs.key.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::show
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:118
 * @route '/api/v1/settings/{key}'
 */
show.get = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::show
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:118
 * @route '/api/v1/settings/{key}'
 */
show.head = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::show
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:118
 * @route '/api/v1/settings/{key}'
 */
    const showForm = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::show
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:118
 * @route '/api/v1/settings/{key}'
 */
        showForm.get = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Settings\SettingController::show
 * @see app/Http/Controllers/Api/V1/Settings/SettingController.php:118
 * @route '/api/v1/settings/{key}'
 */
        showForm.head = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const SettingController = { index, getByGroup, updateByGroup, store, update, show }

export default SettingController