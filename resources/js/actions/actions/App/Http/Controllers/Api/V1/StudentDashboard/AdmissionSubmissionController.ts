import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\AdmissionSubmissionController::submitForm
* @see app/Http/Controllers/Api/V1/StudentDashboard/AdmissionSubmissionController.php:153
* @route '/api/v1/student/admission-form/submit'
*/
export const submitForm = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitForm.url(options),
    method: 'post',
})

submitForm.definition = {
    methods: ["post"],
    url: '/api/v1/student/admission-form/submit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\AdmissionSubmissionController::submitForm
* @see app/Http/Controllers/Api/V1/StudentDashboard/AdmissionSubmissionController.php:153
* @route '/api/v1/student/admission-form/submit'
*/
submitForm.url = (options?: RouteQueryOptions) => {
    return submitForm.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\AdmissionSubmissionController::submitForm
* @see app/Http/Controllers/Api/V1/StudentDashboard/AdmissionSubmissionController.php:153
* @route '/api/v1/student/admission-form/submit'
*/
submitForm.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitForm.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\AdmissionSubmissionController::getFeePreview
* @see app/Http/Controllers/Api/V1/StudentDashboard/AdmissionSubmissionController.php:661
* @route '/api/v1/student/admission-applications/{id}/fee-preview'
*/
export const getFeePreview = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getFeePreview.url(args, options),
    method: 'get',
})

getFeePreview.definition = {
    methods: ["get","head"],
    url: '/api/v1/student/admission-applications/{id}/fee-preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\AdmissionSubmissionController::getFeePreview
* @see app/Http/Controllers/Api/V1/StudentDashboard/AdmissionSubmissionController.php:661
* @route '/api/v1/student/admission-applications/{id}/fee-preview'
*/
getFeePreview.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getFeePreview.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\AdmissionSubmissionController::getFeePreview
* @see app/Http/Controllers/Api/V1/StudentDashboard/AdmissionSubmissionController.php:661
* @route '/api/v1/student/admission-applications/{id}/fee-preview'
*/
getFeePreview.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getFeePreview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\AdmissionSubmissionController::getFeePreview
* @see app/Http/Controllers/Api/V1/StudentDashboard/AdmissionSubmissionController.php:661
* @route '/api/v1/student/admission-applications/{id}/fee-preview'
*/
getFeePreview.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getFeePreview.url(args, options),
    method: 'head',
})

const AdmissionSubmissionController = { submitForm, getFeePreview }

export default AdmissionSubmissionController