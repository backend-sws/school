import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::index
* @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:16
* @route '/api/v1/lms/courses'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/courses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::index
* @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:16
* @route '/api/v1/lms/courses'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::index
* @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:16
* @route '/api/v1/lms/courses'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::index
* @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:16
* @route '/api/v1/lms/courses'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::store
* @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:44
* @route '/api/v1/lms/courses'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/lms/courses',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::store
* @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:44
* @route '/api/v1/lms/courses'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::store
* @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:44
* @route '/api/v1/lms/courses'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::show
* @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:86
* @route '/api/v1/lms/courses/{lms_course}'
*/
export const show = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/courses/{lms_course}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::show
* @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:86
* @route '/api/v1/lms/courses/{lms_course}'
*/
show.url = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lms_course: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { lms_course: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            lms_course: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lms_course: typeof args.lms_course === 'object'
        ? args.lms_course.id
        : args.lms_course,
    }

    return show.definition.url
            .replace('{lms_course}', parsedArgs.lms_course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::show
* @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:86
* @route '/api/v1/lms/courses/{lms_course}'
*/
show.get = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::show
* @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:86
* @route '/api/v1/lms/courses/{lms_course}'
*/
show.head = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::update
* @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:95
* @route '/api/v1/lms/courses/{lms_course}'
*/
export const update = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/lms/courses/{lms_course}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::update
* @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:95
* @route '/api/v1/lms/courses/{lms_course}'
*/
update.url = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lms_course: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { lms_course: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            lms_course: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lms_course: typeof args.lms_course === 'object'
        ? args.lms_course.id
        : args.lms_course,
    }

    return update.definition.url
            .replace('{lms_course}', parsedArgs.lms_course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::update
* @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:95
* @route '/api/v1/lms/courses/{lms_course}'
*/
update.put = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::update
* @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:95
* @route '/api/v1/lms/courses/{lms_course}'
*/
update.patch = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::destroy
* @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:133
* @route '/api/v1/lms/courses/{lms_course}'
*/
export const destroy = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/lms/courses/{lms_course}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::destroy
* @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:133
* @route '/api/v1/lms/courses/{lms_course}'
*/
destroy.url = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lms_course: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { lms_course: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            lms_course: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lms_course: typeof args.lms_course === 'object'
        ? args.lms_course.id
        : args.lms_course,
    }

    return destroy.definition.url
            .replace('{lms_course}', parsedArgs.lms_course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::destroy
* @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:133
* @route '/api/v1/lms/courses/{lms_course}'
*/
destroy.delete = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const LmsCourseController = { index, store, show, update, destroy }

export default LmsCourseController