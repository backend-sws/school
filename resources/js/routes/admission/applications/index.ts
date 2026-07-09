import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults, validateParameters } from './../../../wayfinder'
/**
 * @see routes/web.php:284
 * @route '/admission/applications/new/{step?}'
 */
export const newMethod = (args?: { step?: string | number } | [step: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: newMethod.url(args, options),
    method: 'get',
})

newMethod.definition = {
    methods: ["get","head"],
    url: '/admission/applications/new/{step?}',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:284
 * @route '/admission/applications/new/{step?}'
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
 * @see routes/web.php:284
 * @route '/admission/applications/new/{step?}'
 */
newMethod.get = (args?: { step?: string | number } | [step: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: newMethod.url(args, options),
    method: 'get',
})
/**
 * @see routes/web.php:284
 * @route '/admission/applications/new/{step?}'
 */
newMethod.head = (args?: { step?: string | number } | [step: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: newMethod.url(args, options),
    method: 'head',
})

    /**
 * @see routes/web.php:284
 * @route '/admission/applications/new/{step?}'
 */
    const newMethodForm = (args?: { step?: string | number } | [step: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: newMethod.url(args, options),
        method: 'get',
    })

            /**
 * @see routes/web.php:284
 * @route '/admission/applications/new/{step?}'
 */
        newMethodForm.get = (args?: { step?: string | number } | [step: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: newMethod.url(args, options),
            method: 'get',
        })
            /**
 * @see routes/web.php:284
 * @route '/admission/applications/new/{step?}'
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
/**
 * @see routes/web.php:287
 * @route '/admission/applications/{id}'
 */
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admission/applications/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:287
 * @route '/admission/applications/{id}'
 */
show.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see routes/web.php:287
 * @route '/admission/applications/{id}'
 */
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
 * @see routes/web.php:287
 * @route '/admission/applications/{id}'
 */
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
 * @see routes/web.php:287
 * @route '/admission/applications/{id}'
 */
    const showForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
 * @see routes/web.php:287
 * @route '/admission/applications/{id}'
 */
        showForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
 * @see routes/web.php:287
 * @route '/admission/applications/{id}'
 */
        showForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
 * @see routes/web.php:288
 * @route '/admission/applications/{id}/pay'
 */
export const pay = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pay.url(args, options),
    method: 'get',
})

pay.definition = {
    methods: ["get","head"],
    url: '/admission/applications/{id}/pay',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:288
 * @route '/admission/applications/{id}/pay'
 */
pay.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return pay.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see routes/web.php:288
 * @route '/admission/applications/{id}/pay'
 */
pay.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pay.url(args, options),
    method: 'get',
})
/**
 * @see routes/web.php:288
 * @route '/admission/applications/{id}/pay'
 */
pay.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pay.url(args, options),
    method: 'head',
})

    /**
 * @see routes/web.php:288
 * @route '/admission/applications/{id}/pay'
 */
    const payForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pay.url(args, options),
        method: 'get',
    })

            /**
 * @see routes/web.php:288
 * @route '/admission/applications/{id}/pay'
 */
        payForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pay.url(args, options),
            method: 'get',
        })
            /**
 * @see routes/web.php:288
 * @route '/admission/applications/{id}/pay'
 */
        payForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pay.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pay.form = payForm
const applications = {
    new: Object.assign(newMethod, newMethod),
show: Object.assign(show, show),
pay: Object.assign(pay, pay),
}

export default applications