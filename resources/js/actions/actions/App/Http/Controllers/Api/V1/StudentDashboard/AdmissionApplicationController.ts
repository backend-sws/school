import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\AdmissionApplicationController::downloadReceipt
* @see app/Http/Controllers/Api/V1/StudentDashboard/AdmissionApplicationController.php:74
* @route '/api/v1/student/admission/{id}/download-receipt'
*/
export const downloadReceipt = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadReceipt.url(args, options),
    method: 'get',
})

downloadReceipt.definition = {
    methods: ["get","head"],
    url: '/api/v1/student/admission/{id}/download-receipt',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\AdmissionApplicationController::downloadReceipt
* @see app/Http/Controllers/Api/V1/StudentDashboard/AdmissionApplicationController.php:74
* @route '/api/v1/student/admission/{id}/download-receipt'
*/
downloadReceipt.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return downloadReceipt.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\AdmissionApplicationController::downloadReceipt
* @see app/Http/Controllers/Api/V1/StudentDashboard/AdmissionApplicationController.php:74
* @route '/api/v1/student/admission/{id}/download-receipt'
*/
downloadReceipt.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadReceipt.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\AdmissionApplicationController::downloadReceipt
* @see app/Http/Controllers/Api/V1/StudentDashboard/AdmissionApplicationController.php:74
* @route '/api/v1/student/admission/{id}/download-receipt'
*/
downloadReceipt.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadReceipt.url(args, options),
    method: 'head',
})

const AdmissionApplicationController = { downloadReceipt }

export default AdmissionApplicationController