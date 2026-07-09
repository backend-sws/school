import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryMappingController::index
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryMappingController.php:29
* @route '/api/v1/subject-category-mappings'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/subject-category-mappings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryMappingController::index
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryMappingController.php:29
* @route '/api/v1/subject-category-mappings'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryMappingController::index
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryMappingController.php:29
* @route '/api/v1/subject-category-mappings'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryMappingController::index
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryMappingController.php:29
* @route '/api/v1/subject-category-mappings'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryMappingController::store
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryMappingController.php:83
* @route '/api/v1/subject-category-mappings'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/subject-category-mappings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryMappingController::store
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryMappingController.php:83
* @route '/api/v1/subject-category-mappings'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryMappingController::store
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryMappingController.php:83
* @route '/api/v1/subject-category-mappings'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryMappingController::show
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryMappingController.php:126
* @route '/api/v1/subject-category-mappings/{subject_category_mapping}'
*/
export const show = (args: { subject_category_mapping: string | number } | [subject_category_mapping: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/subject-category-mappings/{subject_category_mapping}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryMappingController::show
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryMappingController.php:126
* @route '/api/v1/subject-category-mappings/{subject_category_mapping}'
*/
show.url = (args: { subject_category_mapping: string | number } | [subject_category_mapping: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subject_category_mapping: args }
    }

    if (Array.isArray(args)) {
        args = {
            subject_category_mapping: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        subject_category_mapping: args.subject_category_mapping,
    }

    return show.definition.url
            .replace('{subject_category_mapping}', parsedArgs.subject_category_mapping.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryMappingController::show
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryMappingController.php:126
* @route '/api/v1/subject-category-mappings/{subject_category_mapping}'
*/
show.get = (args: { subject_category_mapping: string | number } | [subject_category_mapping: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryMappingController::show
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryMappingController.php:126
* @route '/api/v1/subject-category-mappings/{subject_category_mapping}'
*/
show.head = (args: { subject_category_mapping: string | number } | [subject_category_mapping: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryMappingController::update
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryMappingController.php:175
* @route '/api/v1/subject-category-mappings/{subject_category_mapping}'
*/
export const update = (args: { subject_category_mapping: string | number } | [subject_category_mapping: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/subject-category-mappings/{subject_category_mapping}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryMappingController::update
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryMappingController.php:175
* @route '/api/v1/subject-category-mappings/{subject_category_mapping}'
*/
update.url = (args: { subject_category_mapping: string | number } | [subject_category_mapping: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subject_category_mapping: args }
    }

    if (Array.isArray(args)) {
        args = {
            subject_category_mapping: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        subject_category_mapping: args.subject_category_mapping,
    }

    return update.definition.url
            .replace('{subject_category_mapping}', parsedArgs.subject_category_mapping.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryMappingController::update
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryMappingController.php:175
* @route '/api/v1/subject-category-mappings/{subject_category_mapping}'
*/
update.put = (args: { subject_category_mapping: string | number } | [subject_category_mapping: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryMappingController::update
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryMappingController.php:175
* @route '/api/v1/subject-category-mappings/{subject_category_mapping}'
*/
update.patch = (args: { subject_category_mapping: string | number } | [subject_category_mapping: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryMappingController::destroy
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryMappingController.php:205
* @route '/api/v1/subject-category-mappings/{subject_category_mapping}'
*/
export const destroy = (args: { subject_category_mapping: string | number } | [subject_category_mapping: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/subject-category-mappings/{subject_category_mapping}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryMappingController::destroy
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryMappingController.php:205
* @route '/api/v1/subject-category-mappings/{subject_category_mapping}'
*/
destroy.url = (args: { subject_category_mapping: string | number } | [subject_category_mapping: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subject_category_mapping: args }
    }

    if (Array.isArray(args)) {
        args = {
            subject_category_mapping: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        subject_category_mapping: args.subject_category_mapping,
    }

    return destroy.definition.url
            .replace('{subject_category_mapping}', parsedArgs.subject_category_mapping.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryMappingController::destroy
* @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryMappingController.php:205
* @route '/api/v1/subject-category-mappings/{subject_category_mapping}'
*/
destroy.delete = (args: { subject_category_mapping: string | number } | [subject_category_mapping: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const SubjectCategoryMappingController = { index, store, show, update, destroy }

export default SubjectCategoryMappingController