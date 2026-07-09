import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::index
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:28
 * @route '/api/v1/student/verification'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/student/verification',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::index
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:28
 * @route '/api/v1/student/verification'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::index
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:28
 * @route '/api/v1/student/verification'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::index
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:28
 * @route '/api/v1/student/verification'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::index
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:28
 * @route '/api/v1/student/verification'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::index
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:28
 * @route '/api/v1/student/verification'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::index
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:28
 * @route '/api/v1/student/verification'
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
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::toggleGlobal
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:62
 * @route '/api/v1/student/verification/toggle-global'
 */
export const toggleGlobal = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleGlobal.url(options),
    method: 'post',
})

toggleGlobal.definition = {
    methods: ["post"],
    url: '/api/v1/student/verification/toggle-global',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::toggleGlobal
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:62
 * @route '/api/v1/student/verification/toggle-global'
 */
toggleGlobal.url = (options?: RouteQueryOptions) => {
    return toggleGlobal.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::toggleGlobal
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:62
 * @route '/api/v1/student/verification/toggle-global'
 */
toggleGlobal.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleGlobal.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::toggleGlobal
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:62
 * @route '/api/v1/student/verification/toggle-global'
 */
    const toggleGlobalForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleGlobal.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::toggleGlobal
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:62
 * @route '/api/v1/student/verification/toggle-global'
 */
        toggleGlobalForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleGlobal.url(options),
            method: 'post',
        })
    
    toggleGlobal.form = toggleGlobalForm
/**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::toggleStream
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:84
 * @route '/api/v1/student/verification/toggle-stream/{streamId}'
 */
export const toggleStream = (args: { streamId: string | number } | [streamId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStream.url(args, options),
    method: 'post',
})

toggleStream.definition = {
    methods: ["post"],
    url: '/api/v1/student/verification/toggle-stream/{streamId}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::toggleStream
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:84
 * @route '/api/v1/student/verification/toggle-stream/{streamId}'
 */
toggleStream.url = (args: { streamId: string | number } | [streamId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { streamId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    streamId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        streamId: args.streamId,
                }

    return toggleStream.definition.url
            .replace('{streamId}', parsedArgs.streamId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::toggleStream
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:84
 * @route '/api/v1/student/verification/toggle-stream/{streamId}'
 */
toggleStream.post = (args: { streamId: string | number } | [streamId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStream.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::toggleStream
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:84
 * @route '/api/v1/student/verification/toggle-stream/{streamId}'
 */
    const toggleStreamForm = (args: { streamId: string | number } | [streamId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleStream.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::toggleStream
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:84
 * @route '/api/v1/student/verification/toggle-stream/{streamId}'
 */
        toggleStreamForm.post = (args: { streamId: string | number } | [streamId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleStream.url(args, options),
            method: 'post',
        })
    
    toggleStream.form = toggleStreamForm
/**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::upload
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:105
 * @route '/api/v1/student/verification/upload/{streamId}'
 */
export const upload = (args: { streamId: string | number } | [streamId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(args, options),
    method: 'post',
})

upload.definition = {
    methods: ["post"],
    url: '/api/v1/student/verification/upload/{streamId}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::upload
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:105
 * @route '/api/v1/student/verification/upload/{streamId}'
 */
upload.url = (args: { streamId: string | number } | [streamId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { streamId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    streamId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        streamId: args.streamId,
                }

    return upload.definition.url
            .replace('{streamId}', parsedArgs.streamId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::upload
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:105
 * @route '/api/v1/student/verification/upload/{streamId}'
 */
upload.post = (args: { streamId: string | number } | [streamId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::upload
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:105
 * @route '/api/v1/student/verification/upload/{streamId}'
 */
    const uploadForm = (args: { streamId: string | number } | [streamId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: upload.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::upload
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:105
 * @route '/api/v1/student/verification/upload/{streamId}'
 */
        uploadForm.post = (args: { streamId: string | number } | [streamId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: upload.url(args, options),
            method: 'post',
        })
    
    upload.form = uploadForm
/**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::downloadSample
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:137
 * @route '/api/v1/student/verification/download-sample'
 */
export const downloadSample = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadSample.url(options),
    method: 'get',
})

downloadSample.definition = {
    methods: ["get","head"],
    url: '/api/v1/student/verification/download-sample',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::downloadSample
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:137
 * @route '/api/v1/student/verification/download-sample'
 */
downloadSample.url = (options?: RouteQueryOptions) => {
    return downloadSample.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::downloadSample
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:137
 * @route '/api/v1/student/verification/download-sample'
 */
downloadSample.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadSample.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::downloadSample
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:137
 * @route '/api/v1/student/verification/download-sample'
 */
downloadSample.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadSample.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::downloadSample
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:137
 * @route '/api/v1/student/verification/download-sample'
 */
    const downloadSampleForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadSample.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::downloadSample
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:137
 * @route '/api/v1/student/verification/download-sample'
 */
        downloadSampleForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadSample.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::downloadSample
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:137
 * @route '/api/v1/student/verification/download-sample'
 */
        downloadSampleForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadSample.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadSample.form = downloadSampleForm
/**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::exportByStream
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:158
 * @route '/api/v1/student/verification/export-stream'
 */
export const exportByStream = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportByStream.url(options),
    method: 'get',
})

exportByStream.definition = {
    methods: ["get","head"],
    url: '/api/v1/student/verification/export-stream',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::exportByStream
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:158
 * @route '/api/v1/student/verification/export-stream'
 */
exportByStream.url = (options?: RouteQueryOptions) => {
    return exportByStream.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::exportByStream
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:158
 * @route '/api/v1/student/verification/export-stream'
 */
exportByStream.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportByStream.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::exportByStream
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:158
 * @route '/api/v1/student/verification/export-stream'
 */
exportByStream.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportByStream.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::exportByStream
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:158
 * @route '/api/v1/student/verification/export-stream'
 */
    const exportByStreamForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportByStream.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::exportByStream
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:158
 * @route '/api/v1/student/verification/export-stream'
 */
        exportByStreamForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportByStream.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Admission\StudentVerificationController::exportByStream
 * @see app/Http/Controllers/Api/V1/Admission/StudentVerificationController.php:158
 * @route '/api/v1/student/verification/export-stream'
 */
        exportByStreamForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportByStream.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportByStream.form = exportByStreamForm
const StudentVerificationController = { index, toggleGlobal, toggleStream, upload, downloadSample, exportByStream }

export default StudentVerificationController