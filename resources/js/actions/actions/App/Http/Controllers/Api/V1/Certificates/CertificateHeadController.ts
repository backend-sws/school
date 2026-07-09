import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::toggleStatus
* @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:240
* @route '/api/v1/certificate-heads/{id}/toggle-status'
*/
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

toggleStatus.definition = {
    methods: ["patch"],
    url: '/api/v1/certificate-heads/{id}/toggle-status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::toggleStatus
* @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:240
* @route '/api/v1/certificate-heads/{id}/toggle-status'
*/
toggleStatus.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleStatus.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::toggleStatus
* @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:240
* @route '/api/v1/certificate-heads/{id}/toggle-status'
*/
toggleStatus.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::index
* @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:36
* @route '/api/v1/certificate-heads'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/certificate-heads',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::index
* @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:36
* @route '/api/v1/certificate-heads'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::index
* @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:36
* @route '/api/v1/certificate-heads'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::index
* @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:36
* @route '/api/v1/certificate-heads'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::store
* @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:78
* @route '/api/v1/certificate-heads'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/certificate-heads',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::store
* @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:78
* @route '/api/v1/certificate-heads'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::store
* @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:78
* @route '/api/v1/certificate-heads'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::show
* @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:141
* @route '/api/v1/certificate-heads/{certificate_head}'
*/
export const show = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/certificate-heads/{certificate_head}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::show
* @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:141
* @route '/api/v1/certificate-heads/{certificate_head}'
*/
show.url = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { certificate_head: args }
    }

    if (Array.isArray(args)) {
        args = {
            certificate_head: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        certificate_head: args.certificate_head,
    }

    return show.definition.url
            .replace('{certificate_head}', parsedArgs.certificate_head.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::show
* @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:141
* @route '/api/v1/certificate-heads/{certificate_head}'
*/
show.get = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::show
* @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:141
* @route '/api/v1/certificate-heads/{certificate_head}'
*/
show.head = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::update
* @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:199
* @route '/api/v1/certificate-heads/{certificate_head}'
*/
export const update = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/certificate-heads/{certificate_head}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::update
* @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:199
* @route '/api/v1/certificate-heads/{certificate_head}'
*/
update.url = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { certificate_head: args }
    }

    if (Array.isArray(args)) {
        args = {
            certificate_head: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        certificate_head: args.certificate_head,
    }

    return update.definition.url
            .replace('{certificate_head}', parsedArgs.certificate_head.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::update
* @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:199
* @route '/api/v1/certificate-heads/{certificate_head}'
*/
update.put = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::update
* @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:199
* @route '/api/v1/certificate-heads/{certificate_head}'
*/
update.patch = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::destroy
* @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:0
* @route '/api/v1/certificate-heads/{certificate_head}'
*/
export const destroy = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/certificate-heads/{certificate_head}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::destroy
* @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:0
* @route '/api/v1/certificate-heads/{certificate_head}'
*/
destroy.url = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { certificate_head: args }
    }

    if (Array.isArray(args)) {
        args = {
            certificate_head: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        certificate_head: args.certificate_head,
    }

    return destroy.definition.url
            .replace('{certificate_head}', parsedArgs.certificate_head.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::destroy
* @see app/Http/Controllers/Api/V1/Certificates/CertificateHeadController.php:0
* @route '/api/v1/certificate-heads/{certificate_head}'
*/
destroy.delete = (args: { certificate_head: string | number } | [certificate_head: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const CertificateHeadController = { toggleStatus, index, store, show, update, destroy }

export default CertificateHeadController