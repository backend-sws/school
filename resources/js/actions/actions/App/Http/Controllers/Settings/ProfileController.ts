import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\ProfileController::show
* @see app/Http/Controllers/Settings/ProfileController.php:36
* @route '/api/v1/settings/profile'
*/
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/settings/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\ProfileController::show
* @see app/Http/Controllers/Settings/ProfileController.php:36
* @route '/api/v1/settings/profile'
*/
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::show
* @see app/Http/Controllers/Settings/ProfileController.php:36
* @route '/api/v1/settings/profile'
*/
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\ProfileController::show
* @see app/Http/Controllers/Settings/ProfileController.php:36
* @route '/api/v1/settings/profile'
*/
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\ProfileController::update
* @see app/Http/Controllers/Settings/ProfileController.php:49
* @route '/api/v1/settings/profile'
*/
const updateae9c7fb79cbf4d5f9ffa3dce834eec71 = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateae9c7fb79cbf4d5f9ffa3dce834eec71.url(options),
    method: 'patch',
})

updateae9c7fb79cbf4d5f9ffa3dce834eec71.definition = {
    methods: ["patch"],
    url: '/api/v1/settings/profile',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\ProfileController::update
* @see app/Http/Controllers/Settings/ProfileController.php:49
* @route '/api/v1/settings/profile'
*/
updateae9c7fb79cbf4d5f9ffa3dce834eec71.url = (options?: RouteQueryOptions) => {
    return updateae9c7fb79cbf4d5f9ffa3dce834eec71.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::update
* @see app/Http/Controllers/Settings/ProfileController.php:49
* @route '/api/v1/settings/profile'
*/
updateae9c7fb79cbf4d5f9ffa3dce834eec71.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateae9c7fb79cbf4d5f9ffa3dce834eec71.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Settings\ProfileController::update
* @see app/Http/Controllers/Settings/ProfileController.php:49
* @route '/settings/profile'
*/
const updatefc6874003af373efc88e5e18eecd9c17 = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatefc6874003af373efc88e5e18eecd9c17.url(options),
    method: 'patch',
})

updatefc6874003af373efc88e5e18eecd9c17.definition = {
    methods: ["patch"],
    url: '/settings/profile',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\ProfileController::update
* @see app/Http/Controllers/Settings/ProfileController.php:49
* @route '/settings/profile'
*/
updatefc6874003af373efc88e5e18eecd9c17.url = (options?: RouteQueryOptions) => {
    return updatefc6874003af373efc88e5e18eecd9c17.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::update
* @see app/Http/Controllers/Settings/ProfileController.php:49
* @route '/settings/profile'
*/
updatefc6874003af373efc88e5e18eecd9c17.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatefc6874003af373efc88e5e18eecd9c17.url(options),
    method: 'patch',
})

export const update = {
    '/api/v1/settings/profile': updateae9c7fb79cbf4d5f9ffa3dce834eec71,
    '/settings/profile': updatefc6874003af373efc88e5e18eecd9c17,
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
* @see app/Http/Controllers/Settings/ProfileController.php:23
* @route '/settings/profile'
*/
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
* @see app/Http/Controllers/Settings/ProfileController.php:23
* @route '/settings/profile'
*/
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
* @see app/Http/Controllers/Settings/ProfileController.php:23
* @route '/settings/profile'
*/
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
* @see app/Http/Controllers/Settings/ProfileController.php:23
* @route '/settings/profile'
*/
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
* @see app/Http/Controllers/Settings/ProfileController.php:91
* @route '/settings/profile'
*/
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/profile',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
* @see app/Http/Controllers/Settings/ProfileController.php:91
* @route '/settings/profile'
*/
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
* @see app/Http/Controllers/Settings/ProfileController.php:91
* @route '/settings/profile'
*/
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

const ProfileController = { show, update, edit, destroy }

export default ProfileController