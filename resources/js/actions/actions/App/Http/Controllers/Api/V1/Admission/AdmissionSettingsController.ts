import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::toggleStream
* @see app/Http/Controllers/Api/V1/Admission/AdmissionSettingsController.php:113
* @route '/api/v1/admission/verification/toggle-stream/{streamId}'
*/
export const toggleStream = (args: { streamId: string | number } | [streamId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStream.url(args, options),
    method: 'post',
})

toggleStream.definition = {
    methods: ["post"],
    url: '/api/v1/admission/verification/toggle-stream/{streamId}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::toggleStream
* @see app/Http/Controllers/Api/V1/Admission/AdmissionSettingsController.php:113
* @route '/api/v1/admission/verification/toggle-stream/{streamId}'
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
* @see \App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::toggleStream
* @see app/Http/Controllers/Api/V1/Admission/AdmissionSettingsController.php:113
* @route '/api/v1/admission/verification/toggle-stream/{streamId}'
*/
toggleStream.post = (args: { streamId: string | number } | [streamId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStream.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::toggleGlobal
* @see app/Http/Controllers/Api/V1/Admission/AdmissionSettingsController.php:80
* @route '/api/v1/admission/verification/toggle-global'
*/
export const toggleGlobal = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleGlobal.url(options),
    method: 'post',
})

toggleGlobal.definition = {
    methods: ["post"],
    url: '/api/v1/admission/verification/toggle-global',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::toggleGlobal
* @see app/Http/Controllers/Api/V1/Admission/AdmissionSettingsController.php:80
* @route '/api/v1/admission/verification/toggle-global'
*/
toggleGlobal.url = (options?: RouteQueryOptions) => {
    return toggleGlobal.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::toggleGlobal
* @see app/Http/Controllers/Api/V1/Admission/AdmissionSettingsController.php:80
* @route '/api/v1/admission/verification/toggle-global'
*/
toggleGlobal.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleGlobal.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::index
* @see app/Http/Controllers/Api/V1/Admission/AdmissionSettingsController.php:35
* @route '/api/v1/admission/verification'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/admission/verification',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::index
* @see app/Http/Controllers/Api/V1/Admission/AdmissionSettingsController.php:35
* @route '/api/v1/admission/verification'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::index
* @see app/Http/Controllers/Api/V1/Admission/AdmissionSettingsController.php:35
* @route '/api/v1/admission/verification'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::index
* @see app/Http/Controllers/Api/V1/Admission/AdmissionSettingsController.php:35
* @route '/api/v1/admission/verification'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::uploadExcel
* @see app/Http/Controllers/Api/V1/Admission/AdmissionSettingsController.php:146
* @route '/api/v1/admission/verification/upload/{streamId}'
*/
export const uploadExcel = (args: { streamId: string | number } | [streamId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadExcel.url(args, options),
    method: 'post',
})

uploadExcel.definition = {
    methods: ["post"],
    url: '/api/v1/admission/verification/upload/{streamId}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::uploadExcel
* @see app/Http/Controllers/Api/V1/Admission/AdmissionSettingsController.php:146
* @route '/api/v1/admission/verification/upload/{streamId}'
*/
uploadExcel.url = (args: { streamId: string | number } | [streamId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return uploadExcel.definition.url
            .replace('{streamId}', parsedArgs.streamId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::uploadExcel
* @see app/Http/Controllers/Api/V1/Admission/AdmissionSettingsController.php:146
* @route '/api/v1/admission/verification/upload/{streamId}'
*/
uploadExcel.post = (args: { streamId: string | number } | [streamId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadExcel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::downloadSample
* @see app/Http/Controllers/Api/V1/Admission/AdmissionSettingsController.php:228
* @route '/api/v1/admission/verification/download-sample'
*/
export const downloadSample = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadSample.url(options),
    method: 'get',
})

downloadSample.definition = {
    methods: ["get","head"],
    url: '/api/v1/admission/verification/download-sample',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::downloadSample
* @see app/Http/Controllers/Api/V1/Admission/AdmissionSettingsController.php:228
* @route '/api/v1/admission/verification/download-sample'
*/
downloadSample.url = (options?: RouteQueryOptions) => {
    return downloadSample.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::downloadSample
* @see app/Http/Controllers/Api/V1/Admission/AdmissionSettingsController.php:228
* @route '/api/v1/admission/verification/download-sample'
*/
downloadSample.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadSample.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::downloadSample
* @see app/Http/Controllers/Api/V1/Admission/AdmissionSettingsController.php:228
* @route '/api/v1/admission/verification/download-sample'
*/
downloadSample.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadSample.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::exportByStream
* @see app/Http/Controllers/Api/V1/Admission/AdmissionSettingsController.php:196
* @route '/api/v1/admission/verification/export-stream'
*/
export const exportByStream = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportByStream.url(options),
    method: 'get',
})

exportByStream.definition = {
    methods: ["get","head"],
    url: '/api/v1/admission/verification/export-stream',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::exportByStream
* @see app/Http/Controllers/Api/V1/Admission/AdmissionSettingsController.php:196
* @route '/api/v1/admission/verification/export-stream'
*/
exportByStream.url = (options?: RouteQueryOptions) => {
    return exportByStream.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::exportByStream
* @see app/Http/Controllers/Api/V1/Admission/AdmissionSettingsController.php:196
* @route '/api/v1/admission/verification/export-stream'
*/
exportByStream.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportByStream.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::exportByStream
* @see app/Http/Controllers/Api/V1/Admission/AdmissionSettingsController.php:196
* @route '/api/v1/admission/verification/export-stream'
*/
exportByStream.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportByStream.url(options),
    method: 'head',
})

const AdmissionSettingsController = { toggleStream, toggleGlobal, index, uploadExcel, downloadSample, exportByStream }

export default AdmissionSettingsController