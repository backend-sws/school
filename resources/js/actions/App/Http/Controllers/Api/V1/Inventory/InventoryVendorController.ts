import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:21
 * @route '/api/v1/inventory/vendors'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/inventory/vendors',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:21
 * @route '/api/v1/inventory/vendors'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:21
 * @route '/api/v1/inventory/vendors'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:21
 * @route '/api/v1/inventory/vendors'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:21
 * @route '/api/v1/inventory/vendors'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:21
 * @route '/api/v1/inventory/vendors'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:21
 * @route '/api/v1/inventory/vendors'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:66
 * @route '/api/v1/inventory/vendors'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/inventory/vendors',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:66
 * @route '/api/v1/inventory/vendors'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:66
 * @route '/api/v1/inventory/vendors'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:66
 * @route '/api/v1/inventory/vendors'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:66
 * @route '/api/v1/inventory/vendors'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:103
 * @route '/api/v1/inventory/vendors/{inventory_vendor}'
 */
export const show = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/inventory/vendors/{inventory_vendor}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:103
 * @route '/api/v1/inventory/vendors/{inventory_vendor}'
 */
show.url = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inventory_vendor: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inventory_vendor: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inventory_vendor: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inventory_vendor: typeof args.inventory_vendor === 'object'
                ? args.inventory_vendor.id
                : args.inventory_vendor,
                }

    return show.definition.url
            .replace('{inventory_vendor}', parsedArgs.inventory_vendor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:103
 * @route '/api/v1/inventory/vendors/{inventory_vendor}'
 */
show.get = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:103
 * @route '/api/v1/inventory/vendors/{inventory_vendor}'
 */
show.head = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:103
 * @route '/api/v1/inventory/vendors/{inventory_vendor}'
 */
    const showForm = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:103
 * @route '/api/v1/inventory/vendors/{inventory_vendor}'
 */
        showForm.get = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:103
 * @route '/api/v1/inventory/vendors/{inventory_vendor}'
 */
        showForm.head = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:118
 * @route '/api/v1/inventory/vendors/{inventory_vendor}'
 */
export const update = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/inventory/vendors/{inventory_vendor}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:118
 * @route '/api/v1/inventory/vendors/{inventory_vendor}'
 */
update.url = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inventory_vendor: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inventory_vendor: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inventory_vendor: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inventory_vendor: typeof args.inventory_vendor === 'object'
                ? args.inventory_vendor.id
                : args.inventory_vendor,
                }

    return update.definition.url
            .replace('{inventory_vendor}', parsedArgs.inventory_vendor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:118
 * @route '/api/v1/inventory/vendors/{inventory_vendor}'
 */
update.put = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:118
 * @route '/api/v1/inventory/vendors/{inventory_vendor}'
 */
update.patch = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:118
 * @route '/api/v1/inventory/vendors/{inventory_vendor}'
 */
    const updateForm = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:118
 * @route '/api/v1/inventory/vendors/{inventory_vendor}'
 */
        updateForm.put = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:118
 * @route '/api/v1/inventory/vendors/{inventory_vendor}'
 */
        updateForm.patch = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::destroy
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:150
 * @route '/api/v1/inventory/vendors/{inventory_vendor}'
 */
export const destroy = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/inventory/vendors/{inventory_vendor}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::destroy
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:150
 * @route '/api/v1/inventory/vendors/{inventory_vendor}'
 */
destroy.url = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inventory_vendor: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inventory_vendor: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inventory_vendor: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inventory_vendor: typeof args.inventory_vendor === 'object'
                ? args.inventory_vendor.id
                : args.inventory_vendor,
                }

    return destroy.definition.url
            .replace('{inventory_vendor}', parsedArgs.inventory_vendor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::destroy
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:150
 * @route '/api/v1/inventory/vendors/{inventory_vendor}'
 */
destroy.delete = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::destroy
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:150
 * @route '/api/v1/inventory/vendors/{inventory_vendor}'
 */
    const destroyForm = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::destroy
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:150
 * @route '/api/v1/inventory/vendors/{inventory_vendor}'
 */
        destroyForm.delete = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::ledger
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:166
 * @route '/api/v1/inventory/vendors/{inventory_vendor}/ledger'
 */
export const ledger = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ledger.url(args, options),
    method: 'get',
})

ledger.definition = {
    methods: ["get","head"],
    url: '/api/v1/inventory/vendors/{inventory_vendor}/ledger',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::ledger
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:166
 * @route '/api/v1/inventory/vendors/{inventory_vendor}/ledger'
 */
ledger.url = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inventory_vendor: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inventory_vendor: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inventory_vendor: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inventory_vendor: typeof args.inventory_vendor === 'object'
                ? args.inventory_vendor.id
                : args.inventory_vendor,
                }

    return ledger.definition.url
            .replace('{inventory_vendor}', parsedArgs.inventory_vendor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::ledger
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:166
 * @route '/api/v1/inventory/vendors/{inventory_vendor}/ledger'
 */
ledger.get = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ledger.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::ledger
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:166
 * @route '/api/v1/inventory/vendors/{inventory_vendor}/ledger'
 */
ledger.head = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ledger.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::ledger
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:166
 * @route '/api/v1/inventory/vendors/{inventory_vendor}/ledger'
 */
    const ledgerForm = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ledger.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::ledger
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:166
 * @route '/api/v1/inventory/vendors/{inventory_vendor}/ledger'
 */
        ledgerForm.get = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ledger.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::ledger
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:166
 * @route '/api/v1/inventory/vendors/{inventory_vendor}/ledger'
 */
        ledgerForm.head = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ledger.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ledger.form = ledgerForm
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::settle
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:215
 * @route '/api/v1/inventory/vendors/{inventory_vendor}/settle'
 */
export const settle = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: settle.url(args, options),
    method: 'post',
})

settle.definition = {
    methods: ["post"],
    url: '/api/v1/inventory/vendors/{inventory_vendor}/settle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::settle
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:215
 * @route '/api/v1/inventory/vendors/{inventory_vendor}/settle'
 */
settle.url = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inventory_vendor: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inventory_vendor: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inventory_vendor: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inventory_vendor: typeof args.inventory_vendor === 'object'
                ? args.inventory_vendor.id
                : args.inventory_vendor,
                }

    return settle.definition.url
            .replace('{inventory_vendor}', parsedArgs.inventory_vendor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::settle
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:215
 * @route '/api/v1/inventory/vendors/{inventory_vendor}/settle'
 */
settle.post = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: settle.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::settle
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:215
 * @route '/api/v1/inventory/vendors/{inventory_vendor}/settle'
 */
    const settleForm = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: settle.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryVendorController::settle
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryVendorController.php:215
 * @route '/api/v1/inventory/vendors/{inventory_vendor}/settle'
 */
        settleForm.post = (args: { inventory_vendor: number | { id: number } } | [inventory_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: settle.url(args, options),
            method: 'post',
        })
    
    settle.form = settleForm
const InventoryVendorController = { index, store, show, update, destroy, ledger, settle }

export default InventoryVendorController