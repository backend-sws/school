import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::index
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:30
* @route '/api/v1/subject-categories'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/subject-categories',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::index
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:30
* @route '/api/v1/subject-categories'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::index
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:30
* @route '/api/v1/subject-categories'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::index
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:30
* @route '/api/v1/subject-categories'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::store
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:76
* @route '/api/v1/subject-categories'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/subject-categories',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::store
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:76
* @route '/api/v1/subject-categories'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::store
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:76
* @route '/api/v1/subject-categories'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::show
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:98
* @route '/api/v1/subject-categories/{subject_category}'
*/
export const show = (args: { subject_category: string | number } | [subject_category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/subject-categories/{subject_category}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::show
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:98
* @route '/api/v1/subject-categories/{subject_category}'
*/
show.url = (args: { subject_category: string | number } | [subject_category: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subject_category: args }
    }

    if (Array.isArray(args)) {
        args = {
            subject_category: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        subject_category: args.subject_category,
    }

    return show.definition.url
            .replace('{subject_category}', parsedArgs.subject_category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::show
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:98
* @route '/api/v1/subject-categories/{subject_category}'
*/
show.get = (args: { subject_category: string | number } | [subject_category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::show
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:98
* @route '/api/v1/subject-categories/{subject_category}'
*/
show.head = (args: { subject_category: string | number } | [subject_category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::update
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:128
* @route '/api/v1/subject-categories/{subject_category}'
*/
export const update = (args: { subject_category: string | number } | [subject_category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/subject-categories/{subject_category}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::update
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:128
* @route '/api/v1/subject-categories/{subject_category}'
*/
update.url = (args: { subject_category: string | number } | [subject_category: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subject_category: args }
    }

    if (Array.isArray(args)) {
        args = {
            subject_category: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        subject_category: args.subject_category,
    }

    return update.definition.url
            .replace('{subject_category}', parsedArgs.subject_category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::update
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:128
* @route '/api/v1/subject-categories/{subject_category}'
*/
update.put = (args: { subject_category: string | number } | [subject_category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::update
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:128
* @route '/api/v1/subject-categories/{subject_category}'
*/
update.patch = (args: { subject_category: string | number } | [subject_category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::destroy
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:151
* @route '/api/v1/subject-categories/{subject_category}'
*/
export const destroy = (args: { subject_category: string | number } | [subject_category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/subject-categories/{subject_category}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::destroy
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:151
* @route '/api/v1/subject-categories/{subject_category}'
*/
destroy.url = (args: { subject_category: string | number } | [subject_category: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subject_category: args }
    }

    if (Array.isArray(args)) {
        args = {
            subject_category: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        subject_category: args.subject_category,
    }

    return destroy.definition.url
            .replace('{subject_category}', parsedArgs.subject_category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::destroy
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:151
* @route '/api/v1/subject-categories/{subject_category}'
*/
destroy.delete = (args: { subject_category: string | number } | [subject_category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const SubjectCategoryController = { index, store, show, update, destroy }

export default SubjectCategoryController