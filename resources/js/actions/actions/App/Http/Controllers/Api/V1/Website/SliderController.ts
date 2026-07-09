import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::publicIndex
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:38
* @route '/api/v1/public/sliders'
*/
export const publicIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: publicIndex.url(options),
    method: 'get',
})

publicIndex.definition = {
    methods: ["get","head"],
    url: '/api/v1/public/sliders',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::publicIndex
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:38
* @route '/api/v1/public/sliders'
*/
publicIndex.url = (options?: RouteQueryOptions) => {
    return publicIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::publicIndex
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:38
* @route '/api/v1/public/sliders'
*/
publicIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: publicIndex.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::publicIndex
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:38
* @route '/api/v1/public/sliders'
*/
publicIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: publicIndex.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::toggleStatus
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:177
* @route '/api/v1/website/sliders/{slider}/toggle-status'
*/
export const toggleStatus = (args: { slider: number | { id: number } } | [slider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

toggleStatus.definition = {
    methods: ["patch"],
    url: '/api/v1/website/sliders/{slider}/toggle-status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::toggleStatus
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:177
* @route '/api/v1/website/sliders/{slider}/toggle-status'
*/
toggleStatus.url = (args: { slider: number | { id: number } } | [slider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { slider: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { slider: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            slider: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slider: typeof args.slider === 'object'
        ? args.slider.id
        : args.slider,
    }

    return toggleStatus.definition.url
            .replace('{slider}', parsedArgs.slider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::toggleStatus
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:177
* @route '/api/v1/website/sliders/{slider}/toggle-status'
*/
toggleStatus.patch = (args: { slider: number | { id: number } } | [slider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::index
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:201
* @route '/api/v1/website/sliders'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/website/sliders',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::index
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:201
* @route '/api/v1/website/sliders'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::index
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:201
* @route '/api/v1/website/sliders'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::index
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:201
* @route '/api/v1/website/sliders'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::store
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:71
* @route '/api/v1/website/sliders'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/website/sliders',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::store
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:71
* @route '/api/v1/website/sliders'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::store
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:71
* @route '/api/v1/website/sliders'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::show
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:113
* @route '/api/v1/website/sliders/{slider}'
*/
export const show = (args: { slider: number | { id: number } } | [slider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/website/sliders/{slider}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::show
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:113
* @route '/api/v1/website/sliders/{slider}'
*/
show.url = (args: { slider: number | { id: number } } | [slider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { slider: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { slider: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            slider: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slider: typeof args.slider === 'object'
        ? args.slider.id
        : args.slider,
    }

    return show.definition.url
            .replace('{slider}', parsedArgs.slider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::show
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:113
* @route '/api/v1/website/sliders/{slider}'
*/
show.get = (args: { slider: number | { id: number } } | [slider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::show
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:113
* @route '/api/v1/website/sliders/{slider}'
*/
show.head = (args: { slider: number | { id: number } } | [slider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::update
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:129
* @route '/api/v1/website/sliders/{slider}'
*/
export const update = (args: { slider: number | { id: number } } | [slider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/website/sliders/{slider}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::update
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:129
* @route '/api/v1/website/sliders/{slider}'
*/
update.url = (args: { slider: number | { id: number } } | [slider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { slider: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { slider: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            slider: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slider: typeof args.slider === 'object'
        ? args.slider.id
        : args.slider,
    }

    return update.definition.url
            .replace('{slider}', parsedArgs.slider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::update
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:129
* @route '/api/v1/website/sliders/{slider}'
*/
update.put = (args: { slider: number | { id: number } } | [slider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::update
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:129
* @route '/api/v1/website/sliders/{slider}'
*/
update.patch = (args: { slider: number | { id: number } } | [slider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::destroy
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:161
* @route '/api/v1/website/sliders/{slider}'
*/
export const destroy = (args: { slider: number | { id: number } } | [slider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/website/sliders/{slider}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::destroy
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:161
* @route '/api/v1/website/sliders/{slider}'
*/
destroy.url = (args: { slider: number | { id: number } } | [slider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { slider: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { slider: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            slider: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slider: typeof args.slider === 'object'
        ? args.slider.id
        : args.slider,
    }

    return destroy.definition.url
            .replace('{slider}', parsedArgs.slider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Website\SliderController::destroy
* @see app/Http/Controllers/Api/V1/Website/SliderController.php:161
* @route '/api/v1/website/sliders/{slider}'
*/
destroy.delete = (args: { slider: number | { id: number } } | [slider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const SliderController = { publicIndex, toggleStatus, index, store, show, update, destroy }

export default SliderController