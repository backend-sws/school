import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::index
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:12
 * @route '/api/v1/library/books'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/library/books',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::index
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:12
 * @route '/api/v1/library/books'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::index
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:12
 * @route '/api/v1/library/books'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::index
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:12
 * @route '/api/v1/library/books'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::index
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:12
 * @route '/api/v1/library/books'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::index
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:12
 * @route '/api/v1/library/books'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::index
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:12
 * @route '/api/v1/library/books'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::store
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:39
 * @route '/api/v1/library/books'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/library/books',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::store
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:39
 * @route '/api/v1/library/books'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::store
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:39
 * @route '/api/v1/library/books'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::store
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:39
 * @route '/api/v1/library/books'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::store
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:39
 * @route '/api/v1/library/books'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::show
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:60
 * @route '/api/v1/library/books/{library_book}'
 */
export const show = (args: { library_book: number | { id: number } } | [library_book: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/library/books/{library_book}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::show
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:60
 * @route '/api/v1/library/books/{library_book}'
 */
show.url = (args: { library_book: number | { id: number } } | [library_book: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { library_book: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { library_book: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    library_book: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        library_book: typeof args.library_book === 'object'
                ? args.library_book.id
                : args.library_book,
                }

    return show.definition.url
            .replace('{library_book}', parsedArgs.library_book.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::show
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:60
 * @route '/api/v1/library/books/{library_book}'
 */
show.get = (args: { library_book: number | { id: number } } | [library_book: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::show
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:60
 * @route '/api/v1/library/books/{library_book}'
 */
show.head = (args: { library_book: number | { id: number } } | [library_book: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::show
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:60
 * @route '/api/v1/library/books/{library_book}'
 */
    const showForm = (args: { library_book: number | { id: number } } | [library_book: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::show
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:60
 * @route '/api/v1/library/books/{library_book}'
 */
        showForm.get = (args: { library_book: number | { id: number } } | [library_book: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::show
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:60
 * @route '/api/v1/library/books/{library_book}'
 */
        showForm.head = (args: { library_book: number | { id: number } } | [library_book: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::update
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:69
 * @route '/api/v1/library/books/{library_book}'
 */
export const update = (args: { library_book: number | { id: number } } | [library_book: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/library/books/{library_book}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::update
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:69
 * @route '/api/v1/library/books/{library_book}'
 */
update.url = (args: { library_book: number | { id: number } } | [library_book: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { library_book: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { library_book: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    library_book: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        library_book: typeof args.library_book === 'object'
                ? args.library_book.id
                : args.library_book,
                }

    return update.definition.url
            .replace('{library_book}', parsedArgs.library_book.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::update
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:69
 * @route '/api/v1/library/books/{library_book}'
 */
update.put = (args: { library_book: number | { id: number } } | [library_book: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::update
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:69
 * @route '/api/v1/library/books/{library_book}'
 */
update.patch = (args: { library_book: number | { id: number } } | [library_book: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::update
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:69
 * @route '/api/v1/library/books/{library_book}'
 */
    const updateForm = (args: { library_book: number | { id: number } } | [library_book: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::update
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:69
 * @route '/api/v1/library/books/{library_book}'
 */
        updateForm.put = (args: { library_book: number | { id: number } } | [library_book: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::update
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:69
 * @route '/api/v1/library/books/{library_book}'
 */
        updateForm.patch = (args: { library_book: number | { id: number } } | [library_book: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::destroy
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:88
 * @route '/api/v1/library/books/{library_book}'
 */
export const destroy = (args: { library_book: number | { id: number } } | [library_book: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/library/books/{library_book}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::destroy
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:88
 * @route '/api/v1/library/books/{library_book}'
 */
destroy.url = (args: { library_book: number | { id: number } } | [library_book: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { library_book: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { library_book: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    library_book: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        library_book: typeof args.library_book === 'object'
                ? args.library_book.id
                : args.library_book,
                }

    return destroy.definition.url
            .replace('{library_book}', parsedArgs.library_book.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::destroy
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:88
 * @route '/api/v1/library/books/{library_book}'
 */
destroy.delete = (args: { library_book: number | { id: number } } | [library_book: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::destroy
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:88
 * @route '/api/v1/library/books/{library_book}'
 */
    const destroyForm = (args: { library_book: number | { id: number } } | [library_book: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryBookController::destroy
 * @see app/Http/Controllers/Api/V1/Library/LibraryBookController.php:88
 * @route '/api/v1/library/books/{library_book}'
 */
        destroyForm.delete = (args: { library_book: number | { id: number } } | [library_book: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const books = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default books