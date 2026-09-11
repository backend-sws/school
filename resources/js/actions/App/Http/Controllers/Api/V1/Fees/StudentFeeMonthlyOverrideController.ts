import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Fees\StudentFeeMonthlyOverrideController::upsert
 * @see app/Http/Controllers/Api/V1/Fees/StudentFeeMonthlyOverrideController.php:17
 * @route '/api/v1/fees/monthly-overrides'
 */
export const upsert = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upsert.url(options),
    method: 'post',
})

upsert.definition = {
    methods: ["post"],
    url: '/api/v1/fees/monthly-overrides',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\StudentFeeMonthlyOverrideController::upsert
 * @see app/Http/Controllers/Api/V1/Fees/StudentFeeMonthlyOverrideController.php:17
 * @route '/api/v1/fees/monthly-overrides'
 */
upsert.url = (options?: RouteQueryOptions) => {
    return upsert.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\StudentFeeMonthlyOverrideController::upsert
 * @see app/Http/Controllers/Api/V1/Fees/StudentFeeMonthlyOverrideController.php:17
 * @route '/api/v1/fees/monthly-overrides'
 */
upsert.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upsert.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\StudentFeeMonthlyOverrideController::upsert
 * @see app/Http/Controllers/Api/V1/Fees/StudentFeeMonthlyOverrideController.php:17
 * @route '/api/v1/fees/monthly-overrides'
 */
    const upsertForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: upsert.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\StudentFeeMonthlyOverrideController::upsert
 * @see app/Http/Controllers/Api/V1/Fees/StudentFeeMonthlyOverrideController.php:17
 * @route '/api/v1/fees/monthly-overrides'
 */
        upsertForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: upsert.url(options),
            method: 'post',
        })
    
    upsert.form = upsertForm
/**
* @see \App\Http\Controllers\Api\V1\Fees\StudentFeeMonthlyOverrideController::destroy
 * @see app/Http/Controllers/Api/V1/Fees/StudentFeeMonthlyOverrideController.php:130
 * @route '/api/v1/fees/monthly-overrides/{id}'
 */
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/fees/monthly-overrides/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\StudentFeeMonthlyOverrideController::destroy
 * @see app/Http/Controllers/Api/V1/Fees/StudentFeeMonthlyOverrideController.php:130
 * @route '/api/v1/fees/monthly-overrides/{id}'
 */
destroy.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\StudentFeeMonthlyOverrideController::destroy
 * @see app/Http/Controllers/Api/V1/Fees/StudentFeeMonthlyOverrideController.php:130
 * @route '/api/v1/fees/monthly-overrides/{id}'
 */
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\StudentFeeMonthlyOverrideController::destroy
 * @see app/Http/Controllers/Api/V1/Fees/StudentFeeMonthlyOverrideController.php:130
 * @route '/api/v1/fees/monthly-overrides/{id}'
 */
    const destroyForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\StudentFeeMonthlyOverrideController::destroy
 * @see app/Http/Controllers/Api/V1/Fees/StudentFeeMonthlyOverrideController.php:130
 * @route '/api/v1/fees/monthly-overrides/{id}'
 */
        destroyForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const StudentFeeMonthlyOverrideController = { upsert, destroy }

export default StudentFeeMonthlyOverrideController