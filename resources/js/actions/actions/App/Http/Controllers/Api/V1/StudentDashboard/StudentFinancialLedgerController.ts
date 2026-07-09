import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentFinancialLedgerController::index
* @see app/Http/Controllers/Api/V1/StudentDashboard/StudentFinancialLedgerController.php:18
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
* @see app/Http/Controllers/Api/V1/StudentDashboard/StudentFinancialLedgerController.php:18
* @route '/api/v1/student/financial-ledger'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentFinancialLedgerController::index
* @see app/Http/Controllers/Api/V1/StudentDashboard/StudentFinancialLedgerController.php:18
* @route '/api/v1/student/financial-ledger'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentFinancialLedgerController::index
* @see app/Http/Controllers/Api/V1/StudentDashboard/StudentFinancialLedgerController.php:18
* @route '/api/v1/student/financial-ledger'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const StudentFinancialLedgerController = { index }

export default StudentFinancialLedgerController