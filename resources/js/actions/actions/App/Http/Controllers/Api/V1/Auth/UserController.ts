import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Auth\UserController::index
* @see app/Http/Controllers/Api/V1/Auth/UserController.php:28
* @route '/api/v1/users'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\UserController::index
* @see app/Http/Controllers/Api/V1/Auth/UserController.php:28
* @route '/api/v1/users'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\UserController::index
* @see app/Http/Controllers/Api/V1/Auth/UserController.php:28
* @route '/api/v1/users'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\UserController::index
* @see app/Http/Controllers/Api/V1/Auth/UserController.php:28
* @route '/api/v1/users'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\UserController::store
* @see app/Http/Controllers/Api/V1/Auth/UserController.php:91
* @route '/api/v1/users'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/users',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\UserController::store
* @see app/Http/Controllers/Api/V1/Auth/UserController.php:91
* @route '/api/v1/users'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\UserController::store
* @see app/Http/Controllers/Api/V1/Auth/UserController.php:91
* @route '/api/v1/users'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\UserController::show
* @see app/Http/Controllers/Api/V1/Auth/UserController.php:119
* @route '/api/v1/users/{user}'
*/
export const show = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/users/{user}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\UserController::show
* @see app/Http/Controllers/Api/V1/Auth/UserController.php:119
* @route '/api/v1/users/{user}'
*/
show.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return show.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\UserController::show
* @see app/Http/Controllers/Api/V1/Auth/UserController.php:119
* @route '/api/v1/users/{user}'
*/
show.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\UserController::show
* @see app/Http/Controllers/Api/V1/Auth/UserController.php:119
* @route '/api/v1/users/{user}'
*/
show.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\UserController::update
* @see app/Http/Controllers/Api/V1/Auth/UserController.php:144
* @route '/api/v1/users/{user}'
*/
export const update = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/users/{user}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\UserController::update
* @see app/Http/Controllers/Api/V1/Auth/UserController.php:144
* @route '/api/v1/users/{user}'
*/
update.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return update.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\UserController::update
* @see app/Http/Controllers/Api/V1/Auth/UserController.php:144
* @route '/api/v1/users/{user}'
*/
update.put = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\UserController::update
* @see app/Http/Controllers/Api/V1/Auth/UserController.php:144
* @route '/api/v1/users/{user}'
*/
update.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\UserController::destroy
* @see app/Http/Controllers/Api/V1/Auth/UserController.php:173
* @route '/api/v1/users/{user}'
*/
export const destroy = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/users/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\UserController::destroy
* @see app/Http/Controllers/Api/V1/Auth/UserController.php:173
* @route '/api/v1/users/{user}'
*/
destroy.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return destroy.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\UserController::destroy
* @see app/Http/Controllers/Api/V1/Auth/UserController.php:173
* @route '/api/v1/users/{user}'
*/
destroy.delete = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\UserController::assignRole
* @see app/Http/Controllers/Api/V1/Auth/UserController.php:217
* @route '/api/v1/users/{user}/roles'
*/
export const assignRole = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignRole.url(args, options),
    method: 'post',
})

assignRole.definition = {
    methods: ["post"],
    url: '/api/v1/users/{user}/roles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\UserController::assignRole
* @see app/Http/Controllers/Api/V1/Auth/UserController.php:217
* @route '/api/v1/users/{user}/roles'
*/
assignRole.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return assignRole.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\UserController::assignRole
* @see app/Http/Controllers/Api/V1/Auth/UserController.php:217
* @route '/api/v1/users/{user}/roles'
*/
assignRole.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignRole.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\UserController::removeRole
* @see app/Http/Controllers/Api/V1/Auth/UserController.php:259
* @route '/api/v1/users/{user}/roles/{role}'
*/
export const removeRole = (args: { user: number | { id: number }, role: string | number } | [user: number | { id: number }, role: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeRole.url(args, options),
    method: 'delete',
})

removeRole.definition = {
    methods: ["delete"],
    url: '/api/v1/users/{user}/roles/{role}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\UserController::removeRole
* @see app/Http/Controllers/Api/V1/Auth/UserController.php:259
* @route '/api/v1/users/{user}/roles/{role}'
*/
removeRole.url = (args: { user: number | { id: number }, role: string | number } | [user: number | { id: number }, role: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            user: args[0],
            role: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
        role: args.role,
    }

    return removeRole.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\UserController::removeRole
* @see app/Http/Controllers/Api/V1/Auth/UserController.php:259
* @route '/api/v1/users/{user}/roles/{role}'
*/
removeRole.delete = (args: { user: number | { id: number }, role: string | number } | [user: number | { id: number }, role: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeRole.url(args, options),
    method: 'delete',
})

const UserController = { index, store, show, update, destroy, assignRole, removeRole }

export default UserController