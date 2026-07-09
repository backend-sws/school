import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::store
* @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:67
* @route '/api/v1/public/feedback'
*/
const stored4fcf0ad96a53ca69814762722e01786 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stored4fcf0ad96a53ca69814762722e01786.url(options),
    method: 'post',
})

stored4fcf0ad96a53ca69814762722e01786.definition = {
    methods: ["post"],
    url: '/api/v1/public/feedback',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::store
* @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:67
* @route '/api/v1/public/feedback'
*/
stored4fcf0ad96a53ca69814762722e01786.url = (options?: RouteQueryOptions) => {
    return stored4fcf0ad96a53ca69814762722e01786.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::store
* @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:67
* @route '/api/v1/public/feedback'
*/
stored4fcf0ad96a53ca69814762722e01786.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stored4fcf0ad96a53ca69814762722e01786.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::store
* @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:67
* @route '/api/v1/feedbacks'
*/
const storee4124cac5b7f0ad62031af8a793cce3b = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storee4124cac5b7f0ad62031af8a793cce3b.url(options),
    method: 'post',
})

storee4124cac5b7f0ad62031af8a793cce3b.definition = {
    methods: ["post"],
    url: '/api/v1/feedbacks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::store
* @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:67
* @route '/api/v1/feedbacks'
*/
storee4124cac5b7f0ad62031af8a793cce3b.url = (options?: RouteQueryOptions) => {
    return storee4124cac5b7f0ad62031af8a793cce3b.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::store
* @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:67
* @route '/api/v1/feedbacks'
*/
storee4124cac5b7f0ad62031af8a793cce3b.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storee4124cac5b7f0ad62031af8a793cce3b.url(options),
    method: 'post',
})

export const store = {
    '/api/v1/public/feedback': stored4fcf0ad96a53ca69814762722e01786,
    '/api/v1/feedbacks': storee4124cac5b7f0ad62031af8a793cce3b,
}

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::index
* @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:27
* @route '/api/v1/feedbacks'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/feedbacks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::index
* @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:27
* @route '/api/v1/feedbacks'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::index
* @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:27
* @route '/api/v1/feedbacks'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::index
* @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:27
* @route '/api/v1/feedbacks'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::show
* @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:92
* @route '/api/v1/feedbacks/{feedback}'
*/
export const show = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/feedbacks/{feedback}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::show
* @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:92
* @route '/api/v1/feedbacks/{feedback}'
*/
show.url = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { feedback: args }
    }

    if (Array.isArray(args)) {
        args = {
            feedback: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        feedback: args.feedback,
    }

    return show.definition.url
            .replace('{feedback}', parsedArgs.feedback.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::show
* @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:92
* @route '/api/v1/feedbacks/{feedback}'
*/
show.get = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::show
* @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:92
* @route '/api/v1/feedbacks/{feedback}'
*/
show.head = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::update
* @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:0
* @route '/api/v1/feedbacks/{feedback}'
*/
export const update = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/feedbacks/{feedback}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::update
* @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:0
* @route '/api/v1/feedbacks/{feedback}'
*/
update.url = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { feedback: args }
    }

    if (Array.isArray(args)) {
        args = {
            feedback: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        feedback: args.feedback,
    }

    return update.definition.url
            .replace('{feedback}', parsedArgs.feedback.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::update
* @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:0
* @route '/api/v1/feedbacks/{feedback}'
*/
update.put = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::update
* @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:0
* @route '/api/v1/feedbacks/{feedback}'
*/
update.patch = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::destroy
* @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:130
* @route '/api/v1/feedbacks/{feedback}'
*/
export const destroy = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/feedbacks/{feedback}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::destroy
* @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:130
* @route '/api/v1/feedbacks/{feedback}'
*/
destroy.url = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { feedback: args }
    }

    if (Array.isArray(args)) {
        args = {
            feedback: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        feedback: args.feedback,
    }

    return destroy.definition.url
            .replace('{feedback}', parsedArgs.feedback.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::destroy
* @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:130
* @route '/api/v1/feedbacks/{feedback}'
*/
destroy.delete = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::toggleRead
* @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:112
* @route '/api/v1/feedbacks/{id}/toggle-read'
*/
export const toggleRead = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleRead.url(args, options),
    method: 'patch',
})

toggleRead.definition = {
    methods: ["patch"],
    url: '/api/v1/feedbacks/{id}/toggle-read',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::toggleRead
* @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:112
* @route '/api/v1/feedbacks/{id}/toggle-read'
*/
toggleRead.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleRead.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::toggleRead
* @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:112
* @route '/api/v1/feedbacks/{id}/toggle-read'
*/
toggleRead.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleRead.url(args, options),
    method: 'patch',
})

const FeedbackController = { store, index, show, update, destroy, toggleRead }

export default FeedbackController