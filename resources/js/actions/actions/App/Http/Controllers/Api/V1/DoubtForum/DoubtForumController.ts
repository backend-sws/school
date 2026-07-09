import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::index
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:13
* @route '/api/v1/doubts'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/doubts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::index
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:13
* @route '/api/v1/doubts'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::index
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:13
* @route '/api/v1/doubts'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::index
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:13
* @route '/api/v1/doubts'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::store
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:41
* @route '/api/v1/doubts'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/doubts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::store
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:41
* @route '/api/v1/doubts'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::store
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:41
* @route '/api/v1/doubts'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::show
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:60
* @route '/api/v1/doubts/{id}'
*/
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/doubts/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::show
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:60
* @route '/api/v1/doubts/{id}'
*/
show.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::show
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:60
* @route '/api/v1/doubts/{id}'
*/
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::show
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:60
* @route '/api/v1/doubts/{id}'
*/
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::update
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:69
* @route '/api/v1/doubts/{id}'
*/
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/v1/doubts/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::update
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:69
* @route '/api/v1/doubts/{id}'
*/
update.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::update
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:69
* @route '/api/v1/doubts/{id}'
*/
update.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::destroy
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:85
* @route '/api/v1/doubts/{id}'
*/
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/doubts/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::destroy
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:85
* @route '/api/v1/doubts/{id}'
*/
destroy.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::destroy
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:85
* @route '/api/v1/doubts/{id}'
*/
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::storeReply
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:98
* @route '/api/v1/doubts/{id}/replies'
*/
export const storeReply = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeReply.url(args, options),
    method: 'post',
})

storeReply.definition = {
    methods: ["post"],
    url: '/api/v1/doubts/{id}/replies',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::storeReply
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:98
* @route '/api/v1/doubts/{id}/replies'
*/
storeReply.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return storeReply.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::storeReply
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:98
* @route '/api/v1/doubts/{id}/replies'
*/
storeReply.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeReply.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::acceptReply
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:122
* @route '/api/v1/doubts/{id}/replies/{replyId}/accept'
*/
export const acceptReply = (args: { id: string | number, replyId: string | number } | [id: string | number, replyId: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: acceptReply.url(args, options),
    method: 'patch',
})

acceptReply.definition = {
    methods: ["patch"],
    url: '/api/v1/doubts/{id}/replies/{replyId}/accept',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::acceptReply
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:122
* @route '/api/v1/doubts/{id}/replies/{replyId}/accept'
*/
acceptReply.url = (args: { id: string | number, replyId: string | number } | [id: string | number, replyId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            id: args[0],
            replyId: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
        replyId: args.replyId,
    }

    return acceptReply.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace('{replyId}', parsedArgs.replyId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::acceptReply
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:122
* @route '/api/v1/doubts/{id}/replies/{replyId}/accept'
*/
acceptReply.patch = (args: { id: string | number, replyId: string | number } | [id: string | number, replyId: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: acceptReply.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::resolveThread
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:133
* @route '/api/v1/doubts/{id}/resolve'
*/
export const resolveThread = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: resolveThread.url(args, options),
    method: 'patch',
})

resolveThread.definition = {
    methods: ["patch"],
    url: '/api/v1/doubts/{id}/resolve',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::resolveThread
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:133
* @route '/api/v1/doubts/{id}/resolve'
*/
resolveThread.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return resolveThread.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::resolveThread
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:133
* @route '/api/v1/doubts/{id}/resolve'
*/
resolveThread.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: resolveThread.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::upvoteThread
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:143
* @route '/api/v1/doubts/{id}/upvote'
*/
export const upvoteThread = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: upvoteThread.url(args, options),
    method: 'patch',
})

upvoteThread.definition = {
    methods: ["patch"],
    url: '/api/v1/doubts/{id}/upvote',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::upvoteThread
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:143
* @route '/api/v1/doubts/{id}/upvote'
*/
upvoteThread.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return upvoteThread.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::upvoteThread
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:143
* @route '/api/v1/doubts/{id}/upvote'
*/
upvoteThread.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: upvoteThread.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::upvoteReply
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:153
* @route '/api/v1/doubts/{id}/replies/{replyId}/upvote'
*/
export const upvoteReply = (args: { id: string | number, replyId: string | number } | [id: string | number, replyId: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: upvoteReply.url(args, options),
    method: 'patch',
})

upvoteReply.definition = {
    methods: ["patch"],
    url: '/api/v1/doubts/{id}/replies/{replyId}/upvote',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::upvoteReply
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:153
* @route '/api/v1/doubts/{id}/replies/{replyId}/upvote'
*/
upvoteReply.url = (args: { id: string | number, replyId: string | number } | [id: string | number, replyId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            id: args[0],
            replyId: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
        replyId: args.replyId,
    }

    return upvoteReply.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace('{replyId}', parsedArgs.replyId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::upvoteReply
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:153
* @route '/api/v1/doubts/{id}/replies/{replyId}/upvote'
*/
upvoteReply.patch = (args: { id: string | number, replyId: string | number } | [id: string | number, replyId: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: upvoteReply.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::togglePin
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:164
* @route '/api/v1/doubts/{id}/pin'
*/
export const togglePin = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: togglePin.url(args, options),
    method: 'patch',
})

togglePin.definition = {
    methods: ["patch"],
    url: '/api/v1/doubts/{id}/pin',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::togglePin
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:164
* @route '/api/v1/doubts/{id}/pin'
*/
togglePin.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return togglePin.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::togglePin
* @see app/Http/Controllers/Api/V1/DoubtForum/DoubtForumController.php:164
* @route '/api/v1/doubts/{id}/pin'
*/
togglePin.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: togglePin.url(args, options),
    method: 'patch',
})

const DoubtForumController = { index, store, show, update, destroy, storeReply, acceptReply, resolveThread, upvoteThread, upvoteReply, togglePin }

export default DoubtForumController