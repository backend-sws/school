import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Communications\CommunicationsController::smsLogs
* @see app/Http/Controllers/Api/V1/Communications/CommunicationsController.php:48
* @route '/api/v1/communications/sms-logs'
*/
export const smsLogs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: smsLogs.url(options),
    method: 'get',
})

smsLogs.definition = {
    methods: ["get","head"],
    url: '/api/v1/communications/sms-logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Communications\CommunicationsController::smsLogs
* @see app/Http/Controllers/Api/V1/Communications/CommunicationsController.php:48
* @route '/api/v1/communications/sms-logs'
*/
smsLogs.url = (options?: RouteQueryOptions) => {
    return smsLogs.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Communications\CommunicationsController::smsLogs
* @see app/Http/Controllers/Api/V1/Communications/CommunicationsController.php:48
* @route '/api/v1/communications/sms-logs'
*/
smsLogs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: smsLogs.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Communications\CommunicationsController::smsLogs
* @see app/Http/Controllers/Api/V1/Communications/CommunicationsController.php:48
* @route '/api/v1/communications/sms-logs'
*/
smsLogs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: smsLogs.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Communications\CommunicationsController::sendSms
* @see app/Http/Controllers/Api/V1/Communications/CommunicationsController.php:68
* @route '/api/v1/communications/sms/send'
*/
export const sendSms = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendSms.url(options),
    method: 'post',
})

sendSms.definition = {
    methods: ["post"],
    url: '/api/v1/communications/sms/send',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Communications\CommunicationsController::sendSms
* @see app/Http/Controllers/Api/V1/Communications/CommunicationsController.php:68
* @route '/api/v1/communications/sms/send'
*/
sendSms.url = (options?: RouteQueryOptions) => {
    return sendSms.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Communications\CommunicationsController::sendSms
* @see app/Http/Controllers/Api/V1/Communications/CommunicationsController.php:68
* @route '/api/v1/communications/sms/send'
*/
sendSms.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendSms.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Communications\CommunicationsController::smsStats
* @see app/Http/Controllers/Api/V1/Communications/CommunicationsController.php:101
* @route '/api/v1/communications/sms/stats'
*/
export const smsStats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: smsStats.url(options),
    method: 'get',
})

smsStats.definition = {
    methods: ["get","head"],
    url: '/api/v1/communications/sms/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Communications\CommunicationsController::smsStats
* @see app/Http/Controllers/Api/V1/Communications/CommunicationsController.php:101
* @route '/api/v1/communications/sms/stats'
*/
smsStats.url = (options?: RouteQueryOptions) => {
    return smsStats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Communications\CommunicationsController::smsStats
* @see app/Http/Controllers/Api/V1/Communications/CommunicationsController.php:101
* @route '/api/v1/communications/sms/stats'
*/
smsStats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: smsStats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Communications\CommunicationsController::smsStats
* @see app/Http/Controllers/Api/V1/Communications/CommunicationsController.php:101
* @route '/api/v1/communications/sms/stats'
*/
smsStats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: smsStats.url(options),
    method: 'head',
})

const CommunicationsController = { smsLogs, sendSms, smsStats }

export default CommunicationsController