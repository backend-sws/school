import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Grievance\ContactController::store
 * @see app/Http/Controllers/Api/V1/Grievance/ContactController.php:75
 * @route '/api/v1/public/contact'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/public/contact',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Grievance\ContactController::store
 * @see app/Http/Controllers/Api/V1/Grievance/ContactController.php:75
 * @route '/api/v1/public/contact'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Grievance\ContactController::store
 * @see app/Http/Controllers/Api/V1/Grievance/ContactController.php:75
 * @route '/api/v1/public/contact'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Grievance\ContactController::store
 * @see app/Http/Controllers/Api/V1/Grievance/ContactController.php:75
 * @route '/api/v1/public/contact'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Grievance\ContactController::store
 * @see app/Http/Controllers/Api/V1/Grievance/ContactController.php:75
 * @route '/api/v1/public/contact'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Grievance\ContactController::index
 * @see app/Http/Controllers/Api/V1/Grievance/ContactController.php:37
 * @route '/api/v1/contacts'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/contacts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Grievance\ContactController::index
 * @see app/Http/Controllers/Api/V1/Grievance/ContactController.php:37
 * @route '/api/v1/contacts'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Grievance\ContactController::index
 * @see app/Http/Controllers/Api/V1/Grievance/ContactController.php:37
 * @route '/api/v1/contacts'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Grievance\ContactController::index
 * @see app/Http/Controllers/Api/V1/Grievance/ContactController.php:37
 * @route '/api/v1/contacts'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Grievance\ContactController::index
 * @see app/Http/Controllers/Api/V1/Grievance/ContactController.php:37
 * @route '/api/v1/contacts'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Grievance\ContactController::index
 * @see app/Http/Controllers/Api/V1/Grievance/ContactController.php:37
 * @route '/api/v1/contacts'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Grievance\ContactController::index
 * @see app/Http/Controllers/Api/V1/Grievance/ContactController.php:37
 * @route '/api/v1/contacts'
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
* @see \App\Http\Controllers\Api\V1\Grievance\ContactController::show
 * @see app/Http/Controllers/Api/V1/Grievance/ContactController.php:102
 * @route '/api/v1/contacts/{contact}'
 */
export const show = (args: { contact: string | number } | [contact: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/contacts/{contact}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Grievance\ContactController::show
 * @see app/Http/Controllers/Api/V1/Grievance/ContactController.php:102
 * @route '/api/v1/contacts/{contact}'
 */
show.url = (args: { contact: string | number } | [contact: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { contact: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    contact: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        contact: args.contact,
                }

    return show.definition.url
            .replace('{contact}', parsedArgs.contact.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Grievance\ContactController::show
 * @see app/Http/Controllers/Api/V1/Grievance/ContactController.php:102
 * @route '/api/v1/contacts/{contact}'
 */
show.get = (args: { contact: string | number } | [contact: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Grievance\ContactController::show
 * @see app/Http/Controllers/Api/V1/Grievance/ContactController.php:102
 * @route '/api/v1/contacts/{contact}'
 */
show.head = (args: { contact: string | number } | [contact: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Grievance\ContactController::show
 * @see app/Http/Controllers/Api/V1/Grievance/ContactController.php:102
 * @route '/api/v1/contacts/{contact}'
 */
    const showForm = (args: { contact: string | number } | [contact: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Grievance\ContactController::show
 * @see app/Http/Controllers/Api/V1/Grievance/ContactController.php:102
 * @route '/api/v1/contacts/{contact}'
 */
        showForm.get = (args: { contact: string | number } | [contact: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Grievance\ContactController::show
 * @see app/Http/Controllers/Api/V1/Grievance/ContactController.php:102
 * @route '/api/v1/contacts/{contact}'
 */
        showForm.head = (args: { contact: string | number } | [contact: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Grievance\ContactController::destroy
 * @see app/Http/Controllers/Api/V1/Grievance/ContactController.php:124
 * @route '/api/v1/contacts/{contact}'
 */
export const destroy = (args: { contact: string | number } | [contact: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/contacts/{contact}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Grievance\ContactController::destroy
 * @see app/Http/Controllers/Api/V1/Grievance/ContactController.php:124
 * @route '/api/v1/contacts/{contact}'
 */
destroy.url = (args: { contact: string | number } | [contact: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { contact: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    contact: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        contact: args.contact,
                }

    return destroy.definition.url
            .replace('{contact}', parsedArgs.contact.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Grievance\ContactController::destroy
 * @see app/Http/Controllers/Api/V1/Grievance/ContactController.php:124
 * @route '/api/v1/contacts/{contact}'
 */
destroy.delete = (args: { contact: string | number } | [contact: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Grievance\ContactController::destroy
 * @see app/Http/Controllers/Api/V1/Grievance/ContactController.php:124
 * @route '/api/v1/contacts/{contact}'
 */
    const destroyForm = (args: { contact: string | number } | [contact: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Grievance\ContactController::destroy
 * @see app/Http/Controllers/Api/V1/Grievance/ContactController.php:124
 * @route '/api/v1/contacts/{contact}'
 */
        destroyForm.delete = (args: { contact: string | number } | [contact: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ContactController = { store, index, show, destroy }

export default ContactController