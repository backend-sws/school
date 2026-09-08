import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentTransferController::options
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentTransferController.php:29
 * @route '/api/v1/lms/classes/{lms_class}/transfer-options'
 */
export const options = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, routeOptions?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: options.url(args, routeOptions),
    method: 'get',
})

options.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/classes/{lms_class}/transfer-options',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentTransferController::options
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentTransferController.php:29
 * @route '/api/v1/lms/classes/{lms_class}/transfer-options'
 */
options.url = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, routeOptions?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lms_class: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { lms_class: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    lms_class: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lms_class: typeof args.lms_class === 'object'
                ? args.lms_class.id
                : args.lms_class,
                }

    return options.definition.url
            .replace('{lms_class}', parsedArgs.lms_class.toString())
            .replace(/\/+$/, '')
     + queryParams(routeOptions)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentTransferController::options
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentTransferController.php:29
 * @route '/api/v1/lms/classes/{lms_class}/transfer-options'
 */
options.get = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, routeOptions?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: options.url(args, routeOptions),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentTransferController::options
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentTransferController.php:29
 * @route '/api/v1/lms/classes/{lms_class}/transfer-options'
 */
options.head = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, routeOptions?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: options.url(args, routeOptions),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentTransferController::options
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentTransferController.php:29
 * @route '/api/v1/lms/classes/{lms_class}/transfer-options'
 */
    const optionsForm = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, routeOptions?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: options.url(
            args, 
                            routeOptions
                   ),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentTransferController::options
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentTransferController.php:29
 * @route '/api/v1/lms/classes/{lms_class}/transfer-options'
 */
        optionsForm.get = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, routeOptions?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: options.url(
                args, 
                                routeOptions
                           ),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentTransferController::options
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentTransferController.php:29
 * @route '/api/v1/lms/classes/{lms_class}/transfer-options'
 */
        optionsForm.head = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, routeOptions?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: options.url(args, {
                        [routeOptions?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(routeOptions?.query ?? routeOptions?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    options.form = optionsForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentTransferController::transfer
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentTransferController.php:116
 * @route '/api/v1/lms/classes/{lms_class}/transfer-students'
 */
export const transfer = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: transfer.url(args, options),
    method: 'post',
})

transfer.definition = {
    methods: ["post"],
    url: '/api/v1/lms/classes/{lms_class}/transfer-students',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentTransferController::transfer
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentTransferController.php:116
 * @route '/api/v1/lms/classes/{lms_class}/transfer-students'
 */
transfer.url = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lms_class: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { lms_class: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    lms_class: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lms_class: typeof args.lms_class === 'object'
                ? args.lms_class.id
                : args.lms_class,
                }

    return transfer.definition.url
            .replace('{lms_class}', parsedArgs.lms_class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentTransferController::transfer
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentTransferController.php:116
 * @route '/api/v1/lms/classes/{lms_class}/transfer-students'
 */
transfer.post = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: transfer.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentTransferController::transfer
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentTransferController.php:116
 * @route '/api/v1/lms/classes/{lms_class}/transfer-students'
 */
    const transferForm = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: transfer.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentTransferController::transfer
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentTransferController.php:116
 * @route '/api/v1/lms/classes/{lms_class}/transfer-students'
 */
        transferForm.post = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: transfer.url(args, options),
            method: 'post',
        })
    
    transfer.form = transferForm
const ClassStudentTransferController = { options, transfer }

export default ClassStudentTransferController