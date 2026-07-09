import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::reAdmissions
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:217
* @route '/api/v1/applications/re-admissions'
*/
export const reAdmissions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reAdmissions.url(options),
    method: 'get',
})

reAdmissions.definition = {
    methods: ["get","head"],
    url: '/api/v1/applications/re-admissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::reAdmissions
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:217
* @route '/api/v1/applications/re-admissions'
*/
reAdmissions.url = (options?: RouteQueryOptions) => {
    return reAdmissions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::reAdmissions
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:217
* @route '/api/v1/applications/re-admissions'
*/
reAdmissions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reAdmissions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::reAdmissions
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:217
* @route '/api/v1/applications/re-admissions'
*/
reAdmissions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reAdmissions.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::previewFees
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1431
* @route '/api/v1/applications/preview-fees'
*/
export const previewFees = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewFees.url(options),
    method: 'get',
})

previewFees.definition = {
    methods: ["get","head"],
    url: '/api/v1/applications/preview-fees',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::previewFees
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1431
* @route '/api/v1/applications/preview-fees'
*/
previewFees.url = (options?: RouteQueryOptions) => {
    return previewFees.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::previewFees
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1431
* @route '/api/v1/applications/preview-fees'
*/
previewFees.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewFees.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::previewFees
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1431
* @route '/api/v1/applications/preview-fees'
*/
previewFees.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: previewFees.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::invoice
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1205
* @route '/api/v1/applications/{application}/invoice'
*/
export const invoice = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoice.url(args, options),
    method: 'get',
})

invoice.definition = {
    methods: ["get","head"],
    url: '/api/v1/applications/{application}/invoice',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::invoice
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1205
* @route '/api/v1/applications/{application}/invoice'
*/
invoice.url = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { application: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            application: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        application: typeof args.application === 'object'
        ? args.application.id
        : args.application,
    }

    return invoice.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::invoice
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1205
* @route '/api/v1/applications/{application}/invoice'
*/
invoice.get = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoice.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::invoice
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1205
* @route '/api/v1/applications/{application}/invoice'
*/
invoice.head = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: invoice.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::index
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:80
* @route '/api/v1/applications'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/applications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::index
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:80
* @route '/api/v1/applications'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::index
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:80
* @route '/api/v1/applications'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::index
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:80
* @route '/api/v1/applications'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::store
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:296
* @route '/api/v1/applications'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/applications',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::store
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:296
* @route '/api/v1/applications'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::store
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:296
* @route '/api/v1/applications'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::show
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1239
* @route '/api/v1/applications/{application}'
*/
export const show = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/applications/{application}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::show
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1239
* @route '/api/v1/applications/{application}'
*/
show.url = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { application: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            application: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        application: typeof args.application === 'object'
        ? args.application.id
        : args.application,
    }

    return show.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::show
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1239
* @route '/api/v1/applications/{application}'
*/
show.get = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::show
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1239
* @route '/api/v1/applications/{application}'
*/
show.head = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::update
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:747
* @route '/api/v1/applications/{application}'
*/
export const update = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/applications/{application}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::update
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:747
* @route '/api/v1/applications/{application}'
*/
update.url = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

    if (Array.isArray(args)) {
        args = {
            application: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        application: args.application,
    }

    return update.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::update
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:747
* @route '/api/v1/applications/{application}'
*/
update.put = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::update
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:747
* @route '/api/v1/applications/{application}'
*/
update.patch = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::destroy
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1406
* @route '/api/v1/applications/{application}'
*/
export const destroy = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/applications/{application}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::destroy
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1406
* @route '/api/v1/applications/{application}'
*/
destroy.url = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { application: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            application: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        application: typeof args.application === 'object'
        ? args.application.id
        : args.application,
    }

    return destroy.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::destroy
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1406
* @route '/api/v1/applications/{application}'
*/
destroy.delete = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::process
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1278
* @route '/api/v1/applications/{application}/process'
*/
export const process = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: process.url(args, options),
    method: 'post',
})

process.definition = {
    methods: ["post"],
    url: '/api/v1/applications/{application}/process',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::process
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1278
* @route '/api/v1/applications/{application}/process'
*/
process.url = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { application: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            application: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        application: typeof args.application === 'object'
        ? args.application.id
        : args.application,
    }

    return process.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::process
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1278
* @route '/api/v1/applications/{application}/process'
*/
process.post = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: process.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::recordPayment
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1326
* @route '/api/v1/applications/{application}/record-payment'
*/
export const recordPayment = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recordPayment.url(args, options),
    method: 'post',
})

recordPayment.definition = {
    methods: ["post"],
    url: '/api/v1/applications/{application}/record-payment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::recordPayment
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1326
* @route '/api/v1/applications/{application}/record-payment'
*/
recordPayment.url = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { application: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            application: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        application: typeof args.application === 'object'
        ? args.application.id
        : args.application,
    }

    return recordPayment.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\ApplicationController::recordPayment
* @see app/Http/Controllers/Api/V1/Admission/ApplicationController.php:1326
* @route '/api/v1/applications/{application}/record-payment'
*/
recordPayment.post = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recordPayment.url(args, options),
    method: 'post',
})

const ApplicationController = { reAdmissions, previewFees, invoice, index, store, show, update, destroy, process, recordPayment }

export default ApplicationController