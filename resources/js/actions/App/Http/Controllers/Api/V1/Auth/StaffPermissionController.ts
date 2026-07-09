import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Auth\StaffPermissionController::show
 * @see app/Http/Controllers/Api/V1/Auth/StaffPermissionController.php:24
 * @route '/api/v1/staff/{user}/permissions'
 */
export const show = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/staff/{user}/permissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\StaffPermissionController::show
 * @see app/Http/Controllers/Api/V1/Auth/StaffPermissionController.php:24
 * @route '/api/v1/staff/{user}/permissions'
 */
show.url = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return show.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\StaffPermissionController::show
 * @see app/Http/Controllers/Api/V1/Auth/StaffPermissionController.php:24
 * @route '/api/v1/staff/{user}/permissions'
 */
show.get = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Auth\StaffPermissionController::show
 * @see app/Http/Controllers/Api/V1/Auth/StaffPermissionController.php:24
 * @route '/api/v1/staff/{user}/permissions'
 */
show.head = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Auth\StaffPermissionController::show
 * @see app/Http/Controllers/Api/V1/Auth/StaffPermissionController.php:24
 * @route '/api/v1/staff/{user}/permissions'
 */
    const showForm = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Auth\StaffPermissionController::show
 * @see app/Http/Controllers/Api/V1/Auth/StaffPermissionController.php:24
 * @route '/api/v1/staff/{user}/permissions'
 */
        showForm.get = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Auth\StaffPermissionController::show
 * @see app/Http/Controllers/Api/V1/Auth/StaffPermissionController.php:24
 * @route '/api/v1/staff/{user}/permissions'
 */
        showForm.head = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Auth\StaffPermissionController::syncWorkflows
 * @see app/Http/Controllers/Api/V1/Auth/StaffPermissionController.php:52
 * @route '/api/v1/staff/{user}/workflows'
 */
export const syncWorkflows = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncWorkflows.url(args, options),
    method: 'post',
})

syncWorkflows.definition = {
    methods: ["post"],
    url: '/api/v1/staff/{user}/workflows',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\StaffPermissionController::syncWorkflows
 * @see app/Http/Controllers/Api/V1/Auth/StaffPermissionController.php:52
 * @route '/api/v1/staff/{user}/workflows'
 */
syncWorkflows.url = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return syncWorkflows.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\StaffPermissionController::syncWorkflows
 * @see app/Http/Controllers/Api/V1/Auth/StaffPermissionController.php:52
 * @route '/api/v1/staff/{user}/workflows'
 */
syncWorkflows.post = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncWorkflows.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Auth\StaffPermissionController::syncWorkflows
 * @see app/Http/Controllers/Api/V1/Auth/StaffPermissionController.php:52
 * @route '/api/v1/staff/{user}/workflows'
 */
    const syncWorkflowsForm = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: syncWorkflows.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Auth\StaffPermissionController::syncWorkflows
 * @see app/Http/Controllers/Api/V1/Auth/StaffPermissionController.php:52
 * @route '/api/v1/staff/{user}/workflows'
 */
        syncWorkflowsForm.post = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: syncWorkflows.url(args, options),
            method: 'post',
        })
    
    syncWorkflows.form = syncWorkflowsForm
/**
* @see \App\Http\Controllers\Api\V1\Auth\StaffPermissionController::syncOverrides
 * @see app/Http/Controllers/Api/V1/Auth/StaffPermissionController.php:74
 * @route '/api/v1/staff/{user}/overrides'
 */
export const syncOverrides = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncOverrides.url(args, options),
    method: 'post',
})

syncOverrides.definition = {
    methods: ["post"],
    url: '/api/v1/staff/{user}/overrides',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\StaffPermissionController::syncOverrides
 * @see app/Http/Controllers/Api/V1/Auth/StaffPermissionController.php:74
 * @route '/api/v1/staff/{user}/overrides'
 */
syncOverrides.url = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return syncOverrides.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\StaffPermissionController::syncOverrides
 * @see app/Http/Controllers/Api/V1/Auth/StaffPermissionController.php:74
 * @route '/api/v1/staff/{user}/overrides'
 */
syncOverrides.post = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncOverrides.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Auth\StaffPermissionController::syncOverrides
 * @see app/Http/Controllers/Api/V1/Auth/StaffPermissionController.php:74
 * @route '/api/v1/staff/{user}/overrides'
 */
    const syncOverridesForm = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: syncOverrides.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Auth\StaffPermissionController::syncOverrides
 * @see app/Http/Controllers/Api/V1/Auth/StaffPermissionController.php:74
 * @route '/api/v1/staff/{user}/overrides'
 */
        syncOverridesForm.post = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: syncOverrides.url(args, options),
            method: 'post',
        })
    
    syncOverrides.form = syncOverridesForm
const StaffPermissionController = { show, syncWorkflows, syncOverrides }

export default StaffPermissionController