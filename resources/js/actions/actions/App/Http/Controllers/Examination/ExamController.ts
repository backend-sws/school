import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Examination\ExamController::index
* @see app/Http/Controllers/Examination/ExamController.php:14
* @route '/examination/exams'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/examination/exams',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Examination\ExamController::index
* @see app/Http/Controllers/Examination/ExamController.php:14
* @route '/examination/exams'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\ExamController::index
* @see app/Http/Controllers/Examination/ExamController.php:14
* @route '/examination/exams'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Examination\ExamController::index
* @see app/Http/Controllers/Examination/ExamController.php:14
* @route '/examination/exams'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Examination\ExamController::create
* @see app/Http/Controllers/Examination/ExamController.php:20
* @route '/examination/exams/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/examination/exams/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Examination\ExamController::create
* @see app/Http/Controllers/Examination/ExamController.php:20
* @route '/examination/exams/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\ExamController::create
* @see app/Http/Controllers/Examination/ExamController.php:20
* @route '/examination/exams/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Examination\ExamController::create
* @see app/Http/Controllers/Examination/ExamController.php:20
* @route '/examination/exams/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Examination\ExamController::store
* @see app/Http/Controllers/Examination/ExamController.php:25
* @route '/examination/exams'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/examination/exams',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Examination\ExamController::store
* @see app/Http/Controllers/Examination/ExamController.php:25
* @route '/examination/exams'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\ExamController::store
* @see app/Http/Controllers/Examination/ExamController.php:25
* @route '/examination/exams'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Examination\ExamController::show
* @see app/Http/Controllers/Examination/ExamController.php:44
* @route '/examination/exams/{exam}'
*/
export const show = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/examination/exams/{exam}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Examination\ExamController::show
* @see app/Http/Controllers/Examination/ExamController.php:44
* @route '/examination/exams/{exam}'
*/
show.url = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { exam: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { exam: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            exam: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        exam: typeof args.exam === 'object'
        ? args.exam.id
        : args.exam,
    }

    return show.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\ExamController::show
* @see app/Http/Controllers/Examination/ExamController.php:44
* @route '/examination/exams/{exam}'
*/
show.get = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Examination\ExamController::show
* @see app/Http/Controllers/Examination/ExamController.php:44
* @route '/examination/exams/{exam}'
*/
show.head = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Examination\ExamController::edit
* @see app/Http/Controllers/Examination/ExamController.php:50
* @route '/examination/exams/{exam}/edit'
*/
export const edit = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/examination/exams/{exam}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Examination\ExamController::edit
* @see app/Http/Controllers/Examination/ExamController.php:50
* @route '/examination/exams/{exam}/edit'
*/
edit.url = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { exam: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { exam: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            exam: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        exam: typeof args.exam === 'object'
        ? args.exam.id
        : args.exam,
    }

    return edit.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\ExamController::edit
* @see app/Http/Controllers/Examination/ExamController.php:50
* @route '/examination/exams/{exam}/edit'
*/
edit.get = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Examination\ExamController::edit
* @see app/Http/Controllers/Examination/ExamController.php:50
* @route '/examination/exams/{exam}/edit'
*/
edit.head = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Examination\ExamController::update
* @see app/Http/Controllers/Examination/ExamController.php:55
* @route '/examination/exams/{exam}'
*/
export const update = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/examination/exams/{exam}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Examination\ExamController::update
* @see app/Http/Controllers/Examination/ExamController.php:55
* @route '/examination/exams/{exam}'
*/
update.url = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { exam: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { exam: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            exam: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        exam: typeof args.exam === 'object'
        ? args.exam.id
        : args.exam,
    }

    return update.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\ExamController::update
* @see app/Http/Controllers/Examination/ExamController.php:55
* @route '/examination/exams/{exam}'
*/
update.put = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Examination\ExamController::togglePublish
* @see app/Http/Controllers/Examination/ExamController.php:81
* @route '/examination/exams/{exam}/publish'
*/
export const togglePublish = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: togglePublish.url(args, options),
    method: 'patch',
})

togglePublish.definition = {
    methods: ["patch"],
    url: '/examination/exams/{exam}/publish',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Examination\ExamController::togglePublish
* @see app/Http/Controllers/Examination/ExamController.php:81
* @route '/examination/exams/{exam}/publish'
*/
togglePublish.url = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { exam: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { exam: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            exam: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        exam: typeof args.exam === 'object'
        ? args.exam.id
        : args.exam,
    }

    return togglePublish.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\ExamController::togglePublish
* @see app/Http/Controllers/Examination/ExamController.php:81
* @route '/examination/exams/{exam}/publish'
*/
togglePublish.patch = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: togglePublish.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Examination\ExamController::destroy
* @see app/Http/Controllers/Examination/ExamController.php:72
* @route '/examination/exams/{exam}'
*/
export const destroy = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/examination/exams/{exam}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Examination\ExamController::destroy
* @see app/Http/Controllers/Examination/ExamController.php:72
* @route '/examination/exams/{exam}'
*/
destroy.url = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { exam: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { exam: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            exam: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        exam: typeof args.exam === 'object'
        ? args.exam.id
        : args.exam,
    }

    return destroy.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\ExamController::destroy
* @see app/Http/Controllers/Examination/ExamController.php:72
* @route '/examination/exams/{exam}'
*/
destroy.delete = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const ExamController = { index, create, store, show, edit, update, togglePublish, destroy }

export default ExamController