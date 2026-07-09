import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectController::toggleStatus
* @see app/Http/Controllers/Api/V1/Organization/SubjectController.php:211
* @route '/api/v1/subjects/{id}/toggle-status'
*/
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

toggleStatus.definition = {
    methods: ["patch"],
    url: '/api/v1/subjects/{id}/toggle-status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectController::toggleStatus
* @see app/Http/Controllers/Api/V1/Organization/SubjectController.php:211
* @route '/api/v1/subjects/{id}/toggle-status'
*/
toggleStatus.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleStatus.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectController::toggleStatus
* @see app/Http/Controllers/Api/V1/Organization/SubjectController.php:211
* @route '/api/v1/subjects/{id}/toggle-status'
*/
toggleStatus.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectController::index
* @see app/Http/Controllers/Api/V1/Organization/SubjectController.php:33
* @route '/api/v1/subjects'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/subjects',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectController::index
* @see app/Http/Controllers/Api/V1/Organization/SubjectController.php:33
* @route '/api/v1/subjects'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectController::index
* @see app/Http/Controllers/Api/V1/Organization/SubjectController.php:33
* @route '/api/v1/subjects'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectController::index
* @see app/Http/Controllers/Api/V1/Organization/SubjectController.php:33
* @route '/api/v1/subjects'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectController::store
* @see app/Http/Controllers/Api/V1/Organization/SubjectController.php:82
* @route '/api/v1/subjects'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/subjects',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectController::store
* @see app/Http/Controllers/Api/V1/Organization/SubjectController.php:82
* @route '/api/v1/subjects'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectController::store
* @see app/Http/Controllers/Api/V1/Organization/SubjectController.php:82
* @route '/api/v1/subjects'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectController::show
* @see app/Http/Controllers/Api/V1/Organization/SubjectController.php:108
* @route '/api/v1/subjects/{subject}'
*/
export const show = (args: { subject: number | { id: number } } | [subject: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/subjects/{subject}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectController::show
* @see app/Http/Controllers/Api/V1/Organization/SubjectController.php:108
* @route '/api/v1/subjects/{subject}'
*/
show.url = (args: { subject: number | { id: number } } | [subject: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subject: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { subject: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            subject: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        subject: typeof args.subject === 'object'
        ? args.subject.id
        : args.subject,
    }

    return show.definition.url
            .replace('{subject}', parsedArgs.subject.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectController::show
* @see app/Http/Controllers/Api/V1/Organization/SubjectController.php:108
* @route '/api/v1/subjects/{subject}'
*/
show.get = (args: { subject: number | { id: number } } | [subject: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectController::show
* @see app/Http/Controllers/Api/V1/Organization/SubjectController.php:108
* @route '/api/v1/subjects/{subject}'
*/
show.head = (args: { subject: number | { id: number } } | [subject: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectController::update
* @see app/Http/Controllers/Api/V1/Organization/SubjectController.php:141
* @route '/api/v1/subjects/{subject}'
*/
export const update = (args: { subject: number | { id: number } } | [subject: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/subjects/{subject}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectController::update
* @see app/Http/Controllers/Api/V1/Organization/SubjectController.php:141
* @route '/api/v1/subjects/{subject}'
*/
update.url = (args: { subject: number | { id: number } } | [subject: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subject: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { subject: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            subject: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        subject: typeof args.subject === 'object'
        ? args.subject.id
        : args.subject,
    }

    return update.definition.url
            .replace('{subject}', parsedArgs.subject.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectController::update
* @see app/Http/Controllers/Api/V1/Organization/SubjectController.php:141
* @route '/api/v1/subjects/{subject}'
*/
update.put = (args: { subject: number | { id: number } } | [subject: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectController::update
* @see app/Http/Controllers/Api/V1/Organization/SubjectController.php:141
* @route '/api/v1/subjects/{subject}'
*/
update.patch = (args: { subject: number | { id: number } } | [subject: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectController::destroy
* @see app/Http/Controllers/Api/V1/Organization/SubjectController.php:169
* @route '/api/v1/subjects/{subject}'
*/
export const destroy = (args: { subject: number | { id: number } } | [subject: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/subjects/{subject}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectController::destroy
* @see app/Http/Controllers/Api/V1/Organization/SubjectController.php:169
* @route '/api/v1/subjects/{subject}'
*/
destroy.url = (args: { subject: number | { id: number } } | [subject: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subject: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { subject: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            subject: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        subject: typeof args.subject === 'object'
        ? args.subject.id
        : args.subject,
    }

    return destroy.definition.url
            .replace('{subject}', parsedArgs.subject.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectController::destroy
* @see app/Http/Controllers/Api/V1/Organization/SubjectController.php:169
* @route '/api/v1/subjects/{subject}'
*/
destroy.delete = (args: { subject: number | { id: number } } | [subject: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const SubjectController = { toggleStatus, index, store, show, update, destroy }

export default SubjectController