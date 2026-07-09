import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelBedController::index
* @see app/Http/Controllers/Api/V1/Hostel/HostelBedController.php:12
* @route '/api/v1/hostel/beds'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/hostel/beds',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelBedController::index
* @see app/Http/Controllers/Api/V1/Hostel/HostelBedController.php:12
* @route '/api/v1/hostel/beds'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelBedController::index
* @see app/Http/Controllers/Api/V1/Hostel/HostelBedController.php:12
* @route '/api/v1/hostel/beds'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelBedController::index
* @see app/Http/Controllers/Api/V1/Hostel/HostelBedController.php:12
* @route '/api/v1/hostel/beds'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelBedController::update
* @see app/Http/Controllers/Api/V1/Hostel/HostelBedController.php:34
* @route '/api/v1/hostel/beds/{hostel_bed}'
*/
export const update = (args: { hostel_bed: number | { id: number } } | [hostel_bed: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/hostel/beds/{hostel_bed}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelBedController::update
* @see app/Http/Controllers/Api/V1/Hostel/HostelBedController.php:34
* @route '/api/v1/hostel/beds/{hostel_bed}'
*/
update.url = (args: { hostel_bed: number | { id: number } } | [hostel_bed: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hostel_bed: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { hostel_bed: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            hostel_bed: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        hostel_bed: typeof args.hostel_bed === 'object'
        ? args.hostel_bed.id
        : args.hostel_bed,
    }

    return update.definition.url
            .replace('{hostel_bed}', parsedArgs.hostel_bed.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelBedController::update
* @see app/Http/Controllers/Api/V1/Hostel/HostelBedController.php:34
* @route '/api/v1/hostel/beds/{hostel_bed}'
*/
update.put = (args: { hostel_bed: number | { id: number } } | [hostel_bed: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelBedController::update
* @see app/Http/Controllers/Api/V1/Hostel/HostelBedController.php:34
* @route '/api/v1/hostel/beds/{hostel_bed}'
*/
update.patch = (args: { hostel_bed: number | { id: number } } | [hostel_bed: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelBedController::destroy
* @see app/Http/Controllers/Api/V1/Hostel/HostelBedController.php:51
* @route '/api/v1/hostel/beds/{hostel_bed}'
*/
export const destroy = (args: { hostel_bed: number | { id: number } } | [hostel_bed: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/hostel/beds/{hostel_bed}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelBedController::destroy
* @see app/Http/Controllers/Api/V1/Hostel/HostelBedController.php:51
* @route '/api/v1/hostel/beds/{hostel_bed}'
*/
destroy.url = (args: { hostel_bed: number | { id: number } } | [hostel_bed: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hostel_bed: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { hostel_bed: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            hostel_bed: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        hostel_bed: typeof args.hostel_bed === 'object'
        ? args.hostel_bed.id
        : args.hostel_bed,
    }

    return destroy.definition.url
            .replace('{hostel_bed}', parsedArgs.hostel_bed.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelBedController::destroy
* @see app/Http/Controllers/Api/V1/Hostel/HostelBedController.php:51
* @route '/api/v1/hostel/beds/{hostel_bed}'
*/
destroy.delete = (args: { hostel_bed: number | { id: number } } | [hostel_bed: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const HostelBedController = { index, update, destroy }

export default HostelBedController