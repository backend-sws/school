import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Auth\WorkflowController::index
* @see app/Http/Controllers/Api/V1/Auth/WorkflowController.php:29
* @route '/api/v1/workflows'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/workflows',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\WorkflowController::index
* @see app/Http/Controllers/Api/V1/Auth/WorkflowController.php:29
* @route '/api/v1/workflows'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\WorkflowController::index
* @see app/Http/Controllers/Api/V1/Auth/WorkflowController.php:29
* @route '/api/v1/workflows'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\WorkflowController::index
* @see app/Http/Controllers/Api/V1/Auth/WorkflowController.php:29
* @route '/api/v1/workflows'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\WorkflowController::store
* @see app/Http/Controllers/Api/V1/Auth/WorkflowController.php:50
* @route '/api/v1/workflows'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/workflows',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\WorkflowController::store
* @see app/Http/Controllers/Api/V1/Auth/WorkflowController.php:50
* @route '/api/v1/workflows'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\WorkflowController::store
* @see app/Http/Controllers/Api/V1/Auth/WorkflowController.php:50
* @route '/api/v1/workflows'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\WorkflowController::show
* @see app/Http/Controllers/Api/V1/Auth/WorkflowController.php:77
* @route '/api/v1/workflows/{workflow}'
*/
export const show = (args: { workflow: number | { id: number } } | [workflow: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/workflows/{workflow}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\WorkflowController::show
* @see app/Http/Controllers/Api/V1/Auth/WorkflowController.php:77
* @route '/api/v1/workflows/{workflow}'
*/
show.url = (args: { workflow: number | { id: number } } | [workflow: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workflow: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { workflow: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            workflow: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workflow: typeof args.workflow === 'object'
        ? args.workflow.id
        : args.workflow,
    }

    return show.definition.url
            .replace('{workflow}', parsedArgs.workflow.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\WorkflowController::show
* @see app/Http/Controllers/Api/V1/Auth/WorkflowController.php:77
* @route '/api/v1/workflows/{workflow}'
*/
show.get = (args: { workflow: number | { id: number } } | [workflow: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\WorkflowController::show
* @see app/Http/Controllers/Api/V1/Auth/WorkflowController.php:77
* @route '/api/v1/workflows/{workflow}'
*/
show.head = (args: { workflow: number | { id: number } } | [workflow: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\WorkflowController::update
* @see app/Http/Controllers/Api/V1/Auth/WorkflowController.php:89
* @route '/api/v1/workflows/{workflow}'
*/
export const update = (args: { workflow: number | { id: number } } | [workflow: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/workflows/{workflow}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\WorkflowController::update
* @see app/Http/Controllers/Api/V1/Auth/WorkflowController.php:89
* @route '/api/v1/workflows/{workflow}'
*/
update.url = (args: { workflow: number | { id: number } } | [workflow: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workflow: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { workflow: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            workflow: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workflow: typeof args.workflow === 'object'
        ? args.workflow.id
        : args.workflow,
    }

    return update.definition.url
            .replace('{workflow}', parsedArgs.workflow.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\WorkflowController::update
* @see app/Http/Controllers/Api/V1/Auth/WorkflowController.php:89
* @route '/api/v1/workflows/{workflow}'
*/
update.put = (args: { workflow: number | { id: number } } | [workflow: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\WorkflowController::update
* @see app/Http/Controllers/Api/V1/Auth/WorkflowController.php:89
* @route '/api/v1/workflows/{workflow}'
*/
update.patch = (args: { workflow: number | { id: number } } | [workflow: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\WorkflowController::destroy
* @see app/Http/Controllers/Api/V1/Auth/WorkflowController.php:108
* @route '/api/v1/workflows/{workflow}'
*/
export const destroy = (args: { workflow: number | { id: number } } | [workflow: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/workflows/{workflow}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\WorkflowController::destroy
* @see app/Http/Controllers/Api/V1/Auth/WorkflowController.php:108
* @route '/api/v1/workflows/{workflow}'
*/
destroy.url = (args: { workflow: number | { id: number } } | [workflow: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workflow: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { workflow: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            workflow: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workflow: typeof args.workflow === 'object'
        ? args.workflow.id
        : args.workflow,
    }

    return destroy.definition.url
            .replace('{workflow}', parsedArgs.workflow.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\WorkflowController::destroy
* @see app/Http/Controllers/Api/V1/Auth/WorkflowController.php:108
* @route '/api/v1/workflows/{workflow}'
*/
destroy.delete = (args: { workflow: number | { id: number } } | [workflow: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\WorkflowController::syncPermissions
* @see app/Http/Controllers/Api/V1/Auth/WorkflowController.php:121
* @route '/api/v1/workflows/{workflow}/permissions'
*/
export const syncPermissions = (args: { workflow: number | { id: number } } | [workflow: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncPermissions.url(args, options),
    method: 'post',
})

syncPermissions.definition = {
    methods: ["post"],
    url: '/api/v1/workflows/{workflow}/permissions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\WorkflowController::syncPermissions
* @see app/Http/Controllers/Api/V1/Auth/WorkflowController.php:121
* @route '/api/v1/workflows/{workflow}/permissions'
*/
syncPermissions.url = (args: { workflow: number | { id: number } } | [workflow: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workflow: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { workflow: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            workflow: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workflow: typeof args.workflow === 'object'
        ? args.workflow.id
        : args.workflow,
    }

    return syncPermissions.definition.url
            .replace('{workflow}', parsedArgs.workflow.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\WorkflowController::syncPermissions
* @see app/Http/Controllers/Api/V1/Auth/WorkflowController.php:121
* @route '/api/v1/workflows/{workflow}/permissions'
*/
syncPermissions.post = (args: { workflow: number | { id: number } } | [workflow: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncPermissions.url(args, options),
    method: 'post',
})

const WorkflowController = { index, store, show, update, destroy, syncPermissions }

export default WorkflowController