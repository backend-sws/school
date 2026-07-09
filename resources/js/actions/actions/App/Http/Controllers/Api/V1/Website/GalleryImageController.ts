import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::updateSorting
* @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:99
* @route '/api/v1/website/gallery-images/sort'
*/
export const updateSorting = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateSorting.url(options),
    method: 'patch',
})

updateSorting.definition = {
    methods: ["patch"],
    url: '/api/v1/website/gallery-images/sort',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::updateSorting
* @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:99
* @route '/api/v1/website/gallery-images/sort'
*/
updateSorting.url = (options?: RouteQueryOptions) => {
    return updateSorting.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::updateSorting
* @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:99
* @route '/api/v1/website/gallery-images/sort'
*/
updateSorting.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateSorting.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::index
* @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:22
* @route '/api/v1/website/galleries/{gallery}/images'
*/
export const index = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/website/galleries/{gallery}/images',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::index
* @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:22
* @route '/api/v1/website/galleries/{gallery}/images'
*/
index.url = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{gallery}', parsedArgs.gallery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::index
* @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:22
* @route '/api/v1/website/galleries/{gallery}/images'
*/
index.get = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::index
* @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:22
* @route '/api/v1/website/galleries/{gallery}/images'
*/
index.head = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::store
* @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:48
* @route '/api/v1/website/galleries/{gallery}/images'
*/
export const store = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/website/galleries/{gallery}/images',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::store
* @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:48
* @route '/api/v1/website/galleries/{gallery}/images'
*/
store.url = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{gallery}', parsedArgs.gallery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::store
* @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:48
* @route '/api/v1/website/galleries/{gallery}/images'
*/
store.post = (args: { gallery: string | number } | [gallery: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::show
* @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:0
* @route '/api/v1/website/galleries/images/{image}'
*/
export const show = (args: { image: string | number } | [image: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/website/galleries/images/{image}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::show
* @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:0
* @route '/api/v1/website/galleries/images/{image}'
*/
show.url = (args: { image: string | number } | [image: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { image: args }
    }

    if (Array.isArray(args)) {
        args = {
            image: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        image: args.image,
    }

    return show.definition.url
            .replace('{image}', parsedArgs.image.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::show
* @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:0
* @route '/api/v1/website/galleries/images/{image}'
*/
show.get = (args: { image: string | number } | [image: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::show
* @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:0
* @route '/api/v1/website/galleries/images/{image}'
*/
show.head = (args: { image: string | number } | [image: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::update
* @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:0
* @route '/api/v1/website/galleries/images/{image}'
*/
export const update = (args: { image: string | number } | [image: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/website/galleries/images/{image}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::update
* @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:0
* @route '/api/v1/website/galleries/images/{image}'
*/
update.url = (args: { image: string | number } | [image: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { image: args }
    }

    if (Array.isArray(args)) {
        args = {
            image: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        image: args.image,
    }

    return update.definition.url
            .replace('{image}', parsedArgs.image.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::update
* @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:0
* @route '/api/v1/website/galleries/images/{image}'
*/
update.put = (args: { image: string | number } | [image: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::update
* @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:0
* @route '/api/v1/website/galleries/images/{image}'
*/
update.patch = (args: { image: string | number } | [image: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::destroy
* @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:74
* @route '/api/v1/website/galleries/images/{image}'
*/
export const destroy = (args: { image: string | number } | [image: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/website/galleries/images/{image}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::destroy
* @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:74
* @route '/api/v1/website/galleries/images/{image}'
*/
destroy.url = (args: { image: string | number } | [image: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { image: args }
    }

    if (Array.isArray(args)) {
        args = {
            image: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        image: args.image,
    }

    return destroy.definition.url
            .replace('{image}', parsedArgs.image.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::destroy
* @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:74
* @route '/api/v1/website/galleries/images/{image}'
*/
destroy.delete = (args: { image: string | number } | [image: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const GalleryImageController = { updateSorting, index, store, show, update, destroy }

export default GalleryImageController