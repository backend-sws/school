import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestAttemptController::myAttempts
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestAttemptController.php:117
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/attempts'
 */
export const myAttempts = (args: { lms_class_id: string | number, test_id: string | number } | [lms_class_id: string | number, test_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myAttempts.url(args, options),
    method: 'get',
})

myAttempts.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/attempts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestAttemptController::myAttempts
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestAttemptController.php:117
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/attempts'
 */
myAttempts.url = (args: { lms_class_id: string | number, test_id: string | number } | [lms_class_id: string | number, test_id: string | number ], options?: RouteQueryOptions) => {
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

    return myAttempts.definition.url
            .replace('{lms_class_id}', parsedArgs.lms_class_id.toString())
            .replace('{test_id}', parsedArgs.test_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestAttemptController::myAttempts
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestAttemptController.php:117
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/attempts'
 */
myAttempts.get = (args: { lms_class_id: string | number, test_id: string | number } | [lms_class_id: string | number, test_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myAttempts.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestAttemptController::myAttempts
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestAttemptController.php:117
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/attempts'
 */
myAttempts.head = (args: { lms_class_id: string | number, test_id: string | number } | [lms_class_id: string | number, test_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: myAttempts.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestAttemptController::myAttempts
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestAttemptController.php:117
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/attempts'
 */
    const myAttemptsForm = (args: { lms_class_id: string | number, test_id: string | number } | [lms_class_id: string | number, test_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: myAttempts.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestAttemptController::myAttempts
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestAttemptController.php:117
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/attempts'
 */
        myAttemptsForm.get = (args: { lms_class_id: string | number, test_id: string | number } | [lms_class_id: string | number, test_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: myAttempts.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestAttemptController::myAttempts
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestAttemptController.php:117
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/attempts'
 */
        myAttemptsForm.head = (args: { lms_class_id: string | number, test_id: string | number } | [lms_class_id: string | number, test_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: myAttempts.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    myAttempts.form = myAttemptsForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestAttemptController::start
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestAttemptController.php:15
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/attempts'
 */
export const start = (args: { lms_class_id: string | number, test_id: string | number } | [lms_class_id: string | number, test_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/attempts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestAttemptController::start
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestAttemptController.php:15
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/attempts'
 */
start.url = (args: { lms_class_id: string | number, test_id: string | number } | [lms_class_id: string | number, test_id: string | number ], options?: RouteQueryOptions) => {
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

    return start.definition.url
            .replace('{lms_class_id}', parsedArgs.lms_class_id.toString())
            .replace('{test_id}', parsedArgs.test_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestAttemptController::start
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestAttemptController.php:15
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/attempts'
 */
start.post = (args: { lms_class_id: string | number, test_id: string | number } | [lms_class_id: string | number, test_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestAttemptController::start
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestAttemptController.php:15
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/attempts'
 */
    const startForm = (args: { lms_class_id: string | number, test_id: string | number } | [lms_class_id: string | number, test_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: start.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestAttemptController::start
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestAttemptController.php:15
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/attempts'
 */
        startForm.post = (args: { lms_class_id: string | number, test_id: string | number } | [lms_class_id: string | number, test_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: start.url(args, options),
            method: 'post',
        })
    
    start.form = startForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestAttemptController::submit
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestAttemptController.php:76
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/attempts/{id}/submit'
 */
export const submit = (args: { lms_class_id: string | number, test_id: string | number, id: string | number } | [lms_class_id: string | number, test_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: submit.url(args, options),
    method: 'patch',
})

submit.definition = {
    methods: ["patch"],
    url: '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/attempts/{id}/submit',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestAttemptController::submit
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestAttemptController.php:76
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/attempts/{id}/submit'
 */
submit.url = (args: { lms_class_id: string | number, test_id: string | number, id: string | number } | [lms_class_id: string | number, test_id: string | number, id: string | number ], options?: RouteQueryOptions) => {
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

    return submit.definition.url
            .replace('{lms_class_id}', parsedArgs.lms_class_id.toString())
            .replace('{test_id}', parsedArgs.test_id.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestAttemptController::submit
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestAttemptController.php:76
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/attempts/{id}/submit'
 */
submit.patch = (args: { lms_class_id: string | number, test_id: string | number, id: string | number } | [lms_class_id: string | number, test_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: submit.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestAttemptController::submit
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestAttemptController.php:76
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/attempts/{id}/submit'
 */
    const submitForm = (args: { lms_class_id: string | number, test_id: string | number, id: string | number } | [lms_class_id: string | number, test_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submit.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsTestAttemptController::submit
 * @see app/Http/Controllers/Api/V1/Lms/LmsTestAttemptController.php:76
 * @route '/api/v1/lms/classes/{lms_class_id}/tests/{test_id}/attempts/{id}/submit'
 */
        submitForm.patch = (args: { lms_class_id: string | number, test_id: string | number, id: string | number } | [lms_class_id: string | number, test_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    submit.form = submitForm
const LmsTestAttemptController = { myAttempts, start, submit }

export default LmsTestAttemptController