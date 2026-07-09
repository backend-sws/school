import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::streamAsset
* @see app/Http/Controllers/Api/V1/R2/R2Controller.php:248
* @route '/api/v1/public/r2/asset'
*/
export const streamAsset = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: streamAsset.url(options),
    method: 'get',
})

streamAsset.definition = {
    methods: ["get","head"],
    url: '/api/v1/public/r2/asset',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::streamAsset
* @see app/Http/Controllers/Api/V1/R2/R2Controller.php:248
* @route '/api/v1/public/r2/asset'
*/
streamAsset.url = (options?: RouteQueryOptions) => {
    return streamAsset.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::streamAsset
* @see app/Http/Controllers/Api/V1/R2/R2Controller.php:248
* @route '/api/v1/public/r2/asset'
*/
streamAsset.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: streamAsset.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::streamAsset
* @see app/Http/Controllers/Api/V1/R2/R2Controller.php:248
* @route '/api/v1/public/r2/asset'
*/
streamAsset.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: streamAsset.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::viewUrl
* @see app/Http/Controllers/Api/V1/R2/R2Controller.php:159
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
* @see app/Http/Controllers/Api/V1/R2/R2Controller.php:159
* @route '/api/v1/r2/view-url'
*/
viewUrl.url = (options?: RouteQueryOptions) => {
    return viewUrl.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::viewUrl
* @see app/Http/Controllers/Api/V1/R2/R2Controller.php:159
* @route '/api/v1/r2/view-url'
*/
viewUrl.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: viewUrl.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::viewUrl
* @see app/Http/Controllers/Api/V1/R2/R2Controller.php:159
* @route '/api/v1/r2/view-url'
*/
viewUrl.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: viewUrl.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::proxy
* @see app/Http/Controllers/Api/V1/R2/R2Controller.php:286
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
* @see app/Http/Controllers/Api/V1/R2/R2Controller.php:286
* @route '/api/v1/r2/proxy'
*/
proxy.url = (options?: RouteQueryOptions) => {
    return proxy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::proxy
* @see app/Http/Controllers/Api/V1/R2/R2Controller.php:286
* @route '/api/v1/r2/proxy'
*/
proxy.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proxy.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::proxy
* @see app/Http/Controllers/Api/V1/R2/R2Controller.php:286
* @route '/api/v1/r2/proxy'
*/
proxy.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: proxy.url(options),
    method: 'head',
})

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
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::upload
* @see app/Http/Controllers/Api/V1/R2/R2Controller.php:190
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
* @see app/Http/Controllers/Api/V1/R2/R2Controller.php:190
* @route '/api/v1/r2/upload'
*/
upload.url = (options?: RouteQueryOptions) => {
    return upload.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\R2\R2Controller::upload
* @see app/Http/Controllers/Api/V1/R2/R2Controller.php:190
* @route '/api/v1/r2/upload'
*/
upload.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(options),
    method: 'post',
})

const R2Controller = { streamAsset, viewUrl, proxy, uploadUrl, upload }

export default R2Controller