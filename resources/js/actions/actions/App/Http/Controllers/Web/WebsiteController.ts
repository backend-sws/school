import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\WebsiteController::aboutUs
* @see app/Http/Controllers/Web/WebsiteController.php:184
* @route '/about-us'
*/
export const aboutUs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: aboutUs.url(options),
    method: 'get',
})

aboutUs.definition = {
    methods: ["get","head"],
    url: '/about-us',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\WebsiteController::aboutUs
* @see app/Http/Controllers/Web/WebsiteController.php:184
* @route '/about-us'
*/
aboutUs.url = (options?: RouteQueryOptions) => {
    return aboutUs.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\WebsiteController::aboutUs
* @see app/Http/Controllers/Web/WebsiteController.php:184
* @route '/about-us'
*/
aboutUs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: aboutUs.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\WebsiteController::aboutUs
* @see app/Http/Controllers/Web/WebsiteController.php:184
* @route '/about-us'
*/
aboutUs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: aboutUs.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\WebsiteController::contact
* @see app/Http/Controllers/Web/WebsiteController.php:251
* @route '/contact'
*/
export const contact = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contact.url(options),
    method: 'get',
})

contact.definition = {
    methods: ["get","head"],
    url: '/contact',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\WebsiteController::contact
* @see app/Http/Controllers/Web/WebsiteController.php:251
* @route '/contact'
*/
contact.url = (options?: RouteQueryOptions) => {
    return contact.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\WebsiteController::contact
* @see app/Http/Controllers/Web/WebsiteController.php:251
* @route '/contact'
*/
contact.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contact.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\WebsiteController::contact
* @see app/Http/Controllers/Web/WebsiteController.php:251
* @route '/contact'
*/
contact.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: contact.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\WebsiteController::gallery
* @see app/Http/Controllers/Web/WebsiteController.php:157
* @route '/gallery'
*/
export const gallery = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: gallery.url(options),
    method: 'get',
})

gallery.definition = {
    methods: ["get","head"],
    url: '/gallery',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\WebsiteController::gallery
* @see app/Http/Controllers/Web/WebsiteController.php:157
* @route '/gallery'
*/
gallery.url = (options?: RouteQueryOptions) => {
    return gallery.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\WebsiteController::gallery
* @see app/Http/Controllers/Web/WebsiteController.php:157
* @route '/gallery'
*/
gallery.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: gallery.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\WebsiteController::gallery
* @see app/Http/Controllers/Web/WebsiteController.php:157
* @route '/gallery'
*/
gallery.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: gallery.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\WebsiteController::approval
* @see app/Http/Controllers/Web/WebsiteController.php:260
* @route '/approval'
*/
export const approval = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: approval.url(options),
    method: 'get',
})

approval.definition = {
    methods: ["get","head"],
    url: '/approval',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\WebsiteController::approval
* @see app/Http/Controllers/Web/WebsiteController.php:260
* @route '/approval'
*/
approval.url = (options?: RouteQueryOptions) => {
    return approval.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\WebsiteController::approval
* @see app/Http/Controllers/Web/WebsiteController.php:260
* @route '/approval'
*/
approval.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: approval.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\WebsiteController::approval
* @see app/Http/Controllers/Web/WebsiteController.php:260
* @route '/approval'
*/
approval.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: approval.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\WebsiteController::academics
* @see app/Http/Controllers/Web/WebsiteController.php:270
* @route '/academics'
*/
export const academics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: academics.url(options),
    method: 'get',
})

academics.definition = {
    methods: ["get","head"],
    url: '/academics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\WebsiteController::academics
* @see app/Http/Controllers/Web/WebsiteController.php:270
* @route '/academics'
*/
academics.url = (options?: RouteQueryOptions) => {
    return academics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\WebsiteController::academics
* @see app/Http/Controllers/Web/WebsiteController.php:270
* @route '/academics'
*/
academics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: academics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\WebsiteController::academics
* @see app/Http/Controllers/Web/WebsiteController.php:270
* @route '/academics'
*/
academics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: academics.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\WebsiteController::departments
* @see app/Http/Controllers/Web/WebsiteController.php:294
* @route '/departments'
*/
export const departments = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: departments.url(options),
    method: 'get',
})

departments.definition = {
    methods: ["get","head"],
    url: '/departments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\WebsiteController::departments
* @see app/Http/Controllers/Web/WebsiteController.php:294
* @route '/departments'
*/
departments.url = (options?: RouteQueryOptions) => {
    return departments.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\WebsiteController::departments
* @see app/Http/Controllers/Web/WebsiteController.php:294
* @route '/departments'
*/
departments.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: departments.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\WebsiteController::departments
* @see app/Http/Controllers/Web/WebsiteController.php:294
* @route '/departments'
*/
departments.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: departments.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\WebsiteController::facilities
* @see app/Http/Controllers/Web/WebsiteController.php:305
* @route '/facilities'
*/
export const facilities = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: facilities.url(options),
    method: 'get',
})

facilities.definition = {
    methods: ["get","head"],
    url: '/facilities',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\WebsiteController::facilities
* @see app/Http/Controllers/Web/WebsiteController.php:305
* @route '/facilities'
*/
facilities.url = (options?: RouteQueryOptions) => {
    return facilities.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\WebsiteController::facilities
* @see app/Http/Controllers/Web/WebsiteController.php:305
* @route '/facilities'
*/
facilities.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: facilities.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\WebsiteController::facilities
* @see app/Http/Controllers/Web/WebsiteController.php:305
* @route '/facilities'
*/
facilities.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: facilities.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\WebsiteController::trainingPlacement
* @see app/Http/Controllers/Web/WebsiteController.php:315
* @route '/training-placement'
*/
export const trainingPlacement = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: trainingPlacement.url(options),
    method: 'get',
})

trainingPlacement.definition = {
    methods: ["get","head"],
    url: '/training-placement',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\WebsiteController::trainingPlacement
* @see app/Http/Controllers/Web/WebsiteController.php:315
* @route '/training-placement'
*/
trainingPlacement.url = (options?: RouteQueryOptions) => {
    return trainingPlacement.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\WebsiteController::trainingPlacement
* @see app/Http/Controllers/Web/WebsiteController.php:315
* @route '/training-placement'
*/
trainingPlacement.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: trainingPlacement.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\WebsiteController::trainingPlacement
* @see app/Http/Controllers/Web/WebsiteController.php:315
* @route '/training-placement'
*/
trainingPlacement.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: trainingPlacement.url(options),
    method: 'head',
})

const WebsiteController = { aboutUs, contact, gallery, approval, academics, departments, facilities, trainingPlacement }

export default WebsiteController