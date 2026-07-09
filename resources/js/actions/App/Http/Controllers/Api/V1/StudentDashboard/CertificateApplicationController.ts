import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateApplicationController::submitCertificateApplication
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateApplicationController.php:86
 * @route '/api/v1/student/certificate/submit'
 */
export const submitCertificateApplication = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitCertificateApplication.url(options),
    method: 'post',
})

submitCertificateApplication.definition = {
    methods: ["post"],
    url: '/api/v1/student/certificate/submit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateApplicationController::submitCertificateApplication
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateApplicationController.php:86
 * @route '/api/v1/student/certificate/submit'
 */
submitCertificateApplication.url = (options?: RouteQueryOptions) => {
    return submitCertificateApplication.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateApplicationController::submitCertificateApplication
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateApplicationController.php:86
 * @route '/api/v1/student/certificate/submit'
 */
submitCertificateApplication.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitCertificateApplication.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateApplicationController::submitCertificateApplication
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateApplicationController.php:86
 * @route '/api/v1/student/certificate/submit'
 */
    const submitCertificateApplicationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submitCertificateApplication.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateApplicationController::submitCertificateApplication
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateApplicationController.php:86
 * @route '/api/v1/student/certificate/submit'
 */
        submitCertificateApplicationForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submitCertificateApplication.url(options),
            method: 'post',
        })
    
    submitCertificateApplication.form = submitCertificateApplicationForm
/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateApplicationController::myApplications
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateApplicationController.php:186
 * @route '/api/v1/student/certificate/my-applications'
 */
export const myApplications = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myApplications.url(options),
    method: 'get',
})

myApplications.definition = {
    methods: ["get","head"],
    url: '/api/v1/student/certificate/my-applications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateApplicationController::myApplications
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateApplicationController.php:186
 * @route '/api/v1/student/certificate/my-applications'
 */
myApplications.url = (options?: RouteQueryOptions) => {
    return myApplications.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateApplicationController::myApplications
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateApplicationController.php:186
 * @route '/api/v1/student/certificate/my-applications'
 */
myApplications.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myApplications.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateApplicationController::myApplications
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateApplicationController.php:186
 * @route '/api/v1/student/certificate/my-applications'
 */
myApplications.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: myApplications.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateApplicationController::myApplications
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateApplicationController.php:186
 * @route '/api/v1/student/certificate/my-applications'
 */
    const myApplicationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: myApplications.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateApplicationController::myApplications
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateApplicationController.php:186
 * @route '/api/v1/student/certificate/my-applications'
 */
        myApplicationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: myApplications.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateApplicationController::myApplications
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateApplicationController.php:186
 * @route '/api/v1/student/certificate/my-applications'
 */
        myApplicationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: myApplications.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    myApplications.form = myApplicationsForm
const CertificateApplicationController = { submitCertificateApplication, myApplications }

export default CertificateApplicationController