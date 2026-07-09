import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::modules
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:136
 * @route '/api/v1/import/modules'
 */
export const modules = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: modules.url(options),
    method: 'get',
})

modules.definition = {
    methods: ["get","head"],
    url: '/api/v1/import/modules',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::modules
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:136
 * @route '/api/v1/import/modules'
 */
modules.url = (options?: RouteQueryOptions) => {
    return modules.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::modules
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:136
 * @route '/api/v1/import/modules'
 */
modules.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: modules.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::modules
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:136
 * @route '/api/v1/import/modules'
 */
modules.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: modules.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::modules
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:136
 * @route '/api/v1/import/modules'
 */
    const modulesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: modules.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::modules
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:136
 * @route '/api/v1/import/modules'
 */
        modulesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: modules.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::modules
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:136
 * @route '/api/v1/import/modules'
 */
        modulesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: modules.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    modules.form = modulesForm
/**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::downloadTemplate
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:19
 * @route '/api/v1/import/{module}/template'
 */
export const downloadTemplate = (args: { module: string | number } | [module: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadTemplate.url(args, options),
    method: 'get',
})

downloadTemplate.definition = {
    methods: ["get","head"],
    url: '/api/v1/import/{module}/template',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::downloadTemplate
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:19
 * @route '/api/v1/import/{module}/template'
 */
downloadTemplate.url = (args: { module: string | number } | [module: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { module: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    module: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        module: args.module,
                }

    return downloadTemplate.definition.url
            .replace('{module}', parsedArgs.module.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::downloadTemplate
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:19
 * @route '/api/v1/import/{module}/template'
 */
downloadTemplate.get = (args: { module: string | number } | [module: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadTemplate.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::downloadTemplate
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:19
 * @route '/api/v1/import/{module}/template'
 */
downloadTemplate.head = (args: { module: string | number } | [module: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadTemplate.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::downloadTemplate
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:19
 * @route '/api/v1/import/{module}/template'
 */
    const downloadTemplateForm = (args: { module: string | number } | [module: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadTemplate.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::downloadTemplate
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:19
 * @route '/api/v1/import/{module}/template'
 */
        downloadTemplateForm.get = (args: { module: string | number } | [module: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadTemplate.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::downloadTemplate
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:19
 * @route '/api/v1/import/{module}/template'
 */
        downloadTemplateForm.head = (args: { module: string | number } | [module: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadTemplate.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadTemplate.form = downloadTemplateForm
/**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::upload
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:41
 * @route '/api/v1/import/{module}/upload'
 */
export const upload = (args: { module: string | number } | [module: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(args, options),
    method: 'post',
})

upload.definition = {
    methods: ["post"],
    url: '/api/v1/import/{module}/upload',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::upload
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:41
 * @route '/api/v1/import/{module}/upload'
 */
upload.url = (args: { module: string | number } | [module: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { module: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    module: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        module: args.module,
                }

    return upload.definition.url
            .replace('{module}', parsedArgs.module.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::upload
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:41
 * @route '/api/v1/import/{module}/upload'
 */
upload.post = (args: { module: string | number } | [module: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::upload
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:41
 * @route '/api/v1/import/{module}/upload'
 */
    const uploadForm = (args: { module: string | number } | [module: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: upload.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::upload
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:41
 * @route '/api/v1/import/{module}/upload'
 */
        uploadForm.post = (args: { module: string | number } | [module: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: upload.url(args, options),
            method: 'post',
        })
    
    upload.form = uploadForm
/**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::history
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:116
 * @route '/api/v1/import/history'
 */
export const history = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})

history.definition = {
    methods: ["get","head"],
    url: '/api/v1/import/history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::history
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:116
 * @route '/api/v1/import/history'
 */
history.url = (options?: RouteQueryOptions) => {
    return history.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::history
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:116
 * @route '/api/v1/import/history'
 */
history.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::history
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:116
 * @route '/api/v1/import/history'
 */
history.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: history.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::history
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:116
 * @route '/api/v1/import/history'
 */
    const historyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: history.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::history
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:116
 * @route '/api/v1/import/history'
 */
        historyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: history.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::history
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:116
 * @route '/api/v1/import/history'
 */
        historyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: history.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    history.form = historyForm
/**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::status
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:81
 * @route '/api/v1/import/{importLogId}/status'
 */
export const status = (args: { importLogId: string | number } | [importLogId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(args, options),
    method: 'get',
})

status.definition = {
    methods: ["get","head"],
    url: '/api/v1/import/{importLogId}/status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::status
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:81
 * @route '/api/v1/import/{importLogId}/status'
 */
status.url = (args: { importLogId: string | number } | [importLogId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { importLogId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    importLogId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        importLogId: args.importLogId,
                }

    return status.definition.url
            .replace('{importLogId}', parsedArgs.importLogId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::status
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:81
 * @route '/api/v1/import/{importLogId}/status'
 */
status.get = (args: { importLogId: string | number } | [importLogId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::status
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:81
 * @route '/api/v1/import/{importLogId}/status'
 */
status.head = (args: { importLogId: string | number } | [importLogId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: status.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::status
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:81
 * @route '/api/v1/import/{importLogId}/status'
 */
    const statusForm = (args: { importLogId: string | number } | [importLogId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: status.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::status
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:81
 * @route '/api/v1/import/{importLogId}/status'
 */
        statusForm.get = (args: { importLogId: string | number } | [importLogId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: status.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\BulkImportController::status
 * @see app/Http/Controllers/Api/V1/Organization/BulkImportController.php:81
 * @route '/api/v1/import/{importLogId}/status'
 */
        statusForm.head = (args: { importLogId: string | number } | [importLogId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: status.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    status.form = statusForm
const BulkImportController = { modules, downloadTemplate, upload, history, status }

export default BulkImportController