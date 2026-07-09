import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateHeadController::getAvailableCertificates
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateHeadController.php:23
 * @route '/api/v1/student/certificate/list'
 */
export const getAvailableCertificates = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAvailableCertificates.url(options),
    method: 'get',
})

getAvailableCertificates.definition = {
    methods: ["get","head"],
    url: '/api/v1/student/certificate/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateHeadController::getAvailableCertificates
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateHeadController.php:23
 * @route '/api/v1/student/certificate/list'
 */
getAvailableCertificates.url = (options?: RouteQueryOptions) => {
    return getAvailableCertificates.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateHeadController::getAvailableCertificates
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateHeadController.php:23
 * @route '/api/v1/student/certificate/list'
 */
getAvailableCertificates.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAvailableCertificates.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateHeadController::getAvailableCertificates
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateHeadController.php:23
 * @route '/api/v1/student/certificate/list'
 */
getAvailableCertificates.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getAvailableCertificates.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateHeadController::getAvailableCertificates
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateHeadController.php:23
 * @route '/api/v1/student/certificate/list'
 */
    const getAvailableCertificatesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getAvailableCertificates.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateHeadController::getAvailableCertificates
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateHeadController.php:23
 * @route '/api/v1/student/certificate/list'
 */
        getAvailableCertificatesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAvailableCertificates.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateHeadController::getAvailableCertificates
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateHeadController.php:23
 * @route '/api/v1/student/certificate/list'
 */
        getAvailableCertificatesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAvailableCertificates.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getAvailableCertificates.form = getAvailableCertificatesForm
/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateHeadController::getCertificateDetails
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateHeadController.php:54
 * @route '/api/v1/student/certificate/details/{id}'
 */
export const getCertificateDetails = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCertificateDetails.url(args, options),
    method: 'get',
})

getCertificateDetails.definition = {
    methods: ["get","head"],
    url: '/api/v1/student/certificate/details/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateHeadController::getCertificateDetails
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateHeadController.php:54
 * @route '/api/v1/student/certificate/details/{id}'
 */
getCertificateDetails.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getCertificateDetails.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateHeadController::getCertificateDetails
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateHeadController.php:54
 * @route '/api/v1/student/certificate/details/{id}'
 */
getCertificateDetails.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCertificateDetails.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateHeadController::getCertificateDetails
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateHeadController.php:54
 * @route '/api/v1/student/certificate/details/{id}'
 */
getCertificateDetails.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getCertificateDetails.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateHeadController::getCertificateDetails
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateHeadController.php:54
 * @route '/api/v1/student/certificate/details/{id}'
 */
    const getCertificateDetailsForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getCertificateDetails.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateHeadController::getCertificateDetails
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateHeadController.php:54
 * @route '/api/v1/student/certificate/details/{id}'
 */
        getCertificateDetailsForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getCertificateDetails.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\StudentDashboard\CertificateHeadController::getCertificateDetails
 * @see app/Http/Controllers/Api/V1/StudentDashboard/CertificateHeadController.php:54
 * @route '/api/v1/student/certificate/details/{id}'
 */
        getCertificateDetailsForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getCertificateDetails.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getCertificateDetails.form = getCertificateDetailsForm
const CertificateHeadController = { getAvailableCertificates, getCertificateDetails }

export default CertificateHeadController