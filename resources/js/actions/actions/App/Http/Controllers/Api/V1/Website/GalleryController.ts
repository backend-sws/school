import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
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

const GalleryController = { index, bulkStore, bulkUpdate, store, show, update, destroy }

export default GalleryController