import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseController::index
* @see app/Http/Controllers/Api/V1/Expense/ExpenseController.php:16
* @route '/api/v1/expenses'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/expenses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseController::index
* @see app/Http/Controllers/Api/V1/Expense/ExpenseController.php:16
* @route '/api/v1/expenses'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseController::index
* @see app/Http/Controllers/Api/V1/Expense/ExpenseController.php:16
* @route '/api/v1/expenses'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseController::index
* @see app/Http/Controllers/Api/V1/Expense/ExpenseController.php:16
* @route '/api/v1/expenses'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseController::store
* @see app/Http/Controllers/Api/V1/Expense/ExpenseController.php:58
* @route '/api/v1/expenses'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/expenses',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseController::store
* @see app/Http/Controllers/Api/V1/Expense/ExpenseController.php:58
* @route '/api/v1/expenses'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseController::store
* @see app/Http/Controllers/Api/V1/Expense/ExpenseController.php:58
* @route '/api/v1/expenses'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseController::show
* @see app/Http/Controllers/Api/V1/Expense/ExpenseController.php:111
* @route '/api/v1/expenses/{expense}'
*/
export const show = (args: { expense: string | number | { id: string | number } } | [expense: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/expenses/{expense}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseController::show
* @see app/Http/Controllers/Api/V1/Expense/ExpenseController.php:111
* @route '/api/v1/expenses/{expense}'
*/
show.url = (args: { expense: string | number | { id: string | number } } | [expense: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { expense: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { expense: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            expense: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        expense: typeof args.expense === 'object'
        ? args.expense.id
        : args.expense,
    }

    return show.definition.url
            .replace('{expense}', parsedArgs.expense.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseController::show
* @see app/Http/Controllers/Api/V1/Expense/ExpenseController.php:111
* @route '/api/v1/expenses/{expense}'
*/
show.get = (args: { expense: string | number | { id: string | number } } | [expense: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseController::show
* @see app/Http/Controllers/Api/V1/Expense/ExpenseController.php:111
* @route '/api/v1/expenses/{expense}'
*/
show.head = (args: { expense: string | number | { id: string | number } } | [expense: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseController::update
* @see app/Http/Controllers/Api/V1/Expense/ExpenseController.php:120
* @route '/api/v1/expenses/{expense}'
*/
export const update = (args: { expense: string | number | { id: string | number } } | [expense: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/expenses/{expense}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseController::update
* @see app/Http/Controllers/Api/V1/Expense/ExpenseController.php:120
* @route '/api/v1/expenses/{expense}'
*/
update.url = (args: { expense: string | number | { id: string | number } } | [expense: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { expense: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { expense: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            expense: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        expense: typeof args.expense === 'object'
        ? args.expense.id
        : args.expense,
    }

    return update.definition.url
            .replace('{expense}', parsedArgs.expense.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseController::update
* @see app/Http/Controllers/Api/V1/Expense/ExpenseController.php:120
* @route '/api/v1/expenses/{expense}'
*/
update.put = (args: { expense: string | number | { id: string | number } } | [expense: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseController::update
* @see app/Http/Controllers/Api/V1/Expense/ExpenseController.php:120
* @route '/api/v1/expenses/{expense}'
*/
update.patch = (args: { expense: string | number | { id: string | number } } | [expense: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseController::destroy
* @see app/Http/Controllers/Api/V1/Expense/ExpenseController.php:147
* @route '/api/v1/expenses/{expense}'
*/
export const destroy = (args: { expense: string | number | { id: string | number } } | [expense: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/expenses/{expense}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseController::destroy
* @see app/Http/Controllers/Api/V1/Expense/ExpenseController.php:147
* @route '/api/v1/expenses/{expense}'
*/
destroy.url = (args: { expense: string | number | { id: string | number } } | [expense: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { expense: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { expense: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            expense: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        expense: typeof args.expense === 'object'
        ? args.expense.id
        : args.expense,
    }

    return destroy.definition.url
            .replace('{expense}', parsedArgs.expense.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseController::destroy
* @see app/Http/Controllers/Api/V1/Expense/ExpenseController.php:147
* @route '/api/v1/expenses/{expense}'
*/
destroy.delete = (args: { expense: string | number | { id: string | number } } | [expense: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const expenses = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default expenses