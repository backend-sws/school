import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentProfileController::getProfile
* @see app/Http/Controllers/Api/V1/StudentDashboard/StudentProfileController.php:69
* @route '/api/v1/student/profile'
*/
export const getProfile = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getProfile.url(options),
    method: 'get',
})

getProfile.definition = {
    methods: ["get","head"],
    url: '/api/v1/student/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentProfileController::getProfile
* @see app/Http/Controllers/Api/V1/StudentDashboard/StudentProfileController.php:69
* @route '/api/v1/student/profile'
*/
getProfile.url = (options?: RouteQueryOptions) => {
    return getProfile.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentProfileController::getProfile
* @see app/Http/Controllers/Api/V1/StudentDashboard/StudentProfileController.php:69
* @route '/api/v1/student/profile'
*/
getProfile.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getProfile.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentProfileController::getProfile
* @see app/Http/Controllers/Api/V1/StudentDashboard/StudentProfileController.php:69
* @route '/api/v1/student/profile'
*/
getProfile.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getProfile.url(options),
    method: 'head',
})

const StudentProfileController = { getProfile }

export default StudentProfileController