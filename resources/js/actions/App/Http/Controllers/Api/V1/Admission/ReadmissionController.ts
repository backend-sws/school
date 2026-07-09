import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::eligible
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:25
 * @route '/api/v1/readmissions/eligible'
 */
export const eligible = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eligible.url(options),
    method: 'get',
})

eligible.definition = {
    methods: ["get","head"],
    url: '/api/v1/readmissions/eligible',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::eligible
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:25
 * @route '/api/v1/readmissions/eligible'
 */
eligible.url = (options?: RouteQueryOptions) => {
    return eligible.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::eligible
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:25
 * @route '/api/v1/readmissions/eligible'
 */
eligible.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eligible.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::eligible
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:25
 * @route '/api/v1/readmissions/eligible'
 */
eligible.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: eligible.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::eligible
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:25
 * @route '/api/v1/readmissions/eligible'
 */
    const eligibleForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: eligible.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::eligible
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:25
 * @route '/api/v1/readmissions/eligible'
 */
        eligibleForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: eligible.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::eligible
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:25
 * @route '/api/v1/readmissions/eligible'
 */
        eligibleForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: eligible.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    eligible.form = eligibleForm
/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::prefill
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:48
 * @route '/api/v1/readmissions/prefill/{studentProfile}'
 */
export const prefill = (args: { studentProfile: string | number | { id: string | number } } | [studentProfile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: prefill.url(args, options),
    method: 'get',
})

prefill.definition = {
    methods: ["get","head"],
    url: '/api/v1/readmissions/prefill/{studentProfile}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::prefill
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:48
 * @route '/api/v1/readmissions/prefill/{studentProfile}'
 */
prefill.url = (args: { studentProfile: string | number | { id: string | number } } | [studentProfile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { studentProfile: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { studentProfile: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    studentProfile: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        studentProfile: typeof args.studentProfile === 'object'
                ? args.studentProfile.id
                : args.studentProfile,
                }

    return prefill.definition.url
            .replace('{studentProfile}', parsedArgs.studentProfile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::prefill
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:48
 * @route '/api/v1/readmissions/prefill/{studentProfile}'
 */
prefill.get = (args: { studentProfile: string | number | { id: string | number } } | [studentProfile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: prefill.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::prefill
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:48
 * @route '/api/v1/readmissions/prefill/{studentProfile}'
 */
prefill.head = (args: { studentProfile: string | number | { id: string | number } } | [studentProfile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: prefill.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::prefill
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:48
 * @route '/api/v1/readmissions/prefill/{studentProfile}'
 */
    const prefillForm = (args: { studentProfile: string | number | { id: string | number } } | [studentProfile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: prefill.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::prefill
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:48
 * @route '/api/v1/readmissions/prefill/{studentProfile}'
 */
        prefillForm.get = (args: { studentProfile: string | number | { id: string | number } } | [studentProfile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: prefill.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::prefill
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:48
 * @route '/api/v1/readmissions/prefill/{studentProfile}'
 */
        prefillForm.head = (args: { studentProfile: string | number | { id: string | number } } | [studentProfile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: prefill.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    prefill.form = prefillForm
/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::previewFees
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:118
 * @route '/api/v1/readmissions/preview-fees/{studentProfileId}'
 */
export const previewFees = (args: { studentProfileId: string | number } | [studentProfileId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewFees.url(args, options),
    method: 'get',
})

previewFees.definition = {
    methods: ["get","head"],
    url: '/api/v1/readmissions/preview-fees/{studentProfileId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::previewFees
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:118
 * @route '/api/v1/readmissions/preview-fees/{studentProfileId}'
 */
previewFees.url = (args: { studentProfileId: string | number } | [studentProfileId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { studentProfileId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    studentProfileId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        studentProfileId: args.studentProfileId,
                }

    return previewFees.definition.url
            .replace('{studentProfileId}', parsedArgs.studentProfileId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::previewFees
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:118
 * @route '/api/v1/readmissions/preview-fees/{studentProfileId}'
 */
previewFees.get = (args: { studentProfileId: string | number } | [studentProfileId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewFees.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::previewFees
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:118
 * @route '/api/v1/readmissions/preview-fees/{studentProfileId}'
 */
previewFees.head = (args: { studentProfileId: string | number } | [studentProfileId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: previewFees.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::previewFees
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:118
 * @route '/api/v1/readmissions/preview-fees/{studentProfileId}'
 */
    const previewFeesForm = (args: { studentProfileId: string | number } | [studentProfileId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: previewFees.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::previewFees
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:118
 * @route '/api/v1/readmissions/preview-fees/{studentProfileId}'
 */
        previewFeesForm.get = (args: { studentProfileId: string | number } | [studentProfileId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: previewFees.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::previewFees
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:118
 * @route '/api/v1/readmissions/preview-fees/{studentProfileId}'
 */
        previewFeesForm.head = (args: { studentProfileId: string | number } | [studentProfileId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: previewFees.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    previewFees.form = previewFeesForm
/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::process
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:140
 * @route '/api/v1/readmissions/process'
 */
export const process = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: process.url(options),
    method: 'post',
})

process.definition = {
    methods: ["post"],
    url: '/api/v1/readmissions/process',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::process
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:140
 * @route '/api/v1/readmissions/process'
 */
process.url = (options?: RouteQueryOptions) => {
    return process.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::process
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:140
 * @route '/api/v1/readmissions/process'
 */
process.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: process.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::process
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:140
 * @route '/api/v1/readmissions/process'
 */
    const processForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: process.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::process
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:140
 * @route '/api/v1/readmissions/process'
 */
        processForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: process.url(options),
            method: 'post',
        })
    
    process.form = processForm
/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::bulk
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:171
 * @route '/api/v1/readmissions/bulk'
 */
export const bulk = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulk.url(options),
    method: 'post',
})

bulk.definition = {
    methods: ["post"],
    url: '/api/v1/readmissions/bulk',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::bulk
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:171
 * @route '/api/v1/readmissions/bulk'
 */
bulk.url = (options?: RouteQueryOptions) => {
    return bulk.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::bulk
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:171
 * @route '/api/v1/readmissions/bulk'
 */
bulk.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulk.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::bulk
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:171
 * @route '/api/v1/readmissions/bulk'
 */
    const bulkForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulk.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::bulk
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:171
 * @route '/api/v1/readmissions/bulk'
 */
        bulkForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulk.url(options),
            method: 'post',
        })
    
    bulk.form = bulkForm
/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::rollback
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:208
 * @route '/api/v1/readmissions/{transition}/rollback'
 */
export const rollback = (args: { transition: string | number | { id: string | number } } | [transition: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rollback.url(args, options),
    method: 'post',
})

rollback.definition = {
    methods: ["post"],
    url: '/api/v1/readmissions/{transition}/rollback',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::rollback
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:208
 * @route '/api/v1/readmissions/{transition}/rollback'
 */
rollback.url = (args: { transition: string | number | { id: string | number } } | [transition: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transition: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transition: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transition: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transition: typeof args.transition === 'object'
                ? args.transition.id
                : args.transition,
                }

    return rollback.definition.url
            .replace('{transition}', parsedArgs.transition.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::rollback
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:208
 * @route '/api/v1/readmissions/{transition}/rollback'
 */
rollback.post = (args: { transition: string | number | { id: string | number } } | [transition: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rollback.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::rollback
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:208
 * @route '/api/v1/readmissions/{transition}/rollback'
 */
    const rollbackForm = (args: { transition: string | number | { id: string | number } } | [transition: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: rollback.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::rollback
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:208
 * @route '/api/v1/readmissions/{transition}/rollback'
 */
        rollbackForm.post = (args: { transition: string | number | { id: string | number } } | [transition: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: rollback.url(args, options),
            method: 'post',
        })
    
    rollback.form = rollbackForm
/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::history
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:225
 * @route '/api/v1/readmissions/history'
 */
export const history = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})

history.definition = {
    methods: ["get","head"],
    url: '/api/v1/readmissions/history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::history
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:225
 * @route '/api/v1/readmissions/history'
 */
history.url = (options?: RouteQueryOptions) => {
    return history.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::history
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:225
 * @route '/api/v1/readmissions/history'
 */
history.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::history
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:225
 * @route '/api/v1/readmissions/history'
 */
history.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: history.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::history
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:225
 * @route '/api/v1/readmissions/history'
 */
    const historyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: history.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::history
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:225
 * @route '/api/v1/readmissions/history'
 */
        historyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: history.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Admission\ReadmissionController::history
 * @see app/Http/Controllers/Api/V1/Admission/ReadmissionController.php:225
 * @route '/api/v1/readmissions/history'
 */
        historyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: history.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    history.form = historyForm
const ReadmissionController = { eligible, prefill, previewFees, process, bulk, rollback, history }

export default ReadmissionController