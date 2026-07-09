import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::lmsStreams
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:317
 * @route '/api/v1/lms/streams'
 */
export const lmsStreams = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lmsStreams.url(options),
    method: 'get',
})

lmsStreams.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/streams',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::lmsStreams
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:317
 * @route '/api/v1/lms/streams'
 */
lmsStreams.url = (options?: RouteQueryOptions) => {
    return lmsStreams.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::lmsStreams
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:317
 * @route '/api/v1/lms/streams'
 */
lmsStreams.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lmsStreams.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::lmsStreams
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:317
 * @route '/api/v1/lms/streams'
 */
lmsStreams.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: lmsStreams.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::lmsStreams
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:317
 * @route '/api/v1/lms/streams'
 */
    const lmsStreamsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: lmsStreams.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::lmsStreams
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:317
 * @route '/api/v1/lms/streams'
 */
        lmsStreamsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: lmsStreams.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::lmsStreams
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:317
 * @route '/api/v1/lms/streams'
 */
        lmsStreamsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: lmsStreams.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    lmsStreams.form = lmsStreamsForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::findOrCreateForStream
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:351
 * @route '/api/v1/lms/classes/find-or-create-for-stream'
 */
export const findOrCreateForStream = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: findOrCreateForStream.url(options),
    method: 'post',
})

findOrCreateForStream.definition = {
    methods: ["post"],
    url: '/api/v1/lms/classes/find-or-create-for-stream',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::findOrCreateForStream
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:351
 * @route '/api/v1/lms/classes/find-or-create-for-stream'
 */
findOrCreateForStream.url = (options?: RouteQueryOptions) => {
    return findOrCreateForStream.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::findOrCreateForStream
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:351
 * @route '/api/v1/lms/classes/find-or-create-for-stream'
 */
findOrCreateForStream.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: findOrCreateForStream.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::findOrCreateForStream
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:351
 * @route '/api/v1/lms/classes/find-or-create-for-stream'
 */
    const findOrCreateForStreamForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: findOrCreateForStream.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::findOrCreateForStream
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:351
 * @route '/api/v1/lms/classes/find-or-create-for-stream'
 */
        findOrCreateForStreamForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: findOrCreateForStream.url(options),
            method: 'post',
        })
    
    findOrCreateForStream.form = findOrCreateForStreamForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::myClasses
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:75
 * @route '/api/v1/lms/my-classes'
 */
export const myClasses = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myClasses.url(options),
    method: 'get',
})

myClasses.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/my-classes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::myClasses
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:75
 * @route '/api/v1/lms/my-classes'
 */
myClasses.url = (options?: RouteQueryOptions) => {
    return myClasses.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::myClasses
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:75
 * @route '/api/v1/lms/my-classes'
 */
myClasses.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myClasses.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::myClasses
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:75
 * @route '/api/v1/lms/my-classes'
 */
myClasses.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: myClasses.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::myClasses
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:75
 * @route '/api/v1/lms/my-classes'
 */
    const myClassesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: myClasses.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::myClasses
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:75
 * @route '/api/v1/lms/my-classes'
 */
        myClassesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: myClasses.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::myClasses
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:75
 * @route '/api/v1/lms/my-classes'
 */
        myClassesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: myClasses.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    myClasses.form = myClassesForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::allocations
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:250
 * @route '/api/v1/lms/classes/{lms_class}/allocations'
 */
export const allocations = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: allocations.url(args, options),
    method: 'get',
})

allocations.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/classes/{lms_class}/allocations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::allocations
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:250
 * @route '/api/v1/lms/classes/{lms_class}/allocations'
 */
allocations.url = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return allocations.definition.url
            .replace('{lms_class}', parsedArgs.lms_class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::allocations
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:250
 * @route '/api/v1/lms/classes/{lms_class}/allocations'
 */
allocations.get = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: allocations.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::allocations
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:250
 * @route '/api/v1/lms/classes/{lms_class}/allocations'
 */
allocations.head = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: allocations.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::allocations
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:250
 * @route '/api/v1/lms/classes/{lms_class}/allocations'
 */
    const allocationsForm = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: allocations.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::allocations
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:250
 * @route '/api/v1/lms/classes/{lms_class}/allocations'
 */
        allocationsForm.get = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: allocations.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::allocations
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:250
 * @route '/api/v1/lms/classes/{lms_class}/allocations'
 */
        allocationsForm.head = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: allocations.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    allocations.form = allocationsForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::feeStructures
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:379
 * @route '/api/v1/lms/classes/{lms_class}/fee-structures'
 */
export const feeStructures = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: feeStructures.url(args, options),
    method: 'get',
})

feeStructures.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/classes/{lms_class}/fee-structures',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::feeStructures
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:379
 * @route '/api/v1/lms/classes/{lms_class}/fee-structures'
 */
feeStructures.url = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return feeStructures.definition.url
            .replace('{lms_class}', parsedArgs.lms_class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::feeStructures
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:379
 * @route '/api/v1/lms/classes/{lms_class}/fee-structures'
 */
feeStructures.get = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: feeStructures.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::feeStructures
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:379
 * @route '/api/v1/lms/classes/{lms_class}/fee-structures'
 */
feeStructures.head = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: feeStructures.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::feeStructures
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:379
 * @route '/api/v1/lms/classes/{lms_class}/fee-structures'
 */
    const feeStructuresForm = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: feeStructures.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::feeStructures
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:379
 * @route '/api/v1/lms/classes/{lms_class}/fee-structures'
 */
        feeStructuresForm.get = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: feeStructures.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::feeStructures
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:379
 * @route '/api/v1/lms/classes/{lms_class}/fee-structures'
 */
        feeStructuresForm.head = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: feeStructures.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    feeStructures.form = feeStructuresForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::syncFeeStructures
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:393
 * @route '/api/v1/lms/classes/{lms_class}/fee-structures'
 */
export const syncFeeStructures = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncFeeStructures.url(args, options),
    method: 'post',
})

syncFeeStructures.definition = {
    methods: ["post"],
    url: '/api/v1/lms/classes/{lms_class}/fee-structures',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::syncFeeStructures
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:393
 * @route '/api/v1/lms/classes/{lms_class}/fee-structures'
 */
syncFeeStructures.url = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return syncFeeStructures.definition.url
            .replace('{lms_class}', parsedArgs.lms_class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::syncFeeStructures
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:393
 * @route '/api/v1/lms/classes/{lms_class}/fee-structures'
 */
syncFeeStructures.post = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncFeeStructures.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::syncFeeStructures
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:393
 * @route '/api/v1/lms/classes/{lms_class}/fee-structures'
 */
    const syncFeeStructuresForm = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: syncFeeStructures.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::syncFeeStructures
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:393
 * @route '/api/v1/lms/classes/{lms_class}/fee-structures'
 */
        syncFeeStructuresForm.post = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: syncFeeStructures.url(args, options),
            method: 'post',
        })
    
    syncFeeStructures.form = syncFeeStructuresForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:20
 * @route '/api/v1/lms/classes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/classes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:20
 * @route '/api/v1/lms/classes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:20
 * @route '/api/v1/lms/classes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:20
 * @route '/api/v1/lms/classes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:20
 * @route '/api/v1/lms/classes'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:20
 * @route '/api/v1/lms/classes'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:20
 * @route '/api/v1/lms/classes'
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
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:106
 * @route '/api/v1/lms/classes'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/lms/classes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:106
 * @route '/api/v1/lms/classes'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:106
 * @route '/api/v1/lms/classes'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:106
 * @route '/api/v1/lms/classes'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:106
 * @route '/api/v1/lms/classes'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:167
 * @route '/api/v1/lms/classes/{lms_class}'
 */
export const show = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/classes/{lms_class}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:167
 * @route '/api/v1/lms/classes/{lms_class}'
 */
show.url = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{lms_class}', parsedArgs.lms_class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:167
 * @route '/api/v1/lms/classes/{lms_class}'
 */
show.get = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:167
 * @route '/api/v1/lms/classes/{lms_class}'
 */
show.head = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:167
 * @route '/api/v1/lms/classes/{lms_class}'
 */
    const showForm = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:167
 * @route '/api/v1/lms/classes/{lms_class}'
 */
        showForm.get = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:167
 * @route '/api/v1/lms/classes/{lms_class}'
 */
        showForm.head = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:190
 * @route '/api/v1/lms/classes/{lms_class}'
 */
export const update = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/lms/classes/{lms_class}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:190
 * @route '/api/v1/lms/classes/{lms_class}'
 */
update.url = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{lms_class}', parsedArgs.lms_class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:190
 * @route '/api/v1/lms/classes/{lms_class}'
 */
update.put = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:190
 * @route '/api/v1/lms/classes/{lms_class}'
 */
update.patch = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:190
 * @route '/api/v1/lms/classes/{lms_class}'
 */
    const updateForm = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:190
 * @route '/api/v1/lms/classes/{lms_class}'
 */
        updateForm.put = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:190
 * @route '/api/v1/lms/classes/{lms_class}'
 */
        updateForm.patch = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:234
 * @route '/api/v1/lms/classes/{lms_class}'
 */
export const destroy = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/lms/classes/{lms_class}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:234
 * @route '/api/v1/lms/classes/{lms_class}'
 */
destroy.url = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{lms_class}', parsedArgs.lms_class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:234
 * @route '/api/v1/lms/classes/{lms_class}'
 */
destroy.delete = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:234
 * @route '/api/v1/lms/classes/{lms_class}'
 */
    const destroyForm = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:234
 * @route '/api/v1/lms/classes/{lms_class}'
 */
        destroyForm.delete = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const LmsClassController = { lmsStreams, findOrCreateForStream, myClasses, allocations, feeStructures, syncFeeStructures, index, store, show, update, destroy }

export default LmsClassController