import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentDashboardController::myApplications
* @see app/Http/Controllers/Api/V1/StudentDashboard/StudentDashboardController.php:45
* @route '/api/v1/student/applications'
*/
export const myApplications = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myApplications.url(options),
    method: 'get',
})

myApplications.definition = {
    methods: ["get","head"],
    url: '/api/v1/student/applications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentDashboardController::myApplications
* @see app/Http/Controllers/Api/V1/StudentDashboard/StudentDashboardController.php:45
* @route '/api/v1/student/applications'
*/
myApplications.url = (options?: RouteQueryOptions) => {
    return myApplications.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentDashboardController::myApplications
* @see app/Http/Controllers/Api/V1/StudentDashboard/StudentDashboardController.php:45
* @route '/api/v1/student/applications'
*/
myApplications.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myApplications.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentDashboardController::myApplications
* @see app/Http/Controllers/Api/V1/StudentDashboard/StudentDashboardController.php:45
* @route '/api/v1/student/applications'
*/
myApplications.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: myApplications.url(options),
    method: 'head',
})

const StudentDashboardController = { myApplications }

export default StudentDashboardController