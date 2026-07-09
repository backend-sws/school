import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Timetable\TimetablePageController::index
* @see app/Http/Controllers/Timetable/TimetablePageController.php:11
* @route '/timetable'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/timetable',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Timetable\TimetablePageController::index
* @see app/Http/Controllers/Timetable/TimetablePageController.php:11
* @route '/timetable'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Timetable\TimetablePageController::index
* @see app/Http/Controllers/Timetable/TimetablePageController.php:11
* @route '/timetable'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Timetable\TimetablePageController::index
* @see app/Http/Controllers/Timetable/TimetablePageController.php:11
* @route '/timetable'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Timetable\TimetablePageController::templates
* @see app/Http/Controllers/Timetable/TimetablePageController.php:16
* @route '/timetable/templates'
*/
export const templates = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: templates.url(options),
    method: 'get',
})

templates.definition = {
    methods: ["get","head"],
    url: '/timetable/templates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Timetable\TimetablePageController::templates
* @see app/Http/Controllers/Timetable/TimetablePageController.php:16
* @route '/timetable/templates'
*/
templates.url = (options?: RouteQueryOptions) => {
    return templates.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Timetable\TimetablePageController::templates
* @see app/Http/Controllers/Timetable/TimetablePageController.php:16
* @route '/timetable/templates'
*/
templates.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: templates.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Timetable\TimetablePageController::templates
* @see app/Http/Controllers/Timetable/TimetablePageController.php:16
* @route '/timetable/templates'
*/
templates.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: templates.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Timetable\TimetablePageController::rooms
* @see app/Http/Controllers/Timetable/TimetablePageController.php:21
* @route '/timetable/rooms'
*/
export const rooms = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rooms.url(options),
    method: 'get',
})

rooms.definition = {
    methods: ["get","head"],
    url: '/timetable/rooms',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Timetable\TimetablePageController::rooms
* @see app/Http/Controllers/Timetable/TimetablePageController.php:21
* @route '/timetable/rooms'
*/
rooms.url = (options?: RouteQueryOptions) => {
    return rooms.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Timetable\TimetablePageController::rooms
* @see app/Http/Controllers/Timetable/TimetablePageController.php:21
* @route '/timetable/rooms'
*/
rooms.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rooms.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Timetable\TimetablePageController::rooms
* @see app/Http/Controllers/Timetable/TimetablePageController.php:21
* @route '/timetable/rooms'
*/
rooms.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: rooms.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Timetable\TimetablePageController::daily
* @see app/Http/Controllers/Timetable/TimetablePageController.php:38
* @route '/timetable/daily'
*/
export const daily = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: daily.url(options),
    method: 'get',
})

daily.definition = {
    methods: ["get","head"],
    url: '/timetable/daily',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Timetable\TimetablePageController::daily
* @see app/Http/Controllers/Timetable/TimetablePageController.php:38
* @route '/timetable/daily'
*/
daily.url = (options?: RouteQueryOptions) => {
    return daily.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Timetable\TimetablePageController::daily
* @see app/Http/Controllers/Timetable/TimetablePageController.php:38
* @route '/timetable/daily'
*/
daily.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: daily.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Timetable\TimetablePageController::daily
* @see app/Http/Controllers/Timetable/TimetablePageController.php:38
* @route '/timetable/daily'
*/
daily.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: daily.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Timetable\TimetablePageController::substitutions
* @see app/Http/Controllers/Timetable/TimetablePageController.php:33
* @route '/timetable/substitutions'
*/
export const substitutions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: substitutions.url(options),
    method: 'get',
})

substitutions.definition = {
    methods: ["get","head"],
    url: '/timetable/substitutions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Timetable\TimetablePageController::substitutions
* @see app/Http/Controllers/Timetable/TimetablePageController.php:33
* @route '/timetable/substitutions'
*/
substitutions.url = (options?: RouteQueryOptions) => {
    return substitutions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Timetable\TimetablePageController::substitutions
* @see app/Http/Controllers/Timetable/TimetablePageController.php:33
* @route '/timetable/substitutions'
*/
substitutions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: substitutions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Timetable\TimetablePageController::substitutions
* @see app/Http/Controllers/Timetable/TimetablePageController.php:33
* @route '/timetable/substitutions'
*/
substitutions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: substitutions.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Timetable\TimetablePageController::builder
* @see app/Http/Controllers/Timetable/TimetablePageController.php:26
* @route '/timetable/{id}/builder'
*/
export const builder = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: builder.url(args, options),
    method: 'get',
})

builder.definition = {
    methods: ["get","head"],
    url: '/timetable/{id}/builder',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Timetable\TimetablePageController::builder
* @see app/Http/Controllers/Timetable/TimetablePageController.php:26
* @route '/timetable/{id}/builder'
*/
builder.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return builder.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Timetable\TimetablePageController::builder
* @see app/Http/Controllers/Timetable/TimetablePageController.php:26
* @route '/timetable/{id}/builder'
*/
builder.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: builder.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Timetable\TimetablePageController::builder
* @see app/Http/Controllers/Timetable/TimetablePageController.php:26
* @route '/timetable/{id}/builder'
*/
builder.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: builder.url(args, options),
    method: 'head',
})

const TimetablePageController = { index, templates, rooms, daily, substitutions, builder }

export default TimetablePageController