import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Timetable\SubstitutionController::getCandidates
 * @see app/Http/Controllers/Api/V1/Timetable/SubstitutionController.php:50
 * @route '/api/v1/timetable/substitutions/candidates'
 */
export const getCandidates = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCandidates.url(options),
    method: 'get',
})

getCandidates.definition = {
    methods: ["get","head"],
    url: '/api/v1/timetable/substitutions/candidates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Timetable\SubstitutionController::getCandidates
 * @see app/Http/Controllers/Api/V1/Timetable/SubstitutionController.php:50
 * @route '/api/v1/timetable/substitutions/candidates'
 */
getCandidates.url = (options?: RouteQueryOptions) => {
    return getCandidates.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Timetable\SubstitutionController::getCandidates
 * @see app/Http/Controllers/Api/V1/Timetable/SubstitutionController.php:50
 * @route '/api/v1/timetable/substitutions/candidates'
 */
getCandidates.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCandidates.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Timetable\SubstitutionController::getCandidates
 * @see app/Http/Controllers/Api/V1/Timetable/SubstitutionController.php:50
 * @route '/api/v1/timetable/substitutions/candidates'
 */
getCandidates.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getCandidates.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Timetable\SubstitutionController::getCandidates
 * @see app/Http/Controllers/Api/V1/Timetable/SubstitutionController.php:50
 * @route '/api/v1/timetable/substitutions/candidates'
 */
    const getCandidatesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getCandidates.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Timetable\SubstitutionController::getCandidates
 * @see app/Http/Controllers/Api/V1/Timetable/SubstitutionController.php:50
 * @route '/api/v1/timetable/substitutions/candidates'
 */
        getCandidatesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getCandidates.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Timetable\SubstitutionController::getCandidates
 * @see app/Http/Controllers/Api/V1/Timetable/SubstitutionController.php:50
 * @route '/api/v1/timetable/substitutions/candidates'
 */
        getCandidatesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getCandidates.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getCandidates.form = getCandidatesForm
const SubstitutionController = { getCandidates }

export default SubstitutionController