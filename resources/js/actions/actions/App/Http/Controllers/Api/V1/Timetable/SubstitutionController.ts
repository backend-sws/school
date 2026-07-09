import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../../wayfinder'
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

const SubstitutionController = { getCandidates }

export default SubstitutionController