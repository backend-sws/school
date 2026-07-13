import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::index
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:12
 * @route '/api/v1/expense-budgets'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/expense-budgets',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::index
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:12
 * @route '/api/v1/expense-budgets'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::index
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:12
 * @route '/api/v1/expense-budgets'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::index
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:12
 * @route '/api/v1/expense-budgets'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::index
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:12
 * @route '/api/v1/expense-budgets'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::index
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:12
 * @route '/api/v1/expense-budgets'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::index
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:12
 * @route '/api/v1/expense-budgets'
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
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::store
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:34
 * @route '/api/v1/expense-budgets'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/expense-budgets',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::store
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:34
 * @route '/api/v1/expense-budgets'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::store
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:34
 * @route '/api/v1/expense-budgets'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::store
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:34
 * @route '/api/v1/expense-budgets'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::store
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:34
 * @route '/api/v1/expense-budgets'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::show
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:60
 * @route '/api/v1/expense-budgets/{expense_budget}'
 */
export const show = (args: { expense_budget: string | number | { id: string | number } } | [expense_budget: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/expense-budgets/{expense_budget}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::show
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:60
 * @route '/api/v1/expense-budgets/{expense_budget}'
 */
show.url = (args: { expense_budget: string | number | { id: string | number } } | [expense_budget: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { expense_budget: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { expense_budget: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    expense_budget: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        expense_budget: typeof args.expense_budget === 'object'
                ? args.expense_budget.id
                : args.expense_budget,
                }

    return show.definition.url
            .replace('{expense_budget}', parsedArgs.expense_budget.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::show
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:60
 * @route '/api/v1/expense-budgets/{expense_budget}'
 */
show.get = (args: { expense_budget: string | number | { id: string | number } } | [expense_budget: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::show
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:60
 * @route '/api/v1/expense-budgets/{expense_budget}'
 */
show.head = (args: { expense_budget: string | number | { id: string | number } } | [expense_budget: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::show
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:60
 * @route '/api/v1/expense-budgets/{expense_budget}'
 */
    const showForm = (args: { expense_budget: string | number | { id: string | number } } | [expense_budget: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::show
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:60
 * @route '/api/v1/expense-budgets/{expense_budget}'
 */
        showForm.get = (args: { expense_budget: string | number | { id: string | number } } | [expense_budget: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::show
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:60
 * @route '/api/v1/expense-budgets/{expense_budget}'
 */
        showForm.head = (args: { expense_budget: string | number | { id: string | number } } | [expense_budget: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::update
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:69
 * @route '/api/v1/expense-budgets/{expense_budget}'
 */
export const update = (args: { expense_budget: string | number | { id: string | number } } | [expense_budget: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/expense-budgets/{expense_budget}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::update
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:69
 * @route '/api/v1/expense-budgets/{expense_budget}'
 */
update.url = (args: { expense_budget: string | number | { id: string | number } } | [expense_budget: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { expense_budget: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { expense_budget: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    expense_budget: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        expense_budget: typeof args.expense_budget === 'object'
                ? args.expense_budget.id
                : args.expense_budget,
                }

    return update.definition.url
            .replace('{expense_budget}', parsedArgs.expense_budget.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::update
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:69
 * @route '/api/v1/expense-budgets/{expense_budget}'
 */
update.put = (args: { expense_budget: string | number | { id: string | number } } | [expense_budget: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::update
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:69
 * @route '/api/v1/expense-budgets/{expense_budget}'
 */
update.patch = (args: { expense_budget: string | number | { id: string | number } } | [expense_budget: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::update
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:69
 * @route '/api/v1/expense-budgets/{expense_budget}'
 */
    const updateForm = (args: { expense_budget: string | number | { id: string | number } } | [expense_budget: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::update
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:69
 * @route '/api/v1/expense-budgets/{expense_budget}'
 */
        updateForm.put = (args: { expense_budget: string | number | { id: string | number } } | [expense_budget: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::update
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:69
 * @route '/api/v1/expense-budgets/{expense_budget}'
 */
        updateForm.patch = (args: { expense_budget: string | number | { id: string | number } } | [expense_budget: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::destroy
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:101
 * @route '/api/v1/expense-budgets/{expense_budget}'
 */
export const destroy = (args: { expense_budget: string | number | { id: string | number } } | [expense_budget: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/expense-budgets/{expense_budget}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::destroy
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:101
 * @route '/api/v1/expense-budgets/{expense_budget}'
 */
destroy.url = (args: { expense_budget: string | number | { id: string | number } } | [expense_budget: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { expense_budget: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { expense_budget: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    expense_budget: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        expense_budget: typeof args.expense_budget === 'object'
                ? args.expense_budget.id
                : args.expense_budget,
                }

    return destroy.definition.url
            .replace('{expense_budget}', parsedArgs.expense_budget.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::destroy
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:101
 * @route '/api/v1/expense-budgets/{expense_budget}'
 */
destroy.delete = (args: { expense_budget: string | number | { id: string | number } } | [expense_budget: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::destroy
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:101
 * @route '/api/v1/expense-budgets/{expense_budget}'
 */
    const destroyForm = (args: { expense_budget: string | number | { id: string | number } } | [expense_budget: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::destroy
 * @see app/Http/Controllers/Api/V1/Expense/ExpenseBudgetController.php:101
 * @route '/api/v1/expense-budgets/{expense_budget}'
 */
        destroyForm.delete = (args: { expense_budget: string | number | { id: string | number } } | [expense_budget: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const expenseBudgets = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default expenseBudgets