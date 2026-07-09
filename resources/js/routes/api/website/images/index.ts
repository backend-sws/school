import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::show
 * @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:0
 * @route '/api/v1/website/galleries/images/{image}'
 */
    const showForm = (args: { image: string | number } | [image: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::show
 * @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:0
 * @route '/api/v1/website/galleries/images/{image}'
 */
        showForm.get = (args: { image: string | number } | [image: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::show
 * @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:0
 * @route '/api/v1/website/galleries/images/{image}'
 */
        showForm.head = (args: { image: string | number } | [image: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::update
 * @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:0
 * @route '/api/v1/website/galleries/images/{image}'
 */
    const updateForm = (args: { image: string | number } | [image: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::update
 * @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:0
 * @route '/api/v1/website/galleries/images/{image}'
 */
        updateForm.put = (args: { image: string | number } | [image: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::update
 * @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:0
 * @route '/api/v1/website/galleries/images/{image}'
 */
        updateForm.patch = (args: { image: string | number } | [image: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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

    /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::destroy
 * @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:74
 * @route '/api/v1/website/galleries/images/{image}'
 */
    const destroyForm = (args: { image: string | number } | [image: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Website\GalleryImageController::destroy
 * @see app/Http/Controllers/Api/V1/Website/GalleryImageController.php:74
 * @route '/api/v1/website/galleries/images/{image}'
 */
        destroyForm.delete = (args: { image: string | number } | [image: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const images = {
    show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default images