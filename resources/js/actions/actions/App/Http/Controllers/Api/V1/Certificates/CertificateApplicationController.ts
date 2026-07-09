import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::toggleDownload
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:77
* @route '/api/v1/certificate-applications/{id}/toggle-download'
*/
export const toggleDownload = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleDownload.url(args, options),
    method: 'patch',
})

toggleDownload.definition = {
    methods: ["patch"],
    url: '/api/v1/certificate-applications/{id}/toggle-download',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::toggleDownload
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:77
* @route '/api/v1/certificate-applications/{id}/toggle-download'
*/
toggleDownload.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return toggleDownload.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::toggleDownload
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:77
* @route '/api/v1/certificate-applications/{id}/toggle-download'
*/
toggleDownload.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleDownload.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::process
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:103
* @route '/api/v1/certificate-applications/{id}/process'
*/
export const process = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: process.url(args, options),
    method: 'post',
})

process.definition = {
    methods: ["post"],
    url: '/api/v1/certificate-applications/{id}/process',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::process
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:103
* @route '/api/v1/certificate-applications/{id}/process'
*/
process.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return process.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::process
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:103
* @route '/api/v1/certificate-applications/{id}/process'
*/
process.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: process.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::edit
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:134
* @route '/api/v1/certificate-applications/{id}/edit'
*/
export const edit = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/api/v1/certificate-applications/{id}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::edit
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:134
* @route '/api/v1/certificate-applications/{id}/edit'
*/
edit.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return edit.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::edit
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:134
* @route '/api/v1/certificate-applications/{id}/edit'
*/
edit.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::edit
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:134
* @route '/api/v1/certificate-applications/{id}/edit'
*/
edit.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::index
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:29
* @route '/api/v1/certificate-applications'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/certificate-applications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::index
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:29
* @route '/api/v1/certificate-applications'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::index
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:29
* @route '/api/v1/certificate-applications'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::index
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:29
* @route '/api/v1/certificate-applications'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::store
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
* @route '/api/v1/certificate-applications'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/certificate-applications',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::store
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
* @route '/api/v1/certificate-applications'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::store
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
* @route '/api/v1/certificate-applications'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::show
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
* @route '/api/v1/certificate-applications/{certificate_application}'
*/
export const show = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/certificate-applications/{certificate_application}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::show
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
* @route '/api/v1/certificate-applications/{certificate_application}'
*/
show.url = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { certificate_application: args }
    }

    if (Array.isArray(args)) {
        args = {
            certificate_application: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        certificate_application: args.certificate_application,
    }

    return show.definition.url
            .replace('{certificate_application}', parsedArgs.certificate_application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::show
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
* @route '/api/v1/certificate-applications/{certificate_application}'
*/
show.get = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::show
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
* @route '/api/v1/certificate-applications/{certificate_application}'
*/
show.head = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::update
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:192
* @route '/api/v1/certificate-applications/{certificate_application}'
*/
export const update = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/certificate-applications/{certificate_application}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::update
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:192
* @route '/api/v1/certificate-applications/{certificate_application}'
*/
update.url = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { certificate_application: args }
    }

    if (Array.isArray(args)) {
        args = {
            certificate_application: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        certificate_application: args.certificate_application,
    }

    return update.definition.url
            .replace('{certificate_application}', parsedArgs.certificate_application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::update
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:192
* @route '/api/v1/certificate-applications/{certificate_application}'
*/
update.put = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::update
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:192
* @route '/api/v1/certificate-applications/{certificate_application}'
*/
update.patch = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::destroy
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
* @route '/api/v1/certificate-applications/{certificate_application}'
*/
export const destroy = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/certificate-applications/{certificate_application}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::destroy
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
* @route '/api/v1/certificate-applications/{certificate_application}'
*/
destroy.url = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { certificate_application: args }
    }

    if (Array.isArray(args)) {
        args = {
            certificate_application: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        certificate_application: args.certificate_application,
    }

    return destroy.definition.url
            .replace('{certificate_application}', parsedArgs.certificate_application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::destroy
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
* @route '/api/v1/certificate-applications/{certificate_application}'
*/
destroy.delete = (args: { certificate_application: string | number } | [certificate_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::issue
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
* @route '/api/v1/certificate-applications/{application}/issue'
*/
export const issue = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: issue.url(args, options),
    method: 'post',
})

issue.definition = {
    methods: ["post"],
    url: '/api/v1/certificate-applications/{application}/issue',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::issue
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
* @route '/api/v1/certificate-applications/{application}/issue'
*/
issue.url = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return issue.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::issue
* @see app/Http/Controllers/Api/V1/Certificates/CertificateApplicationController.php:0
* @route '/api/v1/certificate-applications/{application}/issue'
*/
issue.post = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: issue.url(args, options),
    method: 'post',
})

const CertificateApplicationController = { toggleDownload, process, edit, index, store, show, update, destroy, issue }

export default CertificateApplicationController