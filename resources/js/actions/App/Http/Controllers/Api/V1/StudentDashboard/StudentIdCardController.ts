import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../../wayfinder'
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
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentIdCardController::show
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentIdCardController.php:22
 * @route '/api/v1/student/id-card'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentIdCardController::show
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentIdCardController.php:22
 * @route '/api/v1/student/id-card'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentIdCardController::show
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentIdCardController.php:22
 * @route '/api/v1/student/id-card'
 */
        showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
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

    /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentIdCardController::download
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentIdCardController.php:37
 * @route '/api/v1/student/id-card/download'
 */
    const downloadForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentIdCardController::download
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentIdCardController.php:37
 * @route '/api/v1/student/id-card/download'
 */
        downloadForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentIdCardController::download
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentIdCardController.php:37
 * @route '/api/v1/student/id-card/download'
 */
        downloadForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
const StudentIdCardController = { show, download }

export default StudentIdCardController