import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\HR\SalaryStructureController::index
 * @see app/Http/Controllers/Api/V1/HR/SalaryStructureController.php:14
 * @route '/api/v1/hr/salary-structures'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/hr/salary-structures',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\SalaryStructureController::index
 * @see app/Http/Controllers/Api/V1/HR/SalaryStructureController.php:14
 * @route '/api/v1/hr/salary-structures'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\SalaryStructureController::index
 * @see app/Http/Controllers/Api/V1/HR/SalaryStructureController.php:14
 * @route '/api/v1/hr/salary-structures'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\HR\SalaryStructureController::index
 * @see app/Http/Controllers/Api/V1/HR/SalaryStructureController.php:14
 * @route '/api/v1/hr/salary-structures'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\SalaryStructureController::index
 * @see app/Http/Controllers/Api/V1/HR/SalaryStructureController.php:14
 * @route '/api/v1/hr/salary-structures'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\SalaryStructureController::index
 * @see app/Http/Controllers/Api/V1/HR/SalaryStructureController.php:14
 * @route '/api/v1/hr/salary-structures'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\HR\SalaryStructureController::index
 * @see app/Http/Controllers/Api/V1/HR/SalaryStructureController.php:14
 * @route '/api/v1/hr/salary-structures'
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
* @see \App\Http\Controllers\Api\V1\HR\SalaryStructureController::store
 * @see app/Http/Controllers/Api/V1/HR/SalaryStructureController.php:31
 * @route '/api/v1/hr/salary-structures/{user}'
 */
export const store = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/hr/salary-structures/{user}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\SalaryStructureController::store
 * @see app/Http/Controllers/Api/V1/HR/SalaryStructureController.php:31
 * @route '/api/v1/hr/salary-structures/{user}'
 */
store.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\SalaryStructureController::store
 * @see app/Http/Controllers/Api/V1/HR/SalaryStructureController.php:31
 * @route '/api/v1/hr/salary-structures/{user}'
 */
store.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\SalaryStructureController::store
 * @see app/Http/Controllers/Api/V1/HR/SalaryStructureController.php:31
 * @route '/api/v1/hr/salary-structures/{user}'
 */
    const storeForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\SalaryStructureController::store
 * @see app/Http/Controllers/Api/V1/HR/SalaryStructureController.php:31
 * @route '/api/v1/hr/salary-structures/{user}'
 */
        storeForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const salaryStructures = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
}

export default salaryStructures