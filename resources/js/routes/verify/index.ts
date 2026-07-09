import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
 * @see routes/web.php:25
 * @route '/verify/id-card/{token}'
 */
export const idCard = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: idCard.url(args, options),
    method: 'get',
})

idCard.definition = {
    methods: ["get","head"],
    url: '/verify/id-card/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:25
 * @route '/verify/id-card/{token}'
 */
idCard.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    token: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        token: args.token,
                }

    return idCard.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see routes/web.php:25
 * @route '/verify/id-card/{token}'
 */
idCard.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: idCard.url(args, options),
    method: 'get',
})
/**
 * @see routes/web.php:25
 * @route '/verify/id-card/{token}'
 */
idCard.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: idCard.url(args, options),
    method: 'head',
})

    /**
 * @see routes/web.php:25
 * @route '/verify/id-card/{token}'
 */
    const idCardForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: idCard.url(args, options),
        method: 'get',
    })

            /**
 * @see routes/web.php:25
 * @route '/verify/id-card/{token}'
 */
        idCardForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: idCard.url(args, options),
            method: 'get',
        })
            /**
 * @see routes/web.php:25
 * @route '/verify/id-card/{token}'
 */
        idCardForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: idCard.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    idCard.form = idCardForm
const verify = {
    idCard: Object.assign(idCard, idCard),
}

export default verify