import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeDuesController::index
* @see app/Http/Controllers/Api/V1/Fees/FeeDuesController.php:32
* @route '/api/v1/fees/dues'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/fees/dues',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeDuesController::index
* @see app/Http/Controllers/Api/V1/Fees/FeeDuesController.php:32
* @route '/api/v1/fees/dues'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeDuesController::index
* @see app/Http/Controllers/Api/V1/Fees/FeeDuesController.php:32
* @route '/api/v1/fees/dues'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeDuesController::index
* @see app/Http/Controllers/Api/V1/Fees/FeeDuesController.php:32
* @route '/api/v1/fees/dues'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeDuesController::overdue
* @see app/Http/Controllers/Api/V1/Fees/FeeDuesController.php:198
* @route '/api/v1/fees/dues/overdue'
*/
export const overdue = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overdue.url(options),
    method: 'get',
})

overdue.definition = {
    methods: ["get","head"],
    url: '/api/v1/fees/dues/overdue',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeDuesController::overdue
* @see app/Http/Controllers/Api/V1/Fees/FeeDuesController.php:198
* @route '/api/v1/fees/dues/overdue'
*/
overdue.url = (options?: RouteQueryOptions) => {
    return overdue.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeDuesController::overdue
* @see app/Http/Controllers/Api/V1/Fees/FeeDuesController.php:198
* @route '/api/v1/fees/dues/overdue'
*/
overdue.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overdue.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeDuesController::overdue
* @see app/Http/Controllers/Api/V1/Fees/FeeDuesController.php:198
* @route '/api/v1/fees/dues/overdue'
*/
overdue.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: overdue.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeDuesController::sendReminder
* @see app/Http/Controllers/Api/V1/Fees/FeeDuesController.php:285
* @route '/api/v1/fees/dues/send-reminder'
*/
export const sendReminder = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendReminder.url(options),
    method: 'post',
})

sendReminder.definition = {
    methods: ["post"],
    url: '/api/v1/fees/dues/send-reminder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeDuesController::sendReminder
* @see app/Http/Controllers/Api/V1/Fees/FeeDuesController.php:285
* @route '/api/v1/fees/dues/send-reminder'
*/
sendReminder.url = (options?: RouteQueryOptions) => {
    return sendReminder.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeeDuesController::sendReminder
* @see app/Http/Controllers/Api/V1/Fees/FeeDuesController.php:285
* @route '/api/v1/fees/dues/send-reminder'
*/
sendReminder.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendReminder.url(options),
    method: 'post',
})

const FeeDuesController = { index, overdue, sendReminder }

export default FeeDuesController