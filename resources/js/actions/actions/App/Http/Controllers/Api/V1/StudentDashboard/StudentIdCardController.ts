import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentIdCardController::show
* @see app/Http/Controllers/Api/V1/StudentDashboard/StudentIdCardController.php:22
* @route '/api/v1/student/id-card'
*/
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/student/id-card',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentIdCardController::show
* @see app/Http/Controllers/Api/V1/StudentDashboard/StudentIdCardController.php:22
* @route '/api/v1/student/id-card'
*/
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentIdCardController::show
* @see app/Http/Controllers/Api/V1/StudentDashboard/StudentIdCardController.php:22
* @route '/api/v1/student/id-card'
*/
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentIdCardController::show
* @see app/Http/Controllers/Api/V1/StudentDashboard/StudentIdCardController.php:22
* @route '/api/v1/student/id-card'
*/
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentIdCardController::download
* @see app/Http/Controllers/Api/V1/StudentDashboard/StudentIdCardController.php:37
* @route '/api/v1/student/id-card/download'
*/
export const download = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/api/v1/student/id-card/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentIdCardController::download
* @see app/Http/Controllers/Api/V1/StudentDashboard/StudentIdCardController.php:37
* @route '/api/v1/student/id-card/download'
*/
download.url = (options?: RouteQueryOptions) => {
    return download.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentIdCardController::download
* @see app/Http/Controllers/Api/V1/StudentDashboard/StudentIdCardController.php:37
* @route '/api/v1/student/id-card/download'
*/
download.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentIdCardController::download
* @see app/Http/Controllers/Api/V1/StudentDashboard/StudentIdCardController.php:37
* @route '/api/v1/student/id-card/download'
*/
download.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(options),
    method: 'head',
})

const StudentIdCardController = { show, download }

export default StudentIdCardController