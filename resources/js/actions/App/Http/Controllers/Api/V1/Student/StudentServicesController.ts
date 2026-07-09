import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Student\StudentServicesController::stopService
 * @see app/Http/Controllers/Api/V1/Student/StudentServicesController.php:15
 * @route '/api/v1/students/{id}/services/stop'
 */
export const stopService = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: stopService.url(args, options),
    method: 'put',
})

stopService.definition = {
    methods: ["put"],
    url: '/api/v1/students/{id}/services/stop',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentServicesController::stopService
 * @see app/Http/Controllers/Api/V1/Student/StudentServicesController.php:15
 * @route '/api/v1/students/{id}/services/stop'
 */
stopService.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return stopService.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentServicesController::stopService
 * @see app/Http/Controllers/Api/V1/Student/StudentServicesController.php:15
 * @route '/api/v1/students/{id}/services/stop'
 */
stopService.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: stopService.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Api\V1\Student\StudentServicesController::stopService
 * @see app/Http/Controllers/Api/V1/Student/StudentServicesController.php:15
 * @route '/api/v1/students/{id}/services/stop'
 */
    const stopServiceForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: stopService.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Student\StudentServicesController::stopService
 * @see app/Http/Controllers/Api/V1/Student/StudentServicesController.php:15
 * @route '/api/v1/students/{id}/services/stop'
 */
        stopServiceForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: stopService.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    stopService.form = stopServiceForm
const StudentServicesController = { stopService }

export default StudentServicesController