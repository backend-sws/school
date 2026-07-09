import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::index
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:275
 * @route '/api/v1/public/galleries'
 */
const index1f96404ba317b769b7b60ebe522483f9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index1f96404ba317b769b7b60ebe522483f9.url(options),
    method: 'get',
})

index1f96404ba317b769b7b60ebe522483f9.definition = {
    methods: ["get","head"],
    url: '/api/v1/public/galleries',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::index
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:275
 * @route '/api/v1/public/galleries'
 */
index1f96404ba317b769b7b60ebe522483f9.url = (options?: RouteQueryOptions) => {
    return index1f96404ba317b769b7b60ebe522483f9.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::index
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:275
 * @route '/api/v1/public/galleries'
 */
index1f96404ba317b769b7b60ebe522483f9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index1f96404ba317b769b7b60ebe522483f9.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::index
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:275
 * @route '/api/v1/public/galleries'
 */
index1f96404ba317b769b7b60ebe522483f9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index1f96404ba317b769b7b60ebe522483f9.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::index
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:275
 * @route '/api/v1/public/galleries'
 */
    const index1f96404ba317b769b7b60ebe522483f9Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index1f96404ba317b769b7b60ebe522483f9.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::index
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:275
 * @route '/api/v1/public/galleries'
 */
        index1f96404ba317b769b7b60ebe522483f9Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index1f96404ba317b769b7b60ebe522483f9.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::index
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:275
 * @route '/api/v1/public/galleries'
 */
        index1f96404ba317b769b7b60ebe522483f9Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index1f96404ba317b769b7b60ebe522483f9.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index1f96404ba317b769b7b60ebe522483f9.form = index1f96404ba317b769b7b60ebe522483f9Form
    /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::index
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:275
 * @route '/api/v1/website/galleries'
 */
const index099e16fa76251d657ad6644519de66e9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index099e16fa76251d657ad6644519de66e9.url(options),
    method: 'get',
})

index099e16fa76251d657ad6644519de66e9.definition = {
    methods: ["get","head"],
    url: '/api/v1/website/galleries',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::index
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:275
 * @route '/api/v1/website/galleries'
 */
index099e16fa76251d657ad6644519de66e9.url = (options?: RouteQueryOptions) => {
    return index099e16fa76251d657ad6644519de66e9.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::index
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:275
 * @route '/api/v1/website/galleries'
 */
index099e16fa76251d657ad6644519de66e9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index099e16fa76251d657ad6644519de66e9.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::index
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:275
 * @route '/api/v1/website/galleries'
 */
index099e16fa76251d657ad6644519de66e9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index099e16fa76251d657ad6644519de66e9.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::index
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:275
 * @route '/api/v1/website/galleries'
 */
    const index099e16fa76251d657ad6644519de66e9Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index099e16fa76251d657ad6644519de66e9.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::index
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:275
 * @route '/api/v1/website/galleries'
 */
        index099e16fa76251d657ad6644519de66e9Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index099e16fa76251d657ad6644519de66e9.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::index
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:275
 * @route '/api/v1/website/galleries'
 */
        index099e16fa76251d657ad6644519de66e9Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index099e16fa76251d657ad6644519de66e9.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index099e16fa76251d657ad6644519de66e9.form = index099e16fa76251d657ad6644519de66e9Form

export const index = {
    '/api/v1/public/galleries': index1f96404ba317b769b7b60ebe522483f9,
    '/api/v1/website/galleries': index099e16fa76251d657ad6644519de66e9,
}

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::bulkStore
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:175
 * @route '/api/v1/website/galleries/bulk-store'
 */
export const bulkStore = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkStore.url(options),
    method: 'post',
})

bulkStore.definition = {
    methods: ["post"],
    url: '/api/v1/website/galleries/bulk-store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::bulkStore
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:175
 * @route '/api/v1/website/galleries/bulk-store'
 */
bulkStore.url = (options?: RouteQueryOptions) => {
    return bulkStore.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::bulkStore
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:175
 * @route '/api/v1/website/galleries/bulk-store'
 */
bulkStore.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkStore.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::bulkStore
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:175
 * @route '/api/v1/website/galleries/bulk-store'
 */
    const bulkStoreForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulkStore.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::bulkStore
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:175
 * @route '/api/v1/website/galleries/bulk-store'
 */
        bulkStoreForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulkStore.url(options),
            method: 'post',
        })
    
    bulkStore.form = bulkStoreForm
/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::bulkUpdate
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:226
 * @route '/api/v1/website/galleries/{id}/bulk-update'
 */
export const bulkUpdate = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: bulkUpdate.url(args, options),
    method: 'put',
})

bulkUpdate.definition = {
    methods: ["put"],
    url: '/api/v1/website/galleries/{id}/bulk-update',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::bulkUpdate
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:226
 * @route '/api/v1/website/galleries/{id}/bulk-update'
 */
bulkUpdate.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return bulkUpdate.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::bulkUpdate
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:226
 * @route '/api/v1/website/galleries/{id}/bulk-update'
 */
bulkUpdate.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: bulkUpdate.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::bulkUpdate
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:226
 * @route '/api/v1/website/galleries/{id}/bulk-update'
 */
    const bulkUpdateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulkUpdate.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::bulkUpdate
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:226
 * @route '/api/v1/website/galleries/{id}/bulk-update'
 */
        bulkUpdateForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulkUpdate.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    bulkUpdate.form = bulkUpdateForm
/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::store
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:55
 * @route '/api/v1/website/galleries'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/website/galleries',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::store
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:55
 * @route '/api/v1/website/galleries'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::store
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:55
 * @route '/api/v1/website/galleries'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::store
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:55
 * @route '/api/v1/website/galleries'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::store
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:55
 * @route '/api/v1/website/galleries'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::show
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:77
 * @route '/api/v1/website/galleries/{gallery}'
 */
export const show = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/website/galleries/{gallery}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::show
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:77
 * @route '/api/v1/website/galleries/{gallery}'
 */
show.url = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { gallery: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    gallery: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        gallery: args.gallery,
                }

    return show.definition.url
            .replace('{gallery}', parsedArgs.gallery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::show
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:77
 * @route '/api/v1/website/galleries/{gallery}'
 */
show.get = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::show
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:77
 * @route '/api/v1/website/galleries/{gallery}'
 */
show.head = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::show
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:77
 * @route '/api/v1/website/galleries/{gallery}'
 */
    const showForm = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::show
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:77
 * @route '/api/v1/website/galleries/{gallery}'
 */
        showForm.get = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::show
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:77
 * @route '/api/v1/website/galleries/{gallery}'
 */
        showForm.head = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::update
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:112
 * @route '/api/v1/website/galleries/{gallery}'
 */
export const update = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/website/galleries/{gallery}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::update
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:112
 * @route '/api/v1/website/galleries/{gallery}'
 */
update.url = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { gallery: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    gallery: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        gallery: args.gallery,
                }

    return update.definition.url
            .replace('{gallery}', parsedArgs.gallery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::update
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:112
 * @route '/api/v1/website/galleries/{gallery}'
 */
update.put = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::update
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:112
 * @route '/api/v1/website/galleries/{gallery}'
 */
update.patch = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::update
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:112
 * @route '/api/v1/website/galleries/{gallery}'
 */
    const updateForm = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::update
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:112
 * @route '/api/v1/website/galleries/{gallery}'
 */
        updateForm.put = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::update
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:112
 * @route '/api/v1/website/galleries/{gallery}'
 */
        updateForm.patch = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::destroy
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:140
 * @route '/api/v1/website/galleries/{gallery}'
 */
export const destroy = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/website/galleries/{gallery}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::destroy
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:140
 * @route '/api/v1/website/galleries/{gallery}'
 */
destroy.url = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { gallery: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    gallery: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        gallery: args.gallery,
                }

    return destroy.definition.url
            .replace('{gallery}', parsedArgs.gallery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::destroy
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:140
 * @route '/api/v1/website/galleries/{gallery}'
 */
destroy.delete = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::destroy
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:140
 * @route '/api/v1/website/galleries/{gallery}'
 */
    const destroyForm = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryController::destroy
 * @see app/Http/Controllers/Api/V1/Website/GalleryController.php:140
 * @route '/api/v1/website/galleries/{gallery}'
 */
        destroyForm.delete = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const GalleryController = { index, bulkStore, bulkUpdate, store, show, update, destroy }

export default GalleryController