import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::index
* @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:12
* @route '/api/v1/subject-groups'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/subject-groups',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::index
* @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:12
* @route '/api/v1/subject-groups'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::index
* @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:12
* @route '/api/v1/subject-groups'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::index
* @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:12
* @route '/api/v1/subject-groups'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::store
* @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:30
* @route '/api/v1/subject-groups'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/subject-groups',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::store
* @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:30
* @route '/api/v1/subject-groups'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::store
* @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:30
* @route '/api/v1/subject-groups'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::show
* @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:41
* @route '/api/v1/subject-groups/{subject_group}'
*/
export const show = (args: { subject_group: string | number } | [subject_group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/subject-groups/{subject_group}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::show
* @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:41
* @route '/api/v1/subject-groups/{subject_group}'
*/
show.url = (args: { subject_group: string | number } | [subject_group: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subject_group: args }
    }

    if (Array.isArray(args)) {
        args = {
            subject_group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        subject_group: args.subject_group,
    }

    return show.definition.url
            .replace('{subject_group}', parsedArgs.subject_group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::show
* @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:41
* @route '/api/v1/subject-groups/{subject_group}'
*/
show.get = (args: { subject_group: string | number } | [subject_group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::show
* @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:41
* @route '/api/v1/subject-groups/{subject_group}'
*/
show.head = (args: { subject_group: string | number } | [subject_group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::update
* @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:46
* @route '/api/v1/subject-groups/{subject_group}'
*/
export const update = (args: { subject_group: string | number } | [subject_group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/subject-groups/{subject_group}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::update
* @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:46
* @route '/api/v1/subject-groups/{subject_group}'
*/
update.url = (args: { subject_group: string | number } | [subject_group: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subject_group: args }
    }

    if (Array.isArray(args)) {
        args = {
            subject_group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        subject_group: args.subject_group,
    }

    return update.definition.url
            .replace('{subject_group}', parsedArgs.subject_group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::update
* @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:46
* @route '/api/v1/subject-groups/{subject_group}'
*/
update.put = (args: { subject_group: string | number } | [subject_group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::update
* @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:46
* @route '/api/v1/subject-groups/{subject_group}'
*/
update.patch = (args: { subject_group: string | number } | [subject_group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::destroy
* @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:57
* @route '/api/v1/subject-groups/{subject_group}'
*/
export const destroy = (args: { subject_group: string | number } | [subject_group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/subject-groups/{subject_group}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::destroy
* @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:57
* @route '/api/v1/subject-groups/{subject_group}'
*/
destroy.url = (args: { subject_group: string | number } | [subject_group: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subject_group: args }
    }

    if (Array.isArray(args)) {
        args = {
            subject_group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        subject_group: args.subject_group,
    }

    return destroy.definition.url
            .replace('{subject_group}', parsedArgs.subject_group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::destroy
* @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:57
* @route '/api/v1/subject-groups/{subject_group}'
*/
destroy.delete = (args: { subject_group: string | number } | [subject_group: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const SubjectGroupController = { index, store, show, update, destroy }

export default SubjectGroupController