import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults, validateParameters } from './../../../wayfinder'
/**
 * @see routes/web.php:321
 * @route '/admission/readmissions/new/{step?}'
 */
export const newMethod = (args?: { step?: string | number } | [step: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: newMethod.url(args, options),
    method: 'get',
})

newMethod.definition = {
    methods: ["get","head"],
    url: '/admission/readmissions/new/{step?}',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:321
 * @route '/admission/readmissions/new/{step?}'
 */
newMethod.url = (args?: { step?: string | number } | [step: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { step: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    step: args[0],
                }
    }

    args = applyUrlDefaults(args)

    validateParameters(args, [
            "step",
        ])

    const parsedArgs = {
                        step: args?.step,
                }

    return newMethod.definition.url
            .replace('{step?}', parsedArgs.step?.toString() ?? '')
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see routes/web.php:321
 * @route '/admission/readmissions/new/{step?}'
 */
newMethod.get = (args?: { step?: string | number } | [step: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: newMethod.url(args, options),
    method: 'get',
})
/**
 * @see routes/web.php:321
 * @route '/admission/readmissions/new/{step?}'
 */
newMethod.head = (args?: { step?: string | number } | [step: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: newMethod.url(args, options),
    method: 'head',
})

    /**
 * @see routes/web.php:321
 * @route '/admission/readmissions/new/{step?}'
 */
    const newMethodForm = (args?: { step?: string | number } | [step: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: newMethod.url(args, options),
        method: 'get',
    })

            /**
 * @see routes/web.php:321
 * @route '/admission/readmissions/new/{step?}'
 */
        newMethodForm.get = (args?: { step?: string | number } | [step: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: newMethod.url(args, options),
            method: 'get',
        })
            /**
 * @see routes/web.php:321
 * @route '/admission/readmissions/new/{step?}'
 */
        newMethodForm.head = (args?: { step?: string | number } | [step: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: newMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    newMethod.form = newMethodForm
const readmissions = {
    new: Object.assign(newMethod, newMethod),
}

export default readmissions