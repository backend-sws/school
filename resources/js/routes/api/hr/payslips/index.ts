import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::history
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:75
 * @route '/api/v1/hr/payslips/staff/{userId}'
 */
export const history = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(args, options),
    method: 'get',
})

history.definition = {
    methods: ["get","head"],
    url: '/api/v1/hr/payslips/staff/{userId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::history
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:75
 * @route '/api/v1/hr/payslips/staff/{userId}'
 */
history.url = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { userId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    userId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        userId: args.userId,
                }

    return history.definition.url
            .replace('{userId}', parsedArgs.userId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::history
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:75
 * @route '/api/v1/hr/payslips/staff/{userId}'
 */
history.get = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::history
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:75
 * @route '/api/v1/hr/payslips/staff/{userId}'
 */
history.head = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: history.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::history
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:75
 * @route '/api/v1/hr/payslips/staff/{userId}'
 */
    const historyForm = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: history.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::history
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:75
 * @route '/api/v1/hr/payslips/staff/{userId}'
 */
        historyForm.get = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: history.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::history
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:75
 * @route '/api/v1/hr/payslips/staff/{userId}'
 */
        historyForm.head = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: history.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    history.form = historyForm
/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::download
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:88
 * @route '/api/v1/hr/payslips/{payslip}/download'
 */
export const download = (args: { payslip: number | { id: number } } | [payslip: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/api/v1/hr/payslips/{payslip}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::download
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:88
 * @route '/api/v1/hr/payslips/{payslip}/download'
 */
download.url = (args: { payslip: number | { id: number } } | [payslip: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payslip: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payslip: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payslip: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payslip: typeof args.payslip === 'object'
                ? args.payslip.id
                : args.payslip,
                }

    return download.definition.url
            .replace('{payslip}', parsedArgs.payslip.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::download
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:88
 * @route '/api/v1/hr/payslips/{payslip}/download'
 */
download.get = (args: { payslip: number | { id: number } } | [payslip: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::download
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:88
 * @route '/api/v1/hr/payslips/{payslip}/download'
 */
download.head = (args: { payslip: number | { id: number } } | [payslip: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::download
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:88
 * @route '/api/v1/hr/payslips/{payslip}/download'
 */
    const downloadForm = (args: { payslip: number | { id: number } } | [payslip: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::download
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:88
 * @route '/api/v1/hr/payslips/{payslip}/download'
 */
        downloadForm.get = (args: { payslip: number | { id: number } } | [payslip: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::download
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:88
 * @route '/api/v1/hr/payslips/{payslip}/download'
 */
        downloadForm.head = (args: { payslip: number | { id: number } } | [payslip: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::email
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:104
 * @route '/api/v1/hr/payslips/{payslip}/email'
 */
export const email = (args: { payslip: number | { id: number } } | [payslip: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: email.url(args, options),
    method: 'post',
})

email.definition = {
    methods: ["post"],
    url: '/api/v1/hr/payslips/{payslip}/email',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::email
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:104
 * @route '/api/v1/hr/payslips/{payslip}/email'
 */
email.url = (args: { payslip: number | { id: number } } | [payslip: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payslip: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payslip: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payslip: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payslip: typeof args.payslip === 'object'
                ? args.payslip.id
                : args.payslip,
                }

    return email.definition.url
            .replace('{payslip}', parsedArgs.payslip.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::email
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:104
 * @route '/api/v1/hr/payslips/{payslip}/email'
 */
email.post = (args: { payslip: number | { id: number } } | [payslip: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: email.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::email
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:104
 * @route '/api/v1/hr/payslips/{payslip}/email'
 */
    const emailForm = (args: { payslip: number | { id: number } } | [payslip: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: email.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::email
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:104
 * @route '/api/v1/hr/payslips/{payslip}/email'
 */
        emailForm.post = (args: { payslip: number | { id: number } } | [payslip: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: email.url(args, options),
            method: 'post',
        })
    
    email.form = emailForm
/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::update
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:161
 * @route '/api/v1/hr/payslips/{payslip}'
 */
export const update = (args: { payslip: number | { id: number } } | [payslip: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/v1/hr/payslips/{payslip}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::update
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:161
 * @route '/api/v1/hr/payslips/{payslip}'
 */
update.url = (args: { payslip: number | { id: number } } | [payslip: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payslip: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payslip: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payslip: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payslip: typeof args.payslip === 'object'
                ? args.payslip.id
                : args.payslip,
                }

    return update.definition.url
            .replace('{payslip}', parsedArgs.payslip.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::update
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:161
 * @route '/api/v1/hr/payslips/{payslip}'
 */
update.put = (args: { payslip: number | { id: number } } | [payslip: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::update
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:161
 * @route '/api/v1/hr/payslips/{payslip}'
 */
    const updateForm = (args: { payslip: number | { id: number } } | [payslip: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::update
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:161
 * @route '/api/v1/hr/payslips/{payslip}'
 */
        updateForm.put = (args: { payslip: number | { id: number } } | [payslip: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const payslips = {
    history: Object.assign(history, history),
download: Object.assign(download, download),
email: Object.assign(email, email),
update: Object.assign(update, update),
}

export default payslips