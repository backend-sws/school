import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseCategoryController::index
* @see app/Http/Controllers/Api/V1/Expense/ExpenseCategoryController.php:12
* @route '/api/v1/expense-categories'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/expense-categories',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseCategoryController::index
* @see app/Http/Controllers/Api/V1/Expense/ExpenseCategoryController.php:12
* @route '/api/v1/expense-categories'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseCategoryController::index
* @see app/Http/Controllers/Api/V1/Expense/ExpenseCategoryController.php:12
* @route '/api/v1/expense-categories'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseCategoryController::index
* @see app/Http/Controllers/Api/V1/Expense/ExpenseCategoryController.php:12
* @route '/api/v1/expense-categories'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseCategoryController::store
* @see app/Http/Controllers/Api/V1/Expense/ExpenseCategoryController.php:38
* @route '/api/v1/expense-categories'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/expense-categories',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseCategoryController::store
* @see app/Http/Controllers/Api/V1/Expense/ExpenseCategoryController.php:38
* @route '/api/v1/expense-categories'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseCategoryController::store
* @see app/Http/Controllers/Api/V1/Expense/ExpenseCategoryController.php:38
* @route '/api/v1/expense-categories'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseCategoryController::show
* @see app/Http/Controllers/Api/V1/Expense/ExpenseCategoryController.php:55
* @route '/api/v1/expense-categories/{expense_category}'
*/
export const show = (args: { expense_category: string | number | { id: string | number } } | [expense_category: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/expense-categories/{expense_category}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseCategoryController::show
* @see app/Http/Controllers/Api/V1/Expense/ExpenseCategoryController.php:55
* @route '/api/v1/expense-categories/{expense_category}'
*/
show.url = (args: { expense_category: string | number | { id: string | number } } | [expense_category: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { expense_category: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { expense_category: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            expense_category: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        expense_category: typeof args.expense_category === 'object'
        ? args.expense_category.id
        : args.expense_category,
    }

    return show.definition.url
            .replace('{expense_category}', parsedArgs.expense_category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseCategoryController::show
* @see app/Http/Controllers/Api/V1/Expense/ExpenseCategoryController.php:55
* @route '/api/v1/expense-categories/{expense_category}'
*/
show.get = (args: { expense_category: string | number | { id: string | number } } | [expense_category: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseCategoryController::show
* @see app/Http/Controllers/Api/V1/Expense/ExpenseCategoryController.php:55
* @route '/api/v1/expense-categories/{expense_category}'
*/
show.head = (args: { expense_category: string | number | { id: string | number } } | [expense_category: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseCategoryController::update
* @see app/Http/Controllers/Api/V1/Expense/ExpenseCategoryController.php:64
* @route '/api/v1/expense-categories/{expense_category}'
*/
export const update = (args: { expense_category: string | number | { id: string | number } } | [expense_category: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/expense-categories/{expense_category}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseCategoryController::update
* @see app/Http/Controllers/Api/V1/Expense/ExpenseCategoryController.php:64
* @route '/api/v1/expense-categories/{expense_category}'
*/
update.url = (args: { expense_category: string | number | { id: string | number } } | [expense_category: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { expense_category: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { expense_category: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            expense_category: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        expense_category: typeof args.expense_category === 'object'
        ? args.expense_category.id
        : args.expense_category,
    }

    return update.definition.url
            .replace('{expense_category}', parsedArgs.expense_category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseCategoryController::update
* @see app/Http/Controllers/Api/V1/Expense/ExpenseCategoryController.php:64
* @route '/api/v1/expense-categories/{expense_category}'
*/
update.put = (args: { expense_category: string | number | { id: string | number } } | [expense_category: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseCategoryController::update
* @see app/Http/Controllers/Api/V1/Expense/ExpenseCategoryController.php:64
* @route '/api/v1/expense-categories/{expense_category}'
*/
update.patch = (args: { expense_category: string | number | { id: string | number } } | [expense_category: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseCategoryController::destroy
* @see app/Http/Controllers/Api/V1/Expense/ExpenseCategoryController.php:81
* @route '/api/v1/expense-categories/{expense_category}'
*/
export const destroy = (args: { expense_category: string | number | { id: string | number } } | [expense_category: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/expense-categories/{expense_category}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseCategoryController::destroy
* @see app/Http/Controllers/Api/V1/Expense/ExpenseCategoryController.php:81
* @route '/api/v1/expense-categories/{expense_category}'
*/
destroy.url = (args: { expense_category: string | number | { id: string | number } } | [expense_category: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { expense_category: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { expense_category: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            expense_category: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        expense_category: typeof args.expense_category === 'object'
        ? args.expense_category.id
        : args.expense_category,
    }

    return destroy.definition.url
            .replace('{expense_category}', parsedArgs.expense_category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseCategoryController::destroy
* @see app/Http/Controllers/Api/V1/Expense/ExpenseCategoryController.php:81
* @route '/api/v1/expense-categories/{expense_category}'
*/
destroy.delete = (args: { expense_category: string | number | { id: string | number } } | [expense_category: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const ExpenseCategoryController = { index, store, show, update, destroy }

export default ExpenseCategoryController