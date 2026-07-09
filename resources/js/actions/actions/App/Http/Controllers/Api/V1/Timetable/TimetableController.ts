import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::saveEntries
* @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:68
* @route '/api/v1/timetable/timetables/{timetable}/entries'
*/
export const saveEntries = (args: { timetable: number | { id: number } } | [timetable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveEntries.url(args, options),
    method: 'post',
})

saveEntries.definition = {
    methods: ["post"],
    url: '/api/v1/timetable/timetables/{timetable}/entries',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::saveEntries
* @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:68
* @route '/api/v1/timetable/timetables/{timetable}/entries'
*/
saveEntries.url = (args: { timetable: number | { id: number } } | [timetable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { timetable: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { timetable: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            timetable: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        timetable: typeof args.timetable === 'object'
        ? args.timetable.id
        : args.timetable,
    }

    return saveEntries.definition.url
            .replace('{timetable}', parsedArgs.timetable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::saveEntries
* @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:68
* @route '/api/v1/timetable/timetables/{timetable}/entries'
*/
saveEntries.post = (args: { timetable: number | { id: number } } | [timetable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveEntries.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::publish
* @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:85
* @route '/api/v1/timetable/timetables/{timetable}/publish'
*/
export const publish = (args: { timetable: number | { id: number } } | [timetable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(args, options),
    method: 'post',
})

publish.definition = {
    methods: ["post"],
    url: '/api/v1/timetable/timetables/{timetable}/publish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::publish
* @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:85
* @route '/api/v1/timetable/timetables/{timetable}/publish'
*/
publish.url = (args: { timetable: number | { id: number } } | [timetable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { timetable: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { timetable: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            timetable: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        timetable: typeof args.timetable === 'object'
        ? args.timetable.id
        : args.timetable,
    }

    return publish.definition.url
            .replace('{timetable}', parsedArgs.timetable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::publish
* @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:85
* @route '/api/v1/timetable/timetables/{timetable}/publish'
*/
publish.post = (args: { timetable: number | { id: number } } | [timetable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::index
* @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:23
* @route '/api/v1/timetable/timetables'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/timetable/timetables',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::index
* @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:23
* @route '/api/v1/timetable/timetables'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::index
* @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:23
* @route '/api/v1/timetable/timetables'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::index
* @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:23
* @route '/api/v1/timetable/timetables'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::store
* @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:39
* @route '/api/v1/timetable/timetables'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/timetable/timetables',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::store
* @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:39
* @route '/api/v1/timetable/timetables'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::store
* @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:39
* @route '/api/v1/timetable/timetables'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::show
* @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:54
* @route '/api/v1/timetable/timetables/{timetable}'
*/
export const show = (args: { timetable: number | { id: number } } | [timetable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/timetable/timetables/{timetable}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::show
* @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:54
* @route '/api/v1/timetable/timetables/{timetable}'
*/
show.url = (args: { timetable: number | { id: number } } | [timetable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { timetable: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { timetable: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            timetable: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        timetable: typeof args.timetable === 'object'
        ? args.timetable.id
        : args.timetable,
    }

    return show.definition.url
            .replace('{timetable}', parsedArgs.timetable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::show
* @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:54
* @route '/api/v1/timetable/timetables/{timetable}'
*/
show.get = (args: { timetable: number | { id: number } } | [timetable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::show
* @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:54
* @route '/api/v1/timetable/timetables/{timetable}'
*/
show.head = (args: { timetable: number | { id: number } } | [timetable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::update
* @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:0
* @route '/api/v1/timetable/timetables/{timetable}'
*/
export const update = (args: { timetable: string | number } | [timetable: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/timetable/timetables/{timetable}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::update
* @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:0
* @route '/api/v1/timetable/timetables/{timetable}'
*/
update.url = (args: { timetable: string | number } | [timetable: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { timetable: args }
    }

    if (Array.isArray(args)) {
        args = {
            timetable: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        timetable: args.timetable,
    }

    return update.definition.url
            .replace('{timetable}', parsedArgs.timetable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::update
* @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:0
* @route '/api/v1/timetable/timetables/{timetable}'
*/
update.put = (args: { timetable: string | number } | [timetable: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::update
* @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:0
* @route '/api/v1/timetable/timetables/{timetable}'
*/
update.patch = (args: { timetable: string | number } | [timetable: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::destroy
* @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:0
* @route '/api/v1/timetable/timetables/{timetable}'
*/
export const destroy = (args: { timetable: string | number } | [timetable: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/timetable/timetables/{timetable}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::destroy
* @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:0
* @route '/api/v1/timetable/timetables/{timetable}'
*/
destroy.url = (args: { timetable: string | number } | [timetable: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { timetable: args }
    }

    if (Array.isArray(args)) {
        args = {
            timetable: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        timetable: args.timetable,
    }

    return destroy.definition.url
            .replace('{timetable}', parsedArgs.timetable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::destroy
* @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:0
* @route '/api/v1/timetable/timetables/{timetable}'
*/
destroy.delete = (args: { timetable: string | number } | [timetable: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const TimetableController = { saveEntries, publish, index, store, show, update, destroy }

export default TimetableController