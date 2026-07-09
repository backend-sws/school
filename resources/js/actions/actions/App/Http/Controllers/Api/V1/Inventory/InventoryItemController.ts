import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::index
* @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:12
* @route '/api/v1/inventory/items'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/inventory/items',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::index
* @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:12
* @route '/api/v1/inventory/items'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::index
* @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:12
* @route '/api/v1/inventory/items'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::index
* @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:12
* @route '/api/v1/inventory/items'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::store
* @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:89
* @route '/api/v1/inventory/items'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/inventory/items',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::store
* @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:89
* @route '/api/v1/inventory/items'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::store
* @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:89
* @route '/api/v1/inventory/items'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::show
* @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:122
* @route '/api/v1/inventory/items/{inventory_item}'
*/
export const show = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/inventory/items/{inventory_item}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::show
* @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:122
* @route '/api/v1/inventory/items/{inventory_item}'
*/
show.url = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inventory_item: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { inventory_item: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            inventory_item: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        inventory_item: typeof args.inventory_item === 'object'
        ? args.inventory_item.id
        : args.inventory_item,
    }

    return show.definition.url
            .replace('{inventory_item}', parsedArgs.inventory_item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::show
* @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:122
* @route '/api/v1/inventory/items/{inventory_item}'
*/
show.get = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::show
* @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:122
* @route '/api/v1/inventory/items/{inventory_item}'
*/
show.head = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::update
* @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:131
* @route '/api/v1/inventory/items/{inventory_item}'
*/
export const update = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/inventory/items/{inventory_item}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::update
* @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:131
* @route '/api/v1/inventory/items/{inventory_item}'
*/
update.url = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inventory_item: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { inventory_item: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            inventory_item: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        inventory_item: typeof args.inventory_item === 'object'
        ? args.inventory_item.id
        : args.inventory_item,
    }

    return update.definition.url
            .replace('{inventory_item}', parsedArgs.inventory_item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::update
* @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:131
* @route '/api/v1/inventory/items/{inventory_item}'
*/
update.put = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::update
* @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:131
* @route '/api/v1/inventory/items/{inventory_item}'
*/
update.patch = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::destroy
* @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:158
* @route '/api/v1/inventory/items/{inventory_item}'
*/
export const destroy = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/inventory/items/{inventory_item}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::destroy
* @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:158
* @route '/api/v1/inventory/items/{inventory_item}'
*/
destroy.url = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inventory_item: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { inventory_item: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            inventory_item: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        inventory_item: typeof args.inventory_item === 'object'
        ? args.inventory_item.id
        : args.inventory_item,
    }

    return destroy.definition.url
            .replace('{inventory_item}', parsedArgs.inventory_item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::destroy
* @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:158
* @route '/api/v1/inventory/items/{inventory_item}'
*/
destroy.delete = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const InventoryItemController = { index, store, show, update, destroy }

export default InventoryItemController