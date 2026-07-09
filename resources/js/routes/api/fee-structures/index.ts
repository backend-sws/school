import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::show
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:0
 * @route '/api/v1/fee-structures/{fee_structure}'
 */
export const show = (args: { fee_structure: string | number } | [fee_structure: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/fee-structures/{fee_structure}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::show
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:0
 * @route '/api/v1/fee-structures/{fee_structure}'
 */
show.url = (args: { fee_structure: string | number } | [fee_structure: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fee_structure: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    fee_structure: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        fee_structure: args.fee_structure,
                }

    return show.definition.url
            .replace('{fee_structure}', parsedArgs.fee_structure.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::show
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:0
 * @route '/api/v1/fee-structures/{fee_structure}'
 */
show.get = (args: { fee_structure: string | number } | [fee_structure: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::show
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:0
 * @route '/api/v1/fee-structures/{fee_structure}'
 */
show.head = (args: { fee_structure: string | number } | [fee_structure: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::show
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:0
 * @route '/api/v1/fee-structures/{fee_structure}'
 */
    const showForm = (args: { fee_structure: string | number } | [fee_structure: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::show
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:0
 * @route '/api/v1/fee-structures/{fee_structure}'
 */
        showForm.get = (args: { fee_structure: string | number } | [fee_structure: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::show
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:0
 * @route '/api/v1/fee-structures/{fee_structure}'
 */
        showForm.head = (args: { fee_structure: string | number } | [fee_structure: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::update
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:0
 * @route '/api/v1/fee-structures/{fee_structure}'
 */
export const update = (args: { fee_structure: string | number } | [fee_structure: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/fee-structures/{fee_structure}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::update
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:0
 * @route '/api/v1/fee-structures/{fee_structure}'
 */
update.url = (args: { fee_structure: string | number } | [fee_structure: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fee_structure: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    fee_structure: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        fee_structure: args.fee_structure,
                }

    return update.definition.url
            .replace('{fee_structure}', parsedArgs.fee_structure.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::update
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:0
 * @route '/api/v1/fee-structures/{fee_structure}'
 */
update.put = (args: { fee_structure: string | number } | [fee_structure: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::update
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:0
 * @route '/api/v1/fee-structures/{fee_structure}'
 */
update.patch = (args: { fee_structure: string | number } | [fee_structure: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::update
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:0
 * @route '/api/v1/fee-structures/{fee_structure}'
 */
    const updateForm = (args: { fee_structure: string | number } | [fee_structure: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::update
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:0
 * @route '/api/v1/fee-structures/{fee_structure}'
 */
        updateForm.put = (args: { fee_structure: string | number } | [fee_structure: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::update
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:0
 * @route '/api/v1/fee-structures/{fee_structure}'
 */
        updateForm.patch = (args: { fee_structure: string | number } | [fee_structure: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::destroy
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:0
 * @route '/api/v1/fee-structures/{fee_structure}'
 */
export const destroy = (args: { fee_structure: string | number } | [fee_structure: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/fee-structures/{fee_structure}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::destroy
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:0
 * @route '/api/v1/fee-structures/{fee_structure}'
 */
destroy.url = (args: { fee_structure: string | number } | [fee_structure: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fee_structure: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    fee_structure: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        fee_structure: args.fee_structure,
                }

    return destroy.definition.url
            .replace('{fee_structure}', parsedArgs.fee_structure.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::destroy
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:0
 * @route '/api/v1/fee-structures/{fee_structure}'
 */
destroy.delete = (args: { fee_structure: string | number } | [fee_structure: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::destroy
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:0
 * @route '/api/v1/fee-structures/{fee_structure}'
 */
    const destroyForm = (args: { fee_structure: string | number } | [fee_structure: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::destroy
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:0
 * @route '/api/v1/fee-structures/{fee_structure}'
 */
        destroyForm.delete = (args: { fee_structure: string | number } | [fee_structure: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const feeStructures = {
    show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default feeStructures