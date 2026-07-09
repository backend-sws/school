import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentNoticeController::index
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentNoticeController.php:23
 * @route '/api/v1/student/notices'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/student/notices',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentNoticeController::index
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentNoticeController.php:23
 * @route '/api/v1/student/notices'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentNoticeController::index
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentNoticeController.php:23
 * @route '/api/v1/student/notices'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentNoticeController::index
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentNoticeController.php:23
 * @route '/api/v1/student/notices'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentNoticeController::index
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentNoticeController.php:23
 * @route '/api/v1/student/notices'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentNoticeController::index
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentNoticeController.php:23
 * @route '/api/v1/student/notices'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentNoticeController::index
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentNoticeController.php:23
 * @route '/api/v1/student/notices'
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
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentNoticeController::show
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentNoticeController.php:94
 * @route '/api/v1/student/notices/{id}'
 */
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/student/notices/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentNoticeController::show
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentNoticeController.php:94
 * @route '/api/v1/student/notices/{id}'
 */
show.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentNoticeController::show
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentNoticeController.php:94
 * @route '/api/v1/student/notices/{id}'
 */
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentNoticeController::show
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentNoticeController.php:94
 * @route '/api/v1/student/notices/{id}'
 */
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentNoticeController::show
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentNoticeController.php:94
 * @route '/api/v1/student/notices/{id}'
 */
    const showForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentNoticeController::show
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentNoticeController.php:94
 * @route '/api/v1/student/notices/{id}'
 */
        showForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\StudentNoticeController::show
 * @see app/Http/Controllers/Api/V1/StudentDashboard/StudentNoticeController.php:94
 * @route '/api/v1/student/notices/{id}'
 */
        showForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const StudentNoticeController = { index, show }

export default StudentNoticeController