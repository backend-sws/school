import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults, validateParameters } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::themes
* @see app/Http/Controllers/Api/WebsiteBuilderController.php:20
* @route '/api/v1/website/builder/themes'
*/
export const themes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: themes.url(options),
    method: 'get',
})

themes.definition = {
    methods: ["get","head"],
    url: '/api/v1/website/builder/themes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::themes
* @see app/Http/Controllers/Api/WebsiteBuilderController.php:20
* @route '/api/v1/website/builder/themes'
*/
themes.url = (options?: RouteQueryOptions) => {
    return themes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::themes
* @see app/Http/Controllers/Api/WebsiteBuilderController.php:20
* @route '/api/v1/website/builder/themes'
*/
themes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: themes.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::themes
* @see app/Http/Controllers/Api/WebsiteBuilderController.php:20
* @route '/api/v1/website/builder/themes'
*/
themes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: themes.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::activateTheme
* @see app/Http/Controllers/Api/WebsiteBuilderController.php:30
* @route '/api/v1/website/builder/themes/activate'
*/
export const activateTheme = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activateTheme.url(options),
    method: 'post',
})

activateTheme.definition = {
    methods: ["post"],
    url: '/api/v1/website/builder/themes/activate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::activateTheme
* @see app/Http/Controllers/Api/WebsiteBuilderController.php:30
* @route '/api/v1/website/builder/themes/activate'
*/
activateTheme.url = (options?: RouteQueryOptions) => {
    return activateTheme.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::activateTheme
* @see app/Http/Controllers/Api/WebsiteBuilderController.php:30
* @route '/api/v1/website/builder/themes/activate'
*/
activateTheme.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activateTheme.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::sections
* @see app/Http/Controllers/Api/WebsiteBuilderController.php:47
* @route '/api/v1/website/builder/sections/{page?}'
*/
export const sections = (args?: { page?: string | number } | [page: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sections.url(args, options),
    method: 'get',
})

sections.definition = {
    methods: ["get","head"],
    url: '/api/v1/website/builder/sections/{page?}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::sections
* @see app/Http/Controllers/Api/WebsiteBuilderController.php:47
* @route '/api/v1/website/builder/sections/{page?}'
*/
sections.url = (args?: { page?: string | number } | [page: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { page: args }
    }

    if (Array.isArray(args)) {
        args = {
            page: args[0],
        }
    }

    args = applyUrlDefaults(args)

    validateParameters(args, [
        "page",
    ])

    const parsedArgs = {
        page: args?.page,
    }

    return sections.definition.url
            .replace('{page?}', parsedArgs.page?.toString() ?? '')
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::sections
* @see app/Http/Controllers/Api/WebsiteBuilderController.php:47
* @route '/api/v1/website/builder/sections/{page?}'
*/
sections.get = (args?: { page?: string | number } | [page: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sections.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::sections
* @see app/Http/Controllers/Api/WebsiteBuilderController.php:47
* @route '/api/v1/website/builder/sections/{page?}'
*/
sections.head = (args?: { page?: string | number } | [page: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sections.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::reorderSections
* @see app/Http/Controllers/Api/WebsiteBuilderController.php:57
* @route '/api/v1/website/builder/sections/{page}/reorder'
*/
export const reorderSections = (args: { page: string | number } | [page: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorderSections.url(args, options),
    method: 'post',
})

reorderSections.definition = {
    methods: ["post"],
    url: '/api/v1/website/builder/sections/{page}/reorder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::reorderSections
* @see app/Http/Controllers/Api/WebsiteBuilderController.php:57
* @route '/api/v1/website/builder/sections/{page}/reorder'
*/
reorderSections.url = (args: { page: string | number } | [page: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { page: args }
    }

    if (Array.isArray(args)) {
        args = {
            page: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        page: args.page,
    }

    return reorderSections.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::reorderSections
* @see app/Http/Controllers/Api/WebsiteBuilderController.php:57
* @route '/api/v1/website/builder/sections/{page}/reorder'
*/
reorderSections.post = (args: { page: string | number } | [page: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorderSections.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::toggleSection
* @see app/Http/Controllers/Api/WebsiteBuilderController.php:77
* @route '/api/v1/website/builder/sections/{page}/{section}'
*/
export const toggleSection = (args: { page: string | number, section: string | number } | [page: string | number, section: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleSection.url(args, options),
    method: 'patch',
})

toggleSection.definition = {
    methods: ["patch"],
    url: '/api/v1/website/builder/sections/{page}/{section}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::toggleSection
* @see app/Http/Controllers/Api/WebsiteBuilderController.php:77
* @route '/api/v1/website/builder/sections/{page}/{section}'
*/
toggleSection.url = (args: { page: string | number, section: string | number } | [page: string | number, section: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            page: args[0],
            section: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        page: args.page,
        section: args.section,
    }

    return toggleSection.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace('{section}', parsedArgs.section.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::toggleSection
* @see app/Http/Controllers/Api/WebsiteBuilderController.php:77
* @route '/api/v1/website/builder/sections/{page}/{section}'
*/
toggleSection.patch = (args: { page: string | number, section: string | number } | [page: string | number, section: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleSection.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::getNavConfig
* @see app/Http/Controllers/Api/WebsiteBuilderController.php:95
* @route '/api/v1/website/builder/nav'
*/
export const getNavConfig = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getNavConfig.url(options),
    method: 'get',
})

getNavConfig.definition = {
    methods: ["get","head"],
    url: '/api/v1/website/builder/nav',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::getNavConfig
* @see app/Http/Controllers/Api/WebsiteBuilderController.php:95
* @route '/api/v1/website/builder/nav'
*/
getNavConfig.url = (options?: RouteQueryOptions) => {
    return getNavConfig.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::getNavConfig
* @see app/Http/Controllers/Api/WebsiteBuilderController.php:95
* @route '/api/v1/website/builder/nav'
*/
getNavConfig.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getNavConfig.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::getNavConfig
* @see app/Http/Controllers/Api/WebsiteBuilderController.php:95
* @route '/api/v1/website/builder/nav'
*/
getNavConfig.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getNavConfig.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::saveNavConfig
* @see app/Http/Controllers/Api/WebsiteBuilderController.php:105
* @route '/api/v1/website/builder/nav'
*/
export const saveNavConfig = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveNavConfig.url(options),
    method: 'post',
})

saveNavConfig.definition = {
    methods: ["post"],
    url: '/api/v1/website/builder/nav',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::saveNavConfig
* @see app/Http/Controllers/Api/WebsiteBuilderController.php:105
* @route '/api/v1/website/builder/nav'
*/
saveNavConfig.url = (options?: RouteQueryOptions) => {
    return saveNavConfig.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::saveNavConfig
* @see app/Http/Controllers/Api/WebsiteBuilderController.php:105
* @route '/api/v1/website/builder/nav'
*/
saveNavConfig.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveNavConfig.url(options),
    method: 'post',
})

const WebsiteBuilderController = { themes, activateTheme, sections, reorderSections, toggleSection, getNavConfig, saveNavConfig }

export default WebsiteBuilderController