import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAnnouncementController::index
* @see app/Http/Controllers/Api/V1/Lms/LmsAnnouncementController.php:17
* @route '/api/v1/lms/classes/{lms_class_id}/announcements'
*/
export const index = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/classes/{lms_class_id}/announcements',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAnnouncementController::index
* @see app/Http/Controllers/Api/V1/Lms/LmsAnnouncementController.php:17
* @route '/api/v1/lms/classes/{lms_class_id}/announcements'
*/
index.url = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lms_class_id: args }
    }

    if (Array.isArray(args)) {
        args = {
            lms_class_id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lms_class_id: args.lms_class_id,
    }

    return index.definition.url
            .replace('{lms_class_id}', parsedArgs.lms_class_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAnnouncementController::index
* @see app/Http/Controllers/Api/V1/Lms/LmsAnnouncementController.php:17
* @route '/api/v1/lms/classes/{lms_class_id}/announcements'
*/
index.get = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAnnouncementController::index
* @see app/Http/Controllers/Api/V1/Lms/LmsAnnouncementController.php:17
* @route '/api/v1/lms/classes/{lms_class_id}/announcements'
*/
index.head = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAnnouncementController::store
* @see app/Http/Controllers/Api/V1/Lms/LmsAnnouncementController.php:40
* @route '/api/v1/lms/classes/{lms_class_id}/announcements'
*/
export const store = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/lms/classes/{lms_class_id}/announcements',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAnnouncementController::store
* @see app/Http/Controllers/Api/V1/Lms/LmsAnnouncementController.php:40
* @route '/api/v1/lms/classes/{lms_class_id}/announcements'
*/
store.url = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lms_class_id: args }
    }

    if (Array.isArray(args)) {
        args = {
            lms_class_id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lms_class_id: args.lms_class_id,
    }

    return store.definition.url
            .replace('{lms_class_id}', parsedArgs.lms_class_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAnnouncementController::store
* @see app/Http/Controllers/Api/V1/Lms/LmsAnnouncementController.php:40
* @route '/api/v1/lms/classes/{lms_class_id}/announcements'
*/
store.post = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAnnouncementController::show
* @see app/Http/Controllers/Api/V1/Lms/LmsAnnouncementController.php:79
* @route '/api/v1/lms/classes/{lms_class_id}/announcements/{id}'
*/
export const show = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/classes/{lms_class_id}/announcements/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAnnouncementController::show
* @see app/Http/Controllers/Api/V1/Lms/LmsAnnouncementController.php:79
* @route '/api/v1/lms/classes/{lms_class_id}/announcements/{id}'
*/
show.url = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            lms_class_id: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lms_class_id: args.lms_class_id,
        id: args.id,
    }

    return show.definition.url
            .replace('{lms_class_id}', parsedArgs.lms_class_id.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAnnouncementController::show
* @see app/Http/Controllers/Api/V1/Lms/LmsAnnouncementController.php:79
* @route '/api/v1/lms/classes/{lms_class_id}/announcements/{id}'
*/
show.get = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAnnouncementController::show
* @see app/Http/Controllers/Api/V1/Lms/LmsAnnouncementController.php:79
* @route '/api/v1/lms/classes/{lms_class_id}/announcements/{id}'
*/
show.head = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAnnouncementController::update
* @see app/Http/Controllers/Api/V1/Lms/LmsAnnouncementController.php:93
* @route '/api/v1/lms/classes/{lms_class_id}/announcements/{id}'
*/
export const update = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/v1/lms/classes/{lms_class_id}/announcements/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAnnouncementController::update
* @see app/Http/Controllers/Api/V1/Lms/LmsAnnouncementController.php:93
* @route '/api/v1/lms/classes/{lms_class_id}/announcements/{id}'
*/
update.url = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            lms_class_id: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lms_class_id: args.lms_class_id,
        id: args.id,
    }

    return update.definition.url
            .replace('{lms_class_id}', parsedArgs.lms_class_id.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAnnouncementController::update
* @see app/Http/Controllers/Api/V1/Lms/LmsAnnouncementController.php:93
* @route '/api/v1/lms/classes/{lms_class_id}/announcements/{id}'
*/
update.put = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAnnouncementController::destroy
* @see app/Http/Controllers/Api/V1/Lms/LmsAnnouncementController.php:116
* @route '/api/v1/lms/classes/{lms_class_id}/announcements/{id}'
*/
export const destroy = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/lms/classes/{lms_class_id}/announcements/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAnnouncementController::destroy
* @see app/Http/Controllers/Api/V1/Lms/LmsAnnouncementController.php:116
* @route '/api/v1/lms/classes/{lms_class_id}/announcements/{id}'
*/
destroy.url = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            lms_class_id: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lms_class_id: args.lms_class_id,
        id: args.id,
    }

    return destroy.definition.url
            .replace('{lms_class_id}', parsedArgs.lms_class_id.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAnnouncementController::destroy
* @see app/Http/Controllers/Api/V1/Lms/LmsAnnouncementController.php:116
* @route '/api/v1/lms/classes/{lms_class_id}/announcements/{id}'
*/
destroy.delete = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const LmsAnnouncementController = { index, store, show, update, destroy }

export default LmsAnnouncementController