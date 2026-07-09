import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::getMatrix
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:38
 * @route '/api/v1/fees/ledger/student/{studentId}'
 */
export const getMatrix = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getMatrix.url(args, options),
    method: 'get',
})

getMatrix.definition = {
    methods: ["get","head"],
    url: '/api/v1/fees/ledger/student/{studentId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::getMatrix
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:38
 * @route '/api/v1/fees/ledger/student/{studentId}'
 */
getMatrix.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { studentId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    studentId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        studentId: args.studentId,
                }

    return getMatrix.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::getMatrix
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:38
 * @route '/api/v1/fees/ledger/student/{studentId}'
 */
getMatrix.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getMatrix.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::getMatrix
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:38
 * @route '/api/v1/fees/ledger/student/{studentId}'
 */
getMatrix.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getMatrix.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::getMatrix
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:38
 * @route '/api/v1/fees/ledger/student/{studentId}'
 */
    const getMatrixForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getMatrix.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::getMatrix
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:38
 * @route '/api/v1/fees/ledger/student/{studentId}'
 */
        getMatrixForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getMatrix.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::getMatrix
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:38
 * @route '/api/v1/fees/ledger/student/{studentId}'
 */
        getMatrixForm.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getMatrix.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getMatrix.form = getMatrixForm
/**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::collect
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:115
 * @route '/api/v1/fees/ledger/collect'
 */
export const collect = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: collect.url(options),
    method: 'post',
})

collect.definition = {
    methods: ["post"],
    url: '/api/v1/fees/ledger/collect',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::collect
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:115
 * @route '/api/v1/fees/ledger/collect'
 */
collect.url = (options?: RouteQueryOptions) => {
    return collect.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::collect
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:115
 * @route '/api/v1/fees/ledger/collect'
 */
collect.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: collect.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::collect
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:115
 * @route '/api/v1/fees/ledger/collect'
 */
    const collectForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: collect.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::collect
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:115
 * @route '/api/v1/fees/ledger/collect'
 */
        collectForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: collect.url(options),
            method: 'post',
        })
    
    collect.form = collectForm
/**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::resendReceipt
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:204
 * @route '/api/v1/fees/ledger/resend-receipt'
 */
export const resendReceipt = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resendReceipt.url(options),
    method: 'post',
})

resendReceipt.definition = {
    methods: ["post"],
    url: '/api/v1/fees/ledger/resend-receipt',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::resendReceipt
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:204
 * @route '/api/v1/fees/ledger/resend-receipt'
 */
resendReceipt.url = (options?: RouteQueryOptions) => {
    return resendReceipt.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::resendReceipt
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:204
 * @route '/api/v1/fees/ledger/resend-receipt'
 */
resendReceipt.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resendReceipt.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::resendReceipt
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:204
 * @route '/api/v1/fees/ledger/resend-receipt'
 */
    const resendReceiptForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: resendReceipt.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::resendReceipt
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:204
 * @route '/api/v1/fees/ledger/resend-receipt'
 */
        resendReceiptForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: resendReceipt.url(options),
            method: 'post',
        })
    
    resendReceipt.form = resendReceiptForm
/**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::markAsPaid
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:233
 * @route '/api/v1/fees/ledger/mark-as-paid'
 */
export const markAsPaid = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsPaid.url(options),
    method: 'post',
})

markAsPaid.definition = {
    methods: ["post"],
    url: '/api/v1/fees/ledger/mark-as-paid',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::markAsPaid
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:233
 * @route '/api/v1/fees/ledger/mark-as-paid'
 */
markAsPaid.url = (options?: RouteQueryOptions) => {
    return markAsPaid.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::markAsPaid
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:233
 * @route '/api/v1/fees/ledger/mark-as-paid'
 */
markAsPaid.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsPaid.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::markAsPaid
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:233
 * @route '/api/v1/fees/ledger/mark-as-paid'
 */
    const markAsPaidForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAsPaid.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::markAsPaid
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:233
 * @route '/api/v1/fees/ledger/mark-as-paid'
 */
        markAsPaidForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAsPaid.url(options),
            method: 'post',
        })
    
    markAsPaid.form = markAsPaidForm
/**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::downloadReceipt
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:322
 * @route '/api/v1/fees/ledger/download-receipt/{payment}'
 */
export const downloadReceipt = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadReceipt.url(args, options),
    method: 'get',
})

downloadReceipt.definition = {
    methods: ["get","head"],
    url: '/api/v1/fees/ledger/download-receipt/{payment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::downloadReceipt
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:322
 * @route '/api/v1/fees/ledger/download-receipt/{payment}'
 */
downloadReceipt.url = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payment: typeof args.payment === 'object'
                ? args.payment.id
                : args.payment,
                }

    return downloadReceipt.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::downloadReceipt
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:322
 * @route '/api/v1/fees/ledger/download-receipt/{payment}'
 */
downloadReceipt.get = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadReceipt.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::downloadReceipt
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:322
 * @route '/api/v1/fees/ledger/download-receipt/{payment}'
 */
downloadReceipt.head = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadReceipt.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::downloadReceipt
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:322
 * @route '/api/v1/fees/ledger/download-receipt/{payment}'
 */
    const downloadReceiptForm = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadReceipt.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::downloadReceipt
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:322
 * @route '/api/v1/fees/ledger/download-receipt/{payment}'
 */
        downloadReceiptForm.get = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadReceipt.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Fees\StudentLedgerController::downloadReceipt
 * @see app/Http/Controllers/Api/V1/Fees/StudentLedgerController.php:322
 * @route '/api/v1/fees/ledger/download-receipt/{payment}'
 */
        downloadReceiptForm.head = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadReceipt.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadReceipt.form = downloadReceiptForm
const StudentLedgerController = { getMatrix, collect, resendReceipt, markAsPaid, downloadReceipt }

export default StudentLedgerController