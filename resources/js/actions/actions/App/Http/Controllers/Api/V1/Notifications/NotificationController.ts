import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Notifications\NotificationController::index
* @see app/Http/Controllers/Api/V1/Notifications/NotificationController.php:17
* @route '/api/v1/notifications'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Notifications\NotificationController::index
* @see app/Http/Controllers/Api/V1/Notifications/NotificationController.php:17
* @route '/api/v1/notifications'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Notifications\NotificationController::index
* @see app/Http/Controllers/Api/V1/Notifications/NotificationController.php:17
* @route '/api/v1/notifications'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Notifications\NotificationController::index
* @see app/Http/Controllers/Api/V1/Notifications/NotificationController.php:17
* @route '/api/v1/notifications'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Notifications\NotificationController::unread
* @see app/Http/Controllers/Api/V1/Notifications/NotificationController.php:59
* @route '/api/v1/notifications/unread'
*/
export const unread = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unread.url(options),
    method: 'get',
})

unread.definition = {
    methods: ["get","head"],
    url: '/api/v1/notifications/unread',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Notifications\NotificationController::unread
* @see app/Http/Controllers/Api/V1/Notifications/NotificationController.php:59
* @route '/api/v1/notifications/unread'
*/
unread.url = (options?: RouteQueryOptions) => {
    return unread.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Notifications\NotificationController::unread
* @see app/Http/Controllers/Api/V1/Notifications/NotificationController.php:59
* @route '/api/v1/notifications/unread'
*/
unread.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unread.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Notifications\NotificationController::unread
* @see app/Http/Controllers/Api/V1/Notifications/NotificationController.php:59
* @route '/api/v1/notifications/unread'
*/
unread.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: unread.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Notifications\NotificationController::markAsRead
* @see app/Http/Controllers/Api/V1/Notifications/NotificationController.php:90
* @route '/api/v1/notifications/{id}/read'
*/
export const markAsRead = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsRead.url(args, options),
    method: 'post',
})

markAsRead.definition = {
    methods: ["post"],
    url: '/api/v1/notifications/{id}/read',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Notifications\NotificationController::markAsRead
* @see app/Http/Controllers/Api/V1/Notifications/NotificationController.php:90
* @route '/api/v1/notifications/{id}/read'
*/
markAsRead.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return markAsRead.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Notifications\NotificationController::markAsRead
* @see app/Http/Controllers/Api/V1/Notifications/NotificationController.php:90
* @route '/api/v1/notifications/{id}/read'
*/
markAsRead.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsRead.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Notifications\NotificationController::markAllAsRead
* @see app/Http/Controllers/Api/V1/Notifications/NotificationController.php:102
* @route '/api/v1/notifications/read-all'
*/
export const markAllAsRead = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllAsRead.url(options),
    method: 'post',
})

markAllAsRead.definition = {
    methods: ["post"],
    url: '/api/v1/notifications/read-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Notifications\NotificationController::markAllAsRead
* @see app/Http/Controllers/Api/V1/Notifications/NotificationController.php:102
* @route '/api/v1/notifications/read-all'
*/
markAllAsRead.url = (options?: RouteQueryOptions) => {
    return markAllAsRead.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Notifications\NotificationController::markAllAsRead
* @see app/Http/Controllers/Api/V1/Notifications/NotificationController.php:102
* @route '/api/v1/notifications/read-all'
*/
markAllAsRead.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllAsRead.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Notifications\NotificationController::channels
* @see app/Http/Controllers/Api/V1/Notifications/NotificationController.php:115
* @route '/api/v1/notifications/channels/{type}'
*/
export const channels = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: channels.url(args, options),
    method: 'get',
})

channels.definition = {
    methods: ["get","head"],
    url: '/api/v1/notifications/channels/{type}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Notifications\NotificationController::channels
* @see app/Http/Controllers/Api/V1/Notifications/NotificationController.php:115
* @route '/api/v1/notifications/channels/{type}'
*/
channels.url = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { type: args }
    }

    if (Array.isArray(args)) {
        args = {
            type: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        type: args.type,
    }

    return channels.definition.url
            .replace('{type}', parsedArgs.type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Notifications\NotificationController::channels
* @see app/Http/Controllers/Api/V1/Notifications/NotificationController.php:115
* @route '/api/v1/notifications/channels/{type}'
*/
channels.get = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: channels.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Notifications\NotificationController::channels
* @see app/Http/Controllers/Api/V1/Notifications/NotificationController.php:115
* @route '/api/v1/notifications/channels/{type}'
*/
channels.head = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: channels.url(args, options),
    method: 'head',
})

const NotificationController = { index, unread, markAsRead, markAllAsRead, channels }

export default NotificationController