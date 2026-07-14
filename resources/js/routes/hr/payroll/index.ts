import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
 * @see routes/web.php:273
 * @route '/hr/payroll'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/hr/payroll',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:273
 * @route '/hr/payroll'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:273
 * @route '/hr/payroll'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:273
 * @route '/hr/payroll'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:273
 * @route '/hr/payroll'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:273
 * @route '/hr/payroll'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:273
 * @route '/hr/payroll'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
 * @see routes/web.php:274
 * @route '/hr/payroll/components'
 */
export const components = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: components.url(options),
    method: 'get',
})

components.definition = {
    methods: ["get","head"],
    url: '/hr/payroll/components',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:274
 * @route '/hr/payroll/components'
 */
components.url = (options?: RouteQueryOptions) => {
    return components.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:274
 * @route '/hr/payroll/components'
 */
components.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: components.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:274
 * @route '/hr/payroll/components'
 */
components.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: components.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:274
 * @route '/hr/payroll/components'
 */
    const componentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: components.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:274
 * @route '/hr/payroll/components'
 */
        componentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: components.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:274
 * @route '/hr/payroll/components'
 */
        componentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: components.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    components.form = componentsForm
/**
 * @see routes/web.php:275
 * @route '/hr/payroll/salary-structures'
 */
export const salaryStructures = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: salaryStructures.url(options),
    method: 'get',
})

salaryStructures.definition = {
    methods: ["get","head"],
    url: '/hr/payroll/salary-structures',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:275
 * @route '/hr/payroll/salary-structures'
 */
salaryStructures.url = (options?: RouteQueryOptions) => {
    return salaryStructures.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:275
 * @route '/hr/payroll/salary-structures'
 */
salaryStructures.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: salaryStructures.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:275
 * @route '/hr/payroll/salary-structures'
 */
salaryStructures.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: salaryStructures.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:275
 * @route '/hr/payroll/salary-structures'
 */
    const salaryStructuresForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: salaryStructures.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:275
 * @route '/hr/payroll/salary-structures'
 */
        salaryStructuresForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: salaryStructures.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:275
 * @route '/hr/payroll/salary-structures'
 */
        salaryStructuresForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: salaryStructures.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    salaryStructures.form = salaryStructuresForm
/**
 * @see routes/web.php:276
 * @route '/hr/payroll/{payroll}'
 */
export const runDetails = (args: { payroll: string | number } | [payroll: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: runDetails.url(args, options),
    method: 'get',
})

runDetails.definition = {
    methods: ["get","head"],
    url: '/hr/payroll/{payroll}',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:276
 * @route '/hr/payroll/{payroll}'
 */
runDetails.url = (args: { payroll: string | number } | [payroll: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    payroll: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payroll: args.payroll,
                }

    return runDetails.definition.url
            .replace('{payroll}', parsedArgs.payroll.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see routes/web.php:276
 * @route '/hr/payroll/{payroll}'
 */
runDetails.get = (args: { payroll: string | number } | [payroll: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: runDetails.url(args, options),
    method: 'get',
})
/**
 * @see routes/web.php:276
 * @route '/hr/payroll/{payroll}'
 */
runDetails.head = (args: { payroll: string | number } | [payroll: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: runDetails.url(args, options),
    method: 'head',
})

    /**
 * @see routes/web.php:276
 * @route '/hr/payroll/{payroll}'
 */
    const runDetailsForm = (args: { payroll: string | number } | [payroll: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: runDetails.url(args, options),
        method: 'get',
    })

            /**
 * @see routes/web.php:276
 * @route '/hr/payroll/{payroll}'
 */
        runDetailsForm.get = (args: { payroll: string | number } | [payroll: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: runDetails.url(args, options),
            method: 'get',
        })
            /**
 * @see routes/web.php:276
 * @route '/hr/payroll/{payroll}'
 */
        runDetailsForm.head = (args: { payroll: string | number } | [payroll: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: runDetails.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    runDetails.form = runDetailsForm
const payroll = {
    dashboard: Object.assign(dashboard, dashboard),
components: Object.assign(components, components),
salaryStructures: Object.assign(salaryStructures, salaryStructures),
runDetails: Object.assign(runDetails, runDetails),
}

export default payroll