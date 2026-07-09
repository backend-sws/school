import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Organization\AcademicCalendarSettingsController::show
* @see app/Http/Controllers/Api/V1/Organization/AcademicCalendarSettingsController.php:19
* @route '/api/v1/academic-calendar/settings'
*/
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/academic-calendar/settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\AcademicCalendarSettingsController::show
* @see app/Http/Controllers/Api/V1/Organization/AcademicCalendarSettingsController.php:19
* @route '/api/v1/academic-calendar/settings'
*/
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\AcademicCalendarSettingsController::show
* @see app/Http/Controllers/Api/V1/Organization/AcademicCalendarSettingsController.php:19
* @route '/api/v1/academic-calendar/settings'
*/
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\AcademicCalendarSettingsController::show
* @see app/Http/Controllers/Api/V1/Organization/AcademicCalendarSettingsController.php:19
* @route '/api/v1/academic-calendar/settings'
*/
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\AcademicCalendarSettingsController::update
* @see app/Http/Controllers/Api/V1/Organization/AcademicCalendarSettingsController.php:31
* @route '/api/v1/academic-calendar/settings'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/api/v1/academic-calendar/settings',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\AcademicCalendarSettingsController::update
* @see app/Http/Controllers/Api/V1/Organization/AcademicCalendarSettingsController.php:31
* @route '/api/v1/academic-calendar/settings'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\AcademicCalendarSettingsController::update
* @see app/Http/Controllers/Api/V1/Organization/AcademicCalendarSettingsController.php:31
* @route '/api/v1/academic-calendar/settings'
*/
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

const AcademicCalendarSettingsController = { show, update }

export default AcademicCalendarSettingsController