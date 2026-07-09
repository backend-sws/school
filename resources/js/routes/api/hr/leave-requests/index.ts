import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveRequestController::index
 * @see app/Http/Controllers/Api/V1/HR/LeaveRequestController.php:12
 * @route '/api/v1/hr/leave-requests'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/hr/leave-requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveRequestController::index
 * @see app/Http/Controllers/Api/V1/HR/LeaveRequestController.php:12
 * @route '/api/v1/hr/leave-requests'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveRequestController::index
 * @see app/Http/Controllers/Api/V1/HR/LeaveRequestController.php:12
 * @route '/api/v1/hr/leave-requests'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveRequestController::index
 * @see app/Http/Controllers/Api/V1/HR/LeaveRequestController.php:12
 * @route '/api/v1/hr/leave-requests'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\LeaveRequestController::index
 * @see app/Http/Controllers/Api/V1/HR/LeaveRequestController.php:12
 * @route '/api/v1/hr/leave-requests'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\LeaveRequestController::index
 * @see app/Http/Controllers/Api/V1/HR/LeaveRequestController.php:12
 * @route '/api/v1/hr/leave-requests'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\HR\LeaveRequestController::index
 * @see app/Http/Controllers/Api/V1/HR/LeaveRequestController.php:12
 * @route '/api/v1/hr/leave-requests'
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
* @see \App\Http\Controllers\Api\V1\HR\LeaveRequestController::store
 * @see app/Http/Controllers/Api/V1/HR/LeaveRequestController.php:22
 * @route '/api/v1/hr/leave-requests'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/hr/leave-requests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveRequestController::store
 * @see app/Http/Controllers/Api/V1/HR/LeaveRequestController.php:22
 * @route '/api/v1/hr/leave-requests'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveRequestController::store
 * @see app/Http/Controllers/Api/V1/HR/LeaveRequestController.php:22
 * @route '/api/v1/hr/leave-requests'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\LeaveRequestController::store
 * @see app/Http/Controllers/Api/V1/HR/LeaveRequestController.php:22
 * @route '/api/v1/hr/leave-requests'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\LeaveRequestController::store
 * @see app/Http/Controllers/Api/V1/HR/LeaveRequestController.php:22
 * @route '/api/v1/hr/leave-requests'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveRequestController::update
 * @see app/Http/Controllers/Api/V1/HR/LeaveRequestController.php:0
 * @route '/api/v1/hr/leave-requests/{leave_request}'
 */
export const update = (args: { leave_request: string | number } | [leave_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/hr/leave-requests/{leave_request}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveRequestController::update
 * @see app/Http/Controllers/Api/V1/HR/LeaveRequestController.php:0
 * @route '/api/v1/hr/leave-requests/{leave_request}'
 */
update.url = (args: { leave_request: string | number } | [leave_request: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leave_request: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    leave_request: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        leave_request: args.leave_request,
                }

    return update.definition.url
            .replace('{leave_request}', parsedArgs.leave_request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveRequestController::update
 * @see app/Http/Controllers/Api/V1/HR/LeaveRequestController.php:0
 * @route '/api/v1/hr/leave-requests/{leave_request}'
 */
update.put = (args: { leave_request: string | number } | [leave_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveRequestController::update
 * @see app/Http/Controllers/Api/V1/HR/LeaveRequestController.php:0
 * @route '/api/v1/hr/leave-requests/{leave_request}'
 */
update.patch = (args: { leave_request: string | number } | [leave_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\LeaveRequestController::update
 * @see app/Http/Controllers/Api/V1/HR/LeaveRequestController.php:0
 * @route '/api/v1/hr/leave-requests/{leave_request}'
 */
    const updateForm = (args: { leave_request: string | number } | [leave_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\LeaveRequestController::update
 * @see app/Http/Controllers/Api/V1/HR/LeaveRequestController.php:0
 * @route '/api/v1/hr/leave-requests/{leave_request}'
 */
        updateForm.put = (args: { leave_request: string | number } | [leave_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\HR\LeaveRequestController::update
 * @see app/Http/Controllers/Api/V1/HR/LeaveRequestController.php:0
 * @route '/api/v1/hr/leave-requests/{leave_request}'
 */
        updateForm.patch = (args: { leave_request: string | number } | [leave_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const leaveRequests = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
}

export default leaveRequests