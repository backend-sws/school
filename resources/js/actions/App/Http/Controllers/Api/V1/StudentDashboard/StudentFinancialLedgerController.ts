import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentFinancialLedgerController::index
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentFinancialLedgerController.php:26
 * @route '/api/v1/student/financial-ledger'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/student/financial-ledger',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentFinancialLedgerController::index
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentFinancialLedgerController.php:26
 * @route '/api/v1/student/financial-ledger'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentFinancialLedgerController::index
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentFinancialLedgerController.php:26
 * @route '/api/v1/student/financial-ledger'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentFinancialLedgerController::index
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentFinancialLedgerController.php:26
 * @route '/api/v1/student/financial-ledger'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentFinancialLedgerController::index
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentFinancialLedgerController.php:26
 * @route '/api/v1/student/financial-ledger'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentFinancialLedgerController::index
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentFinancialLedgerController.php:26
 * @route '/api/v1/student/financial-ledger'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentFinancialLedgerController::index
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentFinancialLedgerController.php:26
 * @route '/api/v1/student/financial-ledger'
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
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentFinancialLedgerController::downloadReceipt
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentFinancialLedgerController.php:121
 * @route '/api/v1/student/financial-ledger/receipt/{payment}'
 */
export const downloadReceipt = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadReceipt.url(args, options),
    method: 'get',
})

downloadReceipt.definition = {
    methods: ["get","head"],
    url: '/api/v1/student/financial-ledger/receipt/{payment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentFinancialLedgerController::downloadReceipt
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentFinancialLedgerController.php:121
 * @route '/api/v1/student/financial-ledger/receipt/{payment}'
 */
downloadReceipt.url = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentFinancialLedgerController::downloadReceipt
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentFinancialLedgerController.php:121
 * @route '/api/v1/student/financial-ledger/receipt/{payment}'
 */
downloadReceipt.get = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadReceipt.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentFinancialLedgerController::downloadReceipt
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentFinancialLedgerController.php:121
 * @route '/api/v1/student/financial-ledger/receipt/{payment}'
 */
downloadReceipt.head = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadReceipt.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentFinancialLedgerController::downloadReceipt
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentFinancialLedgerController.php:121
 * @route '/api/v1/student/financial-ledger/receipt/{payment}'
 */
    const downloadReceiptForm = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadReceipt.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentFinancialLedgerController::downloadReceipt
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentFinancialLedgerController.php:121
 * @route '/api/v1/student/financial-ledger/receipt/{payment}'
 */
        downloadReceiptForm.get = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadReceipt.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentFinancialLedgerController::downloadReceipt
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentFinancialLedgerController.php:121
 * @route '/api/v1/student/financial-ledger/receipt/{payment}'
 */
        downloadReceiptForm.head = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadReceipt.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadReceipt.form = downloadReceiptForm
const StudentFinancialLedgerController = { index, downloadReceipt }

export default StudentFinancialLedgerController