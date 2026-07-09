import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeCollectionSettingsController::show
* @see app/Http/Controllers/Api/V1/Fees/FeeCollectionSettingsController.php:23
* @route '/api/v1/fees/collection-settings'
*/
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/fees/collection-settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeCollectionSettingsController::show
* @see app/Http/Controllers/Api/V1/Fees/FeeCollectionSettingsController.php:23
* @route '/api/v1/fees/collection-settings'
*/
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeCollectionSettingsController::show
* @see app/Http/Controllers/Api/V1/Fees/FeeCollectionSettingsController.php:23
* @route '/api/v1/fees/collection-settings'
*/
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeCollectionSettingsController::show
* @see app/Http/Controllers/Api/V1/Fees/FeeCollectionSettingsController.php:23
* @route '/api/v1/fees/collection-settings'
*/
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeCollectionSettingsController::update
* @see app/Http/Controllers/Api/V1/Fees/FeeCollectionSettingsController.php:37
* @route '/api/v1/fees/collection-settings'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/api/v1/fees/collection-settings',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeCollectionSettingsController::update
* @see app/Http/Controllers/Api/V1/Fees/FeeCollectionSettingsController.php:37
* @route '/api/v1/fees/collection-settings'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeCollectionSettingsController::update
* @see app/Http/Controllers/Api/V1/Fees/FeeCollectionSettingsController.php:37
* @route '/api/v1/fees/collection-settings'
*/
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

const FeeCollectionSettingsController = { show, update }

export default FeeCollectionSettingsController