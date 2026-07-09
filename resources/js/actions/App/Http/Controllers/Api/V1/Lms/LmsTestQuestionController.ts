import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestQuestionController.php:14
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions'
 */
export const index = (args: { lms_class_id: string | number, test_id: string | number } | [lms_class_id: string | number, test_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestQuestionController.php:14
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions'
 */
index.url = (args: { lms_class_id: string | number, test_id: string | number } | [lms_class_id: string | number, test_id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    lms_class_id: args[0],
                    test_id: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lms_class_id: args.lms_class_id,
                                test_id: args.test_id,
                }

    return index.definition.url
            .replace('{lms_class_id}', parsedArgs.lms_class_id.toString())
            .replace('{test_id}', parsedArgs.test_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestQuestionController.php:14
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions'
 */
index.get = (args: { lms_class_id: string | number, test_id: string | number } | [lms_class_id: string | number, test_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestQuestionController.php:14
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions'
 */
index.head = (args: { lms_class_id: string | number, test_id: string | number } | [lms_class_id: string | number, test_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestQuestionController.php:14
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions'
 */
    const indexForm = (args: { lms_class_id: string | number, test_id: string | number } | [lms_class_id: string | number, test_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestQuestionController.php:14
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions'
 */
        indexForm.get = (args: { lms_class_id: string | number, test_id: string | number } | [lms_class_id: string | number, test_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestQuestionController.php:14
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions'
 */
        indexForm.head = (args: { lms_class_id: string | number, test_id: string | number } | [lms_class_id: string | number, test_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestQuestionController.php:30
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions'
 */
export const store = (args: { lms_class_id: string | number, test_id: string | number } | [lms_class_id: string | number, test_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestQuestionController.php:30
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions'
 */
store.url = (args: { lms_class_id: string | number, test_id: string | number } | [lms_class_id: string | number, test_id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    lms_class_id: args[0],
                    test_id: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lms_class_id: args.lms_class_id,
                                test_id: args.test_id,
                }

    return store.definition.url
            .replace('{lms_class_id}', parsedArgs.lms_class_id.toString())
            .replace('{test_id}', parsedArgs.test_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestQuestionController.php:30
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions'
 */
store.post = (args: { lms_class_id: string | number, test_id: string | number } | [lms_class_id: string | number, test_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestQuestionController.php:30
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions'
 */
    const storeForm = (args: { lms_class_id: string | number, test_id: string | number } | [lms_class_id: string | number, test_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestQuestionController.php:30
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions'
 */
        storeForm.post = (args: { lms_class_id: string | number, test_id: string | number } | [lms_class_id: string | number, test_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestQuestionController.php:56
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions/{id}'
 */
export const update = (args: { lms_class_id: string | number, test_id: string | number, id: string | number } | [lms_class_id: string | number, test_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestQuestionController.php:56
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions/{id}'
 */
update.url = (args: { lms_class_id: string | number, test_id: string | number, id: string | number } | [lms_class_id: string | number, test_id: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    lms_class_id: args[0],
                    test_id: args[1],
                    id: args[2],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lms_class_id: args.lms_class_id,
                                test_id: args.test_id,
                                id: args.id,
                }

    return update.definition.url
            .replace('{lms_class_id}', parsedArgs.lms_class_id.toString())
            .replace('{test_id}', parsedArgs.test_id.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestQuestionController.php:56
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions/{id}'
 */
update.put = (args: { lms_class_id: string | number, test_id: string | number, id: string | number } | [lms_class_id: string | number, test_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestQuestionController.php:56
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions/{id}'
 */
    const updateForm = (args: { lms_class_id: string | number, test_id: string | number, id: string | number } | [lms_class_id: string | number, test_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestQuestionController.php:56
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions/{id}'
 */
        updateForm.put = (args: { lms_class_id: string | number, test_id: string | number, id: string | number } | [lms_class_id: string | number, test_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestQuestionController.php:81
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions/{id}'
 */
export const destroy = (args: { lms_class_id: string | number, test_id: string | number, id: string | number } | [lms_class_id: string | number, test_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestQuestionController.php:81
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions/{id}'
 */
destroy.url = (args: { lms_class_id: string | number, test_id: string | number, id: string | number } | [lms_class_id: string | number, test_id: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    lms_class_id: args[0],
                    test_id: args[1],
                    id: args[2],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lms_class_id: args.lms_class_id,
                                test_id: args.test_id,
                                id: args.id,
                }

    return destroy.definition.url
            .replace('{lms_class_id}', parsedArgs.lms_class_id.toString())
            .replace('{test_id}', parsedArgs.test_id.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestQuestionController.php:81
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions/{id}'
 */
destroy.delete = (args: { lms_class_id: string | number, test_id: string | number, id: string | number } | [lms_class_id: string | number, test_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestQuestionController.php:81
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions/{id}'
 */
    const destroyForm = (args: { lms_class_id: string | number, test_id: string | number, id: string | number } | [lms_class_id: string | number, test_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestQuestionController.php:81
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/questions/{id}'
 */
        destroyForm.delete = (args: { lms_class_id: string | number, test_id: string | number, id: string | number } | [lms_class_id: string | number, test_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const LmsTestQuestionController = { index, store, update, destroy }

export default LmsTestQuestionController