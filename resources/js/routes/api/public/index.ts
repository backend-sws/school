import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
 * @see routes/api.php:71
 * @route '/api/v1/public/institution-logo'
 */
export const institutionLogo = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: institutionLogo.url(options),
    method: 'get',
})

institutionLogo.definition = {
    methods: ["get","head"],
    url: '/api/v1/public/institution-logo',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/api.php:71
 * @route '/api/v1/public/institution-logo'
 */
institutionLogo.url = (options?: RouteQueryOptions) => {
    return institutionLogo.definition.url + queryParams(options)
}

/**
 * @see routes/api.php:71
 * @route '/api/v1/public/institution-logo'
 */
institutionLogo.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: institutionLogo.url(options),
    method: 'get',
})
/**
 * @see routes/api.php:71
 * @route '/api/v1/public/institution-logo'
 */
institutionLogo.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: institutionLogo.url(options),
    method: 'head',
})

    /**
 * @see routes/api.php:71
 * @route '/api/v1/public/institution-logo'
 */
    const institutionLogoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: institutionLogo.url(options),
        method: 'get',
    })

            /**
 * @see routes/api.php:71
 * @route '/api/v1/public/institution-logo'
 */
        institutionLogoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: institutionLogo.url(options),
            method: 'get',
        })
            /**
 * @see routes/api.php:71
 * @route '/api/v1/public/institution-logo'
 */
        institutionLogoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: institutionLogo.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    institutionLogo.form = institutionLogoForm
const publicMethod = {
    institutionLogo: Object.assign(institutionLogo, institutionLogo),
}

export default publicMethod