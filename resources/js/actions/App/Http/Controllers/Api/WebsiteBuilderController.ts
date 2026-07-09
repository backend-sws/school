import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults, validateParameters } from './../../../../../wayfinder'
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
* @see \App\Http\Controllers\Api\WebsiteBuilderController::themes
 * @see app/Http/Controllers/Api/WebsiteBuilderController.php:20
 * @route '/api/v1/website/builder/themes'
 */
    const themesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: themes.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::themes
 * @see app/Http/Controllers/Api/WebsiteBuilderController.php:20
 * @route '/api/v1/website/builder/themes'
 */
        themesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: themes.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::themes
 * @see app/Http/Controllers/Api/WebsiteBuilderController.php:20
 * @route '/api/v1/website/builder/themes'
 */
        themesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: themes.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    themes.form = themesForm
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
* @see \App\Http\Controllers\Api\WebsiteBuilderController::activateTheme
 * @see app/Http/Controllers/Api/WebsiteBuilderController.php:30
 * @route '/api/v1/website/builder/themes/activate'
 */
    const activateThemeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: activateTheme.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::activateTheme
 * @see app/Http/Controllers/Api/WebsiteBuilderController.php:30
 * @route '/api/v1/website/builder/themes/activate'
 */
        activateThemeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: activateTheme.url(options),
            method: 'post',
        })
    
    activateTheme.form = activateThemeForm
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
* @see \App\Http\Controllers\Api\WebsiteBuilderController::sections
 * @see app/Http/Controllers/Api/WebsiteBuilderController.php:47
 * @route '/api/v1/website/builder/sections/{page?}'
 */
    const sectionsForm = (args?: { page?: string | number } | [page: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: sections.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::sections
 * @see app/Http/Controllers/Api/WebsiteBuilderController.php:47
 * @route '/api/v1/website/builder/sections/{page?}'
 */
        sectionsForm.get = (args?: { page?: string | number } | [page: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sections.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::sections
 * @see app/Http/Controllers/Api/WebsiteBuilderController.php:47
 * @route '/api/v1/website/builder/sections/{page?}'
 */
        sectionsForm.head = (args?: { page?: string | number } | [page: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sections.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    sections.form = sectionsForm
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
* @see \App\Http\Controllers\Api\WebsiteBuilderController::reorderSections
 * @see app/Http/Controllers/Api/WebsiteBuilderController.php:57
 * @route '/api/v1/website/builder/sections/{page}/reorder'
 */
    const reorderSectionsForm = (args: { page: string | number } | [page: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reorderSections.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::reorderSections
 * @see app/Http/Controllers/Api/WebsiteBuilderController.php:57
 * @route '/api/v1/website/builder/sections/{page}/reorder'
 */
        reorderSectionsForm.post = (args: { page: string | number } | [page: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reorderSections.url(args, options),
            method: 'post',
        })
    
    reorderSections.form = reorderSectionsForm
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
* @see \App\Http\Controllers\Api\WebsiteBuilderController::toggleSection
 * @see app/Http/Controllers/Api/WebsiteBuilderController.php:77
 * @route '/api/v1/website/builder/sections/{page}/{section}'
 */
    const toggleSectionForm = (args: { page: string | number, section: string | number } | [page: string | number, section: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleSection.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::toggleSection
 * @see app/Http/Controllers/Api/WebsiteBuilderController.php:77
 * @route '/api/v1/website/builder/sections/{page}/{section}'
 */
        toggleSectionForm.patch = (args: { page: string | number, section: string | number } | [page: string | number, section: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleSection.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleSection.form = toggleSectionForm
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
* @see \App\Http\Controllers\Api\WebsiteBuilderController::getNavConfig
 * @see app/Http/Controllers/Api/WebsiteBuilderController.php:95
 * @route '/api/v1/website/builder/nav'
 */
    const getNavConfigForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getNavConfig.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::getNavConfig
 * @see app/Http/Controllers/Api/WebsiteBuilderController.php:95
 * @route '/api/v1/website/builder/nav'
 */
        getNavConfigForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getNavConfig.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::getNavConfig
 * @see app/Http/Controllers/Api/WebsiteBuilderController.php:95
 * @route '/api/v1/website/builder/nav'
 */
        getNavConfigForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getNavConfig.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getNavConfig.form = getNavConfigForm
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

    /**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::saveNavConfig
 * @see app/Http/Controllers/Api/WebsiteBuilderController.php:105
 * @route '/api/v1/website/builder/nav'
 */
    const saveNavConfigForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: saveNavConfig.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\WebsiteBuilderController::saveNavConfig
 * @see app/Http/Controllers/Api/WebsiteBuilderController.php:105
 * @route '/api/v1/website/builder/nav'
 */
        saveNavConfigForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: saveNavConfig.url(options),
            method: 'post',
        })
    
    saveNavConfig.form = saveNavConfigForm
const WebsiteBuilderController = { themes, activateTheme, sections, reorderSections, toggleSection, getNavConfig, saveNavConfig }

export default WebsiteBuilderController