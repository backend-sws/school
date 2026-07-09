import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::index
* @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:15
* @route '/api/v1/library/issues'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/library/issues',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::index
* @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:15
* @route '/api/v1/library/issues'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::index
* @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:15
* @route '/api/v1/library/issues'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::index
* @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:15
* @route '/api/v1/library/issues'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::store
* @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:47
* @route '/api/v1/library/issues'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/library/issues',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::store
* @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:47
* @route '/api/v1/library/issues'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::store
* @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:47
* @route '/api/v1/library/issues'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::show
* @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:87
* @route '/api/v1/library/issues/{library_issue}'
*/
export const show = (args: { library_issue: number | { id: number } } | [library_issue: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/library/issues/{library_issue}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::show
* @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:87
* @route '/api/v1/library/issues/{library_issue}'
*/
show.url = (args: { library_issue: number | { id: number } } | [library_issue: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { library_issue: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { library_issue: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            library_issue: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        library_issue: typeof args.library_issue === 'object'
        ? args.library_issue.id
        : args.library_issue,
    }

    return show.definition.url
            .replace('{library_issue}', parsedArgs.library_issue.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::show
* @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:87
* @route '/api/v1/library/issues/{library_issue}'
*/
show.get = (args: { library_issue: number | { id: number } } | [library_issue: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::show
* @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:87
* @route '/api/v1/library/issues/{library_issue}'
*/
show.head = (args: { library_issue: number | { id: number } } | [library_issue: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::update
* @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:96
* @route '/api/v1/library/issues/{library_issue}'
*/
export const update = (args: { library_issue: number | { id: number } } | [library_issue: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/library/issues/{library_issue}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::update
* @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:96
* @route '/api/v1/library/issues/{library_issue}'
*/
update.url = (args: { library_issue: number | { id: number } } | [library_issue: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { library_issue: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { library_issue: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            library_issue: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        library_issue: typeof args.library_issue === 'object'
        ? args.library_issue.id
        : args.library_issue,
    }

    return update.definition.url
            .replace('{library_issue}', parsedArgs.library_issue.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::update
* @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:96
* @route '/api/v1/library/issues/{library_issue}'
*/
update.put = (args: { library_issue: number | { id: number } } | [library_issue: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::update
* @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:96
* @route '/api/v1/library/issues/{library_issue}'
*/
update.patch = (args: { library_issue: number | { id: number } } | [library_issue: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::destroy
* @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:0
* @route '/api/v1/library/issues/{library_issue}'
*/
export const destroy = (args: { library_issue: string | number } | [library_issue: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/library/issues/{library_issue}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::destroy
* @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:0
* @route '/api/v1/library/issues/{library_issue}'
*/
destroy.url = (args: { library_issue: string | number } | [library_issue: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { library_issue: args }
    }

    if (Array.isArray(args)) {
        args = {
            library_issue: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        library_issue: args.library_issue,
    }

    return destroy.definition.url
            .replace('{library_issue}', parsedArgs.library_issue.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::destroy
* @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:0
* @route '/api/v1/library/issues/{library_issue}'
*/
destroy.delete = (args: { library_issue: string | number } | [library_issue: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::returnBook
* @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:126
* @route '/api/v1/library/issues/{library_issue}/return'
*/
export const returnBook = (args: { library_issue: number | { id: number } } | [library_issue: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: returnBook.url(args, options),
    method: 'post',
})

returnBook.definition = {
    methods: ["post"],
    url: '/api/v1/library/issues/{library_issue}/return',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::returnBook
* @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:126
* @route '/api/v1/library/issues/{library_issue}/return'
*/
returnBook.url = (args: { library_issue: number | { id: number } } | [library_issue: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { library_issue: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { library_issue: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            library_issue: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        library_issue: typeof args.library_issue === 'object'
        ? args.library_issue.id
        : args.library_issue,
    }

    return returnBook.definition.url
            .replace('{library_issue}', parsedArgs.library_issue.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::returnBook
* @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:126
* @route '/api/v1/library/issues/{library_issue}/return'
*/
returnBook.post = (args: { library_issue: number | { id: number } } | [library_issue: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: returnBook.url(args, options),
    method: 'post',
})

const LibraryIssueController = { index, store, show, update, destroy, returnBook }

export default LibraryIssueController