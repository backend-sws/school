import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::streamAsset
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:251
 * @route '/api/v1/public/r2/asset'
 */
const streamAssetde3fb31e32c113c0f12e24c17f04784a = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: streamAssetde3fb31e32c113c0f12e24c17f04784a.url(options),
    method: 'get',
})

streamAssetde3fb31e32c113c0f12e24c17f04784a.definition = {
    methods: ["get","head"],
    url: '/api/v1/public/r2/asset',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::streamAsset
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:251
 * @route '/api/v1/public/r2/asset'
 */
streamAssetde3fb31e32c113c0f12e24c17f04784a.url = (options?: RouteQueryOptions) => {
    return streamAssetde3fb31e32c113c0f12e24c17f04784a.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::streamAsset
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:251
 * @route '/api/v1/public/r2/asset'
 */
streamAssetde3fb31e32c113c0f12e24c17f04784a.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: streamAssetde3fb31e32c113c0f12e24c17f04784a.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::streamAsset
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:251
 * @route '/api/v1/public/r2/asset'
 */
streamAssetde3fb31e32c113c0f12e24c17f04784a.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: streamAssetde3fb31e32c113c0f12e24c17f04784a.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::streamAsset
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:251
 * @route '/api/v1/public/r2/asset'
 */
    const streamAssetde3fb31e32c113c0f12e24c17f04784aForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: streamAssetde3fb31e32c113c0f12e24c17f04784a.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::streamAsset
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:251
 * @route '/api/v1/public/r2/asset'
 */
        streamAssetde3fb31e32c113c0f12e24c17f04784aForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: streamAssetde3fb31e32c113c0f12e24c17f04784a.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::streamAsset
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:251
 * @route '/api/v1/public/r2/asset'
 */
        streamAssetde3fb31e32c113c0f12e24c17f04784aForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: streamAssetde3fb31e32c113c0f12e24c17f04784a.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    streamAssetde3fb31e32c113c0f12e24c17f04784a.form = streamAssetde3fb31e32c113c0f12e24c17f04784aForm
    /**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::streamAsset
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:251
 * @route '/api/v1/public/public/r2/asset'
 */
const streamAssetbcbed740a653411fbdd076ceb23b004c = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: streamAssetbcbed740a653411fbdd076ceb23b004c.url(options),
    method: 'get',
})

streamAssetbcbed740a653411fbdd076ceb23b004c.definition = {
    methods: ["get","head"],
    url: '/api/v1/public/public/r2/asset',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::streamAsset
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:251
 * @route '/api/v1/public/public/r2/asset'
 */
streamAssetbcbed740a653411fbdd076ceb23b004c.url = (options?: RouteQueryOptions) => {
    return streamAssetbcbed740a653411fbdd076ceb23b004c.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::streamAsset
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:251
 * @route '/api/v1/public/public/r2/asset'
 */
streamAssetbcbed740a653411fbdd076ceb23b004c.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: streamAssetbcbed740a653411fbdd076ceb23b004c.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::streamAsset
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:251
 * @route '/api/v1/public/public/r2/asset'
 */
streamAssetbcbed740a653411fbdd076ceb23b004c.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: streamAssetbcbed740a653411fbdd076ceb23b004c.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::streamAsset
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:251
 * @route '/api/v1/public/public/r2/asset'
 */
    const streamAssetbcbed740a653411fbdd076ceb23b004cForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: streamAssetbcbed740a653411fbdd076ceb23b004c.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::streamAsset
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:251
 * @route '/api/v1/public/public/r2/asset'
 */
        streamAssetbcbed740a653411fbdd076ceb23b004cForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: streamAssetbcbed740a653411fbdd076ceb23b004c.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::streamAsset
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:251
 * @route '/api/v1/public/public/r2/asset'
 */
        streamAssetbcbed740a653411fbdd076ceb23b004cForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: streamAssetbcbed740a653411fbdd076ceb23b004c.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    streamAssetbcbed740a653411fbdd076ceb23b004c.form = streamAssetbcbed740a653411fbdd076ceb23b004cForm

/**
* Multiple routes resolve to \App\Http\Controllers\Api\V1\R2\R2Controller::streamAsset, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `streamAsset['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const streamAsset = {
    '/api/v1/public/r2/asset': streamAssetde3fb31e32c113c0f12e24c17f04784a,
    '/api/v1/public/public/r2/asset': streamAssetbcbed740a653411fbdd076ceb23b004c,
}

/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::viewUrl
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:160
 * @route '/api/v1/r2/view-url'
 */
export const viewUrl = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: viewUrl.url(options),
    method: 'get',
})

viewUrl.definition = {
    methods: ["get","head"],
    url: '/api/v1/r2/view-url',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::viewUrl
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:160
 * @route '/api/v1/r2/view-url'
 */
viewUrl.url = (options?: RouteQueryOptions) => {
    return viewUrl.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::viewUrl
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:160
 * @route '/api/v1/r2/view-url'
 */
viewUrl.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: viewUrl.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::viewUrl
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:160
 * @route '/api/v1/r2/view-url'
 */
viewUrl.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: viewUrl.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::viewUrl
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:160
 * @route '/api/v1/r2/view-url'
 */
    const viewUrlForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: viewUrl.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::viewUrl
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:160
 * @route '/api/v1/r2/view-url'
 */
        viewUrlForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: viewUrl.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::viewUrl
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:160
 * @route '/api/v1/r2/view-url'
 */
        viewUrlForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: viewUrl.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    viewUrl.form = viewUrlForm
/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::proxy
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:301
 * @route '/api/v1/r2/proxy'
 */
export const proxy = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proxy.url(options),
    method: 'get',
})

proxy.definition = {
    methods: ["get","head"],
    url: '/api/v1/r2/proxy',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::proxy
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:301
 * @route '/api/v1/r2/proxy'
 */
proxy.url = (options?: RouteQueryOptions) => {
    return proxy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::proxy
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:301
 * @route '/api/v1/r2/proxy'
 */
proxy.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proxy.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::proxy
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:301
 * @route '/api/v1/r2/proxy'
 */
proxy.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: proxy.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::proxy
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:301
 * @route '/api/v1/r2/proxy'
 */
    const proxyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: proxy.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::proxy
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:301
 * @route '/api/v1/r2/proxy'
 */
        proxyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: proxy.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::proxy
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:301
 * @route '/api/v1/r2/proxy'
 */
        proxyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: proxy.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    proxy.form = proxyForm
/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::uploadUrl
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:90
 * @route '/api/v1/r2/upload-url'
 */
export const uploadUrl = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadUrl.url(options),
    method: 'post',
})

uploadUrl.definition = {
    methods: ["post"],
    url: '/api/v1/r2/upload-url',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::uploadUrl
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:90
 * @route '/api/v1/r2/upload-url'
 */
uploadUrl.url = (options?: RouteQueryOptions) => {
    return uploadUrl.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::uploadUrl
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:90
 * @route '/api/v1/r2/upload-url'
 */
uploadUrl.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadUrl.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::uploadUrl
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:90
 * @route '/api/v1/r2/upload-url'
 */
    const uploadUrlForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadUrl.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::uploadUrl
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:90
 * @route '/api/v1/r2/upload-url'
 */
        uploadUrlForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadUrl.url(options),
            method: 'post',
        })
    
    uploadUrl.form = uploadUrlForm
/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::upload
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:191
 * @route '/api/v1/r2/upload'
 */
export const upload = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(options),
    method: 'post',
})

upload.definition = {
    methods: ["post"],
    url: '/api/v1/r2/upload',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::upload
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:191
 * @route '/api/v1/r2/upload'
 */
upload.url = (options?: RouteQueryOptions) => {
    return upload.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::upload
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:191
 * @route '/api/v1/r2/upload'
 */
upload.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::upload
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:191
 * @route '/api/v1/r2/upload'
 */
    const uploadForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: upload.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::upload
 * @see app/Http/Controllers/Api/V1/R2/R2Controller.php:191
 * @route '/api/v1/r2/upload'
 */
        uploadForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: upload.url(options),
            method: 'post',
        })
    
    upload.form = uploadForm
const R2Controller = { streamAsset, viewUrl, proxy, uploadUrl, upload }

export default R2Controller