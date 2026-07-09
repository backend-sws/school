import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentTransactionController::index
* @see app/Http/Controllers/Api/V1/StudentDashboard/StudentTransactionController.php:25
* @route '/api/v1/student/transactions'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/student/transactions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentTransactionController::index
* @see app/Http/Controllers/Api/V1/StudentDashboard/StudentTransactionController.php:25
* @route '/api/v1/student/transactions'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentTransactionController::index
* @see app/Http/Controllers/Api/V1/StudentDashboard/StudentTransactionController.php:25
* @route '/api/v1/student/transactions'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentTransactionController::index
* @see app/Http/Controllers/Api/V1/StudentDashboard/StudentTransactionController.php:25
* @route '/api/v1/student/transactions'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const StudentTransactionController = { index }

export default StudentTransactionController