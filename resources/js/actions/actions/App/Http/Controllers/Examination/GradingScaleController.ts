import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Examination\GradingScaleController::index
* @see app/Http/Controllers/Examination/GradingScaleController.php:13
* @route '/examination/grading-scales'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/examination/grading-scales',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::index
* @see app/Http/Controllers/Examination/GradingScaleController.php:13
* @route '/examination/grading-scales'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::index
* @see app/Http/Controllers/Examination/GradingScaleController.php:13
* @route '/examination/grading-scales'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::index
* @see app/Http/Controllers/Examination/GradingScaleController.php:13
* @route '/examination/grading-scales'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::create
* @see app/Http/Controllers/Examination/GradingScaleController.php:22
* @route '/examination/grading-scales/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/examination/grading-scales/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::create
* @see app/Http/Controllers/Examination/GradingScaleController.php:22
* @route '/examination/grading-scales/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::create
* @see app/Http/Controllers/Examination/GradingScaleController.php:22
* @route '/examination/grading-scales/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::create
* @see app/Http/Controllers/Examination/GradingScaleController.php:22
* @route '/examination/grading-scales/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::store
* @see app/Http/Controllers/Examination/GradingScaleController.php:27
* @route '/examination/grading-scales'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/examination/grading-scales',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::store
* @see app/Http/Controllers/Examination/GradingScaleController.php:27
* @route '/examination/grading-scales'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::store
* @see app/Http/Controllers/Examination/GradingScaleController.php:27
* @route '/examination/grading-scales'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::edit
* @see app/Http/Controllers/Examination/GradingScaleController.php:53
* @route '/examination/grading-scales/{scale}/edit'
*/
export const edit = (args: { scale: number | { id: number } } | [scale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/examination/grading-scales/{scale}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::edit
* @see app/Http/Controllers/Examination/GradingScaleController.php:53
* @route '/examination/grading-scales/{scale}/edit'
*/
edit.url = (args: { scale: number | { id: number } } | [scale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { scale: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { scale: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            scale: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        scale: typeof args.scale === 'object'
        ? args.scale.id
        : args.scale,
    }

    return edit.definition.url
            .replace('{scale}', parsedArgs.scale.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::edit
* @see app/Http/Controllers/Examination/GradingScaleController.php:53
* @route '/examination/grading-scales/{scale}/edit'
*/
edit.get = (args: { scale: number | { id: number } } | [scale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::edit
* @see app/Http/Controllers/Examination/GradingScaleController.php:53
* @route '/examination/grading-scales/{scale}/edit'
*/
edit.head = (args: { scale: number | { id: number } } | [scale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::update
* @see app/Http/Controllers/Examination/GradingScaleController.php:59
* @route '/examination/grading-scales/{scale}'
*/
export const update = (args: { scale: number | { id: number } } | [scale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/examination/grading-scales/{scale}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::update
* @see app/Http/Controllers/Examination/GradingScaleController.php:59
* @route '/examination/grading-scales/{scale}'
*/
update.url = (args: { scale: number | { id: number } } | [scale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { scale: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { scale: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            scale: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        scale: typeof args.scale === 'object'
        ? args.scale.id
        : args.scale,
    }

    return update.definition.url
            .replace('{scale}', parsedArgs.scale.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::update
* @see app/Http/Controllers/Examination/GradingScaleController.php:59
* @route '/examination/grading-scales/{scale}'
*/
update.put = (args: { scale: number | { id: number } } | [scale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::destroy
* @see app/Http/Controllers/Examination/GradingScaleController.php:96
* @route '/examination/grading-scales/{scale}'
*/
export const destroy = (args: { scale: number | { id: number } } | [scale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/examination/grading-scales/{scale}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::destroy
* @see app/Http/Controllers/Examination/GradingScaleController.php:96
* @route '/examination/grading-scales/{scale}'
*/
destroy.url = (args: { scale: number | { id: number } } | [scale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { scale: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { scale: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            scale: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        scale: typeof args.scale === 'object'
        ? args.scale.id
        : args.scale,
    }

    return destroy.definition.url
            .replace('{scale}', parsedArgs.scale.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\GradingScaleController::destroy
* @see app/Http/Controllers/Examination/GradingScaleController.php:96
* @route '/examination/grading-scales/{scale}'
*/
destroy.delete = (args: { scale: number | { id: number } } | [scale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const GradingScaleController = { index, create, store, edit, update, destroy }

export default GradingScaleController