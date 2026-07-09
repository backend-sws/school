import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::index
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:27
 * @route '/api/v1/admission-heads/{admission_head}/fee-structures'
 */
export const index = (args: { admission_head: string | number } | [admission_head: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/admission-heads/{admission_head}/fee-structures',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::index
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:27
 * @route '/api/v1/admission-heads/{admission_head}/fee-structures'
 */
index.url = (args: { admission_head: string | number } | [admission_head: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { admission_head: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    admission_head: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        admission_head: args.admission_head,
                }

    return index.definition.url
            .replace('{admission_head}', parsedArgs.admission_head.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::index
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:27
 * @route '/api/v1/admission-heads/{admission_head}/fee-structures'
 */
index.get = (args: { admission_head: string | number } | [admission_head: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::index
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:27
 * @route '/api/v1/admission-heads/{admission_head}/fee-structures'
 */
index.head = (args: { admission_head: string | number } | [admission_head: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::index
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:27
 * @route '/api/v1/admission-heads/{admission_head}/fee-structures'
 */
    const indexForm = (args: { admission_head: string | number } | [admission_head: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::index
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:27
 * @route '/api/v1/admission-heads/{admission_head}/fee-structures'
 */
        indexForm.get = (args: { admission_head: string | number } | [admission_head: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::index
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:27
 * @route '/api/v1/admission-heads/{admission_head}/fee-structures'
 */
        indexForm.head = (args: { admission_head: string | number } | [admission_head: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::store
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:0
 * @route '/api/v1/admission-heads/{admission_head}/fee-structures'
 */
export const store = (args: { admission_head: string | number } | [admission_head: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/admission-heads/{admission_head}/fee-structures',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::store
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:0
 * @route '/api/v1/admission-heads/{admission_head}/fee-structures'
 */
store.url = (args: { admission_head: string | number } | [admission_head: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { admission_head: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    admission_head: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        admission_head: args.admission_head,
                }

    return store.definition.url
            .replace('{admission_head}', parsedArgs.admission_head.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::store
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:0
 * @route '/api/v1/admission-heads/{admission_head}/fee-structures'
 */
store.post = (args: { admission_head: string | number } | [admission_head: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::store
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:0
 * @route '/api/v1/admission-heads/{admission_head}/fee-structures'
 */
    const storeForm = (args: { admission_head: string | number } | [admission_head: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Admission\FeeStructureController::store
 * @see app/Http/Controllers/Api/V1/Admission/FeeStructureController.php:0
 * @route '/api/v1/admission-heads/{admission_head}/fee-structures'
 */
        storeForm.post = (args: { admission_head: string | number } | [admission_head: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const feeStructures = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
}

export default feeStructures